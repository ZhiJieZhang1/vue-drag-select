import Vue from 'vue'
import App from './App.vue'

import vueDragSelectPro from 'vue-drag-select-pro'
import 'vue-drag-select-pro/lib/vueDragSelectPro.css'

Vue.use(vueDragSelectPro)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
