<template>
    <div class="wrap" v-loading="listLoading">
        <head-nav></head-nav>
        <header class="list-box">
            <div class="list-infor">
                <div class="list-left">
                    <div class="project-title">
                        <h3>{{dataList.name}}</h3>
                        <!-- 验收中 -->
                        <i class="iconfont  icon-xmdt-cbz" v-if="dataList.front_status=='筹备中'"></i>
                        <!-- 竞价结束 -->
                        <i class="iconfont icon-xmdt-jjjs1" v-else-if="dataList.front_status=='竞价结束'"></i>
                        <!-- 竞价中 -->
                        <i class="iconfont icon-xmdt-jjz" v-else-if="dataList.front_status=='竞价中'"></i>
                    </div>
                    <div class="project-tag">
                        <p class="project-desc">
                            <span>类型：</span>{{dataList.type==''?'--':dataList.type}}
                        </p>
                        <p class="project-desc">
                            <span>周期：</span>{{dataList.period}}{{dataList.period_type}}
                        </p>
                        <p class="project-desc">
                            <span>系统：</span>{{dataList.system==''?'--':dataList.type}}
                        </p>
                        <p class="project-desc">
                            <span>成员招募：</span>{{dataList.user_bidding_count}}人
                        </p>
                    </div>
                    <div class="project-time">
                        <p class="bail">项目保证金：<span class="price-unit">￥</span><span
                                class="bail-price">{{dataList.margin}}</span></p>
                        <!-- bidding_end_time -->
                        <p class="deadline">报名时间：<span>{{dataList.bidding_end_time || '--'}}</span></p>
                        <p class="release-time">发布于：<span>{{dataList.created_at}}</span></p>
                        <span class="onlookers-show"><span
                                class="color-4662E6">{{dataList.project_collect_count}}</span>人已围观</span>
                        <div class="onlookers" v-if="dataList.has_collect==1">
                            <el-rate :max="1" v-model="dataList.has_collect" @change="cancleOnlook(dataList)" text-color="#ff9900"></el-rate>
                            <span>围观</span>
                        </div>
                        <div class="onlookers" v-else>
                            <el-rate :max="1" v-model="dataList.has_collect" @change="onlookers(dataList)"></el-rate>
                            <span>围观</span>
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="list-right">
                    <p class="projest-price">
                        <span class="unit">￥</span>{{dataList.price_budge}}
                    </p>
                    <p class="recruitment-infor">当前已有<span
                            class="color-3458DD">{{dataList.bidding_apply_count}}</span>人参与竞价</p>
                    <!-- <p class="no-staff">暂无人员竞价</p> -->
                    <div class="bid-userimg">
                        <img v-for="(item,index) in dataList.user_bidding_apply" :key="index" v-if="item.user"
                            :src="item.user.avatar" alt="">
                    </div>
                    <!-- ：筹备中、竞价中以及竞价结束 -->
                    <!--  -->
                    <!-- :class="dataList.user_bidding_apply&&dataList.user_bidding_apply.length==0?'mt':''" -->
                    <span  v-if="(dataList.team_bidding!=null ||( dataList.user_bidding&& dataList.user_bidding.length!=0))">
                        <span v-if="!dataList.regist_status">
                        <el-button type="primary" class="participate-auction" v-if="dataList.front_status=='竞价中'"
                            @click="goAim('#aim-bm')">竞价报名</el-button>
                        <el-button type="primary" class="participate-auction" v-else-if="dataList.front_status=='筹备中'"
                            @click="goAim('#aim-bm')">预约提醒</el-button>
                        <el-button type="primary" class="end-prject" v-else-if="dataList.front_status=='竞价结束'">已结束
                        </el-button>
                        </span>
                        <span v-else>
                            <el-button type="primary" class="participate-auction" v-if="dataList.regist_status=='筹备中'">已报名
                            </el-button>
                        </span>

                    </span>
               
                </div>
            </div>
        </header>
        <div class="content">
            <!-- 左 -->
            <section class="content-left">
                <div class="project">
                    <div class="project-pad">
                        <div class="project-desc">
                            <p class="desc">需求描述</p>
                            <div class="download-infor" v-if="dataList.document">
                                <i class="iconfont icon-xmdt-wj"></i>
                                <span class="document-name com-line-1">项目需求</span>
                                <el-button type="text" class="download" @click="downloadDoc(dataList.document)">下载
                                </el-button>
                            </div>
                        </div>
                        <div v-if="dataList.desc&&dataList.desc.length<400"  class="desc-content">
                            <p v-html="dataList.desc"></p>
                        </div>
                        <div v-else class="desc-content">
                            <p>待说明</p>
                        </div>
                    </div>
                    <div class="project-cover" :class=" showMore == true? 'project-show':''"
                        v-if="dataList.desc&&dataList.desc.length>400">
                        <el-button type="text" class="show-all" @click="showAll">查看全部</el-button>
                        <div class="desc-content">
                            <p v-html="dataList.desc"></p>
                        </div>
                    </div>
                </div>
                <div class="recruit-infor"  v-if="(dataList.team_bidding!=null ||( dataList.user_bidding&& dataList.user_bidding.length!=0))">
                    <h3>招募信息</h3>
                    <div class="recruit-box" id="aim-bm">
                        <!-- 个人 -->
                        <div class="recruit-item individual" v-for="(item,index) in dataList.user_bidding" :key="index">
                            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-gr.png" alt="" class="recruit-item-tag">
                            <div class="member-box">
                                <div class="member-title">
                                    <h3>{{item.role}}</h3>
                                    <el-button type="primary" v-if="item.front_status=='可预约'"
                                        @click="appoint('user',item)">{{item.front_status}}</el-button>
                                    <el-button type="primary" class="grey" v-else-if="item.front_status=='已预约'"
                                        @click="signUp('user',item)">{{item.front_status}}</el-button>
                                    <el-button type="primary" v-else-if="item.front_status=='竞价报名'"
                                        @click="signUp('user',item)">{{item.front_status}}</el-button>
                                    <el-button type="primary" class="grey" v-else-if="item.front_status=='已报名'"
                                        @click="signUp('user',item)">{{item.front_status}}</el-button>
                                    <el-button type="primary" class="grey" v-else-if="item.front_status=='竞价结束'"
                                        @click="signUp('user',item)">{{item.front_status}}</el-button>
                                    <div class="recruited" v-else-if="item.front_status=='已招募'">
                                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-yzm.png" alt="">
                                    </div>
                                </div>
                                <p class="project-price" v-if="item.front_status!='已招募'"><span
                                        class="font13">￥</span>{{item.price_low}}-{{item.price_high}}</p>
                                <div class="member-infor"
                                    v-if="item.front_status=='已招募' && item.project_user_join.user">
                                    <img v-if="item.project_user_join" :src="item.project_user_join.user.avatar" alt="">
                                    <span v-if="item.project_user_join">{{item.project_user_join.user.stage_name}}</span>
                                </div>
                                <p class="member-level" :class="item.front_status=='已招募'?'vague':''">
                                    等级要求：<span>lv.{{item.request_level}}</span></p>
                                <p class="member-skill" :class="item.front_status=='已招募'?'vague':''"><span
                                        v-for="(val,key) in item.request_skill" :key="key">{{val}}</span></p>
                            </div>
                        </div>
                        <!--  -->
                        <!-- <div class="recruit-item individual">
                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-gr.png" alt=""  class="recruit-item-tag">
                        <div class="member-box">
                            <div class="member-title">
                                <h3>嵌入式工程师</h3>
                                <el-button  type="primary" class="already-registered" :disabled="true">已报名</el-button>
                            </div>
                            <p class="project-price"><span class="font13">￥</span> 2000-4000</p>
                            <div class="member-infor">
                                <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmdt-qrcode.png" alt="">
                                <span>东方清仓</span>
                            </div> 
                            <p  class="member-level">等级要求：<span>lv.1</span></p>
                            <p class="member-skill">c++、海思、嵌入式开发、PHP、linux、PHP、linux</p>
                        </div>
                    </div>
                    <div class="recruit-item individual">
                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-gr.png" alt=""  class="recruit-item-tag">
                        <div class="member-box">
                            <div class="member-title">
                                <h3>嵌入式工程师</h3>
                                <div class="recruited">
                                    <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-yzm.png" alt="">
                                </div>
                            </div>
                            <p class="project-price"><span class="font13">￥</span> 2000-4000</p>
                            <div class="member-infor">
                                <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmdt-qrcode.png" alt="">
                                <span>东方清仓</span>
                            </div>
                            <p class="member-level blur6">等级要求：<span>lv.1</span></p>
                            <p class="member-skill blur6">c++、海思、嵌入式开发、PHP、linux、PHP、linux</p>
                        </div>
                    </div> -->
                        <!-- 团队 -->
                        <!-- <div class="recruit-item team" v-for="(item,index) in dataList.team_bidding" :key="index">
                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-td.png" alt="" class="recruit-item-tag">
                        <div class="member-box">
                            <div class="member-title">
                                <h3>团队竞价</h3>
                                <el-button type="primary" v-if="item.front_status=='可预约'"  @click="appoint('team',item)">{{item.front_status}}</el-button>
                                <el-button type="primary"  class="grey"  v-else-if="item.front_status=='已预约'"  @click="signUp('team',item)">{{item.front_status}}</el-button>
                                <el-button type="primary" v-else-if="item.front_status=='竞价报名'"  @click="signUp('team',item)">{{item.front_status}}</el-button>
                                <el-button type="primary"  class="grey" v-else-if="item.front_status=='已报名'"  @click="signUp('team',item)">{{item.front_status}}</el-button>
                                <div class="recruited" v-else-if="item.front_status=='已招募'">
                                    <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-yzm.png" alt="">
                                </div>
                            </div>
                            <p  class="member-level team-member-level">等级要求：<span>lv.{{item.request_level}}</span></p>
                            <div  class="member-infor team-member-infor"  v-if="item.front_status=='已招募'&& item.project_team_join.user">
                                <img v-if="item.project_user_join" :src="item.project_team_join.user.avatar" alt="">
                                <span v-if="item.project_user_join">{{item.project_team_join.user.nickname}}</span>
                            </div>
                            <p class="member-skill"  :class="item.front_status=='已招募'?'vague':''"><span v-for="(val,key) in item.request_skill" :key="key">{{val}}</span></p>
                        </div>
                    </div> -->
                        <div class="recruit-item team" v-if="dataList.team_bidding!=null">
                            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-td.png" alt="" class="recruit-item-tag">
                            <div class="member-box">
                                <div class="member-title" v-if="dataList.team_bidding">
                                    <h3>团队竞价</h3>
                                    <el-button type="primary" v-if="dataList.team_bidding.front_status=='可预约'"
                                        @click="appoint('team', dataList.team_bidding)">{{
                                        dataList.team_bidding.front_status}}</el-button>
                                    <el-button type="primary" class="grey"
                                        v-else-if=" dataList.team_bidding.front_status=='已预约'"
                                        @click="signUp('team', dataList.team_bidding)">{{
                                        dataList.team_bidding.front_status}}</el-button>
                                    <el-button type="primary" v-else-if=" dataList.team_bidding.front_status=='竞价报名'"
                                        @click="signUp('team', dataList.team_bidding)">{{
                                        dataList.team_bidding.front_status}}</el-button>
                                    <el-button type="primary" class="grey"
                                        v-else-if=" dataList.team_bidding.front_status=='已报名'"
                                        @click="signUp('team', dataList.team_bidding)">{{
                                        dataList.team_bidding.front_status}}</el-button>
                                    <div class="recruited" v-else-if=" dataList.team_bidding.front_status=='已招募'">
                                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-yzm.png" alt="">
                                    </div>
                                </div>
                                <p class="project-price" v-if="dataList.team_bidding.front_status!='已招募'"><span
                                        class="font13">￥</span>{{dataList.team_bidding.price_low}}-{{dataList.team_bidding.price_high}}</p>
                                <p class="member-level team-member-level" v-if="dataList.team_bidding.front_status!='已招募'">等级要求：<span v-if="dataList.team_bidding">lv.{{
                                dataList.team_bidding.request_level}}</span></p>
                                <div class="member-infor team-member-infor"
                                    v-if="dataList.team_bidding&& dataList.team_bidding.front_status=='已招募'&&  dataList.team_bidding.project_team_join.user">
                                    <img v-if=" dataList.team_bidding.project_team_join"
                                        :src=" dataList.team_bidding.project_team_join.user.avatar" alt="">
                                    <span v-if=" dataList.team_bidding.project_team_join">{{
                                    dataList.team_bidding.project_team_join.user.stage_name}}</span>
                                </div>
                                <p class="member-skill" :class=" dataList.team_bidding.front_status=='已招募'?'vague':''"
                                    v-if="dataList.team_bidding"><span
                                        v-for="(val,key) in  dataList.team_bidding.request_skill"
                                        :key="key">{{val}}</span></p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <!-- 右 -->
            <section class="content-right">
                <div class="project-process">
                    <h3 class="process-title">
                        <i class="iconfont icon-xmdt-xmcylc"></i>
                        <span>项目参与流程</span>
                    </h3>
                    <div class="process-item">
                        <p class="item-desc"><span class="point"></span>实名认证</p>
                        <p class="item-infor">参与项目必须经过实名认证</p>
                    </div>
                    <div class="process-item">
                        <p class="item-desc"><span class="point"></span>完善个人资历信息</p>
                        <p class="item-infor">完善的个人信息有助于提高选中几率</p>
                    </div>
                    <div class="process-item">
                        <p class="item-desc"><span class="point"></span>报名参与竞选</p>
                        <p class="item-infor">企业沟通了解开发者信息后，将确认开发者名单</p>
                    </div>
                    <div class="process-item">
                        <p class="item-desc"><span class="point"></span>参与项目开发</p>
                        <p class="item-infor">按约定参与项目开发，并结算资金</p>
                    </div>
                    <div class="process-item">
                        <p class="item-desc"><span class="point"></span>阶段费用结算</p>
                        <p class="item-infor">按照约定验收阶段性成果并结算费用</p>
                    </div>
                    <div class="process-item">
                        <p class="item-desc"><span class="point"></span>开发完成</p>
                        <p class="item-infor">结算完所有费用，项目结束</p>
                    </div>
                </div>
                <!--  -->
                <div class="company-recommend">
                    <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmdt-qrcode.png" alt="">
                </div>
                <!--  -->
                <div class="project-process project-explain">
                    <h3 class="process-title process-explain">
                        <i class="iconfont icon-xmdt-cysm"></i>
                        <span>参与说明</span>
                    </h3>
                    <!-- 个人资历只针对个人 -->
                    <div class="explain-item" v-if="role_id==4">
                        <p>完善个人资料将提高中标率</p>
                        <router-link to="/workbench/personalSeniority">前往完善个人资历</router-link>
                    </div>
                    <div class="explain-item">
                        <p>参与项目需经过实名认证</p>
                        <router-link to="/personalcenter/personalauth">前往认证</router-link>
                    </div>
                </div>
            </section>
        </div>
        <!-- project_user_bidding_order 预约   project_user_bidding_apply 竞价 :visible.sync="dialogVisible"-->
        <el-dialog title="报名申请"  width="40%" :visible.sync="dialogVisible">
            <div class="bm-apply">
                <h3>{{clickVal.front_status}}</h3>
                <h3 v-if="formType=='user'">{{clickVal.role}}</h3>
                <p>等级要求：<span>lv.{{clickVal.request_level}}</span></p>
                <p><span v-for="(item ,index) in clickVal.request_skill" :key="index">{{item}}</span></p>
                <p class="line"></p>
                <div class="flex-center">
                    <p style="width: 3.5rem;">项目预算：<span
                            class="price">¥{{clickVal.price_low}}-{{clickVal.price_high}}</span></p>
                    <div class="flex-center apply-number">
                        <!-- {{clickVal.subscribe_number}} -->
                        <p>当前已有<span class="cy-number" v-if="formType =='user'">{{clickVal.project_user_bidding_order.length}}<span>人</span></span>
                            <span v-if="formType == 'team'"><span class="cy-number">{{clickVal.project_team_bidding_order.length}}</span>个团队</span>参与预约</p>
                        <div class="apply-user" v-if="formType=='team'">
                            <img v-for="(item,index) in clickVal.project_team_bidding_order" :key="index" :src="item" :style="{'left':index*10+'px'}"
                                alt="">
                        </div>
                        <div class="apply-user" v-else>
                            <img v-for="(item,index) in clickVal.project_user_bidding_order" :key="index" :src="item" :style="{'left':index*10+'px'}"
                                alt="">
                        </div>
                    </div>
                </div>
            </div>
            <label for="">您的竞价：</label>
            <el-input placeholder="¥ 请输入金额" v-model="price"></el-input>
            <label for="">预估时间：</label>
            <el-input placeholder="请输入天数" v-model="estimated_time" style="width:7rem;margin-right: 0.1rem;">
            </el-input><span>天</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
import config from "@/libs/config";
import store from '@/store'
import { json } from "body-parser";
import config from '@/libs/config'
export default {
    name: "hallDeatil",
    data() {
        return {
            rateNum: 1,
            showMore: false,
            detail_id: '',
            listLoading: true,
            dataList: [],
            dialogVisible: false,
            imgS: [
                'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/avatar/noavatar_middle.gif',
                'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/avatar/noavatar_middle.gif',
                'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/avatar/noavatar_middle.gif'
            ],
            formType: '',
            clickVal: '',
            price: '',
            estimated_time: '',
            is_leader: '',
            cr_url:''
        }
    },
    created() {
        this.cr_url=  process.env.NODE_ENV === "development"
        ? config.baseUrl.dev
        : config.baseUrl.pro;
        this.role_id = store.state.userInfo.role_id
        if (sessionStorage.getItem('isLook') == 'true') {
            sessionStorage.setItem('isLook', true)
        } else {
            sessionStorage.setItem('isLook', false)
        }
        this.showMore = JSON.parse(sessionStorage.getItem('isLook'))
        this.detail_id = this.$route.query.id;
        this.projectDetail();


    },
    methods: {
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
              // this.projectIndex();
            }
          }).catch(err=>{
            
          })
    },
        // 重新获取用户数据
        // getUserinfo() {
        //     getData({
        //         url: "/login/get_userinfo",
        //     }).then((res) => {
        //         if (res.code == 200 && res.data.info) {
        //             this.is_leader = res.data.info?.is_leader
        //             if (this.is_leader == "否") {
        //                 this.$err('你还没有进行团队认证，无法进行团队报名!')
        //                 return false
        //             }
        //         }
        //     });
        // },
        // c查询竞价报名状态
        projectStoreApply(type, bidding_id,callback) {
            var apply_status=''
            postData({
                url: "/project/check_apply",
                data: {
                    type,
                    bidding_id,
                },
            }).then((res) => {
                // code==422时 您已报名该项目岗位,无法参与该岗位竞争 true
                if (res.code == 200) {
                    apply_status = true
                    callback(apply_status)
                } else if (res.code == 422) {
                    apply_status = false
                    callback(apply_status)
                } else {
                    apply_status = false
                    callback(apply_status)
                }
            }).catch((err) => {

            })
        },

        // 文件下载
        downloadDoc(url) {
            window.open( this.cr_url+"/common/download?path=" + url)

        },
        judgeLogin(){
           
        } ,
        // 用户围观接口
        onlookers(item) {
            var userinfor= store.state.userInfo
            if (userinfor?.id==''||userinfor?.id==undefined) {
               
                this.$router.push({
                path:'/register',
                })
                return false
            }
          
            postData({
                url: "/project/store_collect",
                data: {
                    project_id: item.id
                },
            }).then((res) => {
                if (res.code == 200) {
                    // this.$success(res.data.message)
                    // this.projectDetail();
                    item.has_collect=1;
                }
            });

        },
        // 瞄点
        goAim(selector) {
            document.querySelector(selector).scrollIntoView({
                behavior: "smooth"
            });
        },
        // 预约
        appoint(type, item) {
            var userinfor= store.state.userInfo
            if (userinfor?.id==''||userinfor?.id==undefined) {
                item.has_collect=false;
                this.$router.push({
                path:'/register',
                })
                return false
            }
            if(this.role_id==1 || this.role_id==2){
                            this.$err('当前身份不允许预约！')
                            return false
                        }
            // code==422时 您已报名该项目岗位,无法参与该岗位竞争 true
            this.projectStoreApply(type, item.id,(result)=>{
                if (result) {
                    postData({
                        url: "/project/store_order",
                        data: {
                            type: type,
                            bidding_id: item.id
                        }
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                            this.dialogVisible = false
                            this.projectDetail()

                        }
                    });

                }else{

                }

            })
        

        },
        //竞价报名
        signUp(type, item) {
            // 报名竞价 已跟产品cj确认过逻辑
            // 1 未登录直接跳转注册 
            // 2 非管理员非项目经理才可以报名
            // 3 团队竞价 需要团队认证之后才可报名
            // 4 已报名过项目的不可以报名相同项目 （个人和团队不能重复报名同一个项目!!!）
            var userinfor= store.state.userInfo
            if (userinfor?.id==''||userinfor?.id==undefined) {
                item.has_collect=false;
                this.$router.push({
                path:'/register',
                })
                return false
            }
            if(this.role_id==1 || this.role_id==2){
                this.$err('当前身份不允许报名！')
                return false
            }
            // code==422时 您已报名该项目岗位,无法参与该岗位竞争 true
              //   callback 方法 把函数当作一个参数传到另外一个函数中，当需要用这个函数是，再回调运行()这个函数.
            this.projectStoreApply(type, item.id,(result)=>{
            if (result) {
                this.formType = type
                    this.clickVal = item
                  
                    // 用户报名时 获取最新用户是否团队状态
                        if (type=='team' && item?.allow_apply==false) {
                            this.$err('你还没有进行团队认证，无法进行团队报名!')
                            return false
                        }
                        
                    // 待录用  已报名
                    if (item.front_status == '已报名') {
                        this.$confirm('您已报名该项目' + item.role + '岗位，无法参与岗位竞争', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(()=>{
                            this.dialogVisible = false
                        }).catch((err)=>{
                            this.dialogVisible = false
                        })
                        // this.$message('您已报名该项目' + item.role + '岗位，无法参与岗位竞争')
                       
                    } else if (item.front_status == '已预约') {
                        this.$confirm('您已预约该项目，无需重复预约', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(()=>{
                            this.dialogVisible = false
                        }).catch((err)=>{
                            this.dialogVisible = false
                        })
                        // this.dialogVisible = false
                    } else {
                        this.dialogVisible = true
                    }
                
            } else {
                // 非200 axios 封装会有弹窗
                // this.$err('您已报名该项目岗位,无法参与该岗位竞争!')
            }
           })
       

        },
        //  表单提交 竞价报名
        submit() {

            var data = {
                type: this.formType,
                bidding_id: this.clickVal.id,
                price: this.price,
                estimated_time: this.estimated_time,
            }
            postData({
                url: "/project/store_apply",
                data
            }).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    })
                    this.dialogVisible = false
                    this.projectDetail()
                    this.price = ''
                    this.estimated_time = ''
                    this.formType = ''
                }
            });

        },
        // 查看全部
        showAll() {
            sessionStorage.setItem('isLook', true)
            this.showMore = JSON.parse(sessionStorage.getItem('isLook'))
        },

        // 列表查询
        projectDetail() {
            this.listLoading = true
            getData({
                url: "/project/detail/" + this.detail_id,

            }).then((res) => {
                this.listLoading = false
                this.dataList = res.data.info
            });
        },
    }
}
</script>
  
<style lang="less" scoped>
.wrap {
    width: 19.2rem;
    position: relative;
    height: 100vh;
    position: relative;
    margin: 0 auto;
    background: #F5F6F7;
    box-sizing: border-box;
    overflow-x: hidden;
.desc-content{
    img{
        max-width: 10rem;
        border: 1px solid red;
    }
}
    .el-dialog {
        .bm-apply {
            padding: 0.2rem;

            background: linear-gradient(180deg, #EAF1F5 0%, #FFFFFF 33%, #FFFFFF 66%, #F7FCFF 100%);
            margin-bottom: 0.2rem;

            h3 {
                color: #333;
                font-size: 0.16rem;
                margin-bottom: 0.2rem;
            }

            p {
                margin-bottom: 0.1rem;

                .price {
                    color: #FF980B;
                    font-size: 0.16rem;
                    font-weight: 600;
                }

                .cy-number {
                    color: #3458DD;
                    font-size: 0.16rem;
                    font-weight: 600;
                }


                span {
                    color: #333333;
                    font-size: 0.14rem;
                }
            }
        }

        .apply-number {
            position: relative;
            display: flex;
            align-items: center;

            p {
                width: 2rem;
                margin-bottom: 0;
            }
        }

        .apply-user {
            width: 1rem;

            height: 0.2rem;
            overflow: hidden;
            position: relative;

            img {
                position: absolute;
                width: 0.2rem;
                height: 0.2rem;
                border-radius: 50%;
                vertical-align: middle;
            }
        }

        label {
            margin-bottom: 0.1rem;
            display: inline-block;
        }

        .el-input {
            margin-bottom: 0.15rem;

        }

    }

    .blur6 {
        filter: blur(0.06rem);
        pointer-events: none;
    }

    .list-box {
        width: 13rem;
        margin: 0.5rem auto 0;

        .list-infor {
            display: flex;
            background: #fff;
            margin: 0 0rem 0.2rem 0;
            box-shadow: 0 0 0.05rem 0.01rem #efefef;
        }

        .list-box:hover {
            box-shadow: 0 0 0.05rem 0.01rem #aab5eb;
        }

        .list-left {
            width: 10rem;
            background: linear-gradient(180deg, #EAF1F5 0%, #FFFFFF 100%);
            padding: 0.34rem 0.29rem 0.31rem 0.31rem;

            .project-title {
                display: flex;
                margin-bottom: 0.2rem;
                align-items: center;

                h3 {
                    font-size: 0.18rem;
                    color: #333;
                    margin-right: 0.1rem;
                }

                .icon-xmdt-jxz {
                    color: #2E3192;

                }

                .icon-xmdt-ysz {
                    color: #3458DD;
                }

                .icon-xmdt-jjjs1 {
                    color: #bfbfbf;
                }

                .icon-xmdt-cbz {
                    color: #214FD3;
                }

                .icon-xmdt-jjz {
                    color: #FF9200;
                }

                .icon-xmdt-yyq {
                    color: #d81e06;
                }

            }

            .project-tag {
                border-bottom: 1px solid #ccc;
                padding-bottom: 0.4rem;

                .project-desc {
                    font-size: 0.14rem;
                    color: #333;
                    margin-right: 0.4rem;
                    display: inline-block;

                    span {
                        color: #666;
                    }
                }
            }

            .project-time {
                padding-top: 0.24rem;
                font-size: 0.14rem;
                color: #666;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .bail {
                    width: 2.5rem;
                    color: #666666;

                    .price-unit {
                        font-size: 0.14rem;
                        color: #FF980B;
                    }

                    .bail-price {
                        font-size: 0.16rem;
                        color: #FF980B;
                    }
                }

                .deadline {
                    width: 2.5rem;
                    color: #666;

                    span {

                        color: #333333;
                    }
                }

                .release-time {
                    width: 2.5rem;
                    color: #666;

                    span {

                        color: #333333;
                    }
                }


                .onlookers-show {
                    width: 0.7rem;
                    margin-right: 0.2rem;

                    .color-4662E6 {
                        color: #4662E6;
                    }
                }

                .onlookers {
                    width: 0.6rem;
                    text-align: center;
                    color: #666666;

                    //   display: inline-block;
                    .el-rate {
                        font-size: 0.13rem;
                        text-align: center;
                        display: inline-block;
                    }
                }
            }
        }

        .list-right {
            flex: 1;
            //    padding: 0.3rem 0.44rem 0.3rem 0.4rem;
            padding: 0.3rem;

            .projest-price {
                color: #FF980B;
                font-size: 0.28rem;
                margin-bottom: 0.1rem;
                font-weight: 600;

                span {
                    font-size: 0.14rem;
                }
            }

            .recruitment-infor {
                color: #1B4B84;
                margin-bottom: 0.15rem;
                font-size: 0.13rem;

                .color-3458DD {
                    color: #3458DD;
                    font-size: 0.16rem;
                    font-weight: 600;
                    font-size: 0.16rem;
                }
            }

            .no-staff {
                color: #999999;
                margin-bottom: 0.27rem;
            }

            .bid-userimg {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 0.24rem;
                height: 0.24rem;

                img {
                    width: 0.24rem;
                    height: 0.24rem;
                    border-radius: 50%;
                    margin-right: 0.06rem;
                }
            }

            .participate-auction {
                width: 2.04rem;
                background: #3458DD;
                color: #fff;
            }


            .participate-auction:hover {
                background: #839DFF;
            }

            .end-prject {
                width: 2.04rem;
                background: #EAEAEA !important;
                border: #EAEAEA !important;
                color: #FFFFFF;
                cursor: default;

            }
        }
    }

    .content {
        position: relative;
        width: 13rem;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .content-left {
            position: relative;
            width: 9.87rem;
            // border: 1px solid ;

            .project {
                background: #fff;
                box-shadow: 0 0 0.05rem 0.01rem #efefef;
                margin-bottom: 0.2rem;

                .project-pad {
                    padding: 0.16rem 0.3rem 0.31rem 0.3rem;

                    // padding:0.16rem 0.3rem 0rem 0.3rem;
                    .project-desc {
                        display: flex;
                        justify-content: space-between;

                        .desc {
                            font-size: 0.16rem;
                            color: #333;
                            font-weight: 600;
                        }

                        .download-infor {
                            text-align: center;
                            width: 2rem;
                            height: 0.48rem;
                            background: #E8F4FE;
                            padding: 0.15rem;
                            .document-name{

    display: inline-block;

}

                            .icon-xmdt-wj {
                                color: #1296db;
                                margin-right: 0.11rem;
                            }

                            span {
                                // width: 1.11rem;
                                height: 0.15rem;
                                font-size: 0.13rem;
                                font-weight: 400;
                                color: #333333;
                                margin-right: 0.12rem;
                            }

                            /deep/.download {
                                width: auto;
                                height: auto;
                                text-decoration: underline;
                                padding: 0;
                            }
                        }
                    }
                    .desc-content{
                        overflow: hidden;
                    
                    }
                }

                p {
                    font-size: 0.15rem;
                    color: #666;
                    line-height: 0.28rem;
                    margin-bottom: 0.1rem;

                }

                .project-show {
                    height: auto !important;
                    padding: 0 0.3rem 0.2rem !important;
                    width: 9.87rem !important;
                    overflow: auto !important;
                    background: #fff !important;

                    .show-all {
                        display: none;
                    }

                }

                .project-cover {
                    position: relative;
                    width: 9.87rem;
                    overflow: hidden;
                    height: 1.48rem;
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(28, 28, 28, 0.5) 100%);
                    padding: 0 0.3rem;

                    .show-all {
                        position: absolute;
                        left: 50%;
                        top: 1rem;
                        transform: translateX(-50%);
                        width: 1.18rem;
                        height: 0.32rem;
                        border-radius: 0.16rem;
                        font-size: 0.14rem;
                        line-height: 0.28rem;
                        color: #333333;
                        background: #fff;
                        padding: 0;
                        margin: 0 auto;
                    }

                    .show-all:hover {
                        color: #3458DD;
                        text-decoration: underline;

                    }
                }

                p.claim {
                    font-size: 0.14rem;
                    color: #333;

                }

                img {
                    width: 6rem;
                    margin-bottom: 0.1rem;

                }
            }

            .recruit-infor {
                width: 9.87rem;
                padding: 0.3rem;
                background: #fff;
                margin-bottom: 1.5rem;
                position: relative;

                h3 {
                    font-size: 0.16rem;
                    color: #333;
                    margin-bottom: 0.1rem;
                }

                .recruit-box {
                    display: flex;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    position: relative;
                    -moz-user-select:none; /* Firefox私有属性 */

-webkit-user-select:none; /* WebKit内核私有属性 */

-ms-user-select:none; /* IE私有属性(IE10及以后) */

-khtml-user-select:none; /* KHTML内核私有属性 */

-o-user-select:none; /* Opera私有属性 */

user-select:none; /* CSS3属性 */

                    .recruit-item:nth-child(3n) {
                        margin-right: 0;
                    }

                    .recruit-item {
                        width: 3.02rem;
                        height: 1.73rem;
                        background: linear-gradient(180deg, #EAF2FF 0%, #FFFFFF 100%);
                        box-shadow: 0 0 0.05rem 0.01rem #efefef;
                        margin: 0 0.1rem 0.1rem 0;
                        position: relative;

                        img.recruit-item-tag {
                            position: absolute;
                            top: 0;
                            left: 0;
                        }

                        .member-box {
                            width: 3.02rem;
                            height: 1.73rem;
                            // padding: 0.2rem;
                            padding: 0.2rem 0.2rem 0.2rem 0.25rem;

                            // box-shadow: 0 0 0.05rem 0.01rem #efefef;
                            .member-title {
                                display: flex;
                                justify-content: space-between;
                                align-items: flex-start;

                                h3 {
                                    font-size: 0.16rem;
                                    color: #333;
                                    margin-bottom: 0.1rem
                                }

                                .el-button {
                                    padding: 0.06rem 0.13rem;
                                    background: #3458DD;
                                }

                                .grey {
                                    background: #D9D9D9 !important;
                                    border: 1px solid #D9D9D9 !important;
                                }

                                .recruited {
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    width: 0.93rem;
                                    height: 0.73rem;
                                }

                            }

                            .project-price {
                                font-size: 0.16rem;
                                font-weight: 600;
                                color: #FF980B;
                                margin-bottom: 0.11rem;

                                .font13 {
                                    font-size: 0.13rem;
                                }

                            }

                            .member-infor {
                                margin-bottom: 0.1rem;

                                img {
                                    width: 0.25rem;
                                    height: 0.25rem;
                                    border-radius: 50%;
                                    margin-right: 0.08rem;
                                    vertical-align: middle;
                                }

                                span {
                                    font-size: 0.14rem;
                                    font-weight: 500;
                                    color: #333333;
                                }

                            }

                            .team-member-infor {
                                margin-bottom: 0.44rem;
                            }

                            .member-level {
                                font-size: 0.13rem;
                                font-weight: 400;
                                line-height: 0.18rem;
                                color: #999999;
                                margin-bottom: 0.1rem;

                                span {
                                    font-size: 0.14rem;
                                    font-weight: 400;
                                    line-height: 0.2rem;
                                    color: #333333;
                                }

                            }

                            .team-member-level {
                                // margin-bottom: 0.44rem;
                            }

                            .member-skill {
                                width: 2.5rem;
                                height: 0.4rem;
                                font-size: 0.14rem;
                                font-weight: 400;
                                line-height: 0.2rem;
                                color: #333333;

                                span {
                                    margin-right: 0.05rem;
                                }
                            }

                            .vague {
                                filter: blur(0.1rem);
                                pointer-events: none;
                            }
                        }
                    }

                    .team {
                        background: linear-gradient(180deg, #FFF2E2 5%, #FFFFFF 50%);
                    }

                    .individual {
                        background: linear-gradient(180deg, #EAF2FF 5%, #FFFFFF 50%);
                    }
                }



            }
        }

        .content-right {
            width: 2.93rem;

            .project-process {
                background: #fff;
                padding: 0.28rem 0.25rem 0.21rem 0.25rem;
                box-shadow: 0 0 0.05rem 0.01rem #efefef;
                margin-bottom: 0.2rem;

                h3.process-title {
                    font-size: 0.16rem;
                    color: #333;
                    margin-bottom: 0.23rem;

                    .icon-xmdt-xmcylc {
                        color: #5488FD;
                        margin-right: 0.1rem;
                    }
                }

                .process-item {
                    margin-bottom: 0.2rem;

                    .item-desc {
                        color: #333333;
                        font-size: 0.14rem;
                        margin-bottom: 0.05rem;
                        padding-left: -0.2rem;

                        .point {
                            display: inline-block;
                            width: 0.07rem;
                            height: 0.07rem;
                            border-radius: 50%;
                            background: #214FD3;
                            margin-right: 0.1rem;
                        }
                    }

                    .item-infor {
                        margin-left: 0.03rem;
                        padding-left: 0.13rem;
                        line-height: 0.17rem;
                        border-left: 0.01rem solid #E6E6E6;
                        color: #999999;
                        font-size: 0.12rem;
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

            .project-explain {
                box-shadow: 0 0 0.05rem 0.01rem #efefef;

                h3.process-explain {
                    font-size: 0.16rem;
                    color: #333;

                    .icon-xmdt-cysm {
                        font-size: 0.24rem;
                        margin-right: 0.06rem;
                    }
                }

                .explain-item {
                    margin-bottom: 0.25rem;

                    p {
                        font-size: 0.14rem;
                        color: #333;
                        margin-bottom: 0.06em;
                    }

                    a {
                        font-size: 0.13rem;
                        color: #3458DD;
                        text-decoration: none;
                    }

                    a:hover {
                        text-decoration: underline
                    }
                }

            }
        }

    }

}
</style>