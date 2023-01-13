<template>
	<view class="detail">
		<view v-if="comment.length > 0">
			<view class="item" v-for="(v, i) in comment" :key="i">
				<view class="top_time d-flex" v-if="v.date_time">
					<view class="time"> {{ v.date_time }} </view>
				</view>

				<view class="msg_item d-flex">
					<view class="img_box">
						<text class="nickname" v-if="!v.comment.avatar">{{v.comment.abbreviation}}</text>
						<u-avatar v-if="v.comment.avatar" :src="v.comment.avatar" :size="44" bg-color="#4D6FFF" mode="aspectFit"></u-avatar>
					</view>

					<view class="r_main">
						<view class="r_user">
							<text class="r_user_name">{{v.comment.abbreviation}}</text>
							<text class="r_u_role" :style="{'background':v.role==4?'#E8F6FF':'#FFF2E8','color': v.role_id==4?'#4D6FFF':'#F08200'}">{{v.role_id==1?'管理员':v.role_id==2?'子管理员':v.role_id==3?'主管':'销售'}}</text>
						</view>
						<view class="r_ctn">
							<text class="r_text">{{v.content}}</text>
							<view class="r_flw" @click="toComment(v.comment.follow_record_id)">
								<view class="c_tit">跟进记录</view>
								<view class="v_ctn">{{v.comment.follow_record.visit_content}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="slogan" v-else>
			<u-avatar :src="slogan" :size="128" mode="aspectFit"></u-avatar>
			<view class="txt"> 暂无消息 </view>
		</view>
	</view>
</template>

<script>
	import {
		getData,
		postData
	} from "@/common/api";
	export default {
		data() {
			return {
				comment: [],
				page: 1,
				first: true,
				scrollTop: 0,
				next_page: true,
				slogan: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/yfKS2XWyKxY5HwynQRDxz66zdc4de2ZM1642734415658.png",
			};
		},
		onLoad() {
			this.init();
		},
		methods: {
			init() {
				getData("/message/comment").then((res) => {
					const { code, data: { list } } = res;
					if (code === 200) {
						uni.stopPullDownRefresh();

						let arr = list.data.reverse();
						if (this.page != 1) {
							this.comment = arr.concat(this.comment);
						} else {
							this.comment = arr;
						}
						this.page++;
						this.next_page = list.next_page_url ? true : false;

						if (this.first) {
							this.$nextTick(function() {
								uni.pageScrollTo({
									scrollTop: 99999999,
								});
							});
							this.first = false;
						}
					}
				});
				postData("/message", {
				  type: 3,
				}).then((res) => {});
			},
			toComment(id){
				this.$Router.push({
					path: '/follow_record/'+id,
					query: {
						follow_id: id,
					}
				})
			},
			onPageScroll(e) {
				if (!this.next_page) return uni.stopPullDownRefresh();
				if (e.scrollTop <= 0) {
					uni.showLoading({
						title: "加载中",
						mask: true,
					});
					this.init();
					setTimeout(() => {
						uni.hideLoading()
					}, 1000)
				}
			},
			onPullDownRefresh() {
				if (!this.next_page) return uni.stopPullDownRefresh();
				this.init();
			},
		},
	};
</script>

<style lang="less" scoped>
	.detail {
		padding: 18px 15px;
	}

	.item {
		margin-bottom: 30px;

		.top_time {
			margin-bottom: 30px;
			justify-content: center;

			.time {
				padding: 0 17px;
				height: 22px;
				line-height: 22px;
				text-align: center;
				background-color: #fff;
				border-radius: 20px;

				font-size: 12px;
				font-weight: 400;
				color: #999999;
			}
		}

		.msg_item {
			align-items: flex-start;
			width: 100%;
			margin-bottom: env(safe-area-inset-bottom);
			.img_box {
				flex-shrink: 0;
				width: 44px;
				.nickname{
					display: inline-block;
					color: #FFF;
					width: 88rpx;
					height: 88rpx;
					font-size: 24rpx;
					font-weight: 600;
					text-align: center;
					line-height: 88rpx;
					background: #4d6fff;
					border-radius: 50%;
				}
			}

			.r_main {
				margin-left: 11px;
				width: 80vw;
				box-sizing: border-box;
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
				color: #333333;
				
				.r_user{
					height: 70rpx;
					display: flex;
					align-items: center;
					.r_user_name{
						font-size: 28rpx;
						font-weight: 600;
						color: #333333;
					}
					.r_u_role{
						display: inline-block;
						width: 92rpx;
						height: 46rpx;
						margin-left: 10rpx;
						text-align: center;
						line-height: 46rpx;
						background: #FFF2E8;
						border-radius: 24rpx;
					}
				}
				.r_ctn{
					box-sizing: border-box;
					overflow: hidden;
					border-radius: 20rpx;
					box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.04);
					.r_text{
						width: 100%;
						border: 16px solid #fff;
						background: #fff;
						font-size: 30rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
				
					}
					.r_flw{
						box-sizing: border-box;
						padding: 34rpx 36rpx;
						background: linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 100%);
						.c_tit{
							font-size: 30rpx;
							font-weight: 600;
						}
						.v_ctn{
							margin: 8rpx 0;
							font-size: 26rpx;
							font-weight: 400;
							color: #999999;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							
						}
					}
				}
			}
		}
	}

	.slogan {
		padding: 237px 0 0;
	}
</style>
