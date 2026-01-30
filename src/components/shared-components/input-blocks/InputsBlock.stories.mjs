import InputsBlock from './InputsBlock.vue';

export default {
  component: InputsBlock,
  title: 'Components/Forms/InputsBlock',
  tags: ['autodocs'],
  argTypes: {
    // autoFocusNext: { control: { type: 'boolean' } },
  },

  parameters: {
    docs: {
      description: {
        component: 'InputsBlock is a wrapper for descrete groups of form fields',
      },
    },
  },
};

export const Default = {
  args: {
    heading: 'Inputs block',
    inputId: 'default-inputs-block',
  }
}
