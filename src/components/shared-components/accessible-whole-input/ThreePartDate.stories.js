import ThreePartDate from './ThreePartDate.vue';

export default {
  component: ThreePartDate,
  title: 'Components/Form inputs/Custom fields/ThreePartDate',
  tags: ['autodocs'],
  argTypes: {
    // autoFocusNext: { control: { type: 'boolean' } },
  },

  parameters: {
    docs: {
      description: {
        component: 'ThreePartDate fields is a custom rendering/implementation of a date field that provides separate Day, Month & Year input boxes. __Note:__ invalid characters are automatically stripped',
      },
    },
  },
};

export const Default = {
  args: {
    fieldId: 'three-part-date',
  },

};

export const Min_2026_01_25 = {
  title: 'ThreePartDate 2026-01-25',
  args: {
    fieldId: 'three-part-date',
    min: '2026-01-25',
  },
};

export const AutoFocusNext = {
  title: 'ThreePartDate 2026-01-25',
  args: {
    fieldId: 'three-part-date',
    autoFocusNext: true,
  },
};
