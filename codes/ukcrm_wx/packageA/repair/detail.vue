<template>
	<view class="detail">
		<view class="card"
			:style="{'background':product.detail.shipment.warranty_status=='已过保'?'linear-gradient(180deg, #FFFFFF 0%, #DDDDDD 100%)':'linear-gradient(180deg, #FFFFFF 0%, #CEE0FF 100%)'}">
			<view class="card_box">
				<image class="card_bg" :src="product.detail.shipment.warranty_status=='已过保'?bg2:bg1" mode=""></image>
				<view class="card_info">
					<text class="card_num">{{product.detail.product_code || product.product_code}}</text>
					<text class="card_status" v-if="product.detail.shipment.warranty_status"></text>
				</view>
				<view class="card_name">产品名称： {{product.detail.product_name}}</view>
			</view>
			<view class="curve">
				<image class="curve_img" :src="curve" mode=""></image>
			</view>
		</view>
		<view class="info_box">
			<view class="goods_title">出货信息</view>
			<view class="goods_info">
				<view class="g_info">
					<text class="g_k">合同编号</text>
					<text class="g_v">{{product.detail.contract.contract_no}}</text>
				</view>
				<view class="g_info">
					<text class="g_k">关联企业</text>
					<text class="g_v">{{product.detail.contract.customer_company_name}}</text>
				</view>
				<view class="g_info">
					<text class="g_k">出货编号</text>
					<text class="g_v">{{product.detail.shipment.shipment_code || product.detail.shipment_code}}</text>
				</view>
				<view class="g_info">
					<text class="g_k">出货时间</text>
					<text class="g_v">{{product.detail.shipment.shipment_time || product.detail.shipment_time}}</text>
				</view>
				<view class="g_info">
					<text class="g_k">质保期</text>
					<text class="g_v">{{product.detail.contract.warranty}}年</text>
				</view>
				<view class="g_info">
					<text class="g_k">经办人</text>
					<text class="g_v">{{product.detail.user.name || product.detail.user_name}}</text>
				</view>
			</view>
		</view>
		<view class="repair_log" v-if="product.detail.rework_record.length">
			<view class="log_title">
				<text>返修记录</text>
				<text class="log_num">{{product.detail.rework_record.length}}</text>
			</view>
			<view class="log_list">
				<u-steps :current="product.detail.rework_record.length" dot direction="column">
					<u-steps-item v-for="(v,k) in product.detail.rework_record" :key="v.id">
						<view class="slot-icon" slot="desc">
							<view class="l_item" @click="record(v.id)">
								<view class="l_i">
									<text class="i_k">返修日期：</text>
									<text class="i_v">{{v.rework_time}}</text>
								</view>
								<view class="l_i">
									<text class="i_k">故障问题：</text>
									<text class="i_v">{{v.fault}}</text>
								</view>
								<view class="l_i i_line"></view>
								<view class="l_i">
									<text class="i_k">返修结果：</text>
									<text style="color: #999;font-size: 26rpx;font-weight: 400;" v-show="!v.rework_result">未填写</text>
									<text class="i_v i_res" v-show="v.rework_result"
										:style="{'background-color':v.rework_result=='已维修'?'#DCF5DD':'#FFE4D9','color':v.rework_result=='已维修'?'#00B715':'#FF141A'}">{{v.rework_result}}</text>
								</view>
							</view>
						</view>
					</u-steps-item>
				</u-steps>
			</view>
		</view>
		<view class="empty" v-if="product.product_code_belong_status"></view>
		<view class="btn_box" v-if="product.product_code_belong_status">
			<u-button @click="next" type="primary" size="large" shape="circle" text="保修"></u-button>
		</view>
	</view>
</template>

<script>
	import store from '@/store';
	import {
		getData,
		timeSearch,
		getUser
	} from '@/common/api';
	export default {
		data() {
			return {
				rework_id: '',
				product_code: '',
				product: {},
				bg1: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202210/21/13hCs1owl5R2rCRA3chw52fgfQC7Ek55ylQMrbRJ.png',
				bg2: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202210/21/lxExPK0LPWa1H6p9XoLqLpVTp1phXLBkHSMZOHsa.png',
				curve: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202210/21/rDVGP2miX18urpROtUXgkpVcnPKMO3FGyGh6Dhhv.png'
			}
		},
		onLoad() {
			this.rework_id = this.$Route.query.rework_id;
			this.product_code = this.$Route.query.product_code;
		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				getData('/rework/rework_detail', {
					params: {
						rework_id: this.rework_id,
						product_code: this.product_code
					}
				}).then(res => {
					if (res.code == 200 && res.data.detail) {
						this.product = JSON.parse(JSON.stringify(res.data));
						this.product.detail.rework_record = [];
						setTimeout(() => {
							this.product.detail.rework_record = res.data.detail.rework_record;
						}, 10);
					}
				})
			},
			next() {
				this.$Router.push({
					path: `/repair_product`,
					query: {
						data: JSON.stringify(this.product)
					}
				})
			},
			record(k) {
				this.$Router.push({
					path: `/repair_record`,
					query: {
						id: k
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.card {
		width: 750rpx;
		height: 202rpx;
		position: relative;
		overflow: hidden;

		.card_box {
			margin: 0 auto;
			width: 690rpx;
			height: 176rpx;
			margin-top: 30rpx;
			padding: 20rpx 40rpx;
			box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.06);
			border-radius: 12px;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.card_info {
				position: relative;
				z-index: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.card_num {
					font-size: 32rpx;
					font-weight: 600;
					color: #fff;
				}

				.card_status {
					font-size: 24rpx;
					font-weight: 400;
					color: #eee;
				}
			}

			.card_name {
				position: relative;
				z-index: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 24rpx;
				font-weight: 400;
				color: #eee;
			}

			.card_bg {
				z-index: 0;
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		.curve {
			z-index: 10;
			width: 750rpx;
			height: 30rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			overflow: hidden;

			.curve_img {
				width: 100%;
				height: 100%;
			}
		}
	}

	.info_box {
		width: 750rpx;
		height: 586rpx;
		padding: 0 30rpx;
		background: #fff;
		border-top: 1px solid #fff;

		.goods_title {
			width: 100%;
			font-size: 28rpx;
			font-weight: 600;
			margin-top: 26rpx;
			color: #333;
		}

		.goods_info {
			height: 520rpx;
			padding: 0 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.g_info {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.g_k {
					font-size: 28rpx;
					font-weight: 400;
					color: #666;
				}

				.g_v {
					font-size: 28rpx;
					font-weight: 500;
					color: #333;
				}
			}
		}
	}

	.repair_log {
		width: 750rpx;
		margin-top: 18rpx;
		padding: 26rpx 30rpx;
		background: #fff;

		.log_title {
			width: 100%;
			font-size: 28rpx;
			font-weight: 600;
			padding-bottom: 36rpx;
			color: #333;

			.log_num {
				color: #FF9D00;
				padding: 0 10rpx;
			}
		}

		.log_list {
			.l_item {
				width: 646rpx;
				height: 266rpx;
				display: flex;
				padding: 0 28rpx;
				flex-direction: column;
				justify-content: space-evenly;
				border-radius: 16rpx;
				background: rgba(255, 255, 255, 0.39);
				box-shadow: 0rpx 0rpx 12rpx rgba(0, 0, 0, 0.16);

				.l_i {
					display: flex;
					margin: 6rpx 0;

					.i_k {
						width: 130rpx;
						height: 36rpx;
						font-size: 26rpx;
						font-weight: 400;
						color: #666666;
					}

					.i_v {
						width: 442rpx;
						color: #333333;
						font-size: 26rpx;
						font-weight: 400;
					}

					.i_res {
						width: 118rpx;
						height: 46rpx;
						text-align: center;
						line-height: 46rpx;
						border-radius: 8rpx;
					}
				}

				.i_line {
					width: 458rpx;
					height: 0rpx;
					position: relative;
					left: 130rpx;
					border: 1rpx solid #F2F2F2;
				}
			}
		}
	}

	.empty {
		height: calc(184rpx + env(safe-area-inset-bottom));
	}

	.btn_box {
		width: 750rpx;
		position: fixed;
		bottom: 0;
		padding: 34rpx 30rpx calc(34rpx + env(safe-area-inset-bottom)) 30rpx;
		background-color: #fff;
	}

	.u-steps-item__line {
		height: 151rpx !important;
	}
</style>
