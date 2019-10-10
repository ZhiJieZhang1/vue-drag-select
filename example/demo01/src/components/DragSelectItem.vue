<template>
  <div
    class="drag-select-item"
    ref="dragSelectItem"
    :class="[itemSelected ? 'selected-item' : '']"
    :style="itemStyle"
    @click="clickItem"
  >
    <slot></slot>
  </div>
</template>

<script>
import { getValueByPath } from "../util/util";
export default {
  name: "DragSelectItem",
  props: {
    value: {
      required: true
    },
    // 用于选择项排序
    itemIndex: {
      required: true
    }
  },

  inject: ["dragSelect"],

  data() {
    return {};
  },

  created() {
    this.dragSelect.options.push(this);
    // this.dragSelect.options.unshift(this);
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
    },
    itemStyle() {
      const margin = this.dragSelect.itemMargin.map(item => item + 'px').join(' ')
      return {
        width: `${this.dragSelect.itemWidth}px`,
        height: `${this.dragSelect.itemHeight}px`,
        margin,
      }
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
        const valueKey = this.dragSelect.valueKey;
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
    clickItem() {
      this.dragSelect.clickSelect(this);
    }
  },
  beforeDestroy() {
    const index = this.dragSelect.options.indexOf(this);
    this.dragSelect.onOptionDestroy(index);
  }
};
</script>
<style lang='less'>
</style>