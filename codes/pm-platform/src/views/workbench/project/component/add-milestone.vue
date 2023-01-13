<template>
    <div class="add_mile">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="17rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>新建里程碑</h4>
            <div>
                <div class="task-desc">
                   <strong><span>任务名称：{{taskHeadername}}</span><span>起止时间：{{taskHeaderStarttime}} 至 {{taskHeaderEndtime}}</span></strong> 
                </div>
                <el-table :data="milestoneForm.milestone_data" :model="milestoneForm" ref="milestoneForm" border stripe
                    style="100%" class="tasktable" :row-class-name="tableRowClassName" :header-cell-class-name="star">
                    <el-table-column prop="name" label="事件名称">
                        <template slot-scope="scope">
                            <div>
                                <el-input placeholder="请输入" v-model="scope.row.name"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="charge_user_ids" label="执行人">
                        <template slot-scope="scope">
                            <div>
                                <el-select v-model="scope.row.charge_user_ids" placeholder="请选择" clearable multiple>
                                    <el-option v-for="item in  selectListOption.users_for_select" :key="item.value"
                                        :label="item.stage_name +( item.name!=null?'（'+item.name +'）':'')" :value="item.id" v-if="projShow">
                                    </el-option>
                                    <el-option v-for="item in  selectListOption.users_for_select" :key="item.value"
                                        :label="item.stage_name" :value="item.id" v-if="!projShow">
                                    </el-option>
                                </el-select>
                            </div>
                        </template>

                    </el-table-column>
                    <el-table-column prop="priority_level" label="优先级">
                        <template slot-scope="scope">
                            <div>
                                <el-select v-model="scope.row.priority_level" placeholder="请选择">
                                    <el-option v-for="item in selectListOption.priority_level" :key="item" :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="timeVal" label="截止时间">
                        <template slot-scope="scope">
                            <div>
                                <el-date-picker placeholder="截止日期" v-model="scope.row.end_time" type="date"
                            value-format="yyyy-MM-dd HH:mm:ss" style="width:2rem" :picker-options="pickerOptionsEnd">
                        </el-date-picker>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="desc" label="事件描述">
                        <template slot-scope="scope">
                            <div>
                                <el-input placeholder="请输入" v-model="scope.row.desc"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" @click="delete(scope.row,scope.$index)">删除</el-button>
                            </div>
                        </template>

                    </el-table-column>
                    <!--  -->
                </el-table>
                <div class="module-center">
                    <el-button class="add" @click="add()">+</el-button>
                </div>
                <div class="module-center">
                    <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                    <el-button type="primary" class="confirm" @click="projectMilestoneStore" :loading="listLoading" :disabled="listLoading">确定</el-button>
                </div>
            </div>
            <el-dialog title="自定义" :visible.sync="customizeDialogVisible" width="30%" :modal="false" class="customize">
                <textarea name="" id="" cols="70" rows="10" class="customize-t"></textarea>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="customizeDialogVisible = false" class="qx-btn">取 消</el-button>
                    <el-button type="primary" @click="customizeDialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>

        </el-drawer>
    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
    props: ["lcbId", 'currentUrl', 'queryId','taskHeadername',
      'taskHeaderStarttime',
      'taskHeaderEndtime'],
    data() {
        return {
            listLoading:false,
            tableData: [{}, {}],
            nameOptions: [],
            zrrOptions: [],
            beginTime: '',
            customizeDialogVisible: false,
            value: '',
            milestoneForm: {
                task_id: '',
                milestone_data: [{
                    name: "",//	是	string	里程碑名称
                    desc: "",//	是	string	里程碑描述
                    priority_level: "",//		是	string	里程碑优先级
                    end_time: "",//	是	string	里程碑截止时间
                    charge_user_ids: "",//	[]	是	string	里程碑执行人
                }
                ]
            },
            currentIndex:0,
            selectListOption: [],
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
        this.projectMilestoneIndex()
        this.milestoneForm.task_id = this.lcbId
    },
    methods: {
              // 给表格加表头单元格类名事件
    star({ row, rowIndex, column, columnIndex }){
        if (columnIndex !=4  && columnIndex != 5) {
                return "star";
      }
    },
    changeDate(row, index) {
            this.taskForm.milestoneForm[index].start_time = row.timeVal[0]
            this.taskForm.milestoneForm[index].end_time = row.timeVal[1];
            // this.tableIndex = index
            this.currentIndex = index
        },
        // 格式化每一个列表的颜色为333
        tableRowClassName({ row, rowIndex }) {
            return 'column_color333';
        },
        // 下拉框列表
        projectMilestoneIndex() {
            getData({
                url: "workbech/" + this.currentUrl + "/project_milestone/index/" + this.queryId,
            }).then((res) => {
              
                this.selectListOption = res.data;
            });
        },
        // 
        // 确定里程碑
        projectMilestoneStore() {
            // var result = this.milestoneForm.milestone_data.find((v) => {
            //     console.log(v);
            //     return v.name != '' && v.priority_level != '' && v.end_time != '' && v.charge_user_ids != ''           
            // })
            let arr = [];
            this.milestoneForm.milestone_data.map(i=>{
                if(i.name!='' && i.priority_level != '' && i.end_time != '' && i.charge_user_ids != ''){
                    arr.push(true)
                }else{
                    arr.push(false)
                }
            })
       
            if (arr.includes(false)) {
                this.$message.error('*为必填项，请填写完整后提交');
                return false
            }
       
            var data = this.milestoneForm
            this.listLoading = !this.listLoading;
            postData({
                url: "/workbech/" + this.currentUrl + "/project_milestone/store",
                data
            }).then((res) => {
                this.listLoading = !this.listLoading;
                if (res.code == 200) {
                    this.$success(res.data.msg)
                    this.$emit("cancel", {});
                }
            }).catch(err=>{
                this.listLoading = !this.listLoading;
                })

        },
        // 新增
        add() {
            var currentList = {
                name: "",//	是	string	里程碑名称
                desc: "",//	是	string	里程碑描述
                priority_level: "",//		是	string	里程碑优先级
                end_time: "",//	是	string	里程碑截止时间
                charge_user_ids: "",//	[]	是	string	里程碑执行人
            }
            this.milestoneForm.milestone_data.push(currentList)
        },

        delete(row, index) {
            this.milestoneForm.milestone_data.splice(index, 1)

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
.add_mile {
    padding: 0.08rem 0.65rem 0;

    /deep/.el-input--suffix .el-input__inner {
        height: 0.31rem !important;
    }

    /deep/.el-input .el-input__inner {
        height: 0.31rem !important;
    }
    /deep/.el-input__icon{
        line-height: initial;
    }
    .task-desc {
        color: #464C5B;
        font-size: 0.16rem;
        margin: 0.2rem;

        span {
            display: inline-block;
            margin-right: 1rem;
        }
    }

    .customize {
        .customize-t {
            width: 5rem;
            height: 1.06rem;
            resize: none;
            border: 0.01rem solid #DBDBDB;
            outline: none;
            padding: 0.1rem;
        }

    }

    .module-center {
        width: 100%;
        text-align: center;
        margin-bottom: 0.4rem;

        .el-button {
            width: 1.82rem;
            height: 0.42rem;
        }

        .qx-btn {
            background: #F7F7F7;
        }

        .add {
            width: 0.79rem;
            height: 0.26rem;
            margin: 0 auto;
            padding: 0;
            background: #F7F7F7;
        }
    }

    .el-drawer {
        width: 17.68rem;
    }

    .tasktable {
        margin: 0.24rem 0;

        td {
            font-size: 0.13rem;
            color: #1B385C;
        }
    }
}
</style>