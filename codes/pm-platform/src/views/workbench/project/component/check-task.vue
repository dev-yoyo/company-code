<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false"
            v-loading="listLoading">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj active" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>查看</h4>
            <div class="task-c">
                <section class="top">
                    <div class="flex-center task-title">
                        <h4>{{taskList.name}}</h4>
                        <!-- <div class="btns" v-if="taskRow.is_delete!=1 && taskRow.status!='已完成'&& taskRow.status!='逾期完成' && projectBackStatus!='已终止'&& projectBackStatus!='已完结'">
                            <el-button type="primary" v-if="role_id==1 ||role_id==2" @click="editTask(taskList.id)">编辑</el-button>
                            <el-button type="primary" v-if="role_id==1 ||role_id==2  || currentUserId==taskRow.charge_user_id" @click="processedit(taskList.id)">进度</el-button>
                            <el-button @click="deleteTask(taskList.id)"  v-if="role_id==1 ||role_id==2">删除</el-button>
                        </div> -->
                    </div>
                    <p class="color_333 mb">{{taskList.desc}}</p>
                    <p class="color_666" v-if="taskList.relative && taskList.relative.name"><span class="wid-j">关联：</span><span
                            class="color_1B4B84" v-if="taskList.relative">{{taskList.relative.name}}</span></p>
                    <p class="color_666"><span class="wid-j">责任人：</span><span
                            v-if="taskList.charge_user">{{taskList.charge_user.stage_name}} <span v-if="projShow && taskList.charge_user.name">（{{ taskList.charge_user.name}}）</span>  </span></p>
                    <p class="color_666"><span class="wid-j">起止时间：</span><span>{{taskList.start_time}}至</span><span>{{taskList.end_time}}</span></p>
                    <div class="flex-box process-time">
                        <p class="color_666 flex-center"><span class="wid-j">进度：</span>
                            <el-progress :percentage="taskList.progress" class="taskprocess"
                                :color="[{color:'#0268F9'}]"></el-progress>
                        </p>
                    </div>
                </section>
                <section class="middle"
                    v-if="taskList.operation_logs !==undefined  &&taskList.operation_logs != null  && taskList.operation_logs.length > 0">
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
                                <p class="task-desc-svg">{{item.created_at}}由<span
                                        class="w-600">{{item.extra.user_name}}</span>{{item.extra.method_name}}
                                    <span v-if=" item.extra.data.length > 0">
                                        <svg class="icon active" aria-hidden="true"
                                            @click="packUp(`table${item.id}`,'block', `open${item.id}`,`close${item.id}`)"
                                            :ref="'close'+item.id">
                                            <use xlink:href="#icon-qj-sq2"></use>
                                        </svg>
                                        <svg class="icon " aria-hidden="true"
                                            @click="packUp(`table${item.id}`,'none',`open${item.id}`,`close${item.id}`)"
                                            :ref="'open'+item.id">
                                            <use xlink:href="#icon-qj-fk2"></use>
                                        </svg>
                                    </span>
                                </p>
                                <div :ref="'table'+item.id" class="disN record-pro"
                                    :class="(item.extra.method_name=='更新进度'|| item.extra.method_name=='删除')?'active':''">
                                    <p class="on " v-for="(val,key) in item.extra.data" :key="key">
                                        <span v-if="item.extra.method_name=='修改'">修改了</span>
                                        <span v-else-if="item.extra.method_name=='更新进度'">汇报任务</span>
                                        <span v-else-if="item.extra.method_name=='删除'">删除原因 </span>
                                        <span class="w-600">{{val.field_name}}</span>，旧值为“{{val.old_name}}”
                                        ，新值为“{{val.new_name}}”

                                    </p>


                                </div>

                            </li>

                        </ul>
                    </div>
                </section>
            </div>
        </el-drawer>
        <!-- <edit-task v-if="editTaskShow" ref="refEditTask" @cancel="hideEdit" :taskRow="taskRow" :taskId="taskId"
            :currentUrl="currentUrl" :queryId="queryId"></edit-task>
        <task-process v-if="processTaskShow" ref="refProcessTask" :taskId="taskId" :taskRow="taskRow" :currentUrl="currentUrl"
            @cancel="hideProcess"></task-process> -->
    </div>
</template>

<script>
import EditTask from './edit-task.vue';
import TaskProcess from './task-process.vue';
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
    components: {
        EditTask,
        TaskProcess
    },
    props: ["taskId", 'currentUrl', 'taskRow','queryId'],
    data() {
        return {
            collapseList: [],
            sqShow: true,
            openIndex: 0,
            showAll: true,
            editTaskShow: false,
            processTaskShow: false,
            query_id: '',
            taskList: [],
            listLoading: true,
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
        this.projectTaskDetail()
        this.projectBackStatus = sessionStorage.getItem('projectBackStatus')
    },
    methods: {
        // 删除
        deleteTask(id) {
            this.$confirm("确定删除该任务吗？", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
            }).then(() => {
                postData({
                    url: "/workbech/" + this.currentUrl + "/project_task/delete",
                    data: { project_task_id: id },
                }).then((res) => {
                    if (res.code == 200) {
                        this.$success(res.data.msg)
                        this.$emit("cancel", {});
                    }
                });
            }).catch((err) => {
                return false
            })
        },
        // 详情
        projectTaskDetail() {
            this.listLoading = true;
            getData({
                url: "/workbech/" + this.currentUrl + "/project_task/detail/" + this.taskId,
            }).then((res) => {
                this.listLoading = false;
                this.taskList = res.data.info
            });
        },
        cancel() {
            this.$emit("cancel", {});
        },
        //编辑里程碑任务
        editTask() {
            this.editTaskShow = true
        },
        hideEdit() {
            this.editTaskShow = false
            this.projectTaskDetail()
        },
        // 编辑进度
        processedit() {
            this.processTaskShow = true
        },
        hideProcess() {
            this.processTaskShow = false
            this.projectTaskDetail()
        },
        // 默认收起
        packUp(item, display_, open, close) {
            // 注意必须要带[0]
            this.$refs[item][0].style.display = display_
            if (display_ == 'none') {
                this.$refs[open][0].style.display = 'none'
                this.$refs[close][0].style.display = 'block'
            } else if (display_ == 'block') {
                this.$refs[open][0].style.display = 'block'
                this.$refs[close][0].style.display = 'none'
            }
        },
    },

}
</script>
  
<style lang="less" scoped>
.check-task {
    .task-desc-svg {
        display: flex;
    }
    svg.icon {
        width: 0.2rem;
        display: none;
    }

    svg.icon.active {
        display: block;
    }

    .task-c {
        width: 6.19rem;
        height: calc(100%-1rem);
        background: linear-gradient(180deg, #EAF1F5 20%, #FFFFFF 50%);
        padding: 0.13rem 0.21rem 0;
        margin-top: 0.2rem;

        .top {
            height: 4rem;

            .task-title {
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
                        margin-left: 0.2rem;

                        .record-pro {
                            width: 5.67rem;
                            padding: 0.07rem 0.16rem;
                            margin-top: 0.05rem;

                            p {
                                margin-bottom: 0.06rem;
                            }
                        }

                        .record-pro.active {
                            background: #F7F8FA;
                        }
                    }
                }

            }

        }
    }
}
</style>