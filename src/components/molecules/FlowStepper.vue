<template>
  <div v-if="show === true" class="flex flex-col gap-2">
    <p class="uppercase">
      {{ label }}
      {{ step }}
      {{ joinTxt }}
      {{ count }}
    </p>
    <SemanticHeading
      v-if="isNonEmptyStr(heading)"
      :class="hClass"
      h-class="mb-0"
      :h-id="hId"
      :level="hLevel"
      :txt="heading" />
    <ul class="flex flex-row content-stretch gap-1 w-full">
      <li v-for="n in count" :class="stepClass(n)" :key="n">
        <span class="sr-only">
          {{ label }}
          {{ n }}
          {{ joinTxt }}
          {{ count }}:
          {{ status(n) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, watch } from 'vue';
import { isNonEmptyStr } from '../../utils/data-utils';
import SemanticHeading from '../atoms/SemanticHeading.vue';

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * The word (for screen readers) to identify the current/active
   * step in the step lists
   *
   * @property {string} activeTxt
   */
  activeTxt: { type: String, required: false, default: 'Active' },

  /**
   * The word (for screen readers) to identify the completed steps
   * step in the step lists
   *
   * @property {string} activeTxt
   */
  completeTxt: { type: String, required: false, default: 'Complete' },

  /**
   * The position of the current step the flow is in
   *
   * @property {number} step
   */
  count: { type: Number, required: true },

  /**
   * Sometimes you may want the heading to be above the number of
   * steps. If so, Set this to `TRUE`.
   *
   * __Note:__ `headFirst` is ignored if heading is empty
   *
   * @property {boolean} headFirst
   */
  headFirst: { type: Boolean, required: false, default: false },

  /**
   * Include a heading in the stepper
   *
   * @property {string} heading
   */
  heading: { type: String, required: false, default: '' },

  /**
   * ID used in the heading tag
   *
   * __Note:__ `hId` is ignored if heading is empty
   *
   * @property {string} hId
   */
  hId: { type: String, required: false, default: 'stepper' },

  /**
   * Heading level of the heading (e.g. 3 = `h3`)
   *
   * __Note:__ `hLevel` is ignored if heading is empty
   *
   * @property {number} hLevel
   */
  hLevel: { type: Number, required: false, default: 3 },

  /**
   * The joiner text to render between the step number and the total step count
   *
   * @property {string} joinTxt
   */
  joinTxt: { type: String, required: false, default: 'of' },

  /**
   * Label for the step
   *
   * @property {string} label
   */
  label: { type: String, required: false, default: 'Step' },

  /**
   * The word (for screen readers) to identify the yet to be completed
   * step in the step lists
   *
   * @property {string} activeTxt
   */
  pendingTxt: { type: String, required: false, default: 'Pending' },

  /**
   * The current position (step) the flow is in
   *
   * @property {number} step
   */
  step: { type: Number, required: true },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Computed properties

const hClass = computed(() => { // eslint-disable-line arrow-body-style
  const order = (props.headFirst === true)
    ? ' order-first'
    : '';

  return `mb-0${order}`;
});

const show = computed(() => props.step > 0 && props.count > 0);

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

const stepClass = (c) => {
  let active = '';

  if (c === props.step) {
    active = ' bg-sky-500';
  } else if (c < props.step) {
    active = ' bg-blue-500';
  }

  return `border border-blue-500${active} w-full h-3`;
};

const status = (c) => {
  if (c > props.step) {
    return props.pendingTxt;
  }
  return (c === props.step)
    ? props.activeTxt
    : props.completeTxt;
};

const checkStep = (val) => {
  if (val > props.count) {
    console.error(
      `Expected \`step\` value (${val}) to be less than \`count\` `
      + `value (${props.count})`,
    );
  }
};

const checkCount = (val) => {
  if (val < props.step) {
    console.error(
      `Expected \`count\` value (${val}) to be less than or equal to `
      + `\`step\` value (${props.count})`,
    );
  }
};

//  END:  Local methods
// --------------------------------------------------
// START: Event handlers

//  END:  Event handlers
// --------------------------------------------------
// START: Watcher methods

watch(() => props.step, checkStep);
watch(() => props.count, checkCount);

//  END:  Watcher methods
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(() => {
  checkStep(props.step);
  checkCount(props.count);
});

//  END:  Lifecycle events
// --------------------------------------------------
</script>
