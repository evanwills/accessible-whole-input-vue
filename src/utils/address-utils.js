/**
 * This file contains a collection of (mostly) "pure" function that
 * help with handling address data from an API
 *
 * Each function is exported so it can be easily unit tested.
 *
 * @file address-utils.js
 * @author Evan Wills <evan.wills@thesmithfamily.com.au>
 */

import { respAdapter } from '../services/service-utils';
import {
  empty2null,
  emptyOrNull,
  isObj,
  objectsAreSame,
  rewriteObjPropNames,
} from './data-utils';
import { ucFirst } from './general-utils';

// ========================================================
// START: JSDoc type definitions

/**
 * @typedef {import('../../types/address.d.ts').TAddrListItem} TAddrListItem
 * @typedef {import('../../types/address.d.ts').TSevenPartAddr} TSevenPartAddr
 * @typedef {import('../../types/address.d.ts').TSevenPartStreetAddr} TSevenPartStreetAddr
 * @typedef {import('../../types/address.d.ts').TSevenPartPostalAddr} TSevenPartPostalAddr
 * @typedef {import('../../types/address.d.ts').TExperianAddressPROD} TExperianAddressPROD
 * @typedef {import('../../types/address.d.ts').TExperianAddressSIT} TExperianAddressSIT
 * @typedef {import('../../types/address.d.ts').UExperianAddress} UExperianAddress
 * @typedef {import('../../types/address.d.ts').TExperianKeys} TExperianKeys
 */

//  END:  JSDoc type definitions
// ========================================================

/**
 * Check if all the required fields of an address object are
 * non-empty
 *
 * @param {object} addr Address object to be checked
 *
 * @returns {boolean} TRUE if Line1, Suburb, State & Postcode are
 *                    non-empty. FALSE otherwise.
 */
export const addressIsValid = (addr) => {
  const required = [
    'line1',
    'suburb',
    'state',
    'postcode',
  ];

  for (const key of Object.keys(addr)) {
    const tmp = key.toLowerCase();

    for (const _r of required) {
      if (tmp.endsWith(_r) && emptyOrNull(addr[key]) === true) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Convert a seven part postal (or street) address to basic seven
 * part address
 *
 * @param {TSevenPartPostalAddr|TSevenPartStreetAddr} addr
 *
 * @returns {TSevenPartAddr}
 */
export const stripAddrTypePrefix = (addr) => rewriteObjPropNames(
  addr,
  (key) => key.substring(6).toLocaleLowerCase(),
);

/**
 * Prepend a prefix to each key in a seven part address object
 *
 * @param {TSevenPartAddr} addr   Seven part address object
 * @param {String}         prefix Prefix string to add to each key
 *                                in object
 * @returns {TSevenPartStreetAddr|TSevenPartPostalAddr}
 */
export const prefixAddr = (addr, prefix) => {
  const _pre = ucFirst(prefix);

  return rewriteObjPropNames(
    addr,
    (key) => `${_pre}${ucFirst(key)}`,
  );
};

/**
 * Convert a seven part postal address to seven part street address
 * or vice versa
 *
 * @param {TSevenPartPostalAddr|TSevenPartStreetAddr} addr
 * @param {string} oldPre Old/current property key prefix
 * @param {string} newPre New/future property key prefix
 *
 * @returns {TSevenPartStreetAddr|TSevenPartPostalAddr}
 */
export const changeAddrPrefix = (
  addr,
  oldPre = 'Street',
  newPre = 'Postal',
) => rewriteObjPropNames(
  addr,
  (key) => key.replace(oldPre, newPre),
);

/**
 * Compare two addresses to see if they are identical
 *
 * @param {object} addr1 Address 1
 * @param {object} addr2 Address 2
 *
 * @returns {boolean} TRUE if all fields in both addresses match and have the same value.
 *                    FALSE otherwise
 *
 * @throws {Error} If Address 1 and Address 2 don't have the same
 *                 number of properties
 * @throws {Error} Property names (in the same position) do not have
 *                 compatible names
 */
export const addressIsSame = (addr1, addr2) => objectsAreSame(
  stripAddrTypePrefix(addr1),
  stripAddrTypePrefix(addr2),
);

/**
 * Convert and address object to a human readable (single line)
 * address
 *
 * @param {object} input Address object
 * @param {string} sep   Seperator character(s) to place between
 *                       fragments of the address
 *
 * @returns {string} Human readable address string.
 */
export const addressToHuman = (input, sep = ', ') => {
  let output = '';
  let _sep = '';

  for (const key of Object.keys(input)) {
    if (input[key] !== null && typeof input[key] === 'string') {
      const tmp = input[key].trim();
      if (tmp !== '') {
        output += _sep + tmp;
        _sep = sep;
      }
    }
  }

  return output;
};

/**
 * Convert street type abbreviations to their full text equivalent
 *
 * @param {string} addr Address to be cleaned up
 *
 * @returns {string} cleaned address
 */
export const makeAbbrFull = (addr) => {
  const fixes = [
    [/(?<= )ave(?= )/, 'avenue'],
    [/(?<= )bvd(?= )/, 'boulevard'],
    [/(?<= )cir(?= )/, 'circle'],
    [/(?<= )cct(?= )/, 'circuit'],
    [/(?<= )crcs(?= )/, 'circus'],
    [/(?<= )ct(?= )/, 'court'],
    [/(?<= )cres(?= )/, 'crescent'],
    [/(?<= )dr(?= )/, 'drive'],
    [/(?<= )esp(?= )/, 'esplanade'],
    [/(?<= )fwy(?= )/, 'freeway'],
    [/(?<= )hwy(?= )/, 'highway'],
    [/(?<= )ln(?= )/, 'lane'],
    [/(?<= )mwy(?= )/, 'motorway'],
    [/(?<= )pde(?= )/, 'parade'],
    [/(?<= )pkwy(?= )/, 'parkway'],
    [/(?<= )plza(?= )/, 'plaza'],
    [/(?<= )pl(?= )/, 'place'],
    [/(?<= )prom(?= )/, 'promenade'],
    [/(?<= )rd(?= )/, 'road'],
    [/(?<= )sq(?= )/, 'sq'],
    [/(?<= )stra(?= )/, 'strand'],
    [/(?<= )st(?= )/, 'street'],
    [/(?<= )tce(?= )/, 'terrace'],
    [/(?<= )trl(?= )/, 'trail'],
  ];

  let output = addr;

  for (const fix of fixes) {
    output = output.replace(fix[0], ` ${fix[1]}`);
  }

  return addr;
};

/**
 * Normalise an address string to make it easier to match.
 *
 * 1. Remove all non-alpha numeric characters and replace them
 *    with spaces.
 * 2. Trim any leading and traling white space
 * 3. Make string all lowercase
 *
 * @param {string} addr Address string to be normalised
 *
 * @returns {string}
 */
export const normalisAddr = (addr) => {
  if (typeof addr === 'string') {
    return addr.replace(/[^a-z\d]+/ig, ' ').trim().toLowerCase();
  }

  return addr;
};

/**
 * Convert Experian API address object into something more useful
 *
 * @param {TExperianKeys} keys Keys to match address and score keys
 *                             found in Experian API data supplied
 *
 * @returns {(UExperianAddress) => TAddrListItem} Function that can
 *                             be passed to Array.map() to get
 *                             normalised address data that can be
 *                             used in Autocomplete search
 */
export const getAddr = (keys) => (data) => {
  const addr = data[keys.addr];

  return {
    id: addr,
    label: addr,
    value: addr,
    score: [keys.score],
    normalised: normalisAddr(addr),
  };
};

/**
 * Get the label string for a single address option
 *
 * @param {Object} data Address data for a single address option
 *
 * @returns {string} Human readable address
 */
export const getAddrLabel = (data) => { // eslint-disable-line arrow-body-style
  return (typeof data.label === 'string')
    ? data.label
    : '';
};

/**
 * Split an address string into parts so those parts can be put into
 * an address object
 *
 * @param {string} address Address string as provided by Experian API
 *
 * @returns {Array} An array of address parts
 */
export const splitAddressStr = (address) => {
  const tmp = address.split(',').map((part) => part.split('  ').map((bit) => bit.trim()));

  const lines = [];
  let locality = [];

  for (let a = 0; a < tmp.length; a += 1) {
    if (tmp[a].length > 1) {
      locality = tmp[a];
    } else {
      lines.push(tmp[a][0]);
    }
  }

  return { lines, locality };
};

/**
 * Take the fragments of an Experian Address API address and put
 * them in a seven part address object.
 *
 * @param {Array} addrBits
 *
 * @returns {TSevenPartAddr}
 */
export const makeTsfAddressInner = ({ lines, locality }) => {
  const fields = ['suburb', 'state', 'postcode'];
  const required = ['line1', 'suburb', 'state', 'postcode'];
  const output = {
    line1: null,
    line2: null,
    line3: null,
    suburb: null,
    state: null,
    postcode: null,
    country: null,
  };

  for (let a = 0; a < lines.length; a += 1) {
    const lineKey = `line${a + 1}`;

    output[lineKey] = empty2null(lines[a]);
  }

  for (let a = 0; a < fields.length; a += 1) {
    output[fields[a]] = locality[a];
  }

  let ok = true;

  for (const key of required) {
    if (output[key] === null) {
      ok = false;
      break;
    }
  }

  return { output, ok };
};

/**
 * Convert an Experien Address API address string to a seven part
 * address object.
 *
 * @param {string} address Experian Address API address string
 *
 * @returns {TSevenPartAddr}
 */
export const makeTsfAddress = (address) => {
  const { output, ok } = makeTsfAddressInner(splitAddressStr(address));

  if (ok === true) {
    output.country = 'AUSTRALIA';
  }

  return output;
};

/**
 * Convert selected address string into User address object
 *
 * @param {string} addressType Type of address
 *                             (usually "Street" or "Postal")
 * @param {string} address     Address string selected by user
 *
 * @returns {object}
 */
export const makeUserAddress = (addressType, address) => {
  const prefix = ucFirst(addressType.toLowerCase());
  const output = {};

  for (const key of Object.keys(address)) {
    const _key = `${prefix}${ucFirst(key)}`;
    output[_key] = address[key];
  }

  return output;
};

/**
 * Get the apprpriate address and score keys for the address & score
 * properties based on the Experian Address API object that is
 * provided.
 *
 * > __NOTE:__ This is necessary because Experian API returns
 *             different data depending on whether it's called from
 *             local/SIT or UAT/PROD.
 * >           Without this step, the Experian API will only work in
 * >           either Dev or Prod environment. Not both!
 *
 * @param {UExperianAddress} data
 *
 * @returns {TExperianKeys}
 */
const getKeys = (data) => {
  const output = {
    addr: 'partialAddressField',
    score: 'scoreField',
  };
  if (typeof data.PartialAddress === 'string') {
    output.addr = 'PartialAddress';
    output.score = 'Score';
  }

  return output;
};

/**
 * Get PickList from API response
 *
 * @param {Object|any} response Experian API address search response
 *
 * @returns {Array|null} List of addresses if found. `null` otherwise
 */
const getPickList = (response) => {
  if (isObj(response) && Array.isArray(response.PickListEntries)) {
    return response.PickListEntries;
  }

  console.error( // eslint-disable-line no-console
    'Could not find address pick list data in API response',
    response,
  );

  return null;
};

const unableOption = {
  label: 'Unable to find address?',
  score: 0,
  normalised: 'manual address',
  value: 'manual address',
  customStyle: 'text-bold-md text-blue-300 underline',
};

/**
 * Get function that returns data from the Search API
 * (if we have enough text to make an API call)
 *
 * @param {function} search   Async API address search function
 * @param {number}   minChars Minimum number of characters required
 *                            before calling search
 *
 * @returns {array} List of matched addresses.
 */
export const addressApiSearch = (search, minChars = 5) => {
  if (typeof search !== 'function') {
    throw new Error(
      'addressApiSearch() expects first argument `search` to be a '
      + `callable function. ${typeof search} given`,
    );
  }

  const isNum = (typeof minChars === 'number');
  if (isNum === false || minChars < 0 || minChars > 100) {
    const tmp = (isNum === false)
      ? typeof minChars
      : minChars;

    throw new Error(
      'addressApiSearch() expects second argument `minChars` to be '
      + 'a number between zero and one hundred inclusive. '
      + `${tmp} given`,
    );
  }

  return async (input) => {
    let output = [];

    if (input.length >= minChars) {
      const list = getPickList(respAdapter(await search(input)));

      if (Array.isArray(list)) {
        if (list.length > 0) {
          // This is required to make Experian API work in both Dev
          // and Prod environments
          const keys = getKeys(list[0]);

          output = list.map(getAddr(keys));
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to get address list');
      }
    }

    output.push(unableOption);

    return output;
  };
};
