import ErrorMsg from "./ErrorMsg.vue";

export default {
  component: ErrorMsg,
  title: 'Components/Form inputs/Utility components/ErrorMsg',
  tags: ['autodocs'],

  argTypes: {
    type: { control: { type: 'select' }, options: ['error', 'info', 'warning', 'success', 'brand'] },
  },

  parameters: {
    docs: {
      description: {
        component: 'ErrorMsg is a simple component within the `<accessible-whole-input>` component for rendering user input field error messages.__Note:__ If you need complex HTML in your error message, use either the `default` slot or the `extraError` attribute'
      },
    }
  },
};

export const Default = {
  args: {
    id: 'simple-error',
    text: 'You did something wrong',
    show: true,
  }
};

export const HTMLError = {
  args: {
    id: 'html-error',
    extraError: 'You did something <a href="#">wrong</a>',
    show: true,
  }
};

export const HiddenError = {
  args:{
    id: "hidden-error",
    show: false,
    text: "You did something wrong",
  }
};

export const Warning = {
  args:{
    id: "warning-error",
    show: true,
    text: "You did something wrong",
    type: 'warning',
  }
};
