<template>
  <span v-if="showStr">{{ str }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  optionalStr: { type: String, required: false, default: '(optional)'},
  required: { type: Boolean, required: false, default: false },
  requiredRev: { type: Boolean, required: false, default: false },
  requiredStr: { type: String, required: false, default: '(required)'},
});

const showStr = computed(() => (props.required !== props.requiredRev));

const str = computed(() => { // eslint-disable-line arrow-body-style
  return (props.required === true)
    ? props.requiredStr
    : props.optionalStr;
});
</script>
