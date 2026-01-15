/**
 * This file exports a number of pure functions that can be used to
 * sanitise user input strings
*/

/**
 * Remove unwanted and/or excess characters from an Australian phone
 * number input field
 *
 * @param {string} input Value for phone number input
 *
 * @returns {string} clean phone number value
 */
export const sanitiseAustPhone = (input) => { // eslint-disable-line arrow-body-style
  return (typeof input === 'string')
    ? input.replace(/\D+/gs, '').substring(0, 10)
    : '';
};

export const sanitiseAddrLine = (input) => { // eslint-disable-line arrow-body-style
  return (typeof input === 'string')
    ? input.replace(/[^\-a-zA-Z\d ,.()/']+/, '')
    : '';
};

export const sanitiseName = (input) => { // eslint-disable-line arrow-body-style
  return (typeof input === 'string')
    ? input.replace(/[^a-zA-Z .'-]+/ig, ' ')
      .replace(/([- .'])\1+/g, '$1')
      .replace(/([- .']{3})[- .']+/g, '$1')
    : '';
};

/**
 * Sanitise any positive number
 *
 * @param {string} input  Value entered by user
 * @param {Array}  extras List of regular expressions or arrays with
 *                        regular expression and string replacement
 *                        to be applied to input
 * @param {number} max    Maximum number of characters the output
 *                        should be.
 *
 * @returns {string}
 */
export const sanitiseNumber = (input, extras, max) => {
  // strip non-number chanracters
  let output = input.replace(/\D+/gs, '')
    // strip unwanted leading zeros
    .replace(/^(?:0+(?=[1-9])|0+?(?=0\.))/, '');

  for (const extra of extras) {
    output = output.replace(extra, '$1');
  }

  return (typeof max === 'number' && max > 0)
    ? output.substring(0, max)
    : output;
};

export const sanitiseMoney = (input) => sanitiseNumber(
  input,
  [/^.*(\d{1,7}(?:\.\d{2})?).*$/],
  10,
);

export const sanitisePercent = (input) => sanitiseNumber(
  input,
  [/^.*?(\d{1,3}(?:\.\d{1,3})?).*$/],
  7,
);

/**
 * Remove unwanted and/or excess characters from an Australian post
 * codes number input field
 *
 * @param {string} input Value for phone number input
 *
 * @returns {string} clean postcode string value
 */
export const sanitisePostCode = (input) => input.replace(/\D+/gs, '').substring(0, 4);

export const sanitiseTitle = (input) => (input.replace(/[^a-z\d&, _.?:!'()-]+/ig, '')
  .replace(/([&, \-_.?:!'()])\1+/ig, '$1'));
