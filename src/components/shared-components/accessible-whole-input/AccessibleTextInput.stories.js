// import { fn } from 'storybook/test';

import AccessibleTextInput from './AccessibleTextInput.vue';
// import AccessibleTextInput from '../components/shared-components/accessible-whole-input/accessible-text-input.vue';

export default {
  component: AccessibleTextInput,
  title: 'Components/Form inputs/AccessibleTextInput',
  // description: 'blah',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<ul><story/></ul>' })],
  argTypes: {
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
    validationType: { control: { type: 'select' }, options: ['addressline', 'email', 'name', 'title', 'url'] },
  //   watchBlur: { control: { type: 'boolean' } },
  },
  // args: { required: fn() },
}

export const Default = {
  args: {
    id: 'basic-text-input',
    label: 'Text input',
  },
};

export const Optional = {
  args: {
    id: 'optional-text-input',
    label: 'Optional input',
    required: false,
    requiredRev: true,
  },
};

export const Required = {
  args: {
    id: 'required-text-input',
    label: 'Required input [Standard]',
    required: true,
  },
};

export const RequiredRev = {
  args: {
    id: 'required-rev-text-input',
    label: 'Required input [reverse]',
    required: true,
    requiredRev: true,
  },
};

export const Help = {
  args: {
    id: 'help-last-text-input',
    help: 'This is some help text',
    label: 'Input with help',
  },
};

export const HelpFirst = {
  args: {
    help: 'This is some help text',
    helpFirst: true,
    id: 'help-first-text-input',
    label: 'Input with help (first)',
  },
};

export const ExternalInvalid = {
  description: 'stuff',
  args: {
    errorMsg: 'Please fill in the input',
    externalInvalid: true,
    id: 'external-invalid-text-input',
    label: 'Input with external invalid',
  },
};

export const MultiLine = {
  description: 'stuff',
  args: {
    id: 'multi-line-text-input',
    label: 'Multi-line Input (textarea)',
    multiLine: true,
  },
};
