<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">编辑里程碑</h4>
            <div>
                <el-form ref="mileStoneForm" :model="mileStoneForm" label-width="110px" :rules="rules" class="form-wrap" label-position="right">
                    <el-form-item label="里程碑名称：" prop="name">
                        <el-input class="el-select-w5" clearable v-model="mileStoneForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="优先级：" prop="priority_level">
                        <el-select v-model="mileStoneForm.priority_level" clearable placeholder="请选择" class="el-select-w5">
                            <el-option v-for="(item, index) in selectListOption.priority_level" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="执行人：" prop="charge_user_ids">
                        <el-select multiple clearable v-model="mileStoneForm.charge_user_ids" placeholder="请选择"
                            class="el-select-w5" >
                            <el-option  v-for="(item, index) in selectListOption.users_for_select" :key="index" :label="item.stage_name +( item.name!=null?'（'+item.name +'）':'')" :value="item.id"  v-if="projShow"></el-option>
                            <el-option  v-for="(item, index) in selectListOption.users_for_select" :key="index" :label="item.stage_name" :value="item.id"  v-if="!projShow"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="截止日期:" prop="end_time">
                        <el-date-picker placeholder="截止日期" v-model="mileStoneForm.end_time" type="date"
                            value-format="yyyy-MM-dd HH:mm:ss" style="width:2rem" :picker-options="pickerOptionsEnd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <textarea name="" id="" v-model="mileStoneForm.desc" class="ques-desc"></textarea>
                    </el-form-item>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="projectMilestoneUpdate('mileStoneForm')">确定</el-button>
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
    props: ['queryId', 'lcbId','currentUrl','miilStoneRow'],
    data() {
        return {
            mileStoneForm: {
                project_milestone_id: '',//	是	string	里程碑id
                name: '',//		是	string	里程碑名称
                desc: '',//		是	string	里程碑描述
                priority_level: '',//		是	string	里程碑优先级
                end_time: '',//		是	string	里程碑截止时间
                charge_user_ids: [],//		是	string	里程碑执行人
                // charge_users:[]
            },
            taskList: [],
            selectListOption: [],
            rules: {
                name: [
                    { required: true, message: '请输入里程碑名称', trigger: ['blur', 'change'] },
                ],
                priority_level: [
                    { required: true, message: '请选择优先级', trigger: ['blur', 'change'] },
                ],
                // desc: [
                //     { required: true, message: '请输入里程碑描述', trigger: 'change' }
                // ],
                charge_user_ids: [
                    { required: true, message: '请选择里程碑执行人', trigger: ['blur'] },
                ],
                end_time: [
                    { required: true, message: '请选择里程碑截止时间', trigger: 'change' }
                ],
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                if (this.mileStoneForm.end_time) {
                    return (
                    time.getTime() < Date.now()- 8.64e7/*今天及之前*/
                    );
                }
                }
            },
            projShow:""
        }
        

    },
    created() {
        this.projShow= (store.state.userInfo.role_id==1 ||store.state.userInfo.role_id==2)?true:false;
        this.projectMilestoneIndex()
        // this.mileStoneForm =this.miilStoneRow
        this.mileStoneForm.project_milestone_id=this.lcbId
     
        this.mileStoneForm.charge_user_ids=[]
        this.miilStoneRow.charge_users.map((item)=>{
            this.mileStoneForm.charge_user_ids.push(item.id)
            // this.mileStoneForm.charge_users.push(item.stage_name)
            
        })

        this.mileStoneForm.project_milestone_id=this.lcbId
        this.mileStoneForm.name=this.miilStoneRow.name
        this.mileStoneForm.desc=this.miilStoneRow.desc
        this.mileStoneForm.priority_level=this.miilStoneRow.priority_level
        this.mileStoneForm.end_time= new Date(this.miilStoneRow.end_time)
    },
    methods: {
        // 

        cancel() {
            this.$emit("cancel", {});
        },
        // 下拉框列表
        projectMilestoneIndex() {
            getData({
                url: "workbech/" + this.currentUrl + "/project_milestone/index/" + this.queryId,
            }).then((res) => {
                this.selectListOption = res.data;

            });

        },
        // 更新
        projectMilestoneUpdate(formName) {
            var data = {
                project_milestone_id:  this.mileStoneForm.project_milestone_id,//	是	string	里程碑id
                name:  this.mileStoneForm.name,//		是	string	里程碑名称
                desc:  this.mileStoneForm.desc,//		是	string	里程碑描述
                priority_level:  this.mileStoneForm.priority_level,//		是	string	里程碑优先级
                end_time:  this.mileStoneForm.end_time,//		是	string	里程碑截止时间
                charge_user_ids:  this.mileStoneForm.charge_user_ids,//		是	string	里程碑执行人
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    postData({
                        url: "/workbech/"+this.currentUrl+"/project_milestone/update/",
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
        .el-form-item {
            margin-bottom: 0.2rem;
        }

        .module-center {
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