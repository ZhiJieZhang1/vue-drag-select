<template>
  <div :class="['index-page', mood ? '' : 'bigger']">
    <div class="tool-box">
      <div class="btn" @click="mood = !mood">{{mood ? '点击变宽' : '点击收缩'}}</div>
      <div class="btn" @click="insertItem">添加item</div>
      <div class="tips">可以尝试 <code>Ctrl</code>、<code>command</code> 和 <code>shift</code> 按键</div>
    </div>
    <div class="result-box">
        <drag-select v-model="selectedList" valueKey="name" :itemMargin="[0, 10, 10, 0]" ref="dragSelect">
          <template v-for="(item, index) in dataList">
            <drag-select-item :key="item.id" :value="item" :itemIndex="index">
              <div class="item-self">
                <img v-if="index !== 100 && !item.lip" src="../assets/images/0.jpg">
                <img v-else src="../assets/images/prank.jpg">
              </div>
            </drag-select-item>
          </template>
        </drag-select>
      </div>
  </div>
</template>

<script>
import DragSelect from './DragSelect'
import DragSelectItem from './DragSelectItem'


export default {
  components: {
    DragSelect,
    DragSelectItem
  },
  data () {
    return {
      mood: true,
      dataList: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ],
      selectedList: []
    }
  },
  created () {
    this.dataList = []
    for (let i = 50; i <= 300; i++) {
      this.dataList.push({
        id: i,
        name: i
      })
    }
  },
  watch: {
    mood () {
      clearTimeout(this.timeClick)
      this.timeClick = setTimeout(() => {
        this.$refs.dragSelect.elementLayout(200, 230)
      }, 500)
    }
  },

  methods: {
    insertItem () {
      this.dataList.splice(2, 1)
    }
  },
}
</script>

<style lang="less">
.index-page {
  width:100%;
  height:100%;
  position:relative;
  padding:0 0 0 400px;
  transition:all .3s ease;
  .tool-box{
    position:absolute;
    left:10px;
    top:50px;
    .btn{
      width:150px;
      margin-bottom:20px;
      padding:10px 20px;
      color:#fff;
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
      code{
        background:#000;
        color:#fff;
        padding:10px;
        border-radius:6px;
      }
    }
  }
  .result-box{
    width:100%;
    height:500px;
    padding-top:100px;
    .vue-drag-select{
      background-color:#ddd;
    }
    .item-self {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: 1px solid #fff;
      background-color: #fff;
      transition: all 0.3s ease;
      overflow: hidden;
      &:hover {
        box-shadow: 0px 2px 20px -2px rgba(0, 0, 0, 0.5);
      }
      img {
        width: 100%;
      }
    }
    .selected-item {
      .item-self {
        border: 1px solid red;
        border-color: rgb(65, 98, 255);
        box-shadow: rgb(65, 98, 255) 0px 0px 0px 2px !important;
      }
    }
  }
}
.bigger{
  width:100%;
  padding:0 0 0 100px;
  .result-box{
    height:600px;
  }
}
</style>
