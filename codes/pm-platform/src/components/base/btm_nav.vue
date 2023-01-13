<template>
    <footer>
        <div class="btm">
            <div class="flex-box company" >
                    <i class="iconfont icon-gslogo"></i>
                <p>易百纳线上项目协作</p>
            </div>
            <div class="compay_number">Copyright © 2009-2022 南京启诺信息技术有限公司版权所有. All Rights Reserved. 苏ICP备14036084号-1
            </div>
            <div class="flex-box contact-us">
                <p class="phone-infor">
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="17714209983">
                        <i class="iconfont  icon-dh32" slot="reference"></i>
                    </el-popover>
                </p>
                <div class="wechat">
                    <i class="iconfont  icon-db-wx"></i>
                    <div class="wechat-img">
                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/ewm.png"
                            alt="">
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
    },
    mounted() {
    },
    methods: {},
    components: {
    },
};
</script>
<style scope src="@/assets/css/style.css">

</style>
<style lang='less' scoped>
footer {
    position: relative;
    background-color: #222F4B;
  

    .btm {
        width: 13rem;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.7rem;
        font-size: 0.16rem;
        color: #fff;
        position: relative;
        .company{
            i.icon-gslogo{
                width: 0.32rem;
                height: 0.19rem;
                object-fit: cover;
                margin-right: 0.08rem;
            }

        }
        .contact-us{
            position: relative;
            .phone-infor{
                margin-right: 0.25rem;
              
            }
            i,.icon-sy-sy{
                font-size: 0.28rem;
            }

        }
        .compay_number {
            color: #C1C1C1;
            font-size: 0.13rem;
            width: 6.3rem;
        }

       


        .wechat {
            width: 0.22rem;
            height: 0.22rem;
            position: relative;
            i{
                position: relative;
            }
        }

        .wechat-img {
            position: absolute;
            top: -1.7rem;
    right: -0.1rem;
            width: 1.6rem;
            display: none;
            z-index: 999;

            img {
                height: 100%;
            }
        }

        .wechat:hover .wechat-img {
            display: block;
        }

      
    }

}
</style>