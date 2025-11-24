const linkAfterStyle = 'after:content-[\'east\'] '
  + 'after:transition group-hover:after:translate-x-1 '
  + 'after:text-body-lg after:leading-4 after:font-symbol '
  + 'after:pl-2 after:!py-0';

export const hideMore = (more) => { // eslint-disable-line arrow-body-style
  return (more === '')
    ? undefined
    : true;
};

/**
 * Get class list for card footer
 *
 * @param {string} more Card's `moreText property value
 * @param {string} yes  Custom justify class if more is not empty
 * @param {string} no   Custom justify class if more is empty
 *
 * @returns {string}
 */
// eslint-disable-next-line arrow-body-style
export const getCardFClass = (more, yes, no, centre = false) => {
  const _centre = (centre === true)
    ? ' mx-auto'
    : '';
  return (more !== '')
    ? `text-blue-500 btn-md flex btn-link btn-icon-right ${yes} `
      + `${linkAfterStyle} ${_centre} px-0 mb-0 pt-3 pb-1`
    : 'text-heading-sm text-blue-500 flex items-center min-h-10 '
      + ` ${no} ${linkAfterStyle} ${_centre} !bg-transparent`;
};

/**
 * Get class list for card heading
 *
 * @param {string} more    Card's `moreText` property value
 * @param {string} url     Card's `url` property value
 * @param {string} justify flexbox `justify-content` class name
 *
 * @returns {string}
 */
export const getCardHClass = (more, url, justify) => {
  const pre = (url !== '')
    ? 'after:content-[""] after:absolute after:inset-0 after:z-10'
    : '';

  const post = (more === '' && url !== '')
    ? ` ${linkAfterStyle}`
    : '';

  return `${pre} text-heading-sm flex items-center `
    + `${justify} text-blue-500 leading-5 ${post}`;
};

export const getColClass = (cols) => {
  let _cols = '';

  if (cols > 0) {
    _cols = 'msf-flex-1-3';

    if (cols == 6) { // eslint-disable-line eqeqeq
      return 'msf-flex-1-6';
    }
    if (cols == 5) { // eslint-disable-line eqeqeq
      return 'msf-flex-1-5';
    }
    if (cols == 4) { // eslint-disable-line eqeqeq
      return 'msf-flex-1-4';
    }
    if (cols == 2) { // eslint-disable-line eqeqeq
      return 'msf-flex-1-2';
    }
  }

  return _cols;
};

/**
 *
 * @param {string} url  Card's `url` property value
 * @param {number} cols
 * @returns
 */
export const getCardWrapClass = (name, url, cols) => {
  const focus = (url !== '')
    ? 'shadow-md hover:boder-blue-500 focus-within:boder-blue-500 '
      + 'transition-all cursor-pointer outline-none'
    : '';

  return `${name} ${getColClass(cols)} ${focus} group relative flex flex-col `
    + 'max-w-xl bg-white border border-grey-300 rounded-lg '
    + 'shadow-sm';
};
