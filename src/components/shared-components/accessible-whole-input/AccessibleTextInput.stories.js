// import { fn } from 'storybook/test';

import AccessibleTextInput from './AccessibleTextInput.vue';

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
  //   helpLast: { control: { type: 'boolean' } },
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
    validationType: {
      control: { type: 'select' },
      options: [
        'addressline',
        'email',
        'name',
        'title',
        'url',
        'fixedphone',
        'mobilephone',
        'anyphone',
        'intphone',
      ],
    },
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
    errorMsg: 'Please fill in the input',
    help: 'This is some help text',
    id: 'help-last-text-input',
    label: 'Input with help',
  },
};

export const HelpLast = {
  args: {
    errorMsg: 'Please fill in the input',
    help: 'This is some help text but it sits below the input field',
    helpLast: true,
    id: 'help-first-text-input',
    label: 'Input with help (last)',
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
    value: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.',
  },
};

export const MultiLineAutoExpand = {
  description: 'stuff',
  args: {
    autoExpand: true,
    id: 'multi-line-text-input',
    label: 'Multi-line Input (textarea)',
    multiLine: true,
    value: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Adipiscing elit quisque faucibus ex sapien vitae pellentesque. Vitae pellentesque sem placerat in id cursus mi. Cursus mi pretium tellus duis convallis tempus leo. Tempus leo eu aenean sed diam urna tempor. Urna tempor pulvinar vivamus fringilla lacus nec metus.',
  },
};
