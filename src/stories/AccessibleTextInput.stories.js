import { fn } from 'storybook/test';

import AccessibleTextInput from '../components/shared-components/accessible-whole-input/accessible-text-input.vue';

export default {
  title: 'AccessibleTextInput',
  component: AccessibleTextInput,
  tags: ['autodocs'],
  argTypes: {
    autocomplete: { control: { type: 'text' } },
    autoExpand: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    errorMsg: { control: { type: 'text' } },
    errorMsgFunc: { control: { type: 'function' } },
    externalInvalid: { control: { type: 'boolean' } },
    help: { control: { type: 'text' } },
    helpFirst: { control: { type: 'boolean' } },
    hideLabel: { control: { type: 'boolean' } },
    id: { control: { type: 'text' } },
    group: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    maxlength: { control: { type: 'number' } },
    minlength: { control: { type: 'number' } },
    multiLine: { control: { type: 'boolean' } },
    multiple: { control: { type: 'boolean' } },
    pattern: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    readonly: { control: { type: 'boolean' } },
    required: { control: { type: 'boolean' } },
    requiredRev: { control: { type: 'boolean' } },
    spellcheck: { control: { type: 'boolean' } },
    tabindex: { control: { type: 'number' } },
    tag: { control: { type: 'text' } },
    value: { control: { type: 'text|number' } },
    values: { control: { type: 'object' } },
    validateOnInput: { control: { type: 'boolean' } },
    validationType: { control: { type: 'select' }, options: ['addressline', 'email', 'name', 'title', 'url'] },
    watchBlur: { control: { type: 'boolean' } },
  },
  args: { onInput: fn() },
}

