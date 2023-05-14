<template>
  <div id="posCell" >
    <div class="box" @click="toDetail">
        <div class="top"><span class="left">{{jobName}}</span><span class="right">{{ salary }}</span></div>
        <div class="company">{{ company }}</div>
        <div class="bottom">
            <span class="left">
            <img src="../../../assets/user.png" alt="">{{name}}
            </span>
            <span class="right">{{city}}</span>
            
        </div>
    </div>

  </div>
</template>

<script>
export default {
    name: 'posCell',
    props:['jobName','salary','company','name','city','id',],
    data() {
        return {
            picUrl:''
        };
    },
    methods: {
        toDetail() {
            console.log('toDetail');
            this.$router.push({ path: '/posdetail', query: { id: this.id } })
            }
           },
}
</script>

<style lang="less" scoped>
#posCell{
    padding: 4px 5px;
    font-size: 18px;
    .box{
        padding:12px 12px;
        overflow: hidden;
        width: 100%;
        height: 100px;
        background-color: rgb(255, 255, 255);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top{
                display: flex;
                justify-content: space-between;
                .left{
                    font-weight: 600;
                }
            .right{
                font-size: 16px;
                color: rgba(254, 188, 64, 0.846);
            }
        }
        .company{
            font-size: 14px;
            padding-left: 75px;
            padding-top: 10px;
            
        }
        .bottom{
                height: 26px;
                display: flex;
                justify-content: space-between;
          .left{
            
            img{
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    background-color: orange;
                    margin-right: 7px;
                    vertical-align:text-bottom

                }   
            font-size: 16px;
            
          }
            .right{
                color: rgb(153, 153, 153);
                font-size: 16px;
            }
        }
    }
}
</style>