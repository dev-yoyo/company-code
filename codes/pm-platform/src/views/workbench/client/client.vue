<template>
  <!-- 客户管理 -->
  <div class="wrap">
    <div class="flex-center head-form">
      <el-form :inline="true" :model="form" label-width="50px">
        <el-form-item>
          <el-input prefix-icon="el-icon-search" v-model="form.content" placeholder="输入用户ID/昵称/花名/手机号" class="input-search"></el-input>
        </el-form-item>
        <el-button type="primary" @click="customerIndex">搜索</el-button>
      </el-form>
      <el-button type="primary" @click="addClientShow=true">新建</el-button>
    </div>
    <el-table :data="dataList" border style="width: 100%" v-loading="listLoading" element-loading-text="正在查询中...">
      <el-table-column prop="id" label="客户ID">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.id}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="客户名称">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="abbr" label="简称">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.abbr}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contact_name" label="对接人">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.contact_name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contact_phone" label="联系方式">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.contact_phone}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project_count" label="项目">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project_count" label="已交付">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_finish_count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project_not_finish_count" label="未交付">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_not_finish_count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="242">
        <template slot-scope="scope">
         <!-- <el-button type="text" >编辑</el-button> -->
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
          <el-button type="text" @click="deleteClient(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div class="btm_box d-between">
      <!-- 分页 -->
      <div class="pagination_box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
           :page-size="form.pagesize" :page-sizes="[15,20,50,100]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <add-client v-if="addClientShow" @cancel="addClientShow=false;customerIndex()"> </add-client>
  </div>
</template>
  
  <script>
  import { getData,postData } from "@/api/user";
import addClient from './component/add-client.vue';
  export default {
  components: { addClient },
    name: "client",
    data(){
    return{
      form: {
        pagesize:15,
        page:1,
        content:''
      },
      dataList: [],
      total:0,
      listLoading:true,
      addClientShow:false,
    }
  },
  created(){
    this.customerIndex()
  },
  methods: {
        // 列表查询
        customerIndex() {
      this.listLoading=true
      var data=this.form
      getData({
        url: "/workbech/admin_workbench/customer/index",
        data
      }).then((res) => {
        this.listLoading=false
        this.dataList = res.data.list.data
        this.total=res.data.list.total
      });
    },
    handleSizeChange(val){
        this.form.pagesize=val;
        this.customerIndex()
      },
    handleCurrentChange(val) {
      this.form.page = val;
      this.customerIndex();
    },
    deleteClient(row){
      this.$confirm('确定删除这个客户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(()=>{
        postData({
        url: "/workbech/admin_workbench/customer/delete",
        data:{
          customer_id:row.id
        }
      }).then((res) => {
        if (res.code==200) {
          this.$success(res.data.msg)
          this.customerIndex()
        } 
      });
      }).catch((err)=>{

      })
 

    },

    checkDetail(row){
      this.$router.push({
        path: "/workbench/clientDetail",
        query: {
          id:row.id,
        }
      })
    },
    
    }
}
  </script>
  
  <style lang="less" scoped>
   .wrap {
  padding: 0.3rem;
  min-height: 82vh;
  background: #fff;
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