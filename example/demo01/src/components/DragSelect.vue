<template>
  <div class="vue-drag-select" ref="vueDragSelect">
    <div class="select-wrap" @mousedown="onMouseDown" :style="{minHeight: minHeight + 'px'}">
      <slot></slot>
      <div
        v-show="mouseDown"
        class="vue-drag-select-box"
        :style="selectionBoxStyling">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DragSelect',
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    valueKey: {
      type: String,
      default: "value"
    },
  },

  provide() {
    return {
      dragSelect: this
    }
  },

  data () {
    return {
      // 子元素
      options: [],
      // 元素容器最小高度
      minHeight: 0,
      // 鼠标按下状态
      mouseDown: false,
      // 起始点
      startPoint: null,
      // 结束点
      endPoint: null,
      // 最终计算 结束点
      lastEndPoint: null,
      // 滚动状态
      scrollIng: false,
      // 自动滚动计时器
      autoScrollTimer: null,
      // 滚动方向 true 向下 false 向上
      scrollDirection: true,
      // 自动滚动速度
      scrollSpeed: 20,
      // 选框最终数据
      selectionBox: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      // 选框最终样式
      selectionBoxStyling: {
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px',
        borderWidth: '0px'
      },
      // 按键状态
      controlKeyDown: false,
      shiftKeyDown: false
    }
  },

  mounted() {
    this.elementLayout(200, 230)
    this.$el.addEventListener('scroll', this.boxScrollFn)
    this.detectKey()
  },

  computed: {
    currentValue: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {
    options() {
      debugger
      this.elementLayout(200, 230)
    }
  },

  methods: {
    boxAutoScroll () {
      const self = this
      self.scrollIng = true
      self.autoScrollTimer = setInterval(() => {
        if (!self.mouseDown) {
          clearInterval(self.autoScrollTimer)
          return
        }
        if (self.scrollDirection) {
          if ((self.$el.scrollTop + self.$el.offsetHeight) >= (self.minHeight - 20)) {
            clearInterval(self.autoScrollTimer)
            self.scrollIng = false
          } else {
            self.$el.scrollTop += self.scrollSpeed
          }
        } else {
          if (self.$el.scrollTop <= 0) {
            clearInterval(self.autoScrollTimer)
            self.scrollIng = false
          } else {
            self.$el.scrollTop -= self.scrollSpeed
          }
        }
      }, 16)
    },
    boxScrollFn () {
      this.computeLastEndPoint()
    },
    computeLastEndPoint () {
      if (!this.mouseDown || !this.startPoint || !this.endPoint) return
      const clientRect = this.$el.getBoundingClientRect()
      this.lastEndPoint = {
        x: this.endPoint.x - clientRect.left,
        y: this.endPoint.y - clientRect.top + this.$el.scrollTop
      }
      // 选择框属性计算
      const left = Math.min(this.startPoint.x, this.lastEndPoint.x)
      const top = Math.min(this.startPoint.y, this.lastEndPoint.y)
      const width = Math.abs(this.startPoint.x - this.lastEndPoint.x)
      const height = Math.abs(this.startPoint.y - this.lastEndPoint.y)
      this.selectionBox = {
        left,
        top,
        width,
        height
      }
      this.selectionBoxStyling = {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`
      }
    },
    onMouseDown (event) {
      // 阻止捕获到item
      if (event.target.className !== 'select-wrap') return
      // 忽略右键点击
      if (event.button === 2) return
      const clientRect = this.$el.getBoundingClientRect()
      // 注册开始点
      this.mouseDown = true
      this.startPoint = {
        x: event.pageX - clientRect.left,
        y: event.pageY - clientRect.top + this.$el.scrollTop
      }
      // 开始监听鼠标 移动，抬起 事件
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
    },
    onMouseMove (event) {
      if (!this.mouseDown) return
      const clientRect = this.$el.getBoundingClientRect()
      // 外容器底部到client顶部的距离
      const elBottom = clientRect.top + clientRect.height

      // this.endPoint.y = event.pageY
      if (event.pageY > (elBottom - 50)) {
        // 向下滚动
        this.scrollDirection = true
      }

      if (event.pageY < (clientRect.top + 50)) {
        // 向上滚动
        this.scrollDirection = false
      }

      // 判断是否开启滚动
      if ((event.pageY > (clientRect.top + 50)) && (event.pageY < (elBottom - 50))) {
        clearInterval(this.autoScrollTimer)
        this.scrollIng = false
      } else {
        // 可以开启滚动时，只开启一次滚动
        if (!this.scrollIng) {
          this.boxAutoScroll()
        }
        this.scrollSpeed = 10
      }
      if ((event.pageY < (clientRect.top)) || (event.pageY > elBottom)) {
        this.scrollSpeed = 20
      }
      this.endPoint = {
        x: event.pageX,
        y: event.pageY
      }
      if (!this.scrollIng) {
        this.computeLastEndPoint()
      }
    },
    onMouseUp () {
      // 清除事件
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
      // 重置状态
      this.mouseDown = false
      this.computeSelectedItems()
      this.startPoint = null
      this.endPoint = null
      this.lastEndPoint = null
      // 去除选框样式 隐藏选框
      this.selectionBoxStyling = {
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px',
        borderWidth: '0px'
      }
    },
    computeSelectedItems () {
      const self = this
      if (!this.controlKeyDown) {
        this.currentValue = []
      }
      this.$nextTick(() => {
        this.options.forEach(item => {
          const itemStyle = item.getItemStyle()
          const isChecked =
          self.selectionBox.left <= itemStyle.left + itemStyle.width &&
          self.selectionBox.left + self.selectionBox.width >= itemStyle.left &&
          self.selectionBox.top <= itemStyle.top + itemStyle.height &&
          self.selectionBox.top + self.selectionBox.height >= itemStyle.top
          if (isChecked) {
            const optionIndex = self.currentValue.indexOf(item.value)
            if (optionIndex > -1) {
              self.currentValue.splice(optionIndex, 1)
            } else {
              self.currentValue.push(item.value)
            }
          }
        })
        // 计算完选中元素时 再对选框大小位置数据置零初始化
        self.selectionBox = {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        }
      })
    },
    clickSelect (val) {
      const self = this
      const targetIndex = self.getIndex(val);
      if (self.shiftKeyDown) {
        const indexArr = []
        const allChildren = self.options
        const slelectedListLength = self.currentValue.length
        allChildren.forEach((item, index) => {
          // Todo: 引用类型 value
          if (self.currentValue.indexOf(item.value) !== -1) {
            indexArr.push(index)
          }
        })
        self.currentValue = []
        self.$nextTick(() => {
          if (slelectedListLength === 0) {
            allChildren.forEach((item, index) => {
              if (index <= targetIndex) {
                self.currentValue.push(item.value)
              }
            })
          } else if (slelectedListLength === 1) {
            if (indexArr[0] > targetIndex) {
              allChildren.forEach((item, index) => {
                if (index >= targetIndex && index <= indexArr[0]) {
                  self.currentValue.push(item.value)
                }
              })
            } else {
              allChildren.forEach((item, index) => {
                if (index <= targetIndex && index >= indexArr[0]) {
                  self.currentValue.push(item.value)
                }
              })
            }
          } else if (slelectedListLength >= 2) {
            const maxIndex = Math.max.apply(null, indexArr)
            const minIndex = Math.min.apply(null, indexArr)
            if (targetIndex >= maxIndex) {
              allChildren.forEach((item, index) => {
                if (index <= targetIndex && index >= maxIndex) {
                  self.currentValue.push(item.value)
                }
              })
            } else if (targetIndex >= minIndex && targetIndex < maxIndex) {
              const nearMinArr = []
              indexArr.forEach((item) => {
                if (item >= minIndex && item <= targetIndex) {
                  nearMinArr.push(item)
                }
              })
              const nearMinIndex = Math.max.apply(null, nearMinArr)
              allChildren.forEach((item, index) => {
                if (index >= nearMinIndex && index <= targetIndex) {
                  self.currentValue.push(item.value)
                }
              })
            } else {
              allChildren.forEach((item, index) => {
                if (index >= targetIndex && index <= minIndex) {
                  self.currentValue.push(item.value)
                }
              })
            }
          }
        })
        return
      }
      if (!self.controlKeyDown) {
        self.currentValue = []
        self.$nextTick(() => {
          self.currentValue.push(val)
        })
      } else {
        if (self.currentValue.indexOf(val) !== -1) {
          self.currentValue.splice(self.currentValue.indexOf(val), 1)
        } else {
          self.currentValue.push(val)
        }
      }
    },
    // 监听按键
    detectKey () {
      const isWin = navigator.userAgent.indexOf('Window') > 0
      const isMac = navigator.userAgent.indexOf('Mac OS X') > 0
      const self = this
      // 按  Shift_L  Control_L  command
      window.onkeydown = function (event) {
        const e = event || window.event
        if (e && e.keyCode === 16) {
          self.shiftKeyDown = true
        }
        if (e && e.keyCode === 17 && isWin) {
          self.controlKeyDown = true
        }
        if (e && e.keyCode === 91 && isMac) {
          self.controlKeyDown = true
        }
      }
      // 放 Shift_L  Control_L  command
      window.onkeyup = function (event) {
        const e = event || window.event
        if (e && e.keyCode === 16) {
          self.shiftKeyDown = false
        }
        if (e && e.keyCode === 17 && isWin) {
          self.controlKeyDown = false
        }
        if (e && e.keyCode === 91 && isMac) {
          self.controlKeyDown = false
        }
      }
    },
    // 获取某一个选项在元数据的索引
    getIndex (val) {
      // Todo: 区分元素绑定数据是 引用类型 还是 值类型
      return this.options.findIndex(item => {
        return item.value === val
      })
    },
    elementLayout (itemWidth, itemHeight) {
      // 容器宽度
      const boxWidth = this.$refs.vueDragSelect.offsetWidth
      // 一行几个
      const colCount = parseInt(boxWidth / itemWidth)
      // 行基数
      let vtSite = 0
      this.options.forEach((item, index) => {
        // 换行
        if (index && !(index % colCount)) {
          vtSite += 1
        }
        item.$refs.dragSelectItem.style.top = `${vtSite * itemHeight}px`
        item.$refs.dragSelectItem.style.left = `${(index % colCount) * itemWidth}px`
      })
      // 解决撑起容器
      this.minHeight = (vtSite + 1) * itemHeight
    },
  },

  beforeDestroy () {
    // Remove event listeners
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    this.$el.removeEventListener('scroll', this.boxScrollFn)
  }
}
</script>

<style lang="less">
  .vue-drag-select {
    width:100%;
    height:100%;
    position: relative;
    user-select: none;
    overflow:hidden;
    overflow-y: visible;
    .select-wrap{
      position: relative;
      user-select: none;
      padding-left:10px;
      min-width:100%;
      min-height:100%;
    }
    .drag-select-item{
      width:180px;
      height:190px;
      margin: 20px;
      transition:all .6s ease;
      position:absolute;
      .item-self{
        width:100%;
        height:100%;
        border-radius:4px;
        border:1px solid #fff;
        background-color:#fff;
        transition: all .3s ease;
        overflow:hidden;
        &:hover{
          box-shadow:0px 2px 20px -2px rgba(0,0,0,.5);
        }
        img{
          width:100%;
        }
      }
    }
    .selected-item{
      .item-self{
        border:1px solid red;
        border-color: rgb(65, 98, 255);
        box-shadow: rgb(65, 98, 255) 0px 0px 0px 2px !important;
      }
    }
  }
  .vue-drag-select-box {
    position: absolute;
    background: rgba(0, 162, 255, .4);
    z-index: 99;
    border:1px dotted rgb(0, 162, 255);
    // 解决拖选框快速点击时，渲染残留点问题
    transform:translate3d(0,0,0);
  }
</style>
