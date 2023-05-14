<template>
  <div id="login">
    <van-nav-bar class="navBar" :title="title"  >
  <template #left>
    <van-icon name="arrow-left" color="black" @click="onClickLeft" size="18" />
  </template>
</van-nav-bar>
<!-- 表单 -->
    <van-form class="loginForm" ref="form" @submit="onSubmit">
      <!-- 账号 username-->
  <van-field 
    v-model="username"
    name="phone"
    :label="radio==0?'账号':'手机号'"
    :placeholder="radio==0?'账号':'手机号'"
    :rules="[{ required: true, message: radio==0?'请填写账号':'请填写手机号' }]"
  />
  <!-- 密码 password-->
  <van-field
    v-model="password"
    type="password"
    name="psw"
    label="密码"
    placeholder="密码"
    :rules="[{ required: true, message: '请填写密码' }]"
  />
  <!-- 账号类型 radio-->
  <van-field name="type" label="单选框">
  <template #input>
    <van-radio-group class="radioGroup" v-model="radio" direction="horizontal">
      <van-radio class="radio"  name="0">管理员</van-radio>
      <van-radio class="radio"  name="1">招聘者</van-radio>
      <van-radio class="radio"  name="2">求职者</van-radio>
    </van-radio-group>
  </template>
</van-field>
<!-- 登录/注册 -->
  <div style="margin: 16px;">
    <van-button round block type="info" color="orange" native-type="submit">登录</van-button>
    <van-button class="registerBtn" round block  @click.prevent="register"  color="orange">注册</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
import axios from 'axios';
import { Toast } from 'vant';
export default {
  name: 'login',
    data() {
      return {
        title:'登录',
        username: '18822222222',
        password: '123456',
        radio: '1',
      };
  },
  methods: {
    register() {
      this.title = '注册'
      console.log(468465111111111);
      axios({
        url: 'http://localhost:3000/register',
        method: 'post',
        data: {
          psw: this.password,
          phone: this.username,
          type: this.radio
        }
      }).then(res => {
        console.log(res);
      })
    },
    onClickLeft() {
      window.history.go(-1)
    },
    // onClickRight() {
    // },
   async onSubmit() {
      //

      //
      // console.log('submit', values);
      
     await axios({
       url: 'http://localhost:3000/login',
       method: 'post',
       data: {
         psw: this.password,
         phone: this.username,
          type:this.radio
        }
      }).then(res => {
        console.log('loginres', res);
        if (res.data.code == 200) {
          this.$store.commit('isType',this.radio)//vuex存储用户类型
          this.$router.push('/home/position') // 跳转首页
          
        } else {
          Toast.fail('用户名或密码错误')
        }
      }).catch(err => {
       Toast.fail('用户名或密码错误')
        console.log('err',err);
      })
    },
  },
}
</script>

<style lang="less">
#login{
  background: url('../../assets/loginBg.png') no-repeat;
  background-size: cover;
  height: 100%;
  .navBar{
    background-color: orange;
  }
  .loginForm{
    margin-top: 110px;
    .registerBtn{
      margin-top: 20px;
    }
    .radioGroup{
      .radio{
        font-size: 12px;
      }
    }
  }
}
</style>