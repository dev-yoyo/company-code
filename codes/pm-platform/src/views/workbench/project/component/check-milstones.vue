<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false"
            v-loading="listLoading">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>查看</h4>
            <div class="task-c">
                <section class="top">
                    <div class="flex-center task-title">
                        <h4>{{taskList.name}}</h4>
                        <!-- <div class="btns" v-if="miilStoneRow.is_delete!=1 && miilStoneRow.status!='已完成' && miilStoneRow.status!='逾期完成'  && projectBackStatus!='已终止'&& projectBackStatus!='已完结'">
                            <el-button type="primary"  @click="editMile" v-if="role_id==1|| role_id==2">编辑</el-button>
                            <el-button type="primary" @click="finish"  v-if="role_id==1|| role_id==2 || currentUserId ==miilStoneRow.charge_user_id">完成</el-button>
                            <el-button @click="deleteLcb(taskList)"  v-if="role_id==1|| role_id==2">删除</el-button>
                        </div> -->
                    </div>
                    <p class="color_333 mb">{{taskList.desc}}

                    </p>
                    <p class="color_666"><span class="wid-j">执行人：</span><span class="color_333"
                            v-for="(item,index) in taskList.charge_users" :key="index">{{item.stage_name}}&nbsp; <span v-if="projShow && item.name"> （{{item.name}}）</span></span>
                    </p>
                    <p class="color_666" taskList.priority_level><span class="wid-j">优先级：</span><span
                            class="color_333">{{taskList.priority_level}}</span></p>
                    <p class="color_666"><span class="wid-j">截止时间：</span><span
                            class="color_333">{{taskList.end_time}}</span></p>
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
                        <ul class="record-list" >
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
                                <div :ref="'table'+item.id"  class="disN record-pro" :class="(item.extra.method_name=='更新进度'|| item.extra.method_name=='删除')?'active':''">
                                    <p class="on " v-for="(val,key) in item.extra.data" :key="key" >
                                        <span v-if="item.extra.method_name=='修改'">修改了</span>
                                        <span v-else-if="item.extra.method_name=='更新进度'">汇报任务</span>
                                        <span v-else-if="item.extra.method_name=='删除'">删除原因 </span>
                                        <span class="w-600" >{{val.field_name}}</span>，旧值为“{{val.old_name}}” ，新值为“{{val.new_name}}”

                                    </p>
                                </div>
                            
                            </li>
                         
                        </ul>

                    </div>

                </section>

            </div>
        </el-drawer>
        <!-- <edit-milestone-task :lcbId='lcbId' :queryId='queryId' :currentUrl="currentUrl" :miilStoneRow="miilStoneRow"
            v-if="editShow" ref="refEditShow" @cancel="hideEdit"></edit-milestone-task> -->
    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";

import EditMilestoneTask from './edit-milestone-task.vue';
import store from '@/store'
export default {
    components: { EditMilestoneTask },
    props: ['lcbId', 'currentUrl', 'miilStoneRow', 'queryId'],
    data() {
        return {
            collapseList: [],
            sqShow: true,
            openIndex: 0,
            showAll: true,
            editShow: false,
            taskList: [],
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
        this.adminProjectMilestone()
        this.projectBackStatus = sessionStorage.getItem('projectBackStatus')
    },
    methods: {
        // 详情
        adminProjectMilestone() {
            this.listLoading = true;

            getData({
                url: "/workbech/" + this.currentUrl + "/project_milestone/detail/" + this.lcbId,
            }).then((res) => {
                this.listLoading = false;

                this.taskList = res.data.info

            });

        },
        // 删除里程碑
        deleteLcb(row) {
            this.$confirm("确定删除该里程碑吗？", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
            }).then(() => {
                postData({
                    url: "workbech/" + this.currentUrl + "/project_milestone/delete",
                    data: { project_milestone_id: row.id },
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
        cancel() {
            this.$emit("cancel", {});
        },

        // 收起
        packUp(item,display_,open,close) {
            this.$refs[item][0].style.display = display_

            if (display_ == 'none') {
                this.$refs[open][0].style.display = 'none'
                this.$refs[close][0].style.display = 'block'


            } else if (display_ == 'block') {
                this.$refs[open][0].style.display = 'block'
                this.$refs[close][0].style.display = 'none'

            }

        },


        // 编辑
        editMile() {
            this.editShow = true
        },
        hideEdit() {
            this.editShow = false
            this.adminProjectMilestone()
        },


        finish() {
            this.$confirm("确定完成该里程碑吗？", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
            }).then(() => {
                this.miilstoneSetComplete()
            }).catch(()=>{

            })
        },

        // 里程碑完成

        miilstoneSetComplete() {
            postData({
                url: "workbech/" + this.currentUrl + "/project_milestone/set_complete",
                data: {
                    project_milestone_id: this.lcbId
                },
            }).then((res) => {
                if (res.code == 200) {
                    this.$success(res.data.msg)
                    this.$emit("cancel", {});
                }
            });
        },
    },
    components: {
        EditMilestoneTask
    },
}
</script>
  
<style lang="less" scoped>
.check-task {
    .task-desc-svg{
        display: flex;
    }

    .task-c {
        width: 6.19rem;
        height: calc(100%-1rem);
        background: linear-gradient(180deg, #EAF1F5 20%, #FFFFFF 50%);
        padding: 0.13rem 0.21rem 0;
        margin-top: 0.2rem;
        svg.icon{
                width: 0.2rem;
                display: none;
              }
              svg.icon.active{
                display: block;
              }
        .top {
            height: 4rem;

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