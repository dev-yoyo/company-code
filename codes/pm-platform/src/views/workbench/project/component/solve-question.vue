<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">解决问题</h4>
            <div>
                <el-form ref="questionForm" :rules="rules" :model="questionForm" label-width="100px" class="form-wrap"
                    :inline="true" label-position="right">
                    <el-form-item label="处理方案：" prop="answer">
                        <textarea name="" id="" class="ques-desc" v-model="questionForm.answer"></textarea>
                    </el-form-item>
                    <el-form-item label="处理图片：" style="width:100%">
                        <el-upload class="upload-demo upload-quesimg" action="" drag :show-file-list="false"
                            :http-request="imgUpload" :file-list="file">
                            <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                                <use xlink:href="#icon-qj-psj"></use>
                            </svg>
                            <div class="el-upload__text">上传图片，或直接拖拽图片</div>
                        </el-upload>

                    </el-form-item>
                    <div class="img-list">
                        <div v-for="(item, index) in questionForm.answer_pic" :key="index">
                            <el-image :src="item" :alt="item" class="up-img"></el-image>
                            <div class="delete-img" @click="deleteImg(index)">
                                <i class="iconfont icon-shanchu"></i>
                            </div>
                        </div>

                    </div>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="projectQuestionAnswer('questionForm')" :loading="listLoading" :disabled="listLoading">确定
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>

            </div>


        </el-drawer>
    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
export default {
    props: ['currentUrl', 'quesId'],
    data() {
        return {
            listLoading:false,
            questionForm: {
                project_question_id: '',
                answer: '',
                answer_pic: [],
                status: ''
            },
            file: [],
            imgs: [],
            rules: {
                answer: [
                    { required: true, message: '请输入处理方案', trigger: ['blur',] },
                ]
            },

        }

    },
    created() {
        this.questionForm.project_question_id = this.quesId
        console.log(this.questionForm.project_question_id, this.quesId);

    },
    methods: {
        // 解决问题
        projectQuestionAnswer(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.listLoading = !this.listLoading;

                    var data = this.questionForm
                    postData({
                        url: "workbech/" + this.currentUrl + "/project_question/answer",
                        data
                    }).then((res) => {
                        this.listLoading=!this.listLoading
                        if (res.code == 200) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                            this.$emit("cancel", {});
                        }
                    }).catch(err=>{
                        this.listLoading=!this.listLoading
                    })
                } else {
                    return false;
                }
            });





        },
        imgUpload(e) {
            let data = new FormData();
            data.append('file', e.file)
            let url = '/common/single';
            postData({ url, data }).then(res => {
                if (res.code == 200 && res.data.path_url) {
                    this.questionForm.answer_pic.push(res.data.path_url)
                    // this.$success(res.data.msg)
                }
            })
        },
        deleteImg(index) {
            this.questionForm.answer_pic.splice(index, 1)
        },
        cancel() {
            this.$emit("cancel", {});
        },
    },
    components: {
    },
}
</script>
  
<style lang="less" scoped>
.add {
    padding: 0.08rem 0.65rem 0;


    .title {
        margin-bottom: 0.28rem;
    }

    .el-select-w5 {
        width: 5rem;
    }

    .form-wrap {
        position: relative;

        .el-form-item {
            margin-bottom: 0.2rem;
        }

        .img-list {
            position: relative;
            overflow: hidden;
            display: flex;
            align-self: center;
            flex-wrap: wrap;
            padding-left: 1rem;

           > div {
                position: relative;
                margin-right: 0.2rem;
            }

            .up-img {
                position: relative;
                width: 1rem;
                height:1rem;
               
            }

            .delete-img {
                width: 100%;
                height: 0.18rem;
                text-align: center;
                position: absolute;
                bottom: 0rem;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                vertical-align: middle;
                font-size: 0.1rem;

            }
        }


        .module-center {
            width: 6rem;
            margin: 0.4rem auto 0;
            text-align: center;

            .el-button {
                width: 1.82rem;
            }
        }

        .ques-desc {
            width: 5.02rem;
            height: 1.44rem;
            border-radius: 0.04rem;
            resize: none;
            border: 1px solid #DCDFE6;
            outline: none;
            padding: 0.2rem;

        }

        .upload-quesimg {
            border: 1px solidr red;
        }

        /deep/.upload-quesimg .el-upload-dragger {

            width: 5.01rem;
            height: 0.85rem;
            padding: 0.2rem;

        }

        /deep/.el-form-item__content {
            line-height: inherit;
        }

        .el-upload__text {
            color: #B4BFD6;
        }

    }


}
</style>