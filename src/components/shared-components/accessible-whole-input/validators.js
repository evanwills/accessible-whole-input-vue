/**
 * This file exports a collection of validation configuration objects.
 *
 * Each object is intended for providing settings, functions, error
 * messages and icons for validating a commonly used input field
 * (e.g. mobile phone number).
 *
 * They are intended for use by the `WholeInputField` component
*/

import { isNonEmptyStr, isObj } from '../../../utils/data-utils';
import {
  sanitiseAddrLine,
  sanitiseAustPhone,
  sanitisePostCode,
  sanitiseMoney,
  sanitiseName,
  // sanitiseNumber,
  sanitisePercent,
  sanitiseTitle,
} from './sanitisers';

/**
 * Standard prefix for error messages when field validation fails
 *
 * @var {string}
 */
const errPre = 'Please enter a valid ';

/**
 * A collection of error messages that can/should be displayed when
 * input validation fails
 *
 * @var {Object<string>}
 */
const errTxt = {
  anyphone: `${errPre}Australian phone number`,
  fixedphone: `${errPre}Australian fixed line phone number`,
  mobilephone: `${errPre}Australian mobile phone number`,
  intphone: `${errPre}international phone number (including country code)`,
  email: `${errPre}email address`,
  postcodepobox: '',
  postcodestreet: '',
  postcode: `${errPre}Australian post code`,
  name: 'Please enter a name',
  password: 'The password entered doesn\'t meet the requirements. '
    + 'Please ensure it is a minimum of 8 characters and includes '
    + 'an uppercase letter, a number and a special character.',
};

/**
 * A collection of regular expressions that are use multiple times
 * for validation and "pattern" attribute values
 *
 * > NOTE: A number of the regular expressions have seemingly
 * >       redundant escape characters. This is because they are used
 * >       as the pattern attribute for some text fields and some
 * >       browsers (Chrome) complain when the characters are not
 * >       escaped.
 *
 * @var {Object<RegExp>}
 */
const regex = {
  // eslint-disable-next-line no-useless-escape
  addrLine: /^[-a-zA-Z\d ,.()/']+$/,
  anyphone: /^0[234578]\d{8}$/,
  fixedphone: /^0[2378]\d{8}$/,
  mobilephone: /^0[45]\d{8}$/,
  intphone: /^\+\d{8-14}$/,
  // eslint-disable-next-line no-useless-escape
  email: /^[a-z\d]+[-a-z\d_.']*@[-a-z\d]+(?:\.[-a-z\d]+)*(?:\.[a-z]+){1,2}$/,
  postcode: /(?:^0[289]\d{2}|[1-9]\d{3}$)/,
  // eslint-disable-next-line no-useless-escape
  name: /^[-a-zA-Z .']+$/,
  // eslint-disable-next-line no-useless-escape
  title: /^[-a-zA-Z\d ,.&?:!()<>/']+$/,
  // eslint-disable-next-line no-useless-escape
  password: /^[-a-zA-Z\d `~!@#$%^&*()_+{}|:";'<>?,.\/\[\]]{8,64}$/,
};

const escape = (_whole, before, chars) => before + chars
  .replaceAll(/(?=[`~!@#$%^&*()+[\]{}|?<>/])/g, '\\')
  .replaceAll(/(?:^-|-$)/g, '\\-');

const reg2pat = (_regex) => _regex.source
  .replaceAll(/(?:^\^|\$$)/g, '')
  .replaceAll(/((?:^|[^\\])\[)(.*?)(?=\])/g, escape);

const invalidDomain = (domain) => {
  const tmp = domain.split(':');

  return (typeof tmp[1] === 'string'
    || tmp[0] === ''
    || tmp[0].includes('example')
    || tmp[0].includes('test')
    || tmp[0].includes('localhost')
    || /^[\d.]+$/.test(tmp[0]) === true);
};

/**
 * Object containing validation for different types of input field
 */
const validators = {
  addressline: {
    error: '',
    pattern: reg2pat(regex.addrLine),
    placeholder: '',
    postIcon: '',
    preIcon: '',
    sanitise: sanitiseAddrLine,
    validate: null,
  },

  email: {
    error: errTxt.email,
    pattern: reg2pat(regex.email), // eslint-disable-line
    placeholder: '',
    postIcon: '',
    preIcon: '',
    sanitise: null,
    validate: (email) => {
      const _email = email.trim().toLowerCase();

      if (_email.length > 192) {
        return errTxt.email;
      }

      const tmp = _email.toLowerCase().split('@');

      if (tmp.length !== 2) {
        return errTxt.email;
      }

      const domain = tmp[1].trim();

      if (tmp[0].trim() === '' || invalidDomain(domain)) {
        return errTxt.email;
      }

      return regex.email.test(_email)
        ? ''
        : errTxt.email;
    },
  },

  money: {
    error: `${errPre}dollar amount`,
    pattern: '\\d{7}(?:\\.\\d{2})?', // eslint-disable-line
    placeholder: '',
    preIcon: 'attach_money',
    postIcon: '',
    sanitise: sanitiseMoney,
    validate: null,
  },

  name: {
    pattern: reg2pat(regex.name), // eslint-disable-line
    placeholder: '',
    error: errTxt.name,
    postIcon: '',
    preIcon: '',
    sanitise: sanitiseName,
    validate: null,
  },

  password: {
    error: errTxt.password,
    pattern: reg2pat(regex.password),
    placeholder: '',
    postIcon: '',
    preIcon: '',
    sanitise: null,
    validate: (input) => { // eslint-disable-line arrow-body-style
      return (regex.password.test(input) === false
        || /[A-Z]+/.test(input) === false
        || /\d+/.test(input) === false
        || /[`~!@#$%^&*()\-=_+/[\]\\{}|;':",.<>?]/.test(input) === false)
        ? errTxt.password
        : '';
    },
  },

  /**
   * Validation for percent input fields
   *
   * @property {object}
   */
  percent: {
    error: `${errPre}percentage`,
    pattern: '\\d{1,3}(?:\\.\\d{1,3})?', // eslint-disable-line
    placeholder: '',
    sanitise: sanitisePercent,
    postIcon: 'percent',
    preIcon: '',
    validate: null,
  },

  postcode: {
    error: errTxt.postcode,
    pattern: reg2pat(regex.postcode),
    placeholder: '',
    postIcon: '',
    preIcon: '',
    sanitise: sanitisePostCode,
    validate: null,
  },

  postcodepobox: {
    pattern: reg2pat(regex.postcode),
    placeholder: '',
    error: errTxt.postcode,
    validate: null,
    sanitise: sanitisePostCode,
    preIcon: '',
    postIcon: '',
  },

  postcodestreet: {
    pattern: reg2pat(regex.postcode),
    placeholder: '',
    error: errTxt.postcode,
    validate: null,
    sanitise: sanitisePostCode,
    preIcon: '',
    postIcon: '',
  },

  tel: {
    pattern: reg2pat(regex.anyphone),
    placeholder: '',
    error: errTxt.anyphone,
    validate: (input) => { // eslint-disable-line arrow-body-style
      return (regex.anyphone.test(input) === true)
        ? ''
        : errTxt.anyphone;
    },
    sanitise: sanitiseAustPhone,
    preIcon: '',
    postIcon: '',
  },

  telfixed: {
    pattern: reg2pat(regex.fixedphone),
    placeholder: '',
    error: errTxt.fixedphone,
    validate: (input) => { // eslint-disable-line arrow-body-style
      return (regex.fixedphone.test(input) === true)
        ? ''
        : errTxt.fixedphone;
    },
    sanitise: sanitiseAustPhone,
    preIcon: '',
    postIcon: '',
  },

  telint: {
    error: errTxt.intphone,
    pattern: reg2pat(regex.intphone),
    placeholder: '',
    preIcon: '',
    postIcon: '',
    sanitise: (input) => (input.replaceAll(/[^+0-9]+/g, '')
      .replaceAll(/([^+]+)\+/g, '$1').substring(0, 15)),
    validate: (input) => { // eslint-disable-line arrow-body-style
      return (regex.intphone.test(input) === true)
        ? ''
        : errTxt.intphone;
    },
  },

  telmobile: {
    error: errTxt.mobilephone,
    pattern: reg2pat(regex.mobilephone),
    placeholder: '',
    postIcon: '',
    preIcon: '',
    sanitise: sanitiseAustPhone,
    validate: (input) => { // eslint-disable-line arrow-body-style
      return regex.mobilephone.test(input) === true
        ? ''
        : errTxt.mobilephone;
    },
  },

  title: {
    error: '',
    pattern: reg2pat(regex.title), // eslint-disable-line
    placeholder: '',
    postIcon: '',
    preIcon: '',
    sanitise: sanitiseTitle,
    validate: null,
  },

  url: {
    error: `${errPre}website address (URL)`,
    pattern: 'https?://[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*(?:\\.[a-z]+){1,2}', // eslint-disable-line
    placeholder: '',
    postIcon: '',
    preIcon: '',
    sanitise: null,
    validate: null,
  },
};

export const getValidation = (type) => {
  return isObj(validators[type])
    ? validators[type]
    : null;
};

export const getAttr = (validation, props, attr) => {
  if (isObj(props) && isNonEmptyStr(props[attr])) {
    return props[attr];
  }

  return (validation !== null && isNonEmptyStr(validation[attr]))
    ? validation[attr]
    : undefined;
};
