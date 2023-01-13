<template>
	<view class="detail">
		<u-toast ref="uToast"></u-toast>

		<view class="tit">跟进</view>

		<block v-if="info.visit_type != 2">
			<view class="top_info">
				<view class="item">
					<view class="label"> 负责人： </view>
					<view class="r_txt">{{ info.user.name || "暂无" }}</view>
				</view>

				<view class="item">
					<view class="label">跟进方式： </view>
					<view class="r_txt">
						{{ info.visit_type == 0 ? "线上拜访" : "线下拜访" }}
					</view>
				</view>

				<view class="item">
					<view class="label">跟进时间： </view>
					<view class="r_txt">{{ info.visit_time || "暂无" }}</view>
				</view>
			</view>

			<view class="top_info">
				<view class="item content">
					<view class="label"> 跟进内容： </view>
					<view class="r_txt">{{ info.visit_content || "暂无" }}</view>
				</view>
			</view>
			
			<view class="top_info">
				<view class="item content">
					<view class="label">
						<text class="comment">跟进评论：</text>
						<text style="color: #FCAC4E;">{{comment.length}}</text>
					</view>
					<view class="r_txt">
						<view class="c_list" v-if="comment.length">
							<view class="c_item" v-for="(v,k) in comment" :key="k">
								<image v-if="v && v.avatar" class="c_avator" :src="v.avatar"></image>
								<view v-else class="c_avator">{{v.abbreviation}}</view>
								<view class="c_ctn">
									<view class="c_tit">
										<view>
											<text class="c_name">{{v.abbreviation}}</text>
											<text class="c_role" :style="{'background':v.role_id==4?'#E8F6FF':'#FFF2E8','color': v.role_id==4?'#4D6FFF':'#F08200'}">
												{{v.role_id==1?'管理员':v.role_id==2?'子管理员':v.role_id==3?'主管':'销售'}}
											</text>
										</view>
										<view style="margin-top: 8rpx;">
											<text class="c_time">{{v.created_at}}</text>
											<text @click="delComment(v.id)" class="c_del" v-if="v.diff_comment_status">删除</text>
										</view>
									</view>
									<view class="c_text">{{v.content}}</view>
								</view>
							</view>
						</view>
						<view v-if="!comment.length" class="empty">
							<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
							<view class="txt"> 暂无数据 </view>
						</view>
					</view>
				</view>
			</view>
			<view class="safepd"></view>
		</block>

		<view class="top_info" v-else>
			<view class="item">
				<view class="label"> 放弃人： </view>
				<view class="r_txt">{{ info.user.name || "暂无" }}</view>
			</view>
			<view class="item">
				<view class="label">放弃时间： </view>
				<view class="r_txt">{{ info.visit_time || "暂无" }}</view>
			</view>
			<view class="item content">
				<view class="label"> 放弃原因： </view>
				<view class="r_txt">{{ info.visit_content || "暂无" }}</view>
			</view>
		</view>

		<view class="new_fixed_btm" v-if="is_belong && info.visit_type != 2">
			<view class="item" @click="edit">
				<view class="icon_box" style="background: #fff">
					<image :src="bj" mode=""></image>
				</view>
				编辑
			</view>
			<view class="item" @click="addComment(info.id)">
				<view class="icon_box" style="background: #fff">
					<image :src="pl" mode=""></image>
				</view>
				评论
			</view>
			<view class="item" @click="del">
				<view class="icon_box" style="background: #fff">
					<image :src="sc" mode=""></image>
				</view>
				删除
			</view>
		</view>
		
		<view class="btn" v-if="!is_belong && info.visit_type != 2">
			<view class="commentBtn" @click="addComment(info.id)">
				<image :src="msg" mode=""></image>
				<text style="padding-left: 10rpx;">评论</text>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store';
	import {
		getData,
		postData,
		delData
	} from "@/common/api";

	export default {
		data() {
			return {
				follow_id: "",
				role_id: "",
				is_belong: false,
				isAdmin: true,
				info: {},
				noData: store.state.no_data,
				comment:[],
				bj: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202211/02/8eTSSRl6Q81jQOLrKm2jhkhDEOIhqvUgs9yvihdY.png',
				pl: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202211/02/81hZQAwJLFwY4eUtvrTamWGcHM8mdhYepU4ukQsi.png',
				sc: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202211/02/20ehdXmEMPuswTXXAGu3VfoQXckroB2UPRE69Dcb.png',
				msg: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202211/02/l9RTrFy5NvLkDvPCKEgjSvTl7XBmQiltMPkadpbb.png',
			};
		},
		mounted() {},
		onShow() {
			let query = this.$Route.query;
			if (query.follow_id) {
				this.follow_id = query.follow_id;
				this.init();
			}
		},
		methods: {
			init() {
				getData("/follow/follow_record_detail/" + this.follow_id).then((res) => {
					const {
						code,
						data: {
							role_id,
							data,
							comment
						},
					} = res;
					if (code === 200) {
						this.info = data;
						this.role_id = role_id;
						this.comment = comment
					}
				});

				// 是否是自己
				getData("/offer/record_belong", {
					params: {
						model_name: 1, // 1 跟进 2 报价
						id: this.follow_id,
					},
				}).then((res) => {
					const {
						code,
						data
					} = res;
					if (code === 200) {
						this.is_belong = data.record_status;
					}
				});
			},

			// 编辑
			edit() {
				this.$Router.push({
					path: "/create_follow/" + this.follow_id,
					query: {
						follow_id: this.follow_id,
						edit: true,
					},
				});
			},

			del() {
				delData(`/follow/${this.follow_id}`).then((res) => {
					const {
						code,
						data: {
							msg
						},
					} = res;
					if (code === 200) {
						this.$refs.uToast.show({
							message: msg,
							complete() {
								uni.navigateBack({
									delta: 1
								});
							},
						});
					} else {
						this.$u.toast(msg);
					}
				});
			},
			
			addComment(id){
				this.$Router.push({
					path: '/add_comment',
					query: {
						id: id
					}
				})
			},
			delComment(id){
				uni.showModal({
					title: '提示',
					content: '确认删除这条评论吗？',
					success: (res) => {
						if (res.confirm) {
							postData('/comment/delete',{comment_id:id}).then(res => {
								if(res.code ==200){
									this.$u.toast(res.data.msg)
									this.init()
								} else {
									this.$u.toast(res.data.msg)
								}
							})
						}
					}
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
		height: 100%;
	}

	.tit {
		padding: 15px 20px 0;
		font-size: 13px;
		font-weight: 400;
		color: #333333;
	}

	.top_info {
		margin: 10px 0;
		padding: 20px;
		width: 100%;
		background: #fff;

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
				
				.comment{
					font-size: 26rpx;
					font-weight: 500;
					color: #333333;
				}
			}

			.r_txt {
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
				color: #333333;
				text-align: right;
				
				.c_list{
					
					.c_item{
						display: flex;
						padding: 40rpx 0;
						justify-content: space-between;
						border-bottom: 1px solid #EFEFEF;
						.c_avator{
							color: #FFF;
							width: 76rpx;
							height: 76rpx;
							font-size: 24rpx;
							font-weight: 600;
							text-align: center;
							line-height: 76rpx;
							background: #4d6fff;
							border-radius: 50%;
						}
						.c_ctn{
							.c_tit{
								height: 46rpx;
								display: flex;
								margin: 12rpx 0;
								align-items: center;
								justify-content: space-between;
								.c_name{
									color: #333;
									font-size: 28rpx;
									font-weight: 600;
								}
								.c_role{
									height: 46rpx;
									line-height: 46rpx;
									padding: 6rpx 22rpx;
									border-radius: 24rpx;
									margin-left: 10rpx;
								}
								.c_time{
									color: #666;
									font-size: 26rpx;
									font-weight: 400;
								}
								.c_del{
									color: #4D6FFF;
									font-size: 26rpx;
									font-weight: 400;
									margin-left: 24rpx;
								}
							}
							.c_text{
								width: 560rpx;
							}
						}
					}
					:last-child{
						padding-bottom: 10rpx;
						border-bottom-width: 0;
					}
				}
				
				.empty{
					height: 400rpx;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: space-evenly;
				}
			}
		}

		:last-child {
			margin-bottom: 0;
		}

		.content {
			display: block;

			.r_txt {
				margin-top: 10px;
				text-align: left;
			}
		}
	}
	
	.safepd{
		height: calc(170rpx + env(safe-area-inset-bottom));
	}
	.btn{
		position: fixed;
		bottom: 0;
		width: 750rpx;
		color: #fff;
		background: #fff;
		box-shadow: 0px 0px 6px rgba(0,0,0,0.16);
		padding: 34rpx 30rpx calc(34rpx + env(safe-area-inset-bottom)) 30rpx;
		.commentBtn{
			height: 90rpx;
			display: flex;
			background: #4D6FFF;
			align-items: center;
			justify-content: center;
			border-radius: 46rpx;
			> image {
				width: 18px;
				height: 16px;
				margin: 2px 5px 0 0;
			}
		}
	}
</style>
