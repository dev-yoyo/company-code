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
        <div class="title">关联客户</div>
        <div class="top_search search">
          <el-input
              class="search_ipt"
              placeholder="客户名称、企业名称、联系方式"
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
        style="width: 100%; overflow: auto"
        height="550"
      >
        <el-table-column min-width="50">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked"
              @change="change(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="客户名称" min-width="100"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="customer_name com-line-1">
              {{ scope.row.name }}
            </div>
            <!-- <div
              class="customer_name com-line-1"
              @click="customerDetail(scope.row)"
            >
              {{ scope.row.name }}
            </div> -->
          </template>
        </el-table-column>

        <el-table-column prop="company" label="企业名称" min-width="190" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.company }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="所在地区"
          min-width="130"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="com-line-1">
              <span v-if="scope.row.area">{{ scope.row.area.name }}</span>
              <span v-if="scope.row.area_city">
                {{ scope.row.area_city.name }}
              </span>
              <span v-if="scope.row.area_area">
                {{ scope.row.area_area.name }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="level" label="级别" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.level || "" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="联系方式" prop="phone" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.phone || "" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="企业角色" prop="company_role" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.company_role || "" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="来源" min-width="90" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.from ? fromList[scope.row.from - 1] : "-" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="负责人"
          prop="user_customer.user.name"
          min-width="90"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.user_customer.user.name || "" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="客户行业" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.industry || "-" }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="客户状态" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.customer_status === 0 ? "新获取" : "老客户" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="客户标签" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.tag ? tagList[scope.row.tag - 1] : "-" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" prop="modify_at" min-width="130" sortable :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="com-line-1">
              {{ scope.row.modify_at || "" }}
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
              {{ scope.row.created_at || "" }}
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
      currentRow: {},
      tagList: [],
      fromList: [],
    };
  },
  methods: {
    init(customer) {
      // console.log("客户 list >>>>>>", customer);
      this.customer = customer;
      this.getList();
      this.preset();
    },
    getList() {
      getData({
        url: "/customer",
        data: {
          type: '',
          page: this.page,
          pagesize: this.pagesize,
          search_word: this.serVal,
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
            if (this.customer && e.id == this.customer.id) {
              e.checked = true;
              this.currentRow = e;
            }
          });
          this.tableData = arr;
          this.total = list.total;
        }
      });
    },
    // 标签
    preset() {
      getData({ url: "/customer/tag" }).then((res) => {
        const {
          code,
          data: { customer_tag, customer_from },
        } = res;
        if (code === 200) {
          this.tagList = customer_tag;
          this.fromList = customer_from;
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
        this.$warning('请选择关联的客户')
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
