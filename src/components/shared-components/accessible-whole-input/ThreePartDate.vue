<template>
  <ul
    class="flex gap-x-4 justify-start"
    ref="threePartDateWrap"
    v-on:externalblur="backgroundClick">
    <li
      class="flex flex-col gap-y-1">
      <label
        class="text-bold-lg"
        :for="getID('day')">Day</label>
      <input
        :class="getInputClass('day')"
        :disabled="disabled"
        :id="getID('day')"
        :max="_maxDay"
        maxlength="2"
        min="1"
        ref="dayInput"
        :readonly="readonly"
        step="1"
        :tabindex="tabindex"
        type="number"
        :value="_output.day"
        v-on:focus="handleFocus"
        v-on:change="handleChange($event, 'day')"
        v-on:keyup="sanitise($event, 'day')" />
    </li>
    <li
      class="flex flex-col gap-y-1">
      <label
        class="text-bold-lg"
        :for="getID('month')">Month</label>
      <input
        :class="getInputClass('month')"
        :disabled="disabled"
        :id="getID('month')"
        max="12"
        maxlength="2"
        min="1"
        :readonly="readonly"
        ref="monthInput"
        step="1"
        :tabindex="tabindex"
        type="number"
        :value="_output.month"
        v-on:focus="handleFocus"
        v-on:change="handleChange($event, 'month')"
        v-on:keyup="sanitise($event, 'month')" />
    </li>
    <li
      class="flex flex-col gap-y-1">
      <label
        class="text-bold-lg"
        :for="getID('Year')">Year</label>
      <input
        :class="getInputClass('year')"
        :disabled="disabled"
        :id="getID('year')"
        :max="_maxYear"
        maxlength="4"
        :min="_minYear"
        :readonly="readonly"
        ref="yearInput"
        step="1"
        :tabindex="tabindex"
        type="number"
        :value="_output.year"
        v-on:focus="handleFocus"
        v-on:change="handleChange($event, 'year')"
        v-on:keyup="sanitise($event, 'year')" />
    </li>
  </ul>
</template>

<script setup>
/* eslint vue/multi-word-component-names: off */
import {
  computed,
  onBeforeMount,
  onUnmounted,
  ref,
} from 'vue';
import { getTrueCount, isNum } from '../../../utils/data-utils';
import {
  dateFromParts,
  getDateError,
  getDateParts,
  daysInMonth,
} from '../../../utils/date-utils';
import { getFauxInputEvent } from '../../../utils/event.utils';
import ExternalBlur from '../../../utils/ExternalBlur.class';
import ConsoleLogger from '../../../utils/ConsoleLogger.class';

const emit = defineEmits(['change', 'error']);

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * Whether or not to step the users' input focus to the next field
   * when they've entered a value that's valid for that input field
   *
   * @property {boolean} autoFocusNext
   */
  autoFocusNext: { type: Boolean, required: false, default: false },

  describedBy: { type: String, required: false, default: '' },

  disabled: { type: Boolean, required: false, default: false },
  /**
   * By default ThreePartDate change events supplies date string as
   * a full ISO8601 date-time string (e.g. "2025-08-19T00:00:00").
   * By setting `date-only`, the change event will only return the
   * date part of the ISO8601 string (e.g. "2025-08-19")
   *
   * > __Note:__ It's probably easier to just strip the time part
   * >           out yourself if you don't want the full ISO8601
   * >           date-time string
   *
   * @property {boolean} dateOnly
   */
  dateOnly: { type: Boolean, required: false, default: false },

  fieldId: { type: String, required: true },

  labeledBy: { type: String, required: false, default: '' },

  /**
   * Maximum date (as timestamp) allowed for this input
   *
   * @property {number} max
   */
  max: { type: String, required: false, default: '' },

  /**
   * Minimum date (as timestamp) allowed for this input
   *
   * @property {number} min
   */
  min: { type: String, required: false, default: '' },

  readonly: { type: Boolean, required: false, default: false },

  required: { type: Boolean, required: false, default: false },

  tabindex: { type: Number, required: false, default: 0 },

  /**
   * ISO 6801 date string for the initial value of the date field.
   *
   * @property {string} value
   */
  value: { type: String, required: false, default: '' },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

const _min = ref(null);
const _max = ref(null);
/**
 * Utility for doing fancy console logging without lots of hard
 * coded calls to console log.
 *
 * @var {ConsoleLogger|null}
 */
const _cLog = ref(null);

const _minYear = ref(undefined);
const _maxYear = ref(undefined);
const _output = ref({
  day: '',
  month: '',
  year: '',
});
const _invalid = ref({
  day: false,
  month: false,
  year: false,
});
const _hadFocus = ref({
  day: false,
  month: false,
  year: false,
});
const _maxDay = ref(31);
const _placeholder = ref({
  day: 15,
  month: 6,
  year: 2024,
});
const threePartDateWrap = ref(null);
const externalBlur = ref(null);

const inpClass = 'text-base rounded leading-10 pl-2 py-2 h-10 '
    + 'bg-white border border-grey-300 '
    + 'focus:outline focus:outline-primary-500 focus:outline-2 '
    + 'focus:outline-offset-2';

const dayInput = ref(null);
const monthInput = ref(null);
const yearInput = ref(null);

//  END:  Local state
// --------------------------------------------------
// START: Pure helper functions

//  END:  Pure helper functions
// --------------------------------------------------
// START: Computed properties

const _focusCount = computed(() => getTrueCount(_hadFocus.value));

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

const dateIsValid = (parts, force = false) => {
  const tmp = getDateError(parts, _min.value, _max.value);

  let b = '';
  let msg = '';

  if (typeof tmp === 'string') {
    b = tmp.substring(0, 1);
    msg = tmp.substring(1);
  }

  if (force === true || _focusCount.value === 3
    || getTrueCount(_invalid.value) > 0 || tmp === false
  ) {
    const badInput = (_output.value.day < 1 || _output.value.day > _maxDay.value
            || _output.value.month < 1 || _output.value.month > 12);
    emit(
      'change',
      getFauxInputEvent(
        (tmp === false)
          ? dateFromParts(parts, true, props.dateOnly)
          : '',
        parts,
        {
          valid: (tmp === false),
          badInput,
          valueMissing: (tmp === true),
          rangeOverflow: (badInput === false && b === 'O'),
          rangeUnderflow: (badInput === false && b === 'U'),
        },
      ),
    );

    if (msg !== '') {
      emit('error', msg);
    }
  }
};

const getID = (field) => `${props.fieldId}--${field}`;

const getInputClass = (prop) => {
  const suffix = (isNum(_output.value[prop]))
    ? 'user-invalid:border-red-500'
    : '';

  const len = (prop === 'year')
    ? '16 shrink'
    : 16;

  return `${inpClass} text-base ${suffix} w-${len} `
    + 'text-center -indent-2 NO-INNER-SPIN';
};

const setMinMax = () => {
  if (props.min > props.max) {
    // min and max have been reversed. This will break validation so
    // we'll reverse it back;
    console.warn(
      `<three-part-date id="${props.fieldId}">.setInitial() expects `
      + 'min attribute to be less than max attribute',
    );
    const tmpYear = _maxYear.value;
    _maxYear.value = _minYear.value;
    _minYear.value = tmpYear;
    _min.value = props.max;
    _max.value = props.min;
  }

  _placeholder.value = getDateParts(
    (_max.value.getTime() - ((_max.value.getTime() - _min.value.getTime()) / 2)),
    _placeholder.value,
  );
};

const setPlacehoderByPartial = () => {
  const now = Date.now();
  let when = now;

  if (_minYear.value !== null) {
    when = (_min.value < now)
      ? (now - ((now - _min.value) / 2))
      : _min.value;
  } else if (_maxYear.value !== null) {
    when = (_max.value > now)
      ? (_max.value - ((_max.value - now) / 2))
      : _max.value;
  }

  _placeholder.value = getDateParts(when, _placeholder.value);
};

const initExternalBlur = () => {
  if (externalBlur.value === null && threePartDateWrap.value !== null) {
    externalBlur.value = new ExternalBlur(
      threePartDateWrap.value,
      props.fieldId,
      {
        autoUnset: true,
        doConsole: false,
        collapsed: false,
        listen: true,
      },
    );
  }
};

const setInitial = () => {
  if (typeof props.min === 'string' && props.min.trim() !== '') {
    _min.value = new Date(props.min);
    if (_min.value !== 'Invalid Date') {
      _minYear.value = _min.value.getFullYear();
    } else {
      _min.value = null;
    }
  }

  if (_cLog.value === null) {
    _cLog.value = new ConsoleLogger(
      '<three-part-date>',
      props.fieldId,
      {
        props,
        refs: {
          _focusCount,
          _hadFocus,
          _invalid,
          _min,
          _max,
          _minYear,
          _maxYear,
          _maxDay,
          _output,
          _placeholder,
        },
      },
      false,
    );
  }

  if (typeof props.max === 'string' && props.max.trim() !== '') {
    _max.value = new Date(props.max);
    if (_min.value !== 'Invalid Date') {
      _maxYear.value = _max.value.getFullYear();
    } else {
      _max.value = null;
    }
  }

  if (_minYear.value !== null && _maxYear.value !== null) {
    setMinMax();
  } else {
    setPlacehoderByPartial();
  }

  if (props.value !== '') {
    _output.value = getDateParts(props.value, _output.value);
    _maxDay.value = daysInMonth(_output.value.month, _output.value.year);
  }

  initExternalBlur();
};

//  END:  Local methods
// --------------------------------------------------
// START: Event handlers

const backgroundClick = (event) => {
  if (typeof event.detail === 'string' && event.detail === props.fieldId) {
    dateIsValid(_output.value, true);
  }
};

const handleChange = (event, prop) => {
  _output.value[prop] = event.target.valueAsNumber;
  _invalid.value[prop] = (!event.target.checkValidity()
    || (props.required === true && event.target.value.trim() === '')
  );

  if (event.target.checkValidity() === true) {
    try {
      _maxDay.value = daysInMonth(_output.value.month, _output.value.year);
    } catch (error) {
      // This exception is triggered by invalid user input.
      // Previously we were not setting the value (and therefore had
      // no potential exceptions), however, users were not getting
      // the feedback they needed and were not correcting their
      // mistakes. So now we catch the exceptions here without doing
      // anything more.
      console.error(
        'could not determine valid maximum days in month using:',
        { ..._output.value },
      );
    }
  }

  dateIsValid(_output.value);
};

const sanitise = (event, prop) => {
  const focus = {
    day: { node: monthInput, min: 3, regex: /^(?:[02]?\d|3[01])$/ },
    month: { node: yearInput, min: 1, regex: /^(?:0?\d|1[0-2])$/ },
  };

  _hadFocus.value[prop] = true;

  if (props.autoFocusNext === true
    && typeof focus[prop] !== 'undefined'
    && event.target.checkValidity() === true
    && isNum(event.key) === true
    && event.target.valueAsNumber > focus[prop].min
    && focus[prop].regex.test(event.target.value) === true
  ) {
    focus[prop].node.value.focus();
  } else {
    // eslint-disable-next-line no-param-reassign
    event.target.value = event.target.value.replace(/\D+/g, '');
  }
};

const handleFocus = () => {
  initExternalBlur();
};

//  END:  Event handlers
// --------------------------------------------------
// START: Watcher methods

//  END:  Watcher methods
// --------------------------------------------------
// START: Lifecycle methods

onBeforeMount(() => {
  setInitial();
});

onUnmounted(() => {
  if (externalBlur.value !== null) {
    externalBlur.value.ignore();
  }
});

//  END:  Lifecycle methods
// --------------------------------------------------
</script>
