<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <left-menu></left-menu>
      <top-nav active_title="通讯录"></top-nav>

      <div class="content_main">
        <div class="branch">
          <div class="left">
            <div class="title">企业组织架构</div>
            <div class="company d-flex" :class="active == 0?'active':''" @click="change_depart(0,company_name)">
              <i class="iconfont icon-xl1" v-if="show" @click.stop="change"></i>
              <i class="iconfont icon-sq" v-else @click.stop="change"></i>
              {{company_name}} 
            </div>
            <ul class="depat" v-if="show">
              <li class="depat_item" :class="active == v.id?'active':''" v-for="(v,k) in department_list" :key="k" @click="change_depart(v.id,v.name)">{{v.name}}</li>
            </ul>
          </div>

          <div class="right">
            <div class="title">{{active_name}}</div>
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
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%"
              :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
              :cell-style="{ color: '#657180', 'font-size': '12px' }"
              height="calc(100vh - 350px)"
            >
              <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div class="com-line-1">
                    {{ scope.row.user && scope.row.user.name ? scope.row.user.name : '' }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="company" label="部门"  :show-overflow-tooltip="true" >
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
              <template slot="empty" >
              <div class="table_empty">
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
    </div>
  </div>
</template>

<script>

import { postData, getData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      // 左侧组织结构
      company_name:'',
      active_name:'',
      first: true,
      show: true,
      department_list:[],
      active: 0,
      // 筛选条件
      search_word:'',
      department_id:'',
      // 表格
      tableData: [],
      tableData_show: false,
      page: 1,
      pagesize: 15,
      total: 0,
    };
  },
  created() {
    this.init();
    this.department()
  },
  methods: {
    init() {
      getData({
        url: "/user/mail_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          search_word:this.search_word,
          department_id: this.department_id
        }
      }).then((res) => {
        const {
          code,
          data: { company_name,member_list,msg },
        } = res;
        this.tableData_show = member_list.data.length == 0
        if (code === 200) {
          this.company_name = company_name
          this.tableData = member_list.data
          this.total = member_list.total
          if(this.first) {
            this.active_name = company_name
            this.first = false
          }
        }else {
          this.$err(msg)
          this.tableData = []
          this.total = 0
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

    // --------------------右表格----------------------
    serKeyUp() {
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
  }

  .search {
    margin-bottom: 24px;
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
    }
    .depat_item.active {
      background: #F0F5FF;
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
}

</style>
