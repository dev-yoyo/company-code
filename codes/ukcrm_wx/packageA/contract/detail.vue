<template>
	<view class="detail">
		<u-toast ref="uToast"></u-toast>
		<view class="bg" :style="{'background': `url(${bgImg}) no-repeat center center`}">
			<view class="item_main contract_top">
				<view class="tit d-between">
					{{ info.contract_no || "" }}
					<view class="time"> {{ info.sign_time || "" }} </view>
				</view>

				<view class="info_mian">
					<view class="item d-flex">
						<view class="label"> 合同名称： </view>
						<view class="content"> {{ info.contract_name || "" }}</view>
					</view>

					<view class="item d-flex">
						<view class="label"> 签订人： </view>
						<view class="content"> {{ info.sign_user || "" }}</view>
					</view>
				</view>

				<view class="contract_status d-between">
					<view class="status_box d-between" @click="to_client">
						<view class="label d-center">客户：<text class="text">{{ info.customer_name || "" }}</text></view>
						<view class="action d-center">查看</view>
					</view>
					<view class="status_line"></view>
					<view class="status_box d-between" @click="changeStatus">
						<view class="label d-center">状态：</view>
						<view class="r_status d-center">
							<view class="status" :class="{under_way: info.contract_status == '执行中',under_way: info.contract_status == '新签约',end: info.contract_status == '终止'}">
								{{ info.contract_status || "" }}
								<i class="t-icon iconfont t-icon-zyla" v-if="info.contract_status == '终止'" @click="tipShow = true"></i>
							</view>
							<i class="icon iconfont icon-you" v-if="canEnd"></i>
						</view>
					</view>
				</view>
			</view>

			<view class="item_main contract_price"
				:style="{'background': `url(${priceBgImg}) no-repeat center center`}">
				<view class="info_mian">
					<view class="item d-between">
						<view class="label"> 应收款 </view>
						<view class="content">
							<view class="black" v-if="info.money">{{ info.money }} <text class="unit">元</text></view>
							<view v-else></view>
						</view>
					</view>
					<view class="item d-between">
						<view class="label"> 已回款 </view>
						<view class="content">
							<view class="price" v-if="info.has_return_money">
								{{ info.has_return_money }}
								<text class="unit">元</text></view>
							<view v-else></view>
						</view>
					</view>
					<view class="item d-between">
						<view class="label"> 待回款 </view>
						<view class="content">
							<view class="price" v-if="info.return_money">
								{{ info.return_money }}
								<text class="unit">元</text></view>
							<view v-else></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="container_main">
			<u-sticky offset-top="0">
				<view class="tab_list_box d-center" v-if="role_id < 4">
					<view class="item" :class="activeTab == 0 ? 'active' : ''" @click="tabChange(0)">基本信息<view class="line"></view></view>
					<view class="item branch" :class="activeTab == 1 ? 'active' : ''" @click="tabChange(1)">产品信息<view class="line"></view></view>
					<view class="item branch" :class="activeTab == 2 ? 'active' : ''" @click="tabChange(2)">回款信息<view class="line"></view></view>
					<view class="item branch" :class="activeTab == 3 ? 'active' : ''" @click="tabChange(3)">出货信息<view class="line"></view></view>
				</view>
			</u-sticky>

			<view class="list_main">
				<view class="list_bgc"></view>

				<!-- 基本信息 -->
				<view v-if="activeTab === 0">
					<view class="item_main item_info">
						<view class="info_mian">
							<view class="item d-between">
								<view class="label"> 合同编号 </view>
								<view class="content"> {{ info.contract_no || "" }}</view>
							</view>
							<view class="item d-between">
								<view class="label"> 合同名称 </view>
								<view class="content"> {{ info.contract_name || "" }}</view>
							</view>
							<view class="item d-between">
								<view class="label"> 合同金额 </view>
								<view class="content">
									{{ info.money ? info.money + "元" : "" }}
								</view>
							</view>
							<view class="item d-between">
								<view class="label"> 签订人 </view>
								<view class="content"> {{ info.sign_user || "" }}</view>
							</view>
							<view class="item d-between">
								<view class="label"> 创建时间 </view>
								<view class="content"> {{ info.sign_time || "" }}</view>
							</view>
							<view class="item d-between">
								<view class="label"> 客户 </view>
								<view class="content"> {{ info.customer_name || "" }}</view>
							</view>
							<view class="item d-between">
								<view class="label"> 关联企业 </view>
								<view class="content">
									{{ info.customer_company_name || "" }}
								</view>
							</view>
							<view class="item d-between">
								<view class="label"> 质保期限 </view>
								<view class="content"> {{ info.warranty }}年</view>
							</view>
							<view class="item d-between">
								<view class="label"> 备注 </view>
								<view class="content"> {{ info.remarks || "暂无" }}</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 产品信息 -->
				<view v-else-if="activeTab === 1">
					<view class="item_main item_info">
						<view class="info_mian product_main" v-for="(v, i) in info.contract_product" :key="i">
							<view class="item d-between">
								<view class="label"> 产品信息 </view>
								<view class="content">
									<view>{{ v.product_name || "" }}</view>
								</view>
							</view>
							<view class="item d-between">
								<view class="label"> 产品数量 </view>
								<view class="content">
									<view>{{ v.product_num || "" }}</view>
								</view>
							</view>
							<view class="item d-between">
								<view class="label"> 产品单价 </view>
								<view class="content">
									<view v-if="v.product_price">{{ v.product_price }} <text class="unit">元</text>
									</view>
									<view v-else></view>
								</view>
							</view>
						</view>
						<view class="slogan" v-if="info.contract_product.length == 0">
							<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
							<view class="txt"> 暂无数据 </view>
						</view>
					</view>
				</view>

				<!-- 回款信息 -->
				<view v-else-if="activeTab === 2">
					<view class="item_main item_plan">
						<view class="tit d-between" @click="createPlan">
							回款计划
							<view class="edit" v-if="is_belong && info.contract_status != '完毕' && info.contract_status != '终止'">
								<i class="icon iconfont icon-bj3"></i>编辑
							</view>
						</view>
						<view class="return_main product_main" v-for="(v, i) in info.payplan" :key="i">
							<view class="item">
								<view class="label"> 回款期数： </view>
								<view class="content">
									<view>{{ v.period || "" }}</view>
								</view>
							</view>
							<view class="item">
								<view class="label"> 回款日期： </view>
								<view class="content">
									<view>{{ v.return_time || "" }}</view>
								</view>
							</view>
							<view class="item">
								<view class="label"> 回款金额： </view>
								<view class="content money">
									<view>￥{{ v.return_money || 0 }} </view>
								</view>
							</view>
						</view>
						<view class="slogan" v-if="info.payplan.length == 0">
							<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
							<view class="txt"> 暂无数据 </view>
						</view>
					</view>
					<view class="item_main">
						<view class="tit d-between" @click="createReturn">
							回款记录
							<view class="edit"
								v-if="is_belong && info.contract_status != '完毕' && info.contract_status != '终止'">
								<i class="icon iconfont icon-xjht1"></i>新建
							</view>
						</view>
						<view class="return_main product_main" v-for="(v, i) in info.payment" :key="i">
							<view class="item">
								<view class="content">
									<view>{{ v.return_num || "" }}</view>
								</view>
							</view>
							<view class="item">
								<view class="label"> 回款日期： </view>
								<view class="content">
									<view>{{ v.return_time || "" }}</view>
								</view>
							</view>
							<view class="item">
								<view class="label"> 回款金额： </view>
								<view class="content money">
									<view>￥{{ v.return_money || 0 }} </view>
								</view>
							</view>
						</view>
						<view class="slogan" v-if="info.payment.length == 0">
							<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
							<view class="txt"> 暂无数据 </view>
						</view>
					</view>
				</view>
				
				<!-- 出货信息 -->
				<view v-else-if="activeTab === 3">
					<view class="item_main">
						<view class="item_title">
							<view class="i_t_item">
								<u-icon name="car-fill" size="22" color="#333"></u-icon>
								<text>出货记录</text>
							</view>
							<view v-if="is_belong && canEnd" class="i_t_item roundBtn" @click="createShip">
								<u-icon name="plus" size="13" color="#fff"></u-icon>
								<text style="color: #fff; font-size: 24rpx; margin-left: 10rpx;">新建出货</text>
							</view>
						</view>
						<view class="item_list">
							<view class="i_l_item" v-for="(v,k) in info.shipment" :key="k" @click="shipInfo(v.id)">
								<view class="i_l_i_title">
									<text style="color: #333;font-size: 30rpx;font-weight:600;">{{v.shipment_code}}</text>
									<text style="color: #999;font-size: 26rpx;font-weight:400;">{{v.shipment_time}}</text>
								</view>
								<view style="color: #666;font-size: 28rpx;font-weight:400;">出货数量<text style="color: #4D6FFF; margin-left: 15rpx;">{{v.total_num}}</text></view>
							</view>
						</view>
						<view class="slogan" v-if="info.shipment.length == 0">
							<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
							<view class="txt"> 暂无数据 </view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="new_fixed_btm" v-if="is_belong && canEdit">
			<view class="item" @click="edit" v-if="canEdit">
				<view class="icon_box">
					<i class="icon iconfont icon-bj"></i>
				</view>
				编辑
			</view>

			<!-- <view class="item" @click="createReturn" v-if="canReturn">
				<view class="icon_box">
					<i class="icon iconfont icon-bj"></i>
				</view>
				新建回款
			</view> -->
		</view>

		<u-popup mode="bottom" :show="statusShow" @close="statusShow = false" round="12" :safe-area-inset-bottom="true">
			<view class="btm_ppopup del_popup">
				<view class="del_txt" @click="confirmEnd"> 终止 </view>

				<u-gap height="10" bgColor="#f7f7f7"></u-gap>
				<view class="cancel_txt" @click="statusShow = false">取消</view>
			</view>
		</u-popup>

		<!-- 报价时效 -->
		<view class="tip_modal">
			<u-modal :show="tipShow" :showConfirmButton="false">
				<view class="modal_box slot-content">
					<view class="title">终止原因</view>
					<view class="content">{{ info.ended_reason }}</view>
					<view class="btn" @click="tipShow = false"> 确 定 </view>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import store from "@/store";
	import {
		getData,
		postData
	} from "@/common/api";

	export default {
		data() {
			return {
				noData: store.state.no_data,
				role_id: "",
				contract_id: "",
				is_belong: false,
				canEdit: false, // 新建回款  完毕 终止 不能新增
				canEnd: false, // 能否终止
				canReturn: false, // 新建回款  完毕 终止 不能新增

				isAdmin: true,
				info: {},
				statusShow: false,
				activeTab: 0,
				tipShow: false, // 终止原因
				bgImg: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/27/%E5%9B%BE%E7%89%87%281%29/dlsbj12.png",
				priceBgImg: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/27/%E5%9B%BE%E7%89%87%281%29/ditu1245.png",
			};
		},
		onShow() {
			let query = this.$Route.query;
			if (query.contract_id) {
				this.contract_id = query.contract_id;
				this.init();
			}
			this.delStorage();
		},
		onLoad() {
			let _th = this;
			// 数据监听
			uni.$on("updateData", function(data) {
				console.log("updateData >>>", data);
				switch (data.type) {
					case "end":
						_th.statusShow = false;
						_th.init();
						break;

					default:
						break;
				}
			});
		},
		methods: {
			init() {
				getData("/contract/contract_detail", {
					params: {
						id: this.contract_id,
					},
				}).then((res) => {
					const {
						code,
						data: {
							list,
							exists
						},
					} = res;
					if (code === 200) {
						this.info = list;
						this.is_belong = exists;

						this.canEdit = list.contract_status == "新签约" ? true : false;
						this.canEnd = exists && (list.contract_status == "新签约" || list.contract_status == "执行中") ? true : false;
						let num = 0;
						this.info.contract_product.map(i=>{
							if(i.surplus_num == null){
								i.surplus_num = i.product_num
							}
							num += i.surplus_num*1
						})
						if(num && this.is_belong){
							this.is_belong = true;
						} else {
							this.is_belong = false
						}
					}
				});
			},

			// 编辑
			edit() {
				this.$Router.push({
					path: "/contract_edit/",
					query: {
						info_id: this.info.id,
						edit: true,
					},
				});
			},
			// 新建回款计划
			createPlan() {
				this.$Router.push({
					path: "/return_money_plan",
					query: {
						contract_id: this.contract_id,
						from: "contract",
					},
				});
			},

			// 新建回款记录
			createReturn() {
				this.$Router.push({
					path: "/return_money_create",
					query: {
						contract_id: this.contract_id,
						from: "contract",
					},
				});
			},

			to_client() {
				let id = this.info.customer_id;
				if (this.info.customer && this.customer_type == 1) {
					this.$Router.push({
						path: "/com_client/" + id,
						query: {
							id,
						},
					});
				} else {
					this.$Router.push({
						path: "/client/" + id,
						query: {
							id,
						},
					});
				}
				s;
			},

			changeStatus() {
				if (!this.is_belong) return;
				if (
					this.info.contract_status == "执行中" ||
					this.info.contract_status == "新签约"
				) {
					this.statusShow = true;
				}
			},
			confirmEnd() {
				this.$Router.push({
					path: "/contract_end",
					query: {
						contract_id: this.info.id,
					},
				});
				// let _th = this;
				// postData(`/contract/termination_contract`, {
				//   id: this.info.id,
				// }).then((res) => {
				//   const {
				//     code,
				//     data: { msg },
				//   } = res;
				//   if (code === 200) {
				//     this.$refs.uToast.show({
				//       message: msg,
				//       complete() {
				//         _th.statusShow = false;
				//       },
				//     });
				//   } else if (code === 422) {
				//     this.$u.toast(msg);
				//   }
				// });
			},

			nav(name) {
				this.$Router.push({
					name,
				});
			},

			tabChange(i) {
				this.activeTab = i;
				this.init();
			},
			onPullDownRefresh() {
				this.page = 1;
				this.init();
			},
			delStorage(){
				uni.removeStorageSync('sign_user');
				uni.removeStorageSync('contract_id');
				uni.removeStorageSync('product_code');
				uni.removeStorageSync('ship_product_id');
				uni.removeStorageSync('contract_product');
			},
			shipInfo(id){
				this.$Router.push({
				    path: `/shipmentinfo`,
					query: {
						id: id,
					}
				});
			},
			createShip(){
				uni.setStorageSync('contract_id', this.info.id);
				uni.setStorageSync('sign_user', this.info.sign_user);
				uni.setStorageSync('contract_product', JSON.stringify(this.info.contract_product));
				this.$Router.push({path: '/shipment'});
			}
		},
	};
</script>

<style lang="less" scoped>
	.detail {
		padding: 0 0 130px;
	}

	.bg {
		padding: 19px 15px 22px;
		// background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/27/%E5%9B%BE%E7%89%87%281%29/dlsbj12.png)
		//   no-repeat center center;
		background-size: 100% 100%;
	}

	.item_main {
		margin-top: 10px;
		padding: 20px;
		width: 100%;
		background-color: #fff;
		overflow: hidden;

		.tit {
			margin-bottom: 17px;
			font-size: 13px;
			line-height: 18px;
			color: #333333;
			font-weight: bold;

			.edit {
				display: flex;
				align-items: center;
				font-weight: 400;
				color: #4d6fff;

				.iconfont {
					margin-right: 3px;
				}
			}
		}

		.info_mian {
			padding: 0 10px;

			.item {
				margin-bottom: 17px;

				.label {
					font-size: 13px;
					line-height: 1;
					color: #999999;
				}

				.content {
					font-size: 14px;
					line-height: 1;
					color: #333333;
				}
			}

			:last-child {
				margin-bottom: 0;
			}

			.remarks {
				white-space: pre-wrap;
				font-size: 14px;
				line-height: 20px;
				color: #333333;
			}
		}

		.product_main {
			padding-bottom: 20px !important;
			margin-bottom: 20px;
			border-bottom: 1px solid #f0f0f0;
		}

		.product_main:last-child {
			padding-bottom: 0 !important;
			margin-bottom: 0 !important;
			border-bottom: none;
		}

		.return_main {
			padding: 0 10px;
			display: flex;
			flex-wrap: wrap;

			.item {
				display: flex;
				align-items: center;
				margin-bottom: 17px;
				width: 49%;

				.label {
					font-size: 13px;
					line-height: 1;
					color: #999999;
				}

				.content {
					font-size: 14px;
					line-height: 1;
					color: #333333;
				}

				.money {
					color: #ff9d00;
				}
			}

			:last-child {
				margin-bottom: 0;
			}

			.remarks {
				white-space: pre-wrap;
				font-size: 14px;
				line-height: 20px;
				color: #333333;
			}
		}
	}

	.item_plan {
		margin: 0 0 10px;
	}

	.item_info {
		margin-top: 0;
	}

	.contract_price {
		// background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/27/%E5%9B%BE%E7%89%87%281%29/ditu1245.png)
		//   no-repeat center center;
		background-size: 100% 100%;

		.info_mian {
			padding: 0;
		}

		.content {
			font-size: 14px;
			line-height: 20px;
		}

		.price {
			color: #ff9d00;
			font-weight: bold;
		}

		.black {
			color: #333;
			font-weight: bold;
		}

		.unit {
			font-weight: 400;
			color: #333;
			margin-left: 5px;
		}
	}

	.contract_top {
		box-shadow: 0px -1px 4px rgba(0, 0, 0, 0.18);
		border-radius: 10px;
		padding: 20px 20px 0;

		.time {
			font-size: 13px;
			font-weight: 400;
			line-height: 18px;
			color: #999999;
		}

		.info_mian {
			padding: 0;
		}
	}

	.contract_status {
		margin-top: 18px;
		height: 58px;
		background-color: #fff;
		border-top: 1px solid #f2f2f2;

		.status_box {
			width: 49%;
		}

		.status_line {
			height: 22px;
			border-right: 1px solid #f2f2f2;
			margin: 0 22px 0 14px;
		}

		.label {
			font-size: 13px;
			line-height: 1;
			color: #999;

			.text {
				color: #333;
			}

			.iconfont {
				margin-right: 3px;
			}
		}

		.action {
			font-size: 13px;
			font-weight: 400;
			line-height: 18px;
			color: #4d6fff;
		}

		.r_status {
			.iconfont {
				margin-left: 6px;
				font-size: 12px;
				color: #c3c3c3;
			}
		}

		.status {
			padding: 0 8px;
			height: 25px;
			line-height: 25px;
			background: #ebebeb;
			border-radius: 2px;
			text-align: center;
			font-size: 12px;
			font-weight: 600;
			color: #666666;
		}

		// 执行中
		.under_way {
			color: #4d6fff;
			background-color: #f0f5ff;
		}

		// 终止
		.end {
			display: flex;
			align-items: center;
			padding: 0;
			height: 25px;
			line-height: 25px;
			background: transparent;
			border-radius: 2px;
			text-align: center;
			font-size: 12px;
			font-weight: 600;
			color: #333;
		}
	}

	.del_popup {
		padding-top: 20px;

		.del_txt {
			padding-bottom: 14px;
			font-size: 16px;
			color: #333333;
			text-align: center;
		}

		.cancel_txt {
			padding: 17px 20px;
			text-align: center;
			font-size: 16px;
			color: #999999;
		}
	}

	.tab_list_box {
		padding: 17px 0 5px;
		background: #f7f8fa;

		.item {
			font-size: 13px;
			font-weight: 400;
			line-height: 18px;
			color: #333333;
		}

		.line {
			visibility: hidden;
			margin: 9px auto 0;
			width: 40px;
			height: 4px;
			background: #4d6fff;
			border-radius: 5px;
		}

		.branch {
			margin-left: 45px;
		}

		.active {
			font-size: 14px;
			color: #4d6fff;

			.line {
				visibility: visible;
			}
		}
	}

	.slogan {
		width: 100%;
		background: #fff;
		border-radius: 10px;
		padding: 30px 0;
	}

	.tip_modal {
		/deep/.u-popup__content {
			border-radius: 18px !important;
		}

		/deep/.u-modal__content {
			padding: 0 !important;
		}

		.modal_box {
			padding: 34px 0 0;
			width: 100%;
			text-align: center;

			.title {
				font-size: 15px;
				font-weight: 600;
				line-height: 21px;
				color: #333333;
				margin-bottom: 14px;
			}

			.content {
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
				color: #666666;
				padding: 0 30px 0;
			}

			.btn {
				width: 100%;
				height: 50px;
				line-height: 50px;
				font-size: 17px;
				text-align: center;
				color: #4d6fff;
				background: #fff;
				border-top: 1px solid #f2f2f2;
				margin-top: 28px;
				padding: 0 30px;
			}
		}
	}
	
	.item_title{
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.i_t_item{
			color: #333333;
			font-size: 28rpx;
			font-weight: 600;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.roundBtn{
			width: 170rpx;
			height: 56rpx;
			border-radius: 28rpx;
			background: linear-gradient(90deg, #4D6FFF 0%, #6584FF 100%);
		}
	}
	
	.item_list{
		padding-bottom: 30rpx;
		.i_l_item{
			height: 158rpx;
			margin: 20rpx 0;
			display: flex;
			padding: 0 30rpx;
			flex-direction: column;
			justify-content: space-evenly;
			border-radius: 8rpx;
			box-shadow: 0px 0px 8rpx rgba(0,0,0,0.1);
			background: linear-gradient(90deg, #F2F6FF 0%, #FFFFFF 100%);
			.i_l_i_title{
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>
