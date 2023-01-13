<template>
  <div class="wrap">
    <div>
      <el-form :inline="true" :model="form" label-width="50px" class="head-form">
        <el-form-item>
          <el-input prefix-icon="el-icon-search" clearable v-model="form.content" placeholder="输入项目编号/手机号/用户名" class="input-search"></el-input>
        </el-form-item>
        <el-button type="primary" @click="managerIndex">搜索</el-button>
      </el-form>
    </div>
    <el-table :data="dataList" border  stripe style="width: 100%" v-loading="listLoading" element-loading-text="正在查询中...">
      <el-table-column prop="stage_name" label="花名">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.stage_name || '/'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.name || '/'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.phone}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project_count" label="对接项目">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project_finish_count" label="已完成">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_finish_count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div class="btm_box d-between">
      <div class="pagination_box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
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
      form: {
        content:'',//	否	string	搜索内容
        background_status:'',//		否	string	项目状态
        bidding_type:'',//		否	string	承接方
        type:'',//		否	string	项目类型
        platform:'',//		否	string	主控平台
        system:'',//		否	string	应用系统
        period_type:'',//		否	string	项目周期
        pagesize:15,
        page: 1,
      },
      dataList: [{}],
      listLoading:true,
      total:0
    }
  },
  created(){
    this.managerIndex()
  }
  ,
  methods: {
    handleSizeChange(val){
        this.form.pagesize=val;
        this.managerIndex()
      },
    // 列表查询
    managerIndex() {
      this.listLoading=true
      var data=this.form
      getData({
        url: "/workbech/admin_workbench/manager/index",
        data
      }).then((res) => {
        this.listLoading=false
        this.dataList = res.data.list.data
        this.total=res.data.list.total
      });

    },
    // 查看详情
    checkDetail(row){
      this.$router.push({
        path: "/workbench/projectdIrectorDetail",
        query: {
          id:row.id,
        }
      })
    },
    handleCurrentChange(val){
      this.form.page=val;
      this.managerIndex()
    }
  }
}
</script>
  
<style lang="less" scoped>
.wrap {
  padding: 0.3rem;
  background: #fff;
  min-height: 82vh;

  .input-search{
     /deep/.el-input__inner{
        width:3rem;
      }
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
    
}
</style>