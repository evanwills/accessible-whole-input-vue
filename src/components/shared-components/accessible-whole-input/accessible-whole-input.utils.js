import { isObj } from "../../../utils/data-utils";

export const propsToPropValues = (...data) => {
  const output = {};
  console.log('data:', data);

  for (const arg of data) {
    if (isObj(arg)) {
      for (const key of Object.keys(arg)) {
        output[key] = arg[key].default;
      }
    }
  }

  return output;
};

export const getWrapperProps = () => ({
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
   * @property {boolean} helpLast
   */
  helpLast: { type: Boolean, required: false, default: false },

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
   * Whether or not the field is required
   * (i.e. user is must provide a value for this field)
   *
   * (see [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required),
   * [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#required) &
   * [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required)
   * for more info)
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
   * The type of tag wrapping the whole output
   *
   * @property {string} tag
   */
  tag: { type: String, required: false, default: 'li' },

  validateOnInput: { type: Boolean, required: false, default: false },

  watchBlur: { type: Boolean, required: false, default: false },
});

export const getGenericFieldProps = (valueIsNumber = false) => ({
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
   * Whether or not the field is readonly
   * (i.e. user is prevented from interacting with the field)
   *
   * (see [MDN `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly),
   * [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#readonly) &
   * [MDN `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly)
   * for more info)
   *
   * @property {boolean} readonly
   */
  readonly: { type: Boolean, required: false, default: false },

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
   * Predefined value for the field.
   *
   * NOTE: For multi value fields like 'checkboxes' & 'likert scale',
   *       use the attribute `values`.
   *
   * @property {string|number|undefined} value
   */
  value: {
    type: (valueIsNumber === true)
      ? Number
      : String,
    required: false,
    default: '',
  },

  /**
   * A set of predefined values for 'checkboxes' & 'likert scale'
   * fields.
   *
   * `values` is a key/value object where the key is a string
   * matching the ID of one of the questions and the value is a
   * string, number or null.
   *
   * Each key MUST match the ID of one of the questions in the
   * `likert scale`. If not, it will be ignored.
   *
   * @property {Object} value
   */
  values: { type: Object, required: false, default: null },
});

export const getTextFieldProps = () => ({
  /**
   * All standard HTML input fields allow an `autocomplete` attribute.
   * Use "off" to prevent standard inputs being autocompleted by the
   * browser.
   *
   * For more info on `autocomplete` see
   * [autocomplete (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) &
   * [autocomplete tokens (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete#token_list_tokens)
   *
   * @property {string} autocomplete
   */
  autocomplete: { type: String, required: false, default: 'off' },

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
   * JavaScript regular expression for validating string input
   *
   * __Note:__ `pattern` must not include delimiters and start & end
   *           special characters. If your JavaScript RegExp is
   *           `/^[A-Z][A-Za-z\d]{2,16}$/` then your `pattern`
   *           attribute value would be `[A-Z][A-Za-z\d]{2,16}`
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
})
