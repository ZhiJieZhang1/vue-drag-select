<template>
  <div class="vue-drag-select">
    <div class="select-wrap" @mousedown="onMouseDown" :style="{minHeight: minHeight + 'px'}">
      <div class="wrap-container" ref="selectWrap">
        <slot>
        </slot>
      </div>
      <div
        v-if="mouseDown"
        class="vue-drag-select-box"
        :style="selectionBoxStyling">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vue-drag-select',
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    minHeight: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
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
        height: '0px'
      },
      // 按键状态
      controlKeyDown: false,
      shiftKeyDown: false
    }
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
    boxScrollFn (event) {
      this.computeLastEndPoint()
    },
    computeLastEndPoint () {
      if (!this.mouseDown || !this.startPoint || !this.endPoint) return {}
      const clientRect = this.$el.getBoundingClientRect()
      this.lastEndPoint = {
        x: this.endPoint.x - clientRect.left,
        y: this.endPoint.y - clientRect.top + this.$el.scrollTop
      }
      // Calculate position and dimensions of the selection box
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
      // 阻止捕获到item本身
      if (!((event.target.className === 'select-wrap') || (event.target.className === 'box-item'))) return
      // Ignore right clicks
      if (event.button === 2) return
      const clientRect = this.$el.getBoundingClientRect()
      // Register begin point
      this.mouseDown = true
      this.startPoint = {
        x: event.pageX - clientRect.left,
        y: event.pageY - clientRect.top + this.$el.scrollTop
      }
      // Start listening for mouse move and up events
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
      if (this.scrollIng) {

      } else {
        this.computeLastEndPoint()
      }
      // this.computeLastEndPoint()
    },
    onMouseUp (event) {
      // Clean up event listeners
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
      // Reset state
      this.mouseDown = false
      this.computeSelectedItems()
      this.startPoint = null
      this.endPoint = null
      this.lastEndPoint = null
      // 此数据用于计算选中元素，此处置零的话在computeSelectedItems时就没法计算了
      // this.selectionBox = {
      //   left: 0,
      //   top: 0,
      //   width: 0,
      //   height: 0
      // }
      // 去除选框样式 隐藏选框
      this.selectionBoxStyling = {
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px'
      }
    },
    computeSelectedItems () {
      const self = this
      if (!this.controlKeyDown) {
        this.currentValue = []
      }
      this.$nextTick(() => {
        Array.from(self.$refs.selectWrap.children).forEach((item) => {
          const box = {
            top: item.offsetTop,
            left: item.offsetLeft,
            width: item.clientWidth,
            height: item.clientHeight
          }
          const isChecked =
          self.selectionBox.left <= box.left + box.width &&
          self.selectionBox.left + self.selectionBox.width >= box.left &&
          self.selectionBox.top <= box.top + box.height &&
          self.selectionBox.top + self.selectionBox.height >= box.top
          if (isChecked) {
            if (self.currentValue.indexOf(item.id) !== -1) {
              self.currentValue.splice(self.currentValue.indexOf(item.id), 1)
            } else {
              self.currentValue.push(item.id)
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
    clickSelect (val, indexVal) {
      if (this.shiftKeyDown) {
        const indexArr = []
        const self = this
        const allChildren = Array.from(self.$refs.selectWrap.children)
        const slelectedListLength = self.currentValue.length
        allChildren.forEach((item, index) => {
          if (self.currentValue.indexOf(item.id) !== -1) {
            indexArr.push(index)
          }
        })
        self.currentValue = []
        self.$nextTick(() => {
          if (slelectedListLength === 0) {
            allChildren.forEach((item, index) => {
              if (index <= indexVal) {
                self.currentValue.push(item.id)
              }
            })
          } else if (slelectedListLength === 1) {
            if (indexArr[0] > indexVal) {
              allChildren.forEach((item, index) => {
                if (index >= indexVal && index <= indexArr[0]) {
                  self.currentValue.push(item.id)
                }
              })
            } else {
              allChildren.forEach((item, index) => {
                if (index <= indexVal && index >= indexArr[0]) {
                  self.currentValue.push(item.id)
                }
              })
            }
          } else if (slelectedListLength >= 2) {
            const maxIndex = Math.max.apply(null, indexArr)
            const minIndex = Math.min.apply(null, indexArr)
            if (indexVal >= maxIndex) {
              allChildren.forEach((item, index) => {
                if (index <= indexVal && index >= maxIndex) {
                  self.currentValue.push(item.id)
                }
              })
            } else if (indexVal >= minIndex && indexVal < maxIndex) {
              const nearMinArr = []
              indexArr.forEach((item) => {
                if (item >= minIndex && item <= indexVal) {
                  nearMinArr.push(item)
                }
              })
              const nearMinIndex = Math.max.apply(null, nearMinArr)
              allChildren.forEach((item, index) => {
                if (index >= nearMinIndex && index <= indexVal) {
                  self.currentValue.push(item.id)
                }
              })
            } else {
              allChildren.forEach((item, index) => {
                if (index >= indexVal && index <= minIndex) {
                  self.currentValue.push(item.id)
                }
              })
            }
          }
        })
        return
      }
      if (!this.controlKeyDown) {
        this.currentValue = []
        this.$nextTick(() => {
          this.currentValue.push(val)
        })
      } else {
        if (this.currentValue.indexOf(val) !== -1) {
          this.currentValue.splice(this.currentValue.indexOf(val), 1)
        } else {
          this.currentValue.push(val)
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
    }
  },
  mounted () {
    this.$el.addEventListener('scroll', this.boxScrollFn)
    this.detectKey()
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
    position: relative;
    user-select: none;
    overflow:hidden;
    width:100%;
    height:100%;
    overflow-y: visible;
    will-change:transform;
    transform:translate3d(0,0,0);
    .select-wrap{
      position: relative;
      user-select: none;
      padding-left:10px;
      min-width:100%;
      min-height:100%;
      .wrap-container{
        width:100%;
        height:100%;
      }
    }
  }
  .vue-drag-select-box {
    position: absolute;
    background: rgba(0, 162, 255, .4);
    z-index: 99;
    border:1px dotted rgb(0, 162, 255);
  }
</style>
