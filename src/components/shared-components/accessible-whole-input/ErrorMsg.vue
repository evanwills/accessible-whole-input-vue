<template>
  <div
    v-if="showError === true"
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
  /**
   * Whether or not the error message has been forced by external client
   *
   * @property {boolean} externalInvalid
   */
  externalInvalid: { type: Boolean, required: false, default: false },

  /**
   * Extra error text (i.e. non-standard error) to override default
   * error text supplied in `text` attribute or if you need to provide
   * HTML content in your error messages (e.g. a link to more information)
   *
   * @property {string} extraError
   */
  extraError: { type: String, required: false, default: '' },

  /**
   * Icon to be rendered before error text
   *
   * @property {string} icon
   */
  icon: { type: String, required: false, default: '' },

  /**
   * ID of the error message block
   *
   * @property {string} id
   */
  id: { type: String, required: true },

  /**
   * Whether or not add extra space above the error
   *
   * @property {boolean} spaceAbove
   */
  spaceAbove: { type: Boolean, required: false, default: false },

  /**
   * Whether or not the error message should be shown at all
   *
   * @property {boolean} showError
   */
  show: { type: Boolean, required: false, default: false },

  /**
   * Default error text to show the user (if the error should be shown)
   *
   * @property {string} text
   */
  text: { type: String, required: false, default: '' },

  /**
   * Type of error being shown
   *
   * (This determines the colour of the error message text)
   *
   * @property {string} type
   */
  type: { type: String, required: false, default: 'error' },
});

const showError = computed(() => (props.show || props.externalInvalid));

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

  let output = (props.show === true || props.externalInvalid === true)
    ? `${tmp} ${tmp}--show`
    : tmp;

  if (props.spaceAbove === true) {
    output += ` ${tmp}--checkable`;
  }

  return `text-[1.25rem] material-symbols-rounded ${output}`;
});
</script>
