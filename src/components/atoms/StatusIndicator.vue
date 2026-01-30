<template>
  <div :class="wrapClass" aria-live="polite">
    <span :class="iconClass" aria-hidden="true">{{ statusIcon }}</span>
    <span class="text-body-md block whitespace-nowrap">{{ statusText }}</span>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { getTwStatusColours, getTwStatusIcon, statusMap } from '../../utils/status-class-utils';
import { isNonEmptyStr } from '../../utils/data-utils';
import ConsoleLogger from '../../utils/ConsoleLoggerDummy.class';

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * Provides an override to the default colour for a given status
   * type
   *
   * @property {string}
   */
  colour: { type: String, requred: false, default: '' },

  /**
   * Provides an override to the default icon for a given status type
   *
   * @property {string}
   */
  icon: { type: String, requred: false, default: '' },

  /**
   * Status sub-type the status indicator represents
   *
   * > __Note:__ By default the default status type is "payment"
   *
   * @property {string}
   */
  status: { type: String, required: false, default: '' },

  /**
   * Provides an override to the default text for a given status type
   *
   * @property {string}
   */
  text: { type: String, requred: false, default: '' },

  /**
   * Status type the status indicator represents
   *
   * @property {string}
   */
  type: { type: String, requred: false, default: 'general' },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

const _cLog = ref(null);

const statuses = new Set(['brand', 'info', 'warning', 'success', 'error']);

//  END:  Local state
// --------------------------------------------------
// START: local helper methods

//  END:  local helper methods
// --------------------------------------------------
// START: computed state

const currentStatus = computed(() => {
  try {
    return statusMap(props.type, props.status, false);
  } catch (e) {
    throw new Error(e);
  }
});

const statusColour = computed(() => {
  if (props.colour !== '') {
    return (statuses.has(props.colour))
      ? getTwStatusColours(props.colour, '', true, true)
      : props.colour;
  }

  try {
    return getTwStatusColours(currentStatus.value?.colour, '', true, false);
  } catch (e) {
    return '';
  }
});

const statusIcon = computed(() => {
  if (isNonEmptyStr(props, 'icon')) {
    return props.icon;
  }

  if (isNonEmptyStr(currentStatus.value, 'icon')) {
    return currentStatus.value.icon;
  }

  try {
    return getTwStatusIcon(currentStatus.value?.colour, '');
  } catch (e) {
    return '';
  }
});

const statusText = computed(() => {
  if (props.text !== '') {
    return props.text;
  }

  return currentStatus.value?.text;
});

const iconClass = computed(() => 'font-symbol text-body-xl');

const wrapClass = computed(
  () => `status-indicator ${statusColour.value}`
    + ' max-h-6 inline-flex items-center gap-0.5 py-1 px-3 rounded-full border',
);
//  END:  computed state
// --------------------------------------------------
// START: Local methods

//  END:  Local methods
// --------------------------------------------------
// START: Watchers

//  END:  Watchers
// --------------------------------------------------
// START: Lifecycle methods

onBeforeMount(() => {
  if (_cLog.value === null) {
    _cLog.value = new ConsoleLogger(
      '<status-indicator>',
      `${props.type}-${props.status}`,
      {
        props,
        refs: {
          currentStatus,
          statusColour,
          statusIcon,
          statusText,
          iconClass,
          wrapClass,
        },
      },
      false,
    );
  }
});

//  END:  Lifecycle methods
// --------------------------------------------------
</script>
