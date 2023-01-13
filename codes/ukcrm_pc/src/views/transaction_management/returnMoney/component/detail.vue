<template>
  <div class="add_detail">
    <el-drawer
      :visible.sync="show"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="1054px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">回款</div>
      <div class="kuang">
        <div class="close_icon d-center" @click="cancel">
          <i class="iconfont icon-ykbx"></i>
        </div>

        <div class="edit_btn d-between">
          <div class="no">{{ contract.contract_no }}</div>

          <el-button class="edit" @click="edit" v-if="exists">编辑</el-button>
        </div>

        <div class="customer_info">
          <div class="item_box d-flex">
            <div class="item">
              客户名称：<span>{{ contract.customer_name }}</span>
            </div>
            <div class="item">
              回款日期：<span>{{ info.return_time }}</span>
            </div>
            <div class="item">
              回款金额：<span>{{ info.return_money }}</span>
            </div>
            <div class="item">
              负责人：<span>{{ contract.sign_user }}</span>
            </div>
          </div>
        </div>

        <el-form
          :model="info"
          ref="returnForm"
          label-width="80px"
          class="demo-form"
        >
          <div class="form_tit">基础信息</div>

          <div class="d-flex">
            <el-form-item label="回款编号">
              <el-input v-model="info.return_num" disabled> </el-input>
            </el-form-item>

            <el-form-item label="关联客户">
              <el-input v-model="contract.customer_name" disabled></el-input>
            </el-form-item>
          </div>

          <div class="d-flex">
            <el-form-item label="关联企业">
              <el-input
                v-model="contract.customer_company_name"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item label="关联合同">
              <el-input v-model="contract.contract_name" disabled> </el-input>
            </el-form-item>
          </div>

          <div class="d-flex">
            <el-form-item label="创建人">
              <el-input v-model="contract.sign_user" disabled></el-input>
            </el-form-item>

            <el-form-item label="创建时间">
              <el-input v-model="contract.sign_time" disabled></el-input>
            </el-form-item>
          </div>

          <div class="d-flex">
            <el-form-item label="合同金额">
              <el-input v-model="contract.money" disabled></el-input>
            </el-form-item>
            <el-form-item label="已回款">
              <el-input v-model="contract.has_return_money" disabled></el-input>
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="info.remarks"
              disabled
            ></el-input>
          </el-form-item>

          <div class="form_tit">回款信息</div>
          <div class="d-flex">
            <el-form-item label="回款计划期数">
              <el-input
                v-model="info.payment_plan.period"
                disabled
                v-if="info.payment_plan"
              ></el-input>
              <el-input disabled v-else></el-input>
            </el-form-item>

            <el-form-item label="回款金额">
              <el-input v-model="info.return_money" disabled></el-input>
            </el-form-item>
          </div>

          <div class="d-flex">
            <el-form-item label="回款日期">
              <el-input v-model="info.return_time" disabled></el-input>
            </el-form-item>

            <el-form-item label="支付方式">
              <el-input v-model="info.pay_type" disabled></el-input>
            </el-form-item>
          </div>

          <el-form-item label="汇款银行">
            <el-input v-model="info.pay_bank" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <!-- 新建回款 -->
    <add-return
      v-if="addReturnShow"
      ref="refAddReturn"
      @cancel="hideAddReturn"
    ></add-return>
  </div>
</template>

<script>
import addReturn from "./add.vue";
import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      show: true,
      user: {},

      contract: {},
      info: {},
      exists: false,
      addReturnShow: false,
    };
  },
  methods: {
    init(return_id) {
      // console.log("回款详情 >>", return_id);

      getData({
        url: "/payment_collection/payment_detail",
        data: {
          id: return_id,
        },
      }).then((res) => {
        const {
          code,
          data: { detail, exists },
        } = res;
        if (code === 200) {
          // console.log("detail >>>", detail);
          this.info = detail;
          this.contract = detail.contract;
          this.exists = exists;
        }
      });
    },

    edit() {
      // console.log("edit >> ", this.info);
      this.add(this.info);
    },
    cancel() {
      this.$emit("cancel");
    },

    // 新建回款 新建回款 新建回款 新建回款 新建回款
    add(row) {
      // console.log("return_list > 新建、编辑回款 >>>", row);
      this.addReturnShow = true;

      this.$nextTick(() => {
        this.$refs.refAddReturn.init({
          return_id: row ? row.id : false,
          contract_id: row ? row.contract.id : false,
        });
      });
    },
    hideAddReturn({ update_list, return_id }) {
      if (update_list) {
        this.init(return_id);
      }

      this.addReturnShow = false;
    },
    // 新建回款 新建回款 新建回款 新建回款 新建回款
  },
  components: {
    addReturn,
  },
};
</script>

<style lang="less" scoped>
.add_detail {
  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }
  .kuang {
    margin-left: 26px;
  }
  .form_tit {
    margin: 24px 0 16px;
    font-size: 12px;
    font-weight: 600;
    color: #464c5b;
  }
}

.edit_btn {
  margin-bottom: 22px;

  .no {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .edit {
    padding: 0;
    width: 68px;
    height: 32px;
    background: #0064f9;
    border-radius: 3px;

    color: #fff;
    font-size: 14px;
    font-weight: 400;
  }
}

.customer_info {
  padding: 25px 24px;
  margin-bottom: 23px;
  background: #f4f6ff;
  border-radius: 4px;

  .item_box {
    // margin-bottom: 12px;
    .item {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #9ea7b4;

      span {
        color: #657180;
      }
    }
  }
}

/deep/.el-form-item {
  margin-bottom: 16px;
}
</style>
