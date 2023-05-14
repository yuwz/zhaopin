<template>
  <div id="my">
  <div v-if="isLogin">
    <div class="top" >
      <div class="pic"><img src="@/assets/user.png" alt=""></div>
      <div class="right" v-if="(type=='1')">
        <div class="name">{{hr.name }}</div>
        <div class="age">{{ hr.age }}<span v-if="isLogin">岁</span></div>
      </div>
      <div class="right" v-if="(type=='2')">
        <div class="name">{{user.name }}</div>
        <div class="age">{{ user.age }}<span v-if="isLogin">岁</span></div>
      </div>
      <div class="right" v-if="(type=='0')">
        <div class="name">{{adm.phone }}</div>
      </div>
  </div>
<van-cell-group  v-if="type=='1'" center size="large">
  <van-cell title="账号" size="large" :label="hr.phone" />
  <van-cell title="个人资料" size="large" label="编辑" />
  <van-cell title="职位" size="large"  />
  <van-cell title="未通过" size="large"  />
  <van-cell title="发布" @click="toPosEdit" size="large" label="新增" />
</van-cell-group>
<van-cell-group  v-if="type=='2'" center size="large">
  <van-cell title="账号" size="large" :label="user.phone" />
  <van-cell title="个人资料" size="large" @click="editUser" label="编辑" />
  <van-cell title="个人介绍" size="large" @click="toEditNodes" >
    <template #label>
    {{ user.nodes }} 
  </template>
  </van-cell>
  <!-- 编辑user个人信息弹窗 -->
  <van-dialog v-model="editUserShow"  @confirm="conEditUser"  title="个人信息" show-cancel-button>
    <van-cell-group>
  <van-field v-model="user.name" label="姓名" placeholder="请输入用户名" />
  <van-field v-model="user.age" label="年龄" placeholder="请输入年龄" />
  <van-field v-model="user.nodes" label="个人介绍" placeholder="请输入个人介绍" />
</van-cell-group>
</van-dialog>
</van-cell-group>



<!-- 职位新增 -->
<van-dialog @confirm="addPos" v-model="hr.posEditShow" title="新增职位" show-cancel-button>
  <van-form>
  <van-field readonly :value="hr.posEdit.hr" label="招聘者" />
  <van-field readonly :value="hr.posEdit.hr_id" label="电话" />
  <van-field v-model="hr.posEdit.jobName" label="职位名" placeholder="请输入"
  :rules="[{ required: true, message: '请输入职位名' }]" />
  <van-field v-model="hr.posEdit.company" label="公司" placeholder="请输入" 
  :rules="[{ required: true, message: '请输入公司' }]" />
  <van-field v-model="hr.posEdit.city" label="城市" placeholder="职位所在城市名：XX市" 
  :rules="[{ required: true, message: '请输入城市' }]" />
  <van-field v-model="hr.posEdit.salary" label="工资" placeholder="工资：？k - ？k" 
  :rules="[{ required: true, message: '请输入工资'}]" />
  <!-- 职位描述 -->
  <van-field
  v-model="hr.posEdit.description"
  rows="2"
  autosize
  label="职位描述"
  type="textarea"
  maxlength="200"
  placeholder="职位描述"
  show-word-limit
  :rules="[{ required: true, message: '请输入'}]"
/>
<!-- 职位要求 -->
  <van-field 
  v-model="hr.posEdit.req"
  rows="2"
  autosize
  label="职位要求"
  type="textarea"
  maxlength="200"
  placeholder="职位要求"
  show-word-limit
  :rules="[{ required: true, message: '请输入'}]"
/>
</van-form>
</van-dialog>
<van-button @click="loginOut" color='rgb(185, 185, 185)'  class="loginOut" round >退出账号</van-button>
</div>
<van-button v-else to="/login" color='orange'  class="loginOut" round >登录</van-button>
  </div>
</template>

<script>
import axios from 'axios';
import { Dialog} from 'vant'
export default {
  name: 'my',
    data() {
      return {
        editUserShow: false,
        type:'',
        hr: {
          posEditShow: false,
          posSet: {},
          phone:'',
          name: '',
          age: '',
          count: '',//已发布职位数
          notPass:'',
          posEdit: {
          hr: '',
          company:'',
          hr_id:'',
          jobName:'',
          req: '',
          salary: '',
          description: '',
          city:''
        },
        },
        user: {
          name: '',
          age: '',
          phone:'',
        },
        adm: {
          phone:'',
        },
        message:'',
        isLogin:'',
        
  
      };
  },
  activated() {
    
  },
  async mounted() {
    console.log('我是mounted');
    // 进入页面发送请求获得用户信息
    await axios({
      url: 'http://localhost:3000/userInfo',
      method: 'get',
    }).then(res => {
      console.log('my', res);
      if (res.data.msg == '未登录') {//未登录
        console.log(res.data.msg);
        this.isLogin = false
        
      } else {
        // 登录状态
        console.log(res.data.msg);
        this.isLogin = true
        this.type = res.data.type
        if (res.data.type=='1') {//hr
        this.hr.phone = res.data.data[0].phone
        this.hr.age = res.data.data[0].age
        this.hr.name = res.data.data[0].name
        let idArr = res.data.data[0].posSet.split(',')
        let statusArr = res.data.data[0].status.split(',')
        for (let i = 0; i < idArr.length; i++) {
          this.hr.posSet[idArr[i]] = statusArr[i]
        }
        this.hr.count = 0
        this.hr.notPass = 0
        for (const key in this.hr.posSet) {
          if (this.hr.posSet[key] == '1') {//审核通过 
            console.log('id', key);
            this.hr.count++
          } else if (this.hr.posSet[key] == '0') {
            this.hr.notPass++
          }
        }
        } else if (res.data.type == '2') {
          this.user = res.data.data[0]
        console.log('this.user',this.user);
          console.log(this.user.name);
        } else if (res.data.type == '0') {
          this.adm = res.data.data[0]
       
        }

      }
    })
  },
  created() {
  console.log('type',this.$store.state.type)
},
  methods: {
    //编辑user个人信息
    editUser() {
      // 弹出编辑框
      console.log('编辑user个人信息');
      this.editUserShow = true;
    },
    //确认编辑user个人信息
    conEditUser() {
      axios({
        url: 'http://localhost:3000/my/editUser',
        data: {
          age: this.user.age,
          name: this.user.name,
          nodes:this.user.nodes
        },
        method: 'post',
      }).then(res => {
        console.log('editUser',res);
      })
    },
    //编辑个人简历
    toEditNodes() {
      // 编辑个人介绍

    },
    //确认新增职位
    addPos() {
      //新增职位
      axios({
        url: 'http://localhost:3000/addPos',
        data:this.hr.posEdit,
        method: 'post',
        
      }).then(res => {
        console.log('addres',res);
      })
    },
    //新增职位
  toPosEdit() {
    console.log("to");
      this.hr.posEditShow = true
      this.hr.posEdit.hr=this.hr.name;
      this.hr.posEdit.hr_id=this.hr.phone;
    },
    //退出登录
    async loginOut() {
      await Dialog.confirm({
      message: '确定退出当前账号?',
      })
        .then(() => {
          axios({
            url: 'http://localhost:3000/loginOut'
          }).then(res => {
            console.log('loginOutRes',res);
            this.$router.push('/login')
          })
          // on confirm
            
          // })

        })
    },
   

  }
  
}
</script>

<style lang="less">
//自动换行
.wrap{white-space:normal; width:200px; }
//清除浮动
.clear::before,
        .clearfix:after {
            content: "";
            display: block;

        }

        .clearfix:after {
            clear: both;
        }

        .clearfix {
            *zoom: 1;
        }
#my{
  background-color: @bgc;
  padding: 14px;
  .top{
  display: flex;
  justify-content: space-between;
  padding-left: 25px;
  padding-top: 35px;
  margin-bottom: 50px;
    .pic{
      width: 13%;
      img{
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }
    .right{
      width: 87%;
      .name{
        font-size: 16px;
      }
      .age{
        font-size: 14px;
        
      }
    }
  }
  .loginOut{
    margin:0 auto;
    margin-top: 50px;
    width: 100%;
    font-size: 20px; 
    background-color: rgb(185, 185, 185);
  }
}
//测试弹出层样式
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 80%;
    padding: 15px;
    // height: 120px;
    background-color: #fff;
    .title{
      font-size: 18px;
      margin: 5px;
      text-align: center;
    }
  }
</style>