<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <setting-menu :activeMenu="activeMenu"></setting-menu>
      <top-nav active_title="组织架构" type="2"></top-nav>

      <div class="content_main">
        <div class="branch">
          <div class="left">
            <div class="title d-between">
              企业组织架构 
              <div class="add" @click="create_depart()"><i class="iconfont icon-ykb-tj"></i> 创建部门</div>
            </div>
            <div class="company d-flex" :class="active == 0?'active':''"  @click="change_depart(0,company_name)">
              <i class="iconfont icon-xl1" v-if="show" @click.stop="change"></i>
              <i class="iconfont icon-sq" v-else @click.stop="change"></i>
              {{company_name}} 
            </div>
            <ul class="depat" v-if="show">
              <li class="depat_item d-between" :class="active == v.id?'active':''"  v-for="(v,k) in department_list" :key="k" @click="change_depart(v.id,v.name)">
              {{v.name}} 
                <el-dropdown @command="handleCommand($event,v)">
                  <span class="el-dropdown-link">
                    <i class="iconfont icon-diand"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>
          </div>

          <div class="right">
            <div class="title">{{active_name}}</div>

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
                  <el-select v-model="role_id" placeholder="请选择" @change="change_role">
                    <el-option label="全部" value="0"></el-option>
                    <el-option
                      v-for="item in role_list"
                      v-if="item.id !== 1"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <div class="top_search search">
                    <el-input
                      class="search_ipt"
                      placeholder="员工/手机号"
                      prefix-icon="el-icon-search"
                      v-model="search_word"
                      @keyup.enter.native="serKeyUp()"
                    >
                    </el-input>
                    <button class="search_btn" @click="serKeyUp()">搜索</button>
                  </div>

                  <div class="item item_btn" @click="create_memeber()">
                    <i class="iconfont icon-ykb-tj"></i>
                    添加员工
                  </div>
                </div>
              </div>

              <el-table
                key="1"
                ref="multipleTable"
                :data="tableData"
                style="width: 100%"
                :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
                :cell-style="{ color: '#657180', 'font-size': '12px' }"
                v-if="activeTab == 1"
                height="calc(100vh - 350px)"
              >
                <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.user && scope.row.user.name ? scope.row.user.name : '' }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="company" label="部门" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.department && scope.row.department.name ? scope.row.department.name : ''  }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="手机号码" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.user && scope.row.user.phone ? scope.row.user.phone : '' }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="角色" prop="company_role" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.role && scope.row.role.name ? scope.row.role.name : '' }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" v-if="user.role_id == 1 || user.role_id == 2 " :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="grey_box d-flex"  v-if="user.id == scope.row.user_id">
                      <div class="item">移交</div>
                      <div class="item">调整</div>
                      <div class="item">移出</div>
                    </div>
                    <div class="operation_box d-flex" v-else>
                      <div class="item" @click="move(scope.row)">移交</div>
                      <div class="item" @click="adjust(scope.row)" >调整</div>
                      <div class="item" @click="remove(scope.row)">移出</div>
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

              <el-table
                key="2"
                ref="multipleTable"
                :data="tableData"
                style="width: 100%"
                :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
                :cell-style="{ color: '#657180', 'font-size': '12px' }"
                v-else
              >
              
                <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.user && scope.row.user.name ? scope.row.user.name : '' }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="company" label="部门" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.department && scope.row.department.name ? scope.row.department.name : ''  }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="手机号码" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.user && scope.row.user.phone ? scope.row.user.phone : '' }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="角色" prop="company_role" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.role && scope.row.role.name ? scope.row.role.name : '' }}
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
    </div>

    <!-- 部门 -->
    <adddepart v-if="departShow" ref="depart" @cancel="hide_depart"></adddepart>
    <!-- 员工 -->
    <addmember v-if="memberShow" ref="member" @cancel="hide_member"></addmember>
    <!-- 移出 -->
    <remove ref="remove" v-if="removeShow"  @cancel="hideremove"></remove>
    <!-- 删除 -->
    <omit ref="omit" v-if="omitShow"  @cancel="hideomit"></omit>
    <!-- 调整 -->
    <adjust ref="adjust" v-if="adjustShow"  @cancel="hideadjust"></adjust>
    <!-- 移交 -->
    <move ref="move" v-if="moveShow"  @cancel="hidemove"></move>

  </div>
</template>

<script>
import { delData, getData } from "@/api/user";
import store from "@/store";
import adddepart from "./component/frame_depart.vue";
import addmember from "./component/frame_member.vue";
import remove from "./component/frame_remove.vue";
import omit from "./component/frame_del.vue";
import adjust from "./component/frame_adjust.vue";
import move from "./component/frame_move.vue";

export default {
  data() {
    return {
      user: {},
      activeMenu: "frame",
      // 左侧组织结构
      company_name:'',
      active_name:'',
      first: true,
      show: true,
      active: 0,
      // tab
      activeTab:1,
      tabs: [
        {
          name: "在职员工",
          type: 1,
        },
        {
          name: "离职员工",
          type: 2,
        },
      ],
      // 筛选条件
      search_word:'',
      department_id:'',
      role_id:'',
      department_list:[],
      role_list:[],
      // 表格
      tableData: [],
      page: 1,
      pagesize: 15,
      total: 0,
      // 添加
      departShow: false,
      memberShow: false,
      removeShow: false,
      omitShow: false,
      adjustShow: false,
      moveShow: false,
    };
  },
  components: {
    adddepart,
    addmember,
    remove,
    omit,
    adjust,
    move
  },
  created() {
    this.init();
    this.department()
    this.user = store.state.userInfo;
  },
  methods: {
    init() {
      getData({
        url: "/user/admin_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word:this.search_word,
          department_id: this.department_id,
          role_id: this.role_id,
          model: this.activeTab
        }
      }).then((res) => {
        const {
          code,
          data: { company_name,admin_user,msg,role},
        } = res;
        if (code === 200) {
          this.company_name = company_name
          this.tableData = admin_user.data
          this.total = admin_user.total
          this.role_list = role
          if(this.first) {
            this.active_name = company_name
            this.first = false
          }
        }else {
          this.$err(msg)
          this.tableData = []
          this.total = 0
          this.role_list = []
        }
      });
    },


    // --------------------左侧组织架构----------------------
    department() {
      getData({
        url: "/department/list ",
        data: {}
      }).then((res) => {
        const {
          code,
          data: { department_list, msg },
        } = res;
        if (code === 200) {
          this.department_list = department_list
        }else {
          this.department_list = []
          this.$err(msg)
        }
      });
    },

    change() {
      this.show = !this.show
    },

    change_depart(id, name) {
      this.department_id = id
      this.active_name = name
      this.active = id
      this.init()
    },

    create_depart() {
      this.departShow = true;
    },
    hide_depart() {
      this.departShow = false
      this.init()
      this.department()
    },

    hideomit() {
      this.omitShow = false
      this.init()
      this.department()
    },

    handleCommand(type,v) {
      switch (type) {
        case "edit":
          this.edit_depart(v)
          break;
        case "del":
          this.del_depart(v)
          break;
        default:
          break;
      }
    },

    del_depart (v) {
      this.omitShow = true;
      this.$nextTick(() => {
        this.$refs.omit.handleOpen(v);
      });
    },

    edit_depart(v) {
      this.departShow = true;
      this.$nextTick(() => {
        this.$refs.depart.init(v);
      });
    },
    // --------------------表格----------------------
    changTab(type) {
      this.activeTab = type;
      this.page = 1;
      this.init();
    },

    change_role (e) {
      this.role_id = e
      this.init()
    },

    serKeyUp() {
      this.init();
    },

    create_memeber() {
      this.memberShow = true;
      this.$nextTick(() => {
        this.$refs.member.init();
      });
    },
    hide_member() {
      this.memberShow = false
      this.init()
    },

    // -----------------------移交--------------------
    move (v) {
      this.moveShow = true;
      this.$nextTick(() => {
        let name = v.user && v.user.name ?  v.user.name : ''
        let role = v.role && v.role.name ? v.role.name : ''
        this.$refs.move.handleOpen(v.user_id,name,role);
      });
    },

    hidemove() {
      this.moveShow = false
      this.init()
    },

    // -----------------------调整--------------------
    adjust(v) {
      let id = v.user_id || 0
      this.adjustShow = true;
      this.$nextTick(() => {
        this.$refs.adjust.handleOpen(id);
      });
    },

    hideadjust() {
      this.adjustShow = false
      this.init()
    },

    // -----------------------移出--------------------
    remove (v) {
      this.removeShow = true;
      this.$nextTick(() => {
        let name = v.user && v.user.name ?  v.user.name : ''
        let role = v.role && v.role.name ? v.role.name : ''
        this.$refs.remove.handleOpen(v.user_id,name,role);
      });
    },

    hideremove() {
      this.removeShow = false
      this.init()
    },

    // -----------------------选择-------------------- 

    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },
    
  },
};
</script>

<style lang="less" scoped>
.content_main {
  padding: 25px 24px;
  .branch {
    display: flex;
    justify-content:center;
    align-content:center;
    align-items:stretch;
  }
  .left,
  .right {
    padding: 26px 24px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    background: #fff;
  }

  .left {
    width: 270px;
    margin-right: 12px;
  }

  .right {
    flex: 1;
  }

  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
    .add {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #3399FF;
      cursor: pointer;
    }
    .iconfont {
      margin-right: 2px;
      font-size: 12px;
    }
  }

  .search {
    width: 192px;
  }

  .company {
    height: 40px;
    width: 222px;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
    color: #657180;
    cursor: pointer;
    margin-bottom: 4px;
    .iconfont {
      font-size: 14px;
      padding: 12px 0;
      color:#3399FF;
    }
  }
  .company.active {
    background: #F0F5FF;
  }
  .depat {
    height: calc(100vh - 270px);
    overflow: auto;
    .depat_item {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      font-weight: 400;
      color: #657180;
      margin-bottom: 4px;
      padding: 0 12px 0 35px;
      cursor: pointer;

      .iconfont {
        padding-left: 20px;
        color: #C1C4CC;
        font-size: 14px;
      }
    }
    .depat_item.active {
      background: #F0F5FF;
    }
  }

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
    /deep/.r_btns {
      .el-input {
        margin-left:12px;
      }
      
      .iconfont {
        font-size: 12px;
      }
    }
  }

  /deep/.el-table {
    /*border: 1px solid #D7DDE5;*/
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
      padding: 0 14px!important;
    }

    .is-leaf {
      overflow: initial !important;
    }
  }

  .btm_box {
    padding: 0 14px;
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

      .blue {
        color: #4D6FFF;
        margin: 0 5px;
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

  .grey_box {
    .item {
      margin-right: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #999;
      white-space: nowrap;
    }
  }
}

</style>
