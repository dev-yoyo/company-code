<template>
  <view class="address_edit">
    <u-form
      class="edit_form"
      :model="form"
      ref="uForm"
      :error-type="['toast']"
      label-width="160"
      :border-bottom="false"
      label-position="left"
    >
      <u-form-item label="收货人" prop="name" :border-bottom="false">
        <u-input v-model="form.name" placeholder="请输入收货人" />
      </u-form-item>
      <u-form-item label="手机/电话" prop="tel" :border-bottom="false">
        <u-input v-model="form.tel" placeholder="请输入手机/电话" />
      </u-form-item>
      <u-form-item label="邮编" prop="postcode" :border-bottom="false">
        <u-input v-model="form.postcode" placeholder="请输入邮编" />
      </u-form-item>
      <u-form-item label="所在地区" prop="district" :border-bottom="false">
        <view
          class="choose_area_ipt"
          :class="form.district ? '' : 'un_area'"
          @tap="region = true"
          >{{ form.district ? form.district : "请选择所在地区" }}</view
        >

        <u-picker
          class="region"
          mode="region"
          v-model="region"
          @confirm="confirm"
        ></u-picker>
      </u-form-item>

      <u-form-item label="详细地址" prop="address" :border-bottom="false">
        <u-input
          v-model="form.address"
          type="textarea"
          height="156"
          :auto-height="true"
          maxlength="10000"
          placeholder="请输入详细地址"
        />
      </u-form-item>

      <u-form-item label="设为默认收货地址" label-width="360">
        <u-switch slot="right" v-model="form.default"></u-switch>
      </u-form-item>
    </u-form>

    <view class="edit_btn">
      <view
        class="btn remove"
        @click="$u.debounce(remove, 1000)"
        v-if="type != 'add'"
        >删除</view
      >
      <view class="btn save" @click="$u.debounce(submit, 1000)">保存</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      form: {
        id: "",
        info: {},
        name: "",
        tel: "",
        district: "",
        address: "",
        default: false,
        postcode: "",
      },
      region: false,
      rules: {
        name: [
          {
            required: true,
            message: "请输入收货人",
            trigger: ["change", "blur"],
          },
        ],
        tel: [
          {
            required: true,
            message: "请输入手机/电话",
            trigger: ["change", "blur"],
          },
          {
            validator: (rule, value, callback) => {
              var re = /^0\d{2,3}-?\d{7,8}$/;
              return this.$u.test.mobile(value) || re.test(value);
            },
            message: "手机/电话不正确",
            trigger: ["change", "blur"],
          },
        ],
        district: [
          {
            required: true,
            message: "请选择所在地区",
            trigger: ["change", "blur"],
          },
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: ["change", "blur"],
          },
        ],
        postcode: [
          {
            required: false,
            message: "请输入邮编",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query.type);

    if (query.type == "add") {
      this.type = "add";
      this.form.default = true;
    }

    if (query.id) {
      this.id = query.id;
      this.getInfo(this.id);
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    getInfo(id) {
      this.$u.api.getAddressInfo({ id }).then((res) => {
        let info = res.data.info;
        this.form.name = info.name;
        this.form.tel = info.tel;
        this.form.district = info.district;
        this.form.address = info.address;
        this.form.postcode = info.postcode;
        this.form.default = info.default == "是";
      });
    },
    area() {
      this.region = true;
    },

    // 邮编校验
    postcode_valid(value) {
      var re = /^[1-9][0-9]{5}$/;
      return re.test(value);
    },

    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.$u.api
              .editAddress({
                id: this.id,
                name: this.form.name,
                tel: this.form.tel,
                district: this.form.district,
                address: this.form.address,
                postcode: this.form.postcode,
                default: this.form.default ? "是" : "否",
              })
              .then((res) => {
                this.$u.toast(res.data.msg);
                uni.navigateBack();
                // this.$router.go(-1)
              });
          } else {
            this.$u.api
              .addAddress({
                name: this.form.name,
                tel: this.form.tel,
                district: this.form.district,
                address: this.form.address,
                postcode: this.form.postcode,
                default: this.form.default ? "是" : "否",
              })
              .then((res) => {
                this.$u.toast(res.data.msg);
                uni.navigateBack();
                // this.$router.go(-1)
              });
          }
        }
      });
    },
    remove() {
      this.$u.api
        .deleteAddress({
          id: this.id,
        })
        .then((res) => {
          this.$u.toast(res.data.msg);
          uni.navigateBack();
        });
    },
    confirm(e) {
      this.form.district =
        e.province.label + " " + e.city.label + " " + e.area.label;
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  background: #fff;
}

.address_edit {
  padding: 26rpx 0 0;
  background: #fff;
  height: 100%;
}

.edit_form {
  padding: 0 32rpx 0;
}

/deep/ .u-form-item {
  padding: 0 0 30rpx;

  .u-form-item--left__content__label {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    line-height: 94rpx;
  }

  .u-form-item__body {
    align-items: flex-start;
  }

  .u-input__input {
    box-sizing: border-box;
    height: 94rpx;
    padding: 26rpx 30rpx;
    background: #f6f6f6;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
  }

  .u-form-item--right {
    min-height: 94rpx;
  }
}

/deep/ .u-border-bottom:after {
  border-bottom-width: 0 !important;
}

.choose_area_ipt {
  padding: 0 30rpx;
  width: 100%;
  height: 94rpx;
  line-height: 94rpx;
  font-size: 30rpx;
  color: #333;
  background: #f6f6f6;
  border-radius: 16rpx;
}

.un_area {
  color: rgb(192, 196, 204);
}

.edit_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16rpx;
  .btn {
    margin-right: 22rpx;
    width: 348rpx;
    height: 88rpx;
    background: #0268fa;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 88rpx;
    text-align: center;
    color: #fff;
  }
  .remove {
    margin-right: 22rpx;
    background: #fff;
    border: 2rpx solid #0268fa;
    color: #0268fa;
  }
}
</style>
