<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">添加项目案例</h4>
            <div> 
                <el-form ref="project" :model="project" label-width="100px" :rules="rules" class="form-wrap"  label-position="right">
                    <el-form-item label="项目名称：" prop="example[0].name">
                        <el-input v-model="project.example[0].name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="项目周期：" prop="example[0].period" class="width3">
                        <el-input v-model="project.example[0].period" placeholder="请输入" ></el-input><span>天</span>
                    </el-form-item>
                    <el-form-item label="项目类型：" style="width:100%" prop="example[0].type">
                        <el-select v-model="project.example[0].type" placeholder="请选择"  class="el-select-w5">
                            <el-option v-for="(item,index) in selectOption.type" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="演示网址：" prop="example[0].url">
                        <el-input v-model="project.example[0].url" placeholder="http://"></el-input>
                    </el-form-item>
                    <el-form-item label="项目描述：" prop="example[0].desc">
                        <textarea name="" id="" class="ques-desc" v-model="project.example[0].desc"></textarea>
                    </el-form-item>
                    <el-form-item label="图片：" style="width:100%" prop="example[0].pic">
                        <el-upload class="upload-demo upload-quesimg" action="" drag :show-file-list="false" :http-request="imgUpload" :file-list="file">
                            <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                                <use xlink:href="#icon-qj-psj"></use>
                            </svg>
                            <div class="el-upload__text">上传图片，或直接拖拽图片</div>
                        </el-upload>
                    </el-form-item>
                    <div class="img-list" >
                        <div v-for="(item,index) in project.example[0].pic" :key="index">
                            <img  :src="item" :alt="item" class="up-img">
                            <div class="delete-img" @click="deleteImg(index)" >
                                <i class="iconfont icon-shanchu"></i>
                            </div>
                        </div>
                        </div>
                    <el-form-item>
                        <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="projectQuestionStore('project')" :loading="listLoading" :disabled="listLoading">确定</el-button>
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
    props:[],
    data() {
        return {
           listLoading:false,
            project:
            {example: [{
                    name:"",
                    period:'',
                    type:'',
                    url:'',
                    desc:'',
                    pic:[]
             
              }]
            }
             ,
            selectOption:[],
            file: [],
            // 表单校验多层的案例
            rules:{
                'example[0].name': [
                    { required: true, message: '请输入项目名称', trigger: ['blur','change'] },
                ],
                'example[0].period': [
                    { required: true, message: '请输入项目周期', trigger: ['blur'] },
                ],
                'example[0].type': [
                    { required: true, message: '请选择项目类型', trigger: ['change'] },
                ],
                // 'example[0].url' : [
                //     { required: true, message: '请输入演示网址', trigger: ['change'] },
                // ],
                  'example[0].url' : [
                    { pattern:/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig, message: '请输入正确的演示网址', trigger: ['change'] },
                ],
                
                'example[0].desc': [
                    { required: true, message: '请输入项目描述', trigger: ['change'] },
                ],
                // 'example[0].pic': [
                //     {type:'array', required: true,message: '请上传图片', trigger: 'change' },
                // ],
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                    return (
                    time.getTime() < Date.now()- 8.64e7/*今天及之前*/
                    );
                }
            },
        }

    },
    created() {
        this.questionIndex()
        // this.example.project_id=this.queryId
    },
    methods: {
        projectQuestionStore(formName){
            var data= this.project
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.listLoading=!this.listLoading
                    postData({
                        url: "workbech/user_workbench/seniority/update",
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
                    this.project.example[0].pic.push(res.data.path_url)
                    // this.$success(res.data.msg)
                }
            })
        },
        // 删除图片
        deleteImg(index){
            this.project.example[0].pic.splice(index,1)
        },
           // 下拉框
    questionIndex() {
      this.tableListLoading=true
      getData({
        url: "workbech/user_workbench/seniority/index",
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
        .width3{
            .el-input{
                width: 3.2rem;
            }
            /deep/.el-input__inner{
            width: 3rem;
        }
        }
        /deep/.el-form-item__label{
            text-align: right !important;
            text-align-last:right !important;
        }
        /deep/.el-input__inner{
            width: 5rem;
            height: 0.32rem;
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
            height: 1rem;
           
        }
        .delete-img{
            width:100%;
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