<template>
  <ul>
    <AccessibleWholeInput
      id="vite-vue"
      help-first
      label="Accessible Whole Input"
      validate-on-input
      watch-blur
      v-on:updateDescByIDs="updateDescBy"
      v-on:externalblur="onExternalBlur">
      <template v-slot:default>
        <input
          :aria-describedby="descBy"
          type="text"
          id="vite-vue"
          pattern="[A-Z][a-z\d]+\d"
          value="chicken"
          v-on:change="onChange"
          v-on:input="onInput" />
      </template>
      <template v-slot:help>
        This is some help text
      </template>
    </AccessibleWholeInput>
    <AccessibleTextInput
      id="name"
      error-msg="Please enter your name"
      :external-invalid="externalInvalid"
      help="Enter your given name (must not start with a number)"
      label="Given name"
      value="Evan"
      validation-type="name"
      v-on:change="onChange"
      v-on:input="onInput"  />
  </ul>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import AccessibleWholeInput from './components/shared-components/accessible-whole-input/accessible-whole-input.vue';
import AccessibleTextInput from './components/shared-components/accessible-whole-input/accessible-text-input.vue';

const descBy = ref(undefined);
const externalInvalid = ref(false);

const onChange = (event) => {
  console.group('<App>.onChange()');
  console.log('event:', event);
  console.log('event.target:', event.target);
  console.log('event.target.value:', event.target.value);
  console.log('event.target.pattern:', event.target.pattern);
  console.log('event.target.checkValidity():', event.target.checkValidity());
  console.log('event.target.validity:', event.target.validity);
  console.groupEnd();
};

const onInput = (event) => {
  console.group('<App>.onInput()');
  console.log('event:', event);
  console.log('event.target:', event.target);
  console.log('event.target.value:', event.target.value);
  console.log('event.target.pattern:', event.target.pattern);
  console.log('event.target.checkValidity():', event.target.checkValidity());
  console.log('event.target.validity:', event.target.validity);
  console.log('event.target.validity.valid:', event.target.validity.valid);
  console.groupEnd();
};

const onExternalBlur = (event) => {
  console.group('<App>.onExternalBlur()');
  console.log('event:', event);
  console.groupEnd();
};

const updateDescBy = (ids) => {
  descBy.value = ids;
};

const updateExtInvalid = () => {
  console.group('<App>.onExternalBlur()');
  console.log('externalInvalid.value (before):', externalInvalid.value);
  externalInvalid.value = !externalInvalid.value;
  console.log('externalInvalid.value (after):', externalInvalid.value);
  console.groupEnd();
  setTimeout(updateExtInvalid, 20000);
}

onBeforeMount(() => {
  setTimeout(updateExtInvalid, 20000);
});
</script>

<style scoped>
</style>
