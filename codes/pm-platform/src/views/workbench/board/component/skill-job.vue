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
            <h4 class="title">用户技能/职位占比</h4>
            <div class="flex-start mb2">
                <div class="ranking_title flex-box">
                    <p :class="form.skill_or_job_top_select == 'skill' ? 'active' : ''" @click="switchTab('skill')">用户技能</p>
                    <p :class="form.skill_or_job_top_select == 'job' ? 'active' : ''" @click="switchTab('job')">用户职位</p>
                </div>
            </div>
            <div>
                <el-table :data="dataList" stripe border element-loading-text="正在查询中..." class="tasktable">
                    <el-table-column label="排名" class="rwmc" min-width="100">
                        <template slot-scope="scope">
                            <div class="color_1B4B84">
                                {{ scope.row.rank }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="form.skill_or_job_top_select == 'skill' ? '技能名称' : '职位名称'" min-width="100">
                        <template slot-scope="scope">
                            <div class="color_1B4B84 ">
                               {{ scope.row.name }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户数" width="130">
                        <template slot-scope="scope">
                            <div class="color_1B4B84 ">
                                {{ scope.row.value }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="占比" width="144">
                        <template slot-scope="scope">
                            <div class="color_1B385C">
                                {{ scope.row.percent }}%
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
export default {
    data() {
        return {
            listLoading: false,
            dataList: [],
            form: {
                page: 1,
                pagesize: 15,
                skill_or_job_top_select:'skill'
            },
            total: 0
        }
    },
    created() {
        this.getList()
    },
    methods: {
        switchTab(content) {
            this.form.skill_or_job_top_select = content
            this.form.pagesize = 15;
            this.form.page = 1;
            this.getList()
        },
        getList() {
            var data = this.form;
            getData({
                url: "/workbech/admin_workbench/project/data_board_more_skill_job_top",
                data
            }).then((res) => {
                this.dataList = res.data.data
                console.log(this.dataList);
                this.total = res.data.total
            });

        },
        cancel() {
            this.$emit("cancel", {});
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.getList();
        },
        handleSizeChange(val) {
            this.form.pagesize = val;
            this.getList()
        },
    },

}
</script>
  
<style lang="less" scoped>
.mb2 {
    margin-bottom: 0.2rem;
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
        cursor: pointer;
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