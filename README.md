<p align="center">
  <img src="https://github.com/singmeToSE/vue-drag-select/raw/master/src/assets/imgs/logo.png">
</p>
<p align="center">
  <a href="https://www.travis-ci.org/JanssenZhang/vue-drag-select" target="_blank">
    <img src="https://travis-ci.org/JanssenZhang/vue-drag-select.svg?branch=master"/>
  </a>
  <a href="https://www.npmjs.com/package/vue-drag-select-pro" target="_blank">
    <img src="https://img.shields.io/npm/v/vue-drag-select-pro"/>
  </a>
  <a href="https://github.com/JanssenZhang/vue-drag-select/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"/>
  </a>
</p>

基于Vue的鼠标拖拽选择组件

## Demo

[online demo](https://janssenzhang.github.io/vue-drag-select/)

## Getting Started

## Install

```sh
npm install vue-drag-select-pro --save
```

```sh
yarn add vue-drag-select-pro
```

## Document

### import

``` javascript {3,4,5}
import Vue from 'vue'
import App from './App.vue'

import vueDragSelectPro from 'vue-drag-select-pro'
import 'vue-drag-select-pro/lib/vueDragSelectPro.css'
Vue.use(vueDragSelectPro)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

![](https://github.com/singmeToSE/vue-drag-select/raw/master/src/assets/imgs/readme.gif)
