<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">审核失败</h4>
            <div> 
                 <el-form ref="questionForm" :model="questionForm" label-width="90px" class="form-wrap" :inline="true" label-position="right">
                    <el-form-item label="原因：" prop="reason">
                        <textarea name="" id="" class="ques-desc" v-model="questionForm.reason"></textarea>
                    </el-form-item>
                 
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="agressAuth">确定</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>

        </el-drawer>
    </div>
</template>
  
<script>
import { postData } from "@/api/user";
export default {
    props:['userId'],
    data() {
        return {
            questionForm:{reason:''},
            switchVal:true,
        }

    },
    created() {
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        agressAuth(){
            postData({
                url: "/workbech/admin_workbench/user/update_status" ,
                data:{
                    user_id:this.userId,
                    status:'审核失败',
                    reason:this.questionForm.reason
                }
            }).then((res) => {
                if(res.code==200){
                    this.$success(res.data.msg)
                    this.$emit("cancel", {});
                }
            }).catch((err) => {

            })
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


    }
    
    
}
</style>