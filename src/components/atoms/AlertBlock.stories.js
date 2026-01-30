import AlertBlock from './AlertBlock.vue';

export default {
  component: AlertBlock,
  title: 'Atoms/AlertBlock',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: [
        'error',
        'brand',
        'info',
        'success',
        'warning',
      ],
    }
  }
}

export const Default = {
  args: {
    body: 'This is some alert text',
    heading: 'Alert heading',
  },
};

export const NoHeading = {
  args: {
    body: 'This is some alert text',
  },
};

export const AlertAsNotice = {
  args: {
    body: 'This is some alert text',
    heading: 'Alert heading',
    notice: true,
  },
};

export const Dismissable = {
  args: {
    body: 'This is some alert text',
    heading: 'Alert heading',
    dismissable: true,
  },
};
