<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <left-menu :activeMenu="activeMenu"></left-menu>
      <top-nav active_title="拜访计划"></top-nav>

      <div class="content_main">
        <div class="visit_top d-between">
          拜访计划
          <div class="visit_add" @click="onAdd()">
            <i class="iconfont icon-ykb-tj"></i>新增
          </div>
        </div>
        <div class="visit_content">
          <div class="visit_calendar">
            <Calendar
              ref="Calendar"
              v-on:choseDay="clickDay"
              v-on:changeMonth="changeDate"
              :markDate="mark"
              :sundayStart="true"
              :textTop="['日', '一', '二', '三', '四', '五', '六']"
            ></Calendar>
          </div>
          <div class="visit_line" v-if="visit_list.length > 0">
            <el-timeline class="line">
              <el-timeline-item
                :timestamp="v.visit_time_m"
                placement="top"
                v-for="(v, k) in visit_list"
                :key="k"
              >
                <template slot="dot">
                  <img
                    class="line_dot"
                    src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/20220422-151733.png"
                  />
                </template>
                <div class="line_type">线下拜访</div>
                <div class="line_item" @click="onAdd(v.id)">
                  <p class="item">
                    <i>拜访客户：</i><span>{{ v.customer.name || '暂无'}}</span>
                  </p>
                  <p class="item">
                    <i>拜访目的：</i><span>{{ v.visit_type_name }}</span>
                  </p>
                  <p class="item d-flex" v-if="v.remarks">
                    <i>拜访备注：</i><span class="remarks">{{ v.remarks }}</span>
                  </p>
                </div>
              </el-timeline-item>
            </el-timeline>

            <div class="pagination_box">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[5, 10, 15]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
          <div class="visit_line" v-else>
            <div class="page_empty">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 新增 -->
      <add v-if="addShow" ref="add" @cancel="hideadd"></add>
    </div>
  </div>
</template>

<script>
import add from "./component/add.vue";
import Calendar from "vue-calendar-component";
import { getData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      activeMenu: "visit",
      user: {},
      addShow: false,
      // 日历
      visit_time: "",
      mark: [],
      start_time: "",
      end_time: "",
      // 分页
      visit_list: [],
      page: 1,
      pagesize: 5,
      total: 0,
      last_page: 1,
    };
  },
  components: {
    add,
    Calendar,
  },
  created() {
    let user = store.state.userInfo;
    this.user = user;

    // 今天
    let y = new Date().getFullYear();
    let m = new Date().getMonth() + 1;
    let d = new Date().getDate();

    // ----------
    this.$nextTick(() => {
      let day = `${y}/${this.formatNum(m)}/${this.formatNum(d)}`
      // this.$refs.Calendar.ChoseMonth(day)
      this.clickDay(day)
    })
    // ----------

    // 第一天和最后一天
    this.start_time = `${y}-${this.formatNum(m)}-${this.formatNum(
      new Date(y, m - 1, 1).getDate()
    )}`; // 当月第一天星期几
    this.end_time = `${y}-${this.formatNum(m)}-${this.formatNum(
      new Date(y, m, 0).getDate()
    )}`; // 当月最后一天
  },
  methods: {
    init() {
      this.get_list();
    },
    // -------------------日历------------------
    clickDay(data) {
      if (data) {
        let arr = data.split("/");
        let y = arr[0];
        let m = arr[1];
        let d = arr[2];
        this.start_time = `${y}-${this.formatNum(m)}-${this.formatNum(
          new Date(y, m - 1, 1).getDate()
        )}`; // 当月第一天
        this.end_time = `${y}-${this.formatNum(m)}-${this.formatNum(
          new Date(y, m, 0).getDate()
        )}`; // 当月最后一天
        this.visit_time = `${y}-${this.formatNum(m)}-${this.formatNum(d)}`;
        this.page = 1;
        this.init();
      }
    },
    changeDate(data) {
      let arr = data.split("/");
      let y = arr[0];
      let m = arr[1];
      this.start_time = `${y}-${this.formatNum(m)}-${this.formatNum(
        new Date(y, m - 1, 1).getDate()
      )}`; // 当月第一天
      this.end_time = `${y}-${this.formatNum(m)}-${this.formatNum(
        new Date(y, m, 0).getDate()
      )}`; // 当月最后一天

      let y_today = new Date().getFullYear();
      let m_today = new Date().getMonth() + 1;
      let d_today = new Date().getDate();


      // --------
      if (y == y_today && m == m_today) {
        let day =  `${y}-${this.formatNum(m)}-${this.formatNum(d_today)}`
        this.$nextTick(() => {
          // this.$refs.Calendar.ChoseMonth(day,true);
        })
        this.visit_time = day;
      } else {
        this.visit_time = "";
      }
      // -----------

      this.page = 1;
      this.init();
    },
    formatNum(num) {
      let res = Number(num);
      return res < 10 ? "0" + res : res + "";
    },

    // -------------------列表------------------
    get_list() {
      getData({
        url: "/visit/visit_plan_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          start_time: this.start_time,
          end_time: this.end_time,
          visit_time: this.visit_time,
        },
      }).then((res) => {
        const {
          code,
          data: { list, msg, date_status },
        } = res;
        if (code === 200) {
          if (date_status.length > 0) {
            let mark = [];
            date_status.forEach((v) => {
              if (v.status) {
                mark.push(`${v.year}/${v.month}/${v.day}`);
              }
            });
            this.mark = mark;
          }
          this.last_page = list.last_page;
          this.visit_list = list.data;
          this.total = list.total;
        } else {
          this.last_page = 1;
          this.visit_list = [];
          this.total = 0;
          this.$err(msg);
        }
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

    // -------------------新增编辑------------------
    onAdd(id) {
      this.addShow = true;
      this.$nextTick(() => {
        this.$refs.add.init(id);
      });
    },
    hideadd(update = false) {
      if (update) {
        this.page = 1;
        this.init();
      }
      this.addShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.content_main {
  padding: 26px 24px;
  .visit_top {
    height: 72px;
    background: #fff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    margin-bottom: 12px;
    padding: 0 24px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #464c5b;
  }
  .visit_add {
    width: 69px;
    height: 34px;
    background: #4d6fff;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 400;
    line-height: 34px;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    .iconfont {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .visit_content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .visit_calendar {
    width: 367px;
    height: 324px;
    background: #fff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    margin-right: 24px;

    /deep/.wh_content_all {
      background-color: #fff;
      .wh_top_changge li {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #464c5b;
      }
      .wh_content_item {
        color: #657180;
        margin: 1px;
      }
      .wh_top_changge li {
        color: #657180;
      }
      .wh_top_tag {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #4d6fff;
      }
      .wh_jiantou1 {
        border-top: 2px solid #030303;
        border-left: 2px solid #030303;
        background-color: white;
      }
      .wh_jiantou2 {
        border-top: 2px solid #030303;
        border-right: 2px solid #030303;
      }
      .wh_content_all {
        background-color: #ffffff;
      }

      .wh_content_item .wh_item_date.wh_isToday {
        border-radius: 20px;
        background-color: #edf3fe;
        color: #464c5b;
      }

      .wh_content_item .wh_chose_day {
        border-radius: 20px;
        background-color: #4d6fff;
        color: #fff;
      }

      .wh_content_item .wh_isMark {
        background: #fff;
        position: relative;
        color: #464c5b;
      }
      .wh_content_item .wh_isMark:after {
        content: "";
        height: 6px;
        width: 6px;
        background: #ffa629;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
      }

      .wh_content_item:hover .wh_item_date,
      .wh_content_item:hover .wh_item_date.wh_isToday,
      .wh_content_item .wh_item_date.wh_isToday.wh_chose_day,
      .wh_content_item .wh_item_date.wh_chose_day.wh_isMark {
        border-radius: 20px;
        background-color: #4d6fff;
        color: #fff;
      }
    }
  }

  /*------------------列表--------------*/
  .visit_line {
    flex: 1;
    background: #fff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    padding: 24px 24px 24px 40px;
  }

  .line {
    margin-top: 10px;

    .line_dot {
      height: 8px;
      width: 8px;
      margin-left: 1px;
    }

    /deep/ .el-timeline-item {
        padding-bottom: 20px;
    }

    /deep/ .el-timeline-item__wrapper {
      position: relative;
    }

    /deep/ .el-timeline-item__timestamp.is-top {
      padding: 0;
      font-size: 12px;
      font-weight: 600;
      color: #4d6fff;
      margin-bottom: 2px;
    }

    .line_type {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
    }

    .line_item {
      position: relative;
      top: -28px;
      width: calc(100% - 100px);
      max-width: 600px;
      left: 80px;
      box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 10px 1px inset;
      border-radius: 8px;
      padding: 15px 22px 9px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #9ea7b4;
      cursor: pointer;
      .item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 6px;
        word-break: break-all;
      }
      i {
        width: 65px;
        font-style:normal;
      }
      span {
        flex:1;
        color: #657180;
      }
    }
  }

  .page_empty {
    background: #fff !important;
    border: none !important;
  }
}
</style>
