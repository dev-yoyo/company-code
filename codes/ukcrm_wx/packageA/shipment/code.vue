<template>
	<view class="detail">
		<view class="enter">
			<view @click="scan" class="option" style="background: #F0F5FF; color: #4D6FFF;">
				<u-icon name="scan" size="28" color="#4D6FFF"></u-icon>
				<text style="margin-left: 10rpx">扫码录入</text>
			</view>
			<view @click="handle" class="option" style="background: #FFF3E5; color: #FF9D00;">
				<u-icon name="thumb-up" size="28" color="#FF9D00"></u-icon>
				<text style="margin-left: 10rpx">手动录入</text>
			</view>
		</view>
		<view class="enterList">
			<view class="e_item" v-for="(v,k) in data" :key="k" :style="{'border-color':v.status?'#E2E2E2':'#F00619','background':v.status?'':'#FFEBEB'}">
				<text>{{v.name}}</text>
				<view class="del" @click="del(k)">
					<u-icon name="close"></u-icon>
				</view>
			</view>
		</view>
		<view class="empty"></view>
		<view class="btn_box">
			<view class="btn" @click="back">
				<u-button type="info" size="large" shape="circle" text="取消"></u-button>
			</view>
			<view class="btn" @click="next">
				<u-button type="primary" size="large" shape="circle" text="提交"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store';
	import {
		getData,
		postData,
		getUser
	} from '@/common/api';
	export default {
		data() {
			return {
				id: '',
				data: [],
				form: {
					contract_id: '',
					product_id: '',
					product_code: []
				}
			}
		},
		onLoad() {
			this.init();
		},
		onShow() {
			this.getProductId();
		},
		methods: {
			back(){
				this.$Router.back()
			},
			init(){
				let contract_id = uni.getStorageSync('contract_id');
				let product_id = uni.getStorageSync('ship_product_id');
				this.form.contract_id = contract_id;
				this.form.product_id = product_id;
				let product_code = this.getIdCode();
				let repeat_data = uni.getStorageSync('repeat_data');
				if(product_code){
					if(this.$Route.query.data){
						product_code = [...product_code, ...this.$Route.query.data];
					}
					let data = product_code;
					data = [...new Set(data)];
					this.form.product_code = data;
					// 添加默认状态
					for(let i = 0; i<data.length; i++){
						this.data.push({status:1});
						this.data[i].name = data[i];
					}
					// 找到重复标红
					let r_data = [];
					if(repeat_data){
						repeat_data.map(i=>{
							if(i.repeat.length){
								r_data = [...r_data, ...i.repeat]
							}
						})
					}
					if(r_data.length){
						for(let i = 0; i<this.data.length;i++){
							for(let j =0;j<r_data.length;j++){
								if(this.data[i].name == r_data[j]){
									this.data[i].status = 0;
								}
							}
						}
					}
				} else {
					if(this.$Route.query.data){
						this.form.product_code = this.$Route.query.data;
						let data = this.$Route.query.data;
						data = [...new Set(data)];
						for(let i = 0; i<data.length; i++){
							this.data.push({status:1});
							this.data[i].name = data[i];
						}
					}
					
				}
			},
			getProductId(){
				let id = uni.getStorageSync('ship_product_id');
				this.form.product_id = id;
				this.id = id;
			},
			setProductCode(id,data){
				let pid = uni.getStorageSync('contract_pid');
				let p_code = {
					contract_pid: pid,
					product_id: id,
					product_code: data
				};
				let all_data = this.getAllCode();
				if(all_data && all_data.length){
					for(let i =0;i<all_data.length;i++){
						if(all_data[i].product_id == p_code.product_id && all_data[i].contract_pid == pid){
							all_data[i].product_code = [ ...p_code.product_code]
						} else {
							all_data.push(p_code)
						}
					}
				} else {
					all_data = [];
					all_data.push(p_code);
				}
				all_data = JSON.stringify(all_data);
				uni.setStorageSync('product_code',all_data);
			},
			getAllCode(){
				let data = uni.getStorageSync('product_code');
				if(data){
					data = JSON.parse(data)
				} else {
					data = false;
				}
				return data;
			},
			getIdCode(){
				let id = uni.getStorageSync('ship_product_id');
				let pid = uni.getStorageSync('contract_pid');
				let all_data = this.getAllCode();
				let data = false;
				if(all_data){
					for(let i =0;i<all_data.length;i++){
						if(all_data[i].product_id == id && all_data[i].contract_pid == pid){
							data = all_data[i].product_code
						}
					}
				} else {
					data = false
				}
				return data
			},
			fetch(){
				let arr = [];
				this.data.map(i=>arr.push(i.name))
				this.form.product_code = arr;
				// if(this.form.product_code.length){
					let id = this.id;
					this.setProductCode(id,arr);
				// } else {
				// 	uni.removeStorageSync('product_code');
				// }
			},
			// 手动录入
			handle(){
				let id = this.id;
				this.setProductCode(id,this.form.product_code);
				this.$Router.replace({ path: '/manualrecord' });
			},
			// 删除
			del(k){
				uni.showModal({
					title: '提示',
					content: '确认删除这条产品编码吗',
					success: (res) => {
						if (res.confirm) {
							this.data.splice(k,1);
							this.fetch();
						}
					}
				});
			},
			// 扫码
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
							url:'http://crm.api.dev.ebaina.com/api/single',
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								if(data.data.path_url){
									let image_path = data.data.path_url;
									postData('/shipment/sacn_code_for_db',{image_path}).then(res=>{
										if(res.data.product_code){
											uni.hideLoading()
											let code = res.data.product_code;
											_th.form.product_code.push(code);
											_th.data.push({status:1});
											_th.data[_th.data.length-1].name = code;
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
			// 提交
			next(){
				let { contract_id, product_id, product_code } = this.form;
				getData('/shipment/check_product_code',{params: {contract_id,product_id,product_code}}).then(res => {
					if(res.code == 200){
						let id = uni.getStorageSync('ship_product_id');
						this.setProductCode(id,this.form.product_code);
						uni.removeStorageSync('repeat_data');
						this.$Router.back();
					} else{
						this.$u.toast(res.data.msg)
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.enter{
		width: 750rpx;
		height: 168rpx;
		display: flex;
		padding: 0 30rpx;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		.option{
			width: 336rpx;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: 600;;
		}
	}
	
	.enterList{
		width: 750rpx;
		margin-top: 20rpx;
		overflow: hidden;
		padding: 15rpx 30rpx;
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		.e_item{
			width: 326rpx;
			height: 98rpx;
			display: flex;
			margin: 15rpx 0;
			align-items: center;
			justify-content: center;
			border-radius: 8rpx;
			position: relative;
			border: 1px solid #E2E2E2;
			font-size: 26rpx;
			.del{
				width: 50rpx;
				height: 50rpx;
				background: #E2E2E2;
				position: absolute;
				top: 0; right: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 0px 8rpx 0px 40rpx;
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