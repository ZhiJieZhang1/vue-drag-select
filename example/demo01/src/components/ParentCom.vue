<template>
  <div :class="['index-page', mood ? '' : 'bigger']">
    <div class="tool-box">
      <div class="btn" @click="mood = !mood">{{mood ? '点击变宽' : '点击收缩'}}</div>
      <div class="btn" @click="insertItem">添加item</div>
      <div class="tips">可以尝试 <code>Ctrl</code> 和 <code>shift</code> 按键</div>
    </div>
    <div class="result-box">
        <drag-select v-model="selectedList" ref="dragSelect">
          <template v-for="(item, index) in dataList">
            <drag-select-item :key="item.id" :value="item.id">
              <div class="item-self">
                {{ item.id }}
                <img v-if="index !== 31 && !item.lip" src="../assets/images/0.jpg">
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
    for (let i = 1; i <= 50; i++) {
      this.dataList.push({
        id: i,
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
      this.dataList.splice(2, 0, {
        id: 100,
        lip: true
      })
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
    height:100%;
  }
}
.bigger{
  width:100%;
  padding:0 0 0 100px;
}
</style>
