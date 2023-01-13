<template>
  <div class="">
    <el-dialog
      :visible="show"
      width="884px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="dialog_box"
    >
      <div class="top_info">
        <div class="title">关联报价</div>
        <div class="top_search search">
          <el-input
              class="search_ipt"
              placeholder="编号"
              prefix-icon="el-icon-search"
              v-model="serVal"
              @keyup.enter.native="serKeyUp()"
          >
          </el-input>
          <button class="search_btn" @click="serKeyUp()">搜索</button>
        </div>
      </div>
      <el-table
        ref="singleTable"
        :data="tableData"
        :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
        :cell-style="{ color: '#657180', 'font-size': '12px' }"
        style="width: 100%; overflow: auto"
        height="550"
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked"
              @change="change(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>

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

        <el-table-column label="客户名称" min-width="100"  :show-overflow-tooltip="true">
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

        <el-table-column label="报价产品" min-width="90"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{
                scope.row.offer_product
                  ? scope.row.offer_product[0].product_name
                  : ""
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="报价时间"
          prop="offer_time"
          min-width="100"
          sortable
        :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
          <div class="com-line-1"> {{ scope.row.offer_time }}</div>
          </template>
        </el-table-column>

        <el-table-column label="报价人" prop="user.name" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
          <div class="com-line-1"> {{ scope.row.user.name }}</div>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="examine_name" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
          <div class="com-line-1"> {{ scope.row.examine_name }}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="有效日期"
          prop="overdue_time"
          min-width="100"
          sortable
           :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="com-line-1"> {{ scope.row.overdue_time }}</div>
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

      <div class="dialog_footer">
        <!-- 分页 -->
        <!-- <div class="pagination_box"> -->
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
        <!-- </div> -->

        <div>
          <el-button class="btn_item cancel" @click="cancel()">
            取消
          </el-button>

          <el-button
            class="btn_item"
            @click="submitForm"
            :loading="createLoading"
            :disabled="createLoading"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      show: true,
      serVal: "",
      createLoading: false,

      offer: {},

      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,
      moveUserCheckList: [],
      currentRow: {},
    };
  },
  methods: {
    init(customer_id, offer) {
      // console.log("list >>>>>>", customer_id, offer);
      this.customer_id = customer_id;
      this.offer = offer;

      this.getList();
    },

    getList() {
      getData({
        url: "/offer/offer_record_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word: this.serVal,
          status: 100,
          customer_id: this.customer_id,

          // timing: "",
          // customer_id: "",
          // department_id: "",
          // user_id: "",
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
            if (this.offer && e.id == this.offer.id) {
              e.checked = true;
              this.currentRow = e;
            }
          });
          this.tableData = arr;
          this.total = list.total;
        }
      });
    },
    // 搜索
    serKeyUp() {
      this.page = 1;
      this.getList();
    },

    change(row) {
      let arr = this.tableData;
      arr.map((e) => {
        e.checked = false;
      });
      this.tableData = arr;
      row.checked = !row.checked;
      row.customer_name = row.customer.name;
      row.customer_company_name = row.customer.company;
      this.currentRow = row;
    },

    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },

    submitForm() {
      if(JSON.stringify(this.currentRow)==="{}") {
        this.$warning('请选择关联的报价')
      }else {
        this.$emit("confirm", this.currentRow);
        this.cancel();
      }
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-table {
  th {
    padding: 0 !important;
    height: 42px !important;
    background-color: #f3f7f9 !important;
  }
  td {
    padding: 0 !important;
    height: 48px !important;
  }

  .cell {
    overflow: initial;
  }

  .is-leaf {
    overflow: initial !important;
  }
}

.dialog_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 23px;
}

.top_info {
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .search {
    margin: 12px 0;
    width: 280px;
  }
}
</style>
