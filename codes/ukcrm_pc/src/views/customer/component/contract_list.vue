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
      <el-table-column label="合同编号" prop="contract_no" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div
            class="customer_name com-line-1"
            @click="showDetail(scope.row.id)"
          >
            {{ scope.row.contract_no }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="合同名称" prop="contract_name" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.contract_name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="关联客户" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.customer ? scope.row.customer_name : "" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="关联企业" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.customer ? scope.row.customer_company_name : "" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="关联报价"
        prop="offer_record.offer_num"
        min-width="90"
        :show-overflow-tooltip="true"
      >
      </el-table-column>

      <el-table-column label="合同金额" prop="money" min-width="90" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="合同状态" prop="contract_status" min-width="100" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="待回款" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.return_money }}元</div>
        </template>
      </el-table-column>
      <el-table-column label="已回款" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.has_return_money }}元</div>
        </template>
      </el-table-column>

      <el-table-column label="签订人" prop="sign_user" min-width="100" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        label="签订日期"
        prop="sign_time"
        min-width="100"
        sortable
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.sign_time }}</div>
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
    <detail v-if="detailShow" ref="refDetail" @cancel="hideDetail"></detail>
  </div>
</template>

<script>
import { getData } from "@/api/user";
import store from "@/store";
import detail from "@/views/transaction_management/contract/component/detail.vue";

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
    init({ customer_id, contract }) {
      // console.log("contract >>>", customer_id, contract);
      this.customer_id = customer_id;
      getData({
        url: "/contract/all_contract_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          let arr = list.data;
          arr.map((e) => {
            e.checked = false;
            if (contract && e.id == contract.id) {
              e.checked = true;
            }
          });
          this.tableData = arr;
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
    detail,
  },
};
</script>