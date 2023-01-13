<template>
  <div class="wrap">
    <div>
      <el-form :inline="true" :model="form" label-width="50px" class="head-form">
        <el-form-item>
          <el-input prefix-icon="el-icon-search" v-model="form.content" placeholder="输入用户ID/昵称/花名/手机号"
            class="input-search"></el-input>
        </el-form-item>
        <el-button type="primary" @click="userIndex">搜索</el-button>
      </el-form>
    </div>
    <el-table :data="dataList" border stripe style="width: 100%" v-loading="listLoading"
      element-loading-text="正在查询中...">
      <el-table-column prop="id" label="用户ID" min-width="80">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.id}}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="nickname" label="用户昵称">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.nickname}}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="stage_name" label="花名" min-width="60">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.stage_name || '/' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="头像"  min-width="60"> 
        <template slot-scope="scope">
          <div class="color_1B385C user-img" v-if="scope.row.avatar">
            <img :src="scope.row.avatar">
          </div>
          <span v-if="!scope.row.avatar">/</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name" label="姓名">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.name}}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="phone" label="手机号"  min-width="60">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.phone}}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="创建时间"  min-width="100">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.created_at || '/' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="实名认证"  min-width="60">
        <template slot-scope="scope">
          <div class="color_1B385C" v-if="scope.row.status">
            {{scope.row.status }}
          </div>
          <span v-else>/</span>
        </template>
      </el-table-column>

      <el-table-column prop="level" label="等级"  min-width="60">
        <template slot-scope="scope">
          <div class="color_1B385C">
            lv.{{scope.row.level}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project_join_count" label="参与项目"  min-width="60">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_join_count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作"  min-width="60">
        <template slot-scope="scope">
          <!-- <el-button type="text">编辑</el-button> -->
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
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

  </div>
</template>
  
<script>
import { getData } from "@/api/user";
export default {
  name: "user",
  data() {
    return {
      form: {
        pagesize: 15,
        page: 1,
        content: ''
      },
      dataList: [],
      total: 0,
      listLoading: true
    }
  },
  created() {
    this.userIndex()
  },
  methods: {
    // 列表查询
    userIndex() {
      this.listLoading = true
      var data = this.form
      getData({
        url: "/workbech/admin_workbench/user/index",
        data
      }).then((res) => {
        this.listLoading = false
        this.dataList = res.data.list.data
        this.total = res.data.list.total
      });
    },
    handleSizeChange(val){ 
      this.form.pagesize= val;
      this.userIndex();
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
  padding: 0.3rem;
  background: #fff;
  min-height: 82vh;
  .user-img {
    width: 0.3rem;
    height: 0.3rem;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit:cover;
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