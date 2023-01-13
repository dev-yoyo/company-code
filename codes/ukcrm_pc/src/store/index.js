// import { createStore } from "vuex";
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import { getData, postData } from "@/api/user";
import router from '../router'
import { setTokens, getTokens } from "@/libs/util";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    token: '',
    message_count: 0,
    upLoadPath: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/',
    aliOss: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/',
    no_data: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/19/5m785mZ3sj3BdX6xwDZHhasxwMXj2b2c1645249353010.png",
    company: {},
    menuList: [],
    SocketMsg:{
      all_count:0
    },
    msgShow:false,
  },
  getters: {
    // 当前路由 name
    currentRouteName() {
      return router.app._route.name
    }
  },
  mutations: {
    msgShow(state,msgShow){
      state.msgShow = msgShow;
    },
    SocketMsg(state,SocketMsg){
      state.SocketMsg = SocketMsg;
    },
    setMenuList(state, menuList) {
      state.menuList = menuList;
    },
  
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setAvatar(state, avatarPath) {
      state.userInfo.avatar = avatarPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setCompany(state, company) {
      state.company = company
      state.userInfo.company = company
    },
    setToken(state, token) {
      state.token = token;
      setTokens(token);
    },
    setCount(state) {
      if (state.userId) {
        getData({
          url: `api/my_home/my_base`,
          data: {},
        }).then((res) => {
          let data = res.data;
          if (data.code === 200) {
            state.message_count = data.data.xincheng_notification_count
          }
        })
      } else {
        state.message_count = 0
      }
    },
  },
  actions: {
    // 注册
    handleRegister({ commit }, { jwt_token, user_info }) {
      commit("setToken", jwt_token);
      commit("setUserInfo", user_info);

      router.push({ 
        path: '/company_create',
        query: {
          from: 'register'
        } 
      })
      window.scrollTo(100, 0)
    },
    // 登录
    handleLogin({ commit }, { jwt_token, user }) {
      commit("setToken", jwt_token);
      commit("setUserInfo", user);

      if (user.company_id === 0) {
        router.push({
          path: '/company_create', 
          query: {
            from: 'login'
          } 
        })
      } else {
        router.push({ path: '/company_choose' })
        
      }

      window.scrollTo(100, 0)
    },
    // 退出登录
    handleLogOut({ commit }) {
      postData({
        url: "/login_out",
        data: {},
      }).then(() => {
        commit("setToken", "");
        commit("setUserInfo", {});
        commit("setCompany", {});
        commit("SocketMsg", "");
        commit("msgShow", "");
        
        // router.replace({ path: '/login' })
        window.location.href='/login'
        window.scrollTo(100, 0)
      });
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});
