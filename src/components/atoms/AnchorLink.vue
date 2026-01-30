<template>
  <a
    :class="getLinkClass"
    :href="`#${anchor}`"
    v-on:click="copyLink($event)">
    <span v-if="show" class="material-symbols-rounded">content_copy</span>
    <span class="sr-only">Get link to {{ txt }}</span>
  </a>
</template>

<script setup>
import {
  computed,
} from 'vue';

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  anchor: { type: String, required: true },
  txt: { type: String, required: true },
  show: { type: Boolean, required: false, default: false },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

//  END:  Local state
// --------------------------------------------------
// START: Computed properties

const getLinkClass = computed(() => {
  let tmp = 'absolute -top-8 left-0 inline-block w-8 h-8'; //  tsf-focus

  tmp += (props.showLink === true)
    ? ' tsf-focus'
    : ' opacity-0';

  return tmp;
});

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

const copyLink = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location);
  }
};

//  END:  Local methods
// --------------------------------------------------
// START: Lifecycle events

//  END:  Lifecycle events
// --------------------------------------------------
</script>
