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
                        <div class="btns">
                            <el-button type="primary" class="success" @click="agressAuth()"  :loading="listLoading" :disabled="listLoading">
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
                        <el-form label-width="200px" v-if="teamInfor.team_certification" label-position="left">
                            <el-form-item label="企业名称：">
                                <p>{{teamInfor.company_name}}</p>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码或注册号：">
                                <p>{{teamInfor.team_certification.id_number}}</p>
                            </el-form-item>
                            <el-form-item label="营业执照扫描件：">
                                <el-image :src="teamInfor.team_certification.business_license" alt=""></el-image>
                            </el-form-item>
                            <span class="line"></span>
                            <el-form-item label="联系人：">
                                <p>{{teamInfor.team_certification.contact_name}}</p>
                            </el-form-item>
                            <el-form-item label="联系方式：">
                                <p>{{teamInfor.team_certification.phone}}</p>
                            </el-form-item>
                            <el-form-item label="身份证照：" style="width:100%">
                                <div class="flex-box imgs">
                                    <el-image :src="teamInfor.team_certification.id_front" ></el-image>
                                    <el-image :src="teamInfor.team_certification.id_reverse" ></el-image>
                                </div>
                            </el-form-item>

                        </el-form>

                    </div>
                </section>

            </div>
        </el-drawer>
        <to-review v-if="toReviewShow" ref="refToReview" :teamId="teamId" @cancel="hideReviewShow"></to-review>

    </div>
</template>
  
<script>
import ToReview from './to-review.vue';
import { getData, postData } from "@/api/user";
export default {
    // name:'checkQuestion',
    props: ['teamId'],
    components: {
        ToReview
    },
    data() {
        return {
            listLoading:false,
            toReviewShow: false,
            teamInfor: [],
        }

    },
    created() {
        this.teamDetail()
      

    },
    methods: {
    getUserinfo() {
        getData({
            url: "/login/get_userinfo",
        }).then((res) => {
            if (res.code==200 &&res.data?.info) {
            this.$store.commit("setUserInfo",res.data.info);
            }
      });
    },
    
    hideReviewShow (){
        this.toReviewShow=false
        this.$emit("cancel", {});
    },
        cancel() {
            this.$emit("cancel", {});
        },
        // 审核通过
        agressAuth() {
            this.listLoading = true
            postData({
                url: "/workbech/admin_workbench/team/update_status",
                data: {
                    team_id: this.teamId,
                    status: '审核通过',
                    reason: ''
                }
            }).then((res) => {
                this.listLoading = false
                if (res.code == 200) {
                    this.$success(res.data.msg)
                    this.getUserinfo()
                    this.$emit("cancel", {});
                }
            }).catch((err) => {
                this.listLoading = false
            })
        },
        // 团队详情
        teamDetail() {
            getData({
                url: "/workbech/admin_workbench/team/detail/" + this.teamId,

            }).then((res) => {
                this.teamInfor = res.data.info
            }).catch((err) => {

            })
        },

    },

}
</script>
  
<style lang="less" scoped>
.check-task {
    .line{
        width: 7rem;
        display: inline-block;
        height: 0.01rem;
        background: #EBEBEB;
        margin:0.3rem 0 ;
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

                svg {
                    margin-right: 0.1rem;
                }

                h4 {

                    font-size: 0.14rem;
                    color: #CB781F;
                }

                .btns {
                    .el-button {
                        padding: 0.06rem 0.12rem;
                    }

                    .success {
                        color: #22A727;
                        background: #EEFFE6 !important;
                        border: 1px solid #EEFFE6 !important;
                    }

                    .fail {
                        color: #FF1D00;
                        background: #FFEBEB !important;
                        border: 1px solid #FFEBEB !important;
                    }


                }

            }

            .el-form {
                padding-left: 0.3rem;
            }

            .el-form-item {

                // width: 48%;
                img {
                    width: 2rem;
                    height: 1.6rem;
                    border-radius: 0.02rem;
                    margin-right: 0.2rem;

                }

                /deep/.el-form-item__label{
                    text-align: inherit !important;
                    text-align-last:inherit !important;
                }
            }


        }


    }
}
</style>