<template>
  <span v-if="showStr">{{ str }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /**
   * String to render when input is optional and `requiredRev` is `TRUE`
   *
   * @property {string} optionalStr
   */
  optionalStr: { type: String, required: false, default: '(optional)'},

  /**
   * Whether or not the user is required to populate the input field
   * value
   *
   * @property {boolean} required
   */
  required: { type: Boolean, required: false, default: false },

  /**
   * Whether or not show the `optionalStr` if the field *is not*
   * rquired and hide the `requiredStr` if the field *is* required.
   *
   * @property {boolean} required
   */
  requiredRev: { type: Boolean, required: false, default: false },

  /**
   * String to render when input is required and `requiredRev` is `FALSE`
   *
   * @property {string} optionalStr
   */
  requiredStr: { type: String, required: false, default: '(required)'},
});

const showStr = computed(() => (props.required !== props.requiredRev));

const str = computed(() => { // eslint-disable-line arrow-body-style
  return (props.required === true)
    ? props.requiredStr
    : props.optionalStr;
});
</script>
