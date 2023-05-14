<template>
  <div id="home">
   <keep-alive><router-view :v-if="bol"></router-view></keep-alive>
    <!-- 底部标签栏tabber -->
    <!-- placeholder 固定在底部时，是否在标签位置生成一个等高的占位元素 -->
    <van-tabbar v-model="active" route placeholder active-color="orange" >
  <van-tabbar-item icon="home-o"  to="/home/position">求职</van-tabbar-item>
  <van-tabbar-item icon="music-o"  to="/home/music">音乐</van-tabbar-item>
  <van-tabbar-item icon="friends-o"  to="/home/message">消息 </van-tabbar-item>
  <van-tabbar-item icon="user-o" to="/home/my">我的</van-tabbar-item>
</van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      active: 0,//底部标签栏选项
      bol:true
    }
  },
  
}
</script>

<style lang="less">
  #home{
   background-color:@bgc;
  }
</style>