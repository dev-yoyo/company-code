<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">编辑任务</h4>
            <div>
                <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="140px" class="form-wrap"
                    label-position="right">
                    <el-form-item label="任务名称：" prop="name">
                        <el-input class="el-select-w5" v-model="taskForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人：" prop="charge_user_id">
                        <el-select v-model="taskForm.charge_user_id" placeholder="请选择" class="el-select-w5">
                            <el-option v-for="item in taskList.users_for_select" :key="item.id" v-if="projShow"
                                :label="item.stage_name + (item.name != null ? '（' + item.name + '）' : '')"
                                :value="item.id"></el-option>
                            <el-option v-for="item in taskList.users_for_select" :key="item.id" v-if="!projShow"
                                :label="item.stage_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否关联上层任务：" prop="relative_last">
                        <div>
                            <el-switch active-color="#FF980B" v-model="taskForm.relative_last" active-value="是"
                                inactive-value="否">
                            </el-switch>
                        </div>
                    </el-form-item>
                    <el-form-item label="截止日期：" prop="timeVal">
                        <!-- value-format="yyyy-MM-dd HH:mm:ss"  -->
                        <el-date-picker style="width:5rem" v-model="taskForm.timeVal" type="daterange"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptionsStart">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="任务描述：" prop="desc">
                        <textarea name="" id="" class="ques-desc" v-model="taskForm.desc"></textarea>
                    </el-form-item>

                </el-form>
                <div class="module-center">
                    <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                    <el-button type="primary" class="confirm" @click="sure('taskForm')">确定</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
import { dateFormat } from "@/libs/util"
import store from '@/store'
export default {
    props: ['taskId', 'queryId', 'currentUrl', 'taskRow'],
    data() {
        return {
            taskForm: {
                project_task_id: '', //	是	string	任务id
                name: '', //		是	string	任务名称
                desc: '', //		是	string	任务描述
                charge_user_id: '', //		是	string	负责人
                start_time: '', //		是	string	开始时间
                end_time: '', //		是	string	结束时间
                relative_last: '否', //		是	string	是否关联
                timeVal: '',//时间段,
            },

            switchVal: true,
            taskList: [],
            rules: {
                name: [
                    { required: true, message: '请输入任务名称', trigger: ['blur',] },
                ],
                desc: [
                    { required: true, message: '请输入描述', trigger: 'change' }
                ],
                charge_user_id: [
                    { required: true, message: '请选择负责人', trigger: ['change'] },
                ],
                timeVal: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            //时间限制，符合日期先后顺序的实际情况
            pickerOptionsStart: {
                disabledDate: time => {
                    return (
                        time.getTime() < Date.now() - 8.64e7
                    );
                }
            },
            projShow: ""

        }

    },
    created() {
        this.projShow = (store.state.userInfo.role_id == 1 || store.state.userInfo.role_id == 2) ? true : false;
        this.projectTaskIndex()
        // 回显
        // this.taskForm=this.taskRow
        if (this.taskRow.start_time && this.taskRow.end_time) {
            this.taskForm.timeVal = [new Date(this.taskRow.start_time), new Date(this.taskRow.end_time)]
        }


        this.taskForm.project_task_id = this.taskId
        this.taskForm.name = this.taskRow.name
        this.taskForm.desc = this.taskRow.desc
        this.taskForm.charge_user_id = this.taskRow.charge_user_id
        this.taskForm.start_time = this.taskRow.start_time
        this.taskForm.end_time = this.taskRow.end_time
        this.taskForm.relative_last = this.taskRow.relative_last
        this.taskRow.relative_last == 0 ? this.taskForm.relative_last = '否' : this.taskForm.relative_last = '是'
        // relative_level_id 0 未关联 非0 已关联
        if (this.taskRow.relative_last == 0) {
            this.taskForm.relative_last = '否'
        } else {
            this.taskForm.relative_last = '是'
        }
    },
    methods: {

        // 确认添加
        sure(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.projectTaskUpdate()
                } else {
                    return false;
                }
            });
        },
        // 任务更新
        projectTaskUpdate() {
            this.taskForm.start_time = dateFormat(this.taskForm.timeVal[0])
            this.taskForm.end_time = dateFormat(this.taskForm.timeVal[1])
            // 关联上层任务转是否
            // if (this.taskForm.relative_laststr == true) {
            //     this.taskForm.relative_last = '是'
            // } else {
            //     this.taskForm.relative_last = '否'
            // }
            var data = this.taskForm
            postData({
                url: "/workbech/" + this.currentUrl + "/project_task/update/",
                data
            }).then((res) => {
                if (res.code == 200) {
                    this.$success(res.data.msg)
                    this.$emit("cancel", {});
                } else {

                }
            });
        },
        // 获取下拉框
        projectTaskIndex() {
            getData({
                url: "/workbech/" + this.currentUrl + "/project_task/index/" + this.queryId,
            }).then((res) => {
                this.taskList = res.data

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
.add {
    padding: 0.08rem 0.65rem 0;

    .title {
        margin-bottom: 0.28rem;
    }

    .el-select-w5 {
        width: 5rem;
    }

    .module-center {
        width: 6rem;
        margin: 0.4rem auto 0;
        text-align: center;

        .el-button {
            width: 1.82rem;
        }
    }

    .form-wrap {
        .task-gl {
            margin-left: 0.1rem;
            display: inline-block;
            color: #1B385C;
            font-size: 0.14rem;
            padding: 0.06rem 0.12rem;
            background: #F4F4F4;
        }

        .el-form-item {
            margin-bottom: 0.2rem;
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