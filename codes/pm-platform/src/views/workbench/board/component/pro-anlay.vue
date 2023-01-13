<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="8rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false"
            v-loading="listLoading">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">项目经理统计</h4>
            <div class="flex-start mb12">
                <div class="ranking_input flex-box">
                    <el-input plain placeholder="请输入关键词搜索" style="width:2rem;margin-right: 0.1rem;" v-model="form.content" clearable></el-input>
                    <el-button type="primary" @click="getList">搜索</el-button>
                </div>
            </div>
            <div>
                <el-table :data="dataList" stripe border element-loading-text="正在查询中..." class="tasktable" >
                    <el-table-column label="项目经理" class="rwmc" min-width="100">
                        <template slot-scope="scope">
                            <div class="color_1B4B84">
                                {{ scope.row.stage_name }}
                                <span v-if="scope.row.name">（{{ scope.row.name }}）</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="累计项目个数（个）" width="170">
                        <template slot-scope="scope">
                            <div class="color_1B4B84 ">
                                {{ scope.row.total_project_count }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="交付项目数（个）" width="130">
                        <template slot-scope="scope">
                            <div class="color_1B4B84 ">
                                {{ scope.row.finish_project_count }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="合同金额（元）" width="144">
                        <template slot-scope="scope">
                            <div class="color_1B385C">
                                {{ scope.row.project_price }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="近半年跟进项目数（个）" width="158">
                        <template slot-scope="scope">
                            <div class="color_1B4B84">
                                {{ scope.row.half_year_project_count }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="btm_box d-between">
                    <!-- 分页 -->
                    <div class="pagination_box">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="form.page" :page-size="form.pagesize" :page-sizes="[15, 20, 50, 100]"
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script>
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
    data() {
        return {
            listLoading: false,
            dataList: [],
            tabInx:0,
            form:{
                page:1,
                pagesize:15,
                content:''
            },
            total:0
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            var data = this.form;
            getData({
                url: "/workbech/admin_workbench/project/data_board_more_manager",
                data
            }).then((res) => {
                this.dataList = res.data.data
                this.total = res.data.total
            });
        },
        cancel(){
            this.$emit('cancel',{})
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.getList();
        },
        handleSizeChange(val){
        this.form.pagesize=val;
        this.getList()
      },
    },

}
</script>
  
<style lang="less" scoped>
.mb12 {
    margin-bottom: 0.12rem;
}

.title {
    margin-bottom: 0.24rem;
}

.ranking_title {
    p {
        color: #999999;
        font-size: 0.16rem;
        margin-right: 0.44rem;
        position: relative;
    }

    p.active {
        color: #3458DD;
    }

    p.active::before {
        position: absolute;
        top: 0.3rem;
        left: 0;
        content: '';
        width: 0.64rem;
        height: 0.04rem;
        background: #2141B4;
        opacity: 1;
        border-radius: 0.04rem;

    }

}
</style>