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

### Import

``` javascript {3,4,5}

import Vue from 'vue'
import App from './App.vue'

import vueDragSelectPro from 'vue-drag-select-pro'
// 注意：一定要引入css样式
import 'vue-drag-select-pro/lib/vueDragSelectPro.css'
Vue.use(vueDragSelectPro)

```

### Usage

``` jsx
<template>
  <div>
    <vue-drag-select v-model="selectedList" valueKey="name" :itemMargin="[0, 10, 10, 0]" ref="dragSelect">
      <template v-for="(item, index) in dataList">
        <drag-select-option :key="item.id" :value="item" :itemIndex="index">
          <div class="item-self">
            // 自定义内容
          </div>
        </drag-select-option>
      </template>
    </vue-drag-select>
  </div>
</template>
export default {
  data () {
    return {
      selectedList: [],
      dataList: []
    }
  }
}
```

### Select Attributes
参数 | 说明 | 类型 | 默认值
-|-|-|-
value | 绑定选中值 | Array | []
value-key | 作为 value 唯一标识的键名，option绑定值为对象类型时必填 | string | value |
item-width | option元素的宽度 | Number | 100
item-height | option元素的高度 | Number | 105
item-margin | option元素的margin | Array(number) | [20,20,20,20]
warpper-padding | 内容器的padding | Array(number) | [20,20,20,20]
slow-speed | 滚动的最小速度 | Number | 0
fast-speed | 滚动的最大速度 | Number | 20

### Select Methods
方法名  | 说明 | 参数 |
-|-|-
elementLayout | 重排option位置 | -

### option Attributes
参数 | 说明 | 类型 | 默认值
-|-|-|-
value | option绑定值 | string/number/object | -
item-index | 用于选择项排序(就传遍历时的index,很重要！！！) | Number |  -

![](https://github.com/singmeToSE/vue-drag-select/raw/master/src/assets/imgs/readme.gif)
