
<template>
  <div class="wrap">
    <head-nav></head-nav>
    <div class="content">
      <div class="hall-top-bg"><img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmdt-bg.png" alt=""></div>
      <div class="hall">
        <div class="search">
          <el-input placeholder="请输入标题或项目编号" class="search-input" v-model="form.content"  @keydown.enter.native="projectIndex">
            <el-button slot="append" icon="el-icon-search" class="search-btn" @click.stop="projectIndex"></el-button>
          </el-input>
        </div>
        <!-- v-loading="listLoading" -->
        <section class="search-field" >
          <div class="search-field-item project-type">
            <span>项目类型：</span>
            <div  v-for="(item,index) in projectIndexData.type" :key="index">
              <el-button  :class="projectType == index ?'active':''" @click="changeType(index,item)">{{item}}</el-button>
            </div>
          </div>
          <div class="search-field-item project-status">
            <span>项目状态：</span>
            <div  v-for="(item,index) in projectIndexData.front_status" :key="index">
              <el-button :class="projectStatus == index ?'active':''" @click="changeStatus(index,item)">{{item}}</el-button>
            </div>
          </div>
          <div class="search-field-item project-money">
            <span>项目金额：</span> 
            <div v-for="(item,index) in projectIndexData.price" :key="index">
                <el-button :class="projectMoney == index ?'active':''" @click="changeMoney(index,item)">{{item.range[0]}}{{index== 0 ?'':' - '}}{{item.range[1]}}</el-button>
            </div>
          </div>
        </section>
        <div class="hall-list">
          <div class="align-center" v-if="projectIndexData.projects && projectIndexData.projects.data.length==0">
            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png" alt="">
            <p class="color_999">暂无数据</p>
        </div>
          <div class="list-infor" v-if="projectIndexData.projects"  v-loading="contentlistLoading">
            <div class="list-box" v-for="(item,index) in projectIndexData.projects.data" :key="index"  @click="bid(item.id)" >
              <div class="list-left">
                <div class="project-title">
                  <h3>{{item.name}}</h3>
                  <!-- 进行中 -->
                  <!-- <i v-if="item.front_status=='进行中'" class="iconfont icon-xmdt-jxz"></i>   -->
                  <!-- <svg class="icon" aria-hidden="true" v-if="item.front_status=='进行中'">
                      <use xlink:href="#icon-xmdt-jxz"></use>
                  </svg> -->
                  <!-- 验收中 -->
                  <!-- <svg class="icon" aria-hidden="true" v-else-if="item.front_status=='验收中'">
                      <use xlink:href="#icon-xmdt-ysz"></use>
                  </svg> -->
                  <!-- 竞价结束 -->
                  <!-- <i v-else-if="item.front_status=='竞价结束'" class="iconfont icon-xmdt-jjjs1"></i> -->
                  <svg class="icon" aria-hidden="true" v-if="item.front_status=='竞价结束'">
                      <use xlink:href="#icon-xmdt-jjjs1"></use>
                  </svg>
                  <!-- 筹备中 -->
                  <!-- <i v-else-if="item.front_status=='筹备中'" class="iconfont icon-xmdt-cbz"></i> -->
                  <svg class="icon" aria-hidden="true" v-else-if="item.front_status=='筹备中'">
                      <use xlink:href="#icon-xmdt-cbz"></use>
                  </svg>
                  <!-- 竞价中 -->
                  <!-- <i v-else-if="item.front_status=='竞价中'" class="iconfont icon-xmdt-jjz"></i> -->
                  <svg class="icon" aria-hidden="true" v-else-if="item.front_status=='竞价中'">
                      <use xlink:href="#icon-xmdt-jjz"></use>
                  </svg>
                  <!-- 已延期 -->
                  <!-- <i  v-else-if="item.front_status=='已延期'" class="iconfont icon-xmdt-yyq"></i> -->
                  <!-- <svg class="icon" aria-hidden="true" v-else-if="item.front_status=='已延期'">
                      <use xlink:href="#icon-xmdt-yyq"></use>
                  </svg> -->
                </div>
                <div class="project-tag">
                  <el-button type="text" v-if="item.type">{{item.type}}</el-button>
                  <el-button type="text" v-if="item.system">{{item.system}}</el-button>
                  <el-button type="text" v-if="item.platform">{{item.platform}}</el-button>
                  <el-button type="text" v-if="item.period && item.period_type">{{item.period}}{{item.period_type}}</el-button>
                </div>
                <!--  @click.stop 父级添加 阻止事件冒泡 -->
                <div class="project-time"   @click.stop>
                  <span class="release-time">发布于：{{item.created_at}}</span>
                  <span class="deadline">报名截止：{{item.bidding_end_time ||'--'}}</span>
                  <span class="onlookers-show"><span class="color-4662E6">{{item.project_collect_count}}</span>人已围观</span>
                 
                  <div class="onlookers flex-center" v-if="item.has_collect==1">
                    <el-rate :max="1"  @change="cancleOnlook(item)" v-model="item.has_collect" text-color="#ff9900" ></el-rate>
                    <span>围观</span>
                  </div>
                  <!--  @change.stop 阻止事件冒泡无效 需在父级添加 @click.stop -->
                  <div class="onlookers flex-center" v-else  >
                    <el-rate :max="1"  v-model="item.has_collect" text-color="#ff9900"  @change="onlookers(item)"></el-rate>
                    <span>围观</span>
                  </div>
                </div>
              </div>
              <!--  -->
              <div class="list-right">
                <p class="projest-price">
                  <span class="font12">￥</span>
                    <span v-if="item.price_budge">{{item.price_budge}}</span>
                    <span v-else>0</span>
                    
                </p>
                <p class="recruitment-infor">
                  <i class="iconfont icon-xmdt-zmcy"></i>
                  <span>
                    招募成员：<span class="color-1B4B84">{{item.user_bidding_count}}</span>
                  </span>
                </p>
                <el-button type="primary" class="participate-auction" @click="bid(item.id)">参与竞价</el-button>
              </div>
            </div>
            <!--  -->
            <div class="btm_box d-between" v-if="projectIndexData.projects && projectIndexData.projects.data.length!=0 && projectIndexData.projects.total>15">
              <!-- 分页 -->
              <div class="pagination_box">
                <el-pagination @current-change="handleCurrentChange" :current-page="form.page" :page-size="form.pagesize"
                  :page-sizes="[15]" layout="total, sizes, prev, pager, next, jumper" :total="projectIndexData.projects.total">
                </el-pagination>
              </div>
            </div>
          </div>
          <!-- 右侧 -->
          <div class="project-infor">
            <div class="important-recommend"  v-if="projectIndexData.projects_recommend && projectIndexData.projects_recommend.length!=0">
              <p><i class="iconfont icon-xmdt-zdtj"></i> <span>重点推荐</span></p>
              <ul class="recommend-list" v-for="(item, index) in projectIndexData.projects_recommend" :key="index">
                <li @click="bid(item.id)">{{item.name}}</li>
              </ul>
            </div>
            <div class="company-recommend">
              <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmdt-qrcode.png" alt="">
            </div>
            <div class="engineer-leaderboard"  v-if="projectIndexData.users_rank && projectIndexData.users_rank.length!=0">
              <p class="engineer-title"><i class="iconfont icon-xmdt-gcsdjb"></i> <span>工程师等级榜</span></p>
            
                <div class="engineer-infor" v-for="(item, index) in projectIndexData.users_rank" :key="index">
                <div class="engineer-img">
                  <img :src="item.avatar" alt="">
                </div>
                <div class="engineer-user">
                 <strong><p class="color_333">{{item.stage_name}}</p></strong> 
                 
                  <span>参与项目：<span class="color_FF9300"><strong>{{item.project_join_count}}</strong></span> 个</span>
                </div>
                <p class="engineer-level">
                  <span>{{item.level}}</span>级
                </p>
              </div>
  
            </div>

          </div>
          <!--  -->
        </div>

      </div>
      <!--  -->
    </div>

    <btm-nav></btm-nav>
  </div>
</template>
  
  <script>
  import store from '@/store'
  import { getData ,postData} from "@/api/user";
  let that=this;
export default {
  name: "hall",
  data(){
    return{
      projectType:'ALL',
      projectStatus:'ALL',
      projectMoney:0,
      rateNum:0,
      projectIndexData:{},
      listLoading:false,
      contentlistLoading:false,
      type:'',
      front_status:'',
      price:'',
      hallDataList:[],
      content:'',
      form:{
        type:'',
        front_status:'',
        price:'',
        content:'',
        page:1,
        pagesize:10
      },
      total:0,
     
      

    }
  },
  components: {
  },
  created () {
    this.projectIndex()
  },
  methods:{
    keyDown(e){
      console.log(11, e);
      if (e.keyCode == 13 || e.keyCode == 100) {
        this.projectIndex(); //
      }
    },
    cancleOnlook(item){
      var userinfor= store.state.userInfo
      if (userinfor?.id==''||userinfor?.id==undefined) {
        // this.$err('请登录后查看!')
       
        this.$router.push({
          path:'/register',
        })
        return false
      }
      postData({
          url: "/project/cancel_collect",
          data:{
            project_id:item.id
          },
          }).then((res) => {
            if(res.code==200){
              item.has_collect=0;
            }
            this.projectIndex()
          }).catch((err)=>{
            
          })
    },
    // 用户围观接口
    onlookers(item){
      var userinfor= store.state.userInfo
      if (userinfor?.id==''||userinfor?.id==undefined) {
        // this.$err('请登录后查看!')
      
        this.$router.push({
          path:'/register',
        })
        return false
      }
      postData({
          url: "/project/store_collect",
          data:{
            project_id:item.id
          },
          }).then((res) => {
            if(res.code==200){
              item.has_collect=1;
            }
            this.projectIndex()
          }).catch(err=>{

          })
   
    },

    // 首页与搜索公用一个接口
    projectIndex(){
      // this.listLoading=true
      this.contentlistLoading=true
      var data=this.form
        getData({
          url: "/project/index",
          data
          }).then((res) => {
            // this.listLoading=false
            this.contentlistLoading=false
            this.projectIndexData=res.data;
          });

      },
      handleCurrentChange(val) {
      this.form.page = val;
      this.projectIndex();
    },
      // 搜索
      // projectSearch(){
      //   this.contentlistLoading=true
      //   var data=this.form
      //   postData({
      //     url: "/project/search",
      //     data
      //     }).then((res) => {
      //       this.contentlistLoading=false
      //       // this.hallDataList=res.data.projects.data
      //       this.projectIndexData=res.data;
      //       // console.log(this.hallDataList);           
      //     });
      // },
    changeType(index,item){
      this.projectType=index
      this.form.type=item
      this.projectIndex()
      
    },
    changeStatus(index,item){
      this.projectStatus=index
      this.form.front_status=item
      this.projectIndex()
    },
    changeMoney(index,item){
      this.projectMoney=index
      this.form.price=item.id
      this.projectIndex()
     
    },
    bid(id){
      // var userinfor= store.state.userInfo
      // if (userinfor?.id==''||userinfor?.id==undefined) {
      //   this.$err('请登录后查看!')
      // } else {
      //   this.$router.push({
      //   path:'/hallDetail',
      //   query:{
      //     id:id
      //   }
      // })
      // }
      this.$router.push({
        path:'/hallDetail',
        query:{
          id:id
        }
      })


    }
  }
};
</script>
  <style lang="less" scoped>
  .wrap {
    width: 19.2rem;
    height: 100vh;
    position: relative;
    margin: 0 auto;
    background: #F5F6F7;
    box-sizing: border-box;
    overflow-x: hidden;
    .color_FF9300{
      color: #FF9300!important;
    }
    .content {
      position: relative;
      .hall-top-bg {
        width: 100%;
        height: 2.98rem;
  
        img {
          width: 100%;
          height: 100%;
        }
      }
  
      .hall {
        width: 13rem;
        margin: -2.31rem auto 0;
        position: relative;
        z-index: 2;
  
        .search {
          width: 5.48rem;
          // height: 0.49rem;
          margin: 0 auto;
          text-align: center;
          margin-bottom: 0.53rem;
         
      .search-input{
          border-radius: 0.2rem;
          /deep/.el-input__inner{
            border-radius: 0.2rem 0 0 0.2rem!important;
          }
          /deep/.el-input-group__append{
            border-radius:0  0.2rem  0.2rem 0!important;
            background: #3458DD;
            color:#fff;
          }
          /deep/.el-input-group__append:hover{
            background: #6685F8;
          }
        
        }
      }
  
        .search-field {
          background: #fff;
          box-shadow: 0 0 0.05rem 0.01rem #efefef;
          margin-bottom: 0.2rem;
  
          .search-field-item {
            height: 0.62rem;
            border-bottom: 1px solid #E9E9E9;
            line-height: 0.62rem;
            padding-left: 0.19rem;
  
            span {
              color: #666666;
              font-size: 0.12rem;
            }
            div{
              display: inline-block;
              .el-button {
                color: #606266;
              font-weight: 500;
              margin-right: 0.08rem;
              border: none!important;

              }
              .el-button:hover{
                color: #3458DD;
              }
    
              .el-button.active {
                color: #3458DD;
                font-size: 0.14rem;
                background: #F7F7F7;
              }

            }
  
          }
  
        }
  
        .hall-list {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .align-center{
            width: 100%;
            padding: 1.5rem 3.5rem;
            margin:  0 auto;
            background: #fff;
            text-align: center;
          }
  
          .list-infor {
            width: 9.86rem;
            
            .list-box{
              display: flex;
              background: #fff;
              // margin: 0 0.2rem 0.2rem 0;
              margin: 0 0rem 0.2rem 0;
              box-shadow: 0 0 0.05rem 0.01rem #efefef;
              padding: 0.2rem 0.4rem 0.2rem 0.2rem;
              cursor: pointer;
            }
            .list-box:hover{
              box-shadow: 0 0 0.08rem 0.01rem #aab5eb;
            }
  
            .list-left {
              width: 7.28rem;
              border-right: 1px solid #E9E9E9;
  
              .project-title {
                display: flex;
                margin-bottom: 0.16rem;
                align-items: center;
  
                h3 {
                  font-size: 0.18rem;
                  color: #333;
                  margin-right: 0.1rem;
                }
                svg.icon {
                  // font-size: 0.4rem;
                  width: 0.52rem;
            height: 0.21rem;
                }
                // .icon-xmdt-jxz {
                //   color: #2E3192;
  
                // }
  
                // .icon-xmdt-ysz {
                //   color: #3458DD;
                // }
  
                // .icon-xmdt-jjjs1 {
                //   color: #bfbfbf;
                // }
  
                // .icon-xmdt-cbz {
                //   color: #214FD3;
                // }
  
                // .icon-xmdt-jjz {
                //   color: #FF9200;
                // }
  
                // .icon-xmdt-yyq {
                //   color: #d81e06;
                // }
  
              }
  
              .project-tag {
                .el-button {
                  padding: 0.04rem 0.14rem;
                  font-size: 0.12rem;
                  color: #666;
                  margin-bottom: 0.24rem;
                  background: #F4F4F4;
                  height: 0.24rem;
                  color: #FF9300!important;
                  background: #FFF6DB!important;
                }
              }
  
              .project-time {
                font-size: 0.13rem;
                color: #666;
  
                .release-time {
                  display: inline-block;
                  width: 2.1rem;
                  margin-right: 0.4rem;
                }
  
                .deadline {
                  display: inline-block;
                  width: 2rem;
                  margin-right: 0.5rem;
                }
  
                .onlookers-show {
                  margin-right: 0.2rem;
  
                  .color-4662E6 {
                    color: #4662E6;
                  }
                }
                .onlookers {
                  // width: 0.7rem;
                  padding: 0.06rem 0.1rem;
                  text-align: center;
                  color: #666666;
                  background: #FAFAFA;
                  border-radius: 0.05rem;
                  display: inline-block;
                  .el-rate{
                    display: inline-block;
                  }
                }
              }
            }
  
            .list-right {
              //  flex: 1;
              width: 2.58rem;
              padding-left: 0.4rem;
  
              .projest-price {
                color: #FF6200;
                font-size: 0.22rem;
                margin-bottom: 0.1rem;
                font-weight: 600;
  
                .font12 {
                  font-size: 0.12rem;
                }
              }
  
              .recruitment-infor {
                color: #1B4B84;
                margin-bottom: 0.15rem;
  
                .icon-xmdt-zmcy {
                  margin-right: 0.1rem;
                }
  
                .color-1B4B84 {
                  color: #1B4B84;
                  font-size: 0.16rem;
                  font-weight: 600;
                }
              }
  
              .participate-auction {
                width: 1.78rem;
                background: #3458DD;
                color: #fff;
              }
              .participate-auction:hover{
                background: #839DFF;

              }
            }
          }
  
          .project-infor {
            width: 2.93rem;
            .important-recommend {
              font-size: 0.16rem;
              color: #333;
              margin-bottom: 0.2rem;
              background: #fff;
              padding: 0.2rem 0.33rem 0.3rem 0.3rem;
              box-shadow: 0 0 0.05rem 0.01rem #efefef;
  
              p {
                margin-bottom: 0.18rem;
                font-weight: 600;
  
                .icon-xmdt-zdtj {
                  color: #214FD3;
                  font-size: 0.21rem;
                  margin-right: 0.06rem;
                }
              }
  
              .recommend-list {
                color: #666666;
                font-size: 0.14rem;
  
                li {
                  width: 2rem;
                  margin-bottom: 0.15rem;
                  list-style-type: disc;
                  list-style-position: inside;
                  white-space: nowrap;
                  overflow: hidden; //超出的文本隐藏
                  text-overflow: ellipsis; //溢出用省略号显示
                }
  
                li::marker {
  
                  margin-right: 0.2rem;
                  color: #666666;
  
                }
              }
  
            }
  
            .company-recommend {
              width: 2.93rem;
              height: 1.39rem;
              margin-bottom: 0.2rem;
              box-shadow: 0 0 0.05rem 0.01rem #efefef;
  
              img {
                width: 100%;
                height: 100%;
              }
            }
  
            .engineer-leaderboard {
              width: 2.93rem;
              background: #fff;
              padding: 0.2rem 0.23rem 0 0.25rem;
              margin-bottom: 0.32rem;
              box-shadow: 0 0 0.05rem 0.01rem #efefef;
  
              .engineer-title {
                color: #333333;
                font-size: 0.16rem;
  
                // margin-bottom: 0.2rem;
                .icon-xmdt-gcsdjb {
                  color: #214FD3;
                  margin-right: 0.1rem;
                }
  
              }
  
              .engineer-infor:last-child {
                border: none;
              }
  
              .engineer-infor {
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 0.23rem 0;
                border-bottom: 1px solid #F0F0F0;
  
                .engineer-img {
                  width: 0.38rem;
                  height: 0.38rem;
                  margin-right: 0.08rem;
  
                  img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                  }
  
                }
  
                .engineer-user {
                  flex: 1;
                  p {
                    font-size: 0.14rem;
                    color: #333;
                  }
  
                  span {
                    font-size: 0.12rem;
                    color: #666;
                  }
  
                }
  
                .engineer-level {
                  font-size: 0.12rem;
                  color: #333;
  
                  span {
                    font-size: 0.14rem;
                    color: #0268FA;
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