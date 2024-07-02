import Vue from 'vue'
import App from './App.vue'

// install之后的使用
// import vueDragSelectPro from 'vue-drag-select-pro'
// import 'vue-drag-select-pro/lib/vueDragSelectPro.css'

// 本项目demo使用
import vueDragSelectPro from '../src'

Vue.use(vueDragSelectPro)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
