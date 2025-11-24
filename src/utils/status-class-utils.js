import { isNonEmptyStr, isObj } from './data-utils';

/**
 * Get symbol name escaped for use in Tailwind class
 *
 * @param {string} symbol Material Symbol icon name
 *
 * @returns {string} Escaped icon name
 */
export const symbolEscape = (symbol) => symbol.replace(/([a-z])(?=_)/g, '$1\\');

const getTwStatus = (status, defaultStat) => {
  const statuses = [
    'brand',
    'error',
    'info',
    'warning',
    'success',
  ];

  if (typeof status !== 'string') {
    throw new Error(
      'getTwStatus() expects first param `status` to be a string. '
        + `${typeof status} given.`,
    );
  }

  if (statuses.includes(status)) {
    return status;
  }

  if (typeof defaultStat === 'string' || statuses.includes(defaultStat)) {
    return defaultStat;
  }

  throw new Error(
    'getTwStatus() expects second param `defaultStat` to be a '
      + `string. ${typeof status} given.`,
  );
};

export const getTwStatusTxtColour = (status, defaultStat, txtDark = true) => {
  let _stat = '';
  try {
    _stat = getTwStatus(status, defaultStat);
  } catch (e) {
    throw Error(e);
  }

  if (txtDark === false) {
    switch (_stat) { // eslint-disable-line default-case
      case 'brand':
        return 'text-blue-500';

      case 'info':
        return 'text-purple-500';

      case 'warning':
        return 'text-sand-500';

      case 'success':
        return 'text-green-500';

      case 'error':
        return 'text-red-500';
    }
  } else {
    switch (_stat) { // eslint-disable-line default-case
      case 'brand':
        return 'text-blue-700';

      case 'info':
        return 'text-purple-700';

      case 'warning':
        return 'text-sand-700';

      case 'success':
        return 'text-green-700';

      case 'error':
        return 'text-red-700';
    }
  }

  throw new Error(
    'getTwStatusTxtColour() could not determine the correct text '
    + `colour using "${status}" and "${defaultStat}".`,
  );
};

export const getTwStatusColours = (status, defaultStat, bg = true, txtDark = true) => {
  let _stat = '';
  try {
    _stat = getTwStatus(status, defaultStat);
  } catch (e) {
    throw Error(e);
  }
  let _colour = '';
  let _bg = '';

  switch (_stat) { // eslint-disable-line default-case
    case 'brand':
      _colour = 'border-blue-500';
      _bg = 'bg-blue-50';
      break;

    case 'info':
      _colour = 'border-purple-500';
      _bg = 'bg-purple-50';
      break;

    case 'warning':
      _colour = 'border-sand-500';
      _bg = 'bg-sand-50';
      break;

    case 'success':
      _colour = 'border-green-500';
      _bg = 'bg-green-50';
      break;

    case 'error':
      _colour = 'border-red-500';
      _bg = 'bg-red-50';
      break;
  }

  if (_colour !== '') {
    if (bg === false) {
      _bg = 'bg-white';
    }

    return `${_colour} ${_bg} ${getTwStatusTxtColour(status, defaultStat, txtDark)}`;
  }

  return '';
};

export const getTwStatusIcon = (status, defaultStat) => {
  let _stat = '';
  try {
    _stat = getTwStatus(status, defaultStat);
  } catch (e) {
    throw Error(e);
  }

  switch (_stat) {
    case 'info':
    case 'error':
    case 'warning':
      return _stat;

    case 'brand':
      return 'info';

    case 'success':
      return 'check_circle';

    default:
      throw new Error(
        'getTwStatusIcon() could not determine correct icon using '
        + `"${status}" and "${defaultStat}".`,
      );
  }
};

const actionRequired = {
  icon: 'error',
  text: 'Action required',
  colour: 'error',
};
const beingProcessed = {
  icon: 'autorenew',
  text: 'Processing',
  colour: 'warning',
};
const claimed = {
  icon: 'check_circle',
  text: 'Claimed',
  colour: 'success',
};
const dueNow = {
  icon: 'error',
  text: 'Due now',
  colour: 'error',
};
const error = {
  icon: 'error',
  text: 'Error',
  colour: 'error',
};
const success = {
  icon: 'check_circle',
  text: 'Success',
  colour: 'success',
};
const warning = {
  allcaps: false,
  icon: 'circle_notifications',
  text: 'Warning',
  colour: 'warning',
};

const documents = () => ({
  outstanding: dueNow,
  'action required': actionRequired,
  'document due': dueNow,
  'document rejected': actionRequired,
  'creative showcase': {
    icon: 'circle_notifications',
    text: 'Enter today',
    colour: 'warning',
  },
  'being processed': beingProcessed,
  'document being reviewed': beingProcessed,
  completed: {
    ...success,
    text: 'Completed',
  },
  confirmed: {
    ...success,
    text: 'Confirmed',
  },
  'document approved': {
    ...success,
    text: 'Approved',
  },
  'creative showcase submitted': {
    icon: 'pending',
    text: 'We\'ve got it!',
    colour: 'success',
  },
  'creative showcase approved': {
    ...success,
    text: 'Entered',
  },
});

const general = () => ({
  action: actionRequired,
  claimed,
  declined: {
    // icon: 'thumb_down_alt',
    // icon: 'circle_notifications',
    icon: 'cancel',
    text: 'Declined',
    colour: 'brand',
  },
  error,
  general: {
    ...warning,
    text: 'General',
  },
  interested: claimed,
  success,
  warning,
});

const payments = () => ({
  pending: {
    icon: 'pending',
    text: 'Pending',
    colour: 'success',
  },
  failed: {
    ...error,
    text: 'Failed',
  },
  paid: {
    ...success,
    text: 'Paid',
  },
  rejected: {
    ...error,
    text: 'Failed',
  },
  onhold: {
    icon: 'warning',
    text: 'On hold',
    colour: 'warning',
  },
});

const offers = () => ({
  claimed,
  declined: {
    icon: 'cancel',
    text: 'Declined',
    colour: 'brand',
  },
});
const consent = () => ({
  due: {
    ...error,
    text: 'Due now',
  },
  complete: {
    ...success,
    text: 'Completed',
  },
});

const details = () => ({
  update: {
    icon: 'error',
    text: 'Please update',
    colour: 'warning',
  },
  success,
});

export const escapeIcon = (status) => { // eslint-disable-line arrow-body-style
  return (isNonEmptyStr(status, 'icon'))
    ? {
      ...status,
      icon: symbolEscape(status.icon),
    }
    : status;
};

/**
 * Get a status object that can be used in alerts and status indicators
 *
 * @param {string} type    Type of status being requested
 * @param {string} status  Status value being requested
 * @param {boolean} escape Whether or not to escape the status icon string
 *                         [Default: FALSE]
 *
 * @return {Object<{colour:string,icon:string:text:string}>}
 */
export const statusMap = (type, status, escape = true) => {
  const map = {
    consent: consent(),
    details: details(),
    document: documents(),
    general: general(),
    offers: offers(),
    payments: payments(),

    actionRequired,
    beingProcessed,
    claimed,
    dueNow,
    error,
    success,
    warning,
  };

  const _type = type.trim().toLowerCase();
  const _status = status.trim().toLowerCase();

  if (isObj(map[_type]) && isObj(map[_type][_status])) {
    return (escape === true)
      ? escapeIcon(map[_type][_status])
      : map[_type][_status];
  }
  if (isObj(map[_status])) {
    return (escape === true)
      ? escapeIcon(map[_status])
      : map[_status];
  }

  throw new Error(
    'statusMap() could not determin correct status using '
    + `"${type}" and "${status}"`,
  );
};
