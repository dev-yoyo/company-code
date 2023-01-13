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
    PersonMenuList:[],
    SingleTeam:false,
    islogin:false,//用户登录的全局状态
    SocketNum:{
      all_count:0
    }
  },
  getters: {
    // 当前路由 name
    currentRouteName() {
      return router.app._route.name
    }
  },
  mutations: {
    SocketNum(state,SocketNum){
      state.SocketNum = SocketNum;
    },
    setPersonMenuList(state, PersonMenuList) {
      state.PersonMenuList = PersonMenuList;
    },
    setIslogin(state, islogin) {
      state.islogin = islogin;
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
    setRoleId(state, RoleId) {
      state.userInfo.role_id = RoleId
    },
    setSingleTeam(state,val){
      state.SingleTeam = val
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setToken(state, token) {
      state.token = token;
      setTokens(token);
    }
 
  },
  actions: {
    // changeRole
    handleRegister(context,args) {
      context.commit("setToken", args.jwt_token);
      context.commit("setUserInfo", args.user_info);
      context.commit("setIslogin", true);
      // 登录注册 不可更改！！！！！ 与注册保持一致 取的是 args.user_info
 
      window.location.href='/home'
      window.scrollTo(100, 0)
    },
    // 注册
    // handleRegister({ commit }, { jwt_token, user_info }) {
    //   console.log('commit----',commit)
    //   console.log('jwt_token, user_info----',jwt_token, user_info)
    //   commit("setToken", jwt_token);
    //   commit("setUserInfo", user_info);
    //   commit("setIslogin", true);
    
    //   console.log(' state.userInfo', store.state.userInfo)
    //   // router.push({ 
    //   //   path: '/home',
    //   // })
    //   // window.location.href='/home'
    //   // window.scrollTo(100, 0)
    // },
    // 退出登录
    handleLogOut({ commit }) {
      getData({
        url: "/login/log_out",
        data: {},
      }).then(() => {
        // 清除token 用户数据 管理员登录状态
        commit("setToken", "");
        commit("setUserInfo", {});
        commit("setIslogin", false);
        localStorage.setItem('login',false)
        localStorage.setItem('headRoleid','')
        window.location.href='/home'
      });
      // commit("setToken", "");
      // commit("setUserInfo", {});
      // commit("setIslogin", false);
      // localStorage.setItem('login',false)
      // localStorage.setItem('headRoleid','')
      // window.location.href='/home'
    
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});
