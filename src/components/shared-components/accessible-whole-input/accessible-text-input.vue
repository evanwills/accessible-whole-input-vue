<template>
  <AccessibleWholeInput
    :error-msg="errorMsg"
    :error-msg-func="errorMsgFunc"
    :external-invalid="externalInvalid"
    :id="id"
    :help="help"
    :help-first="helpFirst"
    :hide-label="hideLabel"
    :required="required"
    :label="label"
    :tag="tag"
    :validate-on-input="inputValOnInput">
    <textarea
      v-if="multiLine"
      :disabled="disabled"
      :id="id"
      :maxlength="maxlength"
      :minlength="minlength"
      :pattern="inputPattern"
      :placeholder="inputPlaceholder"
      :readonly="readonly"
      :style="textareaStyle"
      :tabindex="tabindex"
      v-on:input="handleInput">{{ value }}</textarea>
    <input
      v-else
      :disabled="disabled"
      :id="id"
      :maxlength="maxlength"
      :minlength="minlength"
      :multiple="multiple"
      :pattern="inputPattern"
      :placeholder="inputPlaceholder"
      :readonly="readonly"
      :required="required"
      :tabindex="tabindex"
      :type="inputType"
      :value="value"
      v-on:input="handleInput" />
  </AccessibleWholeInput>
</template>

<script setup>
import { computed, ref, onBeforeMount } from 'vue';
import { getGenericFieldProps, getTextFieldProps, getWrapperProps } from './accessible-whole-input.utils';
import ConsoleLogger from '../../../utils/ConsoleLogger.class'
import AccessibleWholeInput from './accessible-whole-input.vue';
import { getAttr, getValidation } from './validators';

// --------------------------------------------------
// START: Vue utils

//  END:  Vue utils
// --------------------------------------------------
// START: Emitted events

const emit = defineEmits(['updateDescByIDs']);

//  END:  Emitted events
// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  ...getWrapperProps(),
  ...getGenericFieldProps(),
  ...getTextFieldProps(),

  /**
   * All standard HTML input fields allow an `autocomplete` attribute.
   * Use "off" to prevent standard inputs being autocompleted by the
   * browser.
   *
   * For more info on `autocomplete` see
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete &
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete#token_list_tokens
   *
   * @property {string} autocomplete
   */
  autocomplete: { type: String, required: false, default: 'off' },

  /**
   * Whether or not to automatically increase the vertical height of
   * a text area if the user input overflows the box boundary.
   *
   * @property {boolean} autoExpand
   */
  autoExpand: { type: Boolean, required: false, default: false },

  /**
   * Whether or not to allow user to enter multiple email addresses
   * in the one field;
   *
   * (see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#additional_attributes)
   *
   * @property {boolean} multiLine
   */
  multiple: { type: Boolean, required: false, default: false },

  /**
   * Whether to render a multi-line (`<textarea>`) input field or
   * just a normal single line (`<input type="text">`)
   *
   * @property {boolean} multiLine
   */
  multiLine: { type: Boolean, required: false, default: false },

  /**
   * Whether or not to use built in browser/system spell check
   * functionality
   *
   * (see [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text#spellcheck) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#spellcheck)
   * for more info)
   *
   * @property {boolean} spellcheck
   */
  spellcheck: { type: Boolean, required: false, default: false },

  /**
   * By default, input fields only validate on change, however if
   * you want more prompt feedback for your users, you can set this
   * to true, then the value will be validated with every key stroke.
   *
   * @property {boolean} validateOnInput
   */
  validateOnInput: { type: Boolean, required: false, default: false },

  /**
   * Common standard validation types for text & numeric inputs
   *
   * Provides standard pattern attribute value, placeholder text
   * and where appropriate additional error messages for common
   * input field use-cases, plus sanitisation and validation functions.
   *
   * Available validation types:
   * * addressline (Line of a street address)
   * * email (prevents malicious email being used)
   * * name  (People's names - only accepts letters, spaces,
   *         fullstops, hyphens and apostrophies only))
   * * title (same as name plus numbers and standard punctuation)
   * * url
   *
   * @property {string} valType
   */
  validationType: { type: String, required: false, default: false },
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

const _textAreaHeight = ref(null);
const _validation = ref(null);

//  END:  Local state
// --------------------------------------------------
// START: Computed helpers

const inputPattern = computed(() => getAttr(_validation.value, props, 'pattern'));

const inputPlaceholder = computed(() => getAttr(_validation.value, props, 'placeholder'));

const inputType = computed(() => {
  if (props.multiLine === true) {
    return undefined;
  }
  if (new Set(['email', 'url']).has(props.validationType)) {
    return props.validationType;
  }

  return 'text';
});

const inputValOnInput = computed(() => {
  return (props.validateOnInput === true)
    ? true
    : undefined;
});

const textareaStyle = computed(() => { // eslint-disable-line arrow-body-style
  return (typeof _textAreaHeight.value === 'number')
    ? `height: ${_textAreaHeight.value + 1}rem;`
    : undefined;
});

//  END:  Computed helpers
// --------------------------------------------------
// START: Computed properties

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

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
          _textAreaHeight,
          _validation,
          inputPattern,
          inputType,
          textareaStyle,
        }
      },
    );
  }
  _validation.value = getValidation(props.validationType);
};

const setType = () => {}

//  END:  Local methods
// --------------------------------------------------
// START: Watcher methods

//  END:  Watcher methods
// --------------------------------------------------
// START: Event handlers

const handleInput = (event) => {
  if (props.autoExpand === true) {
    const { clientHeight, scrollHeight } = event.target;
    let newHeight = null;

    if (scrollHeight > clientHeight) {
      const oldHeight = (_textAreaHeight.value === null)
        ? clientHeight
        : _textAreaHeight.value;

      const tmp = Math.round((scrollHeight / 16) * 100) / 100;

      if (tmp > oldHeight) {
        newHeight = tmp;
      }
    }

    _textAreaHeight.value = newHeight;
  } else if (_textAreaHeight.value !== null) {
    _textAreaHeight.value = null;
  }
};

//  END:  Event handlers
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(() => {
  _initClog();
})

//  END:  Lifecycle events
// --------------------------------------------------
</script>
