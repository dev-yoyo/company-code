<template>
  <div class="wrap">
    <div class="content">
      <h3 class="mb3">私域</h3>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm step-one" :inline="true"
        label-position="top">
        <el-form-item label="项目名称" prop="name" style="width:98%">
          <el-input v-model="ruleForm.name" placeholder="请输入 如：hi354695235DV硬件调查" clearable ref="name"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="type" class="input-ty">
          <el-select v-model="ruleForm.type" placeholder="请选择">
            <el-option v-for="(v, k) in type" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主控平台" prop="platform" class="input-ty">
          <el-select v-model="ruleForm.platform" placeholder="请选择">
            <el-option v-for="(v, k) in platform" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统应用" prop="system" class="input-ty">
          <el-select v-model="ruleForm.system" placeholder="请选择">
            <el-option v-for="(v, k) in system" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目负责人" prop="manager_user_id" class="input-ty">
          <el-select v-model="ruleForm.manager_user_id" placeholder="请选择" clearable>
            <el-option v-for="(v, k) in manager" :label="v.stage_name" :value="v.id" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="price" class="input-ty">
          <div class="item-dw">
            <label for="">合同金额<span>(单位：元)</span></label>
          </div>
          <el-input v-model="ruleForm.price" placeholder="请输入" clearable ></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customer_id" class="input-ty">
          <el-select v-model="ruleForm.customer_id" placeholder="请选择">
            <el-option v-for="(v) in customer" :label="v.name" :value="v.id" :key="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目周期" prop="period">
          <el-input v-model="ruleForm.period" placeholder="请输入" class="input-ty input-xmzq"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="period_type" style="margin-left: -10px;" class="v_0">
          <el-select v-model="ruleForm.period_type" placeholder="请选择" class="dw">
            <el-option v-for="(v, k) in period_type" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
    
        <el-form-item prop="margin" class="input-ty">
          <div class="item-dw">
            <label for="">缴纳保证金<span>(单位：元)</span></label>
          </div>
          
          <el-input v-model="ruleForm.margin" placeholder="请输入" clearable></el-input>
        </el-form-item>




        <el-form-item label="指派承接方" prop="bidding_type" class="input-ty cjf" style="width:100%">
          <el-radio-group v-model="ruleForm.bidding_type">
            <el-radio v-for="(v, k) in bidding_typeList" :label="v" :key="k">{{ v }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="ruleForm.user_bidding_join && ruleForm.bidding_type == '个人'">
          <div class="role" v-for="(item, index) in ruleForm.user_bidding_join" :key="index">
            <div class="role-item">
              <el-tag v-once type="info" plain class="role_item">角色{{ index+ 1}}</el-tag>
              <el-button icon="el-icon-delete" type="text" class="delete-role" @click="deleteRole(index)">删除</el-button>
            </div>
            <el-form-item label="岗位" prop="user_bidding_join" class="input-ty" v-if="ruleForm.bidding_type == '个人'">
              <span>
                <el-select v-model="item.role" placeholder="请选择">
                  <el-option v-for="(v, k) in role" :label="v" :value="v" :key="k"></el-option>
                </el-select>
              </span>
            </el-form-item>

            <el-form-item label="工程师" prop="user_bidding_join" class="input-ty" v-if="ruleForm.bidding_type == '个人'">
              <span>
                <el-select v-model="item.user_id" placeholder="请选择">
                  <el-option v-for="v in user" :label="v.stage_name" :value="v.id" :key="v.id"></el-option>
                </el-select>
              </span>
            </el-form-item>

            <el-form-item label="费用" prop="user_bidding_join" class="input-ty" v-if="ruleForm.bidding_type == '个人'">
              <span>
                <el-input v-model="item.price" placeholder="请输入"></el-input>
              </span>
            </el-form-item>

          </div>
        </div>


        <el-form-item label="团队" prop="team_bidding_join" class="input-ty" v-if="ruleForm.bidding_type == '团队'">
          <el-select v-model="ruleForm.team_bidding_join.team_id" placeholder="请选择">
            <el-option v-for="v in team" :label="v.team_name" :value="v.id" :key="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用" prop="team_bidding_join" class="input-ty" v-if="ruleForm.bidding_type == '团队'">
          <el-input v-model="ruleForm.team_bidding_join.price" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item class="addRold" v-if="ruleForm.bidding_type == '个人'">
          <el-button @click="addRole"> <i class="iconfont  icon-gzt-xza"></i>添加角色</el-button>
        </el-form-item>
        <el-form-item label="需求描述" prop="desc">
          <mavon-editor ref="md" v-model="markdowntext" placeholder="请说明项目" class="markdown" @imgAdd="imgAdd"
            @change="mdchange" />
        </el-form-item>
        <el-form-item class="upload-file">
          <el-upload class="upload-demo" drag multiple action="" :show-file-list="false" :http-request="imgUpload">
            <span>
              <div class="el-upload__text">
                <i class="el-icon-upload"></i><em>拖拽</em>/或<em>点击</em><span>上传您的需求补充文件或图片，附件总数5个，总大小不超过50M</span></div>
            </span>
          </el-upload>
          <el-table v-if="ruleForm.attachments && ruleForm.attachments.length != 0" :data="ruleForm.attachments" border style="width: 100%">
            <el-table-column prop="document_name" label="文件名称" width="180">
              <template slot-scope="scope">
                <div class="color_1B385C">
                  {{ scope.row.document_name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="size" label="文件大小" width="180">
              <template slot-scope="scope">
                <div class="color_1B385C">
                  {{ scope.row.size }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="文件状态">
              <template slot-scope="scope">
                <div class="color_2DA80F">
                  {{ scope.row.state }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="deleteim(scope.$index)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item class="btns">
          <el-button @click="$router.push('/workbench/project')" round>取消</el-button>
          <el-button @click="submitForm('ruleForm')" :loading="listLoading" :disabled="listLoading" type="primary"
            round>发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import { getData, postData } from '../../api/user';
import TurndownService from 'turndown'
export default {
  name: 'private',
  data() {
    var checkPeriod_type = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择周期单位'));
      }
      callback();
    };
    return {
      listLoading: false,
      userId: '',
      fileName: '',
      ruleForm: {
        project_id: '',
        name: '', // 项目名称最长40字符
        type: '', // 项目类型
        platform: '', // 主控平台
        system: '',  // 应用系统
        // priority_level: '', // 优先级别 
        period: '', // 项目周期
        manager_user_id: '', // 项目负责人
        manager_user: '', // 项目负责人
        period_type: '',  // 项目周期
        customer_id: '', // 客户名称
        bidding_type: '个人', // 承接方
        desc: '', // 描述
        margin:'',//保证金
        price:'',//合同费用
        attachments:[ 
            // {
            //   document:'',//上传文档url
            //   document_name:'',//文件名称
            //   size:'',//文件大小
            //   state:'',//图片上传状态
            // }
        ],
        user_bidding_join: [
          {
            id: '',
            role: '', // 岗位
            user_id: '', // 工程师
            price: '' // 费用
          }
        ],
        team_bidding_join: {
          id: '',
          team_id: '', // 团队
          price: '' // 费用
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: ['change'] },
          { min: 5, max: 50, message: '长度在5~50个字符以内', trigger: 'change' }
        ],
        customer_id: [
          { required: true, message: '请选择一个客户', trigger: 'change' },
        ],
        bidding_type: [
          { required: true, message: '请选择个人或团队', trigger: 'change' }
        ],
        period: [
          { required: true, message: '请填写项目周期', trigger: ['blur', 'change'] }
        ],
        period_type: [
          { validator: checkPeriod_type, trigger: 'change' }
        ],
        manager_user_id: [
          { required: true, message: '请选择项目负责人', trigger: 'change' },
        ],

      },
      type: '',  // 项目类型
      platform: '', // 主控平台
      system: '',  // 应用系统
      // priority_level: '', // 优先级别列表
      period_type: '',  // 项目周期
      customer: '', // 客户名称
      manager: '',//项目负责人
      user: '', // 岗位
      role: '', // 角色
      team: '', // 团队
      bidding_typeList: ["个人", "团队"], // 承接方
      query_id: '',
      markdowntext: '',
    }
  },
  created() {
    // var MardownIt = require("markdown-it")
    // var md = new MardownIt()
    // var result = md.render(xxx.content)
    this.init();
    this.query_id = this.$route.query.id
    if (this.query_id && this.query_id != undefined) {
      this.projectDetail()
    }
  },
  mounted() {
    this.$refs.name.focus()
  },
  methods: {
    deleteim(i) {
      this.ruleForm.attachments.splice(i, 1);
    },
    mdchange(a, b) {
      this.ruleForm.desc = b
    },

    // 添加角色
    addRole() {
      this.ruleForm.user_bidding_join.push({
        id: '',
        role: '', // 岗位
        user_id: '', // 工程师
        price: '' // 费用
      })
    },
    // 删除角色
    deleteRole(i) {
      this.$confirm("确定删除该角色吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.ruleForm.user_bidding_join.splice(i, 1);
        this.$success('删除成功！')
      })
    },
    // 上传文件
    imgUpload(e) {
      if(this.ruleForm.attachments.length>=5){
        this.$message.error('附件总数最多5个！');
        return false
      }
      let img = {}
      let data = new FormData();
      data.append('file', e.file)
      let url = '/common/single_file';
      img.size = Math.ceil(e.file.size / 1024) + 'kb'
      img.state = '上传中'
      postData({ url, data }).then(res => {
        if (res.code == 200 && res.data.path_url) {
          img.document = res.data.path_url
          img.document_name = res.data.filename
          img.state = '上传成功'
          this.ruleForm.attachments.push(img)
        }
      })
    },
    // 详情
    projectDetail() {
      getData({
        url: "/workbech/admin_workbench/project/detail/" + this.query_id,
      }).then((res) => {
        // this.ruleForm = res.data.info
        // 单个赋值 防止提交接口参数过多
        this.ruleForm.project_id = res.data.info.id
        this.ruleForm.name = res.data.info.name
        this.ruleForm.type = res.data.info.type
        this.ruleForm.platform = res.data.info.platform
        this.ruleForm.system = res.data.info.system
        // this.ruleForm.priority_level = res.data.info.priority_level
        this.ruleForm.period = res.data.info.period
        this.ruleForm.manager_user_id = res.data.info.manager_user_id
        this.ruleForm.manager_user = res.data.info.manager_user.stage_name
        this.ruleForm.period_type = res.data.info.period_type
        this.ruleForm.customer_id = res.data.info.customer_id
        this.ruleForm.bidding_type = res.data.info.bidding_type
        this.ruleForm.desc = res.data.info.desc
        this.ruleForm.user_bidding_join = res.data.info.user_bidding_join
        this.ruleForm.attachments = res.data.info.attachments
        this.ruleForm.price = res.data.info.price
        this.ruleForm.margin = res.data.info.margin

        // 处理团队的数据结构 因为提交时为对象 返回值为数组 导致数据绑定失败
        this.ruleForm.team_bidding_join.id = res.data.info?.team_bidding_join[0]?.id
        this.ruleForm.team_bidding_join.team_id = res.data.info?.team_bidding_join[0]?.team_id
        this.ruleForm.team_bidding_join.price = res.data.info?.team_bidding_join[0]?.price
        var turndownService = new TurndownService();
        // 这里的this.form.content为数据库保存的html格式，转换成了markdown格式
        var markdown = turndownService.turndown(this.ruleForm.desc);
        this.markdowntext = markdown;

        // if (this.ruleForm.user_bidding_join.length!=0) {s
        //   // this.ruleForm.user_bidding_join[0].id =res.data.info.user_bidding_join[0].id
        // } else{
        //   this.ruleForm.user_bidding_join[0].id =''
        // }
        // if (this.ruleForm.team_bidding_join.length!=0) {
        //   // this.ruleForm.team_bidding_join.id =res.data.info.team_bidding_join[0].id
        // } else{
        //   this.ruleForm.team_bidding_join.id =''
        // }

      });

    },
    init() {
      let url = '/workbech/admin_workbench/project/get_add_select';
      getData({ url }).then(res => {
        // console.log('select data === ',res)
        this.type = res.data.type;
        this.platform = res.data.platform;
        this.system = res.data.system;
        // this.priority_level = res.data.priority_level;
        this.period_type = res.data.period_type;
        this.ruleForm.period_type = this.period_type.DAY
        this.customer = res.data.customer;
        this.manager = res.data.manager
        this.user = res.data.user;
        this.role = res.data.role;
        this.team = res.data.team;
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true
          if (this.ruleForm.bidding_type == '个人') {
            delete this.ruleForm.team_bidding_join;
          } else {
            delete this.ruleForm.user_bidding_join;
          }
          if (this.query_id && this.query_id != undefined) {
            var url = '/workbech/admin_workbench/project/project_private_update';
          } else {
            var url = '/workbech/admin_workbench/project/project_private_add';
          }
          let data = this.ruleForm;
          postData({ url, data }).then(res => {
            this.listLoading = false
            if (res.code == 200) {
              // this.$success(res.data.msg)
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000);
            }
          })
        } else {
          this.$err('请将表单填写完整！')
          return false;
        }
      });
    },
    // unload markdown img
    imgAdd(a, b) {
      let data = new FormData();
      data.append('file', b);
      let url = '/common/single_file';
      postData({ url, data }).then(res => {
        this.$refs.md.$img2Url(a, res.data.path_url);
      })
    }
  }
}
</script>
  
<style lang="less" scoped>
.wrap {
  width: 19.2rem;
  overflow-x: hidden;
  .mb3{
    margin-bottom: 0.3rem;
  }
  .role_item{
    border: none;
    font-size: 0.13rem!important;
    color: #1B385C!important;
    padding: 0.02rem 0.1rem!important;
    display: inline-block!important;
    font-weight: 500!important;
    background: transparent!important;
  }
  .cjf.el-form-item{
    margin-bottom: 0.2rem!important;
    
  }
  .item-dw{
color: #606266;
  span{
    font-size: 0.12rem;
  color: #999999;
  }
}
  .el-form-item{
    margin-bottom: 0.3rem!important;
      /deep/.el-form-item__label{
          line-height: 30px;
        }
    }
.v_0{
  /deep/.el-form-item__label{
    visibility: hidden;
  }
}
  .addRold {
    width: 100%;
    text-align: center;

    border-radius: 0.04rem;

    .el-button {
      width: 2.15rem;
      height: 0.32rem;
      padding: 0;
      font-size: 0.13rem;
      color: #1B385C;
      background: #F0F4F8;
      margin: 0 auto 0;

      .icon-gzt-xza {
        font-size: 0.1rem;
        margin-right: 0.08rem;
      }

    }

  }

  .role {
    border-radius: 0.1rem;
    padding: 0.1rem;
    margin-bottom: 0.1rem;

    .el-input,
    .el-select {
      width: 2.9rem !important;
    }

    .role-item {
      display: flex;
      height: 0.4rem;
      justify-content: space-between;
      align-items: center;

      .el-tag {
        background: #fff;
        // width: 0.51rem;
        font-size: 0.13rem;
        color: #1B385C;
        border-radius: 0.06rem;
        padding: 0.02rem 0.1rem;
      }

      .delete-role {
        display: none;
      }

    }
  }

  .role:hover {
    background: #F0F4F8;
    .role_item{
      background: #fff!important;
    }

    .delete-role {
      display: block;
    }
  }

  .input-ty {

    .el-input,
    .el-select {
      width: 2.94rem;
    }
  }

  .input-xmzq {
    width: 2.06rem;
    margin-right: 0.1rem !important;
  }

  .dw {
    width: 0.78rem !important;
  }

  .content {
    width: 9.8rem;
    margin: 0.5rem auto;
    padding: 0.3rem;
    background: #fff;
    box-shadow: 0rem 0rem 0.08rem 0.01rem #ccc;

    .el-form {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .upload-file {
        i{
          font-size: 0.2rem;

        }
        /deep/.el-upload-dragger {
          width: 9.1rem;
          position: relative;
          background: #F8F8F8;
          height: 0.8rem;
    line-height: 0.8rem;
          padding: 0;
          color: #333333;
        }
        /deep/.el-icon-upload{
          margin: 0;
          line-height: 0;
        }
      }

      .btns {
        margin: 0 auto;

        .el-button--primary {
          background: #0064F9;
        }

      }

      .tjrole {
        width: 100%;
        text-align: center;

        border-radius: 0.04rem;

        .el-button {
          width: 2.15rem;
          height: 0.32rem;
          padding: 0;
          font-size: 0.13rem;
          color: #1B385C;
          background: #F0F4F8;
          margin: 0 auto 0.56rem;

          .icon-gzt-xza {
            font-size: 0.1rem;
            margin-right: 0.08rem;
          }

        }

      }

      .tdjj {
        width: 100%;
        margin: 0.39rem auto 0.3rem;
      }

      .zmrole {
        width: 100%;
        margin-bottom: 0.09rem;

      }

      .role {

        padding: 0.1rem;
        margin-bottom: 0.3rem;

        .role-item {
          display: flex;
          height: 0.4rem;
          justify-content: space-between;
          align-items: center;

          .el-tag {
            background: #fff;
            // width: 0.51rem;
            font-size: 0.13rem;
            color: #1B385C;
            border-radius: 0.06rem;
            padding: 0.02rem 0.1rem;
          }

          .delete-role {
            display: none;
          }

        }
      }

      .role:hover {
        background: #F0F4F8;

        .delete-role {
          display: block;
        }
      }

    }
  }
}
</style>