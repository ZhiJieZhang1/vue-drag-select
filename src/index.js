import vueDragSelect from '../packages/vue-drag-select/index.js';
import dragSelectOption from '../packages/drag-select-option/index.js';

const components = [
  vueDragSelect,
  dragSelectOption
];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.0.1',
  install,
  vueDragSelect,
  dragSelectOption
};