import axios from 'axios';

const state = {
  token: null // 将 token 初始值设为 null
};

const mutations = {
  setToken(state, token) {
    state.token = token;
  }
};

const actions = {
  // 通用的登录 action，根据传入的接口地址向后端发送登录请求，并将返回的 token 存储在 Vuex 中
  async login({ commit }, { apiUrl, form }) {
    try {
      const response = await axios.post(apiUrl, form);
      const token = response.data.data.token;
      commit('setToken', token); // 将 token 存储在 Vuex 中
      return response; // 返回整个响应对象
    } catch (error) {
      console.error('登录失败:', error);
      throw error; // 可以选择抛出异常以供组件捕获并处理
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
