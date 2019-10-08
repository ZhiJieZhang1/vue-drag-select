<template>
  <div
    class="drag-select-item"
    ref="dragSelectItem"
    :class="[itemSelected ? 'selected-item' : '']"
    @click="clickItem(value)"
  >
    <slot></slot>
  </div>
</template>

<script>
import { getValueByPath } from '../util/util'
export default {
  name: "DragSelectItem",
  props: {
    value: {
      required: true
    }
  },

  inject: ["dragSelect"],

  data() {
    return {
    };
  },

  created() {
    this.dragSelect.options.push(this);
  },

  computed: {
    isObject() {
      return (
        Object.prototype.toString.call(this.value).toLowerCase() ===
        "[object object]"
      );
    },
    itemSelected() {
      return this.contains(this.dragSelect.value, this.value);
    }
  },

  methods: {
    getItemStyle() {
      const {
        offsetTop,
        offsetLeft,
        clientWidth,
        clientHeight
      } = this.$refs.dragSelectItem;
      return {
        top: offsetTop,
        left: offsetLeft,
        width: clientWidth,
        height: clientHeight
      };
    },
    contains(arr = [], target) {
      if (!this.isObject) {
        return arr && arr.indexOf(target) > -1;
      } else {
        const valueKey = this.select.valueKey;
        return (
          arr &&
          arr.some(item => {
            return (
              getValueByPath(item, valueKey) ===
              getValueByPath(target, valueKey)
            );
          })
        );
      }
    },
    clickItem(val) {
      this.dragSelect.clickSelect(val)
    }
  }
};
</script>
<style lang='less'>
</style>