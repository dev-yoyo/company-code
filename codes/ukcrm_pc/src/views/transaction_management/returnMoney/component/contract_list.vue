<template>
  <div>
    <el-dialog
      :visible="show"
      width="884px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="dialog_box"
    >
      <div class="top_info">
        <div class="title">关联合同</div>
        <div class="top_search search">
          <el-input
              class="search_ipt"
              placeholder="合同编号、产品、合同名称"
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
        height="550px"
      >
        <el-table-column min-width="50" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked"
              @change="change(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="合同编号" prop="contract_no" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="customer_name com-line-1">
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
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.offer_record ? scope.row.offer_record.offer_num : "" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="合同金额" prop="money" min-width="90" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.money }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="合同状态"
          prop="contract_status"
          min-width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.contract_status }}
            </div>
          </template>
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

        <el-table-column label="签订人" prop="sign_user" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">{{ scope.row.sign_user }}</div>
          </template>
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
      id:"",
      show: true,
      serVal: "",
      createLoading: false,

      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,
      moveUserCheckList: [],
      currentRow: {},
    };
  },
  methods: {
    init(contract,id) {
      // console.log("合同 list >>>>>>", contract);
      this.contract = contract;
      this.id = id
      this.getList();
    },

    getList() {
      getData({
        url: "/contract/my_contract_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word: this.serVal,
          use_status: 1,
          customer_id: this.id,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          let arr = list.data;
          arr.map((e) => {
            // console.log(e, this.contract.id);
            e.checked = false;
            if (this.contract && e.id == this.contract.id) {
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
        this.$warning('请选择关联的合同')
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
