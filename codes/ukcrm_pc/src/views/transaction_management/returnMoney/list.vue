<template>
  <div>
    <div class="content_main">
      <div class="table_top_info d-between">
        <div class="l_tabs d-center">
          <!-- 时间筛选 -->
          <div class="select_date">
            <div>
              <el-popover
                popper-class="popover_date"
                placement="bottom-start"
                trigger="click"
                v-model="dateSelect.visible"
              >
                <div slot="reference" class="select_title d-between">
                  {{ dateSelect.txt }}
                  <i class="el-icon-caret-bottom"></i>
                </div>

                <div>
                  <div class="select_time_box d-center">
                    <div>
                      <div
                        class="tip_item"
                        v-for="(item, index) in tipDate"
                        :key="index"
                      >
                        {{ item }}
                      </div>
                    </div>

                    <div class="items d-flex">
                      <div
                        class="item d-center"
                        v-for="(item, index) in dateList"
                        :key="index"
                        @click="change_achi(item)"
                      >
                        <div
                          class="txt d-center"
                          :class="{ active: dateSelect.txt == item }"
                        >
                          {{ item }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="self_txt">自定义</div>
                  <el-date-picker
                    v-model="dateSelect.time"
                    value-format="yyyy-MM-dd"
                    @change="time_achi"
                    @blur="blur_achi"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </div>
              </el-popover>
            </div>
          </div>

          <!-- 部门 -->
          <el-popover
            popper-class="popover_back"
            placement="bottom-start"
            trigger="click"
            v-model="potSelect.visible"
          >
            <div
              class="select_title d-between"
              slot="reference"
              v-if="role_id != 4"
            >
              {{ potSelect.txt || (role_id == 3 ? "本部门" : "全公司") }}
              <i class="el-icon-caret-bottom"></i>
            </div>

            <div>
              <div class="option" @click="change_pot(1)">
                {{ role_id > 2 ? "本部门" : "全公司" }}
              </div>
              <div class="option" @click="change_pot(2)">仅本人</div>

              <!-- 自定义 -->
              <el-popover
                popper-class="branch_popover"
                placement="left-start"
                trigger="click"
                v-model="potSelect.show"
              >
                <div slot="reference">
                  <div class="option">自定义</div>
                </div>

                <div>
                  <div v-if="role_id == 3">
                    <div class="member_tabs d-center">
                      <div class="item">员工列表</div>
                    </div>
                    <div class="member_list" v-infinite-scroll="load">
                      <div
                        class="memeber_item"
                        v-for="(item, index) in member_list"
                        :key="index"
                        @click="pot_member(item)"
                      >
                        {{ item.user.name }}
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="back_tabs d-center">
                      <div
                        class="item"
                        :class="{
                          active: pot_activeTab == v.type,
                          l_item: i == 0,
                        }"
                        v-for="(v, i) in back_tabs"
                        :key="i"
                        @click="changPotTab(v.type)"
                      >
                        {{ v.name }}
                        <div class="line"></div>
                      </div>
                    </div>
                    <div
                      class="member_list"
                      v-if="pot_activeTab == 1"
                      v-infinite-scroll="load"
                    >
                      <div
                        class="memeber_item"
                        v-for="(item, index) in member_list"
                        :key="index"
                        @click="pot_member(item)"
                      >
                        {{ item.user.name }}
                      </div>
                    </div>
                    <div class="depart_list" v-else>
                      <div
                        class="memeber_item"
                        v-for="(item, index) in department_list"
                        :key="index"
                        @click="pot_depart(item)"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
          </el-popover>
        </div>

        <div class="r_btns d-center">
          <div class="top_search search">
            <el-input
                class="search_ipt"
                placeholder="回款编号，客户名称，合同编号"
                prefix-icon="el-icon-search"
                v-model="serVal"
                @keyup.enter.native="serKeyUp()"
            >
            </el-input>
            <button class="search_btn" @click="serKeyUp()">搜索</button>
          </div>

          <div class="item item_btn" @click="addReturn()" v-if="user.role_id">
            <i class="iconfont icon-bj12"></i>
            新建
          </div>
        </div>
      </div>

      <div class="table_box">
        <el-table
          ref="singleTable"
          :data="tableData"
          style="width: 100%"
          :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
          :cell-style="{ color: '#657180', 'font-size': '12px' }"
          height="calc(100vh - 300px)"
        >
          <el-table-column min-width="20"> </el-table-column>

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
                  scope.row.contract
                    ? scope.row.contract.customer_company_name
                    : ""
                }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="关联合同"
            prop="contract.contract_name"
            min-width="90"
             :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div
                class="customer_name com-line-1"
                @click="showContractDetail(scope.row.contract_id)"
              >
                {{ scope.row.contract.contract_name }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="合同金额" prop="money" min-width="90" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="com-line-1">{{ scope.row.contract.money }}元</div>
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
              {{ scope.row.return_time }}
            </template>
          </el-table-column>

          <el-table-column
            label="负责人"
            prop="contract.sign_user"
            min-width="100"
             :show-overflow-tooltip="true"
          >
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
      </div>
    </div>

    <!-- 详情 -->
    <returndetail
      v-if="detailShow"
      ref="refDetail"
      @edit="addReturn"
      @cancel="hideDetail"
    ></returndetail>

    <!-- 新建回款 -->
    <add-return
      v-if="addReturnShow"
      ref="refAddReturn"
      @cancel="hideaddReturn"
    ></add-return>

    <!-- 合同详情 -->
    <contract-detail
      v-if="c_detailShow"
      ref="c_refDetail"
      @edit="addContract"
      @cancel="hideContractDetail"
    ></contract-detail>

    <!-- 新建合同 -->
    <add-contract
      v-if="addContractShow"
      ref="refAddContract"
      @cancel="hideAddContract"
    ></add-contract>
  </div>
</template>

<script>
import addReturn from "./component/add.vue";
import returndetail from "./component/detail.vue";

import contractDetail from "@/views/transaction_management/contract/component/detail.vue";
import addContract from "@/views/transaction_management/contract/component/add.vue";

import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      serVal: "",

      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,
      role_id: "",

      addReturnShow: false,
      detailShow: false,

      c_detailShow: false,
      addContractShow: false,

      levelList: ["全部","A类(重要客户)", "B类(普通客户)",'C类(非优先客户)'], // 级别

      dateList: [],
      tipDate: ["天", "周", "月", "季", "年"],
      dateSelect: {
        visible: false,
        activeDate: "本年度",
        time: "",
        txt: "本年度",
      },

      potSelect: {
        visible: false,
        show: false,
        txt: "",
      },

      top_depart: 0,
      top_user: 0,

      department_list: [],
      member_list: [],
      pot_activeTab: 1,

      back_tabs: [
        {
          name: "员工列表",
          type: 1,
        },
        {
          name: "部门列表",
          type: 2,
        },
      ],
    };
  },
  created() {
    this.user = store.state.userInfo;
    this.role_id = this.user.role_id;

    this.init();
    this.getTimeSearch();
    this.get_member();
  },
  methods: {
    init(type, id, name) {
      let info = this.dateSelect;
      let timing = info.activeDate;
      if (info.time.length > 0) {
        timing = info.time;
      }

      getData({
        url: "/payment_collection/all_payment_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word: this.serVal,

          timing,
          user_id:this.top_user,
          department_id:this.top_depart,
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

    getTimeSearch() {
      getData({
        url: "/index/time_search",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { time_search },
        } = res;
        if (code === 200) {
          this.dateList = time_search;
        }
      });
    },
    change_achi(item) {
      this.dateSelect = {
        visible: false,
        activeDate: item,
        time: [],
        txt: item,
      };
      this.init();
    },
    time_achi(e) {
      this.dateSelect = {
        visible: false,
        activeDate: "",
        time: e,
        txt: `${e[0]}至${e[1]}`,
      };
    },
    blur_achi() {
      this.init();
    },

    // 选择部门成员
    change_pot(e) {
      if(e == 1) {
        this.top_user = "";
        this.top_depart = this.user.department_id;
        this.potSelect.txt = this.role_id > 2 ? "本部门" : "全公司";
      }else {
        this.top_user = this.user.id;
        this.top_depart = "";
        this.potSelect.txt = "仅本人";
      }
      this.init();
      this.potSelect.visible = false;
      this.potSelect.show = false;
    },

    changPotTab(type) {
      this.pot_activeTab = type;
      this.page = 1;
      if (type == 1) {
        this.get_member();
      } else {
        this.get_department();
      }
    },
    pot_member(v) {
      this.top_user = v.user_id;
      this.top_depart = "";
      this.potSelect.txt = v.user.name;
      this.init();
      this.potSelect.visible = false;
      this.potSelect.show = false;
    },
    pot_depart(v) {
      this.top_user = "";
      this.top_depart = v.id;
      this.potSelect.txt = v.name;
      this.init();
      this.potSelect.visible = false;
      this.potSelect.show = false;
    },

    get_department() {
      getData({
        url: "/department/list ",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { department_list, msg },
        } = res;
        if (code === 200) {
          this.department_list = department_list;
        } else {
          this.department_list = [];
          this.$err(msg);
        }
      });
    },

    get_member() {
      getData({
        url: "/company/company_department_member",
        data: {
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          let data = user_list && user_list.data;
          if (this.page != 1) {
            this.member_list = data.concat(this.member_list);
          } else {
            this.member_list = data;
          }
          this.last_page = user_list ? user_list.last_page : 1;
        }
      });
    },

    load() {
      if (this.page < this.last_page) {
        this.page += 1;
        this.get_member();
      }
    },
    // 部门筛选 部门筛选 部门筛选 部门筛选 部门筛选 部门筛选

    // 搜索
    serKeyUp() {
      this.page = 1;
      this.init();
    },

    chooseLevel(i) {
      // console.log(i);
      this.selectInfo.activeLevel = i;
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

    showDetail(row_id) {
      // console.log("详情 id》》》", row_id);

      this.detailShow = true;
      this.$nextTick(() => {
        this.$refs.refDetail.init(row_id);
      });
    },
    hideDetail() {
      this.detailShow = false;
    },

    // 新建回款 新建回款 新建回款 新建回款 新建回款
    addReturn(row) {
      if (this.user.role_id < 1) {
        return this.$warning("暂无企业，无法新建回款");
      }

      // console.log("return_list > 新建、编辑回款 >>>", row);
      this.addReturnShow = true;

      this.$nextTick(() => {
        this.$refs.refAddReturn.init({
          return_id: row ? row.id : "",
          contract_id: row ? row.contract.id : "",
        });
      });
    },
    hideaddReturn({ update_list, isEdit, return_id }) {
      if (update_list) {
        this.init();
      }

      if (isEdit) {
        this.$nextTick(() => {
          this.showDetail(return_id);
        });
      }
      this.addReturnShow = false;
    },
    // 新建回款 新建回款 新建回款 新建回款 新建回款

    showContractDetail(row_id) {
      // console.log("详情 id》》》", row_id);

      this.c_detailShow = true;
      this.$nextTick(() => {
        this.$refs.c_refDetail.init(row_id);
      });
    },
    hideContractDetail() {
      this.c_detailShow = false;
    },

    // 新建合同 新建合同 新建合同 新建合同 新建合同 新建合同
    addContract(row) {
      // console.log("新建、编辑 >>>", row);
      this.addContractShow = true;

      this.$nextTick(() => {
        this.$refs.refAddContract.init(row ? row.id : "");
      });
    },
    hideAddContract({ update_list, isEdit, contract_id }) {
      this.activeName = "contract";

      if (update_list) {
        this.$nextTick(() => {
          this.$refs.contractList.init(1);
        });
      }

      if (isEdit) {
        this.$nextTick(() => {
          this.$refs.contractList.showDetail(contract_id);
        });
      }
      this.addContractShow = false;
    },
    // 新建合同 新建合同 新建合同 新建合同 新建合同 新建合同
  },
  components: {
    addReturn,
    returndetail,
    contractDetail,
    addContract,
  },
};
</script>

<style lang="less" scoped>
.table_top_info {
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
}

/deep/.el-table {
  /*border: 1px solid #EAEDF2;*/
}

/deep/.el-date-editor {
  width: 100%;
}

.popover_back {
  width: 150px !important;
  .option {
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
  .option:hover {
    background: #f3f3f3;
  }
}

.search { 
  .el-input {
    width: 230px;
  }
}
// 部门筛选
.branch_popover {
  padding: 17px 30px 10px;
  width: 250px;
  height: 331px;
  background: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
}

.back_tabs {
  overflow: hidden;
  flex-shrink: 0;

  .item {
    width: 50px;
    font-size: 12px;
    font-weight: 400;
    color: #657180;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;

    .line {
      margin-top: 13px;
      width: 100%;
      height: 4px;
      background: #fff;
      border-radius: 4px;
    }
  }
  .l_item {
    margin-right: 30px;
  }

  .active {
    color: #4d6fff;
    font-weight: 600;

    .line {
      background-color: #4d6fff;
    }
  }
}
.member_tabs {
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
  .item {
    width: 80px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-bottom: 4px solid #fff;
    font-size: 12px;
    font-weight: 600;
    color: #464c5b;
    cursor: pointer;
    padding-bottom: 10px;
  }
}
.member_list {
  padding: 10px 0;
  height: 260px;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.depart_list {
  padding: 10px 0;
  height: 260px;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.memeber_item {
  height: 30px;
  line-height: 30px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
}
.memeber_item:hover {
  background: #f3f2f3;
}
</style>
