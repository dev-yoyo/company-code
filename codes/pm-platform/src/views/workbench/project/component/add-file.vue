<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">新建文件</h4>
            <div> 
                <el-form ref="fileForm" :model="fileForm" :rules="rules" label-width="100px" class="form-wrap" :inline="true" label-position="right">
                    <el-form-item label="文件名称：" prop="name">
                        <el-input  placeholder="请输入" class="el-select-w5" v-model="fileForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="要求：" style="width:100%" prop="demand">
                        <textarea name="" id="" class="ques-desc" v-model="fileForm.demand"></textarea>
                    </el-form-item>
                    <el-form-item label="执行人" style="width:100%" prop="charge_user_id">
                        <el-select v-model="fileForm.charge_user_id" placeholder="请选择"  class="el-select-w5">
                            <el-option v-for="(item, index) in selectOption" :key="index" :label="item.stage_name+(item.name!=null? '（' +item.name+'）':'')" :value="item.id" v-if="projShow"></el-option>
                            <el-option v-for="(item, index) in selectOption" :key="index" :label="item.stage_name" :value="item.id" v-if="!projShow"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交付时间:" prop="time">
                        <el-date-picker style="width:2rem" 
                            v-model="fileForm.time"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期" :picker-options="pickerOptionsEnd">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="projectDocumentStore('fileForm')" :loading="listLoading" :disabled="listLoading">确定</el-button>
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
    props:['queryId','currentUrl'],
    data() {
        return {
            listLoading:false,
            fileForm:{
                project_id:'',
                name:'',
                demand:'',
                charge_user_id:'',
                time:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入文件名称', trigger: ['blur'] },
                ], 
                demand: [
                    { required: true, message: '请输入要求', trigger: ['blur'] },
                ], 
                charge_user_id: [
                    { required: true, message: '请选择执行人', trigger: ['blur'] },
                ], 
                time: [
                    { required: true, message: '请选择时间', trigger: ['blur'] },
                ] 

            },
            selectOption:[],
            pickerOptionsEnd: {
                disabledDate: time => {
                    return (
                    time.getTime() < Date.now()- 8.64e7/*今天及之前*/
                    );
                }
            },
            projShow:""
            
        }

    },
    created() {
        this.projShow= (store.state.userInfo.role_id==1 ||store.state.userInfo.role_id==2)?true:false;
        this.fileForm.project_id=this.queryId
        this.projectDocumentIndex()
    },
    methods: {
        // 确定
        projectDocumentStore(formName){
            this.listLoading = !this.listLoading ;
            var data= this.fileForm
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    postData({
                        url: "workbech/"+this.currentUrl+"/project_document/store",
                        data
                    }).then((res) => {
                        this.listLoading = !this.listLoading ;
                    if (res.code==200) {
                        this.$success(res.data.msg)
                        this.$emit("cancel", {});
                    } 
                    }).catch(err=>{
                        this.listLoading = !this.listLoading ;

                    })
                } else {
                    return false;
                }
            });
        },
              // 下拉框  
    projectDocumentIndex() {
      getData({
        url: "workbech/" + this.currentUrl + "/project_document/index/" + this.queryId,
      }).then((res) => {
        this.selectOption=res.data.users_for_select
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
            width:6rem;
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