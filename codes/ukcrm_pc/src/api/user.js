import axios from '@/libs/api.request'
import store from '@/store'

export const login = (data) => {
  return axios.request({
    url: '/login',
    data,
    method: 'post'
  })
}

// get方式
export const getData = ({ url, data }) => {
  return axios.request({
    url: url,
    method: 'get',
    params: data
  })
}

// post方式
export const postData = ({ url, data }) => {
  return axios.request({
    url: url,
    method: 'post',
    data: data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      authorization: 'Bearer ' + store.state.token
    }
  })
}

// delete方式
export const delData = ({ url }) => {
  return axios.request({
    url: url,
    method: 'delete'
  })
}

// put方式
export const putData = ({ url, data }) => {
  return axios.request({
    url: url,
    method: 'put',
    data: data
  })
}

// 获取 企业成员
export const getCompanyList = ({ data }) => {
  return axios.request({
    url: "/company/company_member",
    method: 'GET',
    params: data
  })
} 