<template>
    <div class="wrap hall">
      <div class="serch-input">
        <el-form :inline="true" :model="form" label-width="50px" >
          <el-form-item>
            <el-select v-model="form.type" placeholder="项目类型">
                <el-option
                v-for="item in searchOpt.type"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.front_status" placeholder="项目状态">
                <el-option
                v-for="item in searchOpt.front_status"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input prefix-icon="el-icon-search" clearable v-model="form.content" placeholder="输入关键词搜索"></el-input>
          </el-form-item>
          <el-button type="primary" @click="adminWorkBenchProject">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form>
      </div>
      <el-table :data="dataList" border style="width: 100%" v-loading="listLoading" element-loading-text="正在查询中...">
        <el-table-column prop="name" label="项目名称" min-width="250">
          <template slot-scope="scope">
            <div class="color_2141B4" @click="checkMore(scope.row)">
              {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="项目类型" min-width="150">
          <template slot-scope="scope">
            <div class="color_1B385C">
              {{scope.row.type}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="front_status" label="项目状态" min-width="120">
          <template slot-scope="scope">
            <div>
              <ul class="ul-common">
              <li v-if="scope.row.front_status == '筹备中'  || scope.row.front_status == '竞价中'" class="color_0EB200">
                {{scope.row.front_status}}
              </li>
              <li v-else-if="scope.row.front_status == '竞价结束'" class="color_999">
                {{scope.row.front_status}}
              </li>
            </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="margin" label="是否缴纳保证金" min-width="120">
          <template slot-scope="scope">
            <div class="color_1B385C" v-if="scope.row.margin" >
              <span v-if="scope.row.margin =='0.00'">否</span>
              <span v-else-if="scope.row.margin !='0.00'">是</span>
            </div>
          </template>
        </el-table-column>
       
        <el-table-column label="操作"  min-width="120">
            <template slot-scope="scope">
                <div class="color_3458DD">
                    <el-button type="text" @click="checkMore(scope.row)">查看</el-button>
                </div>
            </template>
        </el-table-column>
      </el-table>
  
      <div class="btm_box d-between">
        <!-- 分页 -->
        <div class="pagination_box">
          <el-pagination @current-change="handleCurrentChange" :current-page="form.page" 
             :page-size="form.pagesize" :page-sizes="[15,20,50,100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <check-hall v-if="hallShow" @cancel="hideHall" :detail_id="detail_id"></check-hall>
    </div>
  </template>
  
  <script>
  import { postData, getData } from "@/api/user";
  import CheckHall from "./component/check-hall.vue"
  import store from '@/store'
  // import { removeWatermark, setWaterMark } from "@/libs/waterMark"
  export default {
    components: {
      CheckHall
    },
    data() {
      return {
        listLoading:true,
        total: 0,
        hallShow:false,
        form: {
          front_status:'',
          content:'',//	否	string	搜索内容
          type:'',//		否	string	项目类型
          pagesize:15,
          page: 1,
        },
        dataList: [{}],
        selectList:[],
        role_id:"",
        currentUrl:'',
        detail_id:'',
        searchOpt:[]
  
  
      }
    },   
     
    mounted() {
      // removeWatermark();
  },
    created() {
        this.role_id=store.state.userInfo.role_id
    if( this.role_id==1) this.currentUrl='admin_workbench'
    else if(this.role_id==2)this.currentUrl='manager_workbench'
    else if(this.role_id==3) this.currentUrl='team_workbench'
    else if(this.role_id==4)this.currentUrl='user_workbench'
    
  
      this.adminWorkBenchProject()
      this.projectIndex()
  
    },
    methods: {
      handleSizeChange(val){
        this.form.pagesize=val;
        this.adminWorkBenchProject()

      },
      reset(){
        this.form={}
        this.adminWorkBenchProject()
      },
      hideHall(){
        this.hallShow=false
      },
      // 、查询下拉框
      projectIndex(){
        getData({
          url: "/project/index",
          data:{}
          }).then((res) => {
            this.searchOpt=res.data

          });

      },
      // 列表查询
      adminWorkBenchProject() {
        this.listLoading=true
        var data=this.form
        getData({
          url: "/project/index",
          data
        }).then((res) => {
          this.listLoading=false
          this.dataList = res.data.projects.data
          this.total=res.data.projects.total
        });
  
      },
      handleCurrentChange(val) {
      this.form.page = val;
      this.adminWorkBenchProject();
    },
     
      checkDetail(row){
       
        this.$router.push({
          path: "/workbench/projectDetail",
          query: {
            id:row.id,
          }
        })
      },
      checkMore(row){
        this.hallShow=true;
        this.detail_id= row.id
      },

  
    }
  
  }
  
  </script>
  
  <style lang="less" scoped>
   
    .workbench{
      background: red;
    }
  .wrap {
    padding: 0.3rem;
    background: #fff;
    min-height: 82vh;
  
    .el-input {
      width: 350px;
    }
  
  
  
    .serch-input {
        display: flex;
        align-items: center;
        /deep/ .el-form-item__content{
            line-height: 0.34rem;
        }
       /deep/.el-input__inner{
        height: 0.34rem;
       }
      /deep/.el-button--primary {
        background: #3458DD!important;
        width: 0.54rem;
         height: 0.32rem;
         padding: 0;
         line-height: 0.32rem;
         text-align: center;
      }
    }
  }
  </style>