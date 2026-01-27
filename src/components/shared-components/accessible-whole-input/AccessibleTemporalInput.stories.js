// import { fn } from 'storybook/test';

import AccessibleTemporalInput from './AccessibleTemporalInput.vue';
import { getGenericFieldProps, getWrapperProps, propsToPropValues } from './accessible-whole-input.utils';
// import AccessibleTextInput from '../components/shared-components/accessible-whole-input/accessible-text-input.vue';


export default {
  component: AccessibleTemporalInput,
  title: 'Components/Form inputs/AccessibleTemporalInput',
  name: 'blah blah',
  // description: 'blah',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<ul><story/></ul>' })],

  parameters: {
    docs: {
      description: {
        component: "AccessibleTemporalInput is a complete user input field for temporal (date, time & date/time) fields. It handles ensuring that the label, input box(s), help text and error messages are rendered consistently and meet accessibility requirments"
      },
    }
  },
};

export const Default = {
  args: {
    id: 'basic-date-input',
    label: 'Date input',
  },
};

export const DateTime = {
  args: {
    id: 'basic-datetime-input',
    label: 'Date input',
    mode: 'datetime',
  },
};

export const Time = {
  args: {
    id: 'basic-time-input',
    label: 'Time input',
    mode: 'time',
  },
};

export const ThreePartDate = {
  args: {
    id: 'three-part-date-input',
    label: 'Three part date input',
    mode: '3date',
  },
};
