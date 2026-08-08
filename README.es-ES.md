

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

Componente de selección por arrastre del ratón basado en Vue

![](https://github.com/singmeToSE/vue-drag-select/raw/master/src/assets/imgs/readme.gif)

## Demo

[demo en línea](https://zhijiezhang1.github.io/vue-drag-select/)

## Comenzando

## Instalación

```sh
npm install vue-drag-select-pro --save
```

```sh
yarn add vue-drag-select-pro
```

## Documentación

### Importación

``` javascript {3,4,5}

import Vue from 'vue'
import App from './App.vue'

import vueDragSelectPro from 'vue-drag-select-pro'
// Nota: es obligatorio importar los estilos CSS
import 'vue-drag-select-pro/lib/vueDragSelectPro.css'
Vue.use(vueDragSelectPro)

```

### Uso

``` jsx
<template>
  <div>
    <vue-drag-select v-model="selectedList" value-key="name" :item-margin="[0, 10, 10, 0]" ref="dragSelect">
      <template v-for="(item, index) in dataList">
        <drag-select-option :key="item.id" :value="item" :item-index="index">
          <div class="item-self">
            // Contenido personalizado
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

### Atributos del Selector
Propiedad | Descripción | Tipo | Valor predeterminado
-|-|-|-
value / v-model | Valor seleccionado vinculado | Array | []
value-key | Nombre de la clave que sirve como identificador único del valor; obligatorio cuando el valor de option es un objeto | string | value |
item-width | Ancho del elemento option | Number | 100
item-height | Altura del elemento option | Number | 105
item-margin | Margen del elemento option | Array(number) | [20,20,20,20]
warpper-padding | Padding del contenedor | Array(number) | [20,20,20,20]
slow-speed | Velocidad mínima de desplazamiento | Number | 0
fast-speed | Velocidad máxima de desplazamiento | Number | 20

### Métodos del Selector
Método | Descripción | Parámetros
-|-|-
elementLayout | Reorganizar la posición de los elementos option | -

### Atributos de Option
Propiedad | Descripción | Tipo | Valor predeterminado
-|-|-|-
value | Valor vinculado a option | string/number/object | -
item-index | Índice utilizado para ordenar los elementos seleccionados (pasa el índice del bucle, ¡es muy importante!) | Number | -
