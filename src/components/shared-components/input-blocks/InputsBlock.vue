<template>
  <section class="input-block-2026 relative">
    <header>
      <StatusIndicator
          v-if="isNonEmptyStr(strings.inputStatus)"
          class="md:order-2 w-auto"
          :key="strings.inputStatus"
          :status="strings.inputStatus"
          type="details" />
      <SemanticHeading
        :h-class="hCLass"
        :h-id="inputsHeadID"
        :level="hLevel"
        :txt="heading" />
    </header>

    <div v-if="hasContentTop" class="mt-3">
      <slot name="help-top">
        <div class="text-body-md" v-html="helpTxtTop"></div>
      </slot>
    </div>

    <div class="">
      <div
        v-if="onlyEdit === false"
        :class="inputsViewClass"
        :aria-hidden="(noEdit === false)"
        ref="inputsBlockView">
        <slot name="view-values"></slot>
      </div>

      <div
        v-if="noEdit === false"
        :aria-describedby="_describedBy"
        :aria-labelledby="inputsHeadID"
        :class="inputsEditClass"
        ref="inputsBlockEdit"
        role="group">
        <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
        <!-- START: No Save -->
        <NoSave v-if="status === 'fail'" class="mb-4" />
        <!--  END:  No Save -->
        <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->

        <slot name="editable-fields"></slot>
      </div>
    </div>


    <div v-if="hasContentBottom" class="mt-3">
      <slot name="help-bottom">
        <div class="text-body-md" v-html="helpTxtBottom"></div>
      </slot>
    </div>

    <footer v-if="noEdit === false && _mode === 'read'">
      <button
        v-if="canConfirm"
        type="button"
        v-on:click="onClick($event, 'confirm')">Confirm {{ heading }} <span class="font-symbol content-['check_circle']"></span></button>
      <button
        class="btn btn-tertiary"
        type="button"
        v-on:click="onClick($event, 'edit')">Edit {{ heading }} <span class="font-symbol content-['edit']"></span></button>
      <button
        v-if="canDelete"
        type="button"
        v-on:click="onClick($event, 'delete')">Delete {{ heading }} <span class="font-symbol content-['delete']"></span></button>
    </footer>

    <footer v-if="noEdit === false && _mode !== 'read'">
      <button
        type="button"
        v-on:click="onClick($event, 'save')"></button>
    </footer>
  </section>
  <ModalDialogue />
</template>

<script setup>
import { computed, onBeforeMount, ref, useSlots } from 'vue';
import { isNonEmptyStr } from '../../../utils/data-utils';
import { hasContent } from '../../../utils/vue-utils';
import ConsoleLogger from '../../../utils/ConsoleLoggerDummy.class';
import ModalDialogue from '../../molecules/ModalDialogue.vue';
import StatusIndicator from '../../atoms/StatusIndicator.vue';
import SemanticHeading from '../../atoms/SemanticHeading.vue';
import NoSave from '../../molecules/NoSave.vue';

const slots = useSlots();

// --------------------------------------------------
// START: Emitted events

const emit = defineEmits(['action']);

//  END:  Emitted events
// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * Whether or not the user can confirm the current data is correct
   *
   * @property {boolean} canConfirm
   */
  canConfirm: { type: Boolean, required: false, default: false },

  /**
   * Whether or not the user can delete the current data
   *
   * @property {boolean} canDelete
   */
  canDelete: { type: Boolean, required: false, default: false },

  /**
   * Users has made changes, the changes are all valid and now they
   * can save if they want.
   *
   * @property {boolean} canSave
   */
  canSave: { type: Boolean, required: false, default: false },

  /**
   * The user must confirm that are sure they want to delete the
   * current data
   *
   * @property {boolean} canDelete
   */
  confirmConfirm: { type: Boolean, required: false, default: false },

  /**
   * The user must confirm that are sure they want to delete the
   * current data
   *
   * @property {boolean} canDelete
   */
  confirmDelete: { type: Boolean, required: false, default: false },

  /**
   * Users must confirm that the new/updated they are about to save
   * is valid and they are sure they want to save it.
   *
   * @property {boolean} canSave
   */
  confirmSave: { type: Boolean, required: false, default: false },

  /**
   * ID of the info block that describes why the inputs are used
   *
   * @property {string} describedBy
   */
  describedBy: { type: String, required: false, default: '' },

  /**
   * Shared help text that sits below the input fields
   *
   * @property {string} helpTxtBottom
   */
  helpTxtBottom: { type: String, required: false, default: '' },

  /**
   * Shared help text that sits above the input fields
   *
   * @property {string} helpTxtTop
   */
  helpTxtTop: { type: String, required: false, default: '' },

  /**
   * Level of HTML heading element to be used as the top heading
   * for this block of fields
   *
   * A number between 1 and 6 (default is "2")
   *
   * @property {number} hLevel
   */
  hLevel: { type: Number, required: false, default: 3 },

  /**
   * ID for the block of fields being rendered
   *
   * @property {string} inputId
   */
  inputId: { type: String, required: true },

  /**
   * Text to use as the heading of the inputs block
   *
   * @property {string} heading
   */
  heading: { type: String, required: false, default: '' },

  /**
   * Whether or not the user can delete the current data
   *
   * @property {boolean} canDelete
   */
  noEdit: { type: Boolean, required: false, default: false },

  /**
   * Inputs block is only ever in edit mode
   *
   * @property {boolean} onlyEdit
   */
  onlyEdit: { type: Boolean, required: false, default: false },

  /**
   * Action status of the input block
   *
   * @property {string} status;
   */
  status: { type: String, required: false, default: '' },

  /**
   *
   */
  mode: { type: String, required: false, default: 'read' },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

const _cLog = ref(null);
const showEdit = ref(false);
const strings = ref({});
const _mode = ref('read');

//  END:  Local state
// --------------------------------------------------
// START: local helper functions

//  END:  local helper functions
// --------------------------------------------------
// START: Computed properties

const hasContentBottom = computed(() => hasContent(slots, props, 'help-bottom', 'helpTxtBottom'));
const hasContentTop = computed(() => hasContent(slots, props, 'help-top', 'helpTxtTop'));

const _describedBy = computed(() => { // eslint-disable-line arrow-body-style
  return (props.describedBy.trim() !== '')
    ? props.describedBy
    : undefined;
});

const inputsEditClass = computed(() => { // eslint-disable-line arrow-body-style
  return (showEdit.value === false)
    ? 'hidden'
    : undefined;
});

const inputsViewClass = computed(() => { // eslint-disable-line arrow-body-style
  return (showEdit.value === true)
    ? 'hidden'
    : undefined;
});

/**
 * Get the ID for the inputs block heading
 *
 * @returns {string}
 */
const inputsHeadID = computed(() => props.inputId);

const hCLass = computed(() => {
  const mb = (props.status !== '')
    ? 'md:order-1'
    : '';

  return `text-heading-md mb-0 ${mb} scroll-mt-10`;
});

/**
 * Get the heading text for inputs block
 *
 * @returns {string}
 */
// const inputHeadTxt = computed(() => {
//   if (editing.value === false) {
//     return strings.value.blockTitle;
//   }

//   return (props.Add)
//     ? strings.value.create.heading
//     : strings.value.update.heading;
// });

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

const _initClog = () => {
  if (_cLog.value === null) {
    _cLog.value = new ConsoleLogger(
      '<inputs-block>',
      props.inputId,
      {
        props,
        refs: {
        },
      },
      false,
    );
  }
};

//  END:  Local methods
// --------------------------------------------------
// START: Event handlers

const onClick = ($event, action) => {
  if (action === 'edit') {
    showEdit.value = true;
  } else if (action === 'close') {
    showEdit.value = false;
  }

  emit('action', action);
}

//  END:  Event handlers
// --------------------------------------------------
// START: Watcher methods

//  END:  Watcher methods
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(() => {
  _initClog();
});

//  END:  Lifecycle events
// --------------------------------------------------
</script>
