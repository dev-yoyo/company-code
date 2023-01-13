import axios from 'axios'
import config from '@/libs/config'
import store from '@/store'
import { Message } from 'element-ui'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
class HttpRequest {
  constructor() {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    return {
      baseURL: this.baseUrl,
      headers: {
        authorization: 'Bearer ' + store.state.token
      }
    }
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => { // 请求成功时
        // console.log('请求成功时》》》》》', config);
        // 添加全局的loading...

        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true

        return config
      },
      error => {// 请求失败的时候
        // console.log('请求失败的时候>>>', error);
        return Promise.reject(error)
      })

    // 响应拦截
    instance.interceptors.response.use(
      res => {
        if (res.data.code === 4001 || res.data.code === 4003) {
          store.commit("setToken", "");
          store.commit("setUserInfo", {});

          window.location.replace('/login')
          window.scrollTo(100, 0)
        }

        if (res.data.code === 4002) {
          Message({
            message: res.data.data.msg,
            type: 'warning'
          })
        }

        this.destroy(url)
        return res.data
      },
      error => {
        // console.log('error>>>', error.response);
        // this.destroy(url)
        // let errorInfo = error.response
        // switch (errorInfo.status) {
        //   case 404:
        //     Message.error({ message: '请求404!' });
        //     break;
        //   case 429:
        //     Message.error({ message: '请求过于频繁，请稍后再试!' });
        //     break;
        //   case 500:
        //     Message.error({ message: '请求500!' });
        //     break;

        //   default:
        //     Message.error({ message: '请检查网络!' });
        //     break;
        // }

        // if (!errorInfo) {

        //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        //   errorInfo = {
        //     statusText,
        //     status,
        //     request: { responseURL: config.url }
        //   }
        // }
        // addErrorLog(errorInfo)
        return Promise.reject(error)
      })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
