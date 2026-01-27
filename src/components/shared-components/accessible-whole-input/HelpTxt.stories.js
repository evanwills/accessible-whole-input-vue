import HelpTxt from "./HelpTxt.vue";

export default {
  component: HelpTxt,
  title: 'Components/Form inputs/Utility components/HelpTxt',
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: 'HelpTxt is a simple component used within the `<accessible-whole-input>` component for rendering help text associated with a user input field.__Note:__ If you need complex HTML in your help text, use the `default` slot.'
      },
    }
  },
};

export const Default = {
  args: {
    id: 'simple-help',
    help: 'Add some text to this field.',
  }
};

export const SlottedHelp = {
  args: {
    id: 'slotted-help',
  },
  render: (args) => ({
    component: { HelpTxt },
    setup() {
      return args;
    },
    template: `<help-txt :id="id" v-bind="args">Help text with <a href="#">link</a></help-txt>`
  }),
}
