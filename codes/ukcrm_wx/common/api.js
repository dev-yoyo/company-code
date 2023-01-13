const { http } = uni.$u


export const getData = (url, config = {}) => http.get(url, config)

export const postData = (url, config = {}) => http.post(url, config)

export const delData = (url, config = {}) => http.delete(url, config)


// 判断是否自己的客户
export const isSelfClient = (id) => http.get(`/customer/customer_belong?customer_id=${id}`)


// 时间值  今日 本月 上周等
export const timeSearch = (id) => http.get(`/index/time_search`)

// 我的 user 个人信息
export const getUser = () => http.get(`/user`)

// 获取 企业成员
export const getCompanyUserList = () => http.get(`/company/company_member`)
