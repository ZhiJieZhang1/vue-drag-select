import Vue from 'vue'
import App from './App.vue'
import DragSelect from '../src/index.js'

Vue.use(DragSelect)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
