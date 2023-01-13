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
        <div class="title">添加产品</div>
        <div class="top_search search">
          <el-input
            class="search_ipt"
            placeholder="产品名称、编码"
            prefix-icon="el-icon-search"
            v-model="serVal"
            @keyup.enter.native="serKeyUp()"
          >
          </el-input>
          <button class="search_btn" @click="serKeyUp()">搜索</button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
        :cell-style="{ color: '#657180', 'font-size': '12px' }"
        @selection-change="tableSelectionChange"
        style="width: 100%; overflow: auto"
        height="550"
      >
        <el-table-column type="selection"> </el-table-column>

        <el-table-column prop="name" label="产品名称" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="level" label="产品分类" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              <span v-if="scope.row.s_classify">
                {{ scope.row.s_classify.name }}
              </span>
              <span v-else-if="scope.row.f_classify">
                {{ scope.row.f_classify.name }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="product_no"
          label="产品编码"
          min-width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.product_no }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="company" label="是否上下架" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1" v-if="scope.row.is_online == 1">已上架</div>
            <div class="com-line-1" v-else>已下架</div>
          </template>
        </el-table-column>

        <el-table-column label="创建人" prop="user.name" :show-overflow-tooltip="true"> 
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.user.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="更新时间"
          prop="updated_at"
          min-width="100"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.updated_at }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          prop="created_at"
          min-width="100"
          sortable
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.created_at }}
            </div>
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

      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,
      moveUserCheckList: [], // 选中的产品

      offer_product: [], // 创建报价带过来的报价产品
    };
  },
  methods: {
    init(offer_product) {
      this.offer_product = offer_product;
      // this.moveUserCheckList = product;
      this.getList();
    },

    getList() {
      let offer_product = this.offer_product;

      getData({
        url: "/product/product_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word: this.serVal,
          is_online: 1,
        },
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        if (code === 200) {
          let arr = list.data;
          this.tableData = arr;
          this.total = list.total;

          this.$nextTick(() => {
            arr.forEach((e) => {
              if (offer_product.length > 0) {
                offer_product.forEach((v) => {
                  if (v.product.id == e.id) {
                    this.$refs.multipleTable.toggleRowSelection(e, true);
                  }
                });
              }
            });
          });
        } else {
          this.tableData = [];
          this.total = 0;
          this.$err(msg);
        }
      });
    },
    // 搜索
    serKeyUp() {
      this.page = 1;
      this.getList();
    },

    tableSelectionChange(row) {
      this.moveUserCheckList = row;
    },

    change(row) {
      row.checked = !row.checked;
    },

    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },

    submitForm() {
      let product = this.offer_product;
      let checkList = this.moveUserCheckList;

      if(checkList.length == 0) {
        this.$warning('请选择添加的产品')
      }else {
        this.$emit("confirm", checkList);
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
    background-color: #F3F7F9!important;
  }
  td {
    padding: 0 !important;
    height: 48px !important;
  }

  .cell {
    overflow: initial;
    justify-content: start !important;
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
