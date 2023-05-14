<template>
  <div class="detail">
    <van-nav-bar class="navBar"  >
  <template #left>
    <van-icon name="arrow-left" color="black" @click="onClickLeft" size="18" />
  </template>
</van-nav-bar>
<van-cell class="topCell" :title="detail.jobName" :value="detail.salary" size="large" :label="detail.city" />
    <div class="content">
      <div class="description">
          职位描述:
       <p v-html="detail.description"></p> 
      </div>
      <div class="req">
        技能要求:
        <p v-html="detail.req"></p>
      </div>
    <div v-if="type=='0'">
      <div v-if="bol">状态:<span>{{ status }}</span></div>
    </div>
    </div>
    <div class="bottom">
      <van-button v-if="type=='2'" ref="sendBtn" class="btn" @click="send" type="warning">一键投递</van-button>
      <van-button v-if="type=='0'" ref="sendBtn" class="btn" @click="pass" type="primary">通过</van-button>
      <van-button v-if="type=='0'" ref="sendBtn" class="btn" @click="back" type="warning">驳回</van-button>
      <van-button v-if="type=='0'" ref="sendBtn" class="btn" @click="notRead" type="info">审核中</van-button>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Toast } from 'vant';
export default {
    name: 'detail',
    data() {
        return {
          detail: '',
          isLogin: false,
          type: '',
          status: '',
          bol: true,
        };
    },
    async mounted() {
        await axios({
        url: `http://localhost:3000/posdetail?id=${this.$route.query.id}`,
      }).then(res => {
        console.log('detailres',res);
        this.detail = res.data.data
        if (this.detail.status=='0') {
          this.status = '不通过';
        } else if (this.detail.status == '1') {
          this.status = '通过';
        } else if (this.detail.status == '2') {
          this.status = '审核中';
        }
        this.type=res.data.type
        this.detail.req=this.detail.req.split('\n').join('<br>')
        this.detail.description=this.detail.description.split('\n').join('<br>')
      })  
    },
  methods: {
    onClickLeft() {
      window.history.go(-1)
    }, 
    //
    editPosStatus(status) {
      axios({
        url: `http://localhost:3000/admEditPosStatus`,
        method: 'post',
        data: {
          id: this.detail.id,
          status: status,
          hr_id:this.detail.phone
        }
      }).then(res => {
        console.log(res);
       
      })
    },
    notRead() {
      this.editPosStatus(2);
      Toast('状态修改完成,审核中!');
      this.status='审核中'

    },
    pass() {
      this.editPosStatus(1);
      Toast('状态修改完成,通过!');
      this.status='通过'
    },
    //back
    back() {
      this.editPosStatus(0);
      Toast('状态修改完成,已驳回该职位!');
      this.status='驳回'
    },
    //一键投递
    send() {
      //
      axios({
        url: `http://localhost:3000/send?id=${this.$route.query.id}`,
        method:'get'
      }).then(res => {
        console.log(res);
        if (res.data.code == '200') {//投递成功
            this.$toast.success('投递成功!');
        } else if (res.data.code == '201') {//已经投递过
            this.$toast.fail('已投递,请勿重复投递!');
        }
      })
    },
    },
}
</script>

<style lang="less" scoped>
.detail{
    font-size: 14px;
 
    .topCell{
      margin-bottom: 20px;
    }
    .content{
      p{
      line-height: 21px !important;
      font-size: 12px;
      font-weight: 100;
        margin-bottom: 10px;
      }
      padding: 10px 15px;
      margin-bottom: 30px;
    }
    .bottom{
      display: flex;
      justify-content: center;
      .btn{
        width: 30%;
      }
    }
}
</style>