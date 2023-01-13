<template>
  <view>
    <view class="chooseIndustry" v-if="!secondLeveShow">
      <view
        class="item d-center"
        :class="{grey:v.status == 1}"
        v-for="(v, i) of list"
        :key="i"
        @click="choose(v)"
      >
        {{ v.label }} 
      </view>
    </view>
  </view>
</template>

<script>
import { navBack } from "@/common/hooks";

export default {
  data() {
    return {
      type:'',
      list: [],
    };
  },
  onShow() {
    let query = this.$Route.query;
    this.type = query.type;
    this.list = query.list;
    if(this.list.length > 0) {
      this.list.forEach((v,k)=>{
        v.label = v.period +'期'
      })
    }
    this.list.push({
      label: '无',
      period:'无',
      id: 0
    })

    console.log(this.list)
  },
  methods: {
    choose(v) {
      let _th = this;
      if(v.status != 1) {
        uni.$emit("updateData", {
          value: v.id,
          text: v.label,
          type: _th.type,
          item: v,
        });
        navBack();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.chooseIndustry {
  background-color: #fff;
}

.item.grey {
  color: #C3C3C3;
}
</style>s