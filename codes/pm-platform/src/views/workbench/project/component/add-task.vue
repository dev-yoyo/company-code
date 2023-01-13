<template>
    <div class="add_task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="17rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>新建任务</h4>
            <div>
                <el-table :data="taskForm.task_data" :model="taskForm" ref="taskForm" border stripe
                    style="100%" class="tasktable" :row-class-name="tableRowClassName" :header-cell-class-name="star">
                    <el-table-column prop="task_data.name" label="任务名称" width="258">
                        <template slot-scope="scope">
                            <div>
                                <el-select v-model="scope.row.name" placeholder="请选择"
                                    @change="changeCustomer(scope.row.name,scope.$index)" >
                                    <el-option v-for="(item,index) in taskList.name_for_select" :key="index"
                                        :label="item" :value="item"></el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="责任人" width="258" prop="task_data.charge_user_id">
                        <template slot-scope="scope">
                            <div>
                                <el-select v-model="scope.row.charge_user_id" placeholder="请选择" class="el-select-w5">
                                    <el-option v-for="(item,index) in taskList.users_for_select" :key="index" v-if="projShow"
                                        :label="item.stage_name +( item.name!=null?'（'+item.name +'）':'')" :value="item.id"></el-option>
                                        <el-option v-for="(item,index) in taskList.users_for_select" :key="index" v-if="!projShow"
                                        :label="item.stage_name " :value="item.id"></el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否关联上层任务：" prop="task_data.relative_last" width="150">
                        <template slot-scope="scope">
                            <div>
                                <!-- @change="changeTaskStatus(scope.row,scope.$index)" -->
                                <el-switch style="width:2rem" v-model="scope.row.relative_last"
                                    active-color="#FF980B" inactive-color="#E3E3E3"
                                    active-value="是"
                                    inactive-value="否"
                                    >
                                </el-switch>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="起止时间" current-row-key="index" prop="task_data.timeVal">
                        <template slot-scope="scope">
                            <div>
                                <el-date-picker v-model="scope.row.timeVal" type="daterange"
                                    @change="changeDate(scope.row,scope.$index)" value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                   :picker-options="pickerOptionsStart"
                                    >
                                </el-date-picker>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="task_data.desc" label="任务描述">
                        <template slot-scope="scope">
                            <div>
                                <el-input placeholder="请输入" v-model="scope.row.desc"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" @click="deleteCurrent(scope.row,scope.$index)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="module-center">
                    <el-button class="add" @click="addTask()">+</el-button>
                </div>
                <div class="module-center">
                    <el-button type="" class="canclel" @click="cancel()">取消</el-button>
                    <el-button type="primary" class="confirm" @click="submit" :loading="listLoading" :disabled="listLoading">确定</el-button>
                </div>
            </div>
            <el-dialog title="自定义" :visible.sync="customizeDialogVisible" width="30%" :modal="false" class="customize">
                <textarea name="" id="" cols="70" rows="10" class="customize-t" v-model="customVal"></textarea>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCustomer" class="qx-btn">取 消</el-button>
                    <el-button type="primary" @click='sure'>确 定</el-button>
                </span>
            </el-dialog>
        </el-drawer>
    </div>
</template>
<script>
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
    props: ['queryId', 'currentUrl'],
    data() {
        return {
            // btnLoading: false,
            customizeDialogVisible: false,
            listLoading: false,
            taskForm:{
                project_id: '',
                task_data: [
                    {
                        name: '', //		是	string	任务名称
                        desc: '', //		是	string	任务描述
                        charge_user_id: '', //		是	string	负责人
                        start_time: '', //		是	string	开始时间
                        end_time: '', //		是	string	结束时间
                        relative_last: '否', //		是	string	是否关联
                        timeVal: "",//时间段，

                    }
                ]

            },
            customVal: '',
            customList: [],
            currentIndex: 0,
            taskList: [],
            pickerOptionsStart: {
                disabledDate: time => {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            projShow:""
        }
    },
    created() {
        this.projectTaskIndex()
        this.projShow= (store.state.userInfo.role_id==1 ||store.state.userInfo.role_id==2)?true:false;
    },
    methods: {
        // 给表格加表头单元格类名事件
        star({ row, rowIndex, column, columnIndex }){
        if (columnIndex !=4  && columnIndex != 5) {
                return "star";
      }
        },
        // 格式化每一个列表的颜色为333
        tableRowClassName({ row, rowIndex }) {
            return 'column_color333';
        },
        // 点击自定义
        changeCustomer(name, index) {
            if (name == '自定义') {
                this.customVal = this.customList[index]?this.customList[index]:'';
                this.customizeDialogVisible = true;
            }
            this.currentIndex = index
            if(this.customList[this.currentIndex]){
                this.customVal = this.customList[this.currentIndex]
            }
        },
        // 新增一例
        addTask() {
            var currentList = {
                name: '', //		是	string	任务名称
                desc: '', //		是	string	任务描述
                charge_user_id: '', //		是	string	负责人
                start_time: '', //		是	string	开始时间
                end_time: '', //		是	string	结束时间
                relative_last: false, //		是	string	是否关联
                timeVal: "",//时间段
            }
            this.taskForm.task_data.push(currentList)
        },
        sure() {
            this.taskForm.task_data[this.currentIndex].name = this.customVal;
            this.customList[this.currentIndex] = this.customVal;
            this.customVal = '';
            this.customizeDialogVisible = false;
        },
        cancelCustomer(){
            this.taskForm.task_data[this.currentIndex].name = this.customVal;
            this.customizeDialogVisible = false
        },
        submit() {
            let arr = [];
            this.taskForm.task_data.map(i=>{
                if(i.name!='' && i.charge_user_id != '' && i.timeVal != ''){
                    arr.push(true)
                }else{
                    arr.push(false)
                }
            })
            
            if (arr.includes(false)) {
                this.$message.error('*为必填项，请填写完整后提交');
                return false
            }
            this.taskForm.project_id = this.queryId
            this.projectTaskStore()
        },
        changeDate(row, index) {
            try{
                this.taskForm.task_data[index].start_time = row.timeVal[0]
                this.taskForm.task_data[index].end_time = row.timeVal[1];
                this.currentIndex = index
            }catch{}
        },
        deleteCurrent(row, index) {
            this.taskForm.task_data.splice(index, 1)
            this.customList.splice(index, 1)
        },
        // 列表查询
        projectTaskIndex() {
            getData({
                url: "/workbech/" + this.currentUrl + "/project_task/index/" + this.queryId,
            }).then((res) => {
                this.taskList = res.data
                this.taskList.name_for_select.unshift('自定义');
            });

        },
        // 提交接口
        projectTaskStore() {
            this.listLoading = true;
            var data = this.taskForm
            postData({
                url: "workbech/" + this.currentUrl + "/project_task/store",
                data
            }).then((res) => {
                this.listLoading = !this.listLoading ;
                if (res.code == 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this.$emit("cancel", {});
                }
            }).catch(err=>{
                this.listLoading = !this.listLoading ;
                // this.$message({
                //         message: err,
                //         type: 'error'
                //     })
            })
        },
        cancel() {
            this.$emit("cancel", {});
        },
        // 关联任务 转是否
        // changeTaskStatus(row, index) {
        //     this.taskForm.task_data[index].relative_last = row.relative_laststr
        //     if (this.taskForm.task_data[index].relative_last == true) {
        //         this.taskForm.task_data[index].relative_last = '是'
        //     } else {
        //         this.taskForm.task_data[index].relative_last = '否'
        //     }
        // }
    },
}
</script>
  
<style lang="less" scoped>
.add_task {
    padding: 0.08rem 0.65rem 0;

    /deep/.el-input--suffix .el-input__inner {
        height: 0.31rem !important;
    }

    /deep/.el-input .el-input__inner {
        height: 0.31rem !important;
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
            background: #F7F7F7;
            padding: 0;
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