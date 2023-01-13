<template>
  <div class="repair_detail">
    <el-drawer
      :visible="returnShow"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="855px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">查看</div>
      <div class="close_icon d-center" @click="cancel()">
        <i class="iconfont icon-ykbx"></i>
      </div>
      <div class="repair" v-if="info && info.rework_record_sort">
        <div class="r_title">
          <span class="r_p_code" v-if="info.shipment && info.shipment.shipment_code">{{info.shipment.shipment_code}}</span>
          <span class="r_p_status" v-if="info && info.warranty_status">{{info.warranty_status}}</span>
        </div>
        <div class="p_info">
          <div>
            <span>合同编号：</span>
            <span>{{info.contract.contract_no}}</span>
          </div>
          <div>
            <span>关联企业：</span>
            <span>{{info.contract.customer_company_name}}</span>
          </div>
          <div>
            <span>产品名称：</span></span>
            <span>{{info.product_name}}</span>
          </div>
          <div>
            <span>产品编码：</span></span>
            <span>{{info.product_code}}</span>
          </div>
          <div>
            <span>出货编号：</span>
            <span>{{info.shipment.id}}</span>
          </div>
          <div>
            <span>出货时间：</span>
            <span>{{info.shipment.shipment_time}}</span>
          </div>
          <div>
            <span>质保期：</span>
            <span>{{info.contract.warranty}}</span>
          </div>
          <div>
            <span>经办人：</span>
            <span>{{info.user.name}}</span>
          </div>
        </div>
        <div class="logs">
          <div class="l_title">
            <span>返修记录</span>
            <img @click="seqencing" src="../../../../assets/images/sort.png" alt="" style="width: 15px;height: 13px;">
          </div>
          <div class="l_item" v-for="(v,k) in info.rework_record_sort" :key="k">
            <div class="i_title">
              {{k+1+'.  '+ v.rework_time}}，由
              <span style="">{{v.user.name}}</span>
              提交
            </div>
            <div class="r_info">
              <p v-if="v.fault">
                <span>故障问题：</span>
                <span>{{v.fault}}</span>
              </p>
              <p v-if="v.repair_day">
                <span>预计返修时间：</span>
                <span>{{v.repair_day}}天</span>
              </p>
              <p v-if="v.rework_complete_time">
                <span>返修完成日期：</span>
                <span>{{v.rework_complete_time}}</span>
              </p>
              <p v-if="v.rework_result">
                <span>返修结果：</span>
                <span v-if="v.rework_result=='已维修'" class="r_succ">{{v.rework_result}}</span>
                <span v-if="v.rework_result=='已报废'" class="r_fail">{{v.rework_result}}</span>
              </p>
              <p v-if="v.rework_complete_reason">
                <span>返修说明：</span>
                <span>{{v.rework_complete_reason}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="table_empty">
          <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"/>
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
      desc: '',
      code: '',
      returnShow: true,
      info: {}
    };
  },
  created() {},
  methods: {
    init({ code, desc }) {
      this.code = code;
      getData({
        url: "/contract/rework_detail",
        data: {
          product_code: code,
          desc: desc
        }
      }).then((res) => {
        if(res.code = 200){
          this.info = JSON.parse(JSON.stringify(res.data.detail))
        }
      });
    },
    seqencing(){
      if(this.desc == 'desc'){
        this.desc = 'asc'
      } else {
        this.desc = 'desc'
      }
      this.init({code:this.code,desc:this.desc})
    },
    cancel() {
      this.$emit("cancel");
    },
  }
};
</script>

<style lang="less" scoped>
.repair_detail {
  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .form_tit {
    margin: 24px 0 16px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
    color: #464c5b;
  }
}
.repair{
  .r_title{
    display: flex;
    align-items: center;
    .r_p_code{
      font-size: 16px;
      font-weight: 600;
      color: #464C5B;
    }
    .r_p_status{
      padding: 4px 10px;
      margin: 10px;
      display: inline-block;
      height: 24px;
      background: #E9ECF2;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
    }
  }
  .p_info{
    width: 757px;
    height: 133px;
    padding: 24px 25px;
    background: #F4F6FF;
    opacity: 1;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    align-content: space-between;
    justify-content: flex-start;
    >div{
      width: 30%;
      margin-right: 30px;
      > :first-child{
        display: inline-block;
        width: 60px;
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        color: #9EA7B4;
        text-align-last: justify;
        text-align: justify;
      }
      > :last-child{
        font-size: 12px;
        font-weight: 400;
        color: #373E46;
      }
    }
    > :nth-child(3n){
      margin-right: 0px;
    }
  }
  .logs{
    margin: 40px 0;
    .l_title{
      display: inline-flex;
      align-items: center;
      > :first-child{
        font-size: 15px;
        font-weight: 500;
        color: #333333;
        margin-right: 10px;
      }
    }
    .l_item{
      margin: 18px;
      padding: 0 14px;
      .i_title{
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        > span{
          color: #666;
          font-weight: 600;
        }
      }
      .r_info{
        margin: 5px 0;
        padding: 7px 16px;
        background: #F7F8FA;
        > p{
          margin: 5px 0;
          font-size: 13px;
          font-weight: 400;
          > :first-child{
            color: #848484;
          }
          > :last-child{
            color: #373E46;
          }
          .r_succ{
            width: 50px;
            height: 20px;
            padding: 0 5px;
            color: #00B715;
            line-height: 20px;
            background: #DCF5DD;
            text-align: center;
            border-radius: 4px;
          }
          .r_fail{
            width: 50px;
            height: 20px;
            padding: 0 5px;
            color: #FF1400;
            line-height: 20px;
            background: #FFE4D9;
            text-align: center;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
.table_empty{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>