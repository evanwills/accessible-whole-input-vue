import FlowStepper from './FlowStepper.vue';

export default {
  component: FlowStepper,
  title: 'Components/Molecules/FlowStepper',
  tags: ['autodocs'],
  argTypes: {
    // autoFocusNext: { control: { type: 'boolean' } },
  },

  parameters: {
    docs: {
      description: {
        component: 'FlowStepper indicates the current step the user is at in a given work flow',
      },
    },
  },

  argTypes: {
    hLevel: {
      control: { type: 'select' },
      options: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
      ],
    },
  }
};

export const Default = {
  args: {
    count: 6,
    step: 2,
  }
};

export const StepperWithHeading = {
  args: {
    count: 7,
    heading: 'Contact details',
    hId: 'default-flow-stepper',
    step: 3,
  }
};

export const StepperWithHeadingFirst = {
  args: {
    count: 7,
    heading: 'Personal details',
    hId: 'default-flow-stepper',
    step: 1,
    headFirst: true,
  }
};

export const CustomLabel = {
  args: {
    count: 9,
    label: 'Action',
    step: 4,
  }
};

export const CustomJoinLabel = {
  args: {
    count: 15,
    joinTxt: 'in',
    label: 'Action',
    step: 9,
  }
};

export const HiddenIfCountAttributeIsInvalid = {
  args: {
    count: 0,
    step: 2,
  },

  parameters: {
    docs: {
      description: {
        story: "If the `count` attribute is not a number, or less than 1 the stepper will not be rendered"
      },
    }
  },
};

export const HiddenIfStepAttributeIsInvalid = {
  args: {
    count: 6,
    step: 0,
  },

  parameters: {
    docs: {
      description: {
        story: "If the `step` attribute is not a number, or less than 1 the stepper will not be rendered"
      },
    }
  },
};
