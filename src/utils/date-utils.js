import { isNonEmptyStr, isNum } from './data-utils';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Test whether a value is string matching the ISO 8601 date only or
 * date-time format
 *
 * See: https://en.wikipedia.org/wiki/ISO_8601
 *
 * @param {unknown} input Value that may be an ISO 8601 string
 *
 * @returns {boolean} TRUE if input is a string matching ISO 8601 the
 *                    pattern. FALSE otherwise
 */
export const isISO8601str = (input) => (isNonEmptyStr(input) === true
  && /^\d{4}(?:-\d\d){2}(?:T\d\d(?::\d\d){2}(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)?)?$/i.test(input));

/**
 * Get a Date object from input (if possible) or return NULL if not
 *
 * @param {unknown} input Value that might be string which can be
 *                        parsed by Date() constructor
 *
 * @returns {Date|null} `Date` object if input could be parsed.
 *                      `NULL` otherwise
 */
export const getDateOrNull = (input) => {
  if (isNonEmptyStr(input) === false) {
    return null;
  }

  const output = new Date(input);

  return (output.toString() === 'Invalid Date')
    ? null
    : output;
};

/**
 * Get (local) human readable Date from ISO date string or timestamp
 * or Date object
 *
 * @param {string|number|Date} isoDate    ISO date string (or any
 *                                        string that can be parsed
 *                                        by `Date` constructor),
 *                                        Javscript timestamp or Date
 *                                        object
 * @param {boolean}            shortMonth Whether or not to render
 *                                        month in short format
 *
 * @returns {string} Human readable representation of supplied Date
 */
export const humanDate = (isoDate, shortMonth = false) => {
  const tmp = (typeof isoDate === 'string' || typeof isoDate === 'number')
    ? new Date(isoDate)
    : isoDate;

  if ((tmp instanceof Date) === false || tmp.toString() === 'Invalid Date') {
    throw new Error('humanDate() could not convert input into a (valid) Date object');
  }

  const month = (shortMonth === true)
    ? 'short'
    : 'long';

  return tmp.toLocaleDateString(
    'en-AU',
    { day: 'numeric', month, year: 'numeric' },
  );
};

/**
 * Get the maximum number of days in a given month in a given year.
 *
 * @param {number} month Month of the year to be tested
 * @param {number} year Year to be tested
 *
 * @returns {number} Maximum number of days for the supplied month
 */
export const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

/**
 * @param {string} date   Date string for Dayjs
 * @param {string} format String describing the dayjs format the
 *                        passing date is in. Default: 'D/MM/YYYY'
 * @param {string} output String describing the dayjs output the
 *                        passing date will return as.
 *                        Default: 'D MMMM YYYY'
 * @returns
 */

export const formatDate = (isoDate, shortMonth = false) => {
  const tmp = (typeof isoDate === 'string')
    ? new Date(isoDate)
    : isoDate;

  if ((tmp instanceof Date) === false || tmp.toString() === 'Invalid Date') {
    throw new Error('formatDate() could not convert input into a (valid) Date object');
  }

  const month = (shortMonth === true)
    ? 'short'
    : 'long';

  return tmp.toLocaleDateString(
    'en-AU',
    { day: 'numeric', month, year: 'numeric' },
  );
};

export const santisePhone = (input) => {
  if (typeof input !== 'string') {
    return null;
  }
  const phone = input.replace(/\D+/g, '');
  const pre = phone.substring(0, 2);

  const regex = (/0[45]|1\d/.test(pre))
    ? /(0[45]\d{2}|1\d00)(\d{3})(\d{3})/
    : /(0[1-36-9])(\d{4})(\d{4})/;

  return { phone, regex };
};

export const getMonths = () => months;

/**
 * Get an ISO 8601 date string offset by a given amount.
 *
 * > __Note:__ By default this function is not "pure" because it
 * >           calls Date.now() to get the current timestamp,
 * >           however, for testing purposes, you can pass in a
 * >           predefined "now" value which will cause the function
 * >           to be "pure" and give a predictable result.
 *
 * @param {number}      offset Offset from now
 * @param {string}      unit   Unit offset represents
 * @param {null|number} now    JS Timestamp for current time
 *
 * @returns {string}
 */
export const getRelativeIsoDate = (offset, unit = 'year', now = null) => {
  if (typeof offset !== 'number') {
    throw new Error(
      'getRelativeIsoDate() expects first parameter `offset` to '
      + `be a number. "${typeof offset}" given`,
    );
  }
  if (typeof unit !== 'string') {
    throw new Error(
      'getRelativeIsoDate() expects second parameter `unit` to be '
      + `a string. "${typeof offset}" given`,
    );
  }

  const _now = (typeof now !== 'number')
    ? Date.now()
    : now;

  let multiplyer = 1;

  switch (unit.trim().toLowerCase().replace(/s$/i, '')) {
    case 'year':
      multiplyer = 31557600000;
      break;
    case 'month':
      multiplyer = 2629800000;
      break;
    case 'week':
      multiplyer = 604800000;
      break;
    case 'day':
      multiplyer = 86400000;
      break;
    default:
      throw new Error('getRelativeIsoDate() expects unit to be a string matching: "year", "month", "week" or "day"');
  }

  const when = new Date(_now + (multiplyer * offset));

  return when.toISOString().replace(/T.*$/, '');
};

export const mapMonth = (month) => months[parseInt(month, 10) - 1];

export const getIsoDate = (timestamp) => {
  const d = new Date(timestamp);

  return d.toISOString();
};

/**
 * Get the numeric day, month, year parts of a date as an object
 *
 * @param {number|string} input      Value to be converted to a date
 * @param {T<any>}        defaultVal Default value to return if input
 *                                   could not be converted to a Date
 *
 * @returns {object<{day:number,month:number,year:nubmer}>|T}
 */
export const getDateParts = (input, defaultVal = false) => {
  if (isNum(input) || typeof input === 'string') {
    const tmp = new Date(input);

    if (tmp.toString() !== 'Invalid Date') {
      return {
        day: tmp.getDate(),
        month: (tmp.getMonth() + 1),
        year: tmp.getFullYear(),
      };
    }
  }

  return defaultVal;
};

export const localDate = (date) => date.toLocaleDateString(
  'en-AU',
  {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
);

export const auDate = (date) => date.toLocaleDateString('en-AU');

const twoDigit = (input) => input.toString().substring(0, 2).padStart(2, '0');

export const getLocalISOdate = (date, dateOnly = false) => {
  const time = (dateOnly === true)
    ? ''
    : 'T00:00:00';

  return (date instanceof Date)
    ? `${date.getFullYear()}-${twoDigit(date.getMonth() + 1)}-${twoDigit(date.getDate())}${time}`
    : '';
};

/**
 * Convert day, month, year object into Date object then return object
 * or ISO representation of date
 *
 * @param {Object<{day:number,month:number,year:number}>} parts
 *                           Object containing numeric day, month,
 *                           year values
 * @param {boolean} asISO    Whether or not to return the date as an
 *                           ISO8601 string or a `Date` object
 * @param {boolean} dateOnly If date string is returned in ISO8601,
 *                           only return the date part of the date
 *                           string
 *
 * @returns {Date|string}
 */
export const dateFromParts = (parts, asISO = false, dateOnly = false) => {
  let output = '';

  try {
    output = new Date(
      `${parts.year.toString().substring(0, 4)}-`
      + `${twoDigit(parts.month)}-`
      + `${twoDigit(parts.day)}`,
    );
  } catch (error) {
    // It's not unexpected that we cannot use the values supplied to
    // generate a valid date.
    // We don't need to do anything other than return an empty string
    console.error('Invalid date', parts);
    return '';
  }

  return (asISO === true)
    ? getLocalISOdate(output, dateOnly)
    : output;
};

const getDateErrorInner = (parts, _minYear, _maxYear) => {
  if (parts.day < 1) {
    return 'UDay value must be greater than or equal to 1';
  }

  if (parts.month < 1) {
    return 'UMonth value must be greater than or equal to 1';
  }
  if (parts.month > 12) {
    return 'OMonth value must be less than or equal to 12';
  }

  if (_minYear > -1 && parts.year < _minYear) {
    return `UYear value must be greater than or equal to ${_minYear}`;
  }

  if (_maxYear > -1 && parts.year > _maxYear) {
    return `OYear value must be less than or equal to ${_maxYear}`;
  }

  const dim = daysInMonth(parts.month, parts.year);

  if (parts.day > dim) {
    return `ODay value must be less than or equal to ${dim}`;
  }

  return null;
};

/**
 * Get an error message if date is outside allowed range
 *
 * @param {object}           parts day, month, year parts of a date
 * @param {number|Date|null} min   timestamp for minimum date
 *                                 allowable
 * @param {number|Date|null} max   timestamp for maximum date
 *                                 allowable
 *
 * @returns {string|boolean} If there's an error the Error message
 *                           string will be returned.
 *                           If any of the date parts are not numbers,
 *                           TRUE will be returned to indicate the
 *                           date is invalid but that we don't have
 *                           enough value to validate.
 *                           FALSE if the date is valid (i.e. no error)
 */
export const getDateError = (parts, min, max) => {
  const keys = ['day', 'month', 'year'];
  let _min = min;
  let _max = max;

  let _minYear = -1;
  let _maxYear = -1;

  if (min instanceof Date) {
    _min = min.getTime();
    _minYear = min.getFullYear();
  }

  if (max instanceof Date) {
    _max = max.getTime();
    _maxYear = max.getFullYear();
  }

  for (const key of keys) {
    if (typeof parts[key] !== 'number') {
      // we don't have all the info yet
      return true;
    }
  }

  const output = getDateErrorInner(parts, _minYear, _maxYear);

  if (output !== null) {
    return output;
  }

  const tmp = dateFromParts(parts);
  const timestamp = tmp.getTime();
  const msg = localDate(tmp);

  if (_min !== null && timestamp < _min) {
    return `UDate (${msg} is earlier than the minimum allowed `
      + `(${localDate(new Date(_min))}.`;
  }

  if (_max !== null && timestamp > _max) {
    return `ODate (${msg} is later than the minimum allowed `
      + `(${localDate(new Date(_max))}.`;
  }

  return false;
};
