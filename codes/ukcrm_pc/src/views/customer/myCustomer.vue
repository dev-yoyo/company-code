<template>
  <div>
    <div class="content_main">
      <div class="table_top_info d-between">
        <div class="l_tabs d-center">
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

        <div class="r_btns d-center">
          <div class="top_search search">
            <el-input
              class="search_ipt"
              placeholder="姓名、手机、公司"
              prefix-icon="el-icon-search"
              v-model="serVal"
              @keyup.enter.native="serKeyUp()"
            >
            </el-input>
            <button class="search_btn" @click="serKeyUp()">搜索</button>
          </div>

          <div class="item item_btn" @click="onAdd()" v-if="user.role_id"><i class="iconfont icon-bj12"></i>新建</div>

          <div v-if="user.role_id" class="item item_btn item_btn_fff" @click="importBtn"><i class="iconfont icon-bj12"></i>导入</div>
        </div>
      </div>
      <div class="table_box">
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
          :cell-style="{ color: '#657180', 'font-size': '12px' }"
          @selection-change="tableSelectionChange"
          height="calc(100vh - 300px)"
          @sort-change="tableSortChange"
          v-if="activeTab == 'my'"
        >
          <el-table-column type="selection"> </el-table-column>

          <el-table-column
            prop="deal_status"
            label="成交状态"
            min-width="100"
            fixed
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseDeal">
                <span class="el-dropdown-link">
                  成交状态
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v, i) in dealStatusList"
                    :key="i"
                    :command="i"
                  >
                    {{ v }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

            <template slot-scope="scope">
              <div
                class="com-line-1"
                :class="
                  scope.row.deal_status === true ? 'deal-success ' : 'deal-fail'
                "
              >
                <div
                  :class="
                    scope.row.deal_status === true
                      ? 'deal-success-icon '
                      : 'deal-fail-icon'
                  "
                ></div>
                {{ scope.row.deal_status ? "已成交" : "未成交" }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="跟进时间"
            prop="follow_at"
            min-width="100"
            sortable="custom"
            fixed
          >
            <template slot-scope="scope">
              <div style="width: 100px">
                {{ scope.row.follow_at ? scope.row.follow_at : "" }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            fixed
            prop="name"
            label="客户名称"
            min-width="100"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div
                class="customer_name com-line-1"
                @click="customerDetail(scope.row)"
              >
                {{ scope.row.name }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="company"
            label="企业名称"
            min-width="190"
            :show-overflow-tooltip="true"
          >
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
            <template slot="header" slot-scope="scope">
              <el-popover
                popper-class="popover_area"
                placement="bottom-start"
                trigger="hover"
              >
                <div
                  slot="reference"
                  :class="{
                    hightLight: province !== '' || city !== '' || area !== '',
                  }"
                >
                  所在地区
                  <i class="el-icon-caret-bottom"></i>
                </div>

                <el-cascader-panel
                  :options="areaColumns"
                  :props="{ checkStrictly: true }"
                  @change="change_cate"
                  clearable
                ></el-cascader-panel>
              </el-popover>
            </template>

            <template slot-scope="scope">
              <div class="com-line-1">
                <span v-if="scope.row.area">
                  {{ scope.row.area.name }}
                </span>

                <span v-if="scope.row.area_city">
                  {{ scope.row.area_city.name }}
                </span>

                <span v-if="scope.row.area_area">
                  {{ scope.row.area_area.name }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="level"
            label="级别"
            min-width="100"
            :show-overflow-tooltip="true"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseLevel">
                <span
                  class="el-dropdown-link"
                  :class="{ hightLight: selectInfo.activeLevel != '' }"
                >
                  级别
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v, i) in levelList"
                    :key="i"
                    :command="i"
                  >
                    {{ v }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

            <template slot-scope="scope">
              <div class="com-line-1">
                {{ scope.row.level || "-" }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="联系方式"
            prop="phone"
            min-width="120"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column label="企业角色" prop="company_role" min-width="100">
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseRole">
                <span
                  class="el-dropdown-link"
                  :class="{ hightLight: selectInfo.activeRole != '' }"
                >
                  企业角色
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v, i) in roleList"
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
            label="来源"
            min-width="90"
            :show-overflow-tooltip="true"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseFrom">
                <span
                  class="el-dropdown-link"
                  :class="{ hightLight: selectInfo.activeFrom != '' }"
                >
                  来源
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v, i) in fromList"
                    :key="i"
                    :command="i"
                  >
                    {{ v }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

            <template slot-scope="scope">
              <div class="com-line-1">
                {{ scope.row.from ? fromList[scope.row.from] : "-" }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="负责人"
            prop="user_customer.user.name"
            min-width="80"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="客户行业"
            min-width="120"
            :show-overflow-tooltip="true"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseIndustry">
                <span
                  class="el-dropdown-link"
                  :class="{ hightLight: selectInfo.activeIndustry != '' }"
                >
                  客户行业
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v, i) in industryList"
                    :key="i"
                    :command="i"
                  >
                    {{ v }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

            <template slot-scope="scope">
              <div class="com-line-1">
                {{ scope.row.industry || "-" }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="客户状态"
            min-width="100"
            :show-overflow-tooltip="true"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseStatus">
                <span
                  class="el-dropdown-link"
                  :class="{ hightLight: selectInfo.activeStatus != '' }"
                >
                  客户状态
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

            <template slot-scope="scope">
              <div class="com-line-1">
                {{ scope.row.customer_status === 0 ? "新获取" : "老客户" }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="客户标签"
            min-width="100"
            :show-overflow-tooltip="true"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown @command="chooseTag">
                <span
                  class="el-dropdown-link"
                  :class="{ hightLight: selectInfo.activeTag != '' }"
                >
                  客户标签
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v, i) in tagList"
                    :key="i"
                    :command="i"
                  >
                    {{ v }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

            <template slot-scope="scope">
              <div class="com-line-1">
                {{ scope.row.tag ? tagList[scope.row.tag] : "-" }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="更新时间"
            prop="modify_at"
            min-width="130"
            sortable="custom"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="创建时间"
            prop="created_at"
            min-width="100"
            sortable="custom"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <div class="operation_box d-flex">
                <div class="item" @click="onAdd(scope.row.id)">编辑</div>
                <div class="item" @click="moveCustomer('one', scope.row)">
                  移交
                </div>
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

        <!-- 全部客户 -->
        <allcustomer
          :tableData="tableData"
          :levelList="levelList"
          :dealStatusList="dealStatusList"
          :roleList="roleList"
          :fromList="fromList"
          :statusList="statusList"
          :tagList="tagList"
          :industryList="industryList"
          :areaColumns="areaColumns"
          @chooseLevel="chooseLevel"
          @chooseDeal="chooseDeal"
          @chooseRole="chooseRole"
          @chooseFrom="chooseFrom"
          @chooseIndustry="chooseIndustry"
          @chooseStatus="chooseStatus"
          @chooseTag="chooseTag"
          @customerDetail="customerDetail"
          @tableSortChange="tableSortChange"
          @change_cate="change_cate"
          v-else
        >
        </allcustomer>

        <div class="btm_box d-between">
          <div
            class="all_check_box d-flex"
            v-if="activeTab == 'my' && moveUserCheckList.length > 0"
          >
            <el-checkbox
              v-model="allChecked"
              @change="allCheckChange"
            ></el-checkbox>
            <div class="txt">批量管理</div>
            <el-button class="move_btn" @click="moveCustomer('all')">
              移交
            </el-button>
          </div>

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

    <!-- 新增 -->
    <add v-if="addShow" ref="add" @cancel="hideadd"></add>

    <!-- 导入 -->
    <move-member
      ref="import"
      :dialogShow="dialogShow"
      :moveType="moveType"
      :activeCustomer="activeCustomer"
      :moveUserCheckList="moveUserCheckList"
      @hideDialog="hideDialog"
    ></move-member>

    <customer-import
      ref="import"
      :dialogShow="importShow"
      @hideDialog="hideImportDialog"
    ></customer-import>
  </div>
</template>

<script>
import add from "./component/add.vue";
import allcustomer from "./component/all_customer.vue";
import moveMember from "./component/moveMember.vue";
import customerImport from "./component/customerImport.vue";

import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      user: {},
      serVal: "",
      activeTab: "my",
      tabs: [
        {
          name: "我负责的",
          type: "my",
        },
      ],

      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,

      selectInfo: {
        // 接口世界请求的 值
        activeLevel: "", // 级别
        activeDeal: "", // 成交状态
        activeRole: "",
        activeFrom: "",
        activeStatus: "",
        activeTag: "",
        activeIndustry: "",
      },

      areaColumns: [], // 省市区列表
      province: "",
      city: "",
      area: "",

      levelList: ["全部", "A类(重要客户)", "B类(普通客户)", "C类(非优先客户)"], // 级别
      dealStatusList: ["全部", "已成交", "未成交"], // 成交状态
      roleList: ["全部"], // 角色
      fromList: ["全部"], // 来源
      statusList: ["全部"], // 客户状态
      tagList: ["全部"], // 标签
      industryList: ["全部"], // 行业

      update_modify: null, // 排序参数

      addShow: false, // 新增客户

      dialogShow: false,
      moveType: "", // one 单个操作 、 all 批量操作
      // activeMember: {}, // 选中移交成员
      activeCustomer: {}, // 要移交的客户
      moveUserCheckList: [], //表格选中的row
      createLoading: false,

      importShow: false, // 导入
    };
  },
  created() {
    let user = store.state.userInfo;
    this.user = user;
    if (user.role_id > 0 && user.role_id < 3 && this.tabs.length < 2) {
      this.tabs.unshift({
        name: "全部客户",
        type: "all",
      });
      this.activeTab = "all";
    }

    // 11.23 新增 主管可查看下属的客户
    if(user.role_id == 3){
      this.tabs.push({
        name: "下属负责的客户",
        type: "all",
      });
    }

    this.preset();
    this.init();
    this.industry_list();

    this.$emit("change");
  },
  methods: {
    init() {
      if (this.activeTab == "all") {
        this.getAllCustomer();
      } else if (this.activeTab == "my") {
        this.getClientele();
      }

      this.get_area();
    },
    // 所属行业
    industry_list() {
      getData({
        url: "/company/industry",
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          this.industryList = this.industryList.concat(list);
        }
      });
    },
    // 省
    get_area() {
      let url =
        this.activeTab == "my"
          ? `/customer/customer_area`
          : `/customer/customer_area?search_type=1`;
      getData({ url }).then((res) => {
        const {
          code,
          data: { area_list },
        } = res;
        if (code === 200) {
          this.areaColumns = this.dg(area_list);
        }
      });
    },

    // 全部 列表
    getAllCustomer() {
      let levelIndex = this.selectInfo.activeLevel;
      let dealIndex = this.selectInfo.activeDeal;
      let roleIndex = this.selectInfo.activeRole;
      let fromIndex = this.selectInfo.activeFrom;
      let induIndex = this.selectInfo.activeIndustry;
      let statusIndex = this.selectInfo.activeStatus;
      let tagIndex = this.selectInfo.activeTag;

      let params = {
        type: "all",
        page: this.page,
        pagesize: this.pagesize,
        search_word: this.serVal,
        province: this.province,
        city: this.city,
        area: this.area,
        level: !levelIndex ? "" : this.levelList[levelIndex],
        company_role: !roleIndex ? "" : this.roleList[roleIndex],
        from: !fromIndex ? "" : fromIndex,
        industry: !induIndex ? "" : this.industryList[induIndex],
        customer_status: !statusIndex ? "" : this.statusList[statusIndex],
        tag: !tagIndex ? "" : tagIndex,
        deal: !dealIndex ? "" : dealIndex,
        update_modify: this.update_modify ? this.update_modify : "",
      };

      getData({
        url: "/customer",
        data: params,
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        if (code === 200) {
          let tdata = list.data.map((i) => {
            if (i.phone) {
              return i;
            } else {
              i.phone = i.wechat;
            }
            return i;
          });
          this.tableData = tdata;
          this.total = list.total;
        } else {
          this.tableData = [];
          this.total = 0;
          this.$err(msg);
        }
      });
    },
    // 列表
    getClientele() {
      // console.log(this.province);
      // console.log(this.city);
      // console.log(this.area);
      let levelIndex = this.selectInfo.activeLevel;
      let dealIndex = this.selectInfo.activeDeal;
      let roleIndex = this.selectInfo.activeRole;
      let fromIndex = this.selectInfo.activeFrom;
      let induIndex = this.selectInfo.activeIndustry;
      let statusIndex = this.selectInfo.activeStatus;
      let tagIndex = this.selectInfo.activeTag;
      let params = {
        type: "",
        page: this.page,
        pagesize: this.pagesize,
        search_word: this.serVal,
        province: this.province,
        city: this.city,
        area: this.area,
        // update_modify: this.activeSort + 1,
        level: !levelIndex ? "" : this.levelList[levelIndex],
        company_role: !roleIndex ? "" : this.roleList[roleIndex],
        from: !fromIndex ? "" : fromIndex,
        industry: !induIndex ? "" : this.industryList[induIndex],
        customer_status: !statusIndex ? "" : this.statusList[statusIndex],
        tag: !tagIndex ? "" : tagIndex,
        deal: !dealIndex ? "" : dealIndex,
        update_modify: this.update_modify ? this.update_modify : "",
      };

      getData({
        url: "/customer",
        data: params,
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        if (code === 200) {
          let tdata = list.data.map((i) => {
            if (i.phone) {
              return i;
            } else {
              i.phone = i.wechat;
            }
            return i;
          });
          this.tableData = list.data;
          this.total = list.total;
        } else {
          this.tableData = [];
          this.total = 0;
          this.$err(msg);
        }
      });
    },
    // 标签
    preset() {
      getData({ url: "/customer/tag" }).then((res) => {
        const {
          code,
          data: { company_role, customer_tag, customer_from, customer_status },
        } = res;
        if (code === 200) {
          this.statusList = this.statusList.concat(customer_status);
          this.tagList = this.tagList.concat(customer_tag);
          this.fromList = this.fromList.concat(customer_from);
          this.roleList = this.roleList.concat(company_role);
        }
      });
    },

    changTab(type) {
      this.selectInfo.activeLevel = "";
      this.selectInfo.activeDeal = "";
      this.selectInfo.activeRole = "";
      this.selectInfo.activeFrom = "";
      this.selectInfo.activeStatus = "";
      this.selectInfo.activeTag = "";
      this.selectInfo.activeIndustry = "";
      this.activeTab = type;
      this.page = 1;
      this.init();
    },
    // 搜索
    serKeyUp() {
      this.page = 1;
      this.init();
    },

    chooseLevel(i) {
      // console.log(i);
      this.selectInfo.activeLevel = i;
      this.page = 1;
      this.init();
    },
    // 切换成交状态
    chooseDeal(i) {
      // console.log(i);
      this.selectInfo.activeDeal = i;
      this.page = 1;
      this.init();
    },
    chooseRole(i) {
      this.selectInfo.activeRole = i;
      this.page = 1;
      this.init();
    },
    chooseFrom(i) {
      this.selectInfo.activeFrom = i;
      this.page = 1;
      this.init();
    },
    chooseIndustry(i) {
      this.selectInfo.activeIndustry = i;
      this.page = 1;
      this.init();
    },
    chooseStatus(i) {
      this.selectInfo.activeStatus = i;
      this.page = 1;
      this.init();
    },
    chooseTag(i) {
      this.selectInfo.activeTag = i;
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

    // ----------------地区 ----------------
    dg(list) {
      list.forEach((v) => {
        v.value = v.id + "";
        v.label = v.name + "";
        if (v.children) {
          this.dg(v.children);
        }
      });
      return list;
    },

    change_cate(e) {
      if (e.length > 0) {
        this.province = e[0];
        this.city = e[1];
        this.area = e[2];
      } else {
        this.province = "";
        this.city = "";
        this.area = "";
      }

      this.init();
    },
    // ----------------地区 ----------------

    // 新增编辑信息
    onAdd(customer_id) {
      if (this.user.role_id < 1) {
        return this.$warning("暂无企业，无法新建客户");
      }

      this.addShow = true;
      this.$nextTick(() => {
        // console.log("id >>>>", customer_id);
        this.$refs.add.init(customer_id);
      });
    },
    hideadd(update = false) {
      // console.log("update >>", update);
      if (update) {
        this.init();
      }
      this.addShow = false;
    },

    // 全选
    allCheckChange() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    tableSelectionChange(row) {
      // console.log(row);
      this.moveUserCheckList = row;
    },

    // 排序方法
    tableSortChange(column) {
      if (column.prop === "follow_at") {
        if (column.order === "ascending") {
          this.update_modify = 5;
        } else if (column.order === "descending") {
          this.update_modify = 6;
        } else {
          this.update_modify = null;
        }
      }
      if (column.prop === "modify_at") {
        if (column.order === "ascending") {
          this.update_modify = 2;
        } else if (column.order === "descending") {
          this.update_modify = 1;
        } else {
          this.update_modify = null;
        }
      }
      if (column.prop === "created_at") {
        if (column.order === "ascending") {
          this.update_modify = 4;
        } else if (column.order === "descending") {
          this.update_modify = 3;
        } else {
          this.update_modify = null;
        }
      }
      this.page = 1;
      this.init();
    },

    // 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户

    // 隐藏弹框
    hideDialog(update) {
      this.dialogShow = false;
      if (update) {
        this.init();
      }
    },
    // 1 点击移交 展示弹框
    moveCustomer(type, row = {}) {
      // console.log(type, row);

      this.moveType = type;
      this.activeCustomer = row;

      // 批量
      if (type == "all") {
        if (this.moveUserCheckList.length <= 0) {
          return this.$warning("请选择客户");
        }
      }

      this.dialogShow = true;
    },

    // 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户

    customerDetail(row) {
      // console.log(row);
      // customer_type 0 个人 1  公海

      this.$router.push({
        path: row.customer_type
          ? "/seas_customer_detail"
          : "/my_customer_detail",
        query: {
          customer_id: row.id,
        },
      });
    },

    importBtn() {
      this.importShow = true;
    },
    // 隐藏弹框
    hideImportDialog(update) {
      this.importShow = false;
      if (update) {
        this.init();
      }
    },
  },
  computed: {
    // 批量按钮
    allChecked: {
      get() {
        return this.moveUserCheckList.length == this.tableData.length
          ? true
          : false;
      },
      set() {
        return this.moveUserCheckList.length == this.tableData.length
          ? true
          : false;
      },
    },
  },
  components: {
    add,
    allcustomer,
    moveMember,
    customerImport,
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

// 操作
.operation_box {
  .item {
    margin-right: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #3399ff;
    cursor: pointer;
    white-space: nowrap;
  }
}

.btm_box {
  padding: 0 20px;
  background-color: #fff;

  // 批量操作
  .all_check_box {
    flex-shrink: 0;
    .txt {
      white-space: nowrap;
      font-size: 12px;
      font-weight: 400;
      color: #657180;
      margin: 0 10px;
    }

    .move_btn {
      padding: 0;
      width: 72px;
      height: 32px;
      background: #e5eaff;
      border-radius: 8px;

      font-size: 12px;
      font-weight: 400;
      color: #4d6fff;
    }
  }
}

.el-dropdown-menu {
  max-height: 180px !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
</style>
<style lang="less">
.el-dropdown-menu {
  max-height: 180px !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}

.deal-success {
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #03c919;
  opacity: 1;
  position: relative;
  display: flex;
  align-items: center;
  .deal-success-icon {
    width: 5px;
    height: 5px;
    background: rgba(49, 211, 67, 0.39);
    border-radius: 50%;
    opacity: 1;
    margin-right: 6px;
  }
}

.deal-fail {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 17px;
  color: #657180;
  opacity: 1;
  display: flex;
  align-items: center;
  .deal-fail-icon {
    width: 5px;
    height: 5px;
    background: rgba(101, 113, 128, 0.39);
    border-radius: 50%;
    opacity: 1;
    margin-right: 6px;
  }
}
</style>