<template>
  <div class="info">
    <main class="main">
      <div class="tips">
        <svg
          class="icon"
          aria-hidden="true"
          style="display: inline-block; margin: 0 5px 0 15px; font-size: 30px"
        >
          <use xlink:href="#icon-grzz-qyrz"></use>
        </svg>
        <p>
          <span style="color: #3458dd">{{ tips1 }}</span>
          <span style="color: #1b385c">{{ tips2 }}</span>
        </p>
        <div class="title">
      <div v-if="status =='未提交'&&!edit" @click="edit = true" class="prove_btn">去认证</div>
      <div v-else-if="status == '待审核'" class="proveWait">待审核</div>
      <div v-else-if="status == '审核通过'" class="proveWait">审核通过</div>
      <div v-else-if="status == '审核失败' && !edit" class="proveFail">
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
        <div class="flex-box td_infor">
        <div class="item item-qymc">
          <div class="item_title"><span v-show="edit" class="star">*</span> 企业名称</div>
          <div v-if="!edit" class="text">{{ form.company_name || '/' }}</div>
          <div v-if="edit" class="ipt">
            <input type="text" v-model="form.company_name" />
          </div>
        </div>
        <div class="item item-zch">
          <div class="item_title">
            <span v-show="edit" class="star">*</span>统一社会信用代码或注册号
          </div>
          <div v-if="!edit" class="text">{{ form.id_number || '/' }}</div>
          <div v-else class="ipt">
            <input type="text" v-model="form.id_number" />
          </div>
        </div>
        <div class="item item-tdmc">
          <div class="item_title"><span v-show="edit" class="star">*</span>团队名称</div>
          <div v-if="!edit" class="text">{{ form.team_name || '/' }}</div>
          <div v-else class="ipt">
            <input type="text" v-model="form.team_name" />
          </div>
        </div>
      </div>
        <div class="item">
          <div class="item_title item_yyzz">
            <span v-show="edit" class="star">*</span>营业执照扫描件
          </div>
          <!-- 营业执照扫描件只能上传一个 -->
          <div class="annex_box" :style="{ padding: edit ? '0 0' : '7px 20px' }">
            <div class="annex" v-if="picList">
              <div class="annex_div">
                <img class="annex_img" :src="picList" alt="">
                <svg @click="delAnnex" v-if="edit" class="icon delAnnex" aria-hidden="true">
                  <use xlink:href="#icon-sc"></use>
                </svg>
              </div>
            </div>
            <p v-if="picList=='null' && !edit">/</p>
            <el-upload v-if="edit" class="upload-demo" action="" :show-file-list="false" :limit="1" :before-upload="beforeUpload" :http-request="imgUpload" :file-list="fileList" accept="image/png,image/jpg,image/jpeg">
              <div class="upFileBtn">{{picList?'重新上传':'添加附件'}}</div>
            </el-upload>
          </div>
        </div>
        <div class="line"></div>
        <div class="flex-box contact_fs">
          <div class="item ">
          <div class="item_title"><span v-show="edit" class="star">*</span>联系人</div>
          <div v-if="!edit" class="text">{{ form.contact_name || '/' }}</div>
          <div v-else class="ipt">
            <input type="text" v-model="form.contact_name" />
          </div>
        </div>
        <div class="item">
          <div class="item_title"><span v-show="edit" class="star">*</span>联系方式</div>
          <div v-if="!edit" class="text">{{ form.phone || '/' }}</div>
          <div v-else class="ipt">
            <input type="text" v-model="form.phone" />
          </div>
        </div>
        </div>
       
        
        <div class="item_pic">
          <div class="item_title"><span v-show="edit" class="star">*</span>身份证照</div>
          <div class="item_pic_box">
            <div>
              <img :src="form.id_front ? form.id_front : front" alt="" />
              <el-upload class="upload-demo" action="" :show-file-list="false" :http-request="imgUpload1" :file-list="idCard1">
                <img v-if="edit" class="icon_camera" :src="camera" alt="" />
              </el-upload>
            </div>
            <p>正面照片</p>
            <p v-show="edit">支持.jpg .jpeg .png 不超过2M</p>
          </div>
          <div class="item_pic_box" style="margin-left: 95px">
            <div>
              <img :src="form.id_reverse ? form.id_reverse : back" alt="" />
              <el-upload class="upload-demo" action="" :show-file-list="false" :http-request="imgUpload2" :file-list="idCard2">
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
  name: "enterprise",
  data() {
    return {
      isModify: false,
      dialogVisible: false,
      front:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/thefront.png',
      back:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/theback.png',
      camera:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/camera.png',
      edit: false,
      tips1: "企业认证通过后，可提升团队的竞价优势~",
      tips2: "（请填写正确的企业信息，易百纳承诺不会透露给任何第三方；认证审核需要 1~3 个工作日。）",
      status: '未提交',
      reason: '',
      form: {
        company_name: "",
        id_number: "",
        business_license: "",
        contact_name: "",
        team_name: "",
        phone: "",
        id_front: '',
        id_reverse: ''
      },
      picList:'' ,
      idCard1: [],
      idCard2: [],
      fileList: []
    };
  },
  created(){
    this.init();
  },
  methods: {
    init(){
      // 查询逻辑 如果查询企业接口没有返回个人信息数据 则查询个人数据看是否有个人的联系人 联系方式 身份证照
      let url = '/user/team_certification/index';
      getData({url}).then(res=>{
        if (res.code == 200 && res.data.info != null) {
          let { company_name, team_name, phone } = res.data.info;
          let contact_name = res.data.info.team_certification?.contact_name;
          let status = res.data.info.status;
          let reason = res.data.info.reason;
          this.form.company_name = company_name;
          this.form.id_number =  res.data.info.team_certification?.id_number;
          this.form.business_license = res.data.info.team_certification?.business_license;
          this.picList=res.data.info.team_certification?.business_license
          this.form.id_front = res.data.info.team_certification?.id_front;
          this.form.id_reverse = res.data.info.team_certification?.id_reverse;
          this.form.contact_name = contact_name || '/';
          this.form.team_name = team_name || '/';
          this.form.phone = phone;
          this.status = status || '';
          this.reason = reason || '';
        }else{
          let url = '/user/user_certification/index';
          getData({url}).then(res=>{
            if(res.code == 200 && res.data.info != null){
              this.form.contact_name=res.data.info.name
              this.form.id_front=res.data.info.id_front
              this.form.id_reverse=res.data.info.id_reverse
              this.form.phone = res.data.info.phone || res.data.user_info.phone
            } else {
            }
          })
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
    uploadTips(){
      this.$message({
        duration: 1000,
        iconClass: 'el-icon-loading',
        dangerouslyUseHTMLString: true,
        message: `<span style="color:#999;">&emsp;图片上传中...</span>`
      });
    },
    beforeUpload(file) {
      this.delAnnex();
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 .png, .jpg, .jpeg 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    delAnnex(){

      this.picList=''
      this.fileList=[]
      this.form.business_license = ''
    },
    imgUpload(e) {
      this.uploadTips();
      let data = new FormData();
      data.append('file', e.file)
      let url = '/common/single';
      postData({ url, data }).then(res => {
        if (res.code == 200 && res.data.path_url) {
          // this.picList.push(res.data.path_url);
          // this.form.business_license =  this.picList;

          this.picList=res.data.path_url
          this.form.business_license= this.picList
          this.$success(res.data.msg)
        } else {
          this.$err(res.data.msg)
        }
      })
    },
    imgUpload1(e) {
      this.uploadTips();
      let data = new FormData();
      data.append('file', e.file)
      let url = '/common/single';
      postData({ url, data }).then(res => {
        // console.log('res ===', res)
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
        } else {
          this.$err(res.data.msg)
        }
      })
    },

    // 企业认证
    submit() {
      if (!this.form.company_name) {
        this.$err('请填写企业名称！')
        return
      }
      if (!this.form.id_number) {
        this.$err('请填写信用代码或注册号！')
        return
      }
      if (!this.form.business_license){
        this.$err('请上传营业执照附件！')
        return
      }
      if (!this.form.contact_name) {
        this.$err('请填写联系人！')
        return
      }
      if (!this.form.team_name) {
        this.$err('请填写团队名称！')
        return
      }
      if (!this.form.phone) {
        this.$err('请填写联系方式！')
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
      let url = this.isModify?'/user/team_certification/update':'/user/team_certification/store';
      postData({url,data:this.form}).then(res=>{
        // console.log('res === ',res)
        if(res.code == 200 && res.data.msg){
          this.$success(res.data.msg)
          this.picList = [];
          this.fileList = [];
          this.isModify = false;
          this.init()
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
.td_infor {
width: 100%;
.item-qymc{
  width: 27%;
}
.item-zch{
  width: 34%;
}
.item-tdmc{
  width: 34%;
}
}
.contact_fs{
  width: 100%;
  .item{
    width: 27%;
}
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
  .proveFail{
    font-size: 0.13rem;
    > :first-child{
      color: #ff980b;
      margin-right: 0.1rem;
    }
    > :last-child{
      color: #4078f9;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .proveWait {
    color: #1b4b84;
    font-size: 0.13rem;
  }
  .proveOk {
    color: #1b4b84;
    font-size: 0.13rem;
  }
}
.main {
  border-top: 0.01rem solid #ebebeb;
}
.tips {
  font-size: 0.14rem;
  height: 0.55rem;
  display: flex;
  align-items: center;
  background: #ecf5fe;
}
.prove {
  font-size: 0.15rem;
  margin-top: 0.15rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding-left: 0.33rem;
  .option {
    width: 100%;
    margin: 0.24rem 0;
    text-align: center;
  }
  .line {
    width:100%;
    height: 0;
    margin: 0.3rem 0;
    border: 0.01rem solid #ebebeb;
  }
}
.item {
  width: 100%;
  margin-top: 0.23rem;
  display: flex;
  align-items: center;
  .item_yyzz{
    height: 91%!important;
    span{
      height: auto!important;
    }
  }
  .item_title {
    height: 0.21rem;
    color: #666;
    font-size: 0.15rem;
    text-align: justify;
    text-align-last: justify;
    margin-right: 0.15rem;
    display: flex;
    .star {
      color: #fa0606!important;
      margin-right: 0.04rem;
    }
  }
  .upFileBtn {
    width: 1.08rem;
    height: 0.35rem;
    color: #333;
    text-align: center;
    line-height: 0.35rem;
    cursor: pointer;
    background: #eaeaea;
    border-radius: 0.08rem;
  }
  .ipt {
    height: 100%;
    width: 3.1rem;
    > input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      color: #333;
      padding: 0.07rem 0.2rem;
      border: 1px solid #409EFF;
      border-radius: 0.04rem;
      // background-color: transparent;
      // transition: all 0.3s ease;
    }
    > input:focus {
      outline: 0.01rem solid #53a4f0;
      border: 0;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }
  .text {
    padding: 0.07rem 0.2rem;
  }
}
.item_pic {
  width: 100%;
  margin-top: 0.3rem;
  display: flex;
  .item_title {
    height: 0.21rem;
    color: #666;
    text-align: justify;
    text-align-last: justify;
    margin-right: 0.15rem;
    display: flex;
    .star{
      color: red;
      margin-right: 0.04rem;
    }
  }
  .item_pic_box {
    width: 2.6rem;
    box-sizing: border-box;
    > div {
      width: 2.6rem;
      height: 1.6rem;
      position: relative;
      > img {
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
        transform: translate(-50%, -50%);
      }
    }
    > p {
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
.annex_box{
  display: flex;
  align-items: center;
  .annex{
    display: flex;
    .annex_div{
      width: 2.6rem;
      height: 1.6rem;
      object-fit: cover;
      margin-right: 0.15rem;
      position: relative;
      .annex_img {
        width: 100%;
        height: 100%;
      }
      .delAnnex{
        display: none;
        position: absolute;
        top: 0.02rem;
        right: 0.02rem;
        font-size: 0.12rem;
        cursor: pointer;
      }
    }
    .annex_div:hover .delAnnex{
      display: block;
    }
  }
}
/deep/ .el-button {
  width: 0.9rem;
}
</style>