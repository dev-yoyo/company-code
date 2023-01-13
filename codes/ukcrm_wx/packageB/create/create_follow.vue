<template>
  <view class="login_detail">
    <u-toast ref="uToast"></u-toast>

    <view class="form_main">
      <u-gap height="15" bgColor="#fff"></u-gap>

      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item
          label="跟进时间"
          prop="dateTime"
          required
          @click="dateShow = true"
        >
          <u-input
            v-model="info.visitTime"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>

          <u-datetime-picker
            :show="dateShow"
            v-model="info.dateTime"
            mode="date"
            :formatter="formatter"
            @confirm="dateConfirm"
            @cancel="dateShow = false"
          ></u-datetime-picker>

          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item label="跟进方式" prop="type" @click="type_list" required>
          <u-input
            v-model="info.type"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item prop="content">
          <view class="l_label"> <text>*</text> 跟进内容</view>
          <view>
            <u--textarea
              v-model="info.content"
              placeholder="请输入"
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
            ></u--textarea>
          </view>
        </u-form-item>
      </u-form>

      <view class="fixed_btm btm_btns" :class="is_submit ? 'lightBtn' : 'btn'">
        <u-button
          @click="submit"
          :loading="createLoading"
          :disabled="createLoading"
        >
          {{ isEdit ? "提交" : "创建" }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";

export default {
  data() {
    return {
      customer_id: "", // 客户id
      follow_id: "", // 跟进记录id
      toDay: "",
      createLoading: false,
      isEdit: false,
      info: {
        visitTime: "",
        dateTime: "",
        type: "线上拜访",
        content: "",
      },
      rules: {
        visitTime: {
          type: "string",
          required: true,
          message: "请选择跟进时间",
          trigger: ["blur", "change"],
        },
        type: {
          type: "string",
          required: true,
          message: "请选择跟进方式",
          trigger: ["blur", "change"],
        },
        content: {
          type: "string",
          required: true,
          message: "请输入跟进内容",
          trigger: ["blur", "change"],
        },
      },

      dateShow: false,

      typeList: ["线上拜访", "线下拜访"],
      typeIndex: 0,
    };
  },
  computed: {
    is_submit() {
      const { visitTime, type, content } = this.info;
      if (visitTime && type && content) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  onLoad() {
    let query = this.$Route.query;

    if (query.edit) {
      this.follow_id = query.follow_id;
      this.isEdit = true;
      this.init();
    } else {
      this.inintDate();
    }

    let _th = this;
    uni.$on("updateData", function (data) {
      console.log("updateData >>>", data);
      _th.info.type = data.value;
    });
  },
  onShow() {
    let query = this.$Route.query;
    if (query.customer_id) {
      this.customer_id = query.customer_id;
    }
  },
  methods: {
    init() {
      getData("/follow/follow_record_detail/" + this.follow_id).then((res) => {
        const {
          code,
          data: { data },
        } = res;
        if (code === 200) {
          this.info.type = this.typeList[data.visit_type];
          this.info.content = data.visit_content;
          this.info.visitTime = data.visit_time;
          this.info.dateTime = data.visit_time;
        }
      });
    },
    inintDate() {
      const d = new Date();
      const year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;

      this.info.visitTime = `${year}-${month}-${day}`;
      this.info.dateTime = `${year}-${month}-${day}`;
    },

    type_list() {
      this.$Router.push({
        path: "/choose_list",
        query: {
          list: this.typeList,
          type: "type",
        },
      });
    },
    dateConfirm(e) {
      let time = new Date(e.value);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m < 10 ? `0${m}` : m;
      d = d < 10 ? `0${d}` : d;

      let valueTime = `${y}-${m}-${d}`;

      this.info.dateTime = valueTime;
      this.info.visitTime = valueTime;
      this.dateShow = false;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}`;
      }
      if (type === "month") {
        return `${value}`;
      }
      if (type === "day") {
        return `${value}`;
      }
      return value;
    },

    submit() {
      if (!this.is_submit) return;

      this.$refs.uForm.validate().then((res) => {
        this.createLoading = !this.createLoading;
        let info = this.info;

        let typeIndex = 0;
        this.typeList.map((e, i) => {
          if (e == info.type) {
            typeIndex = i;
          }
        });

        let url = `follow/${this.isEdit ? "update" : "store"}`;
        postData(url, {
          customer_id: this.customer_id,
          follow_id: this.follow_id,
          visit_time: info.visitTime,
          visit_type: typeIndex,
          visit_content: info.content,
        })
          .then((res) => {
            const {
              code,
              data: { msg, id },
            } = res;
            if (code === 200) {
              this.$refs.uToast.show({
                message: msg,
                complete() {
                  uni.navigateBack({ delta: 1 });
                },
              });

              // if (!this.isEdit) {
              //   this.$Router.replace({
              //     path: "/follow_record/" + id,
              //     query: {
              //       follow_id: id,
              //     },
              //   });
              // }
            } else if (code === 422) {
              this.createLoading = !this.createLoading;
              this.$u.toast(msg);
            }else {
              this.$u.toast(msg);
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_detail {
  padding: 0 0 130px;
}

.btm_btns {
  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

.form_main {

  /deep/.item__body__right__content__icon {
    margin-left: 10px;
  }

  /deep/.u-form-item__body__right__message {
    padding-left: 26px!important;
  }

  .l_label {
    position: relative;
    font-size: 14px;
    color: #666;
    line-height: 20px;

    text {
      position: absolute;
      left: -9px;
      color: #f56c6c;
      line-height: 20px;
      font-size: 20px;
      top: 3px;
    }
  }
}

/deep/ .u-textarea {
  padding: 10px 0 !important;
}
</style>