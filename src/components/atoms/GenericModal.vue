<template>
  <dialog
    :class="wrapClass"
    ref="genericDialogModal"
    v-on:cancel="handleCancel"
    v-on:keydown="handleKey"
    v-on:keypress="handleKey">
    <!--
     ! We want users read through the modal content before they get
     ! to the close button.
     ! The following background click button is hidden from
     ! assistive technologies because there is an accessible close
     ! button within the main modal content area.
     ! -->
    <button
      v-if="noManualClose === false"
      aria-hidden
      class="block fixed top-0 right-0 bottom-0 left-0 width-full
        height-full bg-transparent text-transparent cursor-auto"
      type="button"
      v-on:click="handleManualClose">Close</button>
    <div :class="wrapInnerClass">
      <slot></slot>
      <button
        v-if="noManualClose === false"
        class="absolute text-[1.5rem] pl-4 pr-5 pt-4 pb-3 font-symbol
          absolute top-0 right-0"
        type="button"
        v-on:click="handleManualClose">
        close
      </button>
    </div>
  </dialog>
</template>

<script setup>
import {
  computed,
  onBeforeMount,
  onMounted,
  onUpdated,
  ref,
} from 'vue';
import { doCloseModal, doShowModal } from '../../utils/vue-utils';

const emit = defineEmits(['close']);

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * Override the default max width of the modal
   *
   * Options are:
   * * 'sm' - 368px (23rem)
   * * 'md' (default) - 404px (25.25rem)
   * * 'lg' - 440px (27.5rem)
   * * 'xl' - 476px (29.75)
   * * 'full' - full width less 1rem margin (2rem for larger screens)
   *
   * @property {string} maxWidth
   */
  maxWidth: { type: String, required: false, default: 'base' },

  /**
   * Whether or not this `<generic-modal>` has one or more sibling
   * `<generic-modal>` either side of it.
   *
   * There is a known browser bug in both Chrome & Firefox where if
   * two modals are rendered side by side, the placement second modal
   * is fixed to the bottom of the window.
   *
   * @property {boolean} multi
   */
  multi: { type: Boolean, required: false, default: false },

  /**
   * Whether or not the user is prevented from closing this modal
   * usually because a loading state is being shown.
   *
   * @property {boolean} noManualClose
   */
  noManualClose: { type: Boolean, required: false, default: false },

  /**
   * Whether or not this dialogue is open in "modal" mode
   *
   * @property {boolean} open
   */
  open: { type: Boolean, required: true },
});

/**
 * Dialog element to be used when calling HTMLDialogElement.open()
 * & HTMLDialogElement.close()
 *
 * @var {Ref<null|HTMLDialogElement} genericDialogModal
 */
const genericDialogModal = ref(null);

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

//  END:  Local state
// --------------------------------------------------
// START: Computed properties

const wrapClass = computed(() => { // eslint-disable-line arrow-body-style
  let maxWidth = 'max-w-[25.25rem]';

  switch (props.maxWidth) { // eslint-disable-line default-case
    case 'sm':
      maxWidth = 'max-w-[23rem]';
      break;

    case 'lg':
      maxWidth = 'max-w-[27.5rem]';
      break;

    case 'xl':
      maxWidth = 'max-w-[29.75rem]';
      break;

    case 'full':
      maxWidth = 'h-[calc(100%-2rem)]';
  }

  const multi = (props.multi === true)
    ? ' double-modal'
    : '';

  return 'generic-modal backdrop:bg-grey-900 backdrop:bg-opacity-80'
    + ' bg-white w-[calc(100%-2rem)] rounded shadow-lg '
    + `${maxWidth}${multi}`;
});

/**
 * Classes to apply to the inner div of the dialog component
 *
 * @var {ComputedRef<string>} wrapInnerClass
 */
const wrapInnerClass = computed(() => {
  const top = (props.noManualClose === true)
    ? 'p-6'
    : 'px-6 pb-6 pt-14';

  return `relative ${top}`;
});

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

const handleManualClose = (event) => {
  if (props.noManualClose === true) {
    event.preventDefault();
  } else {
    doCloseModal(genericDialogModal.value);
    emit('close', 'close');
  }
};

const handleCancel = (event) => {
  if (props.noManualClose === true) {
    event.preventDefault();
  } else {
    emit('close', 'close');
  }
};

const handleKey = (event) => {
  if (event.key === 'Escape') {
    handleCancel(event);
  }
};

const openClose = () => {
  if (props.open === true) {
    doShowModal(genericDialogModal.value);
  } else {
    doCloseModal(genericDialogModal.value);
  }
};

//  END:  Local methods
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(openClose);
onMounted(openClose);
onUpdated(openClose);

//  END:  Lifecycle events
// --------------------------------------------------
</script>
