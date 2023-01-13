<template>
  <div class="wrap">
    <div class="content">
      <h3 class="mb3">公域</h3>
      <el-form v-if="!next" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm step-one" :inline="true" label-position="top">
        <el-form-item label="项目名称" prop="name" style="width:97%">
          <el-input v-model="ruleForm.name" placeholder="请输入 如：hi354695235DV硬件调查"  ref="name"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="type" class="input-ty">
          <el-select v-model="ruleForm.type" placeholder="请选择" clearable>
            <el-option v-for="(v,k) in type" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主控平台" prop="platform" class="input-ty">
          <el-select v-model="ruleForm.platform" placeholder="请选择" clearable>
            <el-option v-for="(v,k) in platform" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统应用" prop="system" class="input-ty">
          <el-select v-model="ruleForm.system" placeholder="请选择" clearable>
            <el-option v-for="(v,k) in system" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="项目负责人" prop="manager_user_id" class="input-ty">
          <el-select v-model="ruleForm.manager_user_id" placeholder="请选择" clearable>
            <el-option v-for="(v,k) in manager" :label="v.stage_name" :value="v.id" :key="k"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 传参manager_user_id 取值 manager_user  -->
        <el-form-item label="项目负责人" prop="manager_user_id" class="input-ty">
          <el-select v-model="ruleForm.manager_user_id" placeholder="请选择" clearable>
            <el-option v-for="(v,k) in manager" :label="v.stage_name" :value="v.id" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="price" class="input-ty">
          <div class="item-dw">
            <label for="">合同金额 <span>(单位：元)</span></label>
          </div>
          <el-input v-model="ruleForm.price" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customer_id" class="input-ty">
          <el-select v-model="ruleForm.customer_id" placeholder="请选择" clearable>
            <el-option v-for="(v) in customer" :label="v.name" :value="v.id" :key="v.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="项目预算" prop="price_budge" class="input-ty">
          <el-input v-model="ruleForm.price_budge" placeholder="请输入" clearable></el-input>元
        </el-form-item> -->
        <el-form-item label="项目周期" prop="period">
          <el-input v-model="ruleForm.period" placeholder="请输入" clearable class="input-ty input-xmzq">
          </el-input>
        </el-form-item>
        <el-form-item class="period_type v_0" label="单位" prop="period_type" style="margin-left: -10px;">
          <el-select v-model="ruleForm.period_type" placeholder="请选择" class="dw" clearable>
            <el-option v-for="(v,k) in period_type" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>       
        <el-form-item label="可见等级" prop="request_level" class="input-ty">
          <el-input v-model="ruleForm.request_level" placeholder="请输入内容" clearable>
            <template slot="append">以上</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="margin" class="input-ty">
          <div class="item-dw">
            <label for="">缴纳保证金 <span>(单位：元)</span></label>
          </div>
          <el-input v-model="ruleForm.margin" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="需求描述" prop="desc" class="desc">
          <!-- <mavon-editor :subfield="false" v-model="ruleForm.desc" placeholder="请说明项目" class="markdown" /> -->
          <mavon-editor ref="md" v-model="markdowntext"   placeholder="请说明项目" class="markdown" @imgAdd="imgAdd" @change="mdchange"/>
        </el-form-item>
        <el-form-item class="upload-file">
          <el-upload class="upload-demo" drag action="" :show-file-list="false" :http-request="imgUpload" :file-list="file">
            <span>
              <div class="el-upload__text">
                <i class="el-icon-upload"></i><em>拖拽</em>/或<em>点击</em><span>上传您的需求补充文件或图片，附件总数5个，总大小不超过50M</span></div>
            </span>
          </el-upload>
          <el-table v-if="ruleForm.attachments && ruleForm.attachments.length != 0" :data="ruleForm.attachments" border style="width: 100%">
            <el-table-column prop="document_name" label="文件名称" min-width="200">
              <template slot-scope="scope">
                <div class="color_1B385C com-line-1">
                  {{ scope.row.document_name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="size" label="文件大小" min-width="100">
              <template slot-scope="scope">
                <div class="color_1B385C">
                  {{ scope.row.size }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="文件状态" min-width="100">
              <template slot-scope="scope">
                <div class="color_2DA80F">
                  {{ scope.row.state }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="deleteim(scope.$index)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="cancel" round>取消</el-button>
          <el-button @click="nextForm('ruleForm')" type="primary" round>下一步</el-button>
        </el-form-item>
      </el-form>
      <!---->
      <el-form  v-if="next"  :model="ruleForm" :rules="rules2" ref="ruleForm" class="demo-ruleForm step-two" label-position="top" :inline="true">
        <el-form-item label="报名截止" prop="bidding_end_time" class="input-ty">
          <el-date-picker v-model="ruleForm.bidding_end_time" type="date" placeholder="请选择截止时间" :picker-options="pickerOptionsStart" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <h3 class="tdjj">团队竞价</h3>
        <el-form-item label="竞价区间" prop="team_bidding" >
          <span class="iconfont icon-icon-qian" style="position: absolute; left: 0.1rem; z-index: 10;font-size:0.14rem;"></span>
          <el-input v-model="ruleForm.team_bidding.price_low" placeholder="0.00" prefix-icon="el-icon-searc" class="input-ty input-section"></el-input>
          <span class="line"> — </span>
          <span class="iconfont icon-icon-qian" style="position: absolute; left: 2.44rem; z-index: 10;font-size:0.14rem;"></span>
          <el-input v-model="ruleForm.team_bidding.price_high" placeholder="0.00" prefix-icon="el-icon-searc" class="input-ty input-section"></el-input>
        </el-form-item>
        <el-form-item label="等级要求" prop="team_bidding" class="input-ty">
          <el-input v-model="ruleForm.team_bidding.request_level" placeholder="请输入" class="input-ty input-section"></el-input>
        </el-form-item>
        <el-form-item label="技能要求" prop="team_bidding" class="input-ty skill-item" >
          <el-select v-if="disable" v-model="ruleForm.team_bidding.request_skill" placeholder="请选择技能要求，最多5个" clearable multiple :multiple-limit="5">
            <el-option v-for="(v,k) in skill" :label="v" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <h3 class="zmrole">招募角色（个人竞价）</h3>
        <div class="role" v-for="(v,k) in ruleForm.user_bidding" :key="k">
          <div class="role-item">
            <el-tag v-once type="info" plain class="role_item">角色{{k+1}}</el-tag>
            <el-button icon="el-icon-delete" type="text" class="delete-role" @click="deleteRole(k)">删除</el-button>
          </div>
          <div class="flex-box team_role">
          <el-form-item label="岗位" prop="user_bidding" class="input-ty">
            <el-select v-model="v.role" placeholder="请选择" clearable>
              <el-option v-for="(v,k,i) in role" :label="v" :value="v" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="竞价区间" prop="user_bidding" >
            <span class="iconfont icon-icon-qian" style="position: absolute; left: 0.1rem; z-index: 10;font-size:0.14rem;"></span>

            <el-input v-model="v.price_low" placeholder="0.00" prefix-icon="el-icon-searc" class="input-ty input-jjqj"></el-input>
            <span class="line"> — </span>
            <span class="iconfont icon-icon-qian" style="position: absolute; left: 1.6rem; z-index: 10;font-size:0.14rem;"></span>

            <el-input v-model="v.price_high" placeholder="0.00" prefix-icon="el-icon-searc" class="input-ty input-jjqj"></el-input>
          </el-form-item>
          <el-form-item label="等级要求" prop="user_bidding.request_level" class="input-ty">
            <el-input v-model="v.request_level" placeholder="请输入" clearable class="input-ty input-section"></el-input>
          </el-form-item>
        </div>
          <el-form-item label="技能要求" prop="user_bidding.request_skill" class="input-ty skill-input">
            <el-select v-model="v.request_skill" placeholder="请选择" clearable multiple  :multiple-limit="maxMultiple">
              <el-option v-for="(v,k) in skill" :label="v" :value="v" :key="k"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="addRold">
          <el-button @click="addRole"> <i class="iconfont  icon-gzt-xza"></i>添加角色</el-button>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="cancel" round>取消</el-button>
          <el-button @click="submitForm('ruleForm')"  :loading="listLoading"  :disabled="listLoading" type="primary" round>发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import { getData, postData } from '../../api/user';
import '../../assets/icons/iconfont.css';
import TurndownService from 'turndown'
export default {
  name: 'public',
  data() {
    var checkPeriod_type = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择周期单位'));
      }
      callback();
    };
    return {
      listLoading:false,
      markdowntext:"",
      next: false,
      disable: false,
      maxMultiple:5,
      formdata:{},
      ruleForm: {
        name: '', // 项目名称
        type: '', // 项目类型
        platform: '', // 主控平台
        system: '', // 系统应用
        priority_level: '', // 优先级别
        manager_user_id: '', // 项目负责人
        price: '', // 合同金额
        period: '', // 项目周期
        period_type: '', // 项目周期
        customer_id: '', // 客户id
        request_level: '', // 可见等级
        margin: '', // 保证金
        desc: '', // 项目需求
       
        price_budge:"",
        //附件文档arr
        attachments:[ 
            // {
            //   document:'',//上传文档url
            //   document_name:'',//文件名称
            //   size:'',//文件大小
            //   state:'',//图片上传状态
            // }
        ],

        bidding_end_time: '', // 报名截止时间
        team_bidding: {
          price_low: '', // 团队竞价
          price_high: '', // 团队竞价
          request_level: '', // 等级要求
          request_skill: [] // 技能要求
        },
        user_bidding: [
          {
            role: '', // 角色
            price_low: '', // 个人竞价
            price_high: '', // 个人竞价
            request_level: '', // 等级要求
            request_skill: [] // 技能要求
          }
        ]
        
      },
      // ruleForm: {
      //   bidding_end_time: '', // 报名截止时间
      //   team_bidding: {
      //     price_low: '', // 团队竞价
      //     price_high: '', // 团队竞价
      //     request_level: '', // 等级要求
      //     request_skill: [] // 技能要求
      //   },
      //   user_bidding: [
      //     {
      //       role: '', // 角色
      //       price_low: '', // 个人竞价
      //       price_high: '', // 个人竞价
      //       request_level: '', // 等级要求
      //       request_skill: [] // 技能要求
      //     }
      //   ]
      // },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: ['blur', 'change'] },
          { min: 5, max: 50, message: '长度在5~50个字符以内', trigger: 'blur' }
        ],
        customer_id: [
          { required: true, message: '请选择一个客户', trigger: 'change' },
        ],
        
        manager_user_id: [
          { required: true, message: '请选择项目负责人', trigger: 'change' },
        ],
        period: [
          { required: true, message: '请填写项目周期及周期单位', trigger: ['blur', 'change'] }
        ],
        period_type: [
          { validator: checkPeriod_type, trigger: 'change' }
        ],
        price_budge:[
          { required: true, message: '请填写项目预算金额', trigger: ['blur', 'change'] }
        ],
      },
      rules2: {},
      roleData: {},
      type: '',  // 项目类型
      platform: '', // 主控平台
      system: '',  // 应用系统
      priority_level: '', // 优先级别列表
      manager:[],
      period_type: '',  // 项目周期
      customer: '', // 客户名称
      role: '', // 岗位
      skill: '', // 技能
      query_id:'',
      detailData:[],
     
      file:[],
      fileName:"",
      pickerOptionsStart: {
        disabledDate: time => {
          return (
          time.getTime() < Date.now() - 8.64e7   
          );
        }
      },
      img_file: {} //markdown img
    }
  },
  created() {
    this.query_id = this.$route.query.id
    this.init();
    if ( this.query_id  &&   this.query_id!=undefined) {
      this.projectDetail()
    }
  },
  mounted(){
    this.$refs.name.focus()
  },
  methods: {
    deleteim(i) {
      this.ruleForm.attachments.splice(i, 1);
    },
    mdchange(a,b){
      this.ruleForm.desc = b
    },
    // 项目负责人的数据处理
    // changeManage(val){
    //   this.ruleForm.manager_user = val.stage_name
    //   this.ruleForm.manager_user_id = val.id
    // },
 
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
          console.log(img);
          img.state = '上传成功'
          this.ruleForm.attachments.push(img)

      
        }
      }).catch(err=>{
            
          })
    },
    // 详情
    projectDetail() {
      getData({
        url: "/workbech/admin_workbench/project/detail/" + this.query_id,
      }).then((res) => {
        this.ruleForm = res.data.info
        var turndownService = new TurndownService();
        // 这里的this.form.content为数据库保存的html格式，转换成了markdown格式
        var markdown = turndownService.turndown( this.ruleForm.desc);
        this.markdowntext = markdown;

        if (this.ruleForm?.team_bidding=='[]'|| this.ruleForm?.team_bidding==null) {
            this.ruleForm.team_bidding=   {
            price_low: '', // 团队竞价
            price_high: '', // 团队竞价
            request_level: '', // 等级要求
            request_skill: '', // 技能要求
          }
        } 
        if (this.ruleForm?.user_bidding=='[]'|| this.ruleForm?.user_bidding.length==0) {
          this.ruleForm.user_bidding=[]
        var currentUser=    {
            role: '', // 角色
            price_low: '', // 个人竞价
            price_high: '', // 个人竞价
            request_level: '', // 等级要求
            request_skill: [] // 技能要求
          }
            this.ruleForm.user_bidding.push(currentUser)
           
        }
      }).catch(err=>{
            
          })
 
    },
    init() {
      let url = '/workbech/admin_workbench/project/get_add_select';
      getData({ url }).then(res => {
        this.type = res.data.type;
        this.platform = res.data.platform;
        this.system = res.data.system;
        this.priority_level = res.data.priority_level;
        this.manager=res.data.manager;
        this.period_type = res.data.period_type;
        this.ruleForm.period_type = this.period_type.DAY

        this.customer = res.data.customer;
        this.role = res.data.role;
        // console.log(res.data.skill,'技能');
        this.skill = res.data.skill;
      }).catch(err=>{
            
          })
    },
    // 添加角色
    addRole() {
      this.ruleForm.user_bidding.push({
        role: '', // 角色
        price_low: '', // 个人竞价
        price_high: '', // 个人竞价
        request_level: '', // 等级要求
        request_skill: [] // 技能要求
      })
    },
    // 删除角色
    deleteRole(i) {
      this.$confirm("确定删除该角色吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.ruleForm.user_bidding.splice(i, 1);
        this.$success('删除成功！')
      }).catch(err=>{
            
          })
    },
    nextForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.next = true;
              setTimeout(()=>{
                this.disable = true;
              },0)
          // if( this.query_id  &&  this.query_id!=undefined){
          //   var url = '/workbech/admin_workbench/project/project_public_update_first_step';
          // }else{
          //   var url = '/workbech/admin_workbench/project/project_public_add_first_step';
          // }
          // let data = this.ruleForm;
          // postData({ url, data }).then(res => {
          //   if (res.code == 200) {
          //     // this.$success(res.data.msg);
          //     this.next = true;
          //     setTimeout(()=>{
          //       this.disable = true;
          //     },0)
          //   }
          // })
        } else {
          this.$err('请填写完整！')
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    cancel(){
      this.$router.push('/workbench/project')
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading=true
          if( this.query_id  &&   this.query_id!=undefined){
            this.ruleForm.project_id = this.query_id
            var url = '/workbech/admin_workbench/project/project_public_update';
          }else{
            var url = '/workbech/admin_workbench/project/project_public_add';
          }
          let data = this.ruleForm;
          postData({ url, data }).then(res => { 
            this.listLoading=false
            if(res.code == 200){
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000);
            }
          }).catch(err=>{

          })
        } else {
          this.$err('请填写完整！')
          return false;
        }
      });
    },
    // unload markdown img
    imgAdd(a, b){
      let data = new FormData();
      data.append('file', b);
      let url = '/common/single_file';
      postData({ url, data }).then(res => {
        this.$refs.md.$img2Url(a, res.data.path_url);
      }).catch(err=>{
            
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
  // .document-name{
  //   margin-top: 0.5rem;
  //   width: 4rem;
  //   height:0.5rem;
  //   border: 1px dotted #ccc ;
  // }
  .v_0{
  /deep/.el-form-item__label{
    visibility: hidden;
  }
}
  .icon-sc{
   float: right;

  }

  .markdown{
    width: 9rem;
  }
  .input-ty {

    .el-input,
    .el-select {
     width: 2.9rem;
    }
  }
  .skill-item,.skill-input{
    width: 98%;
    .el-select {
      width: 100%;
    }

  }

  .input-xmzq {
    width: 2.06rem;
    margin-right: 0.09rem;
  }
  
  .input-section {
    width: 2rem;
    margin-right: 0.05rem;
  }
  .input-jjqj{
    width: 1.2rem;
    // margin-right: 0.05rem;
  }
  
  .line{
    margin-right: 0.05rem;
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
        margin-bottom: 0.1rem;
border-radius: 0.1rem;
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

    }
  }
}
</style>