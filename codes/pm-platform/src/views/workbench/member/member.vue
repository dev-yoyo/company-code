<template>
  <div class="wrap">
    <div>
      <el-form :inline="true" :model="form" label-width="50px" class="head-form">
        <el-form-item>
          <el-input prefix-icon="el-icon-search" v-model="form.content" placeholder="输入用户ID/昵称/花名/手机号"
            class="input-search"></el-input>
        </el-form-item>
        <el-button type="primary" @click="userIndex">搜索</el-button>
        <el-button class="add-member floatR" type="primary" @click="addNumberShow=true" icon="el-icon-plus">新建</el-button>
      </el-form>
    </div>
    <el-table :data="dataList" border stripe style="width: 100%" v-loading="listLoading"
      element-loading-text="正在查询中...">
      <el-table-column  label="花名">
        <template slot-scope="scope">
          <div class="color_1B385C" v-if="scope.row.user">
            {{scope.row.user.stage_name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.user_name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="岗位">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.position}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="等级">
        <template slot-scope="scope">
          <div class="color_1B385C user-img" v-if="scope.row.user">
           {{scope.row.user.level}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="参与项目">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_team_user_join_count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="里程碑">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_task_team_user_join_count}}
          </div>
        </template>
      </el-table-column>

     
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
          <el-button type="text" @click="deleteMember(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <!-- <div class="btm_box d-between">
      <div class="pagination_box">
        <el-pagination @current-change="handleCurrentChange" :current-page="form.page" :page-size="form.pagesize"
          :page-sizes="[15]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div> -->
<add-member v-if="addNumberShow" :roleRow="roleRow" @cancel="addNumberShow=false; userIndex()"></add-member>
  </div>
</template>
  
<script>
import { getData ,postData} from "@/api/user";
import addMember from './component/addMember.vue';
export default {
  components: { addMember },
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
      addNumberShow:false,
      roleRow:{}
    }
  },
  created() {
    this.userIndex()
  },
  methods: {
    // 列表查询
    userIndex() {
      this.listLoading = true
      var data=this.form
      getData({
        url: "/workbech/team_workbench/team_member/index",
        data
      }).then((res) => {
        this.listLoading = false
        this.dataList = res.data.list
        this.roleRow=res.data.role
        // this.total = res.data.list.total
      });
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.userIndex();
    },
    deleteMember(row){
      this.$confirm("确定删除该成员吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        console.log(111111111111);
        postData({
          url: "/workbech/team_workbench/team_member/delete",
          data: { id: row.id },
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.userIndex()
          }
        });
      }).catch((err) => {
        return false
      })

    },

    checkDetail(row) {
      this.$router.push({
        path: '/workbench/memberDetail',
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
  padding: 0.3rem;
  background: #fff;
  min-height: 82vh;

  .user-img {
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
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
    .add-member{
      padding:0.07rem 0.13rem;

    }
  }

  .input-search {
    /deep/.el-input__inner {
      width: 3rem;
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