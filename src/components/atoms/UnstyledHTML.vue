<template>
  <p v-if="renderMode === 'p'" class="text-body-md" v-html="content"></p>
  <span v-else-if="renderMode === 'span'" class="text-body-md" v-html="content"></span>
  <div v-else-if="renderMode === '*'" class="text-body-md" v-html="content"></div>
</template>

<script setup>
import { computed } from 'vue';

// NOTE: I'm deliberately NOT using the built in Vue `<component />`
//       component because of possible issues relating to using the
//       v-html attribute `<component />`.
//       Also, the rendering logic above is simple enough there's not
//       enough benefit to using `<component />`.

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  content: { type: String, required: true },
  tag: { type: String, required: false, default: 'div' },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

//  END:  Local state
// --------------------------------------------------
// START: Computed properties

const renderMode = computed(() => { // eslint-disable-line arrow-body-style
  return (props.tag === 'p' || props.tag === 'span')
    ? props.tag
    : '*';
});

//  END:  Computed properties
// --------------------------------------------------
// START: Event handlers

//  END:  Event handlers
// --------------------------------------------------
// START: Lifecycle methods
</script>
