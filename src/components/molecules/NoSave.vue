<template>
  <AlertBlock>
    <p>
      {{ message }}
      Please refresh and try again.
      If the issue persists, please contact
      <em>Learning for Life</em> Contact Centre on
      <a href="tel:+611800280223" class="text-link whitespace-nowrap">1800 280 223</a>
      or email
      <a :href="href" class="text-link" v-html="wrappableEmail(tsfEmail, 'sm:hidden')"></a>
    </p>
  </AlertBlock>
</template>

<script setup>
import {
  computed,
  ref,
} from 'vue';

import AlertBlock from '../atoms/AlertBlock.vue';
import { wrappableEmail } from '../../utils/general-utils';

// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  subject: { type: String, required: false, default: '' },
  message: {
    type: String,
    required: false,
    default: 'There was an issue saving your data.',
  },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

const tsfEmail = ref('scholarshipsupport@thesmithfamily.com.au');

//  END:  Local state
// --------------------------------------------------
// START: Computed properties

const href = computed(() => {
  const subject = (props.subject.trim() !== '')
    ? `?subject=${props.subject}`
    : '';
  return `mailto:${tsfEmail.value}${subject}`;
});

//  END:  Computed properties
// --------------------------------------------------
</script>
