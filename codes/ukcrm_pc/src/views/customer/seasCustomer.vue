<template>
  <div class="">
    <div class="content_main">
      <div class="table_top_info d-between">
        <div class="l_tabs d-center">
          <div class="item">公海客户</div>
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

          <div class="item item_btn" @click="onAdd()" v-if="user.role_id">
            <i class="iconfont icon-bj12"></i>
            新建
          </div>

          <!-- <div class="item item_btn item_btn_fff">
            <i class="iconfont icon-bj12"></i>
            导入
          </div> -->
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
        >
          <el-table-column type="selection"> </el-table-column>

          <el-table-column
            prop="name"
            label="客户名称"
            min-width="100"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div
                class="customer_name com-line-1"
                @click="customerDetail(scope.row.id)"
              >
                {{ scope.row.name }}
              </div>
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
            <template slot="header" slot-scope="scope">
              <el-dropdown
                @command="chooseLevel"
                :class="{ hightLight: selectInfo.activeLevel != '' }"
              >
                <span class="el-dropdown-link">
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
          </el-table-column>

          <el-table-column label="企业角色" prop="company_role" min-width="100" :show-overflow-tooltip="true">
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

          <el-table-column label="创建人" prop="user.name" min-width="90" :show-overflow-tooltip="true">
          </el-table-column>

          <el-table-column
            label="最近跟进时间"
            prop="modify_at"
            sortable
            min-width="130"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div class="text-nowarp  com-line-1">
                {{ scope.row.modify_at }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="创建时间"
            prop="created_at"
            sortable
            min-width="90"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div class="text-nowarp  com-line-1">
                {{ scope.row.created_at }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="140">
            <template slot-scope="scope">
              <div class="operation_box d-flex">
                <div
                  class="item"
                  @click="onAdd(scope.row.id)"
                  v-if="user.role_id > 0 && user.role_id < 3"
                >
                  编辑
                </div>
                <div
                  class="item"
                  @click="delCustomer('one', scope.row)"
                  v-if="user.role_id > 0 && user.role_id < 3"
                >
                  删除
                </div>
                <div class="item" @click="followCustomer('one', scope.row)">
                  跟进
                </div>
                <div
                  class="item"
                  @click="allot('one', scope.row)"
                  v-if="user.role_id > 0 && user.role_id < 4"
                >
                  分配
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

        <div class="btm_box d-between">
          <div class="all_check_box d-flex" v-if="moveUserCheckList.length > 0">
            <el-checkbox
              v-model="allChecked"
              @change="allCheckChange"
            ></el-checkbox>

            <div class="txt">
              已选
              {{ moveUserCheckList.length }}
              项
            </div>

            <el-button
              class="move_btn"
              @click="allot('all')"
              v-if="user.role_id > 0 && user.role_id < 4"
            >
              分配
            </el-button>

            <el-button class="move_btn" @click="followCustomer('all')">
              跟进
            </el-button>

            <el-button
              class="move_btn"
              @click="delCustomer('all')"
              v-if="user.role_id > 0 && user.role_id < 3"
            >
              删除
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

    <!-- 分配客户 -->
    <allot-customer
      :allotDialogShow="allotDialogShow"
      :moveType="moveType"
      :activeCustomer="activeCustomer"
      :moveUserCheckList="moveUserCheckList"
      @hideAllotDialog="hideAllotDialog"
    ></allot-customer>
  </div>
</template>

<script>
import add from "./component/add.vue";
import allotCustomer from "./component/allotCustomer.vue";

import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      user: {},
      serVal: "",

      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,

      selectInfo: {
        // 接口世界请求的 值
        activeLevel: "", // 级别
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

      levelList: ["全部","A类(重要客户)", "B类(普通客户)",'C类(非优先客户)'], // 级别
      roleList: ["全部"], // 角色
      fromList: ["全部"], // 来源
      statusList: ["全部"], // 客户状态
      tagList: ["全部"], // 标签

      addShow: false, // 新增客户

      allotDialogShow: false, // 分配 客户
      moveType: "", // one 单个操作 、 all 批量操作
      // activeMember: {}, // 选中移交成员
      activeCustomer: {}, // 要移交的客户
      moveUserCheckList: [], //表格选中的row
      createLoading: false,
    };
  },
  created() {
    let user = store.state.userInfo;
    this.user = user;

    this.preset();
    this.init();

    this.$emit("change");
  },
  methods: {
    init() {
      this.getSeasCustomer();
      this.get_area();
    },
    // 公海 列表
    getSeasCustomer() {
      let levelIndex = this.selectInfo.activeLevel;
      let roleIndex = this.selectInfo.activeRole;
      let fromIndex = this.selectInfo.activeFrom;
      let statusIndex = this.selectInfo.activeStatus;
      let tagIndex = this.selectInfo.activeTag;

      let params = {
        type: "sea",
        page: this.page,
        pagesize: this.pagesize,
        search_word: this.serVal,
        province: this.province,
        city: this.city,
        area: this.area,
        level: !levelIndex ? "" : this.levelList[levelIndex],
        company_role: !roleIndex ? "" : this.roleList[roleIndex],
        from: !fromIndex ? "" : fromIndex,
        customer_status: !statusIndex ? "" : this.statusList[statusIndex],
        tag: !tagIndex ? "" : tagIndex,
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
    // 省
    get_area() {
      getData({ url: `/customer/customer_area?customer_type=1` }).then(
        (res) => {
          const {
            code,
            data: { area_list },
          } = res;
          if (code === 200) {
            this.areaColumns = this.dg(area_list);
          }
        }
      );
    },

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
    chooseRole(i) {
      this.selectInfo.activeRole = i;
      this.init();
    },
    chooseFrom(i) {
      this.selectInfo.activeFrom = i;
      this.init();
    },
    chooseIndustry(i) {
      this.selectInfo.activeIndustry = i;
      this.init();
    },
    chooseStatus(i) {
      this.selectInfo.activeStatus = i;
      this.init();
    },
    chooseTag(i) {
      this.selectInfo.activeTag = i;
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

    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },

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

    // 分配客户 分配客户 分配客户 分配客户 分配客户 分配客户 分配客户
    // 隐藏弹框
    hideAllotDialog(update) {
      // console.log("update >>", update);
      this.allotDialogShow = false;
      if (update) {
        this.init();
      }
    },
    // 1 点击移交 展示弹框
    allot(type, row = {}) {
      // console.log(type, row);

      this.moveType = type;
      this.activeCustomer = row;

      // 批量
      if (type == "all") {
        if (this.moveUserCheckList.length <= 0) {
          return this.$warning("请选择客户");
        }
      }

      this.allotDialogShow = true;
    },
    // 分配客户 分配客户 分配客户 分配客户 分配客户 分配客户 分配客户

    // 跟进客户 跟进客户 跟进客户 跟进客户 跟进客户 跟进客户
    followCustomer(type, row = {}) {
      this.activeCustomer = row;

      if (type == "all") {
        if (this.moveUserCheckList.length <= 0) {
          return this.$warning("请选择客户");
        }
      }

      this.$confirm("确定跟进该客户吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        confirmButtonClass: "msgBoxBtn",
        cancelButtonClass: "msgBoxBtn_cancel",
        type: "warning",
      })
        .then(() => {
          let ids = [];
          if (type == "all") {
            let arr = this.moveUserCheckList;
            arr.map((e) => {
              ids.push(e.id);
            });
          } else {
            ids = [this.activeCustomer.id];
          }

          postData({
            url: "/customer/follow_customer",
            data: {
              customer_ids: ids,
            },
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$success(msg);
              this.init();
            } else if (code === 422) {
              this.$err(msg);
            }
          });
        })
        .catch(() => {});
    },
    // 跟进客户 跟进客户 跟进客户 跟进客户 跟进客户 跟进客户

    // 删除客户 删除客户 删除客户 删除客户 删除客户 删除客户
    delCustomer(type, row = {}) {
      this.activeCustomer = row;
      // console.log(111, row);

      if (type == "all") {
        if (this.moveUserCheckList.length <= 0) {
          return this.$warning("请选择客户");
        }
      }

      this.$confirm(
        "删除后，客户相关的报价等数据将一并删除可在回收站中撤销删除动作",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          confirmButtonClass: "msgBoxBtn",
          cancelButtonClass: "msgBoxBtn_cancel",
          type: "warning",
        }
      )
        .then(() => {
          let ids = [];

          if (type == "all") {
            let arr = this.moveUserCheckList;
            arr.map((e) => {
              ids.push(e.id);
            });
          } else {
            ids = [this.activeCustomer.id];
          }

          postData({
            url: "/customer/recycle",
            data: {
              customer_ids: ids,
            },
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$success(msg);
              this.init();
            } else if (code === 422) {
              this.$err(msg);
            }
          });
        })
        .catch(() => {});
    },
    // 删除客户 删除客户 删除客户 删除客户 删除客户 删除客户

    customerDetail(customer_id) {
      // console.log(customer_id);

      this.$router.push({
        path: "/seas_customer_detail",
        query: {
          customer_id: customer_id,
        },
      });
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
    allotCustomer,
  },
};
</script>

<style lang="less" scoped>
.table_top_info {
  margin-bottom: 12px;

  .l_tabs {
    .item {
      font-size: 20px;
      font-weight: 600;
      color: #464c5b;
    }
  }
}

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

  // .el-table__header-wrapper {
  //   overflow: initial !important;
  // }

  .is-leaf {
    overflow: initial !important;
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
.el-message-box {
  width: 480px;
  padding: 0 9px 18px !important;

  .el-message-box__header {
    padding: 18px 20px 20px !important;

    .el-message-box__title {
      span {
        font-weight: 600 !important;
        font-size: 16px;
        color: #333333;
      }
    }
  }

  .el-message-box__btns {
    padding-top: 30px !important;
  }

  .el-message-box__message {
    font-size: 12px;
    color: #657180;
  }
}

.msgBoxBtn {
  width: 68px;
  font-size: 14px;
  background-color: #4d6fff !important;
  border-color: #4d6fff;
}
.msgBoxBtn_cancel {
  width: 68px;
  font-size: 14px;
  color: #666666;
  background-color: #dddddd !important;
  border-color: #fafafa;
}

.msgBoxBtn_cancel:hover {
  color: #666666 !important;
  background-color: #dddddd !important;
  border-color: #fafafa !important;
}


</style>
