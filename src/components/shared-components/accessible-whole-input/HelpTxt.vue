<template>
  <div
    v-if="_hasHelp === true"
    class="text-body-md text-grey-600 w-full max-w-md">
    <slot><p class="mb-0">{{ help }}</p></slot>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { hasContent } from '../../../utils/vue-utils';


const slots = useSlots();
// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * Help text to show the user to make the purpose or
   * requirements of the field clear
   *
   * > __Note:__ If you need to include HTML (e.g. a link) in the
   * >       error message use the "help" slot instead.
   *
   * @property {string} help
   */
  help: { type: String, required: false, default: '' },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

//  END:  Local state
// --------------------------------------------------
// START: Computed state

const _hasHelp = computed(() => hasContent(slots, props, 'default', 'help'));

//  END:  Computed state
// --------------------------------------------------
// START: Watcher methods

//  END:  Watcher methods
// --------------------------------------------------
// START: Lifecycle events

//  END:  Lifecycle events
// --------------------------------------------------
</script>
