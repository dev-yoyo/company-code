<template>
    <div class="edit_c">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">添加成员</h4>
            <div>
                <el-form ref="memberForm" :model="memberForm" label-width="90px" :rules="rules" class="form-wrap"
                    label-position="right">
                    <el-form-item label=" 手机号：" prop="phone">
                        <el-input placeholder="请输入" @input="teamMemberSearch" v-model="memberForm.phone"></el-input>
                    </el-form-item>
                    <ul class="search-list" v-if="searchShow">
                        <li v-for="(item,index) in searchList" :key="index" @click="checkUser(item)">{{item.stage_name}} {{item.phone}}</li>
                    </ul>
                    <el-form-item label="姓名：" style="width:100%" prop="user_name">
                        <el-input placeholder="请输入" v-model="memberForm.user_name"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位：" prop="position">
                        <el-select  v-model="memberForm.position">
                            <el-option v-for="(item,index) in roleRow" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="teamMemberStore('memberForm')" :loading="listLoading" :disabled="listLoading">确定
                            </el-button>
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
    props:['roleRow'],
    data() {
        return {
            listLoading:false,
            memberForm: {
                phone: '',
                user_name: '',
                position: ''
            },
            rules: {
                phone: [
                    { required: true, message: '请输入手机号', trigger: ['change'] },
                ],
                user_name: [
                    { required: true, message: '请输入姓名', trigger: ['change'] },
                ],
                position: [
                    { required: true, message: '请输入岗位', trigger: ['change'] },
                ],
            },
          
            searchList:[],
            searchShow:false,
            posotion:[],
            user_id:''
           
        }

    },
    created() {
    },
    methods: {
        // 输入框绑定 搜索用户
        teamMemberSearch(){
            postData({
            url: "/workbech/team_workbench/team_member/search",
            data:{
                phone:this.memberForm.phone
            }
        }).then((res) => {
            if (res.code == 200) {
            this.searchList=res.data.list
            this.searchShow=true
            }

        });
        },
        // 点击 确认选中的用户
        checkUser(row){
            this.memberForm.phone=row.phone
            this.user_id=row.id
            this.searchShow=false
        },

// 确定提交接口
        teamMemberStore(formName) {
            var data = {
                user_id:this.user_id,
                user_name: this.memberForm.user_name,
                position:  this.memberForm.position
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.listLoading=!this.listLoading
                    postData({
                        url: "/workbech/team_workbench/team_member/store",
                        data
                    }).then((res) => {
                        this.listLoading=!this.listLoading
                        if (res.code == 200) {
                            this.$success(res.data.msg)
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
.edit_c {
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
        .search-list{
            position: absolute;
            background: #fafafa;
           
            font-size: 0.12rem;
           
            top: 1.2rem;
            left: 1.1rem;
            z-index: 99;
            li{
                color: #666;
                padding: 0.05rem 0.1rem;
            }
            li:hover{background: #ddd;
            }

        }

        .w50 {
            /deep/.el-input__inner {
                width: 2.04rem;
            }
        }

        .module-center {
            margin: 0.4rem auto 0;
            text-align: center;

            .el-button {
                width: 1.82rem;
            }
        }


    }


}
</style>