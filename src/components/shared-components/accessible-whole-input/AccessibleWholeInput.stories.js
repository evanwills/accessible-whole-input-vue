// import { fn } from 'storybook/test';

import AccessibleWholeInput from './AccessibleWholeInput.vue';

export default {
  component: AccessibleWholeInput,
  title: 'Components/Form inputs/Wrapper/AccessibleWholeInput',
  decorators: [() => ({ template: '<ul><story/></ul>' })],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: "`<AccessibleWholeInput>` provides the wrapper to make input fields accessible, by adding a label, help text, error messages and appropriate aria attributes where required"
      }
    }
  },
  // argTypes: {
  //   autocomplete: { control: { type: 'text' } },
  //   autoExpand: { control: { type: 'boolean' } },
  //   disabled: { control: { type: 'boolean' } },
  //   errorMsg: { control: { type: 'text' } },
  //   errorMsgFunc: { control: { type: 'function' } },
  //   externalInvalid: { control: { type: 'boolean' } },
  //   help: { control: { type: 'text' } },
  //   helpFirst: { control: { type: 'boolean' } },
  //   hideLabel: { control: { type: 'boolean' } },
  //   id: { control: { type: 'text' } },
  //   group: { control: { type: 'boolean' } },
  //   label: { control: { type: 'text' } },
  //   maxlength: { control: { type: 'number' } },
  //   minlength: { control: { type: 'number' } },
  //   multiLine: { control: { type: 'boolean' } },
  //   multiple: { control: { type: 'boolean' } },
  //   pattern: { control: { type: 'text' } },
  //   placeholder: { control: { type: 'text' } },
  //   readonly: { control: { type: 'boolean' } },
  //   required: { control: { type: 'boolean' } },
  //   requiredRev: { control: { type: 'boolean' } },
  //   spellcheck: { control: { type: 'boolean' } },
  //   tabindex: { control: { type: 'number' } },
  //   tag: { control: { type: 'text' } },
  //   value: { control: { type: 'text|number' } },
  //   values: { control: { type: 'object' } },
  //   validateOnInput: { control: { type: 'boolean' } },
  //   validationType: { control: { type: 'select' }, options: ['addressline', 'email', 'name', 'title', 'url'] },
  //   watchBlur: { control: { type: 'boolean' } },
  // },
  // args: { onInput: fn() },
}

export const Default = {
  args: {
    id: 'accessible-input-wrapper',
    label: 'Accessible input wrapper',
  },
  render: (args) => ({
    component: { AccessibleWholeInput },
    setup() {
      return args;
    },
    template: `<accessible-whole-input :id="id" :label="label" v-bind="args">(default slot: input fields)</accessible-whole-input>`
  }),
};
