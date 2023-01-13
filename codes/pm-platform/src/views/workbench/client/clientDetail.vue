<template>
    <div class="wrap">

        <div class="user-infor">
            <div class="s-top xq-bg">
                <h2>{{userInfor.name}}</h2>
                <div class="btns">
                    <el-button type="primary" class="bj" @click="Edit(userInfor)">编辑</el-button>
                    <el-button type="primary" class="history" @click="History">历史记录</el-button>
                </div>
            </div>
            <!--  -->
            <div>
                    <div class=" flex-box">
                        <p>联系人：<span class="nickname com-line-1">{{userInfor.contact_name}}</span></p>
                        <p>联系方式：<span>{{userInfor.contact_phone}}</span></p>
                        <p>登录账号：<span>{{userInfor.account}}</span></p>
                        <p>登录密码：<span>{{userInfor.password}}</span></p>
                    </div>
                    <div class=" flex-box">
                        <p>项目需求：<span class="color_0268F9">{{userInfor.desc}}</span></p>
                        <p>项目总额：<span class="colcor_FF980B">¥{{userInfor.price}}</span></p>
                    </div>
                </div>

        </div>
        <div class="conte">
            <div class="detail-title">
                <h2>项目列表</h2>
            </div>
            <el-table :data="dataList.data" border style="width: 100%">
                <el-table-column prop="date" label="项目名称">
                    <template slot-scope="scope">
                        <div class="color_1B385C">
                            {{scope.row.name}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="项目经理">
                    <template slot-scope="scope">
                        <div class="color_1B385C" v-if="scope.row.manager_user">
                            {{scope.row.manager_user.stage_name}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="background_status" label="项目状态">
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
                <el-table-column prop="period_type" label="项目周期">
                    <template slot-scope="scope">
                        <div class="color_1B385C">
                            {{scope.row.period}}{{scope.row.period_type}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="合同金额" >
                    <template slot-scope="scope">
                        <div class="color_1B385C">
                            ¥{{scope.row.price}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="advanced_price" label="外包费用" >
                    <template slot-scope="scope">
                        <div class="color_1B385C">
                            ¥{{scope.row.advanced_price}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="text" @click="Check(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <!-- <div class="btm_box d-between">
        <div class="pagination_box">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[15, 20, 50, 100]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div> -->
      <History v-if="historyShow" ref="refHistory" @cancel="hideHistory"  :detailId="detail_id"></History>
      <Check v-if="checkShow" ref="refCheck" @cancel="hideCheck" :detailId="detail_id"></Check>
      <Edit  v-if="editShow" ref="refEdit" @cancel="hideEdit" :userInfor="userInfor"></Edit>
    </div>
</template>
    
<script>
import History from "./component/history.vue";
import Check from "./component/check.vue";
import Edit from "./component/edit.vue";
import { getData } from "@/api/user";
export default {
    name: "clientDetail",
    components: { History, Check, Edit },
    data() {
        return {
            form:{
                pagesize:15,
                page:1,
            },
            dataList: [],
            historyShow:false,
            checkShow:false,
            editShow:false,
            detail_id:'',
            listLoading:true,
            total:0,
            userInfor:{}
        };
    },
    created(){
        this.detail_id=this.$route.query.id;
        this.customerDetail()
    },
    methods: {
         // 详情查询
        customerDetail() {
      this.listLoading=true
      var data=this.form
      getData({
        url: "/workbech/admin_workbench/customer/detail/"+this.detail_id,
        data
      }).then((res) => {
        this.listLoading=false
        this.dataList = res.data.project_list
        this.userInfor= res.data.customer_info
        this.total=res.data.project_list.total
      });
    },
     
        History(){
            this.historyShow=true
           
        },
        hideHistory(){
            this.historyShow=false
             
        },
        Check(row){
            // this.checkShow=true
            this.$router.push({
                path:'/workbench/projectDetail',
                query:{
                    id:row.id
                }
            })
        },
        hideCheck(){
            this.checkShow=false

        },
        Edit(){
            this.editShow=true
        },
        hideEdit(){
            this.editShow=false
            this.customerDetail()
        }
    },
   
}
</script>
    
<style lang="less" scoped>
.wrap {

    .detail-title {
        margin-bottom: 0.2rem;
        h2{
            font-size: 0.2rem;
        }
    }

    .s-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btns {
            .bj {
                background: #F0F4F8 !important;
                padding: 0.07rem 0.14rem;
                border: 1px solid #F0F4F8 !important;
                color: #1B385C;

            }

            .history {
                padding: 0.06rem 0.12rem;
            }
        }

        h2 {
            font-size: 0.2rem;
            font-weight: 600;
            color: #333;

            span {
                color: #3458DD;
            }
        }

    }

    .user-infor {
        background: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/khxq-bg.png');
        margin-bottom: 0.2rem;
        padding: 0.3rem;
        width: 16.7rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        p {
            width: 2rem;
            font-size: 0.14rem;
            color: #666666;
            margin-bottom: 0.1rem;
            span {
                font-size: 0.15rem;
                color: #333333;
            }
            .nickname {
                width: 1rem;
                vertical-align: middle;
                display: inline-block;
            }
        }
    }

    .conte {
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