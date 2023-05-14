import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './style/common.css'
import ImagePreview from 'vant'
import store from './store'
//屏幕适配插件 改动屏幕宽度自动更新rem
import 'amfe-flexible'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import Vant from 'vant'
import 'vant/lib/index.css'
//引入基础样式
import 'normalize.css'
import axios from 'axios'
import { Toast } from 'vant'
axios.defaults.withCredentials = true

// 使用 vant
Vue.use(Vant)
Vue.use(Toast)
Vue.use(ImagePreview);//图片预览
Vue.config.productionTip = false
//设置rem 为屏幕的十分之一
document.querySelector('html').style.fontSize = window.innerWidth / 10
new Vue({
  render: h => h(App),
  // 挂载到Vue上
  store,
  router,
  Toast
}).$mount('#app')
