<template>
    <div class="task-process">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>更新进度</h4>
            <div>
                <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left"
                    class="process-form">
                    <el-form-item prop="progress" label="当前进度：" class="username">
                        <el-input v-model="form.progress" placeholder="请输入" style=" width:90px" type="number"></el-input>
                        <span>%</span>
                    </el-form-item>
                    <el-form-item prop="progress_desc" label="进度说明：" class="password">
                        <textarea name="" id="" cols="100" rows="10" v-model="form.progress_desc"
                            class="process-explain"></textarea>
                    </el-form-item>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="updateProgress('form')" :loading="listLoading" :disabled="listLoading">确定</el-button>
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
    props: ["taskId",'currentUrl','taskRow'],
    data() {
        return {
            form: {
                progress: '',
                progress_desc: ''
            },
            rules: {
                progress: [
                    { required: true,max: 3,message: '请输入当前进度，最大数值为100', trigger: 'blur' },
                ],
                progress_desc: [
                    { required: true, message: '请输入进度描述', trigger: 'blur' }
                ],
            },
            listLoading: false,

        }

    },
    created() {
        this.form.progress=this.taskRow.progress
    },
    methods: {
        updateProgress(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if( this.form.progress<=0 ||this.form.progress>100 ){
                        this.$err('项目进度区间0-100，请重新输入！')
                        return false
                    }
                    this.listLoading=!this.listLoading
                      postData({
                        url: "/workbech/"+this.currentUrl+"/project_task/update_progress",
                        data:{ project_task_id:this.taskId,
                        progress:this.form.progress,
                        progress_desc:this.form.progress_desc
                    }
                    }).then((res) => {
                        this.listLoading=!this.listLoading
                        if(res.code==200){
                            this.$message({
                            message: res.data.msg,
                            type: 'success'
                            });
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
        cancel() {
            this.$emit("cancel", {});
        },
    },
    components: {
    },
}
</script>
  
<style lang="less" scoped>
.task-process {
    .process-explain {
        width: 5rem;
        height: 1.44rem;
        resize: none;
        border: 0.01rem solid #DBDBDB;
        outline: none;
        padding: 0.1rem;

    }

    .process-form {
        margin: 0.2rem 0;

        /deep/.el-input .el-input__inner {
            height: 0.32rem !important;
        }

        .el-form-item {
            margin-bottom: 0.21rem;
        }

        .module-center {
            text-align: center;
            margin-bottom: 0.4rem;

            .el-button {
                width: 1.82rem;
                height: 0.42rem;
            }
        }

    }

}
</style>