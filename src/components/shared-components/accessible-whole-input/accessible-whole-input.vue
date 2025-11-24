<template>
  <div>
    <label v-if="!isCheckable" :for="id" :class="labelClass" data-tmp>
      {{ label }}
      <RequiredStr :required="required" :required-rev="requiredRev" />
    </label>
    <span v-else-if="showLabel" :id="id" :class="labelClass">
      {{ label }}
      <RequiredStr :required="required" :required-rev="requiredRev" />
    </span>

    <!-- START: help-msg (top) -->
    <div v-if="(_hasHelp === true && helpFirst === true)" :class="helpClass" :id="getID('help')">
      <slot name="help"><p class="mb-0">{{ help }}</p></slot>
    </div>
    <!-- START: help-msg (top) -->

    <!-- START: error-msg -->
    <ErrorMsg
      v-if="(_showError === true || externalInvalid === true)
        && (_hasError === true || extraError !== '')"
      aria-live="polite"
      :external-invalid="externalInvalid"
      :extra-error="extraError"
      :has-error="_hasError"
      :id="getID('error')"
      :key="_errorChange"
      :show-error="_showError"
      :text="_errorMsg">
      <slot v-if="extraError === ''" name="error"></slot>
    </ErrorMsg>
    <!--  END:  error-msg -->

    <div
        v-on:blur="onBlur"
        v-on:change="onChange"
        v-on:focus="onFocus"
        v-on:input="onInput">
      <!-- START: field -->
      <slot></slot>
      <!--  END:  field -->
    </div>

    <!-- START: help-msg (bottom) -->
    <div v-if="(_hasHelp === true && helpFirst === false)" :class="helpClass" :id="getID('help')">
      <slot name="help"><p>{{ helpTxt }}</p></slot>
    </div>
    <!--  END:  help-msg (bottom) -->
  </div>
</template>

<script setup>
import { onBeforeMount, ref, useSlots, watch } from 'vue';
import { hasContent } from '../../../utils/vue-utils';
import ConsoleLogger from '../../../utils/ConsoleLogger.class';
import ErrorMsg from './ErrorMsg.vue';
import RequiredStr from './RequiredStr.vue';

// --------------------------------------------------
// START: Vue utils

const slots = useSlots();

//  END:  Vue utils
// --------------------------------------------------
// START: Emitted events

const emit = defineEmits(['updateDescByIDs']);

//  END:  Emitted events
// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * Error message to show the user when the value of the field is
   * invalid
   *
   * > __Note:__ If the field is marked as `required` an empty
   * >       value will also cause the error message to show.
   *
   * > __Note also:__ If you need to include HTML (e.g. a link)
   * >       in the error message use the "error" slot instead.
   *
   * @property {string} errorMsg
   */
  errorMsg: { type: String, required: false, default: '' },

  /**
   * A function that outputs an error message string when different
   * messages are required for different types of errors.
   *
   * > __Note:__ If both `error-msg-func` and `error-msg` attributes
   * >       are present `errorMsgFunc` will be used and `errorMsg`
   * >       will be ignored.
   */
  errorMsgFunc: { type: Function, required: false, default: null },

  /**
   * Whether or not this field has been marked as invalid due to
   * (addional) external rules
   *
   * e.g. User must enter either a mobile phone number or a land
   *    line number.
   *    If both are empty then both fields must be marked as
   *    invalid.
   *
   * @property {boolean} externalInvalid
   */
  externalInvalid: { type: Boolean, required: false, default: false },

  /**
   * ID of the field being rendered
   *
   * Used to link the field to its label, error message and help
   * text
   *
   * > __Note:__ If id is undefined or empty, an error will be thrown
   *
   * @property {string} id
   */
  id: { type: String, required: true },

  group: { type: Boolean, required: false, default: false },

  /**
   * Whether or not to render help text before or after input field
   *
   * @property {boolean} helpFirst
   */
  helpFirst: { type: Boolean, required: false, default: false },

  /**
   * Help text to show the user to make the purpose or
   * requirements of the field clear
   *
   * > __Note:__ If you need to include HTML (e.g. a link) in the
   * >       error message use the "help" slot instead.
   *
   * @property {string} helpTxt
   */
  help: { type: String, required: false, default: '' },

  /**
   * Whether or not to hide the label from screen.
   * (Label is still visible to screen readers)
   *
   * Sometimes a design uses non-standard format for input fields
   * and their labels.
   * e.g. When the (visible) label for a field is use in such away
   *    that the input field's value forms first part of a
   *    sentance and the label form the rest of the sentance.
   *    In this case the screen reader usage of the label may
   *    not make any sense. In this case, we use the `help-txt`
   *    value as the visible label and hide the field's actual
   *    label from screen users.
   *
   * @property {boolean} hideLabel
   */
  hideLabel: { type: Boolean, required: false, default: false },

  /**
   * Text to label the field
   *
   * This is an accessiblity requirement.
   *
   * > __Note:__ If label is undefined or empty, an error will
   * >       be thrown
   *
   * (See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)
   * for more info)
   *
   * @property {string} label
   */
  label: { type: String, required: true },

  required: { type: Boolean, required: false, default: false },

  /**
   * Whether or not render "(optional)" when input is optional,
   * instead of "(required)" when it's required.
   *
   * > __Note:__ This is a __VERY BAD__ pattern, however, my
   * >       current use-case requires it until we can have
   * >       it reversed...
   *
   * Render "(optional)" when the field is optional and blank when
   * it is required, instead of the conventional approach which is
   * to render blank when input is optional and "(required)" when
   * it's required.
   *
   * @property {boolean} requiredRev
   */
  requiredRev: { type: Boolean, required: false, default: false },

  validateOnInput: { type: Boolean, required: false, default: false },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local constants

//  END:  Local constants
// --------------------------------------------------
// START: Local state

const _cLog = ref(null);

const _currentValue = ref('');

const _errorChange = ref(0);
const _errorMsg = ref('');
const _hasError = ref(false);
const _hadFocus = ref(false);
const _hasHelp = ref(false);
const _showError = ref(false);
const _descByIDs = ref(undefined);

//  END:  Local state
// --------------------------------------------------
// START: Computed helpers

/**
 * Get the custom ID (or `for` attribute) for a given element
 *
 * @param {string|undefined} suffix Custom suffix for the ID
 *
 * @returns {string} custom ID (or `for` attribute) value
 */
const getID = (suffix) => { // eslint-disable-line arrow-body-style
  return (typeof suffix === 'string' && suffix !== '')
    ? `${props.id}--${suffix}`
    : props.id;
};

//  END:  Computed helpers
// --------------------------------------------------
// START: Computed properties

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

const _setDescByIDs = () => {
  let output = '';
  let sep = '';

  if (_showError.value === true || _hasError.value === true) {
    output += sep + getID('error');
    sep = ' ';
  }
  if (_hasHelp.value === true)  {
    output += sep + getID('help');
    sep = ' ';
  }

  if (output !== _descByIDs.value) {
    _descByIDs.value = output;

    emit('updateDescByIDs', _descByIDs.value);
  }
}

const _initClog = () => {
  if (_cLog.value === null) {
    _cLog.value = new ConsoleLogger(
      '<whole-input-field>',
      props.id,
      {
        props,
        refs: {
          _currentValue,
          _errorChange,
          _errorMsg,
          _hasError,
          _hadFocus,
          _showError,
        }
      },
    );
  }
};

/**
 *
 * @param {HTMLInputElement} target
 */
const _updateErrorMsg = (event) => {
  _cLog.value.before(
    '_updateErrorMsg',
    {
      local: { event },
      refs: ['_errorMsg', '_showError', '_errorChange'],
    },
  );
  const oldShow = _showError.value;

  if (typeof event === 'boolean') {
    _showError.value = event;
  } else if (typeof props.errorMsgFunc === 'function') {
    _errorMsg.value = props.errorMsgFunc(event.target);
    _showError.value = (_errorMsg !== '');
  } else if (event.target.checkValidity() === false) {
    _errorMsg.value = (props.errorMsg !== '')
      ? props.errorMsg
      : event.target.validationMessage;
    _showError.value = (_errorMsg !== '');
  } else {
    _errorMsg.value = '';
    _showError.value = false;
  }

  if (oldShow !== _showError) {
    _errorChange.value = Date.now();
    _setDescByIDs();
  }
  _cLog.value.after(
    '_updateErrorMsg',
    { refs: ['_errorMsg', '_showError', '_errorChange'] },
  );
}

const _setHasError = () => {
  const oldHasError = _hasError.value;

  // Do we have an error message to show the user?
  _hasError.value = hasContent(slots, props, 'error', 'errorMsg') || customErr.value !== '';
  _errorMsg = props.errorMsg;

  if (oldHasError !== _hasError) {
    _errorChange.value = Date.now();
    _setDescByIDs();
  }
}

//  END:  Local methods
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(() => {
  _initClog();

  // Do we have a help text block to show the user?
  _hasHelp.value = hasContent(slots, props, 'help');
  _setDescByIDs();
})

//  END:  Lifecycle events
// --------------------------------------------------
// START: Watcher methods

watch(() => props.externalInvalid, _setHasError);

//  END:  Watcher methods
// --------------------------------------------------
// START: Event handlers

const onBlur = (event) => {
  _cLog.value.before('onBlur', { local: { event }, refs: ['_hadFocus'] });
  _hadFocus.value = true;
  _cLog.value.after('onBlur', { refs: ['_hadFocus'] });
}

const onChange = (event) => {
  _cLog.value.before('onChange', { local: { event }, refs: ['_hadFocus'] });
  _hadFocus.value = true;
  _currentValue.value = event.target.value;

  _updateErrorMsg(event);

  _cLog.value.after('onChange', { refs: ['_hadFocus'] });
}

const onFocus = (event) => {
  _cLog.value.before('onFocus', { local: { event }, refs: ['_hadFocus'] });
  _hadFocus.value = true;
  _cLog.value.after('onFocus', { refs: ['_hadFocus'] });
}

const onInput = (event) => {
  _cLog.value.before('onInput', { local: { event }, refs: ['_hadFocus'] });

  _hadFocus.value = true;

  if (props.validateOnInput === true) {
    _updateErrorMsg(event);
  }

  _cLog.value.after('onInput', { refs: ['_hadFocus'] });
}

//  END:  Event handlers
// --------------------------------------------------
</script>

<style scoped>
</style>
