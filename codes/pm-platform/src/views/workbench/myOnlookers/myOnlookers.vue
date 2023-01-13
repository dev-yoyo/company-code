<template>
  <div class="wrap">
    <div class="s-top">
      <h2>围观项目</h2>
    </div>
    <el-table :data="dataList" :model="dataList" border stripe style="width: 100%" v-loading="listLoading"
      element-loading-text="正在查询中...">
      <el-table-column prop="id" label="项目名称">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="发布时间">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.created_at}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stage_name" label="报名状态">
        <template slot-scope="scope">
          <ul class="ul-common">
              <li v-if="scope.row.project.background_status == '已延期'" class="color_E30000">
                {{scope.row.project.background_status}}
              </li>
              <li v-else-if="scope.row.project.background_status == '已终止' || scope.row.project.background_status =='已完结'" class="color_999">
                {{scope.row.project.background_status}}
              </li>
              <li  v-else class="color_0EB200">
                {{scope.row.project.background_status}}
              </li>
            </ul>
        </template>
      </el-table-column>
      <el-table-column prop="avator" label="围观人数">
        <template slot-scope="scope">
          <div class="color_1B385C">
            {{scope.row.project_collect_number}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="onlookers(scope.row)">取消围观</el-button>
          <el-button type="text" @click="checkDetail(scope.row)">前往竞价</el-button>
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

  </div>
</template>
  
<script>
import { getData,postData } from "@/api/user";
export default {
  name: "myOnlookers",
  data() {
    return {
      form: {
        pagesize: 15,
        page: 1,
      },
      dataList: [],
      total: 0,
      listLoading: false
    }
  },
  created() {
    this.collectIndex()
  },
  methods: {
    // 列表查询
    collectIndex() {
      this.listLoading = true
      var data = this.form
      getData({
        url: "/workbech/user_workbench/collect/index",
        data
      }).then((res) => {
        this.listLoading = false
        this.dataList = res.data.info
        // this.total = res.data.list.total
      });
    },
       // 用户围观接口
       onlookers(item) {
            postData({
                url: "/workbech/user_workbench/collect/update_cancel",
                data: {
                  project_collect_id: item.id
                },
            }).then((res) => {
                if (res.code == 200) {
                    this.$success(res.data.msg)
                    this.collectIndex();
                }
            });

        },
    handleCurrentChange(val) {
      // this.form.page = val;
      // this.userIndex();
    },

    checkDetail(row) {
      this.$router.push({
        path: '/hallDetail',
        query: {
          id: row.project_id
        }
      })
      // this.$router.push({
      //   path: '/hall',
      // })
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
  }

  .input-search {
    /deep/.el-input__inner {
      width: 3rem;
    }
  }
}
</style>