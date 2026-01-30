<template>
  <div class="semantic-heading relative">
    <component :is="hTag" :class="getHclass" :id="hId">
      <span v-if="hasIcon" class="material-symbols-rounded">{{ icon }}</span>
      <span v-if="html === true" v-html="txt"></span>
      <span v-else>{{ txt }}</span>
    </component>
    <AnchorLink v-if="showLink" :anchor="hId" :show="showLink" :txt="txt" />
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeMount,
  ref,
} from 'vue';
import { getEpre } from '../../utils/general-utils';
import AnchorLink from './AnchorLink.vue';

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  hClass: { type: String, required: false, default: '' },
  hId: { type: String, required: true },
  html: { type: Boolean, required: false, default: false },
  icon: { type: String, required: false, default: '' },
  level: { required: false, default: 2 },
  showLink: { type: Boolean, required: false, default: false },
  txt: { type: String, required: false, default: '' },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

const hTag = ref('h2');
const ePre = ref(null);

//  END:  Local state
// --------------------------------------------------
// START: Computed properties

const getHclass = computed(() => {
  let output = '';

  if (props.hClass.includes('mb-') === false) {
    output += 'mb-12';
  }

  if (props.centred === true) {
    output += ' text-center';
  }

  if (props.hClass.includes('text-heading-') === false) {
    output += ' text-heading-lg';
  }

  if (props.hClass.trim() !== '') {
    output += ` ${props.hClass}`;
  }

  return output;
});

const hasIcon = computed(() => { // eslint-disable-line arrow-body-style
  return (props.icon.trim() !== '');
});

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

//  END:  Local methods
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(() => {
  const hType = typeof props.level;
  let tmp = 2;

  if (ePre.value === null) {
    ePre.value = getEpre('sematic-heading', props.hId);
  }

  if (hType === 'string') {
    tmp = parseInt(props.level, 10);
  } else if (hType === 'number') {
    tmp = props.level;
  }

  const hlevel = (tmp >= 1 && tmp <= 6)
    ? tmp
    : 2;

  hTag.value = `h${hlevel}`;
});

//  END:  Lifecycle events
// --------------------------------------------------
</script>
