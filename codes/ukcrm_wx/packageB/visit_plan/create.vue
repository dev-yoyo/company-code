<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item
          label="拜访时间"
          prop="visit_time"
          required
          @click="date_show = true"
        >
          <u-input
            v-model="info.visit_time"
            placeholder="请选择日期和时间"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>

          <u-datetime-picker
            :show="date_show"
            v-model="info.visit_date"
            mode="datetime"
            @confirm="dateConfirm"
            @cancel="date_show = false"
          ></u-datetime-picker>

          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item
          label="客户名称"
          prop="customerName"
          @click="checkCustomer"
          required
        >
          <u-input
            v-model="customer.name"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item label="拜访目的" @click="type_show = true">
          <u-input
            v-model="info.visit_type"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-picker
            :show="type_show"
            :columns="type_list"
            @confirm="typeConfirm"
            @cancel="type_show = false"
          ></u-picker>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item>
          <view class="l_label"> 备注</view>
          <view>
            <u--textarea
              v-model="info.remarks"
              placeholder="请输入"
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
            ></u--textarea>
          </view>
        </u-form-item>
      </u-form>
    </view>

    <view class="fixed_btm btm_btns d-flex" v-if="isEdit">
      <u-button
        type="default"
        @click="cancel"
        :customStyle="cancelStyle"
        :loading="createLoading"
        :disabled="createLoading"
      >
        删除
      </u-button>

      <u-button
        @click="create"
        color="#4D6FFF"
        :loading="createLoading"
        :disabled="createLoading"
      >
        保存
      </u-button>
    </view>

    <view
      v-else
      class="fixed_btm btm_btns d-flex"
      :class="is_create ? 'lightBtn' : 'btn'"
    >
      <u-button
        @click="create"
        :loading="createLoading"
        :disabled="createLoading"
        >创建</u-button
      >
    </view>
  </view>
</template>

<script>
import { getData, postData, delData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      id: 0,
      isEdit: false,
      createLoading: false,
      // 拜访时间
      date_show: false,

      // 拜访目的
      type_list: [],
      type_show: false,

      // 客户名称
      customer: {},

      info: {
        name: "",
        visit_date: Number(new Date()),
        visit_time: "",
        visit_type: "",
        visit_type_idx: "",
        remarks: "",
      },
      rules: {
        visit_time: {
          type: "date",
          required: true,
          message: "请输入拜访时间",
          trigger: ["blur", "change"],
        },
        name: {
          type: "string",
          required: true,
          message: "请选择客户",
          trigger: ["blur", "change"],
        },
      },
      cancelStyle: store.state.cancelStyle,
    };
  },
  computed: {
    // 创建按钮状态
    is_create() {
      let flag = false;
      const { name, visit_time } = this.info;

      if (name && visit_time) {
        flag = true;
      }
      return flag;
    },
  },
  onLoad() {
    let query = this.$Route.query;
    if (query.customer) {
      this.customer = query.customer;
      this.info.name = query.customer.name;
    }

    this.id = query.id || 0;
    if (this.id) {
      this.isEdit = true;
      getData(`/visit/edit?id=${this.id}`, {
        params: {},
      }).then((res) => {
        const {
          code,
          data: { info },
        } = res;
        if (code === 200) {
          this.info = info;
          this.info.visit_type_idx = info.visit_type;
          this.info.visit_type = info.visit_type_name;
        }
      });
    }

    this.init();

    // 数据监听
    let _th = this;
    uni.$on("updateData", function (data) {
      switch (data.type) {
        case "customer":
          _th.customer = data.customer;
          _th.info.name = data.customer.name;
          break;
        default:
          break;
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  methods: {
    init() {
      // 目的列表
      getData("/visit", {}).then((res) => {
        const {
          code,
          data: { visit_type },
        } = res;
        if (code === 200) {
          this.type_list = [visit_type];
        }
      });
    },

    // 拜访时间
    dateConfirm(e) {
      this.info.visit_date = e.value;
      this.info.visit_time = this.$u.timeFormat(e.value, "yyyy-mm-dd hh:MM:ss");
      this.date_show = false;
    },

    // 客户名称
    checkCustomer() {
      if (!this.isEdit) {
        this.$Router.push({
          path: "/choose_customer",
          query: {
            customer: this.customer,
            type: "customer",
          },
        });
      }
    },

    // 拜访目的
    typeConfirm(e) {
      this.info.visit_type = e.value[0];
      this.info.visit_type_idx = e.indexs[0];
      this.type_show = false;
    },

    cancel() {
      this.createLoading = !this.createLoading;
      delData(`/visit/${this.id}`, {})
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            this.$refs.uToast.show({
              message: data.msg,
              complete() {
                uni.navigateBack({ delta: 1 });
              },
            });
          } else if (code === 422) {
            if (data.customer_id) {
              this.$u.toast(customer_id[0]);
            }
            if (data.visit_time) {
              this.$u.toast(visit_time[0]);
            }
            if (data.visit_type) {
              this.$u.toast(visit_type[0]);
            }
            if (data.remarks) {
              this.$u.toast(remarks[0]);
            }
            this.createLoading = !this.createLoading;
          }
        })
        .catch(() => {
          this.createLoading = !this.createLoading;
          // uni.$u.toast("创建失败，请重试");
        });
    },

    // 创建
    create() {
      this.$refs.uForm.validate().then((res) => {
        let info = this.info;
        this.createLoading = !this.createLoading;

        let url = this.isEdit ? "/visit/update" : "/visit";

        let params = this.isEdit
          ? {
              id: this.id,
              customer_id: this.customer.id,
              visit_time: this.info.visit_time,
              visit_type: this.info.visit_type_idx,
              remarks: this.info.remarks,
            }
          : {
              customer_id: this.customer.id,
              visit_time: this.info.visit_time,
              visit_type: this.info.visit_type_idx,
              remarks: this.info.remarks,
            };

        console.log("params >>", params);
        // return;
        postData(url, params)
          .then((res) => {
            const { code, data } = res;
            if (code === 200) {
              this.$refs.uToast.show({
                message: data.msg,
                complete() {
                  uni.navigateBack({ delta: 1 });
                },
              });
            } else if (code === 422) {
              if (data.customer_id) {
                this.$u.toast(customer_id[0]);
              }
              if (data.visit_time) {
                this.$u.toast(visit_time[0]);
              }
              if (data.visit_type) {
                this.$u.toast(visit_type[0]);
              }
              if (data.remarks) {
                this.$u.toast(remarks[0]);
              }
              this.createLoading = !this.createLoading;
            }else {
              this.$u.toast(msg);
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
            // uni.$u.toast("创建失败，请重试");
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail_main {
  padding: 0 0 130px;
}

.l_label {
  position: relative;
  font-size: 14px;
  color: #666;
  line-height: 20px;

  text {
    position: absolute;
    left: -11px;
    color: #f56c6c;
    line-height: 20px;
    font-size: 20px;
    top: 3px;
  }
}

.form_main {
  /deep/.u-form-item__body {
    padding: 14px 20px !important;
    padding-left: 26px !important;
    // padding-right: 20px !important;
  }

  /deep/.item__body__right__content__icon {
    margin-left: 10px;
  }
}

.btm_btns {
  justify-content: space-around;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}
</style>