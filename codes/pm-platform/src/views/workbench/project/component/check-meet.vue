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
                        <h4>{{ taskList.theme }}</h4>
                    </div>
                    <p>
                        <a :href="taskList.url">{{ taskList.url }}</a>
                    </p>
                    <p class="color_666 flex-item"><span class="wid-j">参会人员：</span><span
                            class="color_333">{{ taskList.join_user_stage_name }} </span>
                            <span v-if="projShow && taskList.join_user_name">（{{ taskList.join_user_name }}）</span>
                        </p>
                    <p class="color_666 flex-item"><span class="wid-j">参会时间：</span><span
                            class="color_333">{{ taskList.start_time }}</span></p>
                </section>
            </div>

        </el-drawer>
        <!-- <edit-meet v-if="editMeetShow" ref="refEditMeet" @cancel="hideEditMeet"  :meetRow="meetRow"></edit-meet> -->
        <edit-meet v-if="editMeetShow" ref="refEditMeet" :meetId="meetId" :meetRow="meetRow" :queryId='queryId'
            :currentUrl="currentUrl" @cancel="hideEditMeet"></edit-meet>
    </div>
</template>
  
<script>
import EditMeet from './edit-meet.vue';
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
    props: ['meetId', 'currentUrl', 'meetRow', 'queryId'],
    components: {
        EditMeet
    },
    data() {
        return {
            listLoading: true,
            editMeetShow: false,
            taskList: [],
            projectBackStatus: '',
            projShow: ""

        }

    },
    created() {
        this.projShow = (store.state.userInfo.role_id == 1 || store.state.userInfo.role_id == 2) ? true : false;
        this.role_id = store.state.userInfo.role_id
        this.projectMeetDetail()
        this.projectBackStatus = sessionStorage.getItem('projectBackStatus')
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        editMeet() {
            console.log(this.meetRow, this.queryId);
            this.editMeetShow = true;
        },
        hideEditMeet() {
            this.editMeetShow = false;
        },
        // 详情
        projectMeetDetail() {
            this.listLoading = true;
            getData({
                url: "/workbech/" + this.currentUrl + "/project_meeting/detail/" + this.meetId,
            }).then((res) => {
                this.listLoading = false;
                this.taskList = res.data.info
            });
        },
        // 删除
        deleteMeet(id) {
            this.$confirm('确认要删除该会议吗', '提示', {
            }).then(() => {
                postData({
                    url: "/workbech/" + this.currentUrl + "/project_meeting/delete",
                    data: { project_meeting_id: id }
                }).then((res) => {
                    if (res.code == 200) {
                        this.$success(res.data.msg)
                        this.$emit("cancel", {});
                    }
                });

            }).catch((err) => {

            });





        }



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

        .module-center {
            width: 6rem;
            margin: 0.4rem auto 0;
            text-align: center;

            .el-button {
                width: 1.82rem;
            }
        }

        .top {
            height: 4rem;

            .flex-item {
                width: 2.5rem;
            }

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