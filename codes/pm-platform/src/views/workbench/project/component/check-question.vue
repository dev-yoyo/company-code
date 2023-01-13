<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false" v-loading="listLoading"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj active" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>查看</h4>
            <div class="task-c">
                <section class="top">
                    <div class="flex-center task-title">
                        <h4 class="color_1B385C">问题</h4>
                        <!-- <div class="btns" v-if="quesRow.is_delete!=1  && quesRow.status!='已解决' && projectBackStatus!='已终止'&& projectBackStatus!='已完结' ">
                            <el-button type="primary" @click="editQues" v-if="role_id==1||role_id==2">编辑</el-button>
                            <el-button type="primary" @click="TwistQues" v-if="role_id==1||role_id==2  || currentUserId==quesRow.charge_user_id">扭转</el-button>
                            <el-button type="primary" @click="solveQues" v-if="role_id==1||role_id==2 || currentUserId==quesRow.charge_user_id">解决</el-button>
                            <el-button @click="deleteQues(taskList)" v-if="role_id==1||role_id==2">删除</el-button>
                        </div> -->
                    </div>
                    <p class="color_333">问题描述：{{taskList.desc}}</p>
                    <div v-if="taskList.pic">
                        <!-- <img class="ques-img" v-for="(item,index) in taskList.pic" :key="index" :src="item" alt=""> -->
                        <el-image class="ques-img" v-for="(item,index) in taskList.pic" :src="item" :preview-src-list="taskList.pic" :key="index"></el-image>
                    </div>
                    <div class="flex-box mb">
                        <p class="color_666 flex-item"><span class="wid-j">处理人：</span><span
                                class="color_333" v-if="taskList.charge_user">{{taskList.charge_user.stage_name}} <span v-if="projShow && taskList.charge_user.name">（{{taskList.charge_user.name}}）</span> </span></p>
                        <p class="color_666 flex-item" v-if="taskList.copy_user_str"><span class="wid-j">抄送人：</span><span
                                class="color_333">{{taskList.copy_user_str}} </span></p>
                        <p class="color_666 flex-item"><span class="wid-j">问题类型：</span><span
                                class="color_333">{{taskList.type}}</span></p>
                        <p class="color_666 flex-item" v-if="taskList.degree_importance"><span class="wid-j">严重程度：</span><span class="color_333">{{taskList.degree_importance}}级</span>
                        </p>
                        <p class="color_666 flex-item" v-if="taskList.priority_level"><span class="wid-j">优先级：</span><span class="color_333">{{taskList.priority_level}}</span>
                        </p>
                        <p class="color_666 flex-item"><span class="wid-j">截止时间：</span><span
                                class="color_333">{{taskList.end_time}}</span></p>
                    </div>
                    <div class="solve-question task-title" v-if="taskList.answer">
                        <h4 class="color_1B385C">处理方案</h4>
                        <p class="color_333 ">{{taskList.answer}}</p>
                        <div v-if="taskList.answer_pic">
                            <!-- <img class="ques-img" v-for="(item,index) in taskList.answer_pic" :key="index" :src="item" alt=""> -->
                            <el-image class="ques-img" v-for="(item,index) in taskList.answer_pic" :src="item" :preview-src-list="taskList.answer_pic" :key="index"></el-image>
                        </div>
                    </div>
                </section>
                <section class="middle"  v-if="taskList.operation_logs !==undefined  &&taskList.operation_logs != null  && taskList.operation_logs.length > 0">
                    <div class="flex-center record-title">
                        <h4>历史记录</h4>
                        <svg class="icon active" aria-hidden="true">
                            <use xlink:href="#icon-qj-sx"></use>
                        </svg>
                        <span>
                            <svg class="icon active" aria-hidden="true" v-if="showAll">
                            <use xlink:href="#icon-qj-sq2" @click="(showAll=!showAll)"></use>
                        </svg>
                        <svg class="icon active" aria-hidden="true" v-if="!showAll">
                            <use xlink:href="#icon-qj-fk2" @click="(showAll=!showAll)"></use>
                        </svg>
                        </span>
                        
                    </div>
                    <div class="record-detail" v-if="showAll">
                        <ul class="record-list">
                            <li v-for="(item,index) in taskList.operation_logs" :key="index">
                                <p class="task-desc-svg">{{item.created_at}}由<span class="w-600">{{item.extra.user_name}}</span>{{item.extra.method_name}}   
                                    <span  v-if=" item.extra.data.length > 0"> 
                                        <svg class="icon active" aria-hidden="true"  @click="packUp(`table${item.id}`,'block', `open${item.id}`,`close${item.id}`)" :ref="'close'+item.id" >
                                            <use xlink:href="#icon-qj-sq2"></use>
                                        </svg>
                                        <svg class="icon " aria-hidden="true" @click="packUp(`table${item.id}`,'none',`open${item.id}`,`close${item.id}`)"  :ref="'open'+item.id">
                                            <use xlink:href="#icon-qj-fk2"></use>
                                        </svg>
                                    </span>
                                </p>
                                <div :ref="'table'+item.id" class="disN record-pro" :class="(item.extra.method_name=='更新进度'|| item.extra.method_name=='删除')?'active':''">
                                    <p class="on " v-for="(val,key) in item.extra.data" :key="key" >
                                        <span v-if="item.extra.method_name=='修改'">修改了</span>
                                        <span v-else-if="item.extra.method_name=='更新进度'">汇报任务</span>
                                        <span v-else-if="item.extra.method_name=='删除'">删除原因 </span>
                                        <span class="w-600"  v-if="val.field =='pic' || val.field =='answer_pic'">{{val.field_name}}，旧图为 
                                            <span v-for="(i,v) in val.old_name" :key="v">
                                                <img :src="i" alt=""  class="ques-img">
                                            </span>
                                            新图为
                                            <span v-for="(i,v) in val.new_name" :key="v">
                                                <img :src="i" alt=""  class="ques-img">
                                            </span>
                                        </span>
                                        <span class="w-600"  v-else>{{val.field_name}}，旧值为“{{val.old_name}}” ，新值为“{{val.new_name}}”</span>

                                    </p>

                                </div>
                             
                            </li>
                         

                        </ul>

                    </div>

                </section>
            </div>
           

        </el-drawer>
        <!-- <edit-question :currentUrl="currentUrl"  :queryId='queryId' :quesRow="quesRow" v-if="editQuesShow" @cancel="hideEditQues"></edit-question>
        <twist-question :currentUrl="currentUrl"  :quesRow="quesRow" :queryId='queryId'  v-if="twistQuesShow" @cancel="hideTwistQues"></twist-question>
        <solve-question v-if="solveQuesShow" :quesId="quesId" :currentUrl="currentUrl" @cancel="hideSolveQues"></solve-question> -->

    </div>
</template>
  
<script>
import TwistQuestion from './twist-question.vue';
import EditQuestion from './edit-question.vue';
import { postData, getData } from "@/api/user";
import SolveQuestion from './solve-question.vue';
import store from '@/store'
export default {
    components: {TwistQuestion,EditQuestion ,SolveQuestion},
    props:['currentUrl','quesId','quesRow','queryId'],
    data() {
        return {
            sqShow: true,
            openIndex: 0,
            showAll: true,
            twistQuesShow: false,
            solveQuesShow: false,
            editQuesShow:false,
            listLoading:true,
            taskList:[],
            role_id:'',
            currentUserId:'',
            projectBackStatus:'',
            projShow:""
        }

    },
    created() {
        this.projShow= (store.state.userInfo.role_id==1 ||store.state.userInfo.role_id==2)?true:false;
        this.role_id = store.state.userInfo.role_id
        this.currentUserId=  store.state.userInfo.id
        this.projectQuestionDetail()
        this.projectBackStatus = sessionStorage.getItem('projectBackStatus')
    },
    methods: {
        projectQuestionDetail(){
            this.listLoading=true;

      getData({
        url: "/workbech/"+this.currentUrl+"/project_question/detail/"+this.quesId,
      }).then((res) => {
        this.listLoading=false;
            this.taskList=res.data.info
      });

    },
        cancel() {
            this.$emit("cancel", {});
        },
        // 扭转问题
        TwistQues() {
            this.twistQuesShow = true
        },
        hideTwistQues() {
            this.twistQuesShow = false
            this.projectQuestionDetail()
        },
        // 编辑问题
        editQues(){
            this.editQuesShow=true
        },
        hideEditQues(){
            this.editQuesShow=false
            this.projectQuestionDetail()
        },
        // 解决问题
        solveQues() {
            this.solveQuesShow = true
        },
        hideSolveQues() {
            this.solveQuesShow = false
            this.projectQuestionDetail()
        },
    // 删除问题
    deleteQues(row) {
      this.$confirm("确定删除该问题吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(()=>{
        postData({
        url: "workbech/" + this.currentUrl + "/project_question/delete",
        data: { project_question_id: row.id }
      }).then((res) => {
        if (res.code == 200) {
          this.$success(res.data.msg)   
          this.$emit("cancel", {});
        }

      });
      }).catch((err)=>{
        return false
      })
    },
        // 收起
        packUp(item,display_,open,close){
           
this.$refs[item][0].style.display=display_
   if (display_=='none') {
       this.$refs[open][0].style.display='none'
    this.$refs[close][0].style.display='block'


   } else if (display_=='block'){
    this.$refs[open][0].style.display='block'
    this.$refs[close][0].style.display='none'
   
   }

       },
     
        finish() {
            this.$confirm("确定完成该里程碑吗？", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
            })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '确认成功!'
                    });
                })
                .catch((err) => { });
        }
    },
    components: {
    EditQuestion,
    TwistQuestion,
    SolveQuestion
},
}
</script>
  
<style lang="less" scoped>
.check-task {
    .task-desc-svg{
        display: flex;
    }
    .solve-question{
        border-top: 1px solid #ccc;
        padding: 0.2rem 0;
        
    }
    .ques-img{
        width: 0.5rem;
        height: 0.5rem;
        margin-right: 0.1rem;
    }
    svg.icon{
                width: 0.2rem;
                display: none;
              }
              svg.icon.active{
                display: block;
              }
    .task-c {
        width: 6.19rem;
        // height: calc(100%-1rem);

        background: linear-gradient(180deg, #EAF1F5 20%, #FFFFFF 50%);
        padding: 0.13rem 0.21rem 0;
        margin-top: 0.2rem;

        .top {
            min-height: 4rem;

            .flex-item {
                width: 2.5rem;
            }

            .task-title {
                // height: 0.4rem;
                margin-bottom: 0.05rem;

                .btns {

                    .el-button {
                        width: 0.53rem;
                        height: 0.32rem;
                        padding: 0;

                    }

                }

            }

            p {
                font-size: 0.14rem;
                margin-bottom: 0.08rem;

                .wid-j {
                    width: 0.7rem;
                    display: inline-block;
                    text-align: justify;
                    text-align-last: justify;
                }
            }

            .mb {
                width: 100%;
                margin-bottom: 0.5rem;
            }

            .process-time {
                width: 4rem;

                .taskprocess {
                    width: 2.5rem;
                }

                .edit-process {
                    padding: 0;
                    text-decoration: underline;
                }

            }
        }

        .middle {
            border-top: 0.01rem solid #E6E6E6;
            padding-top: 0.2rem;

            .record-title {
                width: 1.5rem;
                margin-bottom: 0.2rem;
            }

            .record-detail {
                font-size: 0.13rem;
                color: #666;

                .record-list {
                    li {
                        width: 100%;
                        margin-bottom: 0.15rem;
                        list-style: auto;
                        // list-style-position: inside;
                        margin-left: 0.2rem;

                        .record-desc {
                            padding: 0.12rem 0;

                        }
                        .record-pro{
                        width: 5.67rem;
                        padding: 0.07rem 0.16rem;
                        margin-top: 0.05rem;
                        p{
                            margin-bottom: 0.06rem;
                        }
                    }
                    .record-pro.active{
                        background: #F7F8FA;
                    }
                    }
                }

            }

        }
    }
}
</style>