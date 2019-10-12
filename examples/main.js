import Vue from 'vue'
import App from './App.vue'
import DragSelect from 'vue-drag-select-pro'


import 'vue-drag-select-pro/lib/vueDragSelectPro.css'


Vue.use(DragSelect)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
