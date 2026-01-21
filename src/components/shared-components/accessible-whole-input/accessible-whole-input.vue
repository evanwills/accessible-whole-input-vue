<template>
  <component :class="wrapClass" :is="tag" ref="wrapperTag">
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
      <slot name="help"><p>{{ helpText }}</p></slot>
    </div>
    <!--  END:  help-msg (bottom) -->
  </component>
</template>

<script setup>
import { computed, onBeforeMount, ref, useSlots, watch } from 'vue';
import { hasContent } from '../../../utils/vue-utils';
import ConsoleLogger from '../../../utils/ConsoleLoggerDummy.class';
import ExternalBlur from '../../../utils/ExternalBlur.class';
import ErrorMsg from './ErrorMsg.vue';
import RequiredStr from './RequiredStr.vue';
import { getWrapperProps } from './accessible-whole-input.utils';

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
  ...getWrapperProps(),

  /**
   * Whether or not the input is checkable
   * (i.e. checkbox or radio input)
   */
  isCheckable: { type: Boolean, required: false, default: false },
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

const wrapperTag = ref(null);
const _blurWatcher = ref(null);

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

const helpClass = computed(
  () => 'text-body-md text-grey-600 w-full max-w-md',
);

const labelClass = computed(() => {
  let output = (props.largeLabel === true)
    ? 'text-bold-lg'
    : 'text-bold-md';

  if (props.hideLabel === true) {
    output += ' sr-only';
  }

  return `${output} box-border block`;
});

const wrapClass = computed(() => {
  const tmp = 'whole-input';
  const output = (props.isCheckable === true)
    ? `${tmp}--checkable`
    : '';

  return `${tmp} ${output} flex flex-col gap-2`;
});

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
      '<accessible-whole-input>',
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
      false
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
    _showError.value = (_errorMsg.value !== '');
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
  _errorMsg.value = props.errorMsg;

  if (oldHasError !== _hasError.value) {
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

  if (props.watchBlur === true) {
    if (_blurWatcher.value === null && wrapperTag.value !== null) {
      _blurWatcher.value = new ExternalBlur(
        wrapperTag.value,
        `${props.id}-wrapper`,
        {
          autoUnset: true,
          collapsed: false,
          doConsole: true,
          listen: true,
        },
      );
    }

    if (_blurWatcher.listening === false) {
      _blurWatcher.listen();
    }
  }
  _cLog.value.after('onFocus', { refs: ['_hadFocus'] });
}

const onInput = (event) => {
  _cLog.value.before('onInput', { local: { event }, refs: ['_hadFocus'] });

  _hadFocus.value = true;

  if (_)

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
