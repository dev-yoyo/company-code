<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">新增问题</h4>
            <div> 
                <el-form ref="questionForm" :model="questionForm" label-width="100px" :rules="rules" class="form-wrap" :inline="true" label-position="right">
                    <el-form-item label="问题描述：" prop="desc">
                        <textarea name="" id="" class="ques-desc" v-model="questionForm.desc"></textarea>
                    </el-form-item>
                    <el-form-item label="问题图片：" style="width:100%" prop="pic">
                        <el-upload class="upload-demo upload-quesimg" action="" drag :show-file-list="false" :http-request="imgUpload" :file-list="file">
                            <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                                <use xlink:href="#icon-qj-psj"></use>
                            </svg>
                            <div class="el-upload__text">上传图片，或直接拖拽图片</div>
                        </el-upload>
                    </el-form-item>
                    <div class="img-list" >
                        <div v-for="(item,index) in questionForm.pic" :key="index">
                            <el-image  :src="item" :alt="item" class="up-img"></el-image>
                            <div class="delete-img" @click="deleteImg(index)" >
                                <i class="iconfont icon-shanchu"></i>
                            </div>
                        </div>
                           
                    </div>
                    <el-form-item label="处理人：" style="width:100%" prop="charge_user_id">
                        <el-select v-model="questionForm.charge_user_id" placeholder="请选择"  class="el-select-w5">
                            <el-option v-for="(item,index) in selectOption.users_for_select" :key="index" :label="item.stage_name +( item.name!=null?'（'+item.name +'）':'')" :value="item.id" v-if="projShow"></el-option>
                            <el-option v-for="(item,index) in selectOption.users_for_select" :key="index" :label="item.stage_name" :value="item.id" v-if="!projShow"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="抄送人：">
                        <el-select v-model="questionForm.copy_user_id" placeholder="请选择"  class="el-select-w5" multiple clearable>
                            <el-option v-for="(item,index) in selectOption.users_for_select" :key="index" :label="item.stage_name +( item.name!=null?'（'+item.name +'）':'')" :value="item.id"  v-if="projShow"></el-option>
                            <el-option v-for="(item,index) in selectOption.users_for_select" :key="index" :label="item.stage_name" :value="item.id"  v-if="!projShow"></el-option>
                           
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型：" prop="type">
                        <el-select v-model="questionForm.type" placeholder="请选择" style="width:2rem">
                            <el-option v-for="(item,index) in selectOption.type" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="严重程度：" >
                        <el-select v-model="questionForm.degree_importance" placeholder="请选择"  style="width:2rem">
                            <el-option v-for="(item,index) in selectOption.degree_importance" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="优先级：" >
                        <el-select v-model="questionForm.priority_level" placeholder="请选择"  style="width:2rem">
                            <el-option v-for="(item,index) in selectOption.priority_level" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="截止日期：" prop="end_time">
                        <el-date-picker placeholder="截止日期" v-model="questionForm.end_time" type="date"
                            value-format="yyyy-MM-dd HH:mm:ss" style="width:2rem" :picker-options="pickerOptionsEnd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="projectQuestionStore('questionForm')" :loading="listLoading" :disabled="listLoading">确定</el-button>
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
            listLoading :false,
            questionForm:{
                project_id:'', //	是	string	项目id
                desc	:'', //	是	string	问题描述
                pic	:[], //	否	string	问题图片
                charge_user_id:'',//处理人
                copy_user_id	:[], //	否	string	抄送人
                type	:'', //	否	string	类型
                degree_importance	:'', //	否	string	严重程度
                priority_level	:'', //	否	string	优先级
                end_time	:'', //	否	string	截止时间
            },
            selectOption:[],
            file: [],
            rules:{
                desc: [
                    { required: true, message: '请输入问题描述', trigger: ['blur'] },
                ], 
                pic: [
                    { required: true, message: '请上传图片', trigger: ['blur'] },
                ],
                charge_user_id: [
                    { required: true, message: '请选择处理人', trigger: ['blur'] },
                ],
                type: [
                    { required: true, message: '请选择问题类型', trigger: ['blur'] },
                ],
                end_time: [
                    { required: true, message: '请选择日期', trigger: ['blur'] },
                ],
            },
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
        this.questionIndex()
        this.questionForm.project_id=this.queryId
    },
    methods: {
        projectQuestionStore(formName){
           
            var data= this.questionForm
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.listLoading=!this.listLoading
                postData({
                    url: "workbech/"+this.currentUrl+"/project_question/store",
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
                } else {
                    return false;
                }
            });

        },
        cancel() {
            this.$emit("cancel", {});
        },
        // 图片上传
        imgUpload(e) {
            let data = new FormData();
            data.append('file', e.file)
            let url = '/common/single';
            postData({ url, data }).then(res => {
                if (res.code == 200 && res.data.path_url) {
                    this.questionForm.pic.push(res.data.path_url)
                    // this.$success(res.data.msg)
                }
            })
        },
        // 删除图片
        deleteImg(index){
            this.questionForm.pic.splice(index,1)
        },
           // 下拉框
    questionIndex() {
      this.tableListLoading=true
      getData({
        url: "workbech/" + this.currentUrl + "/project_question/index/" + this.queryId,
      }).then((res) => {
        this.selectOption = res.data
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
        .img-list{
            position: relative;
            overflow: hidden;
            display: flex;
            align-self: center;
            flex-wrap: wrap;
            padding-left: 1rem;
            margin-bottom: 0.1rem;
                >div{
                    position: relative;
                    margin-right: 0.2rem;
                }
            .up-img{
            position: relative;
            width: 1rem;
            height:1rem;
          
            }
            .delete-img{
                width: 100%;
                height: 0.18rem;
                text-align: center;
                position: absolute;
                bottom: 0rem;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                vertical-align: middle;
                font-size: 0.1rem;

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