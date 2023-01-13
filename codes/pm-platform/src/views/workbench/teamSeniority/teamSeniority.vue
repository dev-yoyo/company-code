<template>
  <div class="wrap">
    <div class="table-content ">
      <div class="tab-infor">
        <!-- 基本信息 -->
        <section>
          <div class="felx-box basic-infor">
            <el-form label-width="100px">
              <div class="basicline jbxx">
                <div class="flex-center xx-title">
                  <h3>基本信息</h3>
                  <el-button v-if="!inforStatus" class="edit-user" @click="editinfor('1')">编辑</el-button>
                  <div v-if="inforStatus">
                    <el-button class="edit-user" @click="inforStatus=false;seniorityIndex()">取消</el-button>
                    <el-button class="edit-user" @click="seniorityUpdate('1')">保存</el-button>
                  </div>
                </div>
                <span class="flex-center mt2" v-if="!inforStatus">
                <el-form-item label="团队名称：">
                  <p>{{dataList.team_name}}</p>
                </el-form-item>
                <el-form-item label="团队成员：">
                  <span v-if="dataList.team_users_count">
                    {{dataList.team_users_count}}人
                  </span>
                </el-form-item>
                <el-form-item label="团队负责人：" v-if="dataList.team_certification">
                  {{dataList.team_certification.contact_name}}
                </el-form-item>
                <el-form-item label="联系方式：">
                  {{dataList.phone}}
                </el-form-item>
                <el-form-item label="企业名称：">
                  {{dataList.company_name}}
                </el-form-item>
                <el-form-item label="所在地区：">
                  <div  class="com-line-1">
                    {{dataList.area}}
                  </div>
                </el-form-item>
                <el-form-item label="企业网址：">
                  {{dataList.url}}
                </el-form-item>
              </span>
                <div class="edit_status mt2" v-if="inforStatus">
                  <el-form-item label="团队名称：">
                    <p>{{dataList.team_name}}</p>
                </el-form-item>
                <el-form-item label="团队成员：">
                  <span v-if="dataList.team_users_count">
                    {{dataList.team_users_count}}人
                  </span>
                </el-form-item>
                <el-form-item label="团队负责人：" v-if="dataList.team_certification">
                  {{dataList.team_certification.contact_name}}
                </el-form-item>
                <el-form-item label="联系方式：">
                  {{dataList.phone}}
                </el-form-item>
                <el-form-item label="企业名称：">
                  {{dataList.company_name}}
                </el-form-item>
                <el-form-item label="所在地区：">
                  <input type="text" v-model="dataList.area" >
                </el-form-item>
                <el-form-item label="企业网址：">
                  <input type="text" v-model="dataList.url">
                </el-form-item>
                </div>
              </div>
            </el-form>
            <el-form>
              <div class="basicline tdjn">
                <div class="flex-center xx-title">
                  <h3>团队技能</h3>
                  <el-button v-if="!teamStatus" class="edit-user" @click="editinfor('2')">编辑</el-button>
                  <div v-if="teamStatus">
                    <el-button class="edit-user" @click="teamStatus=false;seniorityIndex()">取消</el-button>
                    <el-button class="edit-user" @click="seniorityUpdate('1')">保存</el-button>
                  </div>
                </div>
                <div v-if="!teamStatus">
                  <el-form-item label="擅长平台：">
                  <span v-if=" dataList.handle_platform">
                    <el-button class="tag-btn" v-for="(item ,index) in dataList.handle_platform" :key="index">{{item}}</el-button>
                  </span>
                </el-form-item>
                <el-form-item label="技能掌握：">
                  <span v-if="dataList.skill">
                    <el-button  class="tag-btn" v-for="(item ,index) in dataList.skill" :key="index">{{item}}</el-button>
                  </span>
                </el-form-item>
                </div>
                <div v-if="teamStatus">
                  <el-form-item label="擅长平台：">
                 <el-select v-model="dataList.handle_platform" multiple :multiple-limit="5">
                  <el-option v-for="(item,index) in handlePlatform"  :key="index" :label="item" :value="item">
                  {{item}}
                  </el-option>
                 </el-select>
                </el-form-item>
                <el-form-item label="技能掌握：">
                  <el-select v-model="dataList.skill" multiple :multiple-limit="5">
                    <el-option v-for="(item,index) in skill" :key="index" :label="item" :value="item"></el-option>
                 </el-select>
                </el-form-item>
                </div>
              </div>
            </el-form>
            <el-form>
              <div class="basicline tdjs">
                <div class="flex-center xx-title">
                  <h3>团队介绍</h3>
                  <el-button v-if="!descStatus" class="edit-user"  @click="editinfor('3')">编辑</el-button>
                  <div v-if="descStatus">
                    <el-button class="edit-user" @click="descStatus=false;seniorityIndex()">取消</el-button>
                    <el-button class="edit-user" @click="seniorityUpdate('1')">保存</el-button>
                  </div>
                </div>
                <el-form-item label=""  v-if="!descStatus" class="item-ability">
                  {{dataList.desc}}
                </el-form-item>
                <div class="edit_status" v-if="descStatus">
                  <el-form-item >
                    <textarea name="" id="" cols="30" rows="10" v-model="dataList.desc" maxlength="300"></textarea>
                </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div>
          </div>
        </section>
        <span class="yrz-line"></span>
        <!-- 参与项目 -->
        <section class="cyxm">
          <div class="participate-project">
            <div class="participate-title flex-center">
              <h3>企业项目案例<span class="color_666 font12">（上传项目案例，在项目竞价中更有优势哦~） </span></h3>
              <div class="flex-center">
                <!-- v-if="!dataList.document_name" -->
                <div class="flex-center" v-if="dataList.path_url" >
                  <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-yhgl-png"></use>
                  </svg>
                  <span class="docu-name com-line-1">团队资历</span>
                </div>
                <el-upload class="upload-demo" drag multiple action="" :show-file-list="false" :http-request="imgUpload"
                 >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-sc1243"></use>
                  </svg>
                  <span v-if="!dataList.path_url">上传文件</span>
                  <span v-if="dataList.path_url">重新上传</span>
                </el-upload>
              </div>
            </div>
            <!--  -->
            <div class="qyxm-infor">
              <div class="flex-center mb2">
                <h5 class="all-list-title">项目案例</h5>
                <el-button icon="el-icon-plus" class="add-pro" @click="addProjectShow=true">添加</el-button>
              </div>
               <!--  -->
               <div class="align-center no-data" v-if="dataList.example== null || dataList.example.length==0">
                  <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/nodata.png" alt="">
                  <p>暂无数据</p>
                </div>
              <div class="mark-card-detail" v-for="(item,index) in dataList.example" :key="index">
                <div class="lcb-list-item" >
                  <div shadow="hover" class="lcb-ts-item" >
                    <div class="flex-center ts-head">
                      <h4 class="lcb-bumber">{{item.name}}</h4>
                      <span class="list-btn-add active"  @click="packUp(`table${index}`,'block', `open${index}`,`close${index}`)"
                                            :ref="'close'+index">展开
             
                      </span>
                      <span class="list-btn-add"   @click="packUp(`table${index}`,'none',`open${index}`,`close${index}`)"
                                            :ref="'open'+index">收起
             
                      </span>
                    </div>
                    <div class="alxx">
                      <div class="flex-box">
                        <p>项目周期：<span>{{item.period}}{{item.period_type}}</span></p>
                        <p>项目类型：<span>{{item.type}}</span></p>
                      </div>
                      <div class="flex-box" v-if="(item.url && item.url !=null)" >
                        <p style="width:100%">演示网址：<a target="href" :href="item.url">{{item.url}}</a></p>
                      </div>
                      <div class="hide-xmal" :ref="'table'+index">
                        <p class="lh24">{{item.desc}}</p>
                        <div  v-for="(i,v) in item.pic" :key="v" >
                            <img :src="i" alt="">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             

            </div>
            <!--  -->

          </div>
        </section>

      </div>
    </div>
    <add-project v-if="addProjectShow" @cancel="hideAddProject"></add-project>
  </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
import addProject from './commponent/add-project.vue';
export default {
  components: { addProject },
  name: "teamSeniority",
  data() {
    return {
      hideXmal: false,
      listLoading: true,
      dataList: [],
      filename: '',
      handlePlatform: [],
      skill: [],
      jobs:[],
      inforStatus:false,
      teamStatus:false,
      descStatus:false,
      addProjectShow:false
    }
  },
  created() {
    this.seniorityIndex()
  },
  methods: {
     // 默认收起
     packUp(item, display_, open, close) {
            // 注意必须要带[0]
            this.$refs[item][0].style.display = display_
            if (display_ == 'none') {
                this.$refs[open][0].style.display = 'none'
                this.$refs[close][0].style.display = 'block'
            } else if (display_ == 'block') {
                this.$refs[open][0].style.display = 'block'
                this.$refs[close][0].style.display = 'none'
            }
        },
    hideAddProject(){
       this.addProjectShow=false
       this.seniorityIndex()
    },
    // 上传文件
    imgUpload(e) {
      let data = new FormData();
      data.append('file', e.file)
      let url = '/common/single_file';
      this.fileName = e.file.name
      postData({ url, data }).then(res => {
        if (res.code == 200 && res.data.path_url) {
          // this.filename = res.data.filename
          this.dataList.path_url=res.data.path_url
      
          // this.$success(res.data.msg)
          this.seniorityUpdate()
        }
      })
    },
    
      // 个人资历修改
    seniorityUpdate() {
      var data= {
        team_name:this.dataList.team_name == null ? '' : this.dataList.team_name,
        area:this.dataList.area == null ? '' : this.dataList.area,
        url:this.dataList.url == null ? '' : this.dataList.url,
        skill:this.dataList.skill == null ? '[]' : this.dataList.skill,
        handle_platform:this.dataList.handle_platform == null ? '[]' : this.dataList.handle_platform,
        desc:this.dataList.desc == null ? '' : this.dataList.desc,
        path_url:this.dataList.path_url == null ? '' : this.dataList.path_url,
        
      }
      postData({
        url: "/workbech/team_workbench/seniority/update",
        data
      }).then((res) => {
        if(res.code==200){
          this.$success(res.data.msg)
            this.inforStatus=false
            this.teamStatus=false
            this.descStatus=false
            this.seniorityIndex()
        }
      }).catch((err)=>{

      })
    },
    editinfor(type){
      if (type==1) this.inforStatus=true
      else  if (type==2) this.teamStatus=true
      else  if (type==3) this.descStatus=true
    },
    // 列表查询
    seniorityIndex() {
      this.listLoading = true
      getData({
        url: "/workbech/team_workbench/seniority/index",
      }).then((res) => {
        this.listLoading = false
        this.dataList = res.data.info
        this.handlePlatform = res.data.handle_platform
        this.skill = res.data.skill
        this.jobs = res.data.jobs
        
      });
    },
  }
}
</script>
  
<style lang="less" scoped>
.wrap {
  /deep/.el-form-item__label {
    text-align: justify !important;
    text-align-last: justify !important;
  }
  .item-ability {
    /deep/.el-form-item__content{
    // margin-top: 0.05rem;
    line-height: 0.25rem;
    overflow-y: auto;
    max-height: 1.8rem;
    word-wrap: break-word;
    word-break: break-all;
  }
  }
  .mt2{
    margin-top: 0.1rem;
  }
  .mb2{
    margin-bottom: 0.2rem;
  }
  .edit_status{
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
      /deep/input{
        padding: 0 0.1rem;
            width: 2.5rem;
            height: 0.36rem;
            background: #FFFFFF;
            border: 1px solid #E3E5EA;
            color: #333333;
            border-radius: 0.04rem;
            outline: none;
      }

    }

  }
  .el-select{
    width: 5rem;
    height: 0.36rem;
  }
  textarea{
    margin-top: 0.1rem;
    width: 7.3rem;
    resize: none;
    border: 1px solid #ccc;
    border-radius: 0.1rem;
    outline: none;
    padding: 0.1rem;
  }

  .disN {
    display: none;
  }

  .align-center {
    width: 100%;
    text-align: center;
    margin: 2rem auto;
  }
  .no-data img{
    width: 2rem;
  }
  .table-content {
    // height: 100%;
    // background: linear-gradient(180deg, #F0F6F8 50%, #FFFFFF 100%);
    // padding: 0 0.3rem;
    overflow: hidden;

    .xx-title {
      width: 100%;

      h3 {
        width: 5rem;
        margin-bottom: 0;
      }

      .edit-user {
        padding: 0.07rem 0.14rem;
        font-size: 0.13rem;
        color: #1B385C;
        border: none;
        background: #F0F4F8 !important;
      }
    }

    .tab-infor {
      display: flex;
      align-items: flex-start;
      // padding: 0.19rem 0;
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

        // 
        opacity: 1;

        .basicline {
          padding: 0.3rem 0.3rem 0.15rem;
          background: #fff;
          box-shadow: 0rem 0rem 0.08rem 0.01rem #efefef;
          margin-bottom: 0.2rem;
        }

        .basicline:last-child {
          border: none;
        }

        .tdjs {
          height: 3.5rem;
          margin-bottom: 0;
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


    .yrz-line {
      display: inline-block;
      background: #cccc;
      margin: 0 0.16rem;
      padding-top: 1rem;
    }

    .cyxm {
      width: 8.19rem;
      background: #fff;

      .participate-project {
        box-shadow: 0 0rem 0.08rem 0.01rem #efefef;
        .participate-title {
          
          width: 8.19rem;
          border: 0px solid #FFFFFF;
          background: #fff;
          box-shadow: 0rem 0.03rem 0.06rem 0.01rem #ddd;
          // padding: 0.13rem 0.39rem 0.19rem 0.28rem;
          padding: 0.13rem 0.28rem;
          position: relative;z-index: 99;
          .docu-name{
            width: 1rem;
            font-size: 0.14rem;
            color: #3458DD;
          }

          /deep/.el-upload-dragger {
            width: 1rem;
            height: 0.32rem;
            padding: 0.07rem 0.13rem;
            border: 1px solid;
            background: #F0F4F8;
            color: #1B385C;
            border: 1px solid #F0F4F8;
            font-size: 0.13rem;

          }

          svg {
            margin-right: 0.06rem;
          }

          h3 {
            width: 5rem;
            font-size: 0.16rem;
            margin-bottom: 0;

            span {
              font-size: 0.12rem;
            }
          }
        }

        .qyxm-infor {
          padding: 0.17rem 0.2rem 0;
          // box-shadow: 0 0rem 0.08rem 0.01rem #efefef;
          background: linear-gradient(180deg, #EAF1F5 0%, #FFFFFF 100%);
          height: 7.6rem;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .all-list-title {
            font-size: 0.18rem;

          }
          .add-pro{
            background: #3458DD!important;
            font-size: 0.13rem;
            padding: 0.07rem 0.13rem;
            color: #fff;
          }
        .mark-card-detail {
          padding: 0.3rem;
          background: #fff;
          margin-bottom: 0.2rem;
          // max-height: 7.8rem;
          // overflow-y: scroll;
          // overflow-x: hidden;
          box-shadow: 0 0  0.04rem 0.01rem rgba(0, 0, 0, 0.1);

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

          .lcb-list-item {
            width: 7.1rem;
            font-size: 0.13rem;

            .lcb-ts-item {
              // margin-bottom: 0.2rem;
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
                  box-shadow: 0.05rem 0.05rem 0.05rem 0.01rem#ccc;

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
                padding: 0.07rem 0.13rem !important;
                background: #F4F5F7 !important;
                color: #666;
                border: 1px solid #F4F5F7 !important;
                display: none;
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
</style>