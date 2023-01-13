<template>
  <div class="wrap">
 
    <div class="serch-input">
      <el-form :inline="true" :model="form" label-width="50px" class="head-form">
        <el-form-item>
          <!-- <el-col :span="800"> -->
          <el-input prefix-icon="el-icon-search" clearable v-model="form.content" placeholder="输入项目编号/项目名称/项目经理审批人"></el-input>
          <!-- </el-col> -->
        </el-form-item>
        <el-button type="primary" @click="adminWorkBenchProject">搜索</el-button>
        <el-dropdown class="release floatR" @command="chooseProject" v-if="role_id==1">
        <el-button type="primary">
          发布项目
        </el-button>
        <el-dropdown-menu slot="dropdown" class="release-type">
          <el-dropdown-item :command="1">私域</el-dropdown-item>
          <el-dropdown-item :command="2">公域</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </el-form>
    </div>

    <el-table :data="dataList" border style="width: 100%" v-loading="listLoading" element-loading-text="正在查询中...">
      <el-table-column prop="number" label="项目编号" min-width="150">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.number}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" min-width="180">
        <template slot-scope="scope">
          <div class="color_2141B4 com-line-1 cursor-poi" @click="checkDetail(scope.row)">
            {{scope.row.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目分类" v-if="role_id==1 || role_id==2">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.scope_type}}
          </div>
        </template>
        <template  #header>
            <el-dropdown trigger="hover" ref="eldrop" >
                <span class="el-dropdown-link" ref="ellink" >
                  项目分类
                  <i class="el-icon-caret-bottom"></i>
                </span>
              <el-dropdown-menu slot="dropdown" align="center"  class="drop-over" >
                <el-dropdown-item v-for="(val,index) in selectList.scope_type" @click.native="chooseScopeType(val)" :key="index"> 
                  {{ val }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
      </el-table-column>
      <el-table-column prop="background_status" label="项目状态" >
         <template  slot-scope="scope">
              <ul class="ul-common">
              <li v-if="scope.row.background_status == '已延期'" class="color_E30000">
                {{scope.row.background_status}}
              </li>
              <li v-else-if="scope.row.background_status == '已终止' || scope.row.background_status =='已完结'" class="color_999">
                {{scope.row.background_status}}
              </li>
              <li  v-else class="color_0EB200">
                {{scope.row.background_status }}
              </li>
            </ul>
          </template>
          <template  #header>
            <el-dropdown trigger="hover" ref="eldrop" >
                      <span class="el-dropdown-link" ref="ellink" >
                        项目状态
                        <i class="el-icon-caret-bottom"></i>
                      </span>
              <el-dropdown-menu slot="dropdown" align="center"    class="drop-over"  >
                <el-dropdown-item v-for="(val,index) in selectList.background_status" @click.native="chooseBackgroundStatus(val)" :key="index"> 
                  {{ val }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
      </el-table-column>
      <el-table-column prop="bidding_type" label="承接方"  v-if="role_id==1 || role_id==2">
        <template #header>
          <el-dropdown>
            <span class="el-dropdown-link">
              承接方
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown"   class="drop-over" >
              <el-dropdown-item v-for="(val,index) in  selectList.bidding_type" :key="index"  @click.native="chooseBiddingType(val)" >
                 {{ val }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.bidding_type}}
          </div>
        </template>

      </el-table-column>
      <el-table-column prop="manager_user" label="项目经理">
        <template slot-scope="scope">
          <div class="color_1B385C" v-if="scope.row.manager_user">
            {{scope.row.manager_user.stage_name!=null ? scope.row.manager_user.stage_name:'-'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="项目类型" > 
        <template #header>
          <el-dropdown >
            <span class="el-dropdown-link">
              项目类型
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown"   class="drop-over" >
              <el-dropdown-item v-for="(val,index) in  selectList.type" :key="index"  @click.native="chooseProjectType(val)">
                 {{ val }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.type || '/'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="platform" label="主控平台"  v-if="role_id==1 || role_id==2">
        <template #header>
          <el-dropdown>
            <span class="el-dropdown-link">
              主控平台
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown"   class="drop-over" >
              <el-dropdown-item v-for="(val,index) in  selectList.platform" :key="index" @click.native="choosePlatform(val)" >
                 {{ val }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.platform  || '/'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="system" label="应用系统"  v-if="role_id==1 || role_id==2">
        <template #header>
          <el-dropdown>
            <span class="el-dropdown-link">
              应用系统
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown"   class="drop-over" >
              <el-dropdown-item v-for="(val,index) in selectList.system" :key="index"  @click.native="chooseSystem(val)">
                 {{ val }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <div class="color_1B385C" >
            {{scope.row.system  || '/'}}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="recommend" label="重点推荐"   v-if="role_id==1">
        <template slot-scope="scope">
          <div>
            <el-switch
              v-model="scope.row.recommend " 
              active-value="是"
              inactive-value="否"
              active-color="#FF980B"
              @change="changeRecommendStatus(scope.row)"
              inactive-color="#E3E3E3">
            </el-switch>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column  label="项目进度" >
        <template slot-scope="scope">
          <div>
            <el-progress :percentage="Math.round(scope.row.project_tasks_progress)"></el-progress>
          </div>
        </template>
        
      </el-table-column>
      <el-table-column prop="period_type" label="项目周期" v-if="role_id==1 || role_id==2">
        <template #header>
          <el-dropdown>
            <span class="el-dropdown-link">
              项目周期
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown"   class="drop-over" >
              <el-dropdown-item v-for="(val,index) in  selectList.period_type" :key="index" @click.native="choosePeriod(val)">
                 {{ val }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.period}}  {{scope.row.period_type}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作"   min-width="100">
        <template slot-scope="scope">
        <el-button type="text" v-if="(role_id==1 )&&scope.row.background_status!='已完结'&& scope.row.background_status!='已终止'" @click="edit(scope.row)">编辑</el-button>
        <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
      </template>
      </el-table-column>
      
    </el-table>

    <div class="btm_box d-between">
      <!-- 分页 -->
      <div class="pagination_box">
        <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
           :page-size="form.pagesize" :page-sizes="[15,20,50,100]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>

</template>

<script>
import { postData, getData } from "@/api/user";
import store from '@/store'
export default {
  components: {
  },
  data() {
    return {
      listLoading:true,
      switchVal:true,
      
      total: 0,
      form: {
        content:'',//	否	string	搜索内容
        scope_type:'',
        background_status:'',//		否	string	项目状态
        bidding_type:'',//		否	string	承接方
        type:'',//		否	string	项目类型
        platform:'',//		否	string	主控平台
        system:'',//		否	string	应用系统
        period_type:'',//		否	string	项目周期
        pagesize:15,
        page: 1,
      },
      currentXmzt:'项目状态',
      currentCjf:'承接方',
      currentXmlx:'项目类型',
      currentZkpt:'主控平台',
      currentYyxt:'应用系统',
      currentXmzq:'项目周期',
      dataList: [],


      selectList:[],
      role_id:"",
      currentUrl:''


    }
  },
  created() {
    
    this.role_id=store.state.userInfo.role_id
    // console.log('role_id:1管理 2项目经理 3团队 4个人>>>>>', this.role_id);
    if( this.role_id==1) this.currentUrl='admin_workbench'
    else if(this.role_id==2)this.currentUrl='manager_workbench'
    else if(this.role_id==3) this.currentUrl='team_workbench'
    else if(this.role_id==4)this.currentUrl='user_workbench'
    else{
      this.$message({
        message:'非法进入',
        type:'warn'
      })
    }

    this.adminWorkBenchProject()
    this.projectGetSelect()

  },
  methods: {
    handleSizeChange(val){
        this.form.pagesize=val;
        this.adminWorkBenchProject()
      },
   
    // 设置重点推荐
    changeRecommendStatus(row){
      console.log(row);
      postData({
        url: "/workbech/"+this.currentUrl+"/project/set_recommend",
        data:{
          project_id:row.id,
          recommend:row.recommend
        }
      }).then((res) => {
        if (res.code==200) {
          this.$success(res.data.msg)
          this.adminWorkBenchProject()
         
        } else {
          
        }
      
      });

    },
    // 列表查询
    adminWorkBenchProject() {
      this.listLoading=true
      var data=this.form
      getData({
        url: "/workbech/"+this.currentUrl+"/project/index",
        data
      }).then((res) => {
        this.listLoading=false
        this.dataList = res.data.data
        this.total=res.data.total
      });

    },
        // 下拉框状态获取
    projectGetSelect() {
      getData({
        url: "/workbech/"+this.currentUrl+"/project/get_select",
      }).then((res) => {
        this.selectList=res.data
      });

    },
    edit(row){
      if(row.scope_type=='公域') {
      this.$router.push({
        path:'/public',
      query:{
        id:row.id
      }
      })
      }else if(row.scope_type=='私域'){
        this.$router.push({
        path:'/private',
        query:{
          id:row.id
        }
        })
      }
      
    },
    checkDetail(row){
      this.$router.push({
        path: "/workbench/projectDetail",
        query: {
          id:row.id,
        }
      })
      // this.$router.push("/projectDetail")
    },

   // 公私域
    chooseProject(i) {
      if (i == 1) {
        this.$router.push('/private')

      } else if (i == 2) {
        this.$router.push('/public')
      }
    },
    // 切换状态
    chooseScopeType(val){
      this.form.scope_type=val;
      this.adminWorkBenchProject()
    },
  //  项目状态
    chooseBackgroundStatus(val){
      this.form.background_status=val;
      this.adminWorkBenchProject()
    },
    // 承接方
    chooseBiddingType(val) {
      this.form.bidding_type=val;
      this.adminWorkBenchProject()
    },
    // 项目类型
    chooseProjectType(val) {
      this.form.type=val;
      this.adminWorkBenchProject()

    },
// 主控平台
choosePlatform(val) {
      this.form.platform=val;
      this.adminWorkBenchProject()

    },
    // 应用系统
    chooseSystem(val) {
      this.form.system=val;
      this.adminWorkBenchProject()

    },
    // 项目周期
    choosePeriod(val) {
      this.form.period_type=val;
      this.adminWorkBenchProject()

    },
    // 分页条数改变
    // handleSizeChange(val) {
    //   this.page_size = val;
    //   this.adminWorkBenchProject();
    // },
    handleCurrentChange(val) {
      this.form.page = val;
      this.adminWorkBenchProject();
    },

  }

}

</script>

<style lang="less" scoped>

.wrap {
  padding: 0.3rem;
  background: #fff;
  min-height: 82vh;
  .el-input {
    width: 350px;
  }
  .head-form{
    /deep/.el-form-item__content{
      line-height: 34px;
    }
   
    /deep/.el-input__inner,.el-button{
      height: 34px;
      line-height: 34px;

    }
    .el-button{
      padding: 0 20px ;
      line-height: 34px;
      height: 34px;
    }
  }

  .el-dropdown{
    .el-dropdown-link{
      color: #909399;
    }
  
  }


  .s-top {
    display: flex;
    justify-content: space-between;

    h2 {
      font-size: 0.2rem;
      font-weight: 600;
      color: #333;

      span {
        color: #3458DD;
      }
    }

    .release>.el-button--primary {
      width: 1.18rem;
      height: 0.42rem;
      background: #3458DD;
      border-radius: 0.04rem;
      padding: 0.08rem 0.14rem;
    }
  }

  .serch-input {
    /deep/.el-button--primary {
      background: #3458DD;

    }
  }
}
</style>