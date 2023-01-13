<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">招募</h4>
            <div> 
                <el-form ref="recruitForm" :rules="rules" :model="recruitForm" label-width="100px" class="form-wrap" :inline="true" label-position="right">
                    <el-form-item label="角色：" prop="role" v-if="zmType=='user'">
                        <el-select v-model="recruitForm.role" placeholder="请选择"  class="el-select-w5">
                            <el-option v-for="(item,index ) in selectOption.role" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="竞价区间：" prop="price_low">
                        <div class="jq-stage">
                            <el-input v-model="recruitForm.price_low" placeholder="￥0.00"></el-input> 
                            <span class="line">───</span> 
                            <el-input  placeholder="￥0.00" v-model="recruitForm.price_high" ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="技能要求：" style="width:100%" prop="request_skill">
                        <el-select v-model="recruitForm.request_skill" placeholder="请选择"  class="el-select-w5" multiple clearable :multiple-limit="5">
                            <el-option v-for="(item,index ) in selectOption.skill" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="等级要求：" style="width:100%" prop="request_level">
                        <el-input placeholder="请输入" v-model="recruitForm.request_level"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="confirm('recruitForm')" :loading="listLoading" :disabled="listLoading">确定</el-button>
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
    props:['queryId','currentUrl','zmType'],
    data() {
        return {
            listLoading:false,
            recruitForm:{
                project_id:''  ,
                role:'',
                price_low:'',
                price_high:'',
                request_level:'',
                request_skill:[],
            },
            rules:{
                role: [
                    { required: true, message: '请选择角色', trigger: ['blur'] },
                ],
                price_low: [
                    { required: true, message: '请输入最低价格', trigger: ['blur'] },
                ],
                price_high: [
                    { required: true, message: '请输入最高价格', trigger: ['blur'] },
                ],
                request_level: [
                    { required: true, message: '请选择技能', trigger: ['blur'] },
                ],
                request_skill: [
                    { required: true, message: '请选择等级', trigger: ['blur'] },
                ],
            },
            selectOption:[]
        }
    },
    created() {
        this.recruitForm.project_id=this.queryId
        this.getSelection();//下拉框
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        confirm(formName){
           
            this.$refs[formName].validate((valid) => {
                var data=this.recruitForm
                if (valid) {
                    this.listLoading= !this.listLoading
                    postData({
                        url: "/workbech/"+this.currentUrl+"/project_member/store_"+this.zmType+"_bidding",
                        data
                    }).then((res) => {
                        this.listLoading=!this.listLoading
                        if (res.code == 200) {
                            this.$success(res.data.msg)   
                            this.$emit("cancel", {});
                        } else {

                        }
                    }).catch(err=>{
                        this.listLoading=!this.listLoading
                    })

                } else {
                    return false;
                }
            });
        },
        getSelection(){
            getData({
                url: "workbech/" + this.currentUrl + "/project/get_add_select" ,
            }).then((res) => {
                this.selectOption=res.data
             
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
    .title{
        margin-bottom: 0.28rem;
    }
    .el-select-w5{
        width: 5rem;
    }
    .form-wrap{
        .el-form-item{
            margin-bottom: 0.2rem;
            .jq-stage{
                .el-input{
                    width: 2.25rem;
                }
                .line{
                    display: inline-block;
                    color: #D9D9D9;
                    margin: 0 0.15rem;
                }
            }
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