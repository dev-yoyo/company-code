<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <setting-menu :activeMenu="activeMenu"></setting-menu>
      <top-nav active_title="业绩目标" type="2"></top-nav>

      <div class="content_main">
        <div class="title" v-if="table == 3">{{depart_name}}员工业绩目标 <i class="iconfont icon-ykb--bz" @click="tip()"></i></div>
        <div class="table_top_info d-between">
          <div class="l_tabs d-center">
            <div class="d-flex" v-if="table == 3">
              <div class="label">年度目标总额：</div>
              <div class="money">{{money}}</div>
            </div>
            <div
              v-else
              class="item"
              :class="{ active: activeTab == v.type }"
              v-for="(v, i) in tabs"
              :key="i"
              @click="changTab(v.type)"
            >
              {{ v.name }}
            </div>

            <el-select v-model="year" placeholder="请选择年" @change="change">
              <el-option
                v-for="item in year_list"
                :key="item.year"
                :label="item.year"
                :value="item.year">
              </el-option>
            </el-select>
            
          </div>

          <div class="r_btns d-center">
            <div class="item item_btn" @click="onSet()" v-if="table != 2">
              <i class="iconfont icon-bj12"></i>
              设置目标
            </div>
          </div>
        </div>
        <div class="table_box">
          <!-- 部门主管部门目标 -->
          <el-table
            v-if="table == 1"
            key="1"
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
            :cell-style="{ color: '#657180', 'font-size': '12px' }"
            height="calc(100vh - 228px)"
          >
            <!-- 部门目标 -->
            <el-table-column label="部门" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="bold" v-if="scope.row.name == '总计'">总计</div>
                <div v-else>
                  <div class="customer_grey" v-if="scope.row.status == '解散'">
                    {{ scope.row.name }}
                  </div>
                  <div class="customer_name com-line-1"  @click="detail(scope.row)" v-else>
                    {{ scope.row.name }}
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="全年目标" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1" :class="scope.row.status == '解散'?'customer_grey':''">{{ Math.round((scope.row.money)*100)/100 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="1月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_1 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="2月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_2 }}</div>
              </template>
            </el-table-column>
            
            <el-table-column label="3月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_3 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="4月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_4 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="5月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_5 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="6月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_6 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="7月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_7 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="8月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_8 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="9月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_9 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="10月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_10 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="11月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_11 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="12月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '解散'?'customer_grey':''">{{ scope.row.month_12 }}</div>
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

          <!-- 部门主管员工目标 -->
          <el-table
            v-if="table == 2"
            key="2"
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
            :cell-style="{ color: '#657180', 'font-size': '12px' }"
            height="calc(100vh - 300px)"
          >
            <el-table-column label="姓名" min-width="120px" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1 customer_grey" v-if="scope.row.status == '离职' || scope.row.status == '转岗'">
                  {{ scope.row.name }}（{{scope.row.status}}）
                </div>
                <div class="com-line-1" v-else>
                  {{ scope.row.name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="部门" min-width="120px" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="com-line-1" :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.department_name }}</div>
              </template>
            </el-table-column>

            <el-table-column label="全年目标" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div  class="com-line-1" :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ Math.round((scope.row.money)*100)/100 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="1月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_1 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="2月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_2 }}</div>
              </template>
            </el-table-column>
            
            <el-table-column label="3月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_3 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="4月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_4 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="5月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_5 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="6月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_6 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="7月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_7 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="8月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_8 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="9月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_9 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="10月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_10 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="11月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_11 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="12月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_12 }}</div>
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

          <!-- 管理员部门目标 -->
          <el-table
            v-if="table == 3"
            key="3"
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
            :cell-style="{ color: '#657180', 'font-size': '12px' }"
            height="calc(100vh - 300px)"
          >
            <el-table-column label="姓名" min-width="120px" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="bold" v-if="scope.row.name == '总计'">总计</div>
                <div v-else>
                  <div class="com-line-1 customer_grey" v-if="scope.row.status == '离职' || scope.row.status == '转岗'">
                    {{ scope.row.name }}（{{scope.row.status}}）
                  </div>
                  <div class="customer_name com-line-1"  @click="detail(scope.row)" v-else>
                    {{ scope.row.name }}
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="全年目标" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div  class="com-line-1" :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ Math.round((scope.row.money)*100)/100 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="1月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_1 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="2月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_2 }}</div>
              </template>
            </el-table-column>
            
            <el-table-column label="3月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_3 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="4月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_4 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="5月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_5 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="6月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_6 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="7月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_7 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="8月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_8 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="9月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_9 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="10月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_10 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="11月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_11 }}</div>
              </template>
            </el-table-column>

            <el-table-column label="12月">
              <template slot-scope="scope">
                <div :class="scope.row.status == '离职' || scope.row.status == '转岗'?'customer_grey':''">{{ scope.row.month_12 }}</div>
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

          <div class="btm_box d-between" v-if="table != 1">
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
    <!-- 部门 -->
    <adddepart v-if="departShow" ref="depart" @cancel="hide_depart"></adddepart>
    <!-- 员工 -->
    <addmember v-if="memberShow" ref="member" @cancel="hide_member"></addmember>
    <!-- 移出 -->
    <detail ref="detail" v-if="detailShow"  @cancel="hide_detail"></detail>
    <!-- 提示 -->
    <tip ref="tip" ></tip>
  </div>
</template>

<script>
import { delData, getData } from "@/api/user";
import store from "@/store";
import adddepart from "./component/target_depart.vue";
import addmember from "./component/target_member.vue";
import detail from "./component/target_detail.vue";
import tip from "./component/target_tip.vue";

export default {
  data() {
    return {
      user: {},
      activeMenu: "target",
      activeTab: 1,
      table:1,// 1 部门主管部门目标， 2 部门主管员工目标， 3 管理员部门目标
      money: 1,
      tabs: [
        {
          name: "部门目标",
          type: 1,
        },
        {
          name: "员工目标",
          type: 2,
        }
      ],
      year: '',
      year_list:[],

      departShow: false,
      memberShow: false,
      detailShow: false,

      tableData:[],
      page: 1,
      pagesize: 15,
      total: 0,
      last_page: 1,
    };
  },
  components: {
    adddepart,
    addmember,
    detail,
    tip
  },
  created() {
    this.user = store.state.userInfo;
    let id = this.user.role_id
    this.depart_name = this.user.department && this.user.department.name ? this.user.department.name: ''
    this.table = id == 3 ? 3 : 1
    this.get_year()
  },
  methods: {
    init() {
      if(this.table == 1) {
        this.list_depart()
      }else if(this.table == 2) {
        this.page = 1;
        this.list_member()
      } else {
        this.list_other()
      }
    },
    list_depart() {
      let year = this.year.slice(0,this.year.length-1)
      this.tableData = [];
      getData({
        url: "/achievement/achievement_year_department",
        data: {
          year
        },
      }).then((res) => {
        const {
          code,
          data: { list, money, total, msg },
        } = res;
        if (code === 200) {
          if(list) {
            if(money> 0){
              // 总计
              list.push({
                achievement:total,
                money: money,
                name: '总计'
              })
            }
            
            // 转格式
            list.forEach((v,k)=>{
              v.achievement.forEach((a,b)=>{
                v['month_'+a.month] = a.money
                v['id_'+a.month] = a.id 
                v.year = a.year
                v.status = a.status
              })
              
            })
          }
          this.tableData = list;
        } else {
          this.tableData = [];
          this.$err(msg);
        }
      });
    },
    list_member() {
      let year = this.year.slice(0,this.year.length-1)
      this.tableData = [];
      getData({
        url: "/achievement/achievement_year_detail",
        data: {
          year,
          pagesize:this.pagesize
        },
      }).then((res) => {
        const {
          code,
          data: { member_list, money, total, msg, user_money },
        } = res;
        if (code === 200) {
          let list = member_list.data
          if(list) {
            // 转格式
            list.forEach((v,k)=>{
              v.achievement.forEach((a,b)=>{
                v['month_'+a.month] = a.money
                v['id_'+a.month] = a.id 
                v.year = a.year
                v.status = a.status
              })
              
            })
          }
          this.tableData = list;
          this.total = member_list.total
        } else {
          this.tableData = [];
          this.total = 0
          this.$err(msg);
        }
      });
    },
    list_other() {
      let year = this.year.slice(0,this.year.length-1)
      this.tableData = [];
      getData({
        url: "/achievement/achievement_year_detail",
        data: {
          year,
          pagesize:this.pagesize
        },
      }).then((res) => {
        const {
          code,
          data: { member_list, money,user_money, total, msg },
        } = res;
        if (code === 200) {
          let list = member_list.data
          if(list) {
            // 总计
            if(money> 0){
              list.push({
                achievement:total,
                money: user_money,
                name: '总计'
              })
            }
            
            // 转格式
            list.forEach((v,k)=>{
              v.achievement.forEach((a,b)=>{
                v['month_'+a.month] = a.money
                v['id_'+a.month] = a.id 
                v.year = a.year
                v.status = a.status
              })
              
            })
          }
          this.money = money
          this.tableData = list;
          this.total = member_list.total
        } else {
          this.tableData = [];
          this.total = 0
          this.$err(msg);
        }
      });
    },
    // --------------------设置----------------------
    get_year() {
      let url = ''
      if(this.user.role_id < 3) {
        url = `/achievement/achievement_year_director`
      }else if (this.user.role_id == 3) {
        url = `/achievement/achievement_department_year?department_id=${this.user.department_id}`
      }
      getData({
        url,
        data: {}
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
           // 当前年为激活年
          const d = new Date();
          const year = d.getFullYear();
          this.year_list = list
          let bol = false
          this.year_list && this.year_list.forEach((v)=>{
            if(v.year == year) {
              bol = true 
            }
            v.year = v.year + '年'
          })
          if(bol) {
            this.year = year + '年'
          }
          
        }else {
          this.$err(msg);
        } 

        this.user = store.state.userInfo;
        let id = this.user.role_id
        this.table = id == 3 ? 3 : 1
        this.init()
      });
    },
    
    changTab(type) {
      this.activeTab = type;
      this.table = type
      this.init()
    },

    change(e) {
      this.year = e
      this.init()
    },

    onSet() {
      if(this.table == 1) {
        this.depart()
      }else if (this.table == 3) {
        this.member()
      }
    },

    // --------------------部门----------------------
    depart() {
      this.departShow = true;
      let year = this.year.slice(0,this.year.length-1)
      this.$nextTick(() => {
        this.$refs.depart.init({
          year: year,
          id: 0
        });
      });
    },
    hide_depart() {
      this.departShow = false
      this.get_year()
    },

    // --------------------成员----------------------
    member() {
      this.memberShow = true;
      let year = this.year.slice(0,this.year.length-1)
      this.$nextTick(() => {
        this.$refs.member.init({
          year: year,
          id: 0
        });
      });
    },
    hide_member() {
      this.memberShow = false
      this.init()
    },

    // --------------------详情----------------------
    detail(v) {
      this.detailShow = true;
      this.$nextTick(() => {
        this.$refs.detail.init(v);
      });
    },
    hide_detail(v) {
      this.detailShow = false
      if(v) {
        if(this.table == 1) {
          this.departShow = true;
          this.$nextTick(() => {
            this.$refs.depart.init(v);
          });
        }else if(this.table == 3) {
          this.memberShow = true;
          this.$nextTick(() => {
            this.$refs.member.init(v);
          });
        }
        
      }
    },

    // -----------------------提示--------------------
    tip (v) {
      this.$nextTick(() => {
        this.$refs.tip.handleOpen();
      });
    },

    // --------------------表格----------------------  
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
.title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: #464C5B;
  margin-bottom: 14px;
  .iconfont {
    font-size: 26px;
    margin-left: 5px;
    cursor: pointer;
  }
}
.table_top_info {
  margin-bottom: 12px;

  .l_tabs {
    border-radius: 5px;
    overflow: hidden;
    flex-shrink: 0;

    .label {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
    }

    .money {
      min-width: 121px;
      height: 32px;
      background: rgba(246, 246, 246, 0.39);
      border: 1px solid #D6DDE6;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 32px;
      color: #FFA629;
      padding: 0 11px;
    }

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

/deep/ .el-select {

  width: 96px;
  margin-left: 12px;
  .el-input__inner,
  .el-input__icon {
      height: 32px;
      line-height: 32px;
  }
}

/deep/.el-table {
  /*border: 1px solid #EAEDF2;*/
  tbody .el-table__row:last-child,
  th {
    padding: 0 !important;
    height: 42px !important;
    background-color: #F3F7F9 !important;
  }
  
  .bold {
    color: '#464C5B';
    font-size: 12px;
    font-weight: 600;
  }

}
</style>
