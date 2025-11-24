/**
 *
 * @param {string} input
 * @returns {string}
 */
export const brBr2p = (input) => {
  const tmp = ((input || '').match(/<br ?\/?>\s*<br ?\/?>/isg) || []).length;

  let output = input.replace(/(?<=<p>)\s*<span>(.*?)<\/span>\s*(?=<\/p>)/gis, '$1');

  for (let a = 0; a < tmp; a += 1) {
    output = output.replace(/(?<=<p>)([^<]+)(?:<br ?\/?>\s*<br ?\/?>\s*)/g, '$1</p><p>');
  }

  return output;
};

export const getProseOverrides = (input, overrides) => {
  let output = input;
  const _overrides = overrides.split(' ');

  for (const override of _overrides) {
    const tmp = override.trim();

    if (tmp !== '') {
      const old = tmp.replace(/^(prose-[a-z]+:[a-z]+-).*$/, '$1');
      const find = new RegExp(`${old}[^ ]+(?=\\s|$)`);

      output = output.replace(find, tmp);
    }
  }

  return output;
};

export const stripPinLi = (input) => {
  const regex = /(?:(<li(?: [^>]+)?>)\s*<p(?: [^>]+)?>|<\/p>\s*(<\/li>))/isg;

  return input.replace(regex, '$1$2');
};

/**
 * Get a human readable (and gramatically correct) representation
 * array of strings
 *
 * @param {string[]} input     List of things to be rendered
 * @param {string}   finalJoin Joiner word or character to use as the
 *                             final joiner
 *
 * @returns {string} Human readable representation of array of strings
 */
export const strArrayToHumanStr = (input, finalJoin = '&') => {
  if (!Array.isArray(input)) {
    throw new Error(
      'strArrayToHumanStr() expects only parameter to be an Array. '
      + `${typeof input} given`,
    );
  }

  return input.join(', ').replace(/,(?=[^,]+$)/i, ` ${finalJoin}`);
};

/**
 * Split single string of HTML for error message into heading and
 * body parts so they can be rendered separately
 *
 * @param {string} input HTML for error message that needs to be
 *                       split into heading and body strings
 *
 * @returns {Object<{body:string,heading:string}>}
 */
export const splitErrorMsg = (input) => {
  const regex = /<p>(?:<strong>)?(.*?)(?:<\/strong>)?<\/p>/ig;

  let heading = '';
  let body = '';

  let match;

  while ((match = regex.exec(input)) !== null) { // eslint-disable-line no-cond-assign
    match[1] = match[1].replace(/[\r\n\t]+/, '').trim();

    if (match[1] !== '') {
      if (heading === '') {
        heading = match[1]; // eslint-disable-line prefer-destructuring
      } else {
        body += match[0];
      }
    }
  }

  return {
    body,
    heading,
  };
};
