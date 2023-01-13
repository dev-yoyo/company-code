<template>
	<view>
		<view class="comment">
			<view class="cmt_btn">
				<view class="c_b_t">评论内容</view>
				<view @click="$noMultipleClicks(addComment,$Route.query.id)" class="c_btn">提交</view>
			</view>
			<view class="cmt_ctn">
				<u--textarea v-model="content" placeholder="请输入评论内容（必填）" height="360"></u--textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import { postData } from '../../common/api'
	export default {
		data() {
			return {
				content: '',
				noClick: true,
			}
		},
		methods: {
			addComment(id) {
				postData('/comment', {
					follow_record_id: id,
					content: this.content
				}).then(res => {
					if (res.code == 200) {
						this.$u.toast(res.data.msg)
						setTimeout(()=>{
							this.$Router.back()
						},1000)
					} else {
						this.$u.toast(res.data.msg)
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.cmt_btn {
		width: 750rpx;
		height: 120rpx;
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.c_b_t {
			font-size: 32rpx;
			font-weight: 600;
			font-family: PingFang SC;
			color: #333333;
		}

		.c_btn {
			width: 156rpx;
			height: 76rpx;
			color: #fff;
			font-size: 32rpx;
			line-height: 76rpx;
			text-align: center;
			background: #4D6FFF;
			border-radius: 42rpx;
		}
	}
</style>
