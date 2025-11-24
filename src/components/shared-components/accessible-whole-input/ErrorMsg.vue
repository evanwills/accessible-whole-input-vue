<template>
  <div
    aria-live="polite"
    :class="wrapClass"
    :id="id">
    <span :class="errorIconClass">{{ symbol }}</span>
    <slot v-if="extraError === ''">{{ text }}</slot>
    <div v-if="extraError !== ''" v-html="extraError"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getTwStatusIcon, getTwStatusTxtColour } from '../../../utils/status-class-utils';

const props = defineProps({
  externalInvalid: { type: Boolean, required: false, default: false },
  extraError: { type: String, required: false, default: '' },
  hasError: { type: Boolean, required: false, default: false },
  icon: { type: String, required: false, default: '' },
  id: { type: String, required: true },
  spaceAbove: { type: Boolean, required: false, default: false },
  showError: { type: Boolean, required: false, default: false },
  text: { type: String, required: false, default: '' },
  type: { type: String, required: false, default: 'error' },
});

const wrapClass = computed(() => {
  const m = (props.spaceAbove === true)
    ? 'mt-2'
    : 'mb-2';

  return 'text-body-md font-semibold max-w-md flex gap-x-2 '
    + `${m} ${getTwStatusTxtColour(props.type, 'error', false)}`;
});

const symbol = computed(() => getTwStatusIcon(props.icon, props.type));

const errorIconClass = computed(() => {
  const tmp = 'font-semibold';

  let output = ((props.hasError === true && props.showError === true)
    || props.externalInvalid === true)
    ? `${tmp} ${tmp}--show`
    : tmp;

  if (props.spaceAbove === true) {
    output += ` ${tmp}--checkable`;
  }

  return `text-[1.25rem] material-symbols-rounded ${output}`;
});
</script>
