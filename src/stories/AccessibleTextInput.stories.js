import { fn } from 'storybook/test';

import AccessibleTextInput from '../component/shared/accessible-text-input/AccessibleTextInput.vue';

export default {
  title: 'AccessibleTextInput',
  component: AccessibleTextInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: { onInput: fn() },
}
