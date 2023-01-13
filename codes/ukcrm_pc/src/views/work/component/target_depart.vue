<template>
  <div class="target">
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="805px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title d-between">{{ text }}</div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="customerForm"
        label-width="0"
        class="demo-form"
      >
        <div class="form d-flex">
          <div class="item">
            <el-form-item prop="depart" label="设置部门">
              <el-select
                v-model="form.depart"
                placeholder="请选择"
                @change="choose_depart"
                :disabled="isEdit"
              >
                <el-option
                  v-for="v in department_list"
                  :key="v.id"
                  :label="v.name"
                  :value="v.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item prop="year" label="设置时间">
              <el-date-picker
                v-model="form.year"
                value-format="yyyy"
                type="year"
                placeholder="选择年"
                :disabled="isEdit"
                @change="choose_time"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>

        <div class="unit">单位：元</div>

        <div class="table">
          <div class="head d-flex">
            <span class="space">全年目标 </span>
            <el-form-item prop="all">
              <el-input
                class="all"
                type="text"
                v-model="form.all"
                placeholder="请输入全年目标"
                @input="change_all($event)"
              ></el-input>
            </el-form-item>
            <div class="adver" @click="adver()">平分</div>
          </div>
          <div class="tr d-flex">
            <div class="th" v-for="(v, k) in form.quart_list" :key="k">
              <p class="month">
                {{ v.text }}季度<span class="quarter">{{ v.val }}</span>
              </p>
            </div>
          </div>
          <div class="tr d-flex">
            <div class="td">
              <el-form-item
                v-for="v in form.month_list"
                :key="v.num"
                v-if="v.num < 4"
              >
                <p class="month d-flex">
                  <span class="day">{{ v.num }}月</span>
                  <el-input
                    type="text"
                    v-model="v.val"
                    @input="change_month($event, v, 0, [0, 1, 2])"
                    placeholder="0"
                  ></el-input>
                </p>
              </el-form-item>
            </div>
            <div class="td">
              <el-form-item
                v-for="v in form.month_list"
                :key="v.num"
                v-if="v.num > 3 && v.num < 7"
              >
                <p class="month d-flex">
                  <span class="day">{{ v.num }}月</span>
                  <el-input
                    type="text"
                    v-model="v.val"
                    @input="change_month($event, v, 1, [3, 4, 5])"
                    placeholder="0"
                  ></el-input>
                </p>
              </el-form-item>
            </div>
            <div class="td">
              <el-form-item
                v-for="v in form.month_list"
                :key="v.num"
                v-if="v.num > 6 && v.num < 10"
              >
                <p class="month d-flex">
                  <span class="day">{{ v.num }}月</span>
                  <el-input
                    type="text"
                    v-model="v.val"
                    @input="change_month($event, v, 2, [6, 7, 8])"
                    placeholder="0"
                  ></el-input>
                </p>
              </el-form-item>
            </div>
            <div class="td">
              <el-form-item
                v-for="v in form.month_list"
                :key="v.num"
                v-if="v.num > 9"
              >
                <p class="month d-flex">
                  <span class="day">{{ v.num }}月</span>
                  <el-input
                    type="text"
                    v-model="v.val"
                    @input="change_month($event, v, 3, [9, 10, 11])"
                    placeholder="0"
                  ></el-input>
                </p>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

      <div class="footer">
        <el-button @click="cancel()" :disabled="createLoading">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm()"
          :loading="createLoading"
          :disabled="createLoading"
          >确 定</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      drawer: true,
      isEdit: false,
      createLoading: false,
      text: "部门目标设置",
      info: {},
      form: {
        depart: "",
        year: "",
        all: "",
        quart_list: [
          {
            text: "一",
            val: 0,
          },
          {
            text: "二",
            val: 0,
          },
          {
            text: "三",
            val: 0,
          },
          {
            text: "四",
            val: 0,
          },
        ],
        month_list: [
          {
            id: 0,
            num: 1,
            val: "",
          },
          {
            id: 0,
            num: 2,
            val: "",
          },
          {
            id: 0,
            num: 3,
            val: "",
          },
          {
            id: 0,
            num: 4,
            val: "",
          },
          {
            id: 0,
            num: 5,
            val: "",
          },
          {
            id: 0,
            num: 6,
            val: "",
          },
          {
            id: 0,
            num: 7,
            val: "",
          },
          {
            id: 0,
            num: 8,
            val: "",
          },
          {
            id: 0,
            num: 9,
            val: "",
          },
          {
            id: 0,
            num: 10,
            val: "",
          },
          {
            id: 0,
            num: 11,
            val: "",
          },
          {
            id: 0,
            num: 12,
            val: "",
          },
        ],
      },
      rules: {
        depart: [
          {
            required: true,
            message: "请选择部门",
            trigger: ["change", "blur"],
          },
        ],
        year: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["change", "blur"],
          },
        ],
        all: [
          {
            required: true,
            message: "请输入全年目标",
            trigger: ["change", "blur"],
          },
        ],
      },
      department_list: [],
    };
  },
  created() {
    this.department();
  },
  methods: {
    init(v) {
      this.info = v || {};
      this.$nextTick(() => {
        this.resetForm();
        this.form.year = this.info.year;

        // 编辑
        if (v.id) {
          this.isEdit = true;
          this.text = this.info.name + "目标设置";

          this.form.month_list.forEach((v, k) => {
            v.val = this.info["month_" + v.num];
          });

          this.quart(0, [0, 1, 2]);
          this.quart(1, [3, 4, 5]);
          this.quart(2, [6, 7, 8]);
          this.quart(3, [9, 10, 11]);

          this.form.all = Math.round(this.info.money * 100) / 100 || 0;
          this.form.depart = Number(this.info.id);
        }
      });
    },
    choose_depart(e) {
      this.form.depart = e;
      this.reset();
      console.log(e);
    },
    choose_time(e) {
      this.form.year = e;
      this.reset();
      console.log(e);
    },

    department() {
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
    // 全年目标
    change_all(e) {
      e = e.match(/\d+\.?\d{0,2}/) ? e.match(/\d+\.?\d{0,2}/)[0] : "";
      this.$nextTick(() => {
        this.form.all = e;
      });
      this.clear();
    },
    adver() {
      let all = this.form.all;
      if (all > 0) {
        let a = Math.floor((all / 12) * 100) / 100;
        let b = Math.round((all - 12 * a) * 100) / 100;
        this.form.month_list.forEach((v, k) => {
          if (v.num == 12) {
            v.val = a + b;
          } else {
            v.val = a;
          }
        });
        this.quart(0, [0, 1, 2]);
        this.quart(1, [3, 4, 5]);
        this.quart(2, [6, 7, 8]);
        this.quart(3, [9, 10, 11]);
      }
    },
    // 月份改变
    change_month(e, v, n, arr) {
      let i = v.num - 1;
      e = e.match(/\d+\.?\d{0,2}/) ? e.match(/\d+\.?\d{0,2}/)[0] : "";
      this.$nextTick(() => {
        this.form.month_list[i].val = e;
        this.total();
        this.quart(n, arr);
      });
    },
    // 季度求和
    quart(n, arr) {
      let total = 0;
      arr.forEach((a) => {
        let val = this.form.month_list[a].val || 0;
        total += Number(val);
      });
      this.form.quart_list[n].val = Math.floor(total * 100) / 100;
    },
    // 全年目标求和
    total() {
      let total = 0;
      this.form.month_list.forEach((v, k) => {
        if (v.val) {
          total += Number(v.val);
        }
      });
      this.form.all = Math.round(total * 100) / 100;
    },

    confirm() {
      this.$refs["customerForm"].validate((valid) => {
        if (valid) {
          this.createLoading = true;

          let arr = [];
          this.form.month_list.forEach((v, k) => {
            if (this.isEdit) {
              arr.push({
                id: this.info["id_" + v.num] || 0,
                month: v.num,
                money: v.val || 0,
              });
            } else {
              arr.push({
                id: this.form.depart || 0,
                month: v.num,
                money: v.val || 0,
              });
            }
          });

          let url = this.isEdit
            ? "/achievement/update_department "
            : "/achievement/store";
          postData({
            url,
            data: {
              department_id: this.form.depart,
              year: this.form.year,
              money: this.form.all,
              members: arr,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg },
              } = res;
              if (code === 200) {
                this.$emit("cancel");
                this.$success(msg);
              } else {
                this.$err(msg);
                this.createLoading = false;
              }
            })
            .catch(() => {
              this.createLoading = false;
            });
        } else {
          this.createLoading = false;
          return false;
        }
      });
    },
    cancel() {
      this.resetForm();
      this.$emit("cancel");
      this.createLoading = false;
    },
    reset() {
      this.form.all = "";
      this.form.quart_list = [
        {
          text: "一",
          val: 0,
        },
        {
          text: "二",
          val: 0,
        },
        {
          text: "三",
          val: 0,
        },
        {
          text: "四",
          val: 0,
        },
      ];
      this.form.month_list = [
        {
          id: 0,
          num: 1,
          val: "",
        },
        {
          id: 0,
          num: 2,
          val: "",
        },
        {
          id: 0,
          num: 3,
          val: "",
        },
        {
          id: 0,
          num: 4,
          val: "",
        },
        {
          id: 0,
          num: 5,
          val: "",
        },
        {
          id: 0,
          num: 6,
          val: "",
        },
        {
          id: 0,
          num: 7,
          val: "",
        },
        {
          id: 0,
          num: 8,
          val: "",
        },
        {
          id: 0,
          num: 9,
          val: "",
        },
        {
          id: 0,
          num: 10,
          val: "",
        },
        {
          id: 0,
          num: 11,
          val: "",
        },
        {
          id: 0,
          num: 12,
          val: "",
        },
      ];
    },
    clear() {
      this.form.quart_list = [
        {
          text: "一",
          val: 0,
        },
        {
          text: "二",
          val: 0,
        },
        {
          text: "三",
          val: 0,
        },
        {
          text: "四",
          val: 0,
        },
      ];
      this.form.month_list = [
        {
          id: 0,
          num: 1,
          val: "",
        },
        {
          id: 0,
          num: 2,
          val: "",
        },
        {
          id: 0,
          num: 3,
          val: "",
        },
        {
          id: 0,
          num: 4,
          val: "",
        },
        {
          id: 0,
          num: 5,
          val: "",
        },
        {
          id: 0,
          num: 6,
          val: "",
        },
        {
          id: 0,
          num: 7,
          val: "",
        },
        {
          id: 0,
          num: 8,
          val: "",
        },
        {
          id: 0,
          num: 9,
          val: "",
        },
        {
          id: 0,
          num: 10,
          val: "",
        },
        {
          id: 0,
          num: 11,
          val: "",
        },
        {
          id: 0,
          num: 12,
          val: "",
        },
      ];
    },
    resetForm() {
      this.$refs["customerForm"].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.target {
  .title {
    margin-bottom: 30px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }
  .form {
    width: 100%;
    .item {
      width: 300px;

      /deep/.el-form-item__label {
        width: 80px !important;
      }

      /deep/ .el-form-item__error {
        left: 90px !important;
      }
    }
    .tit {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
    }
  }
  .head {
    /deep/.el-form-item {
      margin-bottom: 0 !important;
    }
  }
  .unit {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #9ea7b4;
    margin-bottom: 14px;
    margin-top: 12px;
  }
  .table {
    background: rgba(255, 255, 255, 0.39);
    border: 1px solid #d7dce6;
    border-radius: 8px;
    .head {
      border-bottom: 1px solid #ebedf2;
      padding: 32px 24px;
      font-size: 12px;
      font-weight: 400;
      color: #657180;
      .yellow {
        margin-left: 15px;
        font-size: 12px;
        font-weight: 600;
        color: #ffa629;
      }
    }

    .th {
      border-bottom: 1px solid #ebedf2;
    }

    .th,
    .td {
      padding: 32px 24px;
      width: 25%;
      border-right: 1px solid #ebedf2;
      margin-right: 1px;
      text-align: center;

      &:last-child {
        border-right: none;
      }

      /deep/.el-input__inner {
        width: 77px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #d7dce6;
        border-radius: 4px;
        text-align: right;
        padding: 0 10px;
      }
    }

    .space {
      margin-right: 16px;
    }

    .all {
      /deep/.el-input__inner {
        width: 200px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #d7dce6;
        border-radius: 4px;
        padding: 0 10px;
        text-align: left;
      }
    }

    .month {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: #657180;
      span {
        font-weight: 600;
        color: #464c5b;
        margin-left: 16px;
        color: #657180;
      }
      .day {
        width: 80px;
        margin-left: 0;
        margin-right: 10px;
        color: #657180;
      }
    }

    .quarter {
      display: inline-block;
      width: 77px;
      height: 32px;
      line-height: 32px;
      background: #f7f7f7;
      border: 1px solid #d7dce6;
      border-radius: 4px;
      text-align: right;
      padding: 0 10px;
    }

    .adver {
      width: 50px;
      height: 32px;
      background: #e5eaff;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 32px;
      color: #4d6fff;
      text-align: center;
      cursor: pointer;
    }
  }

  .footer {
    padding: 10px 0 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .el-button--default {
      width: 68px;
      height: 32px;
      background: #fff;
      border: 1px solid #dddddd;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      color: #666666;
      padding: 0;
    }

    .el-button--primary {
      width: 68px;
      height: 32px;
      background: #0064f9;
      border: 1px solid #0064f9;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      color: #fff;
      padding: 0;
    }
  }
}
</style>
