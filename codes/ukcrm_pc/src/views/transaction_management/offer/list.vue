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
              slot="reference"
              class="select_title d-between"
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
                placeholder="编号、客户、产品"
                prefix-icon="el-icon-search"
                v-model="serVal"
                @keyup.enter.native="serKeyUp()"
            >
            </el-input>
            <button class="search_btn" @click="serKeyUp()">搜索</button>
          </div>

          <div class="item item_btn" @click="addOffer()" v-if="user.role_id">
            <i class="iconfont icon-bj12"></i>
            新建
          </div>
        </div>
      </div>

      <div class="table_box">
        <el-table
          ref="singleTable"
          :data="tableData"
          style="width: 100%; max-height: 700px; overflow: auto"
          :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
          :cell-style="{ color: '#657180', 'font-size': '12px' }"
          height="calc(100vh - 300px)"
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
              <div class="com-line-1">{{ scope.row.offer_time }}</div>
            </template>
          </el-table-column>

          <el-table-column label="报价人" prop="user.name" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="com-line-1">{{ scope.row.user.name }}</div>
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="examine_name" min-width="100" :show-overflow-tooltip="true">
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseStatus">
                <span
                  class="el-dropdown-link"
                  :class="{
                    hightLight:
                      selectInfo.activeStatus !== '全部' &&
                      selectInfo.activeStatus !== '',
                  }"
                >
                  状态
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v, i) in statusList"
                    :key="i"
                    :command="i"
                  >
                    {{ v }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
             <div class="com-line-1">{{ scope.row.overdue_time || "-" }}</div>
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
      </div>
    </div>

    <!-- 新建报价 -->
    <add-offer
      v-if="addOfferShow"
      ref="refAddOffer"
      @cancel="hideaddOffer"
    ></add-offer>

    <!-- 详情 -->
    <offer-detail
      v-if="detailShow"
      ref="refDetail"
      @edit="addOffer"
      @cancel="hideDetail"
    ></offer-detail>
  </div>
</template>

<script>
import addOffer from "./component/add.vue";
import offerDetail from "./component/detail.vue";

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
      user: {},
      role_id: "",

      addOfferShow: false,
      detailShow: false,
      use_status: "",
      customer_id: "",

      statusList: [],
      selectInfo: {
        activeStatus: "",
      },

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
    if(this.$route.query?.offerShow){
      this.showDetail(store.state.SocketMsg.id)
    }
    let user = store.state.userInfo;
    this.user = user;
    this.role_id = this.user.role_id;

    this.init();
    this.getTimeSearch();
    this.get_member();
  },
  methods: {
    // 报价单
    init(type, id, name) {
      let info = this.dateSelect;
      // console.log(info);
      let timing = info.activeDate;
      if (info.time.length > 0) {
        timing = info.time;
      }

      getData({
        url: "/offer/offer_record_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word: this.serVal,

          customer_id: "",
          status:
            this.selectInfo.activeStatus == "全部"
              ? ""
              : this.selectInfo.activeStatus,
          timing,
          user_id:this.top_user,
          department_id:this.top_depart,
        },
      }).then((res) => {
        const {
          code,
          data: { list, offer_status },
        } = res;
        if (code === 200) {
          this.statusList = offer_status;
          this.statusList.unshift("全部");
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

      this.$emit("tabChang", "contract");
    },
    hideDetail() {
      this.detailShow = false;
      this.init();
    },

    chooseStatus(i) {
      this.selectInfo.activeStatus = i == 0 ? "" : i - 1;
      this.init();
    },

    // 新建报价 新建报价 新建报价
    addOffer(row) {
      if (this.user.role_id < 1) {
        return this.$warning("暂无企业，无法新建报价");
      }

      // console.log("return_list  list> 新建、编辑报价 >>>", row);
      this.addOfferShow = true;

      this.$nextTick(() => {
        this.$refs.refAddOffer.init({ offer_id: row ? row.id : false });
      });
    },
    hideaddOffer({ update_list }) {
      if (update_list) {
        this.init();
      }

      this.addOfferShow = false;
    },
    // 新建报价 新建报价 新建报价
  },
  components: {
    addOffer,
    offerDetail,
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
      background: #f4f7fb;
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
</style>

<style lang="less" scoped>
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