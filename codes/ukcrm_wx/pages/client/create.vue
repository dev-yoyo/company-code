<template>
	<view class="detail_main">
		<u-toast ref="uToast"></u-toast>

		<view class="tit d-flex">
			<view class="txt"> 基本信息 </view>
			<view class="auto_txt d-flex" @click="auto"><i class="icon iconfont icon-sm"></i>自动识别</view>
		</view>

		<view class="form_main">
			<u-form ref="uForm" :model="info" :rules="rules" labelPosition="left" labelWidth="100">
				<u-form-item label="客户性质" prop="customer_type" @click="type_list" required>
					<view class="right_icon d-flex">
						<u-input v-model="info.customer_type" placeholder="请选择" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" readonly></u-input>
						<u-icon name="arrow-right" v-if="!isEdit"></u-icon>
					</view>
				</u-form-item>

				<u-form-item label="客户状态" prop="customer_status" @click="status_list" required>
					<view class="right_icon d-flex">
						<u-input v-model="info.customer_status" placeholder="请选择" placeholderStyle="#999999"	fontSize="14" border="none" inputAlign="right" readonly></u-input>
						<u-icon slot="right" v-if="!isEdit" name="arrow-right"></u-icon>
					</view>

				</u-form-item>

				<u-form-item label="客户姓名" prop="name" required>
					<u-input v-model="info.name" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right"></u-input>
				</u-form-item>

				<u-form-item label="岗位职务" prop="duty">
					<u-input v-model="info.duty" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right"></u-input>
				</u-form-item>

				<u-form-item label="企业角色" @click="role_list" prop="roleVal" required>
					<u-input v-model="info.roleVal" placeholder="请选择" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="企业名称" prop="company" required>
					<u-input v-model="info.company" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right"></u-input>
				</u-form-item>

				<u-form-item label="企业地址" prop="address">
					<u-input v-model="info.address" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right"></u-input>
				</u-form-item>
			</u-form>
		</view>
		
		<view class="tit other_msg d-flex">
			<view class="txt"> 联系方式 </view>
		</view>
		<view class="form_main">
			<u-form :model="info" labelPosition="left" labelWidth="100">
				<u-form-item label="微信" prop="wechat">
					<u-input v-model="info.wechat" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" maxlength="25"></u-input>
				</u-form-item>

				<u-form-item label="联系电话" prop="phone">
					<u-input v-model="info.phone" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" type="number" maxlength="25"></u-input>
				</u-form-item>
			</u-form>
		</view>

		<view class="tit other_msg d-flex">
			<view class="txt"> 扩展信息 </view>
		</view>
		<view class="form_main">
			<u-form :model="info" labelPosition="left" labelWidth="100">
				<u-form-item label="客户标签" @click="tag_list">
					<u-input v-model="info.tag" placeholder="请选择" placeholderStyle="#999999" fontSize="14" border="none"	inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="客户来源" @click="from_list">
					<u-input v-model="info.from" placeholder="请选择" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="所属行业" @click="industry_list">
					<u-input v-model="info.industry" placeholder="请选择" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="所在地区" @click="areaShow = true" required>
					<u-input v-model="info.customerArea" placeholder="请选择" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="客户级别" @click="level_list">
					<u-input v-model="info.level" placeholder="请选择" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="客户名片" @click="showImg = true">
					<u-input v-if="!info.business_card" placeholder="去上传" placeholderStyle="#999999" fontSize="14" border="none" inputAlign="right" readonly></u-input>
					<image class="business_card" v-else :src="info.business_card" mode="aspectFill"></image>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
			</u-form>
		</view>
		
		<view class="tit other_msg d-flex">
			<view class="txt"> 其他信息 </view>
		</view>
		<view class="form_main">
			<u-form>
				<u-form-item label="创建人" labelWidth="100">
					<u-input v-model="user.name" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none" inputAlign="right" readonly></u-input>
				</u-form-item>

				<u-form-item>
					<view class="l_label"> 备注</view>
					<view>
						<u--textarea v-model="info.remarks" placeholder="请输入" placeholderStyle="#999999" fontSize="14"	border="none"></u--textarea>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

		<view class="fixed_btm btm_btns d-flex" v-if="isEdit">
			<u-button type="default" @click="cancel" :customStyle="cancelStyle">取消</u-button>
			<u-button @click="create" color="#4D6FFF" :loading="createLoading" :disabled="createLoading">保存</u-button>
		</view>

		<view class="fixed_btm btm_btns d-flex" :class="is_create ? 'lightBtn' : 'btn'" v-else>
			<u-button @click="create" :loading="createLoading" :disabled="createLoading">{{ isEdit ? "提交" : "创建" }}</u-button>
		</view>

		<area-selection :show="areaShow" ref="uPicker" :columns="areaColumns" @confirm="fatherConfirm"	@cancel="areaCancel"></area-selection>

		<u-popup :show="showImg" :round="10">
			<view class="upload_box">
				<view class="upload" @click="uploadCard"><text>{{info.business_card?'重新上传':'上传图片'}}</text></view>
				<view class="celUpload" @click="showImg = false"><text>取消</text></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import config from '@/common/config';
	import {getData,postData,getUser} from "@/common/api";
	import areaSelection from "@/components/areaSelection";
	import store from "@/store";

	export default {
		data() {
			return {
				showImg: false,
				createLoading: false,
				isEdit: false,
				infoId: "",
				user: {},
				info: {
					customer_type: "",
					customer_status: "",
					name: "",
					phone: "",
					wechat: "",
					company: "",
					address: "",
					duty: "", // 职务
					level: "",
					roleVal: "",
					business_card: "", // 客户名片

					tag: "",
					from: "",
					industry: "",
					customerArea: "",
					areaIds: [], // 地区ids
					areaIndexs: [], // 地区索引
					remarks: "",
				},
				rules: {
					customer_type: {
						type: "string",
						required: true,
						message: "请选择客户性质",
						trigger: ["blur", "change"],
					},
					customer_status: {
						type: "string",
						required: true,
						message: "请选择企业行业",
						trigger: ["blur", "change"],
					},
					roleVal: {
						type: "string",
						required: true,
						message: "请选择企业角色",
						trigger: ["blur", "change"],
					},
					name: [{
							type: "string",
							required: true,
							message: "请输入客户姓名",
							trigger: ["blur", "change"],
						},
						{
							validator: (rule, value, callback) => {
								if (value.length > 4) {
									return false;
								}
							},
							message: "客户姓名限制4个字符",
							trigger: ["change", "blur"],
						},
					],
					// phone: [{
					// 		type: "number",
					// 		required: true,
					// 		message: "请输入联系电话",
					// 		trigger: ["blur", "change"],
					// 	},
					// 	{
					// 	    validator: (rule, value, callback) => {
					// 	      return this.$u.test.mobile(value) ;
					// 	    },
					// 	    message: "手机号码不正确",
					// 	    trigger: ["change", "blur"],
					// 	},
					// ],
					company: [{
							type: "string",
							required: true,
							message: "请输入企业名称",
							trigger: ["blur", "change"],
						},
						{
							validator: (rule, value, callback) => {
								if (value.length > 16) {
									return false;
								}
							},
							message: "企业名称限制16个字符",
							trigger: ["change", "blur"],
						},
					],
					address: [{
							type: "string",
							required: false,
							message: "请输入企业名称",
							trigger: ["blur", "change"],
						},
						{
							validator: (rule, value, callback) => {
								if (value.length > 30) {
									return false;
								}
							},
							message: "企业地址限制30个字符",
							trigger: ["change", "blur"],
						},
					],
				},

				roleList: [], // 角色
				levelList: [], // 级别
				typeList: [],
				statusList: [],
				tagList: [],
				fromList: [],
				industryList: [],

				cancelStyle: store.state.cancelStyle,

				areaShow: false,
				areaValue: "选择地区",
				areaColumns: [],
			};
		},
		components: {
			areaSelection,
		},
		computed: {
			// 创建按钮状态
			is_create() {
				let flag = false;
				const {customer_type,customer_status,roleVal,name,phone,wechat,company,customerArea} = this.info;
				if (!this.isEdit &&	customer_type && customer_status &&	roleVal &&	name &&	 company && customerArea && (phone || wechat)) {
					flag = true;
				}
				return flag;
			},
			is_save() {
				let flag = false;
				const {customer_type,customer_status,roleVal,name,phone,wechat,company,customerArea} = this.info;
				if (this.isEdit && customer_type && customer_status && roleVal && name && company && customerArea && (phone || wechat)) {
					flag = true;
				}
				return flag;
			},
		},
		onLoad() {
			let query = this.$Route.query;
			if (query.edit) {
				this.infoId = query.id;
				this.isEdit = query.edit;
				this.edit();
				uni.setNavigationBarTitle({title: '编辑客户'})
			}
			this.init();

			// 数据监听
			let _th = this;
			uni.$on("updateData", function(data) {
				switch (data.type) {
					case "type":
						_th.info.customer_type = data.value;
						break;
					case "status":
						_th.info.customer_status = data.value;
						break;
					case "tag":
						_th.info.tag = data.value;
						break;
					case "from":
						_th.info.from = data.value;
						break;
					case "industry":
						_th.info.industry = data.value;
						break;
					case "role":
						_th.info.roleVal = data.value;
						break;
					case "level":
						_th.info.level = data.value;
						break;
					default:
						break;
				}
			});
		},
		mounted() {
			this.$nextTick(() => {
				this.$refs.uForm.setRules(this.rules);
			});
		},
		methods: {
			// 行业
			init() {
				// // 所属行业
				// getData("/company/industry").then((res) => {
				//   const {
				//     code,
				//     data: { list },
				//   } = res;
				//   if (code === 200) {
				//     this.industryList = list;
				//   }
				// });

				// 全国省市区
				getData("/area").then((res) => {
					const {code,data: {list}} = res;
					if (code === 200) {
						this.areaColumns = list;
					}
				});

				// 标签
				getData("/customer/tag").then((res) => {
					const {code,data: {company_role,customer_tag,customer_from,customer_type,customer_status,customer_role}} = res;
					if (code === 200) {
						this.roleList = company_role;
						this.typeList = customer_type;
						this.statusList = customer_status;
						this.tagList = customer_tag;
						this.fromList = customer_from;
						this.levelList = customer_role;
					}
				});

				getUser().then((res) => {
					const {code,data: {user}} = res;
					if (code === 200) {
						this.user = user;
					}
				});
			},

			// 编辑回显
			edit() {
				getData("/customer/customer_detail", {params:{customer_id: this.infoId}}).then((res) => {
					const {code,data:{customer}} = res;
					if (code === 200) {
						this.info.name = customer.name;
						this.info.phone = customer.phone;
						this.info.wechat = customer.wechat;
						this.info.company = customer.company;
						this.info.address = customer.address;

						this.info.customer_type = customer.customer_type_name;
						this.info.customer_status = customer.customer_status_name;
						this.info.tag = customer.tag_name;
						this.info.from = customer.from_name;
						this.info.duty = customer.position;
						this.info.level = customer.level;
						this.info.roleVal = customer.company_role;
						this.info.remarks = customer.remarks;
						this.info.business_card = customer.business_card;

						const {area,area_area,area_city} = customer;
						if (area && area_area && area_city) {
							this.info.areaIds = [area.id, area_area.id, area_city.id];
							this.info.customerArea = `${area.name} ${area_area.name} ${area_city.name}`;
						}
					}
				});
			},

			// 自动识别名片
			auto() {
				let _th = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album", "camera"], //从相册选择
					success: function(res) {
						uni.showLoading({title: "识别中",mask: true});
						uni.getFileSystemManager().readFile({
							filePath: res.tempFilePaths[0], // 图片地址 本地or网络
							encoding: "base64",
							success: (res) => {
								let base64Image = res.data;
								postData("/customer/ocr",{image: base64Image}).then((res) => {
									const {code,data: {info,msg}} = res;
									if (code === 200) {
										uni.hideLoading();
										if (info.length > 0) {
											info.map((v, i) => {
												let val = v.Value.trim();
												switch (v.Name) {
													case "姓名":
														_th.info.name = val;
														break;
													case "手机":
														//   let tel = val.replace(/[^0-9]/gi, "");
														//   if (val.length > 11) {
														//     _th.info.phone = tel.substring(tel.length - 11);
														//   } else {
														//     _th.info.phone = tel.substring(0, 11);
														//   }
														_th.info.phone = val;
														break;
													case "公司":
														_th.info.company = val
															.substring(0, 16);
														break;
													case "地址":
														_th.info.address = val
															.substring(0, 30);
														break;
													default:
														break;
												}
											});
										}
									} else if (code === 422) {
										this.$u.toast(msg);
										uni.hideLoading();
									}
								});
							},
							error() {
								uni.hideLoading();
							},
						});
					},
				});
			},

			type_list() {
				if (this.isEdit) return;
				this.$Router.push({
					path: "/choose_list",
					query: {
						list: this.typeList,
						type: "type",
					}
				});
			},
			status_list() {
				if (this.isEdit) return;
				this.$Router.push({
					path: "/choose_list",
					query: {
						list: this.statusList,
						type: "status",
					},
				});
			},
			tag_list() {
				this.$Router.push({
					path: "/choose_list",
					query: {
						list: this.tagList,
						type: "tag",
					},
				});
			},
			from_list() {
				this.$Router.push({
					path: "/choose_list",
					query: {
						list: this.fromList,
						type: "from",
					},
				});
			},
			industry_list() {
				// 所属行业
				getData("/company/industry").then((res) => {
					const {code,data: {list}} = res;
					if (code === 200) {
						this.industryList = list;
						this.$Router.push({
							path: "/choose_list",
							query: {
								list: list,
								type: "industry",
							},
						});
					}
				});
			},
			role_list() {
				this.$Router.push({
					path: "/choose_list",
					query: {
						list: this.roleList,
						type: "role",
					},
				});
			},
			level_list() {
				this.$Router.push({
					path: "/choose_list",
					query: {
						list: this.levelList,
						type: "level",
					},
				});
			},

			fatherConfirm({ids,value,indexs}) {
				let val = `${value[0]} ${value[1]} ${value[2]}`;
				this.info.customerArea = val;
				this.info.areaIds = ids;
				this.info.areaIndexs = indexs;
				this.areaShow = false;
			},
			areaCancel() {
				this.areaShow = false;
			},

			phoneChange(e) {
				let tel = e.replace(/\D/g, "");
				if (tel.length > 11) {
					this.info.phone = tel.substr(tel.length - 11);
				}
			},

			// 创建
			create() {
				this.$refs.uForm.validate().then((res) => {
					let info = this.info;
					if(!info.phone && !info.wechat){
						this.$u.toast("电话和微信必填一项");
						return;
					}
					if(!info.wechat.trim()){
						this.$u.toast('请填写有效的微信号');
						return;
					}
					if (!info.customerArea) {
						this.$u.toast("请选择所在地区");
						return;
					}

					let typeIndex = this.typeList.indexOf(info.customer_type);
					let statusIndex = this.statusList.indexOf(info.customer_status);
					let tagIndex = this.tagList.indexOf(info.tag);
					let fromIndex = this.fromList.indexOf(info.from);

					this.createLoading = !this.createLoading;

					let url = "/customer/store";
					if (this.isEdit) {
						url = "/customer/update";
					}

					postData(url, {
						customer_id: this.infoId,
						customer_type: typeIndex,
						customer_status: statusIndex,
						name: info.name,
						phone: info.phone,
						wechat: info.wechat,
						company: info.company,
						address: info.address,
						tag: tagIndex + 1,
						from: fromIndex + 1,
						industry: info.industry,
						business_card: info.business_card,

						position: info.duty,
						company_role: info.roleVal,
						level: info.level,

						province: info.areaIds[0],
						city: info.areaIds[1],
						area: info.areaIds[2],
						remarks: info.remarks,
					})
					.then((res) => {
						const {code,data: {msg,customer_type,customer_status}} = res;
						if (code === 200) {
							this.$refs.uToast.show({
								message: msg,
								complete() {
									uni.navigateBack({delta: 1 });
									uni.$emit("updateCustomerList", {activeTab: typeIndex == 0 ? "my" : "com"});
								},
							});
						} else if (code === 422) {
							if (customer_type) {
								this.$u.toast(customer_type[0]);
							}
							if (customer_status) {
								this.$u.toast(customer_status[0]);
							} else if (msg) {
								this.$u.toast(msg);
							}

							this.createLoading = !this.createLoading;
						} else {
							this.$u.toast(msg);
						}
					})
					.catch(() => {
						this.createLoading = !this.createLoading;
						// uni.$u.toast("创建失败，请重试");
					});
				});
			},

			cancel() {
				uni.navigateBack({delta: 1});
			},
			
			// 上传名片
			uploadCard(){
				uni.chooseImage({
					count: 1,
					sizeType: ["original", "compressed"],
					sourceType: ["album", "camera"],
					success: (res)=>{
						this.showImg = false;
						uni.showLoading({title: "上传中",mask: true})
						uni.uploadFile({
							url: `${config.baseUrl}/api/single`,
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (uRes) => {
								let data = JSON.parse(uRes.data);
								let imgUrl = data.data.path_url;
								if(imgUrl){
									uni.hideLoading();
									this.info.business_card = imgUrl;
									uni.showToast({
										title: '上传成功！',
										icon: 'none'
									})
								} else {
									uni.hideLoading();
									uni.showToast({
										title: '上传失败,请重新上传',
										icon: 'none'
									})
								}
							},
							fail: ()=>{
								uni.hideLoading();
								uni.showToast({
									title: '上传失败,请重新上传',
									icon: 'none'
								})
							}
						})
					}
				})
			},
		},
	};
</script>

<style lang="less" scoped>
	.detail_main {
		padding: 0 0 130px;
	}

	.tit {
		justify-content: space-between;
		padding: 10px 26px;
		padding-right: 15px;

		.txt {
			font-size: 13px;
			font-weight: 400;
			line-height: 1;
			color: #999999;
		}

		.auto_txt {
			justify-content: center;
			width: 85px;
			height: 28px;
			background: linear-gradient(90deg, #4d6fff 0%, #6584ff 100%);
			border-radius: 14px;

			font-size: 12px;
			color: #ffffff;

			.iconfont {
				margin-right: 5px;
				font-size: 12px;
			}
		}
	}

	.other_msg {
		padding: 10px 26px;
	}

	.form_main {
		/deep/.item__body__right__content__icon {
			margin-left: 10px;
		}
	}

	.btm_btns {
		justify-content: space-around;

		/deep/.u-button {
			width: 100%;
			height: 45px;
			background: #e8e8e8;
			border-radius: 23px;
			color: #fff;
		}
	}

	/deep/.u-form-item__body__right__message {
		text-align: right;
	}

	/deep/.u-textarea {
		padding: 10px 0 !important;
	}

	.right_icon {
		align-content: center;
	}
	
	.upload_box{
		width: 750rpx;
		border-radius: 24rpx 24rpx 0px 0px;
		.upload{
			color: #333;
			width: 100%;
			height: 116rpx;
			line-height: 116rpx;
			text-align: center;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 400;
			border-bottom: 20rpx solid #F6F6F6;
		}
		.celUpload{
			color: #999;
			text-align: center;
			padding: 34rpx 0px;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 400;
		}
	}
	
	.business_card{
		width: 64rpx;
		height: 64rpx;
		border-radius: 8rpx;
		position: relative;
		right: -350rpx;
	}
</style>
