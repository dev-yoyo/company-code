<template>
  <div class="wrap">
    <section>
      <div class="mark-card">
        <!--  -->
        <div class="lcb-list">
          <div class="marker-table">
            <div class="flex-center member-type">
              <ul class="flex-box">
                <li :class="teamType == 0?'active':''" @click="changeTeamType(0)">已认证</li>
                <li :class="teamType == 1?'active':''" @click="changeTeamType(1)">待审核</li>
              </ul>
            </div>
            <div class="table-content" >
              <div v-if="teamType==0">
                <el-table :data="dataListYrz.data" border stripe style="100%" class="tasktable" v-loading="listLoading"
                  element-loading-text="正在查询中...">
                  <el-table-column prop="team_certification.authentication" label="认证编号" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C" v-if="scope.row.team_certification">
                        {{scope.row.team_certification.authentication}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="team_name" label="团队名称" max-width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.team_name || '/' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="负责人" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C" v-if="scope.row.team_leader">
                        {{scope.row.team_leader.stage_name || '/' }}
                      </div>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="联系方式" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C" v-if="scope.row.team_leader">
                        {{scope.row.team_leader.phone}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="企业名称" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.company_name}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="认证时间" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C" v-if="scope.row.team_certification">
                        {{scope.row.team_certification.created_at}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="level" label="团队等级" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.level}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="team_user_stage_name_str" label="团队成员" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.team_user_stage_name_str || '/'}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="project_team_join_count" label="承接项目" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.project_team_join_count}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="project_team_join_finish_count" label="已完成" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.project_team_join_finish_count}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="操作" width="117">
                    <template slot-scope="scope">
                      <el-button type="text" class="color_3458DD" @click="checkDetail(scope.row)">查看</el-button>
                    <!-- <el-button type="text" class="color_3458DD">拉黑</el-button> -->
                    </template>
                  </el-table-column>
                </el-table>
                <div class="btm_box d-between">
                  <!-- 分页 -->
                  <div class="pagination_box">
                    <el-pagination @current-change="handleCurrentChangeY" :current-page="formYrz.page"  @size-change="handleSizeChangeY" 
                      :page-size="formYrz.pagesize" :page-sizes="[15,20,50,100]" layout="total, sizes, prev, pager, next, jumper"
                      :total="totalYrz">
                    </el-pagination>
                    
                  </div>
                </div>
              </div>
              <!--  -->
              <div v-if="teamType==1">
                <el-table :data="dataListDsh.data" border stripe style="100%" class="tasktable" v-loading="listLoading"
                  element-loading-text="正在查询中...">
                  <el-table-column prop="team_certification.authentication" label="认证编号" width="230">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.team_certification.authentication}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="team_name" label="团队名称" max-width="200">
                    <el-button round class="yxj yxj-p3">P1</el-button>
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.team_name  || '/' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="team_certification.contact_name" label="负责人" min-width="300">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.team_certification.contact_name  || '/'}}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="申请人花名" width="150">
                    <template slot-scope="scope">
                      <div class="color_1B385C" v-if="scope.row.team_leader">
                        {{scope.row.team_leader.stage_name}}
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="team_leader.phone" label="联系方式" min-width="200">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.team_leader.phone}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="company_name" label="企业名称" min-width="230">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.company_name}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="team_certification.certificate_at" label="申请时间" min-width="200">
                    <template slot-scope="scope">
                      <div class="color_1B385C">
                        {{scope.row.team_certification.created_at }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="操作" width="208">
                    <template slot-scope="scope">
                      <el-button type="text" class="color_3458DD" @click="checkDetail(scope.row)">查看</el-button>
                      <!-- <el-button type="text" class="color_3458DD">拉黑</el-button> -->
                    </template>
                  </el-table-column>
                </el-table>
                <div class="btm_box d-between">
                  <!-- 分页 -->
                  <div class="pagination_box">
                    <el-pagination @current-change="handleCurrentChangeD" :current-page="formDsh.page"  @size-change="handleSizeChangeD" 
                      :page-size="formDsh.pagesize" :page-sizes="[15,20,50,100]" layout="total, sizes, prev, pager, next, jumper"
                      :total="totalDsh">
                    </el-pagination>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

  </div>

</template>
  
<script>
import { getData } from "@/api/user";
export default {
  name: "team",
  data() {
    return {
      teamType: 0,
      formYrz: {
        pagesize: 15,
        page: 1,
      },
      formDsh: {
        pagesize: 15,
        page: 1,
      },
      dataListYrz: [],
      dataListDsh: [],
      totalYrz: 0,
      totalDsh: 0,
      listLoading: true,
    }
  },
  created() {
    this.teamIndex()
  },
  methods: {
    // 列表查询
    teamIndex() {
      this.listLoading = true
      var data = {}
      if (this.teamType == 0) {
        data = this.formYrz
      } else {
        data = this.formDsh
      }

      getData({
        url: "/workbech/admin_workbench/team/index",
        data
      }).then((res) => {
        this.listLoading = false
        this.dataListYrz = res.data.list
        this.dataListDsh = res.data.list_wait
        this.totalYrz = res.data.list.total
        this.totalDsh = res.data.list_wait.total
      });
    },
    changeTeamType(index) {
      this.teamType = index;
      this.teamIndex()
    },
    handleCurrentChangeY(val) {
      this.formYrz.page = val;
      this.teamIndex();
    },
    handleCurrentChangeD(val) {
      this.formDsh.page = val;
      this.teamIndex();
    },
    handleSizeChangeY(val) {
      this.formYrz.pagesize = val;
      this.teamIndex();
    },
    handleSizeChangeD(val) {
      this.formDsh.pagesize = val;
      this.teamIndex();
    },
    checkDetail(row) {
      this.$router.push({
        path: '/workbench/teamDetail',
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
              border-bottom: 0.04rem solid transparent;

            }

            li.active {
              background: #F7F7F7;
              border-bottom: 0.04rem solid #3458DD;
              color: #333333;
              font-weight: 600;
box-shadow: 0rem 0 0.05rem 0.01rem #efefef;
            }
          }

          .table-content {
          min-height: 78vh;
            background: linear-gradient(180deg, #F0F6F8 50%, #FFFFFF 100%);
            // background: #fff;
            padding: 0.3rem;
          }

          .yxj {
            padding: 0.02rem 0.13rem;
            color: #1B385C;
          }

          .yxj:hover {
            color: #1B385C;
          }

          .yxj-p1 {
            background: #BACEFB;
          }

          .yxj-p2 {
            background: #FDD4A4;
          }

          .yxj-p3 {
            background: #BACEFB;
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