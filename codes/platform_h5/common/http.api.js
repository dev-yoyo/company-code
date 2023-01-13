// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数

	let getUserInfo = (params = {}) => vm.$u.get(`m/get_user_info`, params); // 获取用户信息
	let updataToken = (params = {}) => vm.$u.get(`m/get_token_by_id/${params.id}`, params); // 更新token

	// 问答	问答	问答	问答	问答	问答	问答	问答
	let getAskList = (params = {}) => vm.$u.get('m/ask', params); // 问答列表
	let getAskChannel = (params = {}) => vm.$u.get('m/ask/channel', params); // 问答列表 分类
	let getAskDetail = (params = {}) => vm.$u.get(`m/ask/${params.id}`, params); // 问答详情
	let getAskCreate = () => vm.$u.get(`m/ask/create`); // 问答创建 页面数据
	let getAskEdit = (params = {}) => vm.$u.get(`m/ask/${params.id}/edit`, params); // 问答编辑详情
	let getAllTagsFromChannel = (params = {}) => vm.$u.get(`m/ask/get_all_tags_from_channel/${params.id}`, params); // 问答创建 页面数据
	let AskCreate = (params = {}) => vm.$u.post(`m/ask`, params); // 创建问答
	let AskPut = (params = {}) => vm.$u.put(`m/ask/${params.id}`, params); // 编辑问答
	let AskDetailDelete = (params = {}) => vm.$u.delete(`m/ask/${params.id}`, params); // 删除 问答详情
	let AskDelete = (params = {}) => vm.$u.delete(`m/ask/${params.id}`, params); // 删除 问答
	let AskAppeal = (params = {}) => vm.$u.post(`m/appeal`, params); // 申诉 问答

	let rewardAsk = (params = {}) => vm.$u.get(`m/ask/reward_question`, params); // 悬赏问答 支付
	let conclusionAsk = (params = {}) => vm.$u.post(`m/ask/conclusion/${params.id}`, params); // 结题
	let askRewardPayLog = (params = {}) => vm.$u.get(`m/ask/query_order`, params); // 外部浏览器 悬赏问答 支付成功结果 
	// 问答	问答	问答	问答	问答	问答	问答	问答


	// AI  AI  AI  AI  AI  AI  AI  AI  AI  AI  AI  AI  AI 
	let getAiList = (params = {}) => vm.$u.get("m/items", params); // 列表
	let getAiDetail = (params = {}) => vm.$u.get(`m/items/${params.id}`, params); // 详情
	let shoppingCars = (params = {}) => vm.$u.post(`m/shopping_cars`, params); // 添加购物车
	let shopList = (params = {}) => vm.$u.get(`m/shopping_cars`, params); // 购物车列表
	let delShopCars = (params = {}) => vm.$u.delete(`m/shopping_cars`, params); // 删除 购物车
	let buyBefore = (params = {}) => vm.$u.get(`m/orders/check_before_settlement`, params); // 购物车列表 结算按钮
	let goPayment = (params = {}) => vm.$u.get(`m/orders/go_settlement`, params); // 结算订单页面数据
	let payMoney = (params = {}) => vm.$u.post(`m/orders/unified_order`, params); // 结算订单页面 去支付按钮
	let getJsSdk = (params = {}) => vm.$u.get(`m/orders/get_js_config`, params); // 微信浏览器支付 获取js sdk
	let payLog = (params = {}) => vm.$u.get(`m/orders/query_order`, params); // 外部浏览器 商品支付成功结果 
	// AI  AI  AI  AI  AI  AI  AI  AI  AI  AI  AI  AI  AI 

	// 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票
	let invoiceInfo = (params = {}) => vm.$u.get(`m/invoices`, params); // 发票信息
	let editInvoice = (params = {}) => vm.$u.post(`m/invoices`, params); // 保存 修改发票信息
	// 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票 发票


	let getHomeList = (params = {}) => vm.$u.get(`m/index`, params); // 首页列表
  let getSystemList = (params = {}) => vm.$u.get(`m/h5_production_resource`, params); // 单页面
	let getMsgList = (params = {}) => vm.$u.get(`m/messages/${params.type}`, params); // 信息列表
	let getMsgClear = (params = {}) => vm.$u.get(`m/messages/clear`, params); // 信息删除
	let getMsgRead = (params = {}) => vm.$u.get(`m/messages/read/${params.id}`, params); // 消息已读

	let getSearch = (params = {}) => vm.$u.get(`m/search/questions`, params); // 搜索问答
	let getSearchAi = (params = {}) => vm.$u.get(`m/search/items`, params); // 搜索AI
	let getUser = (params = {}) => vm.$u.get(`m/user`, params); // 个人中心
	let getUserCollect = (params = {}) => vm.$u.get(`m/user/collect`, params); // 我的收藏
	let getUserAsk = (params = {}) => vm.$u.get(`m/user/${params.type}`, params); // 我的问答
	let getUserDemand = (params = {}) => vm.$u.get(`m/demand/my_demand`, params); // 我的外包
	let getUserOrder = (params = {}) => vm.$u.get(`m/user/orders`, params); // 我的订单
	let getOrderLog = (params = {}) => vm.$u.get(`m/orders/logistics/${params.id}`, params); // 我的订单
	let getUserAddress = (params = {}) => vm.$u.get(`m/user/address`, params); // 地址管理
	let getAddressInfo = (params = {}) => vm.$u.get(`m/addresses/edit/${params.id}`, params); // 地址编辑回显数据
	let exchangePoint = (params = {}) => vm.$u.get(`m/user/exchange_point`, params); // 商品兑换列表页
	let exchangePointDetail = (params = {}) => vm.$u.get(`m/user/set_exchange_point_page/${params.id}`, params); // 商品兑换详情页
	let pointExchangeEecord = (params = {}) => vm.$u.get(`m/user/point_exchange_record`, params); // 兑换记录
	let setExchangePoint = (params = {}) => vm.$u.post(`m/user/set_exchange_point/${params.id} `, params); // 商品兑换功能

	let checkCollect = (params = {}) => vm.$u.post(`m/collect/${params.id}`, params); // 收藏
	let checkVote = (params = {}) => vm.$u.post(`m/vote/${params.id}`, params); // 点赞
	let checkReply = (params = {}) => vm.$u.post(`m/replies/${params.id}/store`, params); // 评论回复
	let checkAdoption = (params = {}) => vm.$u.post(`m/ask/${params.id}/adoption`, params); // 采纳

	let sendCode = (params = {}) => vm.$u.post(`m/sendcode`, params); // 获取验证码
	let codeLogin = (params = {}) => vm.$u.post(`m/login`, params); // 手机号注册


	// 地址 地址 地址 地址 地址 地址 地址 地址 地址 地址 地址 地址
	let addAddress = (params = {}) => vm.$u.post(`m/addresses`, params); // 地址管理
	// put
	let editAddress = (params = {}) => vm.$u.put(`m/addresses/${params.id}`, params); // 地址管理
	// 地址 地址 地址 地址 地址 地址 地址 地址 地址 地址 地址 地址



	// delete delete delete delete delete delete delete delete delete
	let deleteReply = (params = {}) => vm.$u.delete(`m/replies/${params.id}`, params);
	let deleteAddress = (params = {}) => vm.$u.delete(`m/addresses/${params.id}`, params);

	// admin
	let adminList = (params = {}) => vm.$u.get(`m/majia/content_manage?type=${params.type}&page=${params.page}`, params);
	let getArtDetail = (params = {}) => vm.$u.get(`m/articles/${params.id}`, params); // 专栏详情
	let getDownDetail = (params = {}) => vm.$u.get(`m/resources/${params.id}`, params); // 资料详情
	let getStatusDetail = (params = {}) => vm.$u.post(`m/majia/majia_set_status/${params.id}`, params); // 审核准专栏 资料详情
	let getDeleteUser = (params = {}) => vm.$u.delete(`m/majia/recycle/${params.id}`, params); // 拉黑用户


	let demandList = (params = {}) => vm.$u.get(`m/demand?classify=${params.classify}&search_word=${params.search_word}&type=${params.type}&area_id=${params.area_id}`, params); // 需求分类
	let demandCreate = (params = {}) => vm.$u.get(`m/demand/create `, params); // 需求分类
	let demandCreateBtn = (params = {}) => vm.$u.post(`m/demand/store `, params); // 发布需求
	let demandEdit = (params = {}) => vm.$u.get(`m/demand/${params.id}/edit`, params); // 编辑需求数据回显
	let demandEditUpdata = (params = {}) => vm.$u.post(`m/demand/${params.id}/update`, params); // 编辑需求
	let getDemandDetail = (params = {}) => vm.$u.get(`m/demand/detail/${params.id}`, params); // 详情数据
	let demandDetailStatus = (params = {}) => vm.$u.post(`m/demand/${params.id}/update_status`, params); // 需求下线


	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getUserInfo,
		updataToken,
		sendCode,
		codeLogin,
		addAddress,
		getAddressInfo,

		getAskList,
		getAskChannel,
		getAskDetail,
		getAskCreate,
		getAskEdit,
		rewardAsk,
		conclusionAsk,
		askRewardPayLog,

		getAllTagsFromChannel,
		AskCreate,
		AskPut,
		AskDelete,
		AskDetailDelete,
		AskAppeal,
		getUserAsk,
		getUserDemand,
		getUserOrder,
		getOrderLog,
		getUserAddress,
		checkCollect,
		checkVote,
		checkReply,
		checkAdoption,
		deleteReply,
		editAddress,

		getHomeList,
        getSystemList,
		getMsgList,
		getMsgClear,
		getMsgRead,

		getSearch,
		getSearchAi,
		getUser,
		getUserCollect,

		getAiList,
		getAiDetail,

		deleteAddress,
		getAiDetail,
		shoppingCars,
		shopList,
		delShopCars,
		buyBefore,
		goPayment,
		payMoney,
		getJsSdk,
		payLog,

		invoiceInfo,
		editInvoice,
		exchangePoint,
		exchangePointDetail,
		pointExchangeEecord,
		setExchangePoint,
		adminList,
		getArtDetail,
		getDownDetail,
		getStatusDetail,
		getDeleteUser,

		demandList,
		demandCreate,
		demandCreateBtn,
		demandEdit,
		demandEditUpdata,
		getDemandDetail,
		demandDetailStatus
	};
}

export default {
	install
}