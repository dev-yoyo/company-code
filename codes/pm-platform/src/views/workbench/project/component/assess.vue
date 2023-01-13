<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7.39rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>评价</h4>
            <div class="task-c">
                <section class="top">
                    <div class="assess">
                        <el-form label-width="95px" label-position="right" :inline="true" :rules="rules"
                            ref="assessForm" :data="assessForm" :model="assessForm">
                            <el-form-item label="用户名：" style="width: 50%;">
                                <p class="color_666"><span class="color_333">{{assessInfor.user.stage_name}}</span></p>
                            </el-form-item>
                            <el-form-item label="成员角色：" class="role">
                                <p class="color_666 "><span class="color_333">{{assessInfor.role}}</span></p>
                            </el-form-item>
                            <br />
                            <br />
                            <br />
                            <br />
                            <el-form-item label="评价：" class="pj" prop="star">
                                <el-rate v-model="assessForm.star"></el-rate>
                            </el-form-item>
                            <el-form-item label="评价描述：" prop="comment" class="comment">
                                <textarea class="assess-desc" v-model="assessForm.comment"></textarea>
                            </el-form-item>
                            <el-form-item>
                                <div class="module-center">
                                    <el-button class="canclel" @click="cancel()">取消</el-button>
                                    <el-button type="primary" class="confirm" @click="confirm('assessForm')">确定
                                    </el-button>
                                </div>
                            </el-form-item>
                        </el-form>


                    </div>
                </section>

            </div>
        </el-drawer>
    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
export default {
    // name:'checkQuestion',
    props: ['memberRow', 'currentUrl', 'queryId'],
    data() {
        return {
            assessForm: {
                project_id: '',
                object_id: '',
                object_type: '个人',//团队 个人 项目经理 被评价人身份
                star: 0,
                comment: ''

            },
            assessInfor: [],
            rules: {
                comment: [
                    { required: true, message: '请输入评价描述', trigger: ['change'] },
                ],
            }
        }
    },
    created() {
        console.log(this.memberRow);
        this.assessInfor = this.memberRow
        this.assessForm.project_id = this.queryId
        // this.assessForm.object_id = this.memberRow.id ||this.memberRow.manager_user_id
        this.assessForm.object_id = this.memberRow.user_id
        this.assessForm.object_type = this.memberRow.object_type
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },

        confirm(formName) {
            var data = this.assessForm
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    postData({
                        url: "/workbech/" + this.currentUrl + "/comment/store",
                        data
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$success(res.data.msg)
                            this.$emit("cancel", {});
                        }
                    });
                } else {
                    return false;
                }
            });

        }

    },
    components: {
    },
}
</script>
  
<style lang="less" scoped>
.check-task {

    .task-c {
        width: 6.19rem;
        height: calc(100%-1rem);

        background: linear-gradient(180deg, #EAF1F5 20%, #FFFFFF 50%);
        padding: 0.13rem 0.21rem 0;
        margin-top: 0.2rem;

        .role {
            margin-bottom: 0.2rem;
        }


        .top {
            height: 4rem;

            .assess {
                margin: 0.64rem 0;

             

                .el-form-item {
                    /deep/.el-form-item__content {
                        vertical-align: middle !important;
                    }


                    .module-center {
                        width: 6rem;
                        margin: 0.4rem auto 0;
                        text-align: center;

                        .el-button {
                            width: 1.82rem;
                        }
                    }
                }
                .comment {
                    /deep/.el-form-item__content {
                        vertical-align: top !important;

                    }
                }
                .assess-desc {
                    padding: 0.1rem;
                    outline: none;
                    resize: none;
                    width: 4.5rem;
                    height: 1.44rem;
                    border: 1px solid #D7DCE6;
                }
            }

        }

    }
}
</style>