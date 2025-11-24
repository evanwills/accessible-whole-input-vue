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
    :validate-on-input="validateOnInput">
    <textarea
      v-if="multiLine"
      :disabled="disabled"
      :id="id"
      :maxlength="maxlength"
      :minlength="minlength"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :style="textareaStyle"
      :tabindex="tabindex"
      :value="value"
      v-on:input="handleInput"></textarea>
    <input
      v-else
      :disabled="disabled"
      :id="id"
      :maxlength="maxlength"
      :minlength="minlength"
      :multiple="multiple"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      :tabindex="tabindex"
      :type="inputType" />
  </AccessibleWholeInput>
</template>

<script setup>
import { computed } from 'vue';
import AccessibleWholeInput from './accessible-whole-input.vue';


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
  /**
   * All standard HTML input fields allow an `autocomplete` attribute.
   * Use "off" to prevent standard inputs being autocompleted by the
   * browser.
   *
   * For more info on `autocomplete` see
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
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
   * Whether or not the field is disabled
   * (i.e. user is prevented from interacting with the field)
   *
   * A field should only be disabled when it is useful for the user
   * to see that the field is there but they cannot enter anything
   * until something changes.
   *
   * e.g. if you have primary and secondary email
   * fields you would disable the secondary field until the primary
   * fields is populated and validate
   *
   * (see [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled),
   * [MDN `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled)
   * for more info)
   *
   * @property {boolean} disabled
   */
  disabled: { type: Boolean, required: false, default: false },
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
   * Help text to show the user to make the purpose or
   * requirements of the field clear
   *
   * > __Note:__ If you need to include HTML (e.g. a link) in the
   * >       error message use the "help" slot instead.
   *
   * @property {string} help
   */
  help: { type: String, required: false, default: '' },

  /**
   * Whether or not to render help text before or after input field
   *
   * @property {boolean} helpFirst
   */
  helpFirst: { type: Boolean, required: false, default: false },

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

  /**
   * Maximum number of characters user can enter into this field
   *
   * Used for email, number, text & url type input fields as well
   * as textarea fields
   *
   * (see
   * [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength)
   * for more info)
   *
   * @property {number} maxlength
   */
  maxlength: { type: Number, required: false, default: null },

  /**
   * Minimum number of characters user can input into this field
   *
   * Used for email, number, text & url type input fields as well
   * as textarea fields
   *
   * (see
   * [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength)
   * for more info)
   *
   * @property {number} minlength
   */
  minlength: { type: Number, required: false, default: null },

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
   * JavaScript regular expression for validating string input
   *
   * (see
   * [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#pattern)
   * for more info)
   *
   * @property {string} pattern
   */
  pattern: { type: String, required: false, default: '' },

  /**
   * Helper text to show inside input field when value is empty
   *
   * (see
   * [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder)
   * for more info)
   *
   * @property {string} placeholder
   */
  placeholder: { type: String, required: false, default: '' },

  /**
   * Whether or not the field is readonly
   * (i.e. user is prevented from interacting with the field)
   *
   * (see [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly)
   * for more info)
   *
   * @property {boolean} readonly
   */
  readonly: { type: Boolean, required: false, default: false },

  /**
   * Whether or not the field requres a non-empty value
   *
   * (see [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required),
   * [MDN `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required)
   * for more info)
   *
   * @property {boolean} required
   */
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
   * When content is hidden, tabindex must be set to `-1` to
   * prevent the user using the keyboard to tab into hidden inputs.
   *
   * > __Note:__ If tabindex is not `-1` it will not be rendered
   * >       on the field, instead the browser's default
   * >       tabbing order will be used
   *
   * (see [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#tabindex),
   * [MDN `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#tabindex) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#tabindex)
   * for more info)
   *
   * @property {number} tabindex
   */
  tabindex: { type: Number, required: false, default: 0 },

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

  /**
   * Predefined value for the field.
   *
   * NOTE: for 'likert' scale fields the value must be an indexed
   *       object (key/value) pair where the key is a string and
   *       the value is a string, number or null.
   *       the key MUST match the ID of one of the questions in the
   *       likert scale. If not, it will be ignored
   *
   * @property {string|number|Object|undefined} value
   */
  value: { type: string, required: false, default: '' },
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

const _textAreaHeight = ref(null);

//  END:  Local state
// --------------------------------------------------
// START: Computed helpers

const inputType = computed(() => {
  if (props.multiLine === true) {
    return undefined;
  }
  if (props.validationType === 'email' || props.validationType === 'url') {
    return props.validationType;
  }

  return 'text';
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
          _hadFocus,
          _showError,
          inputType,
          textareaStyle,
        }
      },
    );
  }
};

const setType = () => {}

//  END:  Local methods
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(() => {
  _initClog();
})

//  END:  Lifecycle events
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
</script>
