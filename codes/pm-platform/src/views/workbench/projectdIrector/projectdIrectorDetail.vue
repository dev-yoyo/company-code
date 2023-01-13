<template>
  <div class="wrap"  v-loading="listLoading">
    <div class="user-infor flex-box">
      <p>姓名：<span>{{userInfor.name}}</span></p>
      <p>花名：<span>{{userInfor.stage_name}}</span></p>
      <p>手机号：<span>{{userInfor.phone}}</span></p>
      <p>管理项目：<span v-if="dataList.data">{{dataList.data.length}}</span></p>
    </div>
    <div class="conte">
      <div class="s-top">
        <h2>项目概况</h2>
      </div>
      <el-table :data="dataList.data" stripe border style="width: 100%"   element-loading-text="正在查询中...">
        <el-table-column prop="name" label="项目名称">
          <template slot-scope="scope">
            <div class="color_2141B4">
              {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="background_status" label="状态">
          <template #header>
          <el-dropdown trigger="hover" ref="eldrop">
                    <span class="el-dropdown-link" ref="ellink" >
                      状态<i class="el-icon-arrow-down el-icon--right" />
                    </span>
            <el-dropdown-menu >
              <el-dropdown-item v-for="(val, index) in selectList.background_status" @click.native="ChooseBackgroundStatus(val)" :key="index"> 
                {{ val }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </template>
          <template slot-scope="scope">
            <ul class="ul-common">
              <li v-if="scope.row.background_status == '已延期'" class="color_E30000">
                {{scope.row.background_status}}
              </li>
              <li v-else-if="scope.row.background_status == '已终止' || scope.row.background_status =='已完结'" class="color_999">
                {{scope.row.background_status}}
              </li>
              <li  v-else class="color_0EB200">
                {{scope.row.background_status}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column  label="项目周期">
          <template slot-scope="scope">
            <div class="color_1B385C">
              {{scope.row.period}} {{scope.row.period_type}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="发布时间">
          <template slot-scope="scope">
            <div class="color_1B385C">
              {{scope.row.created_at}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="btm_box d-between">
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
import {  getData } from "@/api/user";
export default {
  name: "projectdIrector",
  data() {
    return {
      dataList: [],
      detaii_id:'',
      listLoading:true,
      total:0,
      userInfor:[],
      selectList:[],
      form:{
        pagesize:15,
        page:1,
        background_status:''
      }
    }
  },
  created(){
    this.detaii_id= this.$route.query.id;
    console.log( this.detaii_id)
    this.managerDetail();
    this.projectGetSelect()
  },
  methods: {
    // 状态切换
    ChooseBackgroundStatus(val){
      this.form.background_status=val
      this.managerDetail();
    },

    // 查询
    managerDetail() {
      this.listLoading=true
      var data= this.form
      getData({
        url: "/workbech/admin_workbench/manager/detail/"+this.detaii_id,
        data
      }).then((res) => {
        this.listLoading=false
        this.dataList = res.data.project_list
        this.userInfor=res.data.user_info
        this.total=res.data.project_list.total
      });
    },
            // 下拉框状态获取
    projectGetSelect() {
      getData({
        url: "/workbech/admin_workbench/project/get_select",
      }).then((res) => {
        this.selectList=res.data
      });

    },
    checkDetail(row){
      this.$router.push({
        path: "/workbench/projectDetail",
        query: {
          id:row.id
        }
      })
    },
    handleCurrentChange(val){
      this.form.page=val;
      this.managerDetail()
    },
    handleSizeChange(val){
        this.form.pagesize=val;
        this.managerDetail()
      },

  }
}
</script>
  
<style lang="less" scoped>
.wrap {
  height: 8.5rem;
  .user-infor{
    padding: 0.34rem 0.3rem;
  
    background: linear-gradient(180deg, #EAF1F5 0%, #FFFFFF 100%);
    margin-bottom: 0.2rem;
    p{
      width: 3rem;
      font-size: 0.14rem;
      color: #666666;
      span{
        font-size: 0.15rem;
        color: #333333;
        font-weight: 600;
      }
      .nickname{
        width: 2rem;
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
  .conte{
    padding: 0.3rem;
    background: #fff;
  }
  .s-top {
    margin-bottom: 0.29rem;

    h2 {
      font-size: 0.2rem;
      font-weight: 600;
      color: #333;

      span {
        color: #3458DD;
      }
    }
  }

  .input-search {
    /deep/.el-input__inner {
      width: 3rem;
    }
  }
}
</style>