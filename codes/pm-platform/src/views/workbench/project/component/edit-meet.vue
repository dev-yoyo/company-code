<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">编辑会议</h4>
            <div>
                <el-form ref="meetForm" :model="meetForm" label-width="100px" class="form-wrap" :inline="true"
                    :rules="rules" label-position="right">
                    <el-form-item label="会议主题：" prop="theme">
                        <textarea name="" id="" class="ques-desc" v-model="meetForm.theme"></textarea>
                    </el-form-item>
                    <el-form-item label="会议链接：" style="width:100%" prop="url">
                        <el-input placeholder="http://" class="el-select-w5" v-model="meetForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="参会人员" style="width:100%" prop="join_user_id">
                        <el-select v-model="meetForm.join_user_id" placeholder="请选择" class="el-select-w5" multiple
                            clearable>
                            <el-option v-for="(item,index) in selectOption.users_for_select" :key="index"  v-if="projShow"
                                :label="item.stage_name+(item.name!=null? '（' +item.name+'）':'')" :value="item.id"></el-option>
                                <el-option v-for="(item,index) in selectOption.users_for_select" :key="index" v-if="!projShow"
                                :label="item.stage_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间:" prop="start_time">
                        <el-date-picker v-model="meetForm.start_time" type="datetime"
                            start-placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsStart">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="confirmMeet('meetForm')">确定</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>



        </el-drawer>
    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
    props: ['queryId', 'currentUrl', 'meetId', 'meetRow'],
    data() {
        return {
            meetForm: {
                project_meeting_id: '',
                join_user_id: [],
                theme: '',
                url: '',
                start_time: '',
                // end_time: '',
           
            },
            selectOption: [],
            rules: {
                theme: [
                    { required: true, message: '请输入会议主题', trigger: ['blur'] },
                ],
                url: [
                    { pattern:/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig,required: true, message: '请输入会议链接', trigger: ['blur'] },
                ],
                join_user_id: [
                    { required: true, message: '请选择参会人员', trigger: ['blur'] },
                ],
                start_time: [
                    { required: true, message: '请选择时间', trigger: ['blur'] },
                ],
            },
            pickerOptionsStart: {
                disabledDate: time => {
                    return (
                    time.getTime() < Date.now() - 8.64e7   
                    );
                }
            },
            projShow:""
        }

    },
    created() {
        this.projShow= (store.state.userInfo.role_id==1 ||store.state.userInfo.role_id==2)?true:false;
        this.projectMeetingIndex()
        this.meetForm.project_meeting_id = this.meetId
        this.meetForm.join_user_id = this.meetRow.join_user_id
        this.meetForm.theme = this.meetRow.theme
        this.meetForm.url = this.meetRow.url
        this.meetForm.start_time = this.meetRow.start_time


    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        // 下拉框
        projectMeetingIndex() {
            getData({
                url: "workbech/" + this.currentUrl + "/project_meeting/index/" + this.queryId,
            }).then((res) => {
                this.selectOption = res.data
            });

        },
        // 确认
        confirmMeet(formName) {
            var data= this.meetForm
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    postData({
                url: "workbech/" + this.currentUrl + "/project_meeting/update" ,
                data
            }).then((res) => {
                if (res.code==200) {
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
.add {
    padding: 0.08rem 0.65rem 0;

    .title {
        margin-bottom: 0.28rem;
    }

    .el-select-w5 {
        width: 5rem;
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