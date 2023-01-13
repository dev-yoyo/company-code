<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <left-menu :activeMenu="activeMenu"></left-menu>
      <top-nav active_title="产品"></top-nav>

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
                    placeholder="产品名称"
                    prefix-icon="el-icon-search"
                    v-model="serVal"
                    @keyup.enter.native="serKeyUp()"
                >
                </el-input>
                <button class="search_btn" @click="serKeyUp()">搜索</button>
            </div>

            <div class="item item_btn" @click="onAdd()" v-if="user.role_id === 1 || user.role_id === 2">
              <i class="iconfont icon-bj12"></i>
              新建
            </div>

            <div class="item item_btn item_btn_fff" @click="toCate()"  v-if="user.role_id === 1 || user.role_id === 2">
              分类管理
            </div>
          </div>
        </div>
        <div class="table_box">
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
            :cell-style="{ color: '#657180', 'font-size': '12px' }"
            height="calc(100vh - 300px)"
          >
          <el-table-column width="20"> </el-table-column>

            <el-table-column prop="name" label="产品名称" min-width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="customer_name com-line-1" @click="onDetail(scope.row.id)">
                  {{ scope.row.name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="level" label="产品分类" min-width="100" :show-overflow-tooltip="true">
              <template slot="header" slot-scope="scope">
                <el-popover
                  popper-class="popover_classify"
                  placement="bottom-start"
                  trigger="hover"
                >
                  <div slot="reference">
                    产品分类
                    <i class="el-icon-caret-bottom"></i>
                  </div>

                  <el-cascader-panel
                    :options="cate_list"
                    :props="{ checkStrictly: true }"
                    @change="change_cate"
                    clearable
                  ></el-cascader-panel>
                </el-popover>
              </template>

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
              min-width="100"
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
                <div  class="com-line-1" v-if="scope.row.is_online == 1">已上架</div>
                <div  class="com-line-1" v-else>已下架</div>
              </template>
            </el-table-column>

            <el-table-column label="创建人" prop="user.name" :show-overflow-tooltip="true"> 
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.user && scope.row.user.name ? scope.row.user.name : '' }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="更新时间" prop="updated_at" sortable :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.updated_at }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" prop="created_at" sortable :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.created_at }}
                </div>
              </template>
            </el-table-column>

            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="operation_box d-flex">
                  <div class="item" @click="onAdd(scope.row.id)">编辑</div>
                </div>
              </template>
            </el-table-column> -->

            <template slot="empty">
              <div class="table_empty">
                <p></p>
                <img
                  v-if="tableData_show"
                  src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
                />
              </div>
            </template>
          </el-table>

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

      <!-- 新增 -->
      <add v-if="addShow" ref="add" @cancel="hideadd"></add>
      <!-- 详情 -->
      <detail v-if="detailShow" ref="detail" @cancel="hidedetail"></detail>
    </div>
  </div>
</template>

<script>
import add from "./add.vue";
import detail from "./detail.vue";

import { delData, getData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    let id = 1;

    return {
      activeMenu: "product",
      user: {},

      // 搜索
      serVal: "",
      // 上下架
      is_online: null,
      activeTab: "2",
      tabs: [
        {
          name: "全部",
          type: 2,
        },
        {
          name: "上架",
          type: 1,
        },
        {
          name: "下架",
          type: 0,
        },
      ],
      // 表格数据
      tableData: [],
      tableData_show: false,
      page: 1,
      pagesize: 15,
      total: 0,
      // 筛选项
      selectInfo: {
        // 接口世界请求的 值
        activeLevel: "", // 级别
        activeRole: "",
        activeFrom: "",
        activeStatus: "",
        activeTag: "",
        activeIndustry: "",
      },
      cate_list: [
        {
          value:'',
          label:'全部'
        }
      ],
      form: {
        cate: "",
        f_classify: "",
        s_classify: "",
      },

      // 新增
      addShow: false,

      // 详情
      detailShow: false,
    };
  },
  components: {
    add,
    detail,
  },
  created() {
    let user = store.state.userInfo;
    this.user = user;
    if (user.role_id > 0 && user.role_id < 3 && this.tabs.length < 2) {
      this.tabs.unshift({
        name: "全部客户",
        type: "2",
      });
      this.activeTab = "2";
    }

    this.init();
  },
  methods: {
    init() {
      this.is_online = this.activeTab;
      this.getProduct();
      this.get_cate();
    },
    // 全部 列表
    getProduct() {
      let params = {
        page: this.page,
        pagesize: this.pagesize,
        search_word: this.serVal,
        is_online: this.is_online,
        f_classify: this.form.f_classify,
        s_classify: this.form.s_classify,
        status: 2,
      };

      getData({
        url: "/product/product_list",
        data: params,
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        this.tableData_show = list.data.length == 0;
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

    changTab(type) {
      this.activeTab = type;
      this.init();
    },

    // 搜索
    serKeyUp() {
      this.page = 1;
      this.init();
    },

    // ----------------分类----------------
    get_cate() {
      this.cate_list = [
        {
          value:'',
          label:'全部'
        }
      ],
      getData({
        url: "/classify",
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          if (list.length > 0) {
            this.cate_list = this.cate_list.concat(this.dg(list));
          }
        }
      });
    },
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
        this.form.f_classify = e[0];
        this.form.s_classify = e[1];
      } else {
        this.form.f_classify = "";
        this.form.s_classify = "";
      }

      this.init()
    },
    // ----------------分类----------------

    toCate() {
      this.$router.push({
        path: "/cate",
      });
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

    // 新增编辑信息
    onAdd(customer_id) {
      this.addShow = true;
      this.$nextTick(() => {
        this.$refs.add.init(customer_id);
      });
    },
    hideadd(update = false) {
      if (update) {
        this.init();
      }
      this.addShow = false;
    },

    // 详情
    onDetail(customer_id) {
      this.detailShow = true;
      this.$nextTick(() => {
        this.$refs.detail.init(customer_id);
      });
    },

    hidedetail(update = false) {
      if (update) {
        this.init();
      }
      this.detailShow = false;
    },

    // 删除当前数据
    // remove(scope) {
    //   this.$Modal.confirm({
    //     title: "删除",
    //     content: `确定对 ${scope.row.task_template.task_classify.name} 进行删除操作吗?`,
    //     onOk: () => {
    //       deleteData({
    //         url: "/voyage_tasks/" + scope.row.id,
    //       }).then((res) => {
    //         var data = res.data;
    //         if (data.data && data.code === 200) {
    //           this.$msg(data.data.msg, "", () => {
    //             this.init();
    //           });
    //         } else {
    //           this.$err(data.data.msg);
    //         }
    //       });
    //     },
    //   });
    // },
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

/deep/ .el-input__icon {
  line-height: 33px;
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
</style>

<style lang="less">
.popover_classify {
  padding: 0 !important;
  border-radius: 0;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0);
  border: none;
}
</style>