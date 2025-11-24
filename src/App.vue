<script setup>
import { ref } from 'vue';
import AccessibleWholeInput from './components/shared-components/accessible-whole-input/accessible-whole-input.vue'

const onChange = (event) => {
  console.group('<App>.onChange()');
  console.log('event:', event);
  console.groupEnd();
}

const onKeyUp = (event) => {
  console.group('<App>.onKeyUp()');
  console.log('event:', event);
  console.groupEnd();
}

const descBy = ref(undefined);

const updateDescBy = (ids) => {
  descBy.value = ids;
}
</script>

<template>
  <AccessibleWholeInput
    id="vite-vue"
    help-first
    label="Accessible Whole Input"
    validate-on-keyup
    v-on:updateDescByIDs="updateDescBy">
    <template v-slot:default>
      <input
        :aria-describedby="descBy"
        type="text"
        id="vite-vue"
        pattern="[A-Z][a-z\d]+\d"
        value=""
        v-on:change="onChange"
        v-on:keyup="onKeyUp" />
    </template>
    <template v-slot:help>
      This is some help text
    </template>
  </AccessibleWholeInput>
</template>

<style scoped>
</style>
