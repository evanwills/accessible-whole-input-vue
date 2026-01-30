<template>
  <p class="flex flex-col md:flex-row justify-center items-stretch gap-3 w-full mt-6 mb-0">
    <button
      v-if="confirmBtnTxt !== ''"
      :class="confirmClass"
      :key="confirmBtnTxt"
      type="button"
      v-on:click="emitAction($event, 'confirm')">
      {{ confirmBtnTxt }}
      <span class="sr-only">{{ srOnly }}</span>
    </button>
    <button
      v-if="cancelBtnTxt !== ''"
      class="grow-1 btn-sec btn-lg !min-w-40"
      :key="cancelBtnTxt"
      type="button"
      v-on:click="emitAction($event, 'cancel')">
      {{ cancelBtnTxt }}
      <span class="sr-only">{{ srOnly }}</span>
    </button>
  </p>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /**
   * Text to show in cancel button (Default: "Cancel")
   *
   * > __Note:__ If `cancelBtnTxt` is empty, it will not be rendered
   *
   * @property {string} cancelBtnTxt
   */
  cancelBtnTxt: { type: String, required: false, default: 'Cancel' },

  /**
   * Text to show in confirm button (Default: "" - empty string)
   *
   * > __Note:__ If `confirmBtnTxt` is empty, it will not be rendered
   *
   * @property {string} confirmBtnTxt
   */
  confirmBtnTxt: { type: String, required: false, default: '' },

  /**
   * Whether or not confirm button should be rendered as dangerous
   * (i.e. red)
   *
   * @property {boolean} confirmDanger
   */
  confirmDanger: { type: Boolean, required: false, default: false },

  /**
   * Whether or not confirm button should be rendered as disabled
   * (i.e. have cursor of forbidden)
   *
   * @property {boolean} confirmDisabled
   */
  confirmDisabled: { type: Boolean, required: false, default: false },

  /**
   * Text to be shown by assistive technologies to provide better
   * context for the button's action
   *
   * @property {string} srOnly
   */
  srOnly: { type: String, required: true },

  /**
   * Value to be emitted with the button click event
   *
   * @property {string} value
   */
  value: { type: String, required: false, default: '' },
});

const emit = defineEmits(['confirm', 'cancel']);

// buton wrap: sm:flex-row sm:justify-stretch items-center
const confirmClass = computed(() => {
  const colour = (props.confirmDanger === true)
    ? 'btn-pri-danger'
    : 'btn-pri';

  const cursor = (props.confirmDisabled === true)
    ? ' hover:cursor-not-allowed'
    : '';

  return `grow-1 btn-lg !min-w-40 ${colour}${cursor}`;
});

const emitAction = (_event, action) => {
  emit(action, props.value);
};
</script>
