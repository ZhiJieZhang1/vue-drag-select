<template>
  <div :class="['index-page', mood ? '' : 'bigger']">
    <div class="btn" @click="mood = !mood">{{mood ? '点击变宽' : '点击收缩'}}</div>
    <div class="tips">可以尝试 <code>Ctrl</code> 和 <code>shift</code> 按键</div>
    <div ref="resultBox" class="result-box">
        <drag-select :min-height="minHeight" v-model="selectedList" :data-list="dataList" ref="dragSelect">
          <template v-for="(item, index) in dataList">
            <div :class="['box-item', item.selected ? 'selected-item' : '']" :key="item.id" :id="item.id" @click="clickItem(item.id, index)">
              <div class="item-self">
                <img v-if="index !== 31" src="../assets/images/0.jpg">
                <img v-else src="../assets/images/prank.jpg">
              </div>
            </div>
          </template>
        </drag-select>
      </div>
  </div>
</template>

<script>
import DragSelect from './DragSelect'

export default {
  components: {
    DragSelect
  },
  data () {
    return {
      mood: true,
      minHeight: 0,
      dataList: [
        {
          id: '1'
        },
        {
          id: '2'
        },
        {
          id: '3'
        }
      ],
      selectedList: []
    }
  },
  methods: {
    siteHandle (itemWidth, itemHeight) {
      // 容器宽度
      const boxWidth = this.$refs.resultBox.offsetWidth
      // 一行几个
      const colCount = parseInt(boxWidth / itemWidth)
      // 容器内全部元素 数组
      const domArr = this.$refs.resultBox.querySelectorAll('.box-item')
      let vtSite = 0
      // debugger;
      domArr.forEach((item, index) => {
        // 换行
        // debugger;
        if (!(index % colCount)) {
          if (index) {
            vtSite += 1
          }
        }
        // item.style.transform = `translate(${(index % colCount) * itemWidth}px,${vtSite * itemHeight}px)`
        item.style.top = `${vtSite * itemHeight}px`
        item.style.left = `${(index % colCount) * itemWidth}px`
      })
      this.minHeight = (vtSite + 1) * itemHeight
    },
    clickItem (val, indexVal) {
      this.$refs.dragSelect.clickSelect(val, indexVal)
    }
  },
  created () {
    this.dataList = []
    for (let i = 1; i <= 50; i++) {
      this.dataList.push({
        id: `${i}`
      })
    }
  },
  mounted () {
    this.siteHandle(200, 230)
  },
  watch: {
    mood () {
      // debugger;
      clearTimeout(this.timeClick)
      this.timeClick = setTimeout(() => {
        this.siteHandle(200, 230)
      }, 500)
    },
    selectedList (val) {
      // console.log(val)
      this.dataList.forEach((item) => {
        if (val.indexOf(item.id) !== -1) {
          item.selected = true
        } else {
          item.selected = false
        }
      })
    }
  }
}
</script>

<style lang="less">
.index-page {
  width:100%;
  height:100%;
  position:relative;
  padding:0 0 0 400px;
  transition:all .3s ease;
  .btn{
    padding:10px 20px;
    color:#fff;
    position:absolute;
    left:10px;
    top:50px;
    background-color:#2d8cf0;
    border-radius:4px;
    cursor:pointer;
    transition:all .3s ease;
    user-select: none;
    &:hover{
      background-color:#57a3f3;
    }
    &:focus{
      box-shadow:0 0 0 2px rgba(45,140,240,.2);
    }
    &:active{
      background-color:#2d8cf0;
    }
  }
  .tips{
    position:absolute;
    left:10px;
    top:150px;
    code{
      background:#000;
      color:#fff;
      padding:10px;
      border-radius:6px;
    }
  }
  .result-box{
    width:100%;
    height:100%;
    // background-color:#f4f7fa;
    transition:all .3s ease;
    display:flex;
    flex-wrap: wrap;
    position:relative;
    overflow-x: hidden;
    overflow-y: visible;
    .box-item{
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
}
.bigger{
  width:100%;
  padding:0 0 0 100px;
}
</style>
