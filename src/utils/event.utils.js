/**
 * Check whether a user instigated event can be assumed to be a
 * click event
 *
 * @param {Event} event User instigated event
 *
 * @returns TRUE if event is deemed to be a click event.
 *          FALSE otherwise
 */

import { isObj } from './data-utils';

// eslint-disable-next-line import/prefer-default-export
export const isClickEvent = (event) => {
  if (typeof event.key === 'string' && event.key !== '') {
    return (event.key === 'Enter' || event.key === 'Space');
  }

  return (event.type === 'click');
};

/**
 *
 * See:
 * * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/reportValidity
 * * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/validationMessage
 *
 * @param {string|any}      validityMsg Validity error message
 * @param {Function|string|null} report Function to use as `reportValidity`
 *                                      method on event target
 *                                      OR
 *                                      String validity error message
 *                                      to render when `reportValidity()`
 *                                      is called
 *                                      OR
 *                                      NULL if nothing is specified
 *
 * @returns {Object<{validationMessage:string,reportValidity:Function}>}
 */
const getReportValidity = (validityMsg, report) => {
  let validationMessage = '';
  let reportValidity = () => '';

  if (typeof validityMsg === 'string') {
    reportValidity = () => validityMsg;
    validationMessage = validityMsg;
  }

  if (report !== null) {
    const rType = typeof report;

    if (rType === 'function') {
      reportValidity = report;
    } else if (rType === 'string') {
      reportValidity = () => report;
      validationMessage = report;
    }
  }

  return { validationMessage, reportValidity };
};

/**
 * Get `ValidityState` object and related `checkValidity()` &
 * `reportValidity()` methods associated with an input event target
 * object
 *
 * For more info, See:
 * * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 * * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
 * * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/reportValidity
 *
 * @param {Object}               props  validity properties to override
 *                                      validity state object props
 *
 * @returns {Object<{validity:ValidityState,checkValidity:Function}>}
 */
export const getFieldValiditionStuff = (props) => {
  const validity = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false,
  };

  for (const key of Object.keys(validity)) {
    if (typeof props[key] === 'boolean') {
      validity[key] = props[key];
    }
  }

  const checkValidity = () => {
    for (const key of Object.keys(validity)) {
      const tmp = (key === 'valid')
        ? !validity[key]
        : validity[key];

      if (tmp === true) {
        return false;
      }
    }

    return true;
  };

  return {
    checkValidity,
    validity,
  };
};

/**
 * Get a faux target DOM element as would be expected to be in an
 * InputEvent
 *
 * @param {any}    value      Value to be sent with faux input
 *                            elements
 * @param {any}    rawValue   Raw value (full option data) for
 *                            selected option to be sent with faux
 *                            input elements
 * @param {Object} validity   [{} (empty object)] Input validity props
 * @param {Object} otherProps [{} (empty object)] Any other props you
 *                            might want to add to the event target
 * @param {string} tag        ["input"] Tag name for the event target
 *
 * @returns {Object} Object that mimics an HTML
 *                   input/select/button/textarea field included as
 *                   the `target` property of an event
 */
const fauxEventTarget = (value, rawValue, validity = {}, otherProps = {}, tag = 'input') => {
  const TAG = tag.toLocaleUpperCase();

  const { reportValidity, ...other } = (isObj(otherProps) === true)
    ? otherProps
    : {};

  const output = {
    value,
    rawValue,
    localName: tag,
    nodeName: TAG,
    tagName: TAG,
    ...other,
    ...getFieldValiditionStuff(validity),
    ...getReportValidity(validity.validityMsg, reportValidity),
    faux: true,
  };

  return output;
};

/**
 * Get a faux input event that can be passed up to parent listeners
 *
 * @param {any}    value      Value to be sent with faux input
 *                            elements
 * @param {any}    rawValue   Raw value (full option data) for
 *                            selected option to be sent with faux
 *                            input elements
 * @param {Object} validity   Input validity props
 * @param {Object} otherProps Any other props you might want to add
 *                            to the event target
 * @param {string} type       ["change"] Faux event type
 * @param {string} tag        ["input"] DOM element tag name
 *
 * @returns {Object} Object that mimics an InputEvent object emitted
 *                   from an HTML input/select/button/textarea field
 *                   after a user interaction.
 */
export const getFauxInputEvent = (
  value,
  rawValue = undefined,
  validity = {},
  otherProps = {},
  type = 'change',
  tag = 'input',
) => ({
  type,
  target: fauxEventTarget(
    value,
    (typeof rawValue !== 'undefined')
      ? rawValue
      : value,
    validity,
    otherProps,
    tag,
  ),
  faux: true,
});
