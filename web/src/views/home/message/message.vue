<template>
  <div class="message" v-if="isLogin">
    <div v-if="bol">
      <div class="hr" v-if="type=='1'">
    <van-tabs v-model="hrActive">
    <van-tab title="已发职位">
  <van-collapse  v-model="activeNames" accordion>
    <van-collapse-item  v-for="(item,index) in hr.posSet" :key="index"
    :name="index" 
    >
    <template #title >
      <van-cell  :title="item.jobName" 
      @click="sendsList" :value="item.company"  >
        <template #label>
          投递人数:{{item.sendsSet.length }} 人
        </template>
      </van-cell>
    </template>
    <!-- 分页 -->
    <van-tabs v-model="hrDetailActive">
     <van-tab title="待查阅">  
        <div class="userInfoCard" @click="handle(item.id,item2.phone)" :v-if="item.notRead.length>0" v-for="(item2,index2) in item.notRead" :key="index2">
          <div>姓名:{{ item2.name }} &nbsp;&nbsp;&nbsp;年龄:{{ item2.age }}</div>
          <div>联系方式:{{ item2.phone }}</div>
          <div>个人介绍:{{ item2.nodes }}</div>
        </div>      
     </van-tab>
     <van-tab title="面试">
      <div class="userInfoCard" :v-if="item.itv.length>0" v-for="(item2,index2) in item.itv" :key="index2">
          <div>姓名:{{ item2.name }} &nbsp;&nbsp;&nbsp;年龄:{{ item2.age }}</div>
          <div>联系方式:{{ item2.phone }}</div>
          <div>个人介绍:{{ item2.nodes }}</div>
        </div> 
     </van-tab>
     <van-tab title="不匹配">
      <div class="userInfoCard" :v-if="item.mis.length>0" v-for="(item2,index2) in item.mis" :key="index2">
          <div>姓名:{{ item2.name }} &nbsp;&nbsp;&nbsp;年龄:{{ item2.age }}</div>
          <div>联系方式:{{ item2.phone }}</div>
          <div>个人介绍:{{ item2.nodes }}</div>
        </div> 
     </van-tab>
    </van-tabs>
    </van-collapse-item>
  </van-collapse>
    </van-tab>
    <van-tab title="人才市场">
      <div class="userInfoCard size14"  v-for="(item2,index2) in hr.talentMarket" :key="index2">
          <div>姓名:{{ item2.name }} &nbsp;&nbsp;&nbsp;年龄:{{ item2.age }}</div>
          <div>联系方式:{{ item2.phone }}</div>
          <div>个人介绍:{{ item2.nodes }}</div>
        </div>   
    </van-tab>
    </van-tabs>
    </div>
    <div class="user" v-else-if="type=='2'">
    <van-tabs v-model="userActive">
    <van-tab title="待查阅">
      <van-cell v-for="(item,index) in user.notRead" :key="index" :title="item.jobName" :value="item.company" label="面试消息:" />
    </van-tab>
    <van-tab title="面试">
      <van-cell v-for="(item,index) in user.itved" :key="index" :title="item.jobName" :value="item.company" label="面试消息:" />
      <!-- <van-cell title="后端程序员(实习生)" value="缤纷数码" label='面试消息:'></van-cell> -->
    </van-tab>
    <van-tab title="不匹配">
      <van-cell v-for="(item,index) in user.notPass" :key="index" :title="item.jobName" :value="item.company" label="面试消息:" />
    </van-tab>
    </van-tabs>
    </div>
    <div class="user" v-else-if="type=='0'">
      <!-- 分页--未审核--通过--拒绝 -->
      <van-tabs v-model="admActive">
        <van-tab title="待审核">
      <van-cell v-for="(item,index) in adm.notRead" @click="admEditPos(item.id)" :key="index" :title="item.jobName" :value="item.company"  />
    </van-tab>
    <van-tab title="通过">
      <van-cell v-for="(item,index) in adm.pass" @click="admEditPos(item.id)" :key="index" :title="item.jobName" :value="item.company"  />
    </van-tab>
    <van-tab title="不通过">
      <van-cell v-for="(item,index) in adm.notPass" @click="admEditPos(item.id)" :key="index" :title="item.jobName" :value="item.company" />
    </van-tab>
    </van-tabs>
    </div>
    </div>
    <!-- hr处理投递弹出框 -->
    <van-popup class="hrHeadle" v-model="hrHeadle">
      <van-form >
        <van-field name="radio" label="单选框">
  <template #input>
    <van-radio-group v-model="headleRadio" direction="horizontal">
      <van-radio name="0">不匹配</van-radio>
      <van-radio name="1">面试</van-radio>
    </van-radio-group> 
  </template>
  
</van-field>
<van-field
    v-model="headleMessage"
    name="面试消息"
    label="面试消息"
  />

    <van-button round block type="info" @click="headleSubmitClick" >提交</van-button>
 
</van-form>
    </van-popup>
  </div>
  <div v-else class="login">
    <van-button to="/login" type="warning"  round class="loginBtn">请登录</van-button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'message',
    data() {
      return {
        headleUserId:'',
        headleId:'',
        headleMessage:'',
        headleRadio:"0",
        hrHeadle:false,
        activeNames:['0'],
        userActive:0,
        hrActive: 0,
        hrDetailActive:0,
        admActive:0,
        isLogin:false,
        user: {
        },
        hr: {
        },
        adm: {},
        type: '',
        bol: true,
      };
  },
async  created() {
  await  axios({
      url: 'http://localhost:3000/message',
      method: 'post',
    }).then(async res => {
      console.log('message', res);
      this.isLogin = true;
      this.type = res.data.type;
      if (res.data.type == '1') {
        //人才市场
      await  axios({
          url:'http://localhost:3000/message/allUser'
      }).then(res => {
        console.log('allUser', res.data.data);
        this.hr.talentMarket = res.data.data;
        })
         //招聘者
      await  axios({// 发送请求已发布职位列表 
          url: 'http://localhost:3000/message/posList',
        }).then( res => {
          console.log('posList', res);
          this.hr.posSet = res.data.data // 发布的职位集合
          console.log(this.hr.posSet);
          //各个职位投递者数组
          for (let i = 0; i < this.hr.posSet.length; i++){  
            console.log(i);
             if (this.hr.posSet[i].sendsSet.length > 1) {// 有投递者
              //转换成数组
              console.log('w lai la');
              this.hr.posSet[i].sendsSet=this.strToArr(this.hr.posSet[i].sendsSet);
              this.hr.posSet[i].userStatus=this.strToArr(this.hr.posSet[i].userStatus);
              console.log(this.hr.posSet[i].sendsSet);
               console.log(this.hr.posSet[i].userStatus);
              console.log('sendsSet.length',this.hr.posSet[i].sendsSet.length);
              //待查看
               this.hr.posSet[i].notRead = [];
              //面试
               this.hr.posSet[i].itv = [];
              //不匹配
               this.hr.posSet[i].mis = [];
               for (let j = 0; j < this.hr.posSet[i].sendsSet.length; j++){
                  if (this.hr.posSet[i].userStatus[j]=='2') {//待查看
                    console.log('i',i);
                    this.hr.posSet[i].notRead.push(this.hr.posSet[i].sendsSet[j]);//存入待查看求职者id
                  } else if (this.hr.posSet[i].userStatus[j]=='1') {
                    this.hr.posSet[i].itv.push(this.hr.posSet[i].sendsSet[j]);//存入面试求职者id
                  } else if (this.hr.posSet[i].userStatus[j] == '0') {
                    this.hr.posSet[i].mis.push(this.hr.posSet[i].sendsSet[j]);
                  }
               }
               console.log(`hr.posSet[${i}].notRead`, this.hr.posSet[i].notRead);
               //请求待查阅求职者信息
               axios({
                  url: 'http://localhost:3000/message/sendsInfo',
                  method: 'post',
                  data:this.hr.posSet[i].notRead
               }).then(res => {
                 console.log('axiosNotRead', res);
                 this.hr.posSet[i].notRead=res.data.data
               })
                    
               console.log(`hr.posSet[${i}].itv`,this.hr.posSet[i].itv);
               //请求面试求职者信息
               axios({
                  url: 'http://localhost:3000/message/sendsInfo',
                  method: 'post',
                  data:this.hr.posSet[i].itv
               }).then(res => {
                 console.log('axiosItv', res);
                 this.hr.posSet[i].itv = res.data.data;
               })
                 //请求不匹配求职者信息
               axios({
                  url: 'http://localhost:3000/message/sendsInfo',
                  method: 'post',
                  data:this.hr.posSet[i].mis
               }).then(res => {
                 console.log('axiosMis', res);
                 this.hr.posSet[i].mis = res.data.data;
               })   
              } else {
               this.hr.posSet[i].userStatus = [];
               this.hr.posSet[i].sendsSet = [];
            }
          }
          
          
        })
        console.log('this.hr', this.hr);
        
       
      } else if (res.data.type == '2') {
        // 求职者
        console.log('messageRes', res);
        this.user = res.data.data[0];
        console.log('user',this.user);
        
        this.user.sendSet=this.strToArr(this.user.sendSet);
        this.user.status = this.strToArr(this.user.status);
        
        console.log(this.user.sendSet);
        console.log(this.user.status);
   await  axios({//请求全部投递职位信息
          url: `http://localhost:3000/message/userAllPos`,
          method: 'post',
          data:this.user.sendSet
        }).then(res => {
          console.log('all', res);
           this.user.userAllSend = res.data.data;
          console.log('userAllSend', this.user.userAllSend);
        //待查阅数组
        this.user.notRead = this.getUserTabsArr(this.user.notRead,'2');
        console.log('notRead', this.user.notRead);
        //面试
        this.user.itved = this.getUserTabsArr(this.user.itved,'1');
        console.log('itved', this.user.itved);
        //不匹配
        this.user.notPass=this.getUserTabsArr(this.user.notPass,'0');
        console.log('notPass', this.user.notPass);
       
        })
       
      } else if (res.data.type == '0') {
        axios({
      url: 'http://localhost:3000/position1',
    }).then((res) => {
      console.log('p',res);
      this.adm.allPos = res.data.data
      this.adm.notRead = [];
      this.adm.pass = [];
      this.adm.notPass = [];
       for(let i = 0;i < this.adm.allPos.length;i++){
         if (this.adm.allPos[i].status == '2') {
          this.adm.notRead.push(this.adm.allPos[i])
         } else if (this.adm.allPos[i].status == '1') {
            this.adm.pass.push(this.adm.allPos[i])
         }else if (this.adm.allPos[i].status == '0') {
          this.adm.notPass.push(this.adm.allPos[i])
         }
      }
      console.log(this.adm.allPos);

    })
      }
    })
  // console.log('this.user', this.user);
  this.bol = false;
  this.$nextTick(() => {
    this.bol = true;
  })
  },
  mounted() {
    // console.log(this.user);
  },
  updated() {
    
  },
  methods: {
    //管理员处理职位
    admEditPos(id) {
      this.$router.push({ path: '/posdetail', query: { id: id } })
    },
    //投递信息处理 拒绝或者面试
    handle(id,userId) {
      //弹出对话框
      // 选择按钮
      this.hrHeadle = true;
      this.headleId = id;
      this.headleUserId = userId;
    
    },
   async headleSubmitClick() {
        // hr简历处理提交按钮
      
     await axios({
        url: 'http://localhost:3000/message/hrHeadle',
        method: 'post',
        data: {
          message: this.headleMessage,
          headle: this.headleRadio,
          headleId: this.headleId,
          userPhone:this.headleUserId
        }
      }).then(res => {
        console.log('headle', res);
        console.log('分割线');
     this.hrHeadle = false;
    
      })
     
  
    },
    //用户分页数组
    getUserTabsArr(arr,status) {
          arr = [];
            for(let i = 0;i < this.user.status.length;i++){
            if (this.user.status[i] == status) {
            for(let j = 0;j < this.user.userAllSend.length;j++){
              if (this.user.sendSet[i] == this.user.userAllSend[j].id) {
                    arr.push(this.user.userAllSend[j])
                  }
              }
            }
      }
      return arr;
          },
    //字符串转数组去除首位元素
    strToArr(target) {
      target = target.split(',');
      target.pop();
      target.shift();
     return target
    },
    //查看投递者列表
    sendsList() {
      // this.$router.push('/hrMessageDetail');
    },
    //查看面试者集合
    itvList() {
      
    }
    },
}
</script>

<style lang="less" scoped>
.size14{
  font-size: 14px;
}
.userInfoCard{
  background-color: rgb(232, 232, 232);
  padding: 10px;
  margin-bottom: 10px;
  div{
    margin: 5px 0;
  }
}
    .login{
      
      .loginBtn{
        width: 150px;
        margin-left: 120px;
        margin-top: 100px;
      }
    }
    .message{

    }
    .hrHeadle{
      width: 80%;
      padding: 25px;
    }
</style>