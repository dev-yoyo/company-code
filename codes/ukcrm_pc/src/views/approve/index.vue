<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <left-menu></left-menu>
      <top-nav active_title="个人中心"></top-nav>

      <div class="content_main">
        <div class="approve">
          <el-tabs v-model="active" @tab-click="handleClick">
            <el-tab-pane label="我发起的审批" name="give">
              <div class="top_info">
                <!-- <el-select v-model="type" placeholder="请选择">
                  <el-option
                    v-for="item in type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> -->
                <div class="l_tabs d-flex">
                  <div
                    class="item"
                    :class="{ active: activeTab == v.type }"
                    v-for="(v, i) in tabs"
                    :key="i"
                    @click="changTab(v.type)"
                  >
                    {{ v.name }}
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="待我审批" name="get" v-if="user.role_id == 1 || user.role_id == 2  || user.role_id == 3">
              <div class="top_info">
                <div class="l_tabs d-flex">
                  <div
                    class="item"
                    :class="{ active: r_activeTab == v.type }"
                    v-for="(v, i) in r_tabs"
                    :key="i"
                    @click="changRtab(v.type)"
                  >
                    {{ v.name }}
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
            :cell-style="{ color: '#657180', 'font-size': '12px' }"
            height="calc(100vh - 350px)"
          >
            <el-table-column width="20"></el-table-column>
            <el-table-column label="审批内容"  :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div
                  class="customer_name com-line-1"
                  @click="showDetail(scope.row)"
                >
                  {{ scope.row.offer_num }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="申请人" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="申请时间" sortable :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.created_at }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="审批类型" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.examine_type }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1">
                  <div v-if="examine_by == 1">
                    <p v-if="scope.row.status == 1">待审批</p>
                    <p v-else-if="scope.row.status == 2">已通过</p>
                    <p v-else-if="scope.row.status == 4">已拒绝</p>
                  </div>
                  <div v-else>
                    <p v-if="scope.row.status == 1">待审批</p>
                    <p v-else-if="scope.row.status == 2">已通过</p>
                    <p v-else-if="scope.row.status == 4">已拒绝</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <template slot="empty">
              <div 
              class="table_empty" >
                <p></p>
                <img
                  v-if="tableData_show"
                  src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
                />
              </div>
            </template>
          </el-table>

          <div class="btm_box d-between">
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
          </div>
        </div>
      </div>
    </div>

    <!-- <add ref="add" v-if="visible"  @cancel="hideadd"></add> -->

    <!-- 详情 -->
    <offer-detail
      v-if="offerDetailShow"
      ref="refOfferDetail"
      @cancel="hideDetail"
    ></offer-detail>
  </div>
</template>

<script>
import { postData, getData } from "@/api/user";
import store from "@/store";
import add from "./add.vue";
import offerDetail from "@/views/transaction_management/offer/component/detail.vue";

export default {
  data() {
    return {
      active: "give",
      examine_by: 1,
      // tab
      activeTab: 1,
      tabs: [
        {
          name: "待审批",
          type: 1,
        },
        {
          name: "已通过",
          type: 2,
        },
        {
          name: "已拒绝",
          type: 4,
        },
      ],
      // 表格
      tableData: [],
      tableData_show: false,
      page: 1,
      pagesize: 15,
      total: 0,

      // tab
      r_activeTab: 1,
      r_tabs: [
        {
          name: "待我审批的",
          type: 1,
        },
        {
          name: "我已审批的",
          type: 2,
        },
      ],

      offerDetailShow: false,

      user:{}
    };
  },
  created() {
    this.user = store.state.userInfo;
    this.init();
  },
  methods: {
    init() {
      getData({
        url: "/offer/examine_and_approve_list",
        data: {
          examine_by: this.examine_by,
          status: this.examine_by == 1 ? this.activeTab : this.r_activeTab,
          examine_type: 1, // 1:报价 2:回款
          pagesize: this.pagesize
        },
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        if (code === 200) {
          this.tableData = list.data;
          this.tableData_show = list.data.length == 0
          if (this.examine_by === 2) {
            if (list.data.length > 0) {
              this.tableData.forEach((v, k) => {
                v.created_at = v.offer_record.created_at;
                v.offer_time = v.offer_record.offer_time;
                v.examine_type = v.offer_record.examine_type;
                v.offer_num = v.offer_record.offer_num;
                v.status = v.offer_record.status;
                v.name = v.offer_record.user.name
              });
            }
          }else {
            if (list.data.length > 0) {
              this.tableData.forEach((v, k) => {
                v.name = v.user.name
              });
            }
          }
          this.total = list.total;
        } else {
          this.tableData = [];
          this.total = 0;
          this.$err(msg);
        }
      });
    },

    handleClick(tab, event) {
      this.examine_by = tab.name == "give" ? 1 : 2;
      this.activeTab = 1;
      this.r_activeTab = 1;
      this.page = 1;
      this.init();
    },

    // --------------------我发起的审批--------------------
    changTab(type) {
      this.activeTab = type;
      this.page = 1;
      this.init();
    },

    changRtab(type) {
      this.r_activeTab = type;
      this.page = 1;
      this.init();
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

    showDetail(row) {
      this.offerDetailShow = true;
      let id = 0
      if(this.active == 'give') {
        id = row.id 
      }else {
        id = row.content_id
      }
      console.log(id)
      this.$nextTick(() => {
        this.$refs.refOfferDetail.init(id);
      });
    },
    hideDetail() {
      this.offerDetailShow = false;
    },
  },
  components: {
    add,
    offerDetail,
  },
};
</script>

<style lang="less" scoped>
.content_main {
  padding: 25px 24px;
  .approve {
    padding: 26px 24px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    background: #fff;
  }

  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  /deep/.el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  /deep/.el-tabs__nav {
    width: 100%;
  }

  /deep/.el-tabs__item {
    width: 100px;
    text-align: center;
    font-size: 16px;
  }

  /deep/.el-tabs__item.is-active {
    color: #4d6fff;
  }
  /deep/.el-tabs__item:hover {
    color: #4d6fff;
  }

  /deep/.el-tabs__active-bar {
    background-color: #3965f9;
  }

  .top_info {
    margin-bottom: 12px;

    .l_tabs {
      border-radius: 5px;
      overflow: hidden;
      flex-shrink: 0;

      .item {
        min-width: 80px;
        padding: 0 10px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: #F4F7FB;
        border: 1px solid #e9ecf2;

        font-size: 12px;
        font-weight: 400;
        color: #9ea7b4;
        cursor: pointer;
      }

      .active {
        font-weight: 600;
        color: #4d6fff;
        background: #fff;
      }
    }

    .r_btns {
      /deep/.el-input {
        width: 192px;
        height: 34px;
        border: 1px solid #e7e7e7;
        border-radius: 8px;

        .el-input__inner {
          height: 100%;
        }
      }

      .item {
        margin-left: 12px;
      }
    }
  }

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
    }

    .is-leaf {
      overflow: initial !important;
    }
  }
}
</style>
