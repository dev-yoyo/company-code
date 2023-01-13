<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="8.88rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>认证审核</h4>
            <div class="task-c">
                <section class="top">
                    <div class="flex-center task-title">
                        <h4> <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                                <use xlink:href="#icon-grrz-smrz"></use>
                            </svg> 认证申请</h4>
                        <div class="btns" >
                            <el-button type="primary"  class="success" @click="agressAuth">
                                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                                    <use xlink:href="#icon-rzsh-tg"></use>
                                </svg>
                                审核通过
                            </el-button>
                            <el-button type="primary" @click="toReviewShow=true" class="fail">
                                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                                    <use xlink:href="#icon-rzsh-sb"></use>
                                </svg> 审核失败
                            </el-button>
                        </div>
                    </div>
                    <div>
                        <el-form  label-width="100px" :inline="true" v-if="userinfor.user_certification">
                            <el-form-item label="真实姓名：" >
                                <p>{{userinfor.user_certification.name}}</p>
                            </el-form-item>
                            <el-form-item label="身份证号：">
                                <p>{{userinfor.user_certification.id_number}}</p>
                            </el-form-item>
                            <el-form-item label="花名：">
                                <p>{{userinfor.stage_name}}</p>
                            </el-form-item>
                            <el-form-item label="银行卡号：">
                                <p>{{userinfor.user_certification.bank_number}}</p>
                            </el-form-item>
                            <el-form-item label="支付宝账号：">
                                <p>{{userinfor.user_certification.alipay_account}}</p>
                            </el-form-item>
                            <el-form-item label="认证状态：">
                                <p>{{userinfor.status}}</p>
                            </el-form-item>
                            <el-form-item label="身份证照：" style="width:100%">
                                <div class="flex-box imgs">
                                    <el-image :src="userinfor.user_certification.id_front" ></el-image>
                                    <el-image :src="userinfor.user_certification.id_reverse" ></el-image>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </section>

            </div>


        </el-drawer>
        <to-review v-if="toReviewShow" :userId="userId" ref="refToReview" @cancel="hideReviewShow"></to-review>

    </div>
</template>
  
<script>
import ToReview from './to-review.vue';
import {getData, postData } from "@/api/user";
export default {
    // name:'checkQuestion',
    props:['userId'],
    components: {
        ToReview
    },
    data() {
        return {
            form: {},
            toReviewShow:false,
            userinfor:{}
        }

    },
    created() {
        this.userDetail()
    },
    methods: {
        hideReviewShow (){
        this.toReviewShow=false
        this.$emit("cancel", {});
    },
        cancel() {
            this.$emit("cancel", {});
        },
        agressAuth(){
            postData({
                url: "/workbech/admin_workbench/user/update_status" ,
                data:{
                    user_id:this.userId,
                    status:'审核通过',
                    reason:''
                }
            }).then((res) => {
                if(res.code==200){
                    this.$success(res.data.msg)
                    this.$emit("cancel", {});
                }
            }).catch((err) => {

            })
        },
             // 用户详情
             userDetail() {
            getData({
                url: "/workbech/admin_workbench/user/detail/" + this.userId,
                
            }).then((res) => {
                this.userinfor = res.data.info
            }).catch((err) => {

            })
        },


    },

}
</script>
  
<style lang="less" scoped>
.check-task {
 .imgs{
    img{
        // border: 1px solid #ccc;
    }
 }
    .task-c {
        width: 7.64rem;
        padding: 0.13rem 0.21rem 0;
        margin-top: 0.2rem;

        .top {
            height: 4rem;

            .flex-item {
                width: 2.5rem;
            }

            .task-title {
                margin-bottom: 0.35rem;
                background: #FFF9EF;
                padding: 0.12rem 0.16rem;
                svg{
                    margin-right: 0.1rem;
                }
                h4{
                    
font-size: 0.14rem;
color: #CB781F;
                }

                .btns {
                    .el-button {
                        padding: 0.06rem 0.12rem;
                    }
                    .success{
                        color: #22A727;
                        background: #EEFFE6!important;
                        border: 1px solid #EEFFE6!important;
                    }
                    .fail{
                        color: #FF1D00;
                        background: #FFEBEB!important;
                        border: 1px solid #FFEBEB!important;
                    }


                }

            }
            .el-form{
                padding-left: 0.3rem;
            }
            .el-form-item{
                width: 48%;
                    img{
                        width: 2rem;
                        height: 1.6rem;
                        border-radius: 0.02rem;
                        margin-right: 0.2rem;
                    
                }
            }


        }


    }
}
</style>