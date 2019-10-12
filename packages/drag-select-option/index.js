import dragSelectOption from '../vue-drag-select/src/drag-select-option.vue'

dragSelectOption.install = function (Vue) {
  Vue.component(dragSelectOption.name, dragSelectOption)
}

export default dragSelectOption;