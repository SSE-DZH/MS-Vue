import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth'; // 引入 auth 模块

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth // 注册 auth 模块
  }
});
