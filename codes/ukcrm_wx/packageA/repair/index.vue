<template>
	<view class="detail">
		<u-sticky offset-top="0">
			<view class="com_top_tit d-between">
				<u-search @search="search" v-model="search_word" shape="square" placeholder="搜索产品名称，产品编码" :showAction="false"></u-search>
				<view class="scanning" @click="scan">
					<u-icon name="scan" size="28" color="#fff"></u-icon>
				</view>
			</view>
		</u-sticky>
		<view class="sell_main">
			<view class="repair_box">
				<view v-for="(v,k) in list" :key="k" @click="detail(v.id,v.product_code)">
					<view class="repair_log">
						<view class="p_info">
							<view class="p_num">{{v.product_code || '-'}}</view>
							<view class="p_date">{{v.rework_time || '-'}}</view>
						</view>
						<view class="p_name">名称：{{v.product_name || '-'}}</view>
					</view>
				</view>
				<view class="slogan" v-if="!list.length">
					<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
					<view class="txt"> 暂无数据 </view>
				</view>
			</view>
		</view>
		<u-overlay :show="show" @click="show = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<text class="title">提示</text>
					<text class="content">未知编码，该产品未录入</text>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import store from '@/store';
	import config from '@/common/config';
	import {
		getData,
		postData,
		getUser
	} from '@/common/api';

	export default {
		data() {
			return {
				noData: store.state.no_data,
				search_word: '',
				show: false,
				list: []
			};
		},
		onLoad() {},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				getData('/rework').then(res => {
					if (res.code == 200 && res.data.list.data) {
						this.list = res.data.list.data
					}
				})
			},
			// 跳转详情页
			detail(id, code) {
				this.$Router.push({
					path: '/repair_detail',
					query: {
						rework_id: id,
						product_code: code
					},
				});
			},
			// 搜索
			search(){
				let search_word = this.search_word;
				getData('/rework',{params:{search_word}}).then(res => {
					if (res.code == 200 && res.data.list.data) {
						this.list = res.data.list.data
					}
				})
			},
			// 扫描
			scan() {
				let _th = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["original", "compressed"],
					sourceType: ["album", "camera"],
					success: function(res) {
						uni.showLoading({
							title: "识别中",
							mask: true,
						});
						uni.uploadFile({
							url: `${config.baseUrl}/api/single`,
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								if(data.data.path_url){
									let image_path = data.data.path_url;
									postData('/shipment/sacn_code_for_db',{image_path}).then(res=>{
										let product_code = res.data.product_code.trim();
										if(res.data.product_code){
											getData('/rework/rework_detail',{params:{rework_id: '',product_code}}).then(r => {
												if(r.code == 200){
													uni.hideLoading()
													_th.$Router.push({
														path: '/repair_detail',
														query: {
															rework_id: '',
															product_code: res.data.product_code
														},
													})
												} else {
													uni.hideLoading()
													_th.show = true
												}
											})
										} else {
											uni.hideLoading()
										}
									})
								} else {
									uni.hideLoading()
								}
							},
							fail() {
								uni.hideLoading()
							}
						});
					},
					fail() {
						uni.hideLoading()
					}
				});
			},
		}
	};
</script>

<style lang="less" scoped>
	.tabs_tit {
		font-size: 14px;
		color: #333;
	}

	.com_top_tit {
		height: 46px;
		padding: 0 20px;
		background-color: #fff;
		.scanning {
			width: 72rpx;
			height: 72rpx;
			margin-left: 14rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			background: #4D6FFF;
			justify-content: center;
		}
	}

	.sell_main {
		width: 100%;
		background-color: #F7F8FA;

		.repair_box {
			padding: 10rpx 30rpx;
		}

		.repair_log {
			width: 690rpx;
			height: 176rpx;
			margin: 20rpx 0;
			padding: 20rpx 40rpx;
			background: linear-gradient(90deg, #F2F6FF 0%, #FFFFFF 100%);
			box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.06);
			border-radius: 12px;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.p_info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.p_num {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
				}

				.p_date {
					font-size: 24rpx;
					font-weight: 400;
					color: #999;
				}
			}

			.p_name {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 24rpx;
				font-weight: 400;
				color: #666;
			}
		}
	}

	.warp {
		width: 100vw;
		height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rect {
		color: #333;
		width: 642rpx;
		height: 228rpx;
		background: #fff;
		border-radius: 36rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;

		.title {
			font-size: 30rpx;
			font-weight: 600;
		}

		.content {
			margin-top: 30rpx;
			font-size: 28rpx;
			font-weight: 400;
		}
	}
</style>
