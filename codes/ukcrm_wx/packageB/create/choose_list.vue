<template>
  <view>
    <view class="chooseIndustry" v-if="!secondLeveShow">
      <view class="item" v-for="(v, i) of list" :key="i" @click="choose(v)">
        {{ v }}
      </view>
    </view>

    <view class="chooseIndustry" v-if="secondLeveShow">
      <view
        class="item"
        v-for="(v, i) of list"
        :key="i"
        @click="chooseSecond(v)"
      >
        {{ v.name }}
      </view>
    </view>
  </view>
</template>

<script>
import { navBack } from "@/common/hooks";

export default {
  data() {
    return {
      type: "", // 客户性质 客户状态 客户标签 客户来源 所属行业
      list: [],
      index: 0, // 选择产品 多选 当前索引
      secondLeveShow: false,
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log("choose_list query >>>", query);

    this.type = query.type;
    this.list = query.list;
    this.index = query.index;

    // 选择产品
    if (
      query.type == "create_offer" ||
      query.secondLeveShow
    ) {
      this.secondLeveShow = true;
      this.list = JSON.parse(query.list);
    }
  },
  methods: {
    // 一维
    choose(v) {
      let _th = this;
      uni.$emit("updateData", {
        value: v,
        type: _th.type,
      });
      navBack();
    },

    // 二维
    chooseSecond(v) {
      console.log(v);
      let _th = this;
      uni.$emit("updateData", {
        value: v,
        index: _th.index,
        type: _th.type,
      });
      navBack();
    },
  },
};
</script>

<style lang="less" scoped>
.chooseIndustry {
  background-color: #fff;
}
</style>