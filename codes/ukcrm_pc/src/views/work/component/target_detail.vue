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
      <div class="title d-between">
        {{ text }}
        <div class="edit" @click="edit()">编辑</div>
      </div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div class="unit">单位：元</div>

      <div class="table">
        <div class="head">
          全年目标
          <span class="yellow">{{
            Math.round(info.money * 100) / 100 || 0
          }}</span>
        </div>
        <div class="tr d-flex">
          <div class="th" v-for="(v, k) in quart_list" :key="k">
            <p class="month">
              {{ v.text }}季度<span class="quarter">{{ v.val }}</span>
            </p>
          </div>
        </div>
        <div class="tr d-flex">
          <div class="td">
            <p
              class="month"
              v-for="v in month_list"
              :key="v.num"
              v-if="v.num < 4"
            >
              {{ v.num }}月<span>{{ v.val }}</span>
            </p>
          </div>
          <div class="td">
            <p
              class="month"
              v-for="v in month_list"
              :key="v.num"
              v-if="v.num > 3 && v.num < 7"
            >
              {{ v.num }}月<span>{{ v.val }}</span>
            </p>
          </div>
          <div class="td">
            <p
              class="month"
              v-for="v in month_list"
              :key="v.num"
              v-if="v.num > 6 && v.num < 10"
            >
              {{ v.num }}月<span>{{ v.val }}</span>
            </p>
          </div>
          <div class="td">
            <p
              class="month"
              v-for="v in month_list"
              :key="v.num"
              v-if="v.num > 9"
            >
              {{ v.num }}月<span>{{ v.val }}</span>
            </p>
          </div>
        </div>
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
      createLoading: false,
      text: "年度目标",
      info: {},
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
          num: 1,
          val: 0,
        },
        {
          num: 2,
          val: 0,
        },
        {
          num: 3,
          val: 0,
        },
        {
          num: 4,
          val: 0,
        },
        {
          num: 5,
          val: 0,
        },
        {
          num: 6,
          val: 0,
        },
        {
          num: 7,
          val: 0,
        },
        {
          num: 8,
          val: 0,
        },
        {
          num: 9,
          val: 0,
        },
        {
          num: 10,
          val: 0,
        },
        {
          num: 11,
          val: 0,
        },
        {
          num: 12,
          val: 0,
        },
      ],
    };
  },
  methods: {
    init(v) {
      this.info = v || {};
      this.text = v.name + "年度目标";

      this.month_list.forEach((v, k) => {
        v.val = this.info["month_" + v.num];
      });

      this.quart(0, [0, 1, 2]);
      this.quart(1, [3, 4, 5]);
      this.quart(2, [6, 7, 8]);
      this.quart(3, [9, 10, 11]);
    },
    // 季度求和
    quart(n, arr) {
      let total = 0;
      arr.forEach((a) => {
        let val = this.month_list[a].val || 0;
        total += Number(val);
      });
      this.quart_list[n].val = Math.floor(total * 100) / 100;
    },
    edit() {
      this.$emit("cancel", this.info);
    },
    cancel() {
      this.$emit("cancel");
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
  .unit {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #9ea7b4;
    margin-bottom: 13px;
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
      padding: 32px 24px 5px;
      width: 25%;
      border-right: 1px solid #ebedf2;
      margin-right: 1px;
      text-align: center;

      &:last-child {
        border-right: none;
      }
    }

    .month {
      font-size: 12px;
      font-weight: 400;
      color: #657180;
      margin-bottom: 27px;
      span {
        font-weight: 600;
        color: #464c5b;
        margin-left: 16px;
      }
    }
  }
  .edit {
    cursor: pointer;
    width: 68px;
    height: 32px;
    background: #4d6fff;
    border-radius: 3px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
