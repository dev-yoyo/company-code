<template>
	<view class="detail">
		<view class="product">
			<view class="p_title">出货信息</view>
			<view class="p_info">
				<view class="p_item">
					<view class="p_i_k">出货编号</view>
					<view class="p_i_v">系统自动生成</view>
				</view>
				<view class="p_item">
					<view class="p_i_k">出货时间</view>
					<view class="p_i_v" @click="show = true">
						<text :style="{ color: form.shipment_time ? '#333' : '#999' }">{{ form.shipment_time ? form.shipment_time : '请选择' }}</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<view class="p_item" style="border-width: 0px;">
					<view class="p_i_k">经办人</view>
					<view class="p_i_v">{{ user }}</view>
				</view>
			</view>
		</view>
		<view class="p_list">
			<view class="p_title">产品信息</view>
			<view class="list_box">
				<view class="l_item" v-for="(v, k) in data" :key="k" :class="v.status ? 'success' : 'fail'" @click="record(k)">
					<view class="l_i first">{{ v.product_name }}</view>
					<view class="l_i second">
						<view class="l_i_left">
							<text class="l_i_l_k">合同数量：</text>
							<text class="l_i_l_v">{{ v.product_num }}</text>
						</view>
						<view class="l_i_right">
							<text class="l_i_l_k">剩余：</text>
							<text class="l_i_l_v">{{ v.surplus_num == null ? v.product_num : v.surplus_num }}</text>
						</view>
					</view>
					<view class="l_i third">
						<view class="l_i_left">
							<u-icon v-if="!v.status" color="#E80303" name="warning-fill"></u-icon>
							<text class="l_i_l_k">本次出货：</text>
							<text v-if="v.status" style="color: #4D6FFF;font-weight: 600;">{{ form.ship_goods[k].product_code.length }}</text>
							<text v-if="!v.status" style="color: #E80303;">存在错误数据</text>
						</view>
						<view class="inter">录入</view>
					</view>
				</view>
			</view>
		</view>
		<view class="empty"></view>
		<view class="btn_box">
			<view class="btn" @click="back"><u-button type="info" size="large" shape="circle" text="取消"></u-button></view>
			<view class="btn" @click="submit"><u-button type="primary" size="large" shape="circle" text="出货"></u-button></view>
		</view>
		<u-calendar :show="show" @confirm="confirm" @close="show = false" closeOnClickOverlay="true"></u-calendar>
	</view>
</template>

<script>
import store from '@/store';
import { getData, postData, getUser } from '@/common/api';
export default {
	data() {
		return {
			show: false,
			user: '',
			data: [],
			form: {
				contract_id: '',
				shipment_time: '',
				ship_goods: []
			}
		};
	},
	onLoad() {
		this.init();
	},
	onShow() {
		this.shipProduct();
	},
	methods: {
		back() {
			this.$Router.back();
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
		// 初始化
		init() {
			let contract_id = uni.getStorageSync('contract_id');
			let sign_user = uni.getStorageSync('sign_user');
			let contract_product = JSON.parse(uni.getStorageSync('contract_product'));
			this.form.contract_id = contract_id;
			this.user = sign_user;
			let c_data = contract_product;
			c_data.map(i => {
				i.status = 1;
				if (i.surplus_num == null) {
					i.surplus_num = i.product_num;
				}
			});
			this.data = c_data;
			for (let j = 0; j < c_data.length; j++) {
				this.form.ship_goods.push({ contract_product_id:c_data[j].id,ship_product_id: c_data[j].product_id, product_code: [] });
			}
		},
		// 出货编码
		shipProduct() {
			let data = this.getAllCode();
			// if(data && data.length){
			// 	for(let i = 0;i<data.length;i++){
			// 		for(let j = 0;j<this.form.ship_goods.length;j++){
			// 			if(this.form.ship_goods[j].ship_product_id == data[i].product_id){
			// 				this.form.ship_goods[j].product_code = data[i].product_code
			// 			}
			// 		}
			// 	}
			// }
			for(let i = 0;i<data.length;i++){
				for(let j = 0;j<this.form.ship_goods.length;j++){
					if(this.form.ship_goods[j].ship_product_id == data[i].product_id && this.data[j].id == data[i].contract_pid){
						this.form.ship_goods[j].product_code = data[i].product_code
					}
				}
			}
			// 每次进入前清空错误状态
			this.data.map(i => {
				i.status = 1;
			});
		},
		// 选择时间
		confirm(v) {
			if (v[0]) {
				this.form.shipment_time = v[0];
				this.show = false;
			}
		},
		// 手动录入
		record(k) {
			if (this.data[k].surplus_num == 0) {
				this.$u.toast('此产品出货完成！');
				return;
			}
			if (this.form.ship_goods[k].product_code.length) {
				this.$Router.push({ path: '/productcode' });
			} else {
				this.$Router.push({ path: '/manualrecord' });
			}
			let contract_product = JSON.parse(uni.getStorageSync('contract_product'));
			let ship_product_id = contract_product[k].product_id;
			let contract_pid = contract_product[k].id;
			uni.setStorageSync('ship_product_id', ship_product_id);
			uni.setStorageSync('contract_pid', contract_pid);
		},
		// 提交失败
		dealData(data) {
			// 处理重复的数据
			data.map(i=>{
				if(!Array.isArray(i.repeat)){
					i.repeat = Object.values(i.repeat)
				}
			})
			uni.setStorageSync('repeat_data', data);
			for(let i =0;i<data.length; i++){
				for(let j = 0; j<this.data.length; j++){
					if(this.data[j].product_id == data[i].ship_product_id){
						this.data[j].status = 0;
					}
				}
			}
		},
		// 提交
		submit() {
			var pages = getCurrentPages();
			let pageNum = 0;
			pages.map((i,k)=>{
				if(i.route == 'packageA/contract/detail'){
					pageNum = k
				}
			})
			let id = this.form.contract_id;
			if (!this.form.shipment_time) {
				this.$u.toast('请填写出货时间！');
				return;
			}
			let goods_num = 0;
			this.form.ship_goods.map(i => {
				goods_num += i.product_code.length;
			});
			if (!goods_num) {
				this.$u.toast('出货数量不能为0！');
				return;
			}
			let count = 0;
			for (let i = 0; i < this.data.length; i++) {
				if (this.form.ship_goods[i].product_code.length > this.data[i].surplus_num) {
					count++;
				}
			}
			if (count) {
				this.$u.toast('出货数量超出剩余数量！');
				return;
			}
			uni.showModal({
				title: '提示',
				content: '产品一经出货将无法修改，请仔细核对是否出货',
				success: res => {
					if (res.confirm) {
						let data = JSON.parse(JSON.stringify(this.form));
						data.ship_goods.map((i, k) => {
							if (!i.product_code.length) {
								data.ship_goods.splice(k, 1);
							}
						});
						postData('/shipment', { ...data }).then(res => {
							if (res.code == 200) {
								this.$u.toast(res.data.msg);
								uni.removeStorageSync('product_code');
								uni.removeStorageSync('repeat_data');
								setTimeout(() => {
									uni.navigateBack(pageNum)
								}, 1000);
							} else {
								uni.showModal({
									title: '提示',
									content: res.data.msg
								});
								this.dealData(res.data.product);
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.product {
	width: 750rpx;
	height: 406rpx;
	padding: 0 30rpx;
	background: #fff;
	overflow: hidden;
	.p_title {
		color: #333;
		width: 100%;
		font-size: 28rpx;
		font-weight: 600;
		margin-top: 26rpx;
	}
	.p_info {
		height: 356rpx;
		padding: 0 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.p_item {
			height: 112rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #f2f2f2;

			.p_i_k {
				color: #666;
				font-size: 28rpx;
				font-weight: 400;
			}

			.p_i_v {
				color: #bebebe;
				font-size: 28rpx;
				font-weight: 500;
				display: flex;
			}
		}
	}
}
.p_list {
	width: 750rpx;
	background: #fff;
	padding: 0 30rpx;
	margin-top: 20rpx;
	overflow: hidden;
	.p_title {
		color: #333;
		width: 100%;
		font-size: 28rpx;
		font-weight: 600;
		margin-top: 26rpx;
	}
	.list_box {
		overflow: hidden;
		.fail {
			background: linear-gradient(90deg, #ffe8e8 0%, #ffffff 100%);
		}
		.success {
			background: linear-gradient(90deg, #f2f6ff 0%, #ffffff 100%);
		}
		.l_item {
			width: 690rpx;
			height: 272rpx;
			margin: 30rpx 0;
			padding: 0 42rpx;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			box-shadow: 0px 0px 8rpx rgba(0, 0, 0, 0.1);
		}
	}
}
.l_i {
	font-size: 26rpx;
	font-weight: 400;
	color: #666;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	.l_i_left {
		display: flex;
	}
}
.first {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
}
.second {
	margin: 20rpx 0 30rpx 0;
	padding-bottom: 20rpx;
	justify-content: flex-start;
	border-bottom: 1px solid #ebebeb;
	.l_i_right {
		margin-left: 184rpx;
	}
}
.third {
	.inter {
		color: #ff9d00;
		width: 160rpx;
		height: 64rpx;
		text-align: center;
		line-height: 64rpx;
		background: #fff8e3;
		border-radius: 4rpx;
		box-shadow: 0px 2rpx 12rpx rgba(1, 39, 67, 0.16);
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
	padding: 34rpx 30rpx calc(34rpx + env(safe-area-inset-bottom)) 30rpx;
	background-color: #fff;

	.btn {
		width: 336rpx;
		margin: 0 10rpx;
	}
}
</style>
