<template>
  <div class="info">

    <main class="main">
      <div class="tips">
        <svg class="icon" aria-hidden="true" style="display: inline-block; margin: 0 15px; font-size: 24px">
          <use xlink:href="#icon-grrz-smrz"></use>
        </svg>
        <p>{{ tips }}</p>
        <div class="title floatR">
          <div v-if="!edit && ceriStatus == '未提交'" @click="edit = true" class="prove_btn">去认证</div>
          <div v-else-if="ceriStatus == '待审核'" class="proveWait">待审核</div>
          <div v-else-if="ceriStatus == '审核通过'" class="proveWait">审核通过</div>
          <div v-else-if="ceriStatus == '审核失败' && !edit" class="proveFail">
            <span>
              <svg class="icon" aria-hidden="true" style="display: inline-block; font-size: 14px">
                <use xlink:href="#icon-grrz-shsb"></use>
              </svg>
              审核失败
            </span>
            <span v-if="reason" @click="oops">查看原因</span>
          </div>
        </div>

      </div>
      <div class="prove">
        <div class="item">
          <div class="item_title">真实姓名</div>
          <div v-if="!edit">{{ form.name || '/' }}</div>
          <div v-if="edit" class="ipt">
            <input type="text" v-model="form.name" />
          </div>
        </div>
        <div class="item">
          <div class="item_title">身份证号</div>
          <div v-if="!edit">{{ form.id_number || '/' }}</div>
          <div v-else class="ipt">
            <input type="text" v-model="form.id_number" />
          </div>
        </div>
        <div class="item vi_0">
          <div class="item_title"></div>
          <div v-if="!edit"></div>
          <div v-else class="ipt">
            <input type="text" v-model="form.bank_name" />
          </div>
        </div>
        <div class="item">
          <div class="item_title">开户行</div>
          <div v-if="!edit">{{ form.bank_name || '/' }}</div>
          <div v-else class="ipt">
            <input type="text" v-model="form.bank_name" />
          </div>
        </div>
        <div class="item">
          <div class="item_title">银行卡号</div>
          <div v-if="!edit">{{ form.bank_number || '/' }}</div>
          <div v-else class="ipt">
            <input type="number" v-model="form.bank_number" />
          </div>
        </div>
        <div class="item">
          <div class="item_title">支付宝账号</div>
          <div v-if="!edit">{{ form.alipay_account || '/' }}</div>
          <div v-else class="ipt">
            <input type="text" v-model="form.alipay_account" />
          </div>
        </div>
        <div class="item_pic">
          <div class="item_title">身份证照</div>
          <div class="item_pic_box">
            <div>
              <img :src="form.id_front ? form.id_front : front" alt="" />
              <el-upload class="upload-demo" action="" :show-file-list="false" :http-request="imgUpload"
                :file-list="idCard1">
                <img v-if="edit" class="icon_camera" :src="camera" alt="" />
              </el-upload>
            </div>
            <p>正面照片</p>
            <p v-show="edit">支持.jpg .jpeg .png 不超过2M</p>
          </div>
          <div class="item_pic_box" style="margin-left: 95px">
            <div>
              <img :src="form.id_reverse ? form.id_reverse : back" alt="" />
              <el-upload class="upload-demo" action="" :show-file-list="false" :http-request="imgUpload2"
                :file-list="idCard2">
                <img v-if="edit" class="icon_camera" :src="camera" alt="" />
              </el-upload>
            </div>
            <p>反面照片</p>
            <p v-show="edit">支持.jpg .jpeg .png 不超过2M</p>
          </div>
        </div>
        <div v-if="edit" class="option">
          <el-button @click="edit = false" round size="medium">取消</el-button>
          <el-button @click="submit" type="primary" round size="medium">提交</el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
export default {
  name: "team",
  data() {
    return {
      isModify: false,
      front: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/thefront.png',
      back: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/theback.png',
      camera: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/camera.png',
      edit: false,
      tips: "实名认证提交的资料需要经过平台审核，审核通过后，你可获得的权限：1.收益资金体现  2.报名参与项目开发",
      form: {
        name: "",
        id_number: "",
        bank_name: "",
        bank_number: "",
        alipay_account: "",
        id_front: '',
        id_reverse: '',
      },
      reason: '',
      idCard1: [],
      idCard2: [],
      ceriStatus: '未提交'
    };
  },
  created() {
    this.init()
  },
  methods: {
    // 获取用户信息
    init() {
      let url = '/user/user_certification/index';
      getData({ url }).then(res => {
        if (res.code == 200 && res.data.info != null) {
          let { name, id_number, bank_name, bank_number, alipay_account, id_front, id_reverse } = res.data.info;
          this.form.name = name;
          this.form.id_front = id_front;
          this.form.id_number = id_number;
          this.form.bank_name = bank_name;
          this.form.id_reverse = id_reverse;
          this.form.bank_number = bank_number;
          this.form.alipay_account = alipay_account;
          // this.reason = res.data.user_info.reason || '认证失败';
          this.reason = res.data.user_info.reason || '';
          this.ceriStatus = res.data.user_info.status;
        } else {
          // this.$err('获取认证信息失败！')
        }
      })
    },
    oops() {
      this.$confirm(this.reason, '原因', {
        distinguishCancelAndClose: true,
        confirmButtonText: '去修改',
        cancelButtonText: '取消'
      }).then(() => {
        this.edit = true;
        this.isModify = true;
      })
    },
    // 图片上传
    uploadTips() {
      this.$message({
        duration: 1000,
        iconClass: 'el-icon-loading',
        dangerouslyUseHTMLString: true,
        message: `<span style="color:#999;">&emsp;图片上传中...</span>`
      });
    },
    imgUpload(e) {
      this.uploadTips();
      let data = new FormData();
      data.append('file', e.file)
      let url = '/common/single';
      postData({ url, data }).then(res => {
        // console.log('res====', res)
        if (res.code == 200 && res.data.path_url) {
          this.form.id_front = res.data.path_url;
          this.$success(res.data.msg)
        }
      })
    },
    imgUpload2(e) {
      this.uploadTips();
      let data = new FormData();
      data.append('file', e.file)
      let url = '/common/single';
      postData({ url, data }).then(res => {
        // console.log('res====', res)
        if (res.code == 200 && res.data.path_url) {
          this.form.id_reverse = res.data.path_url;
          this.$success(res.data.msg)
        }
      })
    },
    // 个人认证
    submit() {
      if (!this.form.name) {
        this.$err('请填写姓名！')
        return
      }
      if (!this.form.id_number) {
        this.$err('请填写身份证号！')
        return
      }
      if (this.form.id_number) {
        let id18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        let id15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
        // 校验身份证：
        if (id18.test(this.form.id_number) || id15.test(this.form.id_number)) {
        } else {
          this.$err('请填写正确的身份证号！')
          return
        }
      }
      if (!this.form.bank_name) {
        this.$err('请填写开户行！')
        return
      }
      if (!this.form.bank_number) {
        this.$err('请填写银行卡号！')
        return
      }
      if (!this.form.alipay_account) {
        this.$err('请填写支付宝账号！')
        return
      }
      if (!this.form.id_front) {
        this.$err('请上传身份证正面照片！')
        return
      }
      if (!this.form.id_reverse) {
        this.$err('请上传身份证背面照片！')
        return
      }
      this.edit = false;
      let url = this.isModify ? '/user/user_certification/update' : '/user/user_certification/store';
      let data = this.form;
      postData({ url, data }).then(res => {
        if (res.code == 200) {
          this.$success(res.data.msg)
          this.init()
          this.ceriStatus = '待审核';
          this.isModify = false;
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.info {
  background-color: #fff;
  // border: 1px solid red;
}
.vi_0{
  visibility: hidden;
}

.title {
  height: 0.76rem;
  font-size: 0.16rem;
  font-weight: 600;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.33rem 0 0.59rem;
  position: absolute;
    right: 0.34rem;

  .prove_btn {
    width: 0.67rem;
    height: 0.32rem;
    text-align: center;
    line-height: 0.32rem;
    color: #1b385c;
    font-size: 0.13rem;
    background: #f0f4f8;
    border-radius: 0.04rem;
  }

  .proveFail {
    font-size: 0.13rem;

    > :first-child {
      color: #ff980b;
      margin-right: 0.1rem;
    }

    > :last-child {
      color: #4078f9;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

.main {
  border-top: 0.01rem solid #ebebeb;
}

.tips {
  color: #cb781f;
  font-size: 0.15rem;
  width: 100%;
  height: 0.55rem;
  display: flex;
  align-items: center;
  background: #fff9ef;
}

.prove {
  width: 100%;
  height: 5.27rem;
  font-size: 0.15rem;
  margin-top: 0.1rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  .option {
    width: 100%;
    margin-top: 0.54rem;
    text-align: center;
  }
}

.item {
  width: 4.76rem;
  height: 0.35rem;
  margin: 0.13rem 0;
  display: flex;
  align-items: center;

  .item_title {
    width: 0.75rem;
    height: 0.21rem;
    color: #666;
    text-align: justify;
    text-align-last: justify;
    margin-left: 0.33rem;
    margin-right: 0.3rem;
    display: flex;
  }

  .ipt {
    height: 100%;
    width: 3.1rem;

    >input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      color: #333;
      padding: 0.07rem 0.2rem;
      border-radius: 0.04rem;
      border: 1px solid #409EFF;
    }

    >input:focus {
      outline: 0.01rem solid #53a4f0;
      border: 0;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }
}

.item_pic {
  width: 8.21rem;
  margin: 0.13rem 0;
  display: flex;

  .item_title {
    width: 0.75rem;
    height: 0.21rem;
    color: #666;
    text-align: justify;
    text-align-last: justify;
    margin-left: 0.33rem;
    margin-right: 0.3rem;
    display: flex;
  }

  .item_pic_box {
    width: 2.6rem;
    overflow: hidden;
    box-sizing: border-box;

    >div {
      width: 2.6rem;
      height: 1.6rem;
      position: relative;

      >img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .icon_camera {
        width: 0.63rem;
        height: 0.63rem;
        position: absolute;
        top: 50%;
        left: 50%;
        cursor: pointer;
        transform: translate(-50%, -50%);
      }
    }

    >p {
      text-align: center;
    }

    > :nth-child(2) {
      color: #666;
      font-size: 0.13rem;
      margin-top: 0.1rem;
    }

    > :last-child {
      color: #999;
      font-size: 0.12rem;
    }
  }
}

.proveWait {
  color: #1b4b84;
  font-size: 0.13rem;
}

/deep/ .el-button {
  width: 0.9rem;
}
</style>