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
            <h4 class="title">个人/团队排名</h4>
            <div class="flex-start mb12">
                <div class="ranking_title flex-box">
                    <p :class="form.user_or_team_top_select == 'user' ? 'active' : ''" @click="switchTab('user')">个人排名</p>
                    <p :class="form.user_or_team_top_select == 'team' ? 'active' : ''" @click="switchTab('team')">团队排名</p>
                </div>
                <div class="ranking_input flex-box">
                    <el-input plain placeholder="请输入关键词搜索" style="width:2rem;margin-right: 0.1rem;"
                        v-model="form.content" clearable=""></el-input>
                    <el-button type="primary" @click="getList">搜索</el-button>
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
                    <el-table-column :label="form.user_or_team_top_select == 'user' ? '用户' : '团队'" width="170">
                        <template slot-scope="scope">
                            <div class="color_1B4B84 ">
                                <span v-if="form.user_or_team_top_select == 'user'"> {{ scope.row.stage_name }} <span
                                        v-if="scope.row.name">（{{ scope.row.name }}）</span></span>
                                <span v-if="form.user_or_team_top_select == 'team'"> {{ scope.row.team_name }}<span
                                        v-if="scope.row.name">（{{ scope.row.name }}）</span></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="等级" width="130">
                        <template slot-scope="scope">
                            <div class="color_1B4B84 ">
                                {{ scope.row.level }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="累计项目数（个）" width="144">
                        <template slot-scope="scope">
                            <div class="color_1B385C">
                                {{ scope.row.project_join_count }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="累计收益（元）" width="158">
                        <template slot-scope="scope">
                            <div class="color_FF9827">
                                {{ scope.row.total_in_money }}
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
            form: {
                page: 1,
                pagesize: 15,
                user_or_team_top_select: 'user',//user team
                content: ''

            },
            total: 0
        }
    },
    created() {
        this.getList()
    },
    methods: {
        switchTab(content) {
            this.form.user_or_team_top_select = content
            this.form.pagesize = 15;
            this.form.page = 1;
            this.getList()
        },
        getList() {
            var data = this.form;
            getData({
                url: "/workbech/admin_workbench/project/data_board_more_top",
                data
            }).then((res) => {
                this.dataList = res.data.data
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