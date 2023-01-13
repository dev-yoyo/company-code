<template>
  <div class="perform">
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="667px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">业绩排行</div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div v-if="achievementList.length > 0">
        <el-table
          ref="multipleTable"
          :data="achievementList"
          style="width: 100%"
          :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
          :cell-style="{ color: '#657180', 'font-size': '12px' }"
        >
          <el-table-column label="排名">
            <template slot-scope="scope">
              <div class="sort" :class="'sort_' + scope.row.idx">
                {{ scope.row.idx }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="姓名" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="com-line-1">
                {{ scope.row.user && scope.row.user.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="部门" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="com-line-1">
                {{
                  scope.row.user &&
                  scope.row.user.department &&
                  scope.row.user.department.name
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="签单数" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="com-line-1">
                {{ scope.row.contract_num }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="签单金额" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="com-line-1">{{ scope.row.total_money }} 元</div>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="table_empty">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
              />
            </div>
          </template>
        </el-table>
        <div class="pagination_box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[15, 20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="page_empty" v-else>
        <img
          src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import customerList from "@/views/transaction_management/offer/component/choose_customer_list.vue";
import { getData, postData, delData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      drawer: true,

      achievementList: [],
      page: 1,
      pagesize: 15,
      total: 0,
    };
  },
  created() {},
  methods: {
    init(year) {
      getData({
        url: "/index/performance_ranking",
        data: {
          timing: "本年度",
          page: this.page,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        const {
          code,
          data: { performance_ranking },
        } = res;
        if (code === 200) {
          let list = performance_ranking;
          let arr = list.data;
          list.data.map((e, i) => {
            if (
              (i > 0 && arr[i].total_money != arr[i - 1].total_money) ||
              i === 0
            ) {
              e.idx = i + (this.page - 1) * this.pagesize + 1;
            } else {
              e.idx = arr[i - 1].idx;
            }
          });

          this.achievementList = list.data;
          this.total = list.total;
        }
      });
    },

    // ----------------其他----------------
    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  components: { customerList },
};
</script>

<style lang="less" scoped>
.perform {
  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .sort {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
  }
  .sort_1 {
    background: #ffce29;
    color: #fff;
  }

  .sort_2 {
    background: #bcbbb6;
    color: #fff;
  }

  .sort_3 {
    background: #d57d17;
    color: #fff;
  }

  .page_empty {
    background: #fff !important;
    border: none !important;
  }
}
</style>
