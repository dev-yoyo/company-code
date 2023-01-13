<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false" v-loading="listLoading">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>查看</h4>
            <div class="task-c">
                <section class="top">
                    <div class="flex-center task-title">
                        <h4 class="color_1B385C">文件信息</h4>
                    </div>
                    <p class="color_333 w-600">{{taskList.name}}</p>
                    <p class="color_333 mb">
                        {{taskList.demand}}
                    </p> 
                    <div class="tj-status-btn">
                        <el-button :class="taskList.status=='未提交'? 'wtj':'ytj'" >{{taskList.status}}</el-button>
                    </div>
                   
                        <p class="color_666 flex-item"><span class="wid-j">执行人：</span><span
                                class="color_333" v-if="taskList.charge_user">{{taskList.charge_user.stage_name}}</span><span v-if="projShow && taskList.charge_user.name">（{{ taskList.charge_user.name }}）</span> </p>
                        <p class="color_666 flex-item"><span class="wid-j">交付时间：</span><span
                                class="color_333">{{taskList.time}}</span></p>
                </section>
               
            </div>

        </el-drawer>
        <edit-file   :queryId='queryId' :currentUrl="currentUrl" :fileRow="fileRow" v-if="editFileShow" ref="refEditFile" @cancel="hideEditFile"></edit-file>
    </div>
</template>
  
<script>
import EditFile from './edit-file.vue';
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
    props:['fileId','currentUrl','queryId','fileRow'],
    data() {
        return {
            editFileShow:false,
            listLoading:true,
            taskList:[],
            role_id:'',
            projectBackStatus:'',
            projShow:""
        }

    },
    created() {
        this.projShow= (store.state.userInfo.role_id==1 ||store.state.userInfo.role_id==2)?true:false;
        this.role_id = store.state.userInfo.role_id
        this.projectDocumentDetail()
        this.projectBackStatus = sessionStorage.getItem('projectBackStatus')
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        // 扭转问题
     
        EditFile() {
            this.editFileShow = true
        },
        hideEditFile() {
            this.editFileShow = false
        },
      // 详情
      projectDocumentDetail(){
            this.listLoading=true;
            getData({
                url: "/workbech/"+this.currentUrl+"/project_document/detail/"+this.fileId,
            }).then((res) => {
                this.listLoading=false;
                this.taskList=res.data.info
            });
        },
        deleteFile(id){
            this.$confirm('确认要删除该文件吗', '提示', {
        }).then(() => {
            postData({
                url: "/workbech/"+this.currentUrl+"/project_meeting/delete",
                data:{project_document_id:id}
            }).then((res) => {
              if (res.code==200) {
                this.$success(res.data.msg)
                this.$emit("cancel", {});
                
              } else {
                
              }
         });
       
        }).catch((err) => {
               
        });

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
                    this.finishShow = false
                })
                .catch((err) => { });
        }
    },
    components: {
        EditFile
    },
}
</script>
  
<style lang="less" scoped>
.check-task {
    .task-c {
        width: 6.19rem;
        height: 2.54rem;

        background: linear-gradient(180deg, #EAF1F5 20%, #FFFFFF 50%);
        padding: 0.13rem 0.21rem 0;
        margin-top: 0.2rem;
        .module-center{
            width:6rem;
            margin:  0.6rem auto 0;
            text-align: center;
            .el-button{
                width: 1.82rem;
            }
        }

        .top {
            height: 4rem;
            .tj-status-btn{
                margin-bottom: 0.36rem;
                .el-button{
                    width: 0.65rem;
                    padding: 0.04rem 0.13rem;
                  color: #fff;
                  font-size: 0.13rem;
                }
                .wtj{
                    background: #FF980B;
                }
                .ytj{
                    background: #0EB200;
                }
            }

            .flex-item {
                width: 2.5rem;
            }

            .task-title {
                height: 0.4rem;
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

                        .record-pro {
                            width: 5.67rem;
                            background: #F7F8FA;
                            padding: 0.07rem 0.16rem;
                            margin-top: 0.05rem;

                            p {
                                margin-bottom: 0.05rem;
                            }

                        }
                    }
                }

            }

        }
    }
}
</style>