<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">问题扭转</h4>
            <div> 
                <el-form ref="questionForm" :model="questionForm" label-width="130px"  class="form-wrap" label-position="right" :rules="rules">
                    <el-form-item label="指派新处理人：" prop="charge_user_id" >
                        <el-select v-model="questionForm.charge_user_id" placeholder="请选择"  style="width:2rem">
                            
                            <el-option v-for="(item,index) in selectOption" :key="index" :label="item.stage_name +(item.name!=null? '（'+item.name+'）':'')" :value="item.id" v-if="projShow"></el-option>
                            <el-option v-for="(item,index) in selectOption" :key="index" :label="item.stage_name" :value="item.id" v-if="!projShow"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题描述" prop="reverse_reason"> 
                        <textarea name="" id="" class="ques-desc" v-model="questionForm.reverse_reason"></textarea></el-form-item>
                    
                    <el-form-item label="截止日期:" prop="end_time">
                        <el-date-picker placeholder="请选择时间" v-model="questionForm.end_time"      type="date" style="width:2rem" value-format="yyyy-MM-dd HH:mm:ss" >
                        </el-date-picker>
                    </el-form-item>
                   
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="confirm('questionForm')" :loading="listLoading" :disabled="listLoading">确定</el-button>
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
    props:['quesRow','queryId','currentUrl'],
    data() {
        return {
            listLoading:false,
            questionForm:{
                project_question_id:'',
                charge_user_id:'',
                reverse_reason:'',
                end_time:''
            },
            rules:{
                charge_user_id: [
                    { required: true, message: '请选择新处理人', trigger: ['blur'] },
                ], 
                reverse_reason: [
                    { required: true, message: '请输入问题描述', trigger: ['blur'] },
                ], 
                end_time: [
                    { required: true, message: '请输入截止日期', trigger: ['blur'] },
                ], 
            },
            selectOption:[],
            projShow:''
        }

    },
    created() {
        this.projShow = (store.state.userInfo.role_id == 1 || store.state.userInfo.role_id == 2) ? true : false;
        this.questionForm.project_question_id=this.quesRow.id
        this.questionIndex()
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        confirm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
      this.twistQues()
                } else {
                    return false;
                }
            });
        },

        twistQues(){
            this.listLoading=!this.listLoading
            var data=this.questionForm
            postData({
                url: "/workbech/"+this.currentUrl+"/project_question/reverse",
                data
            }).then((res) => {
                this.listLoading=!this.listLoading
                if (res.code==200) {
                this.$success(res.data.msg)
                this.$emit("cancel", {});
            } 
            }).catch(err=>{
                this.listLoading=!this.listLoading
            })
        },
           // 下拉框
    questionIndex() {
      this.tableListLoading=true;
      getData({
        url: "workbech/" + this.currentUrl + "/project_question/index/" + this.queryId,
      }).then((res) => {
        this.selectOption = res.data.users_for_select
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
    .title{
        margin-bottom: 0.28rem;
    }
    .el-select-w5{
        width: 5rem;
    }
    .form-wrap{
        .el-form-item{
            margin-bottom: 0.2rem;
        }
        .module-center{
            margin:  0.4rem auto 0;
            text-align: center;
            .el-button{
                width: 1.82rem;
            }
        }
       .ques-desc {
            width: 5.02rem;
            height: 1.44rem;
            border-radius: 0.04rem;
            resize: none;
            border: 1px solid #DCDFE6 ;
            outline: none;
            padding: 0.2rem;
           
        }
        /deep/.upload-quesimg .el-upload-dragger{
            width: 5.01rem;
       height: 0.85rem;
       padding: 0.2rem;

        }
        /deep/.el-form-item__content{
            line-height: inherit;
        }
        .el-upload__text{
            color:#B4BFD6;
        }

    }
    
    
}
</style>