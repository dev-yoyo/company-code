<template>
	<view class="detail">
		<view class="goods">
			<view class="g_info">
				<text class="blod">{{info.shipment_code}}</text>
				<text>{{info.shipment_time}}</text>
			</view>
			<view class="g_info">
				<view>数量：<text class="middle">{{info.total_ship_product_num}}</text></view>
				<view>出货人：<text class="middle">{{info.user_name}}</text></view>
				<view>质保期：<text class="middle">{{info.contract.warranty}}年</text></view>
			</view>
		</view>
		<view class="bar_code">
			<view class="b_title">产品条码</view>
			<view class="collapse">
				<view class="c_item" v-for="(v,k) in p_list" :key="k">
					<view class="i_title" @click="open(k)">
						<view>
							<text>{{v.name}}</text>
							<text style="color: #4D6FFF;margin-left: 10rpx;">{{v.list.length}}</text>
						</view>
						<view :style="{'transition':'all 0.3s ease','transform': v.show?'rotate(0deg)':'rotate(180deg)'}">
							<u-icon name="arrow-up-fill"></u-icon>
						</view>
					</view>
					<view class="i_list" :style="{'height': v.show?v.list.length*1/2*80+48+'rpx':'1px'}">
						<view class="i_l_name" v-for="(vv,kk) in v.list" :key="kk">
							<text :style="{'color': vv.status?'#333':'#E80303','margin-top': kk == 0 ?'44rpx':'20rpx','margin-bottom': kk==v.list.length-1?'44rpx':'20rpx'}">{{vv.name}}</text>
						</view>
					</view>
				</view>
			</view>
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
				info: {},
				p_list: []
			}
		},
		onLoad() {
			let shipment_id = this.$Route.query.id;
			getData('/shipment/shipment_detail',{params:{shipment_id}}).then(res => {
				if(res.code == 200 && res.data.detail){
					this.info = res.data.detail;
					this.dealData();
				}
			});
		},
		onShow() {},
		methods: {
			dealData(){
				if(this.info && this.info.ship_good && this.info.ship_good.length){
					let arr = this.info.ship_good;
					for(let i = 0;i<arr.length; i++){
						this.p_list.push({show: false,list: []});
						this.p_list[i].name = arr[i].product.name;
						this.p_list[0].show = true;
						if(arr[i] && arr[i].product_code && arr[i].product_code.length){
							for(let j = 0; j < arr[i].product_code.length; j++){
								this.p_list[i].list.push({status: 1});
								this.p_list[i].list[j].name = arr[i].product_code[j];
								if(arr[i] && arr[i].rework_shop_goods){
									if(this.p_list[i].list[j].name == arr[i].rework_shop_goods[j]){
										this.p_list[i].list[j].status = 0
									}
								}
							};
						}
					}
				} else {
					return
				}
			},
			open(v){
				this.p_list[v].show = !this.p_list[v].show
			},
		}
	}
</script>

<style lang="less" scoped>
	.goods{
		width: 750rpx;
		height: 212rpx;
		padding: 0 30rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #666666;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		background: linear-gradient( #fff 0%, #C4D8FE 100%);
		.g_info{
			display: flex;
			justify-content: space-between;
			.blod{
				color: #333;
				font-size: 32rpx;
				font-weight: 600;
			}
			.middle{
				color: #333;
				font-size: 26rpx;
			}
		}
	}
	.bar_code{
		width: 750px;
		padding: 0 30rpx;
		overflow: hidden;
		background: #fff;
		box-sizing: border-box;
		.b_title{
			color: #333333;
			font-size: 28rpx;
			font-weight: 600;
			margin: 40rpx 0;
		}
		.collapse{
			width: 690rpx;
			.c_item{
				margin: 30rpx 0;
				.i_title{
					width: 690rpx;
					height: 102rpx;
					padding: 0 40rpx 0 30rpx;
					background: linear-gradient(90deg, #F2F6FF 0%, #FFFFFF 100%);
					box-shadow: 0px 6rpx 4rpx rgba(0,0,0,0.03);
					border-radius: 8rpx 8rpx 0px 0px;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.i_list{
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					padding: 0 70rpx;
					transition: all 0.3s ease;
					justify-content: space-between;
					box-shadow: 0px 6rpx 4rpx rgba(0,0,0,0.03);
					.i_l_name{
						width: 225rpx;
						font-size: 28rpx;
						font-weight: 400;
						margin: 20rpx 0;
						text-align: center;
					}
				}
			}
		}
	}
</style>
