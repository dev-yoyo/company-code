<template>
  <div class="wrap">
    <section>
      <div class="mark-card">
        <div class="lcb-list">
          <!-- 管理员 新增一个字段 被评价人身份-->
          <div class="marker-table">
            <!--我的评价  评价我的针对非管理员  -->
            <div class="flex-center member-type">
              <ul class="flex-box"  v-if="role_id!=1">
                <li :class="typeIndex == 0?'active':''" @click="changetypeIndex(0)">我的评价</li>
                <li :class="typeIndex == 1?'active':''" @click="changetypeIndex(1)">评价我的</li>
              </ul>
            </div>
            <div class="table-content" :style="role_id!=1?{ 'min-height': '79.3vh'}:{ 'min-height': '82vh'}">
              <el-table :data="myptTableData" border stripe style="100%" class="tasktable" v-show="typeIndex==0">
                <el-table-column label="项目信息" width="320">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row.project?scope.row.project.name:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="评价人" v-if="role_id==1">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row.evaluate_name?scope.row.evaluate_name:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="被评价人">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row?scope.row.object_name:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="被评价人身份"   v-if="role_id==1">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row.object_type?scope.row.object_type:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="星级" width="200">
                  <template slot-scope="scope">
                  <el-rate v-model="scope.row.star"  disabled></el-rate>
                </template>
                </el-table-column>
                <el-table-column  label="评价" width="258">
                  <template slot-scope="scope">
                    <div class="color_1B385C com-line-1">
                      <span>{{ scope.row.comment?scope.row.comment:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="时间">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row.created_at?scope.row.created_at:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-table :data="pjmyTableData" border stripe style="100%" class="tasktable" v-show="typeIndex==1">
                <el-table-column prop="date" label="项目信息" width="320">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row.project.name?scope.row.project.name:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="评价人" width="320">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row.evaluate_name?scope.row.evaluate_name:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="星级" width="200">
                  <template slot-scope="scope">
                  <el-rate v-model="scope.row.star"  disabled></el-rate>
                </template>
                </el-table-column>
                <el-table-column  label="评价" width="458">
                  <template slot-scope="scope">
                    <div class="color_1B385C com-line-1">
                      <span>{{ scope.row.comment?scope.row.comment:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="时间" width="320">
                  <template slot-scope="scope">
                    <div class="color_1B385C">
                      <span>{{ scope.row.created_at?scope.row.created_at:'/' }}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
      
            </div>
          </div>
          <!-- 分页 -->
          <!-- <div class="btm_box d-between">
            <div class="pagination_box">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                :page-sizes="[15, 20, 50, 100]" :page-size="15" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div> -->
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { login, getData } from "@/api/user";
import store from '@/store'
export default {
  name: "assess",
  data() {
    return {
      typeIndex: '',
      myptTableData: [],
      pjmyTableData: [],
      role_id: '',
    }
  },
  created() {
    this.role_id = store.state.userInfo.role_id
    if (this.role_id == 1) {
      this.currentUrl = 'admin_workbench'
    } else if (this.role_id == 2) {
      this.currentUrl = 'manager_workbench'
    }
    else if (this.role_id == 3) {
      this.currentUrl = 'team_workbench'
    }
    else if (this.role_id == 4) {
      this.currentUrl = 'user_workbench'
    } else {
      this.$message({
        message: '非法进入',
        type: 'warn'
      })
    }
    this.myCommentEvaluation()
  },
  methods: {
    changetypeIndex(index) {
      this.typeIndex = index;
      if(index==0)this.myCommentEvaluation()
     else if(index==1)this.commentMyEvaluation()
    },
    // 我的评价
    myCommentEvaluation() {
      getData({
        url: "/workbech/" + this.currentUrl + "/comment/my_evaluation",
      }).then((res) => {
        this.myptTableData = res.data.list;
      });
    },
  //  评价我的
  commentMyEvaluation() {
      getData({
        url: "/workbech/" + this.currentUrl + "/comment/evaluation_of_my",
      }).then((res) => {
        this.pjmyTableData = res.data.list;
      });
    }
  }
}
</script>
<style lang="less" scoped>
.wrap {
  section {
    .mark-card {

      .title-mb {
        margin-bottom: 0.1rem;

        .el-button {
          background: #3458DD;
          padding: 0.07rem 0.13rem;
        }
      }

      .all-list-title {
        margin-bottom: 0.2rem;

      }

      .lcb-list {
        font-size: 0.13rem;

        /deep/.el-card__body,
        .el-main {
          padding: 0.05rem 0.2rem;
        }

        .marker-table {

          .member-type {
            background: #fff;
            padding-left: 0.3rem;

            li {
              padding: 0.11rem 0.25rem;
              background: #fff;
              color: #666;
              border-bottom: 0.04rem solid #F7F7F7;

            }

            li.active {
             
              background: #F7F7F7;
              border-bottom: 0.04rem solid #3458DD;
              color: #333333;
              font-weight: 600;
            }
          }

          .table-content {
            // min-height: 79.3vh;
            background: linear-gradient(180deg, #F0F6F8 50%, #FFFFFF 100%);
            padding: 0.3rem;
          }


        }

        .ts-head {
          height: 0.4rem;

          .lcb-bumber {
            margin-right: 0.15rem;
          }

          svg {
            margin-right: 0.05rem;
          }

          .list-btn-add {
            padding: 0.07rem 0.13rem !important;
            display: none;
          }

          .list-btn-add.on {
            display: block;
          }
        }
      }

    }
  }
}
</style>