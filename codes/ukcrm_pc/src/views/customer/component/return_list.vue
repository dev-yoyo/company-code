<template>
  <div class="">
    <el-table
      ref="singleTable"
      :data="tableData"
      style="width: 100%"
      :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
      :cell-style="{ color: '#657180', 'font-size': '12px' }"
      height="calc(100vh - 540px)"
    >
      <el-table-column width="20"> </el-table-column>

      <el-table-column label="回款编号" prop="return_num" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div
            class="customer_name com-line-1"
            @click="showDetail(scope.row.id)"
          >
            {{ scope.row.return_num }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="关联客户" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.contract ? scope.row.contract.customer_name : "" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="关联企业" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{
              scope.row.contract ? scope.row.contract.customer_company_name : ""
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="关联合同"
        prop="contract.contract_no"
        min-width="90"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.contract.contract_no }}</div>
        </template>
      </el-table-column>

      <el-table-column label="合同金额" prop="money" min-width="90" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.contract.money }}元</div>
        </template>
      </el-table-column>

      <el-table-column label="计划期数" prop="contract_status" min-width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.payment_plan ? scope.row.payment_plan.period : "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="回款金额" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.return_money }}元</div>
        </template>
      </el-table-column>

      <el-table-column
        label="回款时间"
        prop="return_time"
        min-width="100"
        sortable
         :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.return_time }}</div>
        </template>
      </el-table-column>

      <el-table-column label="负责人" prop="contract.sign_user" :show-overflow-tooltip="true">
      </el-table-column>
      <template slot="empty">
        <div class="table_empty">
          <img
            src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
          />
        </div>
      </template>
    </el-table>

    <!-- 分页 -->
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

    <!-- 详情 -->
    <returndetail
      v-if="detailShow"
      ref="refDetail"
      @cancel="hideDetail"
    ></returndetail>
  </div>
</template>

<script>
import { getData } from "@/api/user";
import store from "@/store";
import returndetail from "@/views/transaction_management/returnMoney/component/detail.vue";

export default {
  data() {
    return {
      customer_id: "",
      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,

      detailShow: false,
    };
  },
  methods: {
    init({ customer_id }) {
      // console.log("return_list init >>>", customer_id);
      this.customer_id = customer_id;

      getData({
        url: "/payment_collection/all_payment_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          customer_id: this.customer_id,
          search_word: "",
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          this.tableData = list.data;
          this.total = list.total;
        }
      });
    },

    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.init({ customer_id: this.customer_id });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init({ customer_id: this.customer_id });
    },

    showDetail(row_id) {
      // console.log("详情 id》》》", row_id);

      this.detailShow = true;
      this.$nextTick(() => {
        this.$refs.refDetail.init(row_id);
      });
    },
    hideDetail() {
      this.detailShow = false;
      this.init({ customer_id: this.customer_id });
    },
  },
  components: {
    returndetail,
  },
};
</script>
