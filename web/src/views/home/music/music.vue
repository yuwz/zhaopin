<template>
  <diV id="music">
    <!-- 自定义labeluseLabelSlot -->
    <van-search  v-model="searchSong" size="large" shape='round'
    input-align="center"
    @search="onSearch"
    useLabelSlot 
    placeholder="请输入关键词" />
    <van-cell v-for='(item,index) in searchSongList' 
    :key="index" :class="{active:current==index}"  
     @click="playSong(item.id,index,item.name)" >
    <template #label>
      <span   v-for="(item2,index2) in item.artists" :key="index2" >{{item2.name}}&nbsp;&nbsp;</span>
    </template>
    <template #title >
      {{item.name}}
    </template>
  </van-cell>
  <van-action-sheet :style="{ height: '80%' }" v-model="isShow" :title="songName">
  <div class="content">
    <div class="showBox">
      <div class="pic"><img :src="picUrl" alt=""></div>
    </div>
    <audio  controls autoplay :src="songUrl"></audio>
    <div class="comments">
      <van-tabs @click="tabsClick" animated v-model="activeName">
  <van-tab title="热门评论" name="a">
    <musicComments v-for="(item,index) in hotComments" :key="index"
    :time="item.timeStr" :location="item.location" :content="item.content"
    :user="item.user.nickname" :avatarUrl="item.user.avatarUrl" 
    ></musiccomments>
  </van-tab>
  <van-tab title="最新评论" name="b">
    <musicComments v-for="(item,index) in comments" :key="index"
    :time="item.timeStr" :location="item.ipLocation.location" :content="item.content"
    :user="item.user.nickname" :avatarUrl="item.user.avatarUrl" 
    ></musiccomments>
  </van-tab>
</van-tabs>
    </div>
  </div>
</van-action-sheet>
  </diV>
</template>

<script>
import axios from 'axios'
import musicComments from './musicComments';
export default {
  name: 'music',

  components: {
    musicComments
  },

  data() {
    return {
      songName: '',
      activeName: 'a',
      commom: '',
      isShow: false,
      current: -1,
      songUrl: -1,
      searchSong: '屋顶',
      searchSongList: [],
      songId: '',
      comments: [],
      hotComments: [],
      picUrl: '',
    };
  },
  mounted() {
    this.onSearch()
  },
  methods: {
   async onSearch() {
      await axios({//查询接口
        url: `https://autumnfish.cn/search?keywords=${this.searchSong}`,
        method:'get'
      }).then(res => {
        console.log('searchRes',res);
        // console.log(this.searchSongList);
        // console.log(this.searchSongList[0].artists.name);
        this.searchSongList = res.data.result.songs
       this.current=-1
      })
      //
     
    },
  async  playSong(id,index,name) {
    console.log(id);
    this.songId = id
    await axios({ // 封面
          url:`https://autumnfish.cn/song/detail?ids=`+id
    }).then(res => {
      console.log('detail', res);
          this.picUrl = res.data.songs[0].al.picUrl
    })
   await   axios({ //mp3接口
            url: `https://autumnfish.cn/song/url?id=${id}`,
            method: 'get',
          }).then(res => {
            //成功回调
            console.log(res);
            this.songUrl = res.data.data[0].url
            this.songName = name
            this.isShow = !this.isShow
            this.current=index
          });
    
   await axios({//评论接口
     url: `https://autumnfish.cn/comment/music?id=${this.songId}&limit=20`,
    method:'get'
    }).then(res=>{
      this.comments = res.data.comments
      this.hotComments = res.data.hotComments
      console.log('我进来了',res);
        console.log(this.comments);
        console.log(this.hotComments);
    })
    },
     tabsClick(name) {
      console.log(name);  
    },
  
  },
}
  
</script>

<style lang="less" scoped>
#music{
  .active{
    color: orangered;
  }
  .content {
    background-color: rgb(234, 233, 232);
    padding: 16px;
    
    .showBox{
      background-color: skyblue;
      width: 280px;
      height: 280px;
      margin: 0 auto;
      .pic{
      
      img{
        width: 100%;
        height: 100%;
        
      }
    }
    }
    audio{
      margin: 10px auto;
      width: 340px;
    }
    .comments{
     
    }
  }
}
</style>