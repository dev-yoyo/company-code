<template>
	<view class="detail">
		<view v-if="clientInfo.business_card" class="business_card" @click="viewCard">
			<image class="img" :src="clientInfo.business_card" mode="aspectFill"></image>
		</view>
		<view class="top_info" :style="{'margin-top':clientInfo.business_card?'0':'8px'}">
			<view class="tit">基本信息</view>

			<view class="item">
				<view class="label">客户性质 </view>
				<view class="r_txt">{{ clientInfo.customer_type_name || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">客户状态 </view>
				<view class="r_txt">{{ clientInfo.customer_status_name || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">客户姓名 </view>
				<view class="r_txt">{{ clientInfo.name || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">联系电话 </view>
				<view class="r_txt">{{ clientInfo.phone || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">微信号 </view>
				<view class="r_txt">{{ clientInfo.wechat || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">岗位职务</view>
				<view class="r_txt">{{ clientInfo.position || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">企业角色</view>
				<view class="r_txt">{{ clientInfo.company_role || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">企业名称 </view>
				<view class="r_txt">{{ clientInfo.company || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">企业地址 </view>
				<view class="r_txt">{{ clientInfo.address || "暂无" }}</view>
			</view>
		</view>

		<view class="top_info">
			<view class="tit">扩展信息</view>

			<view class="item">
				<view class="label">客户标签 </view>
				<view class="r_txt">{{ clientInfo.tag_name || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">客户来源 </view>
				<view class="r_txt">{{ clientInfo.from_name || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">所属行业 </view>
				<view class="r_txt">{{ clientInfo.industry || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">所属地区 </view>
				<view class="r_txt">{{ clientInfo.areaValue || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">客户级别</view>
				<view class="r_txt">{{ clientInfo.level || "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">创建人</view>
				<view class="r_txt">
					{{ clientInfo && clientInfo.user && clientInfo.user.name ? clientInfo.user.name : "暂无" }}</view>
			</view>

			<view class="item">
				<view class="label">客户备注 </view>
				<view class="r_txt remarks">{{ clientInfo.remarks || "暂无" }}</view>
			</view>
		</view>

		<view class="new_fixed_btm" v-if="customer_belong">
			<view class="item" @click="edit">
				<view class="icon_box">
					<!-- <i class="icon iconfont icon-bj"></i> -->
					<image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/bj%402x.png"
						mode="aspectFit"></image>
				</view>
				编辑
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getData,
		postData,
		isSelfClient
	} from "@/common/api";

	export default {
		data() {
			return {
				infoId: "",
				customer_belong: false,
				isAdmin: true,
				clientInfo: {},
			};
		},
		mounted() {},
		onShow() {
			let query = this.$Route.query;
			if (query.id) {
				this.infoId = this.$Route.query.id;
				isSelfClient(this.infoId).then((res) => {
					const {
						code,
						data
					} = res;
					if (code === 200) {
						this.customer_belong = data.customer_belong;
					}
				});

				this.init();
			}
		},
		methods: {
			viewCard(){
				uni.previewImage({
					urls: [this.clientInfo.business_card],
					indicator: 'none',
					fail: ()=>{
						uni.showToast({
							title: '图片加载失败',
							icon: 'none'
						})
					}
				})
			},
			init() {
				getData("/customer/customer_detail", {
					params: {
						customer_id: this.infoId,
					},
				}).then((res) => {
					const {
						code,
						data
					} = res;
					if (code === 200) {
						this.clientInfo = data.customer;
						let info = data.customer;
						if (info.area) {
							this.clientInfo.areaValue =
								`${info.area.name} ${info.area_area.name} ${info.area_city.name}`;
						}
						console.log(this.clientInfo)
					}
				});
			},

			// 编辑
			edit() {
				this.$Router.push({
					path: "/create_client/" + this.clientInfo.id,
					query: {
						id: this.clientInfo.id,
						edit: true,
					},
				});
			},

			nav(name) {
				this.$Router.push({
					name,
				});
			},
			onPullDownRefresh() {
				this.page = 1;
				this.init();
			},
		},
	};
</script>

<style lang="less" scoped>
	.detail {
		padding: 0 0 130px;
	}

	.top_info {
		margin-bottom: 8px;
		padding: 20px 20px 25px;
		width: 100%;
		background: #fff;

		.tit {
			margin-bottom: 17px;
			font-size: 13px;
			font-weight: 400;
			line-height: 18px;
			color: #333333;
		}

		.item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 17px;

			.label {
				margin-right: 68px;
				font-size: 13px;
				font-weight: 400;
				line-height: 18px;
				color: #999999;
				flex-shrink: 0;
			}

			.r_txt {
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
				color: #333333;
				text-align: right;
			}

			.remarks {
				white-space: pre-wrap;
				text-align: left;
			}
		}
	}
	
	.business_card{
		width: 750rpx;
		height: 400rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
</style>
