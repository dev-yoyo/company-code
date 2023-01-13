<template>
    <div class="wrap" v-loading="listLoading">
        <div class="user-infor flex-center">
            <div class="flex-center">
                <div class="userimg">
                    <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/avatar/noavatar_middle.gif" />
                </div>
                <div class="user-related">
                    <div class="username flex-box">
                        <h3>{{dataList.stage_name}}</h3>
                        <el-tag>lv.{{dataList.level}}</el-tag>
                    </div>
                    <div class="Certification flex-box">
                        <p>用户ID：<span> {{dataList.id}}</span></p>
                        <p>创建时间：<span> {{dataList.created_at}}</span></p>
                    </div>

                </div>
            </div>
            <!-- <div class="pull-black">
                <el-button @click="blackList(dataList.id)">拉黑</el-button>
            </div> -->
        </div>
        <!--  -->
        <section>
            <div class="mark-card">
                <!--  -->
                <div class="lcb-list">
                    <div class="marker-table">
                        <div class="flex-center member-type">
                            <ul class="flex-box">
                                <li :class="teamType == 0?'active':''" @click="changeTeamType(0)">基本信息</li>
                                <li :class="teamType == 1?'active':''" @click="changeTeamType(1)">参与项目</li>
                            </ul>
                        </div>
                        <div class="table-content ">
                            <div v-if="teamType == 0" class="tab-infor">
                                <!-- 基本信息 -->
                                <section>
                                    <div class="felx-box basic-infor">
                                        <el-form label-width="100px">
                                            <div class="basicline jbxx">
                                                <h3>基本信息</h3>
                                                <el-form-item label="姓名：">
                                                    <div class="flex-box tdmc">
                                                        <span>{{dataList.name}}</span>
                                                        <span  v-if="dataList">
                                                            <svg class="icon" aria-hidden="true"
                                                            v-if="dataList.status!='审核通过'">
                                                            <use xlink:href="#icon-qj-wrz"></use>
                                                        </svg>
                                                        <svg class="icon" aria-hidden="true"
                                                            v-if="dataList.status=='审核通过'">
                                                            <use xlink:href="#icon-qj-yrz"></use>
                                                        </svg>
                                                        <el-button v-if="dataList.status=='待审核'" type="text" @click="CertifiAuditShow=true" >去审核
                                                        </el-button>
                                                        </span>
                                                    </div>
                                                </el-form-item>
                                                <el-form-item label="联系方式：">
                                                    <span>
                                                      {{dataList.phone}}
                                                    </span>
                                                   
                                                </el-form-item>
                                                <el-form-item label="花名：">
                                                    <span>
                                                      {{dataList.stage_name}}
                                                    </span>
                                                </el-form-item>
                                                <el-form-item label="工作年限：">
                                                    <span v-if="dataList.work_year">
                                                      {{dataList.work_year}}年
                                                    </span>
                                                </el-form-item>

                                                <el-form-item label="所在地区："> 
                                                    <div class="com-line-1">
                                                      {{dataList.area}}
                                                    </div>
                                                </el-form-item>
                                                <el-form-item label="公司名称：">
                                                      <div class="com-line-1">
                                                        {{dataList.company}}
                                                    </div>
                                                </el-form-item>
                                                <el-form-item label="职位名称：">
                                                      <span>
                                                        {{dataList.position}}
                                                    </span>
                                                </el-form-item>
                                                <el-form-item label="所属行业：">
                                                      <span>
                                                        {{dataList.industry}}
                                                    </span>
                                                </el-form-item>
                                                <el-form-item label="可胜任岗位：" style="width:100%">
                                                    <span v-for="(v,i) in dataList.jobs" :key="i">
                                                        {{v}}
                                                    </span>
                                                </el-form-item>
                                            </div>
                                            <div class="basicline tdjn">
                                                <h3>团队技能</h3>
                                                <el-form-item label="擅长平台：">
                                                    <span v-if="dataList.handle_platform!=null">
                                                        <el-button  class="tag-btn" v-for="(item ,index) in dataList.handle_platform" :key="index">{{item}}</el-button>
                                                    </span>
                                                </el-form-item>
                                                <el-form-item label="技能掌握：">
                                               <span  v-if="dataList.skill!=null">
                                                <el-button  class="tag-btn" v-for="(item ,index) in dataList.skill" :key="index">{{item}}</el-button>
                                               </span>
                                                </el-form-item>
                                            </div>
                                            <div class="basicline tdjs">
                                                <h3>团队介绍</h3>
                                                <el-form-item label="技能掌握">
                                                </el-form-item>
                                            </div>
                                        </el-form>
                                    </div>
                                    <div>
                                    </div>
                                </section>
                                <span class="yrz-line"></span>
                                <!--  -->
                                <section class="cyxm">
                                    <div class="participate-project">
                                        <div class="participate-title flex-center">
                                            <h3>个人简历</h3>
                                            <div v-if="false">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-yhgl-png"></use>
                                                </svg>
                                                <span class="color_3458DD">项目案例.pdf</span>
                                                <el-button type="text">下载</el-button>
                                            </div>
                                        </div>
                                        <!--  -->
                                        <div class="qyxm-infor">
                                            <div class="mark-card-detail">
                                                <h5 class="all-list-title">项目案例</h5>
                                                <!--  -->
                                                <div class="align-center" v-if="dataList .example==null || dataList .example.length==0">
                                                    <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png" alt="">
                                                    <p>暂无数据</p>
                                                </div>
                                                <div class="lcb-list-item">
                                                    <el-card shadow="hover" class="lcb-ts-item" v-for="(item,index) in dataList .example" :key="index">
                                                        <div class="flex-center ts-head">
                                                            <h4 class="lcb-bumber">{{item.name}}</h4>
                                                            <!-- <el-button type="primary" class="list-btn-add"
                                                                @click="hideXmal=!hideXmal">
                                                                {{hideXmal?'收起':'展开'}}
                                                            </el-button> -->
                                                            <span>
                                                                <span class="list-btn-add active"
                                                                @click="expand(`table${index}`,'block',`start${index}`,`end${index}`)" :ref="`end${index}`">
                                                               收起
                                                            </span>
                                                            <span class="list-btn-add "
                                                                @click="expand(`table${index}`,'none',`start${index}`,`end${index}`)" :ref="`start${index}`">
                                                                展开
                                                            </span>
                                                            </span>
                                                        </div>
                                                        <div class="alxx">
                                                            <div class="flex-box">
                                                                <p>项目周期：<span>{{item.period}}</span></p>
                                                                <p>项目类型：<span>{{item.type}}</span></p>
                                                            </div>
                                                            <div class="flex-box"  v-if="item.url&&item.url!=null" >
                                                                <p>演示网址：<a target="href" :href="item.url">{{item.url}}</a></p>
                                                            </div>
                                                            <div class="hide-xmal"  :ref="`table${index}`" >
                                                                <p class="lh24">{{item.desc}}</p>
                                                                <div  v-for="(i,v) in item.pic" :key="v" >
                                                                    <img :src="i" alt="">
                                                                </div>
                                                               
                                                            </div>

                                                        </div>
                                                    </el-card>
                                                    <!--  -->

                                                </div>
                                            </div>

                                        </div>
                                        <!--  -->

                                    </div>
                                </section>

                            </div>
                            <!-- 参与项目 -->
                            <div v-if="teamType == 1" class="join-pro">
                                <div class="list-infor">
                                    <div class="align-center" v-if="false">
                                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png" alt="">
                                    </div>
                                    <div class="list-box"  v-for="(item,index) in dataList.project_join"
                                        :key="index">
                                        <div class="list-left">
                                            <div class="project-title">
                                                <h3>{{item.name}}</h3>

                                            </div>
                                            <div class="project-tag">
                                                <el-button type="text" v-if="item.platform">{{item.platform}}</el-button>
                                                <el-button type="text"  v-if="item.system">{{item.system}}</el-button>
                                                <el-button type="text"  v-if="item.period && item.period_type">{{item.period}}{{item.period_type}}</el-button>
                                            </div>
                                            <div class="project-time">
                                                <ul class="ul-common">
                                                    <li v-if="item.background_status == '已延期'" class="color_E30000">
                                                        {{item.background_status}}
                                                    </li>
                                                    <li v-else-if="item.background_status == '已终止' ||item.background_status =='已完结'"
                                                        class="color_999">
                                                        {{item.background_status}}
                                                    </li>
                                                    <li v-else class="color_0EB200">
                                                        {{item.background_status}}
                                                    </li>
                                                </ul>

                                            </div>
                                        </div>
                                        <!--  -->
                                        <div class="list-right">
                                            <p class="projest-price">
                                                <span class="font12">￥</span>{{item.price}}
                                            </p>
                                            <el-button type="primary" class="participate-auction" @click="checkDetail(item.id)">查看详情
                                            </el-button>
                                        </div>
                                    </div>
                             
                                    <!--  -->
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </section>
        <!-- <to-review v-if="toReviewShow" :userId="userId" ref="refToReview" @cancel="hideToReview()"></to-review> -->
        <CertifiAudit v-if="CertifiAuditShow" :userId="detail_id" ref="refCertifiAudit"  @cancel="hideCertifiAudit"></CertifiAudit>

    </div>
</template>
    
<script>
import toReview from './component/to-review.vue';
import CertifiAudit from './component/certifi-audit.vue';
import { getData,postData } from "@/api/user";
import store from "@/store";
export default {
    components: { toReview, CertifiAudit },
    name: "clientDetail",
    data() {
        return {
            teamType: 0,
            inforForm: {},
            hideXmal: false,
            toReviewShow: false,
            CertifiAuditShow: false,
            detail_id:'',
            listLoading:true,
            dataList:[],
            userId:''
        }
    },
    created(){
        this.detail_id = this.$route.query.id
        this.userDetail()
        this.userId=store.state.userInfo.id
        // this.$alert('这是一段内容', '标题名称', {
        //   confirmButtonText: '确定',
        //   callback: action => {
        //     this.$message({
        //       type: 'info',
        //       message: `action: ${ action }`
        //     });
        //   }
        // });
    },
    methods: {
          // 展开
          expand(item, display_, open, close) {
            this.$refs[item][0].style.display = display_
            if (display_ == 'none') {
                this.$refs[open][0].style.display = 'none'
                this.$refs[close][0].style.display = 'block'
            } else if (display_ == 'block') {
                this.$refs[open][0].style.display = 'block'
                this.$refs[close][0].style.display = 'none'
            }
        },
               // 查看详情
               checkDetail(id){
            this.$router.push({
                path:'/workbench/projectDetail',
                query:{
                    id:id
                }
            })
        },
        // 拉黑
        blackList(id){
            this.$confirm("确定拉黑该用户吗？", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
        }).then(() => {
            postData({
            url: "/workbech/admin_workbench/user/block",
            data: { user_id: id },
            }).then((res) => {
            if (res.code == 200) {
                this.$success(res.data.msg)
                this.userDetail()
            }

            });
        }).catch((err)=>{
            return false
        }) 
        },
        hideCertifiAudit() {
            this.CertifiAuditShow = false
            this.userDetail()
        },
        ToReview() {
            this.toReviewShow = true
        },
        hideToReview() {
            this.toReviewShow = false
            this.userDetail()
        },
        changeTeamType(index) {
            this.teamType = index;
        },
        // 展开
        ecpand() {

        },
        // 用户详情
        userDetail() {
            this.listLoading = true
            var data = this.form
            getData({
                url: "/workbech/admin_workbench/user/detail/" + this.detail_id,
                // data
            }).then((res) => {
                this.listLoading = false
                this.dataList = res.data.info
            }).catch((err) => {

            })
        },


    },

}
</script>
    
<style lang="less" scoped>
.wrap {
    .align-center {
        width: 100%;
        text-align: center;
        margin: 2rem auto;

    }

    /deep/.el-form-item__label {
        text-align: justify;
        text-align-last: justify;
    }

    .user-infor {
        background: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/td-bg.png');
        margin-bottom: 0.2rem;
        padding: 0.29rem 0.3rem 0.3rem 0.48rem;
        width: 16.7rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        align-items: center;

        .userimg {
            width: 0.86rem;
            height: 0.86rem;
            border-radius: 50%;
            margin-right: 0.36rem;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .user-related {
            width: 5rem;

            h3 {
                font-size: 0.2rem;
                margin-right: 0.2rem;
            }

            .username {
                margin-bottom: 0.16rem;

                .el-tag {
                    width: 0.4rem;
                    height: 0.2rem;
                    background: rgba(222, 231, 239, 0.39);
                    opacity: 1;
                    border-radius: 0.12rem;
                    color: #333333;
                    line-height: 0.2rem;
                }
            }

            .Certification {
                font-size: 0.14rem;

                p {
                    color: #666;

                    span {
                        color: #000000;
                    }
                }

                p:nth-of-type(1) {
                    margin-right: 0.59rem;
                }

            }

        }

        .pull-black {
            .el-button {
                width: 0.59rem;
                height: 0.36rem;
                background: #C0CBD7;
                opacity: 1;
                border-radius: 0.04rem;
                padding: 0.08rem 0.15rem;
                color: #fff;
                font-size: 0.14rem;
                border: 1px solid #C0CBD7;
            }

            ;

        }

    }

    section {
        .mark-card {
            margin-bottom: 0.1rem;

            .title-mb {
                margin-bottom: 0.1rem;

                .el-button {
                    background: #3458DD;
                    padding: 0.07rem 0.13rem;
                }
            }

            .lcb-list {
                font-size: 0.13rem;
                // margin-bottom:0.07rem ;
                // box-shadow: 0 0 0.08rem 0.01rem #efefef;

                /deep/.el-card__body,
                .el-main {
                    padding: 0.05rem 0.2rem;
                }

                .marker-table {
                    width: 16.7rem;
                    margin: 0.2rem 0;

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
                            box-shadow: 0rem 0 0.05rem 0.01rem #efefef;
                        }
                    }

                    .table-content {
                        // height: 100%;
                        background: linear-gradient(180deg, #F0F6F8 50%, #FFFFFF 100%);
                        padding: 0 0.3rem;
                        overflow: hidden;

                        .tab-infor {
                            display: flex;
                            align-items: flex-start;
                            padding: 0.19rem 0;
                        }

                        section {
                            height: 100%;

                            h3 {
                                width: 100%;
                                font-size: 0.18rem;
                                color: #333;
                                margin-bottom: 0.2rem;
                            }

                            .basic-infor {
                                width: 7.9rem;
                                padding: 0 0.3rem;
                                background: #ffff;
                                box-shadow: 0rem 0rem 0.08rem 0.01rem #efefef;
                                opacity: 1;

                                .basicline {
                                    padding: 0.3rem 0 0.15rem;
                                    border-bottom: 1px solid #EAEAEA;
                                }

                                .basicline:last-child {
                                    border: none;
                                }

                                .jbxx {
                                    display: flex;
                                    flex-wrap: wrap;

                                    .el-form-item {
                                        width: 50%;
                                        // margin-bottom: 0.1rem!important;

                                        .icon {
                                            width: 0.68rem;
                                            vertical-align: middle;

                                        }
                                    }

                                    .tdmc {
                                        align-items: center;
                                    }
                                }

                                .tdjn {
                                    background: rgba(255, 255, 255, 0.39);
                                    box-shadow: 0rem 0rem 0rem rgba(0, 0, 0, 0.1);
                                    opacity: 1;

                                    .el-form-item {
                                        .el-button {
                                            padding: 0.07rem 0.12rem;
                                            background: #E8F4FE;
                                            font-size: 0.13rem;
                                            font-weight: 400;
                                            line-height: 0.18rem;
                                            color: #3458DD;
                                        }

                                    }

                                }

                            }

                        }

                        .join-pro {
                            width: 16.1rem;
                            height: 6.5rem;
                            padding: 0.3rem;
                            overflow-y: scroll;
                            margin: 0.2rem 0;
                            overflow-x: hidden;
                            background: #fff;
                            box-shadow: 0 0 0.08rem 0.01rem #efefef;

                            .list-infor {
                                background: #fff;
                                width: 15.5rem;
                                margin: 0 auto;

                                .list-box {
                                    display: flex;
                                    justify-content: space-between;
                                    background: #fff;
                                    box-shadow: 0 0 0.05rem 0.01rem #efefef;
                                    padding: 0.2rem 0.4rem 0.2rem 0.2rem;
                                    margin-bottom: 0.19rem;
                                }

                                .list-box:hover {
                                    box-shadow: 0 0 0.08rem 0.01rem #aab5eb;
                                }

                                .list-box:hover .participate-auction {
                                    background: #3458DD !important;
                                    color: #fff;
                                }

                                .list-left {
                                    width: 7.28rem;

                                    .project-title {
                                        display: flex;
                                        margin-bottom: 0.16rem;
                                        align-items: center;

                                        h3 {
                                            font-size: 0.18rem;
                                            color: #333;
                                            margin-right: 0.1rem;
                                        }

                                    }

                                    .project-tag {
                                        .el-button {
                                            padding: 0.04rem 0.14rem;
                                            font-size: 0.12rem;
                                            color: #666;
                                            margin-bottom: 0.24rem;
                                            background: #F4F4F4;
                                            height: 0.24rem;
                                        }
                                    }

                                    .project-time {
                                        .ul-common {
                                            li {
                                                list-style-type: disc !important;
                                                list-style-position: inside;
                                            }

                                        }
                                    }
                                }

                                .list-right {
                                    //  flex: 1;
                                    width: 2.58rem;
                                    text-align: center;
                                    align-self: center;

                                    .projest-price {
                                        color: #FF6200;
                                        font-size: 0.22rem;
                                        margin-bottom: 0.1rem;
                                        font-weight: 600;

                                        .font12 {
                                            font-size: 0.12rem;
                                        }
                                    }

                                    .participate-auction {
                                        width: 1.78rem;
                                        border: 1px solid #3458DD !important;
                                        border-radius: 0.18rem;
                                        color: #3458DD;
                                        background: #fff !important;
                                    }

                                    .participate-auction:hover {
                                        background: #3458DD !important;
                                        color: #fff;

                                    }
                                }
                            }
                        }

                        .yrz-line {

                            display: inline-block;
                            height: 6.5rem;
                            background: #cccc;
                            width: 0.01rem;
                            margin: 0 0.16rem;
                            padding-top: 1rem;
                        }

                        .cyxm {
                            width: 7.89rem;

                            background: #fff;

                            .participate-project {
                                box-shadow: 0rem 0rem 0.08rem 0.01rem #efefef;
                                .participate-title {
                                    width: 7.89rem;
                                    border: 0px solid #FFFFFF;
                                    background: #fff;
                                    box-shadow: 0rem 0.03rem 0.06rem 0.01rem #efefef;
                                    // padding: 0.13rem 0.39rem 0.19rem 0.28rem;
                                    padding: 0.13rem 0.28rem;

                                    h3 {
                                        width: 2rem;
                                        font-size: 0.16rem;
                                        margin-bottom: 0;
                                    }

                                    .el-button {
                                        color: #3458DD !important;
                                        font-size: 0.13rem;
                                        text-decoration: underline;
                                    }

                                }

                                .qyxm-infor {
                                    padding: 0.17rem 0.2rem 0;
                                }

                                .mark-card-detail {
                                    margin-bottom: 0.1rem;
                                    margin-left: 0.09rem;
                                    // height: 5.7rem;
                                    height: 6.5rem;
                                    overflow-y: auto;
                                    overflow-x: hidden;

                                    :horizontal – horizontal {
                                        background: transparent;
                                    }

                                    .title-mb {
                                        margin-bottom: 0.1rem;

                                        .el-button {
                                            background: #3458DD;
                                            padding: 0.07rem 0.13rem;
                                        }
                                    }



                                    .all-list-title {
                                        font-size: 0.18rem;
                                        margin-bottom: 0.2rem;

                                    }

                                    .lcb-list-item {
                                        width: 7.1rem;
                                        font-size: 0.13rem;

                                        .lcb-ts-item {
                                            margin-bottom: 0.2rem;
                                            padding: 0.25rem 0.1rem 0;

                                            .member-type {
                                                .zm {
                                                    background: #F4F5F7 !important;
                                                    border: 1px solid #F4F5F7 !important;
                                                    color: #666;
                                                }

                                                li {
                                                    padding: 0.11rem 0.25rem;
                                                    background: #F7F7F7;
                                                    color: #999999;
                                                    margin-right: 0.05rem;
                                                    border-top: 0.04rem solid #F7F7F7;
                                                    box-shadow: 0.05rem 0.05rem 0.05rem 0.01rem transparent;

                                                }

                                                li.active {
                                                    background: #fff;
                                                    border-top: 0.04rem solid #3458DD;
                                                    color: #333333;
                                                    font-weight: 600;
                                                    border-left: 1px solid #F7F7F7;
                                                    box-shadow: 0.05rem 0.05rem 0.05rem 0.01rem#efefef;

                                                }
                                            }
                                        }

                                        .alxx {
                                            margin: 0.2rem 0;

                                            .flex-box {
                                                margin-bottom: 0.13rem;

                                                p {
                                                    width: 2rem;
                                                    color: #999999;

                                                    span {
                                                        color: #333;
                                                    }
                                                }
                                            }

                                            .lh24 {
                                                line-height: 0.24rem;
                                                margin-bottom: 0.1rem;
                                            }

                                            .hide-xmal {
                                                width: 6.5rem;
                                                height: 100%;
                                                display: none;

                                                img {
                                                    width: 100%;
                                                    margin-bottom: 0.1rem;
                                                }
                                            }

                                            // .hide-xmal.on{
                                            //     display: block;
                                            // }
                                        }

                                        .ts-head {
                                            // height: 0.4rem;
                                            margin-bottom: 0.11rem;

                                            h4 {
                                                font-size: 0.18rem;
                                                font-weight: 600;
                                            }

                                            .lcb-bumber {
                                                margin-right: 0.15rem;
                                            }

                                            svg {
                                                margin-right: 0.05rem;
                                            }

                                            .list-btn-add {
                                                display: none;
                                                padding: 0.07rem 0.13rem !important;
                                                background: #F4F5F7 !important;
                                                color: #666;
                                                border: 1px solid #F4F5F7 !important;
                                            }
                                            .list-btn-add.active{
                                                display: block;
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }


                }


            }

        }
    }


}
</style>