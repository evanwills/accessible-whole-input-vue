import RequiredStr from "./RequiredStr.vue";

export default {
  component: RequiredStr,
  title: 'Components/Form inputs/Utility components/RequiredStr',
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: 'RequiredStr is a simple component within the `<accessible-whole-input>` component for rendering "(optional)" or "(required)" depending on whether `required` is `FALSE` *and* `requiredRev` is `TRUE` or `required` is `TRUE` *and* `requiredRev` is `FALSE` (respectively).'
      },
    }
  },
};

export const Default = {
  args: {
    id: 'simple-error',
    required: true,
  }
};

export const OptionalReverse = {
  args: {
    id: 'simple-error',
    requiredRev: true,
  }
};

export const CustomRequired = {
  args: {
    id: 'simple-error',
    required: true,
    requiredStr: 'Fill this in or else!!!',
  }
};

export const CustomOptionalReverse = {
  args: {
    id: 'simple-error',
    requiredRev: true,
    optionalStr: 'Only enter one'
  }
};

export const DefaultOptional = {
  args: {
    id: 'simple-error',
    requiredRev: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Nothing is shown because the field is optional and `requiredRev` is `FALSE`.'
      },
    },
  },
};

export const ReverseRequired = {
  args: {
    id: 'simple-error',
    required: true,
    requiredRev: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Nothing is shown because the field is required and `requiredRev` is `TRUE`.'
      },
    },
  },
};
