<template>
	<view class="detail">
		<view class="product">
			<view class="p_title">产品信息</view>
			<view class="p_info">
				<view class="p_item">
					<text class="i_k">产品名称：</text>
					<text class="i_v">{{product.detail.product_name}}</text>
				</view>
				<view class="p_item">
					<text class="i_k">产品编码：</text>
					<text class="i_v">{{product.detail.product_code || product.product_code}}</text>
				</view>
				<view class="p_item">
					<text class="i_k">合同编号：</text>
					<text class="i_v">{{product.detail.contract.contract_no}}</text>
				</view>
				<view class="p_item">
					<text class="i_k">关联企业：</text>
					<text class="i_v">{{product.detail.contract.customer_company_name}}</text>
				</view>
			</view>
		</view>
		<view class="repair">
			<view class="r_title">返修信息</view>
			<view class="r_info">
				<view class="f_item" @click="show = true">
					<view class="f_k">返修日期</view>
					<view class="f_v">
						<u-calendar :show="show" @confirm="confirm" @close="closed" closeOnClickOverlay="true"></u-calendar>
						<text :style="{'color':form.rework_time?'':'#999'}">{{form.rework_time?form.rework_time:'请选择'}}</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<view class="f_item">
					<view class="f_k">预计返修时间</view>
					<view class="f_v">
						<input class="ipt" v-model="form.repair_day" placeholder-style="color: #999;" maxlength="3"
							placeholder="请输入" type="number">
						<text>天</text>
					</view>
				</view>
				<view class="f_i_c">
					<view class="f_k">故障原因</view>
					<view class="f_v">
						<u--textarea v-model="form.fault" placeholder="请输入" border="none"></u--textarea>
					</view>
				</view>
			</view>
		</view>
		<view class="empty"></view>
		<view class="btn_box">
			<view class="btn" @click="back">
				<u-button type="info" size="large" shape="circle" text="取消"></u-button>
			</view>
			<view class="btn" @click="next">
				<u-button type="primary" size="large" shape="circle" text="保修"></u-button>
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
	import { navBack } from '@/common/hooks';
	export default {
		data() {
			return {
				show: false,
				form: {
					fault: '',
					rework_id: '',
					repair_day: '',
					rework_time: '',
					product_id: '',
					product_name: '',
					product_code: '',
					contract_id: '',
					shipment_id: ''
				},
				product: {}
			}
		},
		onLoad() {
			this.init();
		},
		onShow() {},
		methods: {
			back(){
				navBack()
			},
			init(){
				this.product = this.$Route.query.data;
				if(this.product.detail?.rework_record_count){
					let { product_code, shipment_id } = this.product.detail;
					if(this.product.detail.rework_record.length){
						this.form.rework_id = this.product.detail.rework_record[0].rework_id;
					} else {
						delete this.form.rework_id
					}
					this.form.product_code = product_code;
					this.form.shipment_id = shipment_id;
				} else {
					let product_code = this.product.product_code;
					let id = this.product.detail.id;
					this.form.shipment_id = id;
					this.form.product_code = product_code;
				}
				let { product_id, product_name, contract_id } = this.product.detail;
				this.form.product_id = product_id;
				this.form.product_name = product_name;
				this.form.contract_id = contract_id;
			},
			closed() {
				this.show = false;
			},
			// 选择日期
			confirm(v) {
				if (v[0]) {
					this.form.rework_time = v[0];
					this.show = false;
				}
			},
			next(){
				console.log(this.form)
				if(!this.form.rework_time){
					this.$u.toast('请选择返修日期！');
					return
				}
				if(!this.form.repair_day){
					this.$u.toast('请填写返修时间！')
					return
				}
				if(!this.form.fault){
					this.$u.toast('请填写故障原因！')
					return
				}
				let { fault, rework_id, repair_day, rework_time } = this.form;
				if(this.product.detail && this.product.detail.rework_record && this.product.detail.rework_record.length){
					postData('/rework',{fault, rework_id, repair_day, rework_time}).then(res=>{
						if(res.code == 200){
							this.$u.toast(res.data.msg)
							navBack()
						}
					})
				} else {
					postData('/rework',{...this.form}).then(res=>{
						if(res.code == 200){
							this.$u.toast(res.data.msg)
							navBack()
						}
					})
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.product {
		width: 750rpx;
		height: 426rpx;
		padding: 0 30rpx;
		margin-top: 16rpx;
		background: #fff;
		overflow: hidden;

		.p_title {
			width: 100%;
			font-size: 28rpx;
			font-weight: 600;
			margin-top: 26rpx;
			color: #333;
		}

		.p_info {
			height: 360rpx;
			padding: 0 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.p_item {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.i_k {
					font-size: 28rpx;
					font-weight: 400;
					color: #666;
				}

				.i_v {
					font-size: 28rpx;
					font-weight: 500;
					color: #333;
				}
			}
		}
	}

	.repair {
		width: 750rpx;
		height: 598rpx;
		background: #fff;
		padding: 0 30rpx;
		margin-top: 20rpx;
		overflow: hidden;

		.r_title {
			width: 100%;
			font-size: 28rpx;
			font-weight: 600;
			margin-top: 26rpx;
			color: #333;
		}

		.r_info {
			height: 532rpx;
			padding: 0 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.f_item {
				width: 630rpx;
				display: flex;
				padding: 36rpx 0;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #F2F2F2;

				.f_k {
					color: #666;
					width: 168rpx;
					font-size: 28rpx;
					font-weight: 400;
				}

				.f_v {
					color: #333;
					font-size: 28rpx;
					font-weight: 500;
					display: flex;

					.ipt {
						width: 86rpx;
						color: #333;
						margin-top: -2rpx;
					}
				}
			}

			.f_i_c {
				width: 630rpx;
				height: 304rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				.f_k {
					color: #666;
					width: 168rpx;
					font-size: 28rpx;
					font-weight: 400;
				}

				.f_v {
					color: #333;
					font-size: 28rpx;
					font-weight: 500;
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
