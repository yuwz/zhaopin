import Vue from 'vue'
//1.导入路由
import VueRouter from 'vue-router'
//导入组件
import home from '../views/home/home.vue'
import position from '../views/home/position/position.vue'
import music from '../views/home/music/music.vue'
import message from '../views/home/message/message.vue'
import my from '../views/home/my/my.vue'
import login from '../views/login/login.vue'
import posdetail from '../views/home/position/posdetail.vue'
import hrMessageDetail from '../views/home/message/hrMessageDetail.vue'
// 2.use一下
Vue.use(VueRouter)
//3.注册路由信息
const routes = [
    {
        path: '/login',
        component: login
    },
    {
        path: '/',
        redirect: '/home/position'

    },
    {
        path: '/posdetail',
        component: posdetail
    },
    {
        path: '/hrMessageDetail',
        component: hrMessageDetail
    },
    {
        path: '/home',
        redirect: '/home/position'
    },
    {
        path: '/home',
        component: home,
        children: [
            {
                path: '/home/position',
                component: position,

            },
            {
                path: '/home/music',
                component: music,


            },
            {
                path: '/home/message',
                component: message,

            },
            {
                path: '/home/my',
                component: my

            },



        ]
    },

]
// 4.实例化路由对象
const router = new VueRouter(
    {
        routes
    }
)
export default router