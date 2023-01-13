<template>
  <div class="page">
    <div class="tabs">

      <ul class="tabs_ul">
        <li :class="tabIndex == 0 ? 'active' : ''" @click="tabIndex = 0; init(); switchTab(); ">用户分析</li>
        <li :class="tabIndex == 1 ? 'active' : ''" @click="tabIndex = 1; init(); switchTab();">项目分析</li>
      </ul>
    </div>
    <div>
      <!-- 用户分析 -->
      <div :class="!tabIndex ? 'disB' : 'disN'">
        <!-- 用户概况 -->
        <div class="concept">
          <h4 class="user-title">用户概况</h4>
          <div class="user-concept">
            <div class="regis_user">
              <div>
                <img src="../../../assets/images/board/board_zcyh.png" alt="" class="top_img">
              </div>
              <div class="user_number">
                <p class="platform_infor">注册用户<span>（单位:个）</span></p>
                <p class="relevant_number">{{ user_overview.user_count }}</p>
              </div>
              <div class="paltform_number">
                <p class="today_add">今日新增</p>
                <p class="add_number">+{{ user_overview.user_today_count }}</p>
              </div>
            </div>
            <div class="auth_user">
              <div>
                <img src="../../../assets/images/board/board_rzyh.png" alt="" class="top_img">
              </div>
              <div class="user_number">
                <p class="platform_infor">认证用户<span>（单位:个）</span></p>
                <p class="relevant_number">{{ user_overview.user_certification_count }}</p>
              </div>
              <div class="paltform_number">
                <p class="today_add">今日新增</p>
                <p class="add_number">+{{ user_overview.user_today_certification_count }}</p>
              </div>
            </div>
            <div class="auth_team">
              <div>
                <img src="../../../assets/images/board/board_rztd.png" alt="" class="top_img">
              </div>
              <div class="user_number">
                <p class="platform_infor">认证团队<span>（单位:个）</span></p>
                <p class="relevant_number">{{ user_overview.team_certification_count }}</p>
              </div>
              <div class="paltform_number">
                <p class="today_add">今日新增</p>
                <p class="add_number">+{{ user_overview.teams_today_certification_count }}</p>
              </div>

            </div>
          </div>
        </div>
        <!-- 用户增长趋势 -->
        <div class="growth_trend">
          <div class="filter_fields">
            <el-button type="primary" :class="form.user_increase_select_day == 1 ? 'active' : ''"
              @click="getinCreaseInfo(1)">今日</el-button>
            <el-button type="primary" :class="form.user_increase_select_day == 7 ? 'active' : ''"
              @click="getinCreaseInfo(7)">近七日</el-button>
            <el-button type="primary" class="mr2" :class="form.user_increase_select_day == 30 ? 'active' : ''"
              @click="getinCreaseInfo(30)">近30天</el-button>
            <el-date-picker class="time_sx" v-model="timeRange" type="daterange" range-separator="至"
              @change="getTimeRange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>

          </div>
          <div class="cavasbox" ref="growthEchart" :style="{}"></div>
        </div>
        <div class="flex-box mb2">
          <!-- 个人团队 -->
          <div class="user_ranking">
            <div class="flex-box">
              <h4 class="flex1 rank_name">个人/团队 TOP5</h4>
              <div class="switch_btns">
                <el-button plain :class="user_top_team_top == 0 ? 'active' : ''"
                  @click="user_top_team_top = 0; ">个人</el-button>
                <el-button plain :class="user_top_team_top == 1 ? 'active' : ''"
                  @click="user_top_team_top = 1; ">团队</el-button>
              </div>
            </div>
            <!-- v-if="user_or_team_top.length!=0" -->
            <div v-if="user_top_team_top == 0">
              <div v-if="user_top && user_top.length > 0">
                <div class="user-canvas">
                  <div class="ranking_head flex-box">
                    <p class="none"></p>
                    <p class="yh">用户</p>
                    <p class="dj">等级</p>
                    <p class="ljxm text-center">累计项目数（个）</p>
                    <p class="ljsj text-center">累计收益(元)</p>
                  </div>
                  <div class="ranking_cont flex-box" v-for="(v, i) in user_top " :key="i">
                    <p class="rank_img flex1">
                      <svg class="icon svg-icon" aria-hidden="true" v-if="v.rank == 1">
                        <use xlink:href="#icon-jp1"></use>
                      </svg>
                      <svg class="icon svg-icon" aria-hidden="true" v-else-if="v.rank == 2">
                        <use xlink:href="#icon-yp2"></use>
                      </svg>
                      <svg class="icon svg-icon" aria-hidden="true" v-else-if="v.rank == 3">
                        <use xlink:href="#icon-tp3"></use>
                      </svg>
                      <span v-else>{{ v.rank }}</span>
                    </p>
                    <div class="flex-start item-hd">
                      <p>
                        {{ v.stage_name }} <span v-if="v.name">（{{ v.name }}）</span>
                      </p>

                      <p>LV.{{ v.level }}</p>
                      <p class="text-center">{{ v.project_join_count }}</p>
                      <p class="color_FF9827 text-center">{{ v.total_in_money }}</p>
                    </div>
                  </div>
                </div>
                <div class="check_more text-center" v-if="user_top && user_top.length >= 5">
                  <el-button type="text" @click="userAnShow = true">更多>></el-button>
                </div>
              </div>
              <div class="text-center no-data" v-if="user_top.length == 0">
                <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png"
                  alt="">
                <p>暂无数据</p>
              </div>
            </div>
            <!--  -->
            <div v-if="user_top_team_top == 1">
              <div v-if="team_top && team_top.length > 0">
                <div class="user-canvas">
                  <div class="ranking_head flex-box">
                    <p class="none"></p>
                    <p class="yh">团队</p>
                    <p class="dj">等级</p>
                    <p class="ljxm text-center">累计项目数（个）</p>
                    <p class="ljsj text-center">累计收益(元)</p>
                  </div>
                  <div class="ranking_cont flex-box" v-for="(v, i) in team_top " :key="i">
                    <p class="rank_img flex1">
                      <svg class="icon svg-icon" aria-hidden="true" v-if="v.rank == 1">
                        <use xlink:href="#icon-jp1"></use>
                      </svg>
                      <svg class="icon svg-icon" aria-hidden="true" v-else-if="v.rank == 2">
                        <use xlink:href="#icon-yp2"></use>
                      </svg>
                      <svg class="icon svg-icon" aria-hidden="true" v-else-if="v.rank == 3">
                        <use xlink:href="#icon-tp3"></use>
                      </svg>
                      <span v-else>{{ v.rank }}</span>
                    </p>
                    <div class="flex-start item-hd">
                      <p>
                        {{ v.team_name }}
                      </p>
                      <p>LV.{{ v.level }}</p>
                      <p class="text-center">{{ v.project_join_count }}</p>
                      <p class="color_FF9827 text-center">{{ v.total_in_money }}</p>
                    </div>
                  </div>
                </div>
                <div class="check_more text-center" v-if="team_top && team_top.length >= 5">
                  <el-button type="text" @click="userAnShow = true">更多>></el-button>
                </div>
              </div>
              <div class="text-center no-data" v-if="team_top && team_top.length == 0">
                <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png"
                  alt="">
                <p>暂无数据</p>
              </div>
            </div>
            <!--  -->


          </div>
          <!-- 用户技能/职位占比 -->
          <div class="user_ranking ratio user_skill flex1">
            <div class="flex-box">
              <h4 class="flex1 rank_name">用户技能/职位占比TOP5</h4>
              <div class="switch_btns">
                <el-button plain :class="skill_job_Index == 0 ? 'active' : ''"
                  @click="skill_job_Index = 0; ">技能</el-button>
                <el-button plain :class="skill_job_Index == 1 ? 'active' : ''"
                  @click="skill_job_Index = 1; ">职位</el-button>
              </div>
            </div>
            <div v-if="skill_job_Index == 0">
              <div v-if="skill_info && skill_info.length > 0">
                <div class="user-canvas">
                  <div class="ranking_head flex-box skill_head">
                    <p>排序</p>
                    <p>技能名称</p>
                    <p class="yhs">用户数</p>
                    <p class="yhzb flex1">用户占比</p>
                  </div>
                  <div class="ranking_cont skill_cont flex-box" v-for="(v, i) in skill_info " :key="i">
                    <div class="flex-start item-hd skill-hd">
                      <p class="rank_img rank_sort">
                        <span>{{ v.rank }}</span>
                      </p>
                      <p>
                        {{ v.name }}
                      </p>
                      <p class="yhs">{{ v.value }}</p>
                      <p class="yhzb flex1">{{ v.percent }}%</p>
                    </div>
                  </div>
                </div>
                <div class="check_more text-center" v-if="skill_info && skill_info.length >= 5">
                  <el-button type="text" @click="skillJobShow = true">更多>></el-button>
                </div>
              </div>
              <div class="text-center no-data" v-if="skill_info.length == 0">
                <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png"
                  alt="">
                <p>暂无数据</p>
              </div>
            </div>
            <!--  -->
            <div v-if="skill_job_Index == 1">
              <div v-if="job_info && job_info.length > 0">
                <div class="user-canvas">
                  <div class="ranking_head flex-box skill_head">
                    <p>排序</p>
                    <p>职位名称</p>
                    <p class="yhs">用户数</p>
                    <p class="yhzb flex1">用户占比</p>
                  </div>
                  <div class="ranking_cont skill_cont flex-box" v-for="(v, i) in job_info " :key="i">
                    <div class="flex-start item-hd skill-hd">
                      <p class="rank_img rank_sort">
                        <span>{{ v.rank }}</span>
                      </p>
                      <p>
                        {{ v.name }}
                      </p>
                      <p class="yhs">{{ v.value }}</p>
                      <p class="yhzb flex1">{{ v.percent }}</p>
                    </div>
                  </div>
                </div>
                <div class="check_more text-center" v-if="job_info && job_info.length >= 5">
                  <el-button type="text" @click="skillJobShow = true">更多>></el-button>
                </div>
              </div>
              <div class="text-center no-data" v-if="job_info.length == 0">
                <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png"
                  alt="">
                <p>暂无数据</p>
              </div>
            </div>
            <!--  -->
          </div>
        </div>
        <div class="flex-box">
          <div class="distribution_map">
            <div ref="gradeEchart" class="canvas"></div>
          </div>
          <div class="region_map flex1">
            <div ref="regionEchart" class="canvas"></div>
          </div>
        </div>
      </div>
      <!-- 项目分析 -->
      <div :class="tabIndex ? 'disB' : 'disN'">
        <!-- 项目概况 -->
        <div class="pro-status">
          <h4 class="survey_title">项目概况</h4>
          <div class="flex-box">

            <div class="pro_total_num">
              <div class="pro_top flex-start">
                <p class=" flex1">
                  <img src="../../../assets/images/board/analy_1.png" alt="">
                  <span class="xmzs">项目总数</span><span class="xmdw">（单位:个）</span>
                </p>
                <p class="color_3458DD font20">{{ project_overview.project_count }}</p>
              </div>
              <div class="flex-start number_infor">
                <div class="flex-box ">
                  <div class="xm_title flex1">
                    <p>公域项目</p>
                    <p>{{ project_overview.project_public_count }}</p>
                  </div>
                  <div class="xm_mix text-center">
                    <p>占比</p>
                    <p>{{ project_overview.project_public_percent }}%</p>
                  </div>
                </div>
                <span class="br-line"></span>
                <div class="flex-box">
                  <div class="xm_title  flex1">
                    <p>私域项目</p>
                    <p>{{ project_overview.project_private_count }}</p>
                  </div>
                  <div class="xm_mix ">
                    <p style="padding-left:0.4rem;">占比</p>
                    <p style="padding-left:0.4rem;">{{ project_overview.project_private_percent }}%</p>
                  </div>
                </div>
              </div>

            </div>
            <div class="pro_total_num">
              <div class="pro_top flex-start">
                <p class=" flex1">
                  <img src="../../../assets/images/board/analy_2.png" alt="">
                  <span class="xmzs">项目总收益</span><span class="xmdw">（单位:元）</span>
                </p>
                <p class="color_FF9827 font20">{{ project_overview.in_money }}</p>
              </div>
              <div class="flex-start number_infor">
                <div class="flex-box ">
                  <div class="xm_title flex1">
                    <p>签订合同额</p>
                    <p>{{ project_overview.contract_money }}</p>
                  </div>
                </div>
                <span class="br-line"></span>
                <div class="flex-box">
                  <div class="xm_title  flex1" style=" padding-left: 1rem;">
                    <p>项目费用支出</p>
                    <p>{{ project_overview.out_money }}</p>
                  </div>
                </div>
              </div>

            </div>
            <div class="pro_total_num  contractor flex-box flex1">
              <div>
                <h4>承接方占比</h4>
                <div class="flex-start">
                  <div class="user-ratio">
                    <div class="ratio_head flex-box">
                      <p class="none" style="width:15%"></p>
                      <p>承接方</p>
                      <p>项目数</p>
                      <p>占比</p>
                    </div>
                    <div class="flex-box cjf" v-for="(v, i) in project_overview.bidding_type_info" :key="i">
                      <div class="desc_color" style="width:15%">
                        <p v-if="v.name == '个人'" class="default_color bgclor_3458DD"> </p>
                        <p v-if="v.name == '团队'" class="default_color bgclor_FF9827"> </p>
                        <p v-if="v.name == '其他'" class="default_color bgclor_FE6F6F"> </p>
                      </div>
                      <div class="flex-box item-ratio">
                        <p>{{ v.name }}</p>
                        <p>{{ v.value }}</p>
                        <p>{{ v.percent }}%</p>
                      </div>
                    </div>

                  </div>
                  <div class="contractor-mix ">
                    <div ref="contractorEchart" class="canvas"></div>
                  </div>
                </div>
              </div>
              <div>
              </div>
            </div>
          </div>

        </div>
        <!-- 项目状态统计 -->
        <div class="flex-box">
          <div class="ratio">
            <div class="flex-box">
              <h4 class="flex1 rank_name">项目状态统计</h4>
            </div>
            <div class="flex-start">
              <div class=" proStatusEchart">
                <div class="cavasbox" ref="proStatusEchart"></div>
              </div>
              <div class="user-ratio">
                <div class="ratio_head flex-box">
                  <p class="none"></p>
                  <p>技能</p>
                  <p>用户数</p>
                  <p>占比</p>
                </div>
                <div class="flex-box" style="margin-bottom:0.24rem;" v-for="(v, i) in proStatusInfo" :key="i">
                  <div class="desc_color" style="padding-left:0.2rem;margin-top: 0.05rem;">
                    <p v-if="v.name == '进行中'" class="default_color bgclor_3458DD"> </p>
                    <p v-else-if="v.name == '竞价中'" class="default_color bgclor_FF9827"> </p>
                    <p v-else-if="v.name == '未开始'" class="default_color bgclor_FFEC34"> </p>
                    <p v-else-if="v.name == '已终止'" class="default_color bgclor_40DDF9"> </p>
                    <p v-else-if="v.name == '筹备中'" class="default_color bgclor_00C1AB"> </p>
                    <p v-else-if="v.name == '已完结'" class="default_color bgclor_FE6F6F"> </p>
                    <p v-else-if="v.name == '已延期'" class="default_color bgclor_8BD868"> </p>
                  </div>
                  <div class="flex-box item-ratio">
                    <p>{{ v.name }}</p>
                    <p>{{ v.value }}</p>
                    <p>{{ v.percent }}%</p>
                  </div>
                </div>
              </div>
              <div>
              </div>
            </div>
          </div>
          <div class="plstAnaly flex1">
            <h4 class="title">项目平台分析</h4>
            <p class="sbu-title">项目数</p>
            <!-- 项目平台分析 -->
            <div ref="platAnalyEchart" class="canvas"></div>
          </div>
        </div>

        <div class="flex-box">
          <!--  -->
          <div class="typeAnaly">
            <h4 class="title">项目类型分析</h4>
            <p class="sbu-title">项目数</p>
            <div ref="typeAnalyEchart" class="canvas"></div>
          </div>
          <!--  -->
          <div class="user_ranking manage_ranking flex1">
            <div class="flex-box">
              <h4 class="flex1 rank_name">项目经理统计</h4>
            </div>
            <div v-if="managers_info && managers_info.length > 0">
              <div class="user-canvas">
                <div class="ranking_head flex-box">
                  <p>项目经理</p>
                  <p class="yh">累计项目数（个）</p>
                  <p class="dj">交付项目数（个）</p>
                  <p>合同金额（元）</p>
                  <p class="ljsj text-center w28">近半年跟进项目数（个）</p>
                </div>
                <div class="ranking_cont flex-box" v-for="(v, i) in managers_info" :key="i">
                  <div class="flex-box item-hd">
                    <p>{{ v.stage_name }}<span v-if="v.name">（{{ v.name }}）</span> </p>
                    <p>{{ v.total_project_count }}</p>
                    <p>{{ v.finish_project_count }}</p>
                    <p class="color_FF9827">{{ v.project_price }}</p>
                    <p class="text-center w28">{{ v.half_year_project_count }}</p>
                  </div>
                </div>
              </div>
              <div class="check_more text-center" v-if="managers_info.length >= 5">
                <el-button type="text" @click="teamAnShow = true">更多>></el-button>
              </div>
            </div>
            <!--  -->
            <div v-if="managers_info.length == 0" class="text-center no-data">
              <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png"
                alt="">
              <p>暂无数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <user-anlay @cancel="userAnShow = false" v-if="userAnShow"></user-anlay>
    <pro-anlay @cancel="teamAnShow = false" v-if="teamAnShow"></pro-anlay>
    <skill-job @cancel="skillJobShow=false" v-if="skillJobShow"></skill-job>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import china from 'echarts/map/json/china.json'


import { getData, postData } from "@/api/user";
import userAnlay from './component/user-anlay.vue';
import ProAnlay from './component/pro-anlay.vue';
import skillJob from './component/skill-job.vue';
export default {
  components: { userAnlay, ProAnlay, skillJob },
  name: "board",
  data() {
    return {
      tabIndex: 0,
      userData: [],
      proData: [],
      userAnShow: false,
      teamAnShow: false,
      skillJobShow: false,
      timeRange: '',
      user_overview: {},//用户概念
      project_overview: {}, //项目概况
      managers_info: {},//项目经理统计
      team_top: [],//团队top5
      user_top: [],//用户top5
      user_top_team_top: 0,
      skill_job_Index: 0,
      skill_info: [],
      job_info: [],
      ratioInfo: [],
      ratioJobInfo: [],
      proStatusInfo: [],
      form: {
        user_increase_select_day: 1, // 1 7 30 日期时间段
        user_increase_select_day_start: '',
        user_increase_select_day_end: ''
      },
      // 用户增长趋势
      growthOption: {
        title: {
          text: '用户增长趋势'
        },
        axisTick: {},
        tooltip: {
          trigger: 'axis',
          backgroundColor: "#fff",
          padding: [9, 10],
          borderColor: 'ccc',
          borderWidth: 1,
          textStyle: {
            fontSize: "14",
            color: '#999999',
            shadowColor: 'red',
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowBlur: 3
          },

        },
        legend: {
          data: ['团队', '个人'],
          left: '10%',
        },
        // 组件离容器左侧的距离
        grid: {
          left: '0%',
          right: '1%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          data: [],
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '团队',
            type: 'line',
            data: [],
            color: '#FF8D33'
          },
          {
            name: '个人',
            type: 'line',
            data: [],
            color: '#3458DD'
          },
        ]
      },


      // 等级分布
      gradeOption: {},

      // 承接方占比
      contractorEOption: {

      },
      regionOption: {},

      // 项目状态统计
      proStatusOption: {

      },
      // 项目平台分析
      platAnalyOption: {

      },
      // 项目类型分析
      typeAnalyOption: {

      }
    };
  },
  created() {
    this.switchTab()

  },
  mounted() {
    this.init()
  },
  updated() {
    // this.init()
  },
  methods: {
    getTimeRange(val) {
      this.form.user_increase_select_day = 0
      this.form.user_increase_select_day_start = val[0]
      this.form.user_increase_select_day_end = val[1]
      this.getGrowth()
    },
    switchTab() {
      if (this.tabIndex == 0) {
        // 用户分析
        this.getlist()

      } else {
        // 项目分析
        this.getProject()
      }
    },
    init() {
      if (this.tabIndex == 0) {
        this.getGrowth()
        // 用户技能/职位
        this.getRatio()
        // 等级分布
        this.getGrade()
      } else {
        // 承接方占比
        this.getContractor()

      }
    },
    // 用户分析
    getlist() {
      // this.listLoading = true
      var data = this.form
      getData({
        url: "/workbech/admin_workbench/project/data_board_user",
        data
      }).then((res) => {
        this.userData = res.data
        this.user_overview = res.data.user_overview;
        this.user_top = res.data.user_top; //个人 top5
        this.team_top = res.data.team_top; //团队 top5
        this.job_info = res.data.job_info
        this.skill_info = res.data.skill_info


        this.ratioInfo = res.data.skill_info
        this.ratioJobInfo = res.data.job_info
      });
    },
    // 用户增长趋势
    getinCreaseInfo(type) {
      this.form.user_increase_select_day = type
      this.timeRange = ''
      this.form.user_increase_select_day_start = ''
      this.form.user_increase_select_day_end = ''
      this.getGrowth()
    },
    // 项目分析
    getProject() {
      getData({
        url: "/workbech/admin_workbench/project/data_board_project",
      }).then((res) => {
        this.project_overview = res.data.project_overview;
        this.managers_info = res.data.managers_info
        this.proStatusInfo = res.data.project_status_info
      });
    },
    // 用户增长趋势
    getGrowth() {
      var growthEchart = echarts.init(this.$refs.growthEchart)
      var data = this.form
      getData({
        url: "/workbech/admin_workbench/project/data_board_user",
        data
      }).then((res) => {
        this.growthOption.xAxis.data = res.data.increase_info.xAxis
        // 团队
        this.growthOption.series[0].data = res.data.increase_info.team_data
        // 个人
        this.growthOption.series[1].data = res.data.increase_info.user_data
        growthEchart.setOption(this.growthOption)
      }).catch(res => {
        growthEchart.setOption(this.growthOption)
      })
    },

    // 用户技能/职位占比
    getRatio() {

    },
    // 等级分布
    getGrade() {
      var gradeEchart = echarts.init(this.$refs.gradeEchart)
      // 地图
      var regionEchart = echarts.init(this.$refs.regionEchart)
      var data = this.form
      getData({
        url: "/workbech/admin_workbench/project/data_board_user",
        data
      }).then((res) => {
        // 等级分布
        // this.gradeOption = {
        //   title: {
        //     text: '等级分布'
        //   },
        //   tooltip: {
        //     trigger: 'item',
        //     backgroundColor: "#fff",
        //   padding: [9, 10],
        //   borderColor: '#3458cc',
        //   borderWidth: 1,
        //   textStyle:{
        //     color:'#333333'
        //   }

        //   },
        //   legend: {
        //     data: ['团队', '个人'],
        //     top: '0',
        //     left: '120px',
        //     right: '0%',
        //     bottom: '0%',
        //   },
        //   grid: {
        //     left: '0%',
        //     right: '1%',
        //     bottom: '0%',
        //     containLabel: true
        //   },
        //   xAxis: {
        //     type: 'category',
        //     data: res.data.level_info.xAxis,
        //     axisTick: false, //坐标轴刻度相关设置。
        //   },
        //   yAxis: {
        //     type: 'value',
        //     axisTick: false, //坐标轴刻度相关设置。
        //     axisLine: {
        //       show: false//是否显示坐标轴轴线。
        //     }
        //   },
        //   color: ['#FF9827', '#3458DD'],
        //   series: [
        //     {
        //       barWidth: '27',
        //       barMaxWidth: '35',
        //       name: '团队',
        //       data: res.data.level_info.team_data,
        //       type: 'bar',
        //     },
        //     {
        //       barWidth: '27',
        //       barMaxWidth: '35',
        //       name: '个人',
        //       data: res.data.level_info.user_data,
        //       type: 'bar',
        //     }
        //   ]
        // }

     
        const option = {
          title: {
            text: '等级分布'
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: "#fff",
            padding: [9, 10],
            borderColor: '#3458cc',
            borderWidth: 1,
            textStyle: {
              color: '#333333'
            },
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                color: 'rgba(240, 246, 255, 0.5)',
                width: '1'
              }
            },
       
          },
          legend: {
            data: ['团队', '个人'],
            top: '0',
            left: '120px',
            right: '0%',
            bottom: '0%',
          },
          grid: {
            left: '0%',
            right: '1%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: res.data.level_info.xAxis,
            axisTick: false, //坐标轴刻度相关设置。
          },
          yAxis: {
            type: 'value',
            axisTick: false, //坐标轴刻度相关设置。
            axisLine: {
              show: false//是否显示坐标轴轴线。
            }
          },
          color: ['#FF9827', '#3458DD'],
          series: [
            {
              name: '团队',
              type: 'bar',
              barGap: 0,
              barWidth: '27',
              barMaxWidth: '35',
              data: res.data.level_info.team_data
            },
            {
              name: '个人',
              barWidth: '27',
              barMaxWidth: '35',
              type: 'bar',
              data: res.data.level_info.team_data
            },


          ]
        }
        gradeEchart.setOption(option)
        this.regionOption = {
          // 背景颜色
          // backgroundColor: "#fff",
          // 提示浮窗样式
          title: {
            text: '地域分布'
          },
          tooltip: {
            show: true,
            trigger: 'item', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
            axisPointer: {// 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            alwaysShowContent: false,
            backgroundColor: "#fff",
            padding: [9, 10],
            borderColor: "#3458DD",
            borderWidth: 1,
            triggerOn: "mousemove",
            enterable: true, //鼠标是否可进入提示框浮层中
            textStyle: {
              fontSize: "14",
              // overflow: "break",
              color: '#999999',
              // width:170,//注意 官方未生效！！！！！！！
              // height:70//注意 官方未生效！！！！！！！
            },
            formatter: function (params) {
              let str = '';
              str = ` <div class="hover_map">
            <p class="province">`+ params.name + `</p>
              <div class="flex-start"> <p>用户数:</p> <p>`+ params.value + `</p></div>
              <div class="flex-start"> <p>占比:</p> <p>`+ params.data.percent + `%</p></div>
          </div>`
              return str
            },
          },
          visualMap: { //分段型视觉映射组件
            show: true,
            type: 'continuous',
            // left: 50,
            showLabel: true,
            // itemWidth: 150,
            max: 5,
            min: 0,
            textGap: '10',
            splitNumber: 5,
            min: 0,
            max: 50, //控制根据返回值  控制数量
            inverse: true,
            indicatorStyle: {
              color: ['#EAF2FC', '#C5DCF8', '#90BCEF', '#5B9CE9', '#3185E3'],  //显示颜色
              borderCap: 'butt'
            },
            inRange: {
              color: ['#EAF2FC', '#C5DCF8', '#90BCEF', '#5B9CE9', '#3185E3']  //显示颜色
            },
            // range: [0, 50],

            pieces: [
              // { min: 300 }, // 不指定 max，表示 max 为无限大（Infinity）。
              // { min: 200, max: 300 },
              // { min: 10, max: 200, label: '10 到 200（自定义label）' },
              // { value: 123, label: '123（自定义特殊颜色）', color: 'grey' }, // 表示 value 等于 123 的情况。
              // { max: 5 }

            ]
          },

          // 地图配置
          geo: {
            map: "china",
            aspectScale: 0.8, //长宽比,0.75的含义为宽是高的0.75,假如高为100,宽就只有75;0.5的含义就是宽只有高的一半,假如高为100,宽就只有50
            zoom: 1.2, //视觉比例大小,1.2即为原有大小的1.2倍
            roam: false, //是否开启鼠标缩放和平移漫游。默认不开启。可以不用设置,如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。
            top: '10%',
            label: {
              // 通常状态下的样式
              // normal: {
              //   show: true,
              //   textStyle: {
              //     color: "#fff",
              //   },
              // },
              // 鼠标放上去的样式
              // emphasis: {
              //   textStyle: {
              //     color: "#fff",
              //   },
              // },
            },
            // 地图区域的样式设置
            itemStyle: {
              normal: {
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderWidth: 1,
              },
              // 鼠标放上去高亮的样式
              emphasis: {
                // areaColor: "rgba(0, 0, 0, 0.1)",
                borderWidth: 0,
              },
            },
          },
          series: [
            {
              selectedMode: false, //取消地图区域点击事件
              geoIndex: 0,  //将数据和第0个geo配置关联在一起
              type: 'map',
              data: res.data.area_info
            },
          ],
        };
        // 地图注册，第一个参数的名字必须和option.geo.map一致
        echarts.registerMap("china", china)
        console.log(this.regionOption);
        regionEchart.setOption(this.regionOption);
        regionEchart.on("mouseover", function () { //取消鼠标移入地图区域高亮
          regionEchart.dispatchAction({
            type: 'legendUnSelect'
          });
        });

      });

    },


    // 承接方占比
    getContractor() {
      // 承接方占比
      var contractorEchart = echarts.init(this.$refs.contractorEchart)
      // 项目状态统计
      var proStatusEchart = echarts.init(this.$refs.proStatusEchart)
      // 项目平台分析
      var platAnalyEchart = echarts.init(this.$refs.platAnalyEchart)
      // 项目类型分析
      var typeAnalyEchart = echarts.init(this.$refs.typeAnalyEchart)


      getData({
        url: "/workbech/admin_workbench/project/data_board_project",
      }).then((res) => {
        this.contractorEOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center',
            show: false,
            data: ['Search Engine', 'Search Engine']
          },
          label: {
            position: 'outside'
          },
          // 环形图
          color: ['#3458DD', '#FF9827', '#FE6F6F'],
          series: [
            {
              name: '承接方占比',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                position: 'outer',
                alignTo: 'none',
                bleedMargin: 0
              },
              left: 0,
              right: '0%',
              top: 0,
              bottom: 0,
              data: res.data.project_overview.bidding_type_info,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        contractorEchart.setOption(this.contractorEOption)

        this.proStatusOption = {
          tooltip: {
            trigger: 'item',
            backgroundColor: "#fff",
            padding: [9, 10],
            borderColor: '#3458cc',
            borderWidth: 1,
            textStyle: {
              color: '#333333'
            },
            formatter: function (params) {
              let str = '';

              str = ` <div > <div>` + params.data.percent + '%' + `</div>` + params.name + params.data.value + `</div>`
              return str
            },

          },
          legend: {
            orient: 'vertical',
            left: 'left',
            show: false
          },
          color: ['#3458DD', '#FF9827', '#FFEC34', '#40DDF9', '#00C1AB', '#FE6F6F', '#8BD868', '#8353C5', '#DD34D0', '#7782D8'],
          series: [
            {
              name: '项目状态统计',
              type: 'pie',
              radius: '50%',
              data: res.data.project_status_info,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        proStatusEchart.setOption(this.proStatusOption)
        this.platAnalyOption = {
          tooltip: {
            trigger: 'axis',
            backgroundColor: "#fff",
            padding: [9, 10],
            borderColor: '#ccc',
            borderWidth: 1,
            textStyle: {
              color: '#333333'
            },
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                color: 'rgba(240, 246, 255, 0.5)',
                width: '1'
              }
            }
          },
          grid: {
            top: "10%",
            left: '0%',
            right: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: res.data.project_platform_info.xAxis,
            axisTick: {
              show: false,//坐标轴刻度相关设置。
            },
            // boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false,//坐标轴刻度相关设置。
            },
            axisLine: {
              show: false//是否显示坐标轴轴线。
            }
          },
          color: ['#3458DD'],
          series: [
            {
              data: res.data.project_platform_info.data,
              type: 'bar',
              barGap: '70%',
              barWidth: '27',
              barMaxWidth: '35',
            },
          ]
        }
        platAnalyEchart.setOption(this.platAnalyOption)
        this.typeAnalyOption = {
          tooltip: {
            trigger: 'axis',
            backgroundColor: "#fff",
            padding: [9, 10],
            borderColor: '#ccc',
            borderWidth: 1,
            textStyle: {
              color: '#333333'
            },
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                color: 'rgba(240, 246, 255, 0.5)',
                width: '1'
              }
            }
          },
          title: {
            // text: '项目类型分析',
            // subtext: '项目数',
          },
          grid: {
            top: "10%",
            left: '0%',
            right: '1%',
            bottom: '0%',
            containLabel: true
          },

          xAxis: {
            type: 'category',
            data: res.data.project_type_info.xAxis,
            axisTick: {
              show: false,//坐标轴刻度相关设置。
            },
            // boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false //坐标轴刻度相关设置。
            }
          },
          color: ['#9FC0FF'],
          series: [
            {
              data: res.data.project_type_info.data,
              type: 'bar',
              barWidth: '27',
              barMaxWidth: '35',
            },
          ]
        }
        typeAnalyEchart.setOption(this.typeAnalyOption)

      });

    },
  },
};
</script>

<style lang="less" scoped>
.page {
  min-height: 82vh;
  margin-bottom: 0.5rem;
  //   .hover_map{
  //     width: 1.71rem!important;
  //     background: #fff!important;
  // border-radius: 0.04rem;
  //     border: 1px solid #3458DD;
  //     padding: 0.09rem 0.19rem;
  //     .province{
  //       color: #333;
  //       font-size: 0.18rem;
  //       margin-bottom: 0.04rem;
  //     }
  //     div{
  //       margin-bottom: 0.14rem;
  //       p:nth-of-type(1){
  //         color: #999999;
  //         font-size: 0.14rem;

  //       }
  //       p:nth-of-type(2){
  //         color: #333333;
  //         font-size: 0.16rem;
  //       }
  //     }
  //   }
  .cjf {
    p {
      font-size: 0.12rem !important;
    }
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box !important;
  }

  .no-data {
    padding-top: 0.5rem;

    img {
      width: 2rem;
    }
  }

  .disB {
    display: block !important;
  }

  .disN {
    display: none !important;
  }

  .font20 {
    font-size: 0.2rem;
  }

  .bgclor_3458DD {
    background: #3458DD !important;
  }

  .bgclor_FF9827 {
    background: #FF9827 !important;
  }

  .bgclor_FFEC34 {
    background: #FFEC34 !important;
  }

  .bgclor_40DDF9 {
    background: #40DDF9 !important;
  }

  .bgclor_00C1AB {
    background: #00C1AB !important;
  }

  .bgclor_FE6F6F {
    background: #FE6F6F !important;
  }

  .bgclor_8BD868 {
    background: #8BD868 !important;
  }

  .bgclor_8353C5 {
    background: #8353C5 !important;
  }

  .bgclor_DD34D0 {
    background: #DD34D0 !important;
  }

  .bgclor_7782D8 {
    background: #7782D8 !important;
  }


  .plstAnaly {
    width: 8.25rem;
    height: 4.52rem;
    background: #FFFFFF;
    box-shadow: 0 0 0.05rem 0.01rem #efefef;
    padding: 0.28rem 0.31rem 0.31rem 0.3rem;

    .title {
      color: #333333;
      font-size: 0.16rem;
      font-weight: 600;
      margin-bottom: 0.15rem;
    }

    .sbu-title {
      color: #333333;
      font-size: 0.14rem;
    }

    .canvas {
      width: 7.64rem;
      height: 3.93rem;

      /deep/canvas {
        width: 7.64rem !important;
        height: 3.93rem !important;
      }

    }
  }

  .typeAnaly {
    width: 8.25rem;
    height: 4.52rem;
    background: #FFFFFF;
    box-shadow: 0 0 0.05rem 0.01rem #efefef;
    margin-right: 0.2rem;
    padding: 0.28rem 0.31rem 0.31rem 0.3rem;

    .title {
      color: #333333;
      font-size: 0.16rem;
      font-weight: 600;
      margin-bottom: 0.15rem;
    }

    .sbu-title {
      color: #333333;
      font-size: 0.14rem;
    }

    .canvas {
      width: 7.64rem;
      height: 3.4rem;

      /deep/canvas {
        width: 7.64rem !important;
        height: 3.4rem !important;
      }

    }

  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .tabs {
    width: 100%;
    height: 0.6rem;
    background: #fff;
    border-bottom: 1px solid #EBEBEB;
    font-size: 0.16rem;
    font-weight: 400;
    line-height: 0.6rem;
    color: #666666;
    padding-left: 0.34rem;
    margin-bottom: 0.2rem;

    .tabs_ul {
      display: flex;

      li {
        margin-right: 0.6rem;
        color: #666666;
        position: relative;
        cursor: pointer;
      }

      li.active {
        color: #3458DD;
        font-weight: 600;
      }

      li.active::before {
        position: absolute;
        top: 0.55rem;
        content: '';
        width: 100%;
        height: 0.04rem;
        background: #2141B4;
        border-radius: 0.04rem;
      }

    }

  }

  .concept {
    background: #fff;
    padding: 0.28rem 0.31rem 0.31rem 0.3rem;
    margin-bottom: 0.2rem;

    .user-title {
      font-size: 0.16rem;
      color: #333;
      margin-bottom: 0.26rem;
    }

    .user-concept {
      display: flex;
      justify-content: space-between;

      .regis_user,
      .auth_user,
      .auth_team {
        width: 7.23rem;
        height: 1.16rem;
        padding: 0.3rem 0.28rem 0.36rem 0.3rem;
        box-shadow: 0 0 0.05rem 0.01rem #efefef;
        display: flex;
        align-items: flex-start;
        margin-right: 0.2rem;
      }

      .regis_user {
        background: url('../../../assets/images/board/board_ban1.png');
        background-size: cover;
        background-position: center;

      }

      .auth_user {
        background: url('../../../assets/images/board/board_ban2.png');
        background-size: cover;
        background-position: center;

      }

      .auth_team {
        background: url('../../../assets/images/board/board_ban3.png');
        background-size: cover;
        background-position: center;
        margin-right: 0;

      }

      .top_img {
        width: 0.5rem;
        height: 0.5rem;
        object-fit: cover;
        margin-right: 0.09rem;
      }

      .user_number {
        flex: 1;

        .platform_infor {
          font-size: 0.15rem;
          color: #333;
          margin-bottom: 0.04rem;

          span {
            font-size: 0.12rem;
            color: #666;
          }
        }

        .relevant_number {
          color: #333;
          font-size: 0.2rem;
        }

      }

      .paltform_number {
        .today_add {
          font-size: 0.15rem;
          color: #666666;
          margin-bottom: 0.04rem;
        }

        .add_number {
          font-size: 0.16rem;
          color: #E30000;

        }
      }
    }

  }

  .growth_trend {
    width: 100%;
    height: 4.19rem;
    margin-bottom: 0.2rem;
    padding: 0.29rem 0.3rem 0.32rem 0.3rem;
    background: #fff;
    position: relative;

    .filter_fields {
      position: absolute;
      right: 0.7rem;
      z-index: 99;

      .el-button {
        padding: 0.08rem 0.15rem !important;
        border: 1px solid #E2E6EA !important;
        color: #666666;
        font-size: 0.15rem;
        background: #FAFAFA !important;
        border-radius: 0.18rem;
      }

      .el-button.active {
        background: #3458DD !important;
        border: 1px solid #3458DD !important;
        color: #fff;
      }
    }

    .time_sx {
      margin-left: 0.18rem;
      border-radius: 0.18rem;

      /deep/.el-range-separator {
        width: 7%;
        color: #9EA7B4;
      }

    }

    .cavasbox {
      box-sizing: border-box;
      width: 16rem;
      height: 3.2rem;
      max-width: 16rem;
      max-height: 3.2rem;

      /deep/canvas {
        width: 16rem !important;
        height: 3.2rem !important;
      }
    }

  }

  .user_ranking {
    width: 8.25rem;
    height: 4.52rem;
    background: #fff;
    opacity: 1;
    box-shadow: 0 0 0.05rem 0.01rem #efefef;
    padding: 0.29rem 0.3rem 0.32rem 0.3rem;
    margin-right: 0.18rem;

    .rank_name {
      font-size: 0.16rem;
      color: #333333;
    }

    .switch_btns {
      margin-bottom: 0.25rem;

      .el-button {
        width: 0.6rem;
        height: 0.36rem;
        background: #FAFAFA;
        border: 1px solid #E2E6EA !important;
        border-radius: 0.18rem;
        padding: 0;
        font-size: 0.15rem;
        color: #666666;
        border: none;
      }

      .el-button.active {
        background: #3458DD;
        border: 1px solid #3458DD !important;
        color: #FFFFFF;
      }
    }

    .user-canvas {
      width: 100%;
      margin-bottom: 0.21rem;

      .skill_head,
      .skill_cont {
        p {
          width: 25% !important;
          padding-left: 0.36rem;
        }
      }

      .yhs {
        padding-left: 0.7rem !important;
      }

      .yhzb {
        padding-left: 0.8rem !important;
      }

      .ranking_head {
        width: 100%;
        font-size: 0.14rem;
        color: #999999;
        margin-bottom: 0.03rem;

        p {
          width: 23.1%;
        }

        .none {
          width: 0.58rem;
        }


      }

      .ranking_cont {
        line-height: 0.47rem;


        .rank_img {
          width: 0.28rem;
          height: 0.47rem;
          text-align: left;

          svg {
            width: 0.21rem;
            height: 0.25rem;
          }

          span {
            display: inline-block;
            width: 0.21rem;
            height: 0.21rem;
            background: #3458cc;
            border-radius: 50%;
            text-align: center;
            color: #fff;
            line-height: 0.21rem;
          }

        }

        .skill-hd {
          width: 100% !important;
        }

        .item-hd {
          width: calc(100% - 0.58rem);
          height: 0.47rem;
          border-bottom: 1px solid #E6E6E6;

          p {
            font-size: 0.15rem;
            color: #333333;
            width: 25%;
          }

          .color_FF9827 {
            color: #FF9827;
          }
        }

      }

    }

    .check_more {
      font-size: 0.14rem;

      .el-button--text {
        color: #999999;
      }
    }
  }

  .manage_ranking {
    margin-right: 0;

    .rank_name {
      margin-bottom: 0.29rem;
    }

    .item-hd {
      width: 100% !important;
    }

    p {
      width: 19% !important;
    }

    p.w28 {
      width: 23% !important;
    }

    .ranking_cont {
      width: 100%;
      height: 0.56rem;
      line-height: 0.56rem;

    }
  }

  .user_skill {
    margin-right: 0 !important;

    .ratioEchart {
      margin-right: 1rem;
    }

  }

  .ratio {
    width: 8.25rem;
    height: 4.52rem;
    padding: 0.29rem 0.3rem 0.38rem 0.32rem;
    font-size: 0.16rem;
    color: #333333;
    background: #fff;
    margin-right: 0.2rem;
    margin-bottom: 0.2rem;

    .proStatusEchart {
      width: 4.4rem;
      height: 3.4rem;
    }


    .cavasbox {
      width: 4rem;
      height: 4rem;
    }

    .rank_name {
      font-size: 0.16rem;
      color: #333333;

    }

    .switch_btns {
      margin-bottom: 0.25rem;

      .el-button {
        width: 0.6rem;
        height: 0.36rem;
        background: #FAFAFA;
        border-radius: 0.18rem;
        border: 1px solid #E2E6EA !important;
        padding: 0;
        font-size: 0.15rem;
        color: #666666;
        border: none;

      }

      .el-button.active {
        background: #3458DD;
        border: 1px solid #3458DD !important;
        color: #FFFFFF;
      }

    }

    .user-ratio {
      flex: 1;

      .ratio_head {
        color: #999;
        font-size: 0.14rem;
        margin-bottom: 0.09rem;

        p {
          width: 24%;
        }
      }

      .desc_color {
        width: 23%;
        text-align: center;
      }

      .default_color {
        width: 0.24rem;
        height: 0.16rem;
        background: #3458DD;
        border-radius: 0.04rem;

      }

      .item-ratio {
        width: 75%;
        margin-bottom: 0.08rem;

        p {
          width: 20%;
          margin-right: 13%;
          color: #333333;
          font-size: 0.15rem;
        }

      }

    }


  }

  .distribution_map {

    background: #fff;
    margin-right: 0.2rem;
    width: 8.25rem;
    height: 4.19rem;
    padding: 0.29rem 0.3rem 0.38rem 0.32rem;

    .canvas {
      // border:1px solid red;
      width: 7.61rem;
      height: 3.5rem;

      /deep/canvas {
        width: 7.61rem !important;
        height: 3.5rem !important;
      }
    }
  }

  .region_map {

    background: #fff;

    .canvas {
      width: 8.25rem;
      height: 4.19rem;
      padding: 0.29rem 0.3rem 0.38rem 0.32rem;

      /deep/canvas {
        padding: 0.29rem 0.3rem 0.38rem 0.32rem !important;
        width: 8.25rem !important;
        height: 4.19rem !important;
      }
    }
  }

  .pro-status {
    background: #fff;
    padding: 0.28rem 0.3rem 0.5rem 0.3rem;
    box-sizing: border-box;
    margin-bottom: 0.2rem;

    .survey_title {
      font-size: 0.16rem;
      font-family: PingFang SC;
      font-weight: 600;
      color: #333333;
      margin-bottom: 0.25rem;

    }

    .pro_total_num {
      width: 4.94rem;
      height: 1.81rem;
      background: #FFFFFF;
      box-shadow: 0 0 0.05rem 0.01rem #efefef;
      opacity: 1;
      border-radius: 0.08rem;
      padding: 0.31rem 0.3rem 0.3rem 0.3rem;
      margin-right: 0.2rem;

      .pro_top {
        padding-bottom: 0.2rem;
        border-bottom: 1px solid #E5E5E5;

        img {
          width: 0.27rem;
          height: 0.26rem;
          margin-right: 0.11rem;
          vertical-align: middle;
        }

        .xmzs {
          font-size: 0.15rem;
          color: #333;
        }

        .xmdw {
          font-size: 0.12rem;
          color: #666;
        }
      }

      .number_infor {
        width: 100%;
        padding-top: 0.2rem;

        .flex-box {
          width: 45%;
        }

        .br-line {
          display: inline-block;
          width: 0.01rem;
          height: 0.5rem;
          background-color: #E5E5E5;
          margin-right: 0.2rem;
        }

        .xm_title {
          p:nth-of-type(1) {
            color: #333333;
            font-size: 0.15rem;
            margin-bottom: 0.04rem;
            font-weight: 600;
          }

          p:nth-of-type(2) {
            color: #333333;
            font-size: 0.2rem;
          }

        }

        .xm_mix {
          flex: 1;

          p:nth-of-type(1) {
            color: #666666;
            font-size: 0.12rem;
            margin-bottom: 0.1rem;
            font-weight: 600;
          }

          p:nth-of-type(2) {
            color: #333333;
            font-size: 0.15rem;
          }

        }

      }

    }

    .contractor {
      width: 5.82rem;
      margin-right: 0;
      position: relative;

      h4 {
        color: #333;
        font-size: 0.16rem;
        margin-bottom: 0.18rem;
      }

      .user-ratio {
        width: 2.5rem;

        .ratio_head {
          color: #999;
          font-size: 0.14rem;
          margin-bottom: 0.12rem;

          p {
            width: 25%;
            // padding-left: 0.15rem;
          }
        }

        .desc_color {
          width: 25%;
          text-align: center;
        }

        .default_color {
          width: 0.24rem;
          height: 0.16rem;
          background: #3458DD;
          border-radius: 0.04rem;

        }

        .item-ratio {
          width: 75%;
          margin-bottom: 0.08rem;

          p {
            width: 33%;
            color: #333333;
            font-size: 0.15rem;
          }

        }

      }

      .contractor-mix {
        position: absolute;
        top: 0.2rem;
        right: 0.3rem;
        width: 2.5rem;
        height: 1.44rem;
        text-align: center;

        .canvas {
          width: 100%;
          height: 100%;
          width: 2.5rem;
          height: 1.44rem;

          /deep/canvas {
            width: 2.5rem !important;
            height: 1.44rem !important;
          }

        }
      }

    }

  }


}
</style>