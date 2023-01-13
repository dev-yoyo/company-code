<template>
    <view class="lack">
        <image class="img" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202110/16/h5%E5%9B%BE%E7%89%87/zwsjo%403x.png" alt="易百纳技术社区"></image>
        <view class="text">{{ this.text || '暂无数据哦～'}}</view>
    </view>
</template>

<script>
    export default {
        props:['text'],
        name:"lack",
        data() {
            return {
                
            };
        }
    }
</script>

<style lang="scss">
    .lack{
        text-align: center;
        .img {
            height: 250rpx;
            width: 284rpx;
            margin-top: 200rpx;
        }
        .text {
            font-size: 28rpx;
            line-height: 40rpx;
            color: #999;
        }
    }
</style>
