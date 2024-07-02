<template>
  <div
    class="vue-drag-select-option"
    ref="vueDragSelectOption"
    :class="[itemSelected ? 'selected-item' : '']"
    :style="itemStyle"
    @click="clickItem"
  >
    <slot></slot>
  </div>
</template>

<script>
import { getValueByPath } from "../../../src/utils/util.js";
export default {
  name: "DragSelectOption",
  props: {
    value: {
      required: true
    },
    // 用于选择项排序
    itemIndex: {
      required: true
    }
  },

  inject: ["vueDragSelect"],

  data() {
    return {};
  },

  created() {
    this.vueDragSelect.options.push(this);
  },

  computed: {
    isObject() {
      return (
        Object.prototype.toString.call(this.value).toLowerCase() ===
        "[object object]"
      );
    },
    itemSelected() {
      return this.contains(this.vueDragSelect.value, this.value);
    },
    itemStyle() {
      const margin = this.vueDragSelect.itemMargin.map(item => item + 'px').join(' ')
      return {
        width: `${this.vueDragSelect.itemWidth}px`,
        height: `${this.vueDragSelect.itemHeight}px`,
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
      } = this.$refs.vueDragSelectOption;
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
        const valueKey = this.vueDragSelect.valueKey;
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
      this.vueDragSelect.clickSelect(this);
    }
  },
  beforeDestroy() {
    const index = this.vueDragSelect.options.indexOf(this);
    this.vueDragSelect.onOptionDestroy(index);
  }
};
</script>