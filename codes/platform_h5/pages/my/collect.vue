<template>
    <view class="collcet">
        <view class="collcet_list" v-if="!is_empty">
            <view class="collcet_item" v-for="(v, index) in list" :key="index" @tap="ask_detail(v.questions.id)">
                <view class="title">
                    <text class="reward" v-if="v.questions && v.questions.type == 1">【悬赏】</text>
                    <text class="share" v-if="v.questions && v.questions.type == 2">【分享】</text>
                    {{ v.questions && v.questions.title ? v.questions.title : '' }}
                </view>
        
                <view class="info">
                    <view class="time">{{v.show_time}}</view>
                    <view class="reply_count" :class="v.questions && v.questions.best_reply_id != 0 ? 'take' : ''">
                        <i class="icon iconfont icon-e-dg3"></i>
                        <text>{{ v.questions && v.questions.reply_count  ? v.questions.reply_count : ''}}</text>
                        <i class="icon iconfont icon-e-pli"></i>
                    </view>
                </view>
            </view>
        </view>
        <lack v-else></lack>
        
        <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
        
        <!-- 创建提问 -->
        <image class="ask_create_btn" src="/static/common/img/ask_create.png" @tap="ask_create()"/>
    </view>
</template>

<script>
    export default {
        data() {
    		return {
                list:[],
                is_empty : false,
                page: 1,
                next_page: true,
                scrollTop: 0,
    		}
    	},
        onShow() {
            this.get_list()  
        },
    	methods: {
            get_list () {
                this.$u.api.getUserCollect({
                    page: this.page,
                }).then(res => {
                    let data = res.data
                    this.list = this.page == 1 ? data.data : this.list.concat(data.data)
                    this.next_page = data.next_page_url ? true : false;
                    this.is_empty = this.list.length  == 0
                });
            },
            ask_detail(id) {
                this.$Router.push({
                    name:'ask_detail',
                    params: {
                        id
                    }
                })
            },
            ask_create() {
                this.$Router.push({
                    name:'ask_create',
                })
            },
    	},
        onReachBottom() {
            if (!this.next_page) return;
            this.page = this.page + 1;
            this.get_list();
        },
        onPageScroll(e) {
            this.scrollTop = e.scrollTop;
        },
    }
</script>

<style lang="scss">
    .collcet_list {
        .collcet_item {
            margin-bottom: 2rpx;
            padding: 28rpx 30rpx;
            background: #fff;
        
            .title {
                margin-bottom: 16rpx;
                font-size: 30rpx;
                font-weight: 600;
                line-height: 44rpx;
                color: #333;
                word-break: break-all;
            
                .reward {
                    font-size: 32rpx;
                    color: #ffb612;
                }
            
                .share {
                    font-size: 32rpx;
                    color: #0268fa;
                }
            }
        
            .info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #999;
                font-size: 28rpx;
        
                .reply_count {
                    text {
                        margin: 0 8rpx;
                    }
                    
                    .iconfont {
                        font-size:20rpx;
                    }
            
                    .icon-e-dg3 {
                        display: none;
                    }
                }
            
                .take {
                    color: #0268fa !important;
            
                    .icon-e-dg3 {
                        display: inline-block;
                    }
                }
            }
        }
    }

    .ask_create_btn {
        display: block;
        position: fixed;
        top: 834rpx;
        right: 12rpx;
        width: 132rpx;
        height: 132rpx;
    }
</style>
