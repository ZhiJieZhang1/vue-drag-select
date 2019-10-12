import vueDragSelect from './src/vue-drag-select.vue'

vueDragSelect.install = function (Vue) {
  Vue.component(vueDragSelect.name, vueDragSelect)
}

export default vueDragSelect;