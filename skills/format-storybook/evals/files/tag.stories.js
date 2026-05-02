import { Template } from './template.js';

export default {
  title: 'Components/Tag',
  component: 'Tag',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'], table: { category: 'Variant' } },
    showRemove: { control: 'boolean', table: { category: 'Variant' } },
    isDisabled: { control: 'boolean', table: { category: 'State' } },
    label: { control: 'text', table: { category: 'Content' } }
  },
  args: {
    size: 'md',
    showRemove: false,
    isDisabled: false,
    label: 'Label'
  }
};

export const Default = Template.bind({});
Default.args = {};
