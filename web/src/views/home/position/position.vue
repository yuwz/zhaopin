<template>
  <div id="position">
     <!-- 搜索区域 -->
    <div class="top">
      <van-button class="areaBtn" color="orange" @click="clickAreaBtn"  size="large">{{ city }}<van-icon name="location-o" /></van-button>
      <van-search class="search" @search="search"
  v-model="searchValue"
  shape="round"
  background="orange"
  placeholder="请输入职位搜索关键词"
/>
    </div>
    <!-- 地区弹出层 -->
<van-popup v-model="show" position="bottom"  :style="{ height: '40%' }" >
  <van-area title="请选择城市" :value="code" :area-list="areaList" 
  @cancel="cancel" @confirm="areaConfirm" :columns-num="2" />
</van-popup>
<!-- 轮播 -->
<van-swipe class="swipe" :autoplay="3000">
  <van-swipe-item><img src="@/assets/400.jpg" alt=""></van-swipe-item>
  <van-swipe-item><img src="@/assets/306daebf0db6f4253761e15291997a08.jpg" alt=""></van-swipe-item>
  <van-swipe-item><img src="@/assets/pic_5tu_big_201706241209364357.jpg" alt=""></van-swipe-item>
</van-swipe>
    <!-- 招聘信息列表 -->
    <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <posCell v-for="(item,index) in list" :key="index"
      :jobName="item.jobName" :salary="item.salary" :company="item.company"
      :city="item.city" :name="item.hr" :id="item.id"
      ></posCell>
  </van-pull-refresh>
</van-list>

  </div>
</template>

<script>
import posCell from './posCell.vue';
import {Toast} from 'vant'
import axios from 'axios';
import { areaList } from '@vant/area-data';
export default {
  name: 'position',
  components: {
    posCell
  },
  data() {
    return {
      
      code:'',
      city:'地区',
      areaList,
      list: [],
      searchValue:'',
      isLoading: false,
      loading: false,
      finished: false,
      detailId: '',
      searchCity: '',
      show:false
    };
  },
  async created() {
    await axios({
      url: 'http://localhost:3000/position',
    }).then((res) => {
      console.log('p',res);
      this.list = res.data.data

    })
  },
  methods: {
   async search(value) {
      console.log(value);
      await axios({// 搜查接口
      url: `http://localhost:3000/searchPos?city=${this.searchCity}&jobName=${this.searchValue}`,
    }).then(res => {
      console.log(res);
      this.list = res.data.data

    })
    },
    cancel() {
      this.show = false
    },
    clickAreaBtn() {
      this.show = true
    },
    areaConfirm(value) {

      console.log(value[1].name);
      console.log(value[1].code);
      this.code = value[1].code
      this.searchCity = value[1].name
      this.city = value[1].name
      this.show = false
      axios({// 搜查接口
      url: `http://localhost:3000/searchPos?city=${this.searchCity}&jobName=${this.searchValue}`,
    }).then(res => {
      console.log(res);
      this.list = res.data.data

    })
    },
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;

      }, 1000);
    },
    async onLoad() {
      this.loading = false;
      this.finished = true
      },

    }
  
}
</script>

<style lang="less" scoped>
    #position{
      background-color: @bgc;
      .top{
        display: flex;
        justify-content: space-between;
        .search{
          width: 80%;
          height: 40px;
        }
        .areaBtn{
          // padding-left: 5px;
          height: 40px;
          width: 20%;
        }
      }
      .swipe{
        width: 100%;
        height: 100%;
        img{
          width: 100%;
        height: 260px;
        }
      }
     
    }
    //轮播
    .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
  }
</style>