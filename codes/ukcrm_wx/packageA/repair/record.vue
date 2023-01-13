<template>
	<view class="detail">
		<view class="product">
			<view class="p_title">返修信息</view>
			<view class="p_info">
				<view class="p_item">
					<text class="i_k">返修日期：</text>
					<text class="i_v">{{product.repair_time}}</text>
				</view>
				<view class="p_item">
					<text class="i_k">预计返修天数：</text>
					<text class="i_v">{{product.repair_day}}</text>
				</view>
				<view class="p_item">
					<text class="i_k">经办人：</text>
					<text class="i_v">{{product.user.name}}</text>
				</view>
				<view class="p_i_r">
					<text class="i_k">故障问题：</text>
					<view class="i_v">{{product.fault}}</view>
				</view>
			</view>
		</view>
		<view class="repair" :style="{'height':showBtn?'598rpx':'406rpx'}">
			<view class="r_title">
				<text>返修信息</text>
				<view @click="showBtn = true" v-if="!showBtn" class="edit">
					<uni-icons type="compose" color="#fff"></uni-icons>
					<text style="color: #fff;">编辑</text>
				</view>
			</view>
			<view class="r_info" :style="{'height':showBtn?'532rpx':'318rpx'}">
				<view class="f_item"  :style="{'padding':showBtn?'36rpx 0':'20rpx 0'}">
					<view class="f_k">返修完成日期：</view>
					<view class="f_v" @click="openDate">
						<u-calendar :show="showDate" @confirm="confirm" @close="showDate = false" closeOnClickOverlay="true"></u-calendar>
						<text :style="{'color':form.rework_complete_time?'':'#999'}">{{form.rework_complete_time?form.rework_complete_time:'请选择'}}</text>
					</view>
				</view>
				<view class="f_item" :style="{'padding':showBtn?'36rpx 0':'20rpx 0'}">
					<view class="f_k">返修结果：</view>
					<view class="f_v" @click="openSelect">
						<input class="ipt" v-model="form.rework_result" :disabled="true" placeholder-style="color: #999;"
							maxlength="3" :placeholder="showBtn?'请输入':'未填写'">
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<view v-if="!showBtn" class="f_i_c1">
					<view class="f_k">返修说明：</view>
					<view class="f_v">
						<input v-model="form.rework_complete_reason" placeholder="未填写" disabled></input>
					</view>
				</view>
				<view v-if="showBtn" class="f_i_c2">
					<view class="f_k">返修说明：</view>
					<view class="f_v">
						<u--textarea v-model="form.rework_complete_reason" placeholder="请输入" border="none"></u--textarea>
					</view>
				</view>
			</view>
		</view>
		<view class="empty"></view>
		<view class="btn_box" v-if="showBtn">
			<view class="btn" @click="showBtn = false">
				<u-button type="info" size="large" shape="circle" text="取消"></u-button>
			</view>
			<view class="btn" @click="submit">
				<u-button type="primary" size="large" shape="circle" text="保存"></u-button>
			</view>
		</view>
		<u-action-sheet :show="show" :actions="actions" title="请选择维修结果" @close="show = false" @select="select">
		</u-action-sheet>
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
				show: false,
				showBtn: false,
				showDate: false, 
				product: {},
				form: {
					id: '',
					rework_complete_time: '',
					rework_result: '',
					rework_complete_reason: ''
				},	
				actions: [{name:'已维修'},{name:'已报废'}]
			}
		},
		onLoad() {
			this.form.id = this.$Route.query.id;
			getData('/rework/rework_record_detail',{params:{id:this.$Route.query.id}}).then(res=>{
				this.product = res.data.detail;
				this.form.rework_complete_time = this.product.rework_complete_time;
				this.form.rework_result = this.product.rework_result;
				this.form.rework_complete_reason = this.product.rework_complete_reason;
			})
		},
		onShow() {},
		methods: {
			openDate(){
				if(this.showBtn){
					this.showDate = true
				}
			},
			confirm(v) {
				if (v[0]) {
					this.form.rework_complete_time = v[0];
					this.showDate = false;
				}
			},
			select(v) {
				this.form.rework_result = v.name;
			},
			openSelect(){
				this.show = this.showBtn;
			},
			submit(){
				let { id, rework_complete_time, rework_result, rework_complete_reason } = this.form;
				if(!rework_complete_time){
					this.$u.toast('请填写返修日期！');
					return
				}
				if(!rework_result){
					this.$u.toast('请选择返修结果！');
					return
				}
				if(!rework_complete_reason){
					this.$u.toast('请填写返修说明！');
					return
				}
				postData('/rework/update',{id,rework_complete_time,rework_result,rework_complete_reason}).then(res => {
					if(res.code ==200){
						this.$u.toast(res.data.msg)
					}
				})
				this.showBtn = false;
			}
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

			.p_i_r {
				.i_k {
					font-size: 28rpx;
					font-weight: 400;
					color: #666;
				}

				.i_v {
					margin-top: 10rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #333;
				}
			}
		}
	}

	.repair {
		width: 750rpx;
		background: #fff;
		padding: 0 30rpx;
		margin-top: 20rpx;
		overflow: hidden;

		.r_title {
			color: #333;
			width: 100%;
			height: 88rpx;
			font-size: 28rpx;
			font-weight: 600;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.edit {
				width: 126rpx;
				height: 56rpx;
				text-align: center;
				line-height: 56rpx;
				border-radius: 28rpx;
				background: linear-gradient(90deg, #4D6FFF 0%, #6584FF 100%);
			}
		}

		.r_info {
			padding: 0 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.f_item {
				width: 630rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #F2F2F2;

				.f_k {
					color: #666;
					width: 195rpx;
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

			.f_i_c1 {
				width: 630rpx;
				.f_k {
					color: #666;
					width: 195rpx;
					font-size: 28rpx;
					font-weight: 400;
				}

				.f_v {
					color: #333;
					font-size: 28rpx;
					font-weight: 500;
				}
			}
			
			.f_i_c2 {
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
