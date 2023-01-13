<template>
  <div class="wrap">
    <div class="flex-box xx-top">
      <div class="flex-item  member-infor">
        <h5>成员信息</h5>
        <div class="detail-infor flex-center" v-if="dataList.team_user && dataList.team_user.user">
          <p>花名：<span>{{dataList.team_user.user.stage_name}}</span></p>
          <p>姓名：<span>{{dataList.team_user.user.name}}</span></p>
          <p>手机号：<span>{{dataList.team_user.user.phone}}</span></p>
          <p>岗位：<span>{{dataList.team_user.user.position}}</span></p>
        </div>
      </div>
      <div class="flex-item lcb-count member-infor">
        <h5>成员信息</h5>
        <div class="detail-infor lcb flex-center"  v-if="dataList.statistical">
          <p>项目总数：<span>{{dataList.statistical.project_count}}</span></p>
          <p>里程碑总数：<span>{{dataList.statistical.milestone_count}}</span></p>
          <p>未完成：<span>{{dataList.statistical.milestion_not_finish_count}}</span></p>
          <p>已完成：<span>{{dataList.statistical.milestone_finish_count}}</span></p>
        </div>

      </div>
    </div>
    <div class="mb-detail">
    <h5 class="lcbxx">里程碑信息</h5>
   
    <el-table :data="dataList.list" border stripe style="width: 100%" v-loading="listLoading"
      element-loading-text="正在查询中...">
      <el-table-column label="里程碑名称">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属项目">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属任务">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.task.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="优先级">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.priority_level}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间截点">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.end_time}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.status}}
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
    <!-- 分页 -->
    <!-- <div class="btm_box d-between">
      <div class="pagination_box">
        <el-pagination @current-change="handleCurrentChange" :current-page="form.page" :page-size="form.pagesize"
          :page-sizes="[15]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div> -->
    
  </div>
</template>
  
<script>
import { getData } from "@/api/user";
export default {
  name: "member",
  data() {
    return {
      form: {
        pagesize: 15,
        page: 1,
        content: ''
      },
      dataList: [],
      total: 0,
      listLoading: false,
      detailId:''
    }
  },
  created() {
    this.detailId=this.$route.query.id
    this.userDetail()
  },
  methods: {
    // 成员详情查询
    userDetail() {
      this.listLoading = true
      var data = this.form
      getData({
        url: "workbech/team_workbench/team_member/detail/"+ this.detailId,
      }).then((res) => {
        this.listLoading = false
        this.dataList = res.data
        // this.total = res.data.list.total
      });
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.userIndex();
    },

    checkDetail(row) {
      this.$router.push({
        path: '/workbench/userDetail',
        query: {
          id: row.id
        }

      })
    }
  }
}
</script>
  
<style lang="less" scoped>
.wrap {
  padding: 0.1rem;
  // background: #fff;


  .mb-detail{
    background: #fff;
    padding: 0.19rem 0.3rem;
    h5{
      color:#333;
      margin-bottom: 0.2rem;
      font-size: 0.13rem;
    }

  }

 .xx-top{
margin-bottom: 0.2rem;

 }
 .member-infor{
  width: 9.6rem;
  height: 1.1rem;
  padding:0.25rem 0.3rem;
  margin-right: 0.2rem;
  background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-xmxqx.png);
      background-size: cover;
      background-position: center;
      h5{
        font-size: 0.13rem;
        color:#333;
        margin-bottom: 0.17rem;
      }
      p{
        width: 1.5rem;
        font-size: 0.13rem;
        color:#666;
        span{
          font-size: 0.14rem;
          color: #333;
        }

      }

 }
 .lcb-count{
  width:6.78rem;
  height: 1.1rem;
  padding:0.25rem 0.3rem;
  margin-right: 0;
  background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-member.png);
      background-size: cover;
      background-position: center;
    p{
      span{
        display: inline-block;
          font-size: 0.18rem;
          color: #3458DD;
          font-weight: 600;
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