<template>
    <div class="edit_c">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">编辑</h4>
            <div> 
                <el-form ref="cilentForm" :model="cilentForm" label-width="100px" class="form-wrap" :inline="true" label-position="right" :rules="rules">
                    <el-form-item label=" 客户名称" prop="name">
                        <el-input  placeholder="请输入" class="el-select-w5" v-model="cilentForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="客户简称：" style="width:100%"  class="w50" prop="abbr">
                        <el-input  placeholder="请输入"  v-model="cilentForm.abbr"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人：" class="w50" prop="contact_name">
                        <el-input  placeholder="请输入" v-model="cilentForm.contact_name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式："  class="w50" prop="contact_phone">
                        <el-input  placeholder="请输入" v-model="cilentForm.contact_phone"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账号："  class="w50" prop="account">
                        <el-input  placeholder="请输入" v-model="cilentForm.account"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码："  class="w50" prop="password">
                        <el-input  placeholder="请输入" v-model="cilentForm.password"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="confilrm('cilentForm')">确定</el-button>
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
    props:['userInfor'],
    data() {
        return {
            switchVal:true,
            listLoading:true,
             cilentForm:{
                customer_id :'',// 	是	string	客户id
                name :'',// 	是	string	客户名称
                abbr :'',// 	是	string	简称
                contact_name :'',// 	是	string	联系人
                contact_phone :'',// 	是	string	联系方式
                account :'',// 	是	string	账号
                password :'',// 	是	string	密码
            },
            rules: {
                name: [
                    { required: true, message: '请输入客户名称', trigger: 'blur' },
                ],
                abbr: [
                    { required: true, message: '请输入客户简称', trigger: 'blur' },
                ],
                contact_name: [
                    { required: true, message: '请输入联系人', trigger: 'blur' },
                ],
                contact_phone: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' },
                ],
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],

           }
        }
    },
    created() {
this.cilentForm=this.userInfor
this.cilentForm.customer_id=this.userInfor.id
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        confilrm(formName){
            this.$refs[formName].validate((valid) => {
          if (valid) {
            this.customerUpdate()
          } else {
            return false;
          }
        });

        },
        customerUpdate(){
            this.listLoading=true
            var data=this.cilentForm
            postData({
                url: "/workbech/admin_workbench/customer/update/",
                data
            }).then((res) => {
                if(res.code==200){
                    this.$success(res.data.msg)
                    this.$emit("cancel", {});
                }
            });
            
        }
    },
}
</script>
  
<style lang="less" scoped>
.edit_c {
    // /deep/.drawer_box .el-drawer__body{
    //     padding: 0.8rem 0.6rem 0;
    // }
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
        .w50{
            /deep/.el-input__inner{
                width: 2.04rem;
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


    }
    
    
}
</style>