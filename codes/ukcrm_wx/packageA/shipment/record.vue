<template>
	<view class="detail">
		<view class="enter">
			<view class="e_title">手动录入</view>
			<view class="e_form">
				<view class="f_text">产品编码段</view>
				<view class="f_ipt">
					<input class="ipt ipt_l" v-model="form.first_code" type="text" placeholder="例 A403-2208">
					<input class="ipt ipt_r" v-model="form.first_num" type="text" placeholder="00001">
				</view>
				<view class="f_text">至</view>
				<view class="f_ipt">
					<input class="ipt ipt_l" v-model="form.second_code" type="text" placeholder="例 A403-2208">
					<input class="ipt ipt_r" v-model="form.second_num" type="text" placeholder="00100">
				</view>
			</view>
		</view>
		<view class="tipsBox">
			<view class="tips">
				<view>注意事项：</view>
				<view>请确保前缀相同，手动录入的编码段将自动识别为连续性的产品 编码，若产品有缺失可在列表删除或单个扫码添加</view>
			</view>
			<view class="scan" @click="scan">
				<u-icon name="scan" size="28" color="#fff"></u-icon>
				<text style="margin-left: 10rpx;">切换扫码录入</text>
			</view>
		</view>
		<view class="empty"></view>
		<view class="btn_box">
			<view class="btn" @click="back">
				<u-button type="info" size="large" shape="circle" text="取消"></u-button>
			</view>
			<view class="btn" @click="next">
				<u-button type="primary" size="large" shape="circle" text="下一步"></u-button>
			</view>
		</view>
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
	import { navBack } from '@/common/hooks';
	export default {
		data() {
			return {
				form: {
					first_code: '',
					second_code: '',
					first_num: '',
					second_num: '',
				}
			}
		},
		onLoad() {},
		onShow() {},
		methods: {
			back(){
				this.$Router.back()
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
										if(res.data.product_code){
											uni.hideLoading()
											_th.$Router.replace({
												path: '/productcode',
												query: { data: JSON.stringify([res.data.product_code]) }
											})
										} else {
											uni.hideLoading()
										}
									}).catch((err)=>{
										_th.$u.toast(err)
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
			next(){
				if(!this.form.first_code){
					this.$u.toast('请填写起始编码前缀!');
					return
				}
				if(!this.form.second_code){
					this.$u.toast('请填写结束编码前缀!');
					return
				}
				if(!this.form.first_num){
					this.$u.toast('请填写起始编码!');
					return
				}
				if(!this.form.second_num){
					this.$u.toast('请填写结束编码!');
					return
				}
				getData('/shipment/generate_product_code',{params:{...this.form}}).then(res => {
					if(res.code == 200 && res.data.code_arr){
						this.$Router.replace({
							path: '/productcode',
							query: {data: JSON.stringify(res.data.code_arr)}
						})
					} else {
						this.$u.toast(res.data.msg)
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.enter{
		width: 750rpx;
		height: 420rpx;
		padding: 0 30rpx;
		background-color: #fff;
		.e_title{
			height: 86rpx;
			line-height: 86rpx;
			background: #F7F8FA;
		}
		.e_form{
			height: 336rpx;
			padding: 0 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			.f_text{
				color: #333;
				font-size: 28rpx;
				font-weight: 400;
			}
			.f_ipt{
				display: flex;
				justify-content: space-between;
				.ipt{
					height: 80rpx;
					line-height: 80rpx;
					padding: 0 30rpx;
					box-sizing: border-box;
					border: 1px solid #D9D9D9;
					font-size: 28rpx;
					font-weight: 400;
					color: #666;
				}
				.ipt_l{
					width: 364rpx;
				}
				.ipt_r{
					width: 248rpx;
				}
			}
		}
	}
	.tipsBox{
		.tips{
			color: #FF9D00;
			font-size: 24rpx;
			font-weight: 400;
			padding: 24rpx 30rpx;
		}
		.scan{
			color: #FFF;
			width: 302rpx;
			height: 74rpx;
			margin: 0 auto;
			font-size: 28rpx;
			font-weight: 400;
			display: flex;
			background: #828384;
			border-radius: 38rpx;
			align-items: center;
			justify-content: center;
			margin-top: 140rpx;
			
		}
	}
	.empty {
		height: calc(184rpx + env(safe-area-inset-bottom));
	}

	.btn_box {
		width: 750rpx;
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: row;
		padding: 34rpx 30rpx calc(34rpx + env(safe-area-inset-bottom))  30rpx;
		background-color: #fff;

		.btn {
			width: 336rpx;
			margin: 0 10rpx;
		}
	}
</style>
