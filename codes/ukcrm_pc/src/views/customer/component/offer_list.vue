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

      <el-table-column label="报价编号" prop="offer_num" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div
            class="customer_name com-line-1"
            @click="showDetail(scope.row.id)"
          >
            {{ scope.row.offer_num }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="客户名称" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.customer ? scope.row.customer.name : "" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="关联企业" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.customer ? scope.row.customer.company : "" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="报价产品" min-width="90" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{
              scope.row.offer_product
                ? scope.row.offer_product.length
                : ""
            }}种
          </div>
        </template>
      </el-table-column>

      <el-table-column label="报价时间" prop="offer_time" min-width="100" sortable :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.offer_time }}</div>
        </template>
      </el-table-column>

      <el-table-column label="报价人" prop="user.name" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.user.name }}</div>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="examine_name" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.examine_name }}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="有效日期"
        prop="overdue_time"
        min-width="100"
        sortable
      >
        <template slot-scope="scope">
          <div class="com-line-1">{{ scope.row.overdue_time }}</div>
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
    <offer-detail
      v-if="detailShow"
      ref="refDetail"
      @cancel="hideDetail"
    ></offer-detail>
  </div>
</template>

<script>
import { getData } from "@/api/user";
import store from "@/store";
import offerDetail from "@/views/transaction_management/offer/component/detail.vue";

export default {
  data() {
    return {
      dialogShow: true,
      serVal: "",
      createLoading: false,

      detailShow: false,

      customer_id: "",
      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,
    };
  },
  methods: {
    init({ customer_id }) {
      // console.log("offer >>>", customer_id);
      this.customer_id = customer_id;
      getData({
        url: "/offer/offer_record_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word: this.serVal,
          customer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          let arr = list.data;
          this.tableData = arr;
          this.total = list.total;
        }
      });
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

    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.init({ customer_id: this.customer_id });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init({ customer_id: this.customer_id });
    },

    cancel() {
      this.$emit("cancel");
    },
  },
  components: {
    offerDetail,
  },
};
</script>