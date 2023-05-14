<template>
  <div class="musicComments">
    <div class="top">
        <div class="left"><img :src="avatarUrl" alt=""></div>
        <div class="right">
            <div class="user">{{ user }}</div>
            <div class="time">{{time}}&nbsp;&nbsp;&nbsp;{{ location }}</div>
        </div>
    </div>
<div class="content">{{ content }}</div>
  </div>
</template>

<script>
export default {
    name: 'musicComments',
    props:['time','user','avatarUrl','location','content']
}
</script>

<style lang="less" scoped>
.musicComments{
    padding: 15px 10px;
    background-color: @bgc;
    .top{
        display: flex;
        margin-bottom: 10px;
        .left{
                margin-right: 7px;
            img{
                width: 28px;
                height: 28px;
                background-color: rgb(18, 255, 26);
                border-radius: 50%;
                
            }
        }
        .right{
            .user{
                font-size: 16px;
                margin-bottom: 5px;
            }
            .time{
                color: rgb(121, 121, 121);
                font-size: 12px;
            }
        }
    }
    .content{
        padding-left: 35px;
        padding-right: 5px;
        padding-bottom: 20px;
        font-size: 16px;
        line-height: 25px;
        border-bottom: 1px solid rgb(232, 232, 232);
    }
}
</style>