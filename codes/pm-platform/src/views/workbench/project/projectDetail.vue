<template>
  <div class="pro-detail">
    <!-- 缴纳保证金 -->
    <el-dialog title="缴纳保证金" style="z-index:2020;" :visible.sync="bondDialogVisible" width="30%" :close-on-click-modal="false"
      :close-on-press-escape="false" v-if="!qrcodedialogVisible">
      <div>
        <div class="jnbond">
          <p>缴纳保证金：<span class="color_FC5531 w-600 font24">{{ detailData.info.margin }}</span> <span
              class="color_FC5531">元</span>
          </p>
        </div>
        <h4>支付方式</h4>
        <div class="flex-box pay-method">
          <div class="pay-type" @click="changePayType(0, 'alipay')" :class="payIndex == 0 ? 'active' : ''">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-E-zfb"></use>
            </svg>
            <span>支付宝支付</span>
          </div>
          <div class="pay-type" @click="changePayType(1, 'wechat')" :class="payIndex == 1 ? 'active' : ''">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-E-wxzf"></use>
            </svg>
            <span>微信支付</span>
          </div>
        </div>
      </div>
      <div>
        <div class="bond-tips">
          <p>1.缴纳的保证金在您参与相关项目期间将被冻结在账户，项目结束方可自由提取 <br />2.若报名项目未中标，项目报名结束/成员已经全部选完即为结束，此时保证金可提取</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bondDialogVisible = false" class="btn-pad18">取 消</el-button>
        <el-button type="primary" @click="confirmPay(detailData.project_user_join)" class="btn-pad18">提交
        </el-button>
      </span>
    </el-dialog>
    <el-dialog custom-class="modal_pay" :visible.sync="qrcodedialogVisible" title="微信支付" width="20%">
      <div class="dialog-content-wx">
        <div class="erweima_img">
          <div class="svg_box" v-html="qrcodeUrl"></div>
        </div>
        <p><img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/paywx.png" alt="" />微信支付</p>
        <!-- <p><img src="@/assets/images/paywx.png" alt="" />微信支付</p> -->
      </div>
    </el-dialog>
    <!-- project_user_join有值且保证金状态时未缴纳 需要支付保证金 -->
    <div
      v-if="currentUrl == 'user_workbench' && detailData.project_user_join && detailData.project_user_join.margin_status == '未缴纳'">
      <!-- <div class="cover" v-if="currentUrl=='user_workbench' && detailData.project_user_join == null && detailData.project_user_join.margin_status!='已缴纳'"> -->
      <div class="cover">
        <div class="list-left">
          <div class="project-title">
            <div class="flex-center pro-process-status">
              <h3>{{ detailData.info.name }}</h3>
              <!-- 进行中  -->
              <svg class="icon" aria-hidden="true" v-if="detailData.info.background_status == '进行中'">
                <use xlink:href="#icon-xmdt-jxz"></use>
              </svg>
              <!-- 验收中 -->
              <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '验收中'">
                <use xlink:href="#icon-xmdt-ysz"></use>
              </svg>
              <!-- 已终止 -->
              <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '已终止'">
                <use xlink:href="#icon-xmdt-yzz"></use>
              </svg>
              <!-- 未开始 -->
              <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '未开始'">
                <use xlink:href="#icon-xmdt-wks"></use>
              </svg>
              <!-- 筹备中  -->
              <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '筹备中'">
                <use xlink:href="#icon-xmdt-cbz"></use>
              </svg>
              <!-- 竞价中  -->
              <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '竞价中'">
                <use xlink:href="#icon-xmdt-jjz"></use>
              </svg>
              <!-- 已延期  -->
              <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '已延期'">
                <use xlink:href="#icon-xmdt-yyq"></use>
              </svg>
              <!-- 已完结  -->
              <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '已完结'">
                <use xlink:href="#icon-xmdt-ywj"></use>
              </svg>
            </div>
          </div>
          <div class="project-tag">
            <p class="project-desc">
              <span>类型：</span>{{ detailData.info.type }}
            </p>
            <p class="project-desc">
              <span>平台：</span>{{ detailData.info.platform }}
            </p>
            <p class="project-desc">
              <span>系统：</span>{{ detailData.info.system }}
            </p>
          </div>

          <div class="project-time">
            <p class="zq">周期：<span>{{ detailData.info.period }}{{ detailData.info.period_type }}</span></p>
            <p class="bail flex-box">保证金：<span class="price-unit">￥</span><span
                class="bail-price">{{ detailData.info.margin }}</span>
            </p>
            <p class="xm-manage">项目经理：<span
                v-if="detailData.info.manager_user">{{ detailData.info.manager_user.name }}</span></p>
          </div>
        </div>
        <!-- 保证金已缴纳 只有个人需要判断缴纳保证金  -->
        <div class="desc">
          <p>您还未缴纳保证金，无法参与到项目中，请尽快缴纳~</p>
          <el-button type="primary" @click="bondDialogVisible = !bondDialogVisible">去缴纳</el-button>
        </div>
      </div>
    </div>
    <div>
      <!-- project_user_join有值且保证金状态时未缴纳 需要支付保证金 -->
      <div class="wrap" v-loading="listLoading"
        :class="currentUrl == 'user_workbench' && detailData.project_user_join && detailData.project_user_join.margin_status == '未缴纳' ? 'on' : 'begin-c'">
        <!-- <div class="wrap on" v-loading="listLoading" > -->
        <!-- <el-button type="text" class="fh"><i class="iconfont icon-gzt-fh"></i> 返回</el-button> -->
        <section>
          <div class="content-top">
            <div class="xm-infor">
              <div class="list-left">
                <div class="project-title">
                  <div class="flex-center pro-process-status">
                    <h3>{{ detailData.info.name }}</h3>
                    <!-- 进行中  -->
                    <svg class="icon" aria-hidden="true" v-if="detailData.info.background_status == '进行中'">
                      <use xlink:href="#icon-xmdt-jxz"></use>
                    </svg>
                    <!-- 验收中 -->
                    <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '验收中'">
                      <use xlink:href="#icon-xmdt-ysz"></use>
                    </svg>
                    <!-- 已终止 -->
                    <el-tooltip class="item" effect="dark" :content="detailData.info.background_status_reason" placement="bottom-start"  v-else-if="detailData.info.background_status == '已终止'">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xmdt-yzz"></use>
                      </svg>
                    </el-tooltip>
                    <!-- 未开始 -->
                    <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '未开始'">
                      <use xlink:href="#icon-xmdt-wks"></use>
                    </svg>
                    <!-- 筹备中  -->
                    <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '筹备中' && (role_id == 1||role_id == 2)">
                      <use xlink:href="#icon-xmdt-cbz"></use>
                    </svg>
                    <!-- 竞价中  -->
                    <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '竞价中'  && (role_id == 1||role_id == 2)">
                      <use xlink:href="#icon-xmdt-jjz"></use>
                    </svg>
                    <!-- 已延期  -->
                    <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '已延期'">
                      <use xlink:href="#icon-xmdt-yyq"></use>
                    </svg>
                      <!-- 已完结  -->
                    <svg class="icon" aria-hidden="true" v-else-if="detailData.info.background_status == '已完结'">
                      <use xlink:href="#icon-xmdt-ywj"></use>
                    </svg>
                  </div>
                  <div class="xm-type" v-if="role_id == 1">
                    <el-dropdown
                      v-if="detailDataInfor.background_status != '已完结' && detailDataInfor.background_status != '已终止'">
                      <span class="el-dropdown-link">
                        <el-button type="primary" class="ys">...</el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown" v-if="detailDataInfor.background_status"
                        ref="changeProjectStatus">
                        <el-dropdown-item @click.native="beginPro(detailDataInfor.background_status)"
                          v-if="detailDataInfor.background_status == '未开始'">开始项目</el-dropdown-item>
                        <el-dropdown-item @click.native="acceptPro(detailDataInfor.background_status)"
                          v-if="detailDataInfor.background_status == '进行中' || detailDataInfor.background_status == '已延期'">
                          验收项目</el-dropdown-item>
                        <el-dropdown-item @click.native="endPro(detailDataInfor.background_status)"
                          v-if="detailDataInfor.background_status == '进行中' || detailDataInfor.background_status == '已延期' || detailDataInfor.background_status == '已验收'">
                          完结项目</el-dropdown-item>
                        <el-dropdown-item @click.native="stopDialogVisible = true"
                          v-if="detailDataInfor.background_status != '已完结' && detailDataInfor.background_status != '已终止'">
                          终止项目</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="project-tag">
                  <p class="project-desc">
                    <span>类型：</span>{{ detailData.info.type }}
                  </p>
                  <p class="project-desc">
                    <span>平台：</span>{{ detailData.info.platform }}
                  </p>
                  <p class="project-desc">
                    <span>系统：</span>{{ detailData.info.system }}
                  </p>
                </div>

                <div class="project-time">
                  <p class="zq">周期：<span>{{ detailData.info.period }}{{ detailData.info.period_type }}</span></p>
                  <p class="bail flex-box">保证金：<span class="price-unit">￥</span><span
                      class="bail-price">{{ detailData.info.margin }}</span>
                  </p>
                  <p class="xm-manage">项目经理：<span
                      v-if="detailData.info.manager_user">{{ detailData.info.manager_user.stage_name }}</span></p>
                   <!-- 1 项目 已完结 已终止
                      2 项目经理可以对 团队 个人评价
                      3 当承接方是团队是 只能对团队（负责人）评价  不可评价团队成员  
                      4 团队负责人也可评价项目经理
                      5 当承接方是个人时 项目经理可以评价所有参与项目成员
                      6 个人也可评价项目经理  detailDataInfor.bidding_type  
                      7 
                    -->

                  <!-- <p class="join" v-if="( projectBackStatus == '已终止' || projectBackStatus == '已完结') &&((role_id==2 &&  detailDataInfor.bidding_type=='团队' && detailData.manager_for_team_comment_exists !=true && detailDataInfor.team_join && detailDataInfor.team_join[0] && detailDataInfor.team_join[0].team.team_name)||(role_id==3&& detailData.team_for_manager_comment_exists!=true)||(role_id==4 && detailData.user_for_manager_comment_exists !=true) )" >项目已结束，快对参与本项目的团队 <el-button class="assess" type="text"
                      @click="evaluate(detailData.info)">进行评价</el-button>吧</p>
 -->


                      <div v-if="( projectBackStatus == '已终止' || projectBackStatus == '已完结')"  class="join">
                      <p v-if="(role_id==2 &&  detailDataInfor.bidding_type=='团队' && detailData.manager_for_team_comment_exists  !=true  && detailDataInfor.team_join && detailDataInfor.team_join[0] && detailDataInfor.team_join[0].team.team_name) " >项目已结束，快对参与本项目的团队 <el-button class="assess" type="text"
                      @click="evaluate(detailData.info)">进行评价</el-button>吧</p>

                      <p v-if="(role_id==3 && detailData.team_for_manager_comment_exists !=true)" >项目已结束，快对参与本项目的项目经理 <el-button class="assess" type="text"
                      @click="evaluate(detailData.info)">进行评价</el-button>吧</p>

                      <p v-if="(role_id==4 && detailData.user_for_manager_comment_exists  !=true)" >项目已结束，快对参与本项目的项目经理 <el-button class="assess" type="text"
                      @click="evaluate(detailData.info)">进行评价</el-button>吧</p>
                      </div>


                      

                      <!-- 'manager_for_team_comment_exists' => $manager_for_team_comment_exists, //项目经理对团队的评价是否已经存在
            'team_for_manager_comment_exists' => $team_for_manager_comment_exists, //团队对项目经理的评价是否已经存在
            'user_for_manager_comment_exists' => $user_for_manager_comment_exists //个人对项目经理的评价是否已经存在 -->

                </div>
              </div>
            </div>
            <!-- <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" style="border:1px solid red;">
              <div class="xm-process">
                <div class="process-bg">
                  <h3>项目进度</h3>
                  <ul class="d-ul" v-if="detailData.project_progress_detail">
                    <li>项目结束：<span class="color-333">还有<span
                          class="color-3458DD">{{ detailData.project_progress_detail.time_count_to_end }}</span>天</span>
                    </li>
                    <li>时间进度：<el-progress v-if="detailData.project_progress_detail"
                        :percentage="detailData.project_progress_detail.time_progress == '' ? 0 : Math.floor(detailData.project_progress_detail.time_progress)"
                        :color="[{ color: '#0268F9' }]"></el-progress>
                    </li>
                    <li>项目进度：<el-progress v-if="detailData.project_progress_detail"
                        :percentage="Math.floor(detailData.project_progress_detail.project_tasks_progress)"
                        :color="[{ color: '#E30000' }]"></el-progress>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col> -->
            <div class="xm-process">
              <div class="process-bg">
                <h3>项目进度</h3>
                <ul class="d-ul" v-if="detailData.project_progress_detail">
                  <li>项目结束：<span class="color-333">还有<span
                        class="color-3458DD">{{ detailData.project_progress_detail.time_count_to_end }}</span>天</span>
                  </li>
                  <li>时间进度：<el-progress v-if="detailData.project_progress_detail"
                      :percentage="detailData.project_progress_detail.time_progress == '' ? 0 : Math.floor(detailData.project_progress_detail.time_progress)"
                      :color="[{ color: '#0268F9' }]"></el-progress>
                  </li>
                  <li>项目进度：<el-progress v-if="detailData.project_progress_detail"
                      :percentage="Math.floor(detailData.project_progress_detail.project_tasks_progress)"
                      :color="[{ color: '#E30000' }]"></el-progress>
                  </li>
                </ul>
              </div>
            </div>
            <div class="xm-money">
              <div class="money-bg">
                <h3>项目费用</h3>
                <ul class="d-ul">
                  <li v-if="projShow">合同金额：<span class="color-FF980B"><span
                        class="font14">¥</span>{{ detailData.project_cost_detail.price || '0' }}</span></li>
                  <li v-if="role_id == 1">支付工程师费用：<span class="color-FF980B"><span
                        class="font14">¥</span>{{ detailData.project_cost_detail.advanced_price || '0'}}</span></li>
                  <li v-if="role_id == 1">已支付工程师费用：<span class="color-FF980B" v-if="detailData.project_cost_detail"><span
                        class="font14">¥</span>{{ detailData.project_cost_detail.has_pay_price || '0'}}</span></li>
                  <!-- 个人 -->
                  <li v-if="role_id == 4">项目收入：<span class="color-FF980B"
                      v-if="detailData.project_cost_detail_for_user"><span
                        class="font14">¥</span>{{ detailData.project_cost_detail_for_user.price || '0'}}</span></li>
                  <li v-if="role_id == 4">已结算费用：<span class="color-FF980B"
                      v-if="detailData.project_cost_detail_for_user"><span
                        class="font14">¥</span>{{ detailData.project_cost_detail_for_user.has_pay_price || '0'}}</span></li>
                  <li v-if="role_id == 4">剩余费用：<span class="color-FF980B"
                      v-if="detailData.project_cost_detail_for_user"><span
                        class="font14">¥</span>{{ detailData.project_cost_detail_for_user.advanced_price || '0'}}</span></li>
                  <!-- 团队 -->
                  <li v-if="role_id == 3">项目收益：<span class="color-FF980B"
                      v-if="detailData.project_cost_detail_for_team"><span
                        class="font14">¥</span>{{ detailData.project_cost_detail_for_team.price || '0'}}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="content-m">
            <!--  -->
            <ul class="module-box flex-box">
              <template>
                <div v-for="(item, index) in tabList" :key="index">
                  <li :class="tabIndex == index ? 'active' : ''" @click="checkPart(index)">{{ item.name }}</li>
                </div>
              </template>
            </ul>
            <div class="project-detail">
              <!-- 项目概况 -->
              <div class="project-overview" v-show="tabIndex == 0">
                <div class="flex-start mt">
                  <div class="xmxx">
                    <div class="flex-center overview-title">
                      <h3>项目信息</h3>
                      <el-button v-if="role_id == 1 && projectBackStatus != '已终止' && projectBackStatus != '已完结'"
                        @click="goEditPro(detailData)">编辑</el-button>
                    </div>
                    <p class="ty-sty xm-name" v-if="detailData.info">项目名称：<span>{{ detailData.info.name }}</span></p>
                    <div class="flex-box part-infor" v-if="detailData.info">
                      <p class="ty-sty">项目编号：<span>{{ detailData.info.number }}</span></p>
                      <p class="ty-sty">项目状态：<span>{{ detailData.info.background_status }}</span></p>
                      <p class="ty-sty">项目类型：<span>{{ detailData.info.type }}</span></p>
                      <p class="ty-sty">优先级别：<span>{{ detailData.info.priority_level }}</span></p>
                      <p class="ty-sty" v-if="projShow">
                        客户名称：<span v-if="detailData.info.customer">{{ detailData.info.customer.name }}</span></p>
                      <p class="ty-sty" v-if="projShow">
                        项目金额：<span v-if="detailData.info">{{ detailData.info.price }}元</span></p>

                      <p class="ty-sty" v-if="detailData.info.scope_type != '私域'">
                        报名时间：<span>{{ detailData.info.bidding_start_time }}</span></p>
                      <p class="ty-sty">项目周期：<span>{{ detailData.info.period }}{{ detailData.info.period_type }}</span></p>
                      <p class="ty-sty">项目经理：<span
                          v-if="detailData.info.manager_user">{{ detailData.info.manager_user.stage_name }}</span></p>
                         
                      <p class="ty-sty w100"><el-button type="text" class="check-wholepro"
                          @click="checkAllPro(detailData.info.desc)">查看完整项目>>
                        </el-button>
                      </p>
                    </div>
                  </div>
                  <div class="xmyj">
                    <h3>
                      <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                        <use xlink:href="#icon-gzt-xmyj"></use>
                      </svg>项目预警
                    </h3>
                    <ul class="early-warn "
                      :class="detailData.project_warning_detail && detailData.project_warning_detail.length != 2 ? 'flex-center' : 'flex-box'">
                      <div v-for="(item, index) in detailData.project_warning_detail" :key="index">
                        <li @click="changeWarnType(index)" :class="warnIndex == index ? 'active' : ''">
                          {{ item.type }}<span>{{ item.count }}</span></li>
                      </div>
                    </ul>
                    <!-- 预警 -->
                    <div class="part-warn">
                      <!-- <div class="align-center" v-if="detailData.project_warning_detail==null ||detailData.project_warning_detail.length==0">
                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png" alt="">
                        <p>暂无数据</p>
                    </div> -->
                      <div v-for="(item, index) in detailData.project_warning_detail" :key="index">
                        <div class="warn-item" v-if="warnIndex == index">
                          <div class="align-center no-data" v-if="item.data.length == 0">
                            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/nodata.png" alt="">
                            <p>暂无数据</p>
                          </div>
                          <div v-for="(val, i) in item.data" :key="i">
                            <div class="flex-box warn-xx">
                              <div class="warn-time">
                                <p>{{ val.created_at }}</p>
                              </div>
                              <div class="warn-line last" v-if="i == (item.data.length - 1)"></div>
                              <div class="warn-line" v-else></div>
                              <div class="warn-desc ">
                                <!-- <p class="com-line-1">“{{val.content.content_name}}”{{val.show_str}}<span class="warn-jz">{{(val.content.day==''|| val.content.day==null)?'0':val.content.day}}</span>天，请及时跟进</p> -->
                                <p class="com-line-1">{{ val.show_str }}</p>
                              </div>
                              <!-- <div class="warn-desc " v-if="item.type=='逾期提醒'">
                              <p class="com-line-1">“{{val.content.content_name}}”{{val.show_str}}<span class="warn-jz">{{(val.content.day==''|| val.content.day==null)?'0':val.content.day}}</span>天，请及时跟进</p>
                              <p class="com-line-1">{{val.show_str}}<span class="warn-jz">{{(val.content.day==''|| val.content.day==null)?'0':val.content.day}}</span></p>
                            </div>
                            <div class="warn-desc " v-if="item.type=='即将截止'">
                              <p class="com-line-1">“{{val.content.content_name}}”{{val.show_str}}<span class="warn-jz">{{(val.content.day==''|| val.content.day==null)?'0':val.content.day}}</span>天，请及时跟进</p>
                              <p class="com-line-1">{{val.show_str}}<span class="warn-jz">{{(val.content.day==''|| val.content.day==null)?'0':val.content.day}}</span></p>
                            </div>
                            <div class="warn-desc " v-if="item.type=='问题指派'">
                              <p class="com-line-1">“{{val.content.content_name}}”{{val.show_str}}<span class="warn-jz">{{(val.content.day==''|| val.content.day==null)?'0':val.content.day}}</span>天，请及时跟进</p>
                              <p class="com-line-1">{{val.show_str}}<span class="warn-jz">{{(val.content.day==''|| val.content.day==null)?'0':val.content.day}}</span></p>
                            </div> -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="task">
                  <div class="flex-center xmgk-title">
                    <h5>任务</h5>
                    <el-button type="primary" icon="el-icon-plus" @click="adTask"
                      v-if="(projShow || teamLeaderId==currentUserId ) && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">
                      新建</el-button>
                  </div>
                  <el-table :data="taskTableData.list" stripe border v-loading="tableListLoading"
                    element-loading-text="正在查询中..." class="tasktable" :row-class-name="tableRowClassName">
                    <el-table-column prop="desc" label="任务名称" class="rwmc" width="250">
                      <template slot-scope="scope">
                        <div class="color_1B4B84">
                          {{ scope.row.name }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="责任人" class="zzr" min-width="250">
                      <template slot-scope="scope">
                        <div class="color_1B4B84 ">
                          {{ scope.row.charge_user.stage_name }}
                          <span v-if="projShow && scope.row.charge_user.name">（{{ scope.row.charge_user.name }}）</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="start_time" label="起止时间" class="qzsj" width="250">
                      <template slot-scope="scope">
                        <div class="color_1B385C">
                          {{ scope.row.start_time }}至{{ scope.row.end_time }}
                        </div>
                      </template>
                    </el-table-column>
                    <!-- '未开始','进行中','已完成','已逾期','逾期完成' -->
                    <el-table-column prop="status" label="状态" class="zt-wks" width="250">
                      <template slot-scope="scope">
                        <ul class="ul-common">
                          <li v-if="scope.row.status == '已完成' || scope.row.status == '进行中'" class="color_0EB200">
                            {{ scope.row.status }}
                          </li>
                          <li v-else-if="scope.row.status == '逾期完成' || scope.row.status == '已逾期'" class="color_E30000">
                            {{ scope.row.status }}
                          </li>
                          <li v-else-if="scope.row.status == '未开始'" class="color_999">
                            {{ scope.row.status }}
                          </li>
                          <li v-else class="color_999">
                            {{ scope.row.status }}
                          </li>
                        </ul>
                      </template>
                    </el-table-column>
                    <el-table-column label="进度" class="jd" width="250">
                      <template slot-scope="scope">
                        <div v-if="scope.row">
                          <el-progress v-if="scope.row.status == '已完成'" :percentage="scope.row.progress"
                            :color="[{ color: '#0EB200' }]">
                          </el-progress>
                          <el-progress v-else-if="scope.row.status == '逾期完成'" :percentage="scope.row.progress"
                            :color="[{ color: '#E30000' }]">
                          </el-progress>
                          <el-progress v-else-if="scope.row.status == '未开始'" :percentage="scope.row.progress"
                            :color="[{ color: '#999' }]">
                          </el-progress>
                          <el-progress v-else :percentage="scope.row.progress" :color="[{ color: '#3458DD' }]">
                          </el-progress>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" class="zz" width="306">
                      <template slot-scope="scope">
                        <div>
                          <el-button type="text"
                            v-if="(projShow) && scope.row.is_delete != 1 && scope.row.status != '已完成' && scope.row.status != '逾期完成' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                            @click="editXmTask(scope.row)">编辑
                          </el-button>
                          <el-button type="text" @click="checkTask(scope.row)">查看</el-button>
                          <el-button type="text"
                            v-if="(projShow) && scope.row.is_delete != 1 && scope.row.status != '已完成' && scope.row.status != '逾期完成' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                            @click="deleteTask(scope.row.id)">删除
                          </el-button>
                          <!-- 责任人可改进度 charge_user_id -->
                          <el-button type="text"
                            v-if="(projShow || currentUserId == scope.row.charge_user_id) && scope.row.is_delete != 1 && scope.row.status != '已完成' && scope.row.status != '逾期完成' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                            @click="updateProcess(scope.row)">进度
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

              </div>
              <!-- 里程碑 -->
              <div class="milestone" v-show="tabIndex == 1">
                <section>
                  <div class="mark-card">
                    <h5 class="all-list-title">全部里程碑</h5>
                    <!--  -->
                    <div class="lcb-list" v-loading="tableListLoading" element-loading-text="正在查询中...">
                      <div class="align-center no-data" v-if="markerTableData == null || markerTableData.length == 0">
                        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/nodata.png" alt="">
                        <p>暂无数据</p>
                      </div>
                      <el-card shadow="hover" class="lcb-ts-item" v-for="(item, index) in markerTableData" :key="index">
                        <!-- <div class=" ts-head"  @mouseover="hoverLcb(index)" @mouseout="outLcb"  :class="item.milestones_withtrashed.length==0?'':'flex-center'"> -->
                        <div class="flex-center ts-head" @mouseover="hoverLcb(index)" @mouseout="outLcb">
                          <p class="task-desc-svg">
                            <span v-if="item.milestones_withtrashed.length != 0">
                              <!-- 收起 -->
                              <svg class="icon " aria-hidden="true"
                                @click="packUp(`table${item.id}`, index, 'block', `open${item.id}`, `close${item.id}`)"
                                :ref="'close' + item.id">
                                <use xlink:href="#icon-qj-sq2"></use>
                              </svg>
                              <!-- 放开 -->
                              <svg class="icon active" aria-hidden="true"
                                @click="packUp(`table${item.id}`, index, 'none', `open${item.id}`, `close${item.id}`)"
                                :ref="'open' + item.id">
                                <use xlink:href="#icon-qj-fk2"></use>
                              </svg>
                            </span>

                            <span class="w-600">{{ item.name }}:</span>
                          </p>
                          <p v-if="item.milestones_withtrashed.length == 0" style="width:5rem"></p>
                          <!-- <div class="flex-center" style="width:2rem;align-items: center;"  :class="item.milestones_withtrashed.length==0?'floatR':''"> -->
                          <div class="flex-center">
                            <h4 class="lcb-bumber"><span>{{ item.milestones_withtrashed.length }}</span>个里程碑</h4>
                            <!-- <el-button type="primary" class="list-btn-add" @click="addLcb"><i class="iconfont el-icon-plus"></i> 新建</el-button> -->
                            <!-- <el-button type="primary" :class="{'list-btn-add clickBg':0==clickIndex,'list-btn-add hoverBg':-1==hoverIndex}" -->

                            <el-button type="primary" :class="hoverIndex == index ? 'on' : ''" class="list-btn-add"
                              icon="el-icon-plus"
                              v-if="(projShow || currentUserId == item.charge_user_id ||  teamLeaderId==currentUserId ) && (item.is_delete !=1 &&projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                              @click="addLcb(item.id, item.name, item.start_time, item.end_time)">
                              <span>
                                新建
                              </span>
                            </el-button>
                          </div>
                        </div>
                        <div class="marker-table" v-if="item.milestones_withtrashed.length != 0" :ref="'table' + item.id">
                          <el-table :data="item.milestones_withtrashed" border stripe v-loading="tableListLoading"
                            :row-class-name="tableRowClassName" element-loading-text="正在查询中..." style="100%"
                            class="tasktable">
                            <el-table-column prop="name" label="里程碑名称">
                              <template slot-scope="scope">
                                <div class="color_1B385C com-line-1">
                                  {{ scope.row.name }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="priority_level" label="优先级">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  <el-button round class="yxj yxj-p1" v-if="scope.row.priority_level == 'P1'">
                                    {{ scope.row.priority_level }}</el-button>
                                  <el-button round class="yxj yxj-p2" v-else-if="scope.row.priority_level == 'P2'">
                                    {{ scope.row.priority_level }}</el-button>
                                  <el-button round class="yxj yxj-p3" v-else-if="scope.row.priority_level == 'P3'">
                                    {{ scope.row.priority_level }}</el-button>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="name" label="执行人">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  <span v-for="(item, index) in scope.row.charge_users" :key="index">
                                    {{ item.stage_name }} 
                                    <span v-if="item.name && projShow">（{{ item.name }}）</span>
                                  </span>

                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="end_time" label="截止时间">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.end_time }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="status" label="状态">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.status }}
                                </div>
                              </template>
                            </el-table-column>
                            <!-- 存在问题 err -->
                            <el-table-column prop="finish_time" label="完成时间">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.finish_time || '/' }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="address" label="操作">
                              <template slot-scope="scope">
                                <div>
                                  <el-button type="text" class="color_3458DD"
                                    v-if="(projShow) && scope.row.is_delete != 1 && scope.row.status != '已完成' && scope.row.status != '逾期完成' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                                    @click="editLcb(scope.row)">编辑</el-button>
                                  <el-button type="text" class="color_3458DD" @click="checkLcb(scope.row)">查看
                                  </el-button>
                                  <el-button type="text" class="color_3458DD"
                                    v-if="(projShow) && scope.row.is_delete != 1 && scope.row.status != '已完成' && scope.row.status != '逾期完成' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                                    @click="deleteLcb(scope.row)">删除</el-button>
                                  <!-- 执行人也可完成 charge_user_id-->
                                  <!-- <el-button type="text" class="color_3458DD" @click="finishLcb(scope.row)" v-for="(item,index) in scope.row.charge_users" :key="index">
                                  <span v-if="(role_id==1||role_id==2|| currentUserId==item.id)  && scope.row.is_delete!=1 && scope.row.status!='已完成' && scope.row.status!='逾期完成' &&  (projectBackStatus!='已终止'&& projectBackStatus!='已完结')">完成</span>
                                </el-button> -->
                            
                                  <el-button type="text" class="color_3458DD" @click="finishLcb(scope.row)"  v-if="((projShow   || judgeChargeusers(scope.row.charge_users)) &&( scope.row.is_delete != 1 && scope.row.status != '已完成' && scope.row.status != '逾期完成') && (projectBackStatus != '已终止' && projectBackStatus != '已完结'))">
                                     完成
                                  </el-button>
                                </div>

                              </template>

                            </el-table-column>
                            <!--  -->
                          </el-table>
                        </div>
                      </el-card>
                    </div>
                  </div>
                </section>

              </div>
              <!-- 问题 -->
              <div class="question" v-show="tabIndex == 2">
                <section>
                  <div class="mark-card">
                    <!--  -->
                    <div class="lcb-list min-h5">
                      <el-card shadow="hover" class="lcb-ts-item">
                        <div class="marker-table">
                          <div class="flex-center title-mb">
                            <h5 class="all-list-title">全部问题
                            </h5>
                            <el-button type="primary" icon="el-icon-plus" class="list-btn-add" @click="newQuestion"
                              v-if="projectBackStatus != '已终止' && projectBackStatus != '已完结'">
                              新建</el-button>
                          </div>
                          <div>
                            <el-table :data="questionTableData" border stripe style="100%" v-loading="tableListLoading"
                              :row-class-name="tableRowClassName" element-loading-text="正在查询中..." class="tasktable">
                              <el-table-column prop="desc" label="问题描述" width="194">
                                <template slot-scope="scope">
                                  <div class="color_1B385C  com-line-1">
                                    {{ scope.row.desc }}
                                  </div>
                                </template>
                                <span class="color_1B385C"></span>
                              </el-table-column>
                              <el-table-column prop="ask_user" label="提出人" min-width="194">
                                <template slot-scope="scope">
                                  <div class="color_1B385C" v-if="scope.row.ask_user">
                                    {{ scope.row.ask_user.stage_name }}
                                    <span v-if="projShow && scope.row.ask_user.name">（{{ scope.row.ask_user.name }}）</span>
                                    
                                  </div>
                                </template>

                              </el-table-column>
                              <el-table-column prop="degree_importance" label="严重程度" width="194">
                                <template slot-scope="scope">
                                  <div class="color_1B385C" v-if="scope.row.degree_importance">
                                    {{ scope.row.degree_importance || '/' }}级
                                  </div>
                                  <div v-else>/</div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="priority_level" label="优先级" width="194">
                                <template slot-scope="scope">
                                  <div class="color_1B385C">
                                    <el-button round class="yxj yxj-p1" v-if="scope.row.priority_level == 'P1'">
                                      {{ scope.row.priority_level }}</el-button>
                                    <el-button round class="yxj yxj-p2" v-else-if="scope.row.priority_level == 'P2'">
                                      {{ scope.row.priority_level }}</el-button>
                                    <el-button round class="yxj yxj-p3" v-else-if="scope.row.priority_level == 'P3'">
                                      {{ scope.row.priority_level }}</el-button>
                                    <span v-else> {{ scope.row.priority_level || '/' }}</span>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="charge_user" label="处理人" width="194">
                                <template slot-scope="scope">
                                  <div class="color_1B385C" v-if="scope.row.charge_user">
                                    {{ scope.row.charge_user.stage_name }}
                                    <span v-if="projShow && scope.row.charge_user.name">（{{ scope.row.charge_user.name }}）</span>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="created_at" label="提出时间" width="194">
                                <template slot-scope="scope">
                                  <div class="color_1B385C">
                                    {{ scope.row.created_at }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="status" label="当前状态" width="174">
                                <template slot-scope="scope">
                                  <div class="color_1B385C">
                                    {{ scope.row.status }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="address" label="操作" width="228">
                                <template slot-scope="scope">
                                  <div>
                                    <!-- 提出人可编辑删除 ask_user_id  处理人不可删除 -->
                                    <el-button type="text" class="color_3458DD" @click="checkQues(scope.row)">查看
                                    </el-button>
                                    <el-button type="text" class="color_3458DD"
                                      v-if="(projShow || currentUserId == scope.row.ask_user_id) && (scope.row.is_delete != 1 && scope.row.status != '已解决') && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                                      @click="EditQues(scope.row)">编辑</el-button>
                                    <!-- 处理人可以扭转问题  charge_user_id -->
                                    <el-button type="text" class="color_3458DD"   @click="TwistQues(scope.row)" v-if="(role_id==1 || role_id==2  || currentUserId==scope.row.charge_user_id) && (scope.row.is_delete != 1 && scope.row.status != '已解决') && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">扭转</el-button>
                                    <!-- 处理人才可解决 charge_user_id   提出人不可解决 -->
                                    <el-button type="text" class="color_3458DD"
                                      v-if="(projShow || currentUserId == scope.row.charge_user_id) && scope.row.is_delete != 1 && scope.row.status != '已解决' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                                      @click="SolveQuestion(scope.row)">解决
                                    </el-button>
                                    <el-button type="text" class="color_3458DD"
                                      v-if="(projShow ||currentUserId == scope.row.ask_user_id) && scope.row.is_delete != 1 && scope.row.status != '已解决' && (projectBackStatus != '已终止' && projectBackStatus != '已完结') "
                                      @click="deleteQues(scope.row)">删除</el-button> 
                                  </div>
                                  <!-- <div class="flex-box">
                                    提出人可编辑删除 ask_user_id  处理人不可删除·
                                    <el-button type="text" class="color_3458DD" @click="checkQues(scope.row)">查看
                                    </el-button>
                                    <div  v-if="(scope.row.is_delete != 1 && scope.row.status != '已解决') && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">
                                    <el-button type="text" class="color_3458DD"
                                      v-if="(projShow || currentUserId == scope.row.ask_user_id) "
                                      @click="EditQues(scope.row)">编辑</el-button>
                                    处理人可以扭转问题  charge_user_id
                                    <el-button type="text" @click="TwistQues" v-if="(role_id==1 || role_id==2  || currentUserId==scope.row.charge_user_id)">扭转</el-button>
                                    处理人才可解决 charge_user_id   提出人不可解决
                                    <el-button type="text" class="color_3458DD"
                                      v-if="(projShow || currentUserId == scope.row.charge_user_id) "
                                      @click="SolveQuestion(scope.row)">解决
                                    </el-button>
                                    <el-button type="text" class="color_3458DD"
                                      v-if="(projShow ||currentUserId == scope.row.ask_user_id) "
                                      @click="deleteQues(scope.row)">删除</el-button>
                                    </div>
                                  </div> -->
                                </template>
                              </el-table-column>
                            </el-table>
                            <div class="btm_box d-between">
                              <!-- 分页 -->
                              <!-- <div class="pagination_box">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                          :page-sizes="[15, 20, 50, 100]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
                          :total="total">
                        </el-pagination>
                      </div> -->
                              <!--  -->
                            </div>
                          </div>

                        </div>
                      </el-card>
                    </div>
                  </div>
                </section>
              </div>
              <!-- 会议 -->
              <!-- !!!!!!!!!会议和交付文件删除是删除掉数据 不是把样式置灰!!!!!!!!! -->
              <div class="meeting" v-show="tabIndex == 3">
                <section>
                  <div class="mark-card">
                    <!--  -->
                    <div class="lcb-list">
                      <el-card shadow="hover" class="lcb-ts-item">
                        <div class="marker-table">
                          <div class="flex-center title-mb">
                            <h5 class="all-list-title">全部会议
                            </h5>
                            <el-button type="primary" icon="el-icon-plus" class="list-btn-add" @click="AddMeet"
                              v-if="(projShow ||  teamLeaderId==currentUserId ) && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">
                              新建
                            </el-button>
                          </div>
                          <el-table :data="meetTableData.list" border stripe style="100%" v-loading="tableListLoading"
                            element-loading-text="正在查询中..." class="tasktable">
                            <el-table-column prop="theme" label="会议主题" width="388">
                              <template slot-scope="scope">
                                <div class="color_3458DD com-line-1">
                                  {{ scope.row.theme }}
                                </div>
                              </template>
                              <span class="color_1B385C"></span>
                            </el-table-column>
                            <el-table-column prop="join_user_stage_name" label="参会人员" min-width="388">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.join_user_stage_name }}
                                  <span v-for="(v,i) in meetTableData.users_for_select" :key="i" v-if="projShow && v.name">（{{v.name}}）</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="start_time" label="会议时间" width="388">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.start_time }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="address" label="操作" width="388">
                              <template slot-scope="scope">
                                <div>
                                  <el-button type="text" class="color_3458DD" @click="EditMeet(scope.row)"
                                    v-if="(projShow) && scope.row.is_delete != 1 && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">
                                    编辑</el-button>
                                  <el-button type="text" class="color_3458DD" @click="CheckMeet(scope.row)">查看
                                  </el-button>
                                  <el-button type="text" class="color_3458DD"
                                    v-if="(projShow) && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                                    @click="deleteMeet(scope.row)">删除</el-button>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </el-card>
                    </div>
                  </div>
                </section>
              </div>
              <!-- 交付文件 -->
              <div class="delivery" v-show="tabIndex == 4">
                <section>
                  <div class="mark-card">
                    <!--  -->
                    <div class="lcb-list">
                      <el-card shadow="hover" class="lcb-ts-item">
                        <div class="marker-table">
                          <div class="flex-center title-mb">
                            <h5 class="all-list-title">交付文件
                            </h5>
                            <el-button type="primary" icon="el-icon-plus" class="list-btn-add" @click="AddFile"
                              v-if="(projShow ||  teamLeaderId==currentUserId ) && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">
                              新建
                            </el-button>
                          </div>
                          <el-table :data="develiTableData.list" border stripe style="100%" v-loading="tableListLoading"
                            :row-class-name="tableRowClassName" element-loading-text="正在查询中..." class="tasktable">
                            <el-table-column prop="name" label="文档名称" min-width="258">
                              <template slot-scope="scope">
                                <div class="color_3458DD com-line-1">
                                  {{ scope.row.name }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="demand" label="文档要求" width="258">
                              <template slot-scope="scope">
                                <div class="color_1B385C com-line-1">
                                  {{ scope.row.demand }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="time" label="执行人" width="258">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.charge_user.stage_name }}
                                  <span v-for="(v,i) in develiTableData.users_for_select" :key="i" v-if="projShow && v.name">（{{v.name}}）</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="time" label="交付时间" width="258">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.time }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="status" label="状态" width="258">
                              <template slot-scope="scope">
                                <div>
                                  <span v-if="scope.row.status == '未提交'" class="color_999">
                                    {{ scope.row.status }}
                                  </span>
                                  <span v-else-if="scope.row.status == '已提交'" class="color_0EB200">
                                    <svg class="icon" aria-hidden="true">
                                      <use xlink:href="#icon-yhgl-yrz"></use>
                                    </svg>
                                    {{ scope.row.status }}
                                  </span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="address" label="操作" width="262">
                              <template slot-scope="scope">
                                <div>
                                  <!-- 只针对项目经理与管理员 -->
                                  <el-button type="text" class="color_3458DD" @click="editFile(scope.row)"
                                    v-if="(projShow) && scope.row.is_delete != 1 && scope.row.status != '已提交' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">
                                    编辑</el-button>
                                  <el-button type="text" class="color_3458DD" @click="checkFile(scope.row)">查看
                                  </el-button>
                                  <el-button type="text" class="color_3458DD"
                                    v-if="(projShow) && scope.row.status != '已提交' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                                    @click="deleteFile(scope.row)">删除</el-button>
                                  <!-- 提交只针对执行人 charge_user_id -->
                                  <el-button type="text" class="color_3458DD"
                                    v-if="(projShow || currentUserId == scope.row.charge_user_id) && scope.row.status != '已提交' && (projectBackStatus != '已终止' && projectBackStatus != '已完结')"
                                    @click="submitDoc(scope.row)">提交</el-button>
                                </div>
                              </template>

                            </el-table-column>
                          </el-table>
                        </div>
                      </el-card>
                    </div>
                  </div>
                </section>
              </div>
              <!-- 成员 -->
              <div class="member" v-show="tabIndex == 5">
                <section>
                  <div class="mark-card">
                    <!--  -->
                    <div class="lcb-list">
                      <el-card shadow="hover" class="lcb-ts-item">
                        <div class="marker-table">
                          <div class="flex-center member-type">
                            <ul>
                              <span v-if="projShow" class="flex-box">
                                <li :class="memberType == 0 ? 'active' : ''" @click="changeMemberType(0)">参与成员</li>
                                <li :class="memberType == 1 ? 'active' : ''" @click="changeMemberType(1)">报名成员</li>
                              </span>
                              <span v-else-if="role_id == 3 || role_id == 4">
                                <h4>参与成员</h4>
                                <br />
                              </span>
                            </ul>
                            <div>
                              <el-dropdown v-if="role_id == 1 && projectBackStatus != '已终止' && projectBackStatus != '已完结'">
                                <span class="el-dropdown-link">
                                  <el-button type="primary" class="zm">招募</el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item @click.native="recruitType('team')">团队</el-dropdown-item>
                                  <el-dropdown-item @click.native="recruitType('user')">个人</el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </div>
                          </div>
                          <el-table :data="cyMembersTableData" border stripe style="100%" class="tasktable"
                            v-loading="tableListLoading" :row-class-name="tableRowClassName"
                            element-loading-text="正在查询中..." v-show="memberType == 0">
                            <el-table-column label="参与成员" v-if="role_id == 3 || role_id == 4">
                              <template slot-scope="scope">
                                <div class="color_3458DD" v-if="scope.row.user">
                                  {{ scope.row.user.stage_name }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column label="花名" width="172" v-if="projShow">
                              <template slot-scope="scope">
                                <div class="color_3458DD" v-if="scope.row.user"
                                  @click="goSeniority('个人', scope.row.user_id)">
                                  {{ scope.row.user.stage_name }}  
                                  <span v-if="scope.row.user.name">（{{scope.row.user.name}}）</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="user.phone" label="手机号" width="172" v-if="projShow">
                              <template slot-scope="scope">
                                <div class="color_1B385C" v-if="scope.row.user">
                                  {{ scope.row.user.phone }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="user.level" label="等级">
                              <template slot-scope="scope">
                                <div class="color_1B385C" v-if="scope.row.user">
                                  {{ scope.row.user.level }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="role" label="成员角色">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.role }}
                                </div>
                              </template>
                            </el-table-column>
                            <!-- <div  v-if="detailData.info.bidding_type">
                              <div  v-if="(projShow)   && detailData.info.bidding_type=='个人'"> -->
                            <el-table-column prop="margin_status" label="保证金" width="172"
                              v-if="(projShow)">
                              <template slot-scope="scope">
                                <div>
                                  <span class="color_999" v-if="scope.row.margin_status == '未缴纳'">
                                    {{ scope.row.margin_status }}</span>
                                  <span class="color_0EB200" v-else-if="scope.row.margin_status == '已缴纳'">
                                    <svg class="icon" aria-hidden="true">
                                      <use xlink:href="#icon-yhgl-yrz"></use>
                                    </svg>
                                    {{ scope.row.margin_status }}
                                  </span>
                                  <span v-else>/</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="price" label="应付费用" width="220" v-if="(projShow)  ">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.price }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="settle_price" label="已结费用" width="220"
                              v-if="(projShow)  ">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.settle_price }}
                                
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="address" label="操作" width="220" v-if="(projShow)">
                              <template slot-scope="scope">
                                <div>
                                  <!--注意！！！ 结算之后 ，评价之后页面按钮置灰 不隐藏 -->
                                  <el-button type="text" class="color_3458DD" @click="Settle(scope.row)"
                                    v-if="role_id == 1 && (scope.row.price != scope.row.settle_price)"
                                    :disabled="scope.row.left_price < 0">结算</el-button>
                                    <!-- bidding_type   -->
                                    <!-- 1 项目 已完结 已终止
                                    2 项目经理可以对 团队 个人评价
                                    3 当承接方是团队是 只能对团队（负责人）评价  不可评价团队成员  
                                    4 团队负责人也可评价项目经理
                                    5 当承接方是个人时 项目经理可以评价所有参与项目成员
                                    6 个人也可评价项目经理  detailDataInfor.bidding_type-->
                                  <el-button type="text" class="color_3458DD" @click="Assess(scope.row)" v-if="scope.row.has_comment !=true && role_id == 2 && detailDataInfor.bidding_type=='个人' " >
                                    <span  v-if=" (detailDataInfor.background_status == '已完结'|| detailDataInfor.background_status == '已终止')" >
                                      评价
                                    </span>
                                  </el-button>
                                </div>
                              </template>
                            </el-table-column>
                          <!-- </div>

</div> -->

                          </el-table>
                          <el-table :data="bmMembersTableData" border stripe style="100%" class="tasktable"
                            v-loading="tableListLoading" :row-class-name="tableRowClassName"
                            element-loading-text="正在查询中..." v-show="memberType == 1">
                            <el-table-column prop="date" label="花名" width="172">
                              <template slot-scope="scope">
                                <div class="color_3458DD" v-if="scope.row.handle_bidding_type == '团队'"
                                  @click="goSeniority(scope.row.handle_bidding_type, scope.row.team_id)">
                                  {{ scope.row.handle_stage_name || '/' }}
                                  <!-- <span v-if="projShow"></span> -->
                                </div>
                                <div class="color_3458DD" v-else-if="scope.row.handle_bidding_type == '个人'"
                                  @click="goSeniority(scope.row.handle_bidding_type, scope.row.user_id)">
                                  {{ scope.row.handle_stage_name }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="handle_contact_name" label="联系人" width="172">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.handle_contact_name || '/' }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="handle_phone" label="手机号" width="172">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.handle_phone }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="handle_bidding_type" label="承接方" width="172">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.handle_bidding_type }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="handle_role " label="报名角色" width="172">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.handle_role || '/' }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="address" label="等级" width="172">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  Lv.{{ scope.row.handle_level }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="handle_price" label="竞价费用" width="172">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.handle_price }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column label="预估时间">
                              <template slot-scope="scope">
                                <div class="color_1B385C">
                                  {{ scope.row.handle_estimated_time }}天
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="address" label="操作" width="190"
                              v-if="(projShow) && (projectBackStatus != '已终止' && projectBackStatus != '已完结')">
                              <template slot-scope="scope">
                                <div>
                                  <!--  已录用是已同意 未录用是已拒绝 -->
                                  <el-button type="text" class="color_3458DD"
                                    @click="agreeOperationr(scope.row, '已录用', '同意')"
                                    :disabled="scope.row.handle_status == '已录用' || scope.row.handle_status == '未录用'">同意
                                  </el-button>
                                  <el-button type="text" class="color_3458DD"
                                    @click="agreeOperationr(scope.row, '未录用', '拒绝')"
                                    :disabled="scope.row.handle_status == '已录用' || scope.row.handle_status == '未录用'">拒绝
                                  </el-button>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </el-card>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
        <!--  终止项目 -->
        <el-dialog title="终止项目" :visible.sync="stopDialogVisible" width="30%">
          <textarea name="" id="" cols="70" rows="10" class="end-reason"
            v-model="stop.background_status_reason"></textarea>
          <span slot="footer" class="dialog-footer">
            <el-button @click="stopDialogVisible = false" class="btn-pad18">取 消</el-button>
            <el-button type="primary" @click="stopPro(detailDataInfor.background_status)" class="btn-pad18">确 定
            </el-button>

          </span>
        </el-dialog>
        <!--  开始项目 -->
        <el-dialog title="开始项目" :visible.sync="beginDialogVisible" width="30%">
          <span>是否确认开始项目研发？</span>
          <div class="begin-c">
            <p>客户名称：<span class="color_666 w-600"
                v-if="detailDataInfor.customer">{{ detailDataInfor.customer.name }}</span>
            </p>
            <div class="flex-center">
              <p>项目经理：<span v-if="detailData.info.manager_user">{{ detailData.info.manager_user.stage_name }}</span></p>
              <p>项目周期：<span>{{ detailDataInfor.period }}</span><span
                  class="color_666 w-600">{{ detailDataInfor.period_type }}</span></p>
            </div>
            <p>合同金额：<span class="color_FF980B"><span>¥</span>{{ detailDataInfor.price }}</span></p>
          </div>
          <div v-if="detailDataInfor.manager_user">
            <div class="begin-alert" v-if="!detailData.info.manager_user.stage_name">
              <p>提示：项目经理未填写，请完善</p>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="beginDialogVisible = false" class="btn-pad18">取 消</el-button>
            <!-- <el-button type="primary" @click="confirmBegin(detailDataInfor.background_status)" class="btn-pad18">确 定
          </el-button> -->
            <el-button type="primary" @click="confirmBegin('进行中')" class="btn-pad18">确 定
            </el-button>
            <!-- 后续优化 去完善 -->
            <!-- <el-button type="primary" class="btn-pad13"  v-if="role_id==1 || role_id==2"  @click="goEditPro(detailData)">去完善</el-button> -->
          </span>
        </el-dialog>

<!-- 当前组件的所有的Row的值都是为了查看页面时 编辑 更新进度 扭转 解决问题等组件的统一 -->
        <!-- 查看完整项目 -->
        <all-project v-if="allprojectShow" ref="refAllProject" :allProject_id='allProject_id' :currentUrl='currentUrl' @cancel="hideProject">
        </all-project>
        <!-- 项目概况 新建任务 -->
        <add-task v-if="addtaskShow" ref="refAddtask" :queryId='query_id' :currentUrl="currentUrl" @cancel="hidetask">
        </add-task>
        <edit-xm-task v-if="editXmTaskShow" :taskId='taskId' :queryId='query_id' :taskRow="taskRow" ref="refeditXmTask"
          :currentUrl="currentUrl" @cancel="hideEditXmTask"></edit-xm-task>
        <check-task v-if="checktaskShow" :taskId='taskId' ref="refChecktask" :queryId='query_id' :taskRow="taskRow"
          :currentUrl="currentUrl" @cancel="hidechecktask"></check-task>
        <task-process v-if="taskprocessShow" :taskId='taskId' :taskRow="taskRow" :currentUrl="currentUrl" ref="refTaskProcesstask"
          @cancel="hidetaskprocess"></task-process>

        <!-- 里程碑 -->
        <!-- ' -->
        <add-milestone v-if="addMilestoneShow" ref="refAddMilestone" :lcbId='lcbId' :queryId='query_id'
          :currentUrl="currentUrl" @cancel="hideAddLcb" :taskHeadername="taskHeadername"
          :taskHeaderStarttime="taskHeaderStarttime" :taskHeaderEndtime="taskHeaderEndtime"></add-milestone>
        <check-milestone v-if="checkLcbShow" :lcbId='lcbId' :currentUrl="currentUrl" ref="refCheckLcb"
          :queryId='query_id' :miilStoneRow="miilStoneRow" @cancel="hideCheckLcb"></check-milestone>
        <edit-milestone-task v-if="editLcbShow" :queryId='query_id' :lcbId='lcbId' :currentUrl="currentUrl"
          :miilStoneRow="miilStoneRow" ref="refEditLcb" @cancel="hideEditLcb"></edit-milestone-task>

        <!-- 问题 -->
        <add-question :currentUrl="currentUrl" v-if="addQuesShow" :queryId='query_id' ref="refaddQues"
          @cancel="hideAddQues"></add-question>
        <check-question :quesId="quesId" :currentUrl="currentUrl" v-if="checkQuesShow" ref="refCheckQues"
          :quesRow="quesRow" :queryId='query_id' @cancel="hideCheckQues"></check-question>
        <edit-question :currentUrl="currentUrl" :queryId='query_id' v-if="elitQuesShow" :quesRow="quesRow"
          ref="refEdlitQues" @cancel="hideEditQues"></edit-question>
         <twist-question  :currentUrl="currentUrl"  :quesRow="quesRow" :queryId='query_id'  v-if="twistQuesShow" @cancel="hideTwistQues"></twist-question>
        <solve-question :quesId="quesId" :currentUrl="currentUrl" v-if="solveQuestionShow" ref="refEdlitQues"
          @cancel="hideSolveQuestion"></solve-question>

        <!-- 会议 -->
        <add-meet v-if="addMeetShow" ref="refAddMeet" :queryId='query_id' :currentUrl="currentUrl"
          @cancel="hideAddMeet">
        </add-meet>
        <check-meet v-if="checkMeetShow" ref="refCheckMeet" :meetId="meetId" :currentUrl="currentUrl" :meetRow="meetRow"
          :queryId='query_id' @cancel="hideCheckMeet"></check-meet>
        <edit-meet v-if="editMeetShow" ref="refEditMeet" :meetId="meetId" :meetRow="meetRow" :queryId='query_id'
          :currentUrl="currentUrl" @cancel="hideEditMeet"></edit-meet>
        <!-- 交付文件 -->
        <add-file v-if="addFileShow" ref="refAddFile" :queryId='query_id' :currentUrl="currentUrl"
          @cancel="hideAddFile">
        </add-file>
        <edit-file v-if="editFileShow" ref="refEditFile" :fileId="fileId" :queryId='query_id' :currentUrl="currentUrl"
          :fileRow="fileRow" @cancel="hideEditFile"></edit-file>
        <check-file v-if="checkFileShow" ref="refCheckFile" :fileId="fileId" :fileRow="fileRow" :queryId='query_id'
          :currentUrl="currentUrl" @cancel="hideCheckFile"></check-file>
        <!-- 成员 -->
        <assess v-if="assessShow" ref="refAssess" :queryId='query_id' :memberRow="memberRow" :currentUrl="currentUrl"
          @cancel="hideAssess"></assess>
        <recruit v-if="recruitShow" ref="refRecruit" :currentUrl="currentUrl" :zmType="zmType" :queryId="query_id"
          @cancel="hideRecruit"></recruit>
        <settlement v-if="settleShow" ref="refSettle" :memberId="memberId" :memberRow="memberRow"
          :currentUrl="currentUrl" @cancel="hideSettle"></settlement>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { postData, getData } from "@/api/user";
import config from "@/libs/config";
// 任务
import allProject from './component/all-project.vue'
import addTask from './component/add-task.vue'
import taskProcess from './component/task-process.vue'
import checkTask from './component/check-task.vue'
import editXmTask from './component/edit-task.vue'
// 里程碑
import addMilestone from './component/add-milestone.vue'
import checkMilestone from './component/check-milstones.vue'
import editMilestoneTask from './component/edit-milestone-task.vue'
// 问题
import addQuestion from './component/add-question.vue'
import checkQuestion from './component/check-question.vue'
import editQuestion from './component/edit-question.vue'
import solveQuestion from './component/solve-question.vue'
import TwistQuestion from './component/twist-question.vue';

// 会议
import AddMeet from "./component/add-meet.vue";
import CheckMeet from "./component/check-meet.vue";
import EditMeet from "./component/edit-meet.vue";

// 交付文件
import AddFile from "./component/add-file.vue";
import EditFile from "./component/edit-file.vue";
import CheckFile from "./component/check-file.vue";


// 成员
import Assess from "./component/assess.vue";
import Recruit from "./component/recruit.vue";
import Settlement from "./component/settlement.vue";




export default {
  name: 'projectDetail',
  components: { allProject, addTask, editXmTask, taskProcess, checkTask, addMilestone, editMilestoneTask, checkMilestone, addQuestion, checkQuestion, editQuestion, solveQuestion, TwistQuestion, AddMeet, CheckMeet, EditMeet, AddFile, EditFile, CheckFile, Assess, Recruit, Settlement },

  data() {

    return {
      listLoading: true,
      tableListLoading: true,
      taskTableData: [],
      markerTableData: [],
      questionTableData: [],
      meetTableData: [],
      develiTableData: [],
      cyMembersTableData: [],
      bmMembersTableData: [],
      tabIndex: 0,
      warnIndex: 0,
      stopDialogVisible: false,
      beginDialogVisible: false,
      allprojectShow: false,
      bondDialogVisible: false,
      // 任务
      addtaskShow: false,
      taskprocessShow: false,
      checktaskShow: false,
      sqShow: false,///
      // 里程碑
      addMilestoneShow: false,
      checkLcbShow: false,
      editLcbShow: false,
      // 问题
      addQuesShow: false,
      checkQuesShow: false,
      elitQuesShow: false,
      editXmTaskShow: false,
      solveQuestionShow: false,
      twistQuesShow:false,
      // 会议
      addMeetShow: false,
      checkMeetShow: false,
      editMeetShow: false,
      // 交付文件
      addFileShow: false,
      editFileShow: false,
      checkFileShow: false,
      // 成员
      assessShow: false,
      recruitShow: false,
      settleShow: false,
      tabList: [
        {
          id: 0,
          name: '项目概况'
        },
        {
          id: 1,
          name: '里程碑'
        }, {
          id: 2,
          name: '问题'
        },
        {
          id: 3,
          name: '会议'
        },
        {
          id: 4,
          name: '交付文件'
        },
        {
          id: 5,
          name: '成员'
        },
        // {
        //   id: 6,
        //   name: '操作日志'
        // }

      ],

      hoverIndex: -1, //表示当前hover的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
      memberType: 0,
      query_id: '',
      detailData: {
        info: {},
        project_cost_detail: {}
      },
      detailDataInfor: {},
      openUpindex: 0,
      role_id: '',
      lcbId: '',
      quesId: '',
      meetId: '',
      fileId: '',
      memberId: '',
      currentUrl: '',
      stop: { background_status_reason: '' },
      taskRow: '',//传递任务行的信息
      miilStoneRow: '',//传递里程碑行的信息
      quesRow: '',//
      meetRow: '',//
      fileRow: '',//
      memberRow: '',
      zmType: '',
      // xmDetailEditShow:false,
      allProject_id: '',
      payIndex: 0,
      qrcodeUrl: '',
      qrcodedialogVisible: false,
      wxOrderId: "",
      currentUserId: '',
      taskHeadername: '',
      taskHeaderStarttime: '',
      taskHeaderEndtime: '',
      projectBackStatus: '',
      teamLeaderId:'',
      cr_url:'',
      adminShow:'',
      projShow:''
      

    }
  },
  created() {
    this.cr_url =  process.env.NODE_ENV === "development"
        ? config.baseUrl.dev
        : config.baseUrl.pro;
    this.query_id = this.$route.query.id
    this.role_id = store.state.userInfo.role_id
    this.currentUserId = store.state.userInfo.id
    // console.log('role_id:1管理 2项目经理 3团队 4个人>>>>>', this.role_id);
    this.adminShow =( this.role_id==1) ?true:false;
    this.projShow= (this.role_id==1 ||this.role_id==2)?true:false;
    // console.log(this.adminShow, this.projShow);

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
    // this.currentUrl = 'user_workbench'
    // // detailData.project_user_join.margin_status!='已缴纳'
    // // 个人 且 qrcodedialogVisible true 缴纳保证金状态 只调用详情接口
    // if(!this.qrcodedialogVisible && this.currentUrl == 'user_workbench'){
    //   this.projectDetail(); //详情
    // }else{
    //   this.projectDetail(); //详情
    //   this.projectTaskIndex(); //任务列表
    // }

    this.projectDetail(); //详情
    this.projectTaskIndex(); //任务列表
    // this.projectMilestoneIndex(); //里程碑列表
    // this.questionIndex();//问题列表
    // this.meetIndex();// 会议列表
    // this.projectDocumentIndex(); // 文件列表
    // this.memberlist(); // 成员列表

  },
  mounted() {
  },
  methods: {

    //个人等级时 微信支付轮询
    wxpayMarginCheck() {
      var this_ = this;
      // this_ 来接收this 不可修改
      var data = {
        order_id: this.wxOrderId
      }
      var timer = setInterval(function () {
        getData({
          url: "/workbech/user_workbench/project/wxpay_margin_check",
          data
        }).then((res) => {
          if (res.code == 200 && res.data?.pay_log) {
            this_.$success('支付成功！')
            // 支付成功刷新页面
            this_.projectDetail(); //详情
            this_.projectTaskIndex(); //任务列表
            clearInterval(timer)
            window.location.reload()
          }
          // 当微信对话框不显示 清除定时器
          if (this_.qrcodedialogVisible == false) {
            clearInterval(timer)
          }
        }).catch(err => {
          console.log(err)
        })
      }, 2000)
    },
    // 成员跳转
    goSeniority(type, id) {
      console.log(type, id);
      if (type == '个人') {
        this.$router.push({

          path: '/workbench/userDetail',
          query: {
            id: id
          }
        })
      } else {
        this.$router.push({
          path: '/workbench/teamDetail',
          query: {
            id: id
          }
        })
      }

    },

    // 管理员编辑项目
    goEditPro(detailData) {
      if (detailData.info.scope_type == '公域') {
        this.$router.push({
          path: '/public',
          query: {
            id: this.query_id
          }
        })
      } else if (detailData.info.scope_type == '私域') {
        this.$router.push({
          path: '/private',
          query: {
            id: this.query_id
          }
        })
      }

    },

    // 支付方式
    changePayType(index, type) {
      this.payIndex = index;
    },
    // 支付接口
    confirmPay(row) {
      if (this.payIndex == 0) {
        window.open(this.cr_url+"/workbech/user_workbench/project/alipay_margin?project_user_join_id=" + row.id + "&user_id=" + row.user_id)

      } else {
        // project_user_join有值且保证金状态时未缴纳 需要支付保证金
        getData({
          url: "workbech/user_workbench/project/wxpay_margin",
          data: {
            project_user_join_id: row.id
          }
        }).then((res) => {
          if (res.code == 200 && res.data?.url && res.data?.out_trade_no) {
            this.qrcodeUrl = res.data.url
            this.wxOrderId = res.data.out_trade_no
            this.qrcodedialogVisible = true
            // 当有微信二维码 唤起微信轮询
            this.wxpayMarginCheck()
          } else {
            this.$err('获取支付二维码失败！')
            return false

          }

        }).catch(err => {

        })
      }
    },
    // 进行评价
    evaluate(row) {
      this.assessShow = true

      let rowData={
        user:{
          stage_name:''
        },
        role:'',
        user_id:''
      }
      if(this.role_id==2){
        // 项目经理评价团队
        rowData.user.stage_name = row.team_join[0].team.team_name
        // 团队 不展示成员角色
        rowData.role  = '团队'
        rowData.object_type ='团队'
        if(row?.team_join[0]?.team_id){
          rowData.user_id = row.team_join[0].team_id
        }
        }else if(this.role_id==3 || this.role_id==4){
        // 团队评价项目经理   个人评价项目经理
        rowData.user.stage_name = row.manager_user.stage_name
        rowData.role = '项目经理'
        rowData.object_type ='项目经理'
        rowData.user_id = row.manager_user_id
        } 
      this.memberRow = rowData
 
    },
    // 删除之后的当前行样式设置
    tableRowClassName({ row, rowIndex }) {
      if (row.is_delete == 1) {
        return 'aldelete-row';
      }
      return '';
    },
    // 默认展开
    packUp(item, index, display_, open, close) {
      this.$refs[item][0].style.display = display_
      if (display_ == 'none') {
        this.$refs[open][0].style.display = 'none'
        this.$refs[close][0].style.display = 'block'
      } else if (display_ == 'block') {
        this.$refs[open][0].style.display = 'block'
        this.$refs[close][0].style.display = 'none'
      }
    },
    // 项目概况 里程碑等 tab切换
    checkPart(index) {
      this.tabIndex = index
      if (index == 0) this.projectTaskIndex(); //任务列表
      else if (index == 1) this.projectMilestoneIndex(); //里程碑列表
      else if (index == 2) this.questionIndex();//问题列表
      else if (index == 3) this.meetIndex();// 会议列表
      else if (index == 4) this.projectDocumentIndex(); // 文件列表
      else if (index == 5) this.memberlist(); // 成员列表

    },
    // 任务
    // 任务列表
    projectTaskIndex() {
      this.tableListLoading = true;
      getData({
        url: "/workbech/" + this.currentUrl + "/project_task/index/" + this.query_id,
      }).then((res) => {
        this.tableListLoading = false;
        this.taskTableData = res.data

      });
    },
    // 删除任务
    deleteTask(id) {
      this.$confirm("确定删除该任务吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        postData({
          url: "/workbech/" + this.currentUrl + "/project_task/delete",
          data: { project_task_id: id },
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.projectTaskIndex()
          }
        });
      }).catch((err) => {
        return false
      })
    },
    // 详情
    projectDetail() {
      this.listLoading = true
      getData({
        url: "/workbech/" + this.currentUrl + "/project/detail/" + this.query_id,
      }).then((res) => {
        // 当前项目的团队负责人id 当前项目的团队负责人 可以新建任务 、里程碑 、会议、交付文件、
        if(res.data?.info?.team_join && res.data?.info?.team_join[0]?.user_id){
          this.teamLeaderId=res.data.info.team_join[0].user_id
        }
        this.listLoading = false
        this.detailData = res.data
        this.detailDataInfor = res.data.info
        // 当前项目的状态
        this.projectBackStatus = res.data.info.background_status
        sessionStorage.setItem('projectBackStatus', this.projectBackStatus)
      });
    },
    // 里程碑 列表
    projectMilestoneIndex() {
      this.tableListLoading = true;
      getData({
        url: "workbech/" + this.currentUrl + "/project_milestone/index/" + this.query_id,
      }).then((res) => {
        this.tableListLoading = false;
        this.markerTableData = res.data.list;
   

      });
    },
    judgeChargeusers(charge_users){
      console.log('11111');
      var charge=[];
      charge_users.map(item=>{
        charge.push(item.id)
      })
      console.log(this.currentUserId,charge);
      return charge.includes(this.currentUserId)

    },
    // 里程碑完成
    finishLcb(row) {
      this.$confirm("确定完成该里程碑吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        this.miilstoneSetComplete(row)
      }).catch((err) => {
        return false
      })
    },
    // 里程碑完成方法
    miilstoneSetComplete(row) {
      postData({
        url: "workbech/" + this.currentUrl + "/project_milestone/set_complete",
        data: { project_milestone_id: row.id },
      }).then((res) => {
        if (res.code == 200) {
          this.$success(res.data.msg)
          this.projectMilestoneIndex()
        }


      });
    },
    // 删除里程碑
    deleteLcb(row) {
      this.$confirm("确定删除该里程碑吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        postData({
          url: "workbech/" + this.currentUrl + "/project_milestone/delete",
          data: { project_milestone_id: row.id },
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.projectMilestoneIndex()
          }
        });
      }).catch((err) => {
        return false
      })
    },
    // 问题 列表
    questionIndex() {
      this.tableListLoading = true;
      getData({
        url: "workbech/" + this.currentUrl + "/project_question/index/" + this.query_id,
      }).then((res) => {
        this.tableListLoading = false;
        this.questionTableData = res.data.list.data
      });
    },
    // 删除问题
    deleteQues(row) {
      this.$confirm("确定删除该问题吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        postData({
          url: "workbech/" + this.currentUrl + "/project_question/delete",
          data: { project_question_id: row.id }
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.questionIndex()
          }
        });
      }).catch((err) => {
        return false
      })
    },
    // 会议列表
    meetIndex() {
      this.tableListLoading = true;
      getData({
        url: "workbech/" + this.currentUrl + "/project_meeting/index/" + this.query_id,
      }).then((res) => {
        this.tableListLoading = false;
        this.meetTableData = res.data
      });
    },

    // 删除会议
    deleteMeet(row) {
      this.$confirm('确认要删除该会议吗', '提示', {
      }).then(() => {
        postData({
          url: "/workbech/" + this.currentUrl + "/project_meeting/delete",
          data: { project_meeting_id: row.id }
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.meetIndex();
          }
        });

      }).catch((err) => {

      });

    },

    // 交付文件列表     
    projectDocumentIndex() {
      this.tableListLoading = true;
      getData({
        url: "workbech/" + this.currentUrl + "/project_document/index/" + this.query_id,
      }).then((res) => {
        this.tableListLoading = false;
        this.develiTableData = res.data
      });
    },
    // 删除文件
    deleteFile(row) {
      this.$confirm('确认要删除该文件吗', '提示', {
      }).then(() => {
        postData({
          url: "/workbech/" + this.currentUrl + "/project_document/delete",
          data: { project_document_id: row.id }
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.projectDocumentIndex();
          }
        });
      }).catch((err) => {

      });
    },
    // 交付文件提交
    submitDoc(row) {
      this.$confirm("确定提交该文件吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        postData({
          url: "/workbech/" + this.currentUrl + "/project_document/submit",
          data: { project_document_id: row.id },
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.projectDocumentIndex()
          }

        });
      }).catch((err) => {
        return false
      })
    },
    // 成员列表
    memberlist() {
      this.tableListLoading = true;
      if (this.memberType == 0) {
        this.memberIndex()

      } else if (this.memberType == 1) {
        this.memberIndexApply()
      }
    },
    memberIndex() {
      // 参与成员列表
      getData({
        url: "workbech/" + this.currentUrl + "/project_member/index/" + this.query_id,
      }).then((res) => {
        this.tableListLoading = false;
        this.cyMembersTableData = res.data.list
      });
    },
    memberIndexApply() {
      // 报名成员列表
      getData({
        url: "workbech/" + this.currentUrl + "/project_member/index_apply/" + this.query_id,
      }).then((res) => {
        this.tableListLoading = false;
        this.bmMembersTableData = res.data.list
      });
    },
    // 预警类型切换
    changeWarnType(index) {
      this.warnIndex = index
    },
    // 查看完整项目
    checkAllPro(desc) {
      this.allprojectShow = true
      this.allProject_id = this.query_id
    },
    // 改变项目状态
    setBckgroundStatus(status) {
      postData({
        url: "/workbech/" + this.currentUrl + "/project/set_background_status/" + this.query_id,
        data: { background_status: status, background_status_reason: this.stop.background_status_reason }
      }).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.beginDialogVisible = false
          this.stopDialogVisible = false;
          // 更改状态之后刷新
          this.projectDetail()
          this.stop.background_status_reason = ''
        }

      });

    },
    // 确认开始项目
    confirmBegin(status) {
      this.setBckgroundStatus(status)

    },
    // 隐藏项目
    hideProject() {
      this.allprojectShow = false;
    },
    // 开始项目
    beginPro() {
      this.beginDialogVisible = true;
    },
    // 验收项目
    acceptPro() {
      this.$confirm('是否确认将项目状态更改为验收状态', '验收项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.setBckgroundStatus('验收中')
      }).catch((err) => {

      });
    },
    // 完结项目
    endPro() {
      this.$confirm('是否确认将项目状态更改为完结状态', '完结项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.setBckgroundStatus('已完结')
      }).catch((err) => {

      });
    },
    // 终止项目
    stopPro() {
      if(this.stop.background_status_reason==''){
      this.$message({
        message: '请填写终止原因',
        type: 'error'
            
      })
      return false
      }
      this.setBckgroundStatus('已终止')
    },

    // 新建任务
    adTask() {
      this.addtaskShow = true
      this.projectTaskIndex()
    },
    // 
    hidetask() {
      this.addtaskShow = false;
      // 更新 项目进度之后需要重新计算 所以需要调取详情接口
      this.projectDetail(); //详情
      this.projectTaskIndex()
    },
    // 编辑项目概况任务
    editXmTask(row) {
      this.taskId = row.id
      this.taskRow = row
      this.editXmTaskShow = true

    },
    hideEditXmTask() {
      this.editXmTaskShow = false
        // 更新 项目进度之后需要重新计算 所以需要调取详情接口
        this.projectDetail(); //详情
      this.projectTaskIndex()
    },
    // 更新进度
    updateProcess(row) {
      this.taskprocessShow = true;
      this.taskId = row.id
      this.projectTaskIndex()
    },
    //隐藏任务进度
    hidetaskprocess() {
      this.taskprocessShow = false;
      this.projectTaskIndex()
    },
    // 查看任务
    checkTask(row) {
      this.checktaskShow = true
      this.taskId = row.id
      this.taskRow = row
    },
    hidechecktask() {
      this.checktaskShow = false
    },
    // 里程碑
    addLcb(id, name, start_time, end_time) {
      this.addMilestoneShow = true
      this.lcbId = id
      this.taskHeadername = name
      this.taskHeaderStarttime = start_time
      this.taskHeaderEndtime = end_time
    },
    hideAddLcb() {
      this.addMilestoneShow = false
      this.projectMilestoneIndex();
    },
    // 编辑里程碑
    editLcb(row) {
      this.editLcbShow = true
      this.lcbId = row.id
      this.miilStoneRow = row;
    },
    hideEditLcb() {
      this.editLcbShow = false
      this.projectMilestoneIndex();
    },
    // 查看里程碑
    checkLcb(row) {
      this.checkLcbShow = true;
      this.lcbId = row.id
      this.miilStoneRow = row
    },
    hideCheckLcb() {
      this.checkLcbShow = false;
      this.projectMilestoneIndex();
    },
    // 新增问题
    newQuestion() {
      this.addQuesShow = true
    },
    hideAddQues() {
      this.addQuesShow = false
      this.questionIndex();
    },
    // 查看问题
    checkQues(row) {
      this.checkQuesShow = true
      this.quesId = row.id
      this.quesRow = row

    },
    hideCheckQues() {
      this.checkQuesShow = false
    },
    // 编辑问题
    EditQues(row) {
      this.elitQuesShow = true
      this.quesId = row.id
      this.quesRow = row
    },
    // 扭转问题
    TwistQues(row) {
        this.twistQuesShow = true
        this.quesRow=row
    },
    hideTwistQues() {
        this.twistQuesShow = false
        this.questionIndex()
    },
    hideEditQues() {
      this.elitQuesShow = false
      this.questionIndex();
    },
    SolveQuestion(row) {
      this.solveQuestionShow = true
      this.quesId = row.id
    },
    hideSolveQuestion() {
      this.solveQuestionShow = false
      this.questionIndex();
    },
    // 新增会议
    AddMeet() {
      this.addMeetShow = true

    },
    hideAddMeet() {
      this.addMeetShow = false
      this.meetIndex();

    },
    // 查看会议
    CheckMeet(row) {
      this.checkMeetShow = true
      this.meetId = row.id
      this.meetRow = row
    },
    hideCheckMeet() {
      this.checkMeetShow = false

    },
    // 编辑会议
    EditMeet(row) {
      this.meetId = row.id
      this.editMeetShow = true
      this.meetRow = row
    },
    hideEditMeet() {
      this.editMeetShow = false
      this.meetIndex();
    },

    // 添加文件
    AddFile(row) {
      this.addFileShow = true

    },
    hideAddFile() {
      this.addFileShow = false
      this.projectDocumentIndex();
    },
    // 编辑文件
    editFile(row) {
      this.fileId = row.id
      this.editFileShow = true
      this.fileRow = row
    },
    hideEditFile() {
      this.editFileShow = false
      this.projectDocumentIndex();
    },
    // 查看文件
    checkFile(row) {
      this.fileId = row.id
      this.checkFileShow = true
      this.fileRow = row
    },
    hideCheckFile() {
      this.checkFileShow = false
    },
    // 评价
    Assess(row) {
      console.log(row.has_comment);
      this.assessShow = true
      row.object_type='个人'
      this.memberRow = row
    },
    hideAssess() {
      this.assessShow = false
      this.projectDetail();
      this.memberlist() ;//评价之后回调页面
    },

    // 结算
    Settle(row) {
      this.settleShow = true
      this.memberRow = row
    },
    hideSettle() {
      this.settleShow = false
      this.memberlist();
    },
    // 招募
    Recruit() {
      this.recruitShow = true
    },
    hideRecruit() {
      this.recruitShow = false
      this.memberlist();
    },
    // 报名成员 同意  拒绝
    agreeOperationr(row, status, desc) {
      this.$confirm('确认' + desc + '该报名成员吗', '报名成员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        var type = ''
        if (row.handle_bidding_type == '团队') type = 'team'
        else if (row.handle_bidding_type == '个人') type = 'user'
        console.log(row);
        postData({
          url: "/workbech/" + this.currentUrl + "/project_member/store_apply_status/",
          data: {
            apply_id: row.id,
            type: type,
            status: status
          }
        }).then((res) => {
          if (res.code == 200) {
            this.$success(res.data.msg)
            this.memberIndexApply()
          }
        });
      }).catch((err) => {

      });
    },

    // hover 里程碑 新建
    outLcb() {
      this.hoverIndex = -1
    },
    hoverLcb(index) {
      this.hoverIndex = index
    },
    // 招募下拉
    recruitType(type) {
      this.Recruit()
      // 团队 个人招募类型
      this.zmType = type
    },
    changeMemberType(index) {
      this.memberType = index;
      this.memberlist()
    }

  }
}

</script>

<style lang="less" scoped>
.pro-detail {
  position: relative;
width: 100%;
.w100{
  width: 100%!important;
}
  .dialog-content-wx {
    text-align: center;
    font-size: 13px;
    line-height: 18px;
    padding-bottom: 20px;
    color: #666;

    span {
      color: #ef0016;
    }

    .erweima_img {
      margin: auto;
      padding: 10px;
      width: 166px !important;
      height: 166px !important;
      border: 1px solid #629856;
      overflow: hidden;
      margin-top: 11px;

      .svg_box {
        /deep/svg {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }

    p {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
      font-size: 16px;
      color: #666;
      line-height: 1;

      img {
        margin-right: 7px;
        width: 26px;
        height: 22px;
      }
    }
  }

  .jnbond {
    padding: 0.19rem 0.3rem;
    background: #FAFAFA;
    margin-bottom: 0.18rem;
  }

  .pay-method {
    margin: 0.1rem 0;
    position: relative;

    .pay-type {
      width: 1.6rem;
      padding: 0.2rem;
      border: 1px solid #EAEAEA;
      position: relative;
      margin-right: 0.5rem;

      svg.icon {
        width: 0.23rem;
        margin-right: 0.05rem;
      }
    }

    .pay-type.active {
      background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/pay-type.png);
      border: 2px solid #316DFA;
      background-size: 0.38rem;
      background-repeat: no-repeat;
      background-position-x: right;
    }
  }

  .bond-tips {
    padding: 0.06rem 0.12rem;
    color: #CB781F;
    font-size: 0.12rem;
    background: #FFF4D5;

    p {
      line-height: 0.2rem;
    }
  }
}

.cover {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;

  .color_FC5531 {
    color: #FC5531;
  }

  .font24 {
    font-size: 0.24rem;
  }


  .desc {
    position: absolute;
    top: 30%;
    left: 45%;
    width: 5rem;
    margin: 0 auto;
    text-align: center;
    transform: translate(-50%, -50%);

    p {
      font-size: 0.13rem;
      color: #333333;
      margin-bottom: 0.2rem;
    }

    .el-button {
      padding: 0.09rem 0.7rem;
    }
  }

  .list-left {
    box-shadow: 0 0 0.08rem 0.01rem #efefef;
    padding: 0.3rem 0.25rem 0.16rem 0.3rem;
    z-index: 101;
    width: 9.72rem;
    min-height: 1.75rem;

    .project-title {
      display: flex;
      margin-bottom: 0.07rem;
      align-items: center;
      justify-content: space-between;

      .pro-process-status {
        svg.icon {
          // font-size: 0.4rem;
          width: 0.52rem;
    height: 0.21rem;
        }
      }

      .xm-type {
        .ys {
          width: 0.42rem;
          height: 0.23rem;
          background: #2141B4;
          // padding: 0.11rem 0.12rem;
          padding: 0;
          color: #fff;
          font-size: 0.14rem;
        }
      }

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
      margin-bottom: 0.1rem;

      .project-desc {
        height: 0.31rem;
        background: #F4F5F7;
        font-size: 0.14rem;
        color: #333;
        margin-right: 0.1rem;
        display: inline-block;
        padding: 0.06rem 0.12rem;

        span {
          color: #999;
        }
      }
    }

    .project-time {
      font-size: 0.14rem;
      color: #666;


      p {
        width: 1rem;
        display: inline-block;
        font-size: 0.13rem;
        color: #666666;
        margin-right: 0.3rem;


        span {
          font-size: 0.14rem;
          color: #333;
        }
      }

      .join {
        width: 3.69rem;
        height: 0.38rem;
        background: #E8F4FE;
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.22rem;
        color: #464C5B;
        padding: 0.08rem 0.12rem;

        .assess {
          padding: 0;
          text-decoration: underline;
        }
      }

      .xm-manage {
        width: 2rem;
      }

      .bail {
        color: #666666;
        margin-right: 0.3rem;
        width: 2rem;

        .price-unit {
          font-size: 0.14rem;
          color: #FF980B;
        }

        .bail-price {
          font-size: 0.16rem;
          color: #FF980B;
        }
      }
    }
  }
}

.wrap.on {
  // width: 100%;
  filter: blur(0.1rem);
  pointer-events: none;
}

.wrap {
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 18.3rem;
  transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -moz-transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -o-transition: width 0.15s;

  .min-h5 {
    min-height: 5rem;
  }

  .align-center {
    width: 100%;
    text-align: center;
    margin: 0 auto;

    img {
      width: 1.8rem;
    }
  }

  .end-reason {
    width: 5rem;
    height: 1.06rem;
    resize: none;
    border: 0.01rem solid #DBDBDB;
    outline: none;
    padding: 0.1rem;
  }
  .hoverBg {
    background: #ccc;
    color: #fff;
  }

  .clickBg {
    background: red;
    color: #fff;
  }

  .begin-c {
    width: 5.35rem;
    height: 1.6rem;
    background: linear-gradient(180deg, #EAF1F5 0%, #FFFFFF 100%);
    font-size: 0.15rem;
    padding: 0.3rem;
    margin-top: 0.18rem;

    p {
      margin-bottom: 0.17rem;
    }

  }

  .begin-alert {
    width: 5.35rem;
    height: 0.38rem;
    padding: 0.1rem 0 0.2rem 0.2rem;

    color: #FF980B;
    font-size: 0.13rem;
    background: #FFFAF2;
  }

  p.ty-sty {
    font-size: 0.13rem;
    color: #666666;

    span {
      font-size: 0.14rem;
      color: #333333;

    }
  }

  .fh {
    color: #333;
    font-size: 0.15rem;
    margin-bottom: 0.17rem;
  }

  .el-input {
    width: 350px;
  }

  .content-top {
    // width: 16.7rem;
    min-width: 16.7rem;
    max-width: 18.3rem;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.2rem;
    align-items: flex-start;

    .xm-infor {
    //  width: 9.72rem;
    flex: 1;
       min-width: 9.72rem;
      max-width:11.13rem;
      // height: 1.73rem;
      display: flex;
      margin-right: 0.2rem;
box-shadow:  0 0 0.05rem 0.01rem #efefef;
      // background: #fff;
      background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-xmxqx.png);
      background-size: cover;
      background-position: center;

      .list-box:hover {
        box-shadow: 0 0 0.08rem 0.01rem #aab5eb;
      }

      .list-left {
        padding: 0.3rem 0.25rem 0.16rem 0.3rem;
        z-index: 101;
        width: 100%;
        min-height: 1.75rem;

        .project-title {
          display: flex;
          margin-bottom: 0.07rem;
          align-items: center;
          justify-content: space-between;

          .pro-process-status {
            svg.icon {
              // font-size: 0.4rem;
              width: 0.52rem;
    height: 0.21rem;
            }
          }

          .xm-type {
            .ys {
              width: 0.42rem;
              height: 0.23rem;
              background: #2141B4;
              // padding: 0.11rem 0.12rem;
              padding: 0;
              color: #fff;
              font-size: 0.14rem;
            }
          }

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
          margin-bottom: 0.1rem;

          .project-desc {
            height: 0.31rem;
            background: #F4F5F7;
            font-size: 0.14rem;
            color: #333;
            margin-right: 0.1rem;
            display: inline-block;
            padding: 0.06rem 0.12rem;

            span {
              color: #999;
            }
          }
        }

        .project-time {
          font-size: 0.14rem;
          color: #666;
          display: flex;
         

          p {
            width: 1.2rem;
            display: inline-block;
            font-size: 0.13rem;
            color: #666666;
            align-self: center;
            height: 0.38rem;
            padding: 0.08rem 0;
            // margin-right: 0.3rem;
            // margin-right: 0.1rem;

            span {
              font-size: 0.14rem;
              color: #333;
            }
          }

          .join {
            // width: 3.69rem;
            font-size: 0.16rem;
            // font-weight: 500;
            // color: #464C5B;
          p{
            width: 3.69rem;
            height: 0.38rem;
            background: #E8F4FE;
            // font-size: 0.16rem;
            // font-weight: 500;
            line-height: 0.22rem;
            // color: #464C5B;
            padding: 0.08rem 0.12rem;
          }
            .assess {
              padding: 0;
              text-decoration: underline;
            }
          }

          .xm-manage {
            width: 2rem;
          }

          .bail {
            color: #666666;
            margin-right: 0.3rem;
            width: 2rem;

            .price-unit {
              font-size: 0.14rem;
              color: #FF980B;
            }

            .bail-price {
              font-size: 0.16rem;
              color: #FF980B;
            }
          }
        }
      }
    }

    .xm-process {
      background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-xmjd.png);
      background-size: cover;
      background-position: center;
      // width: 100%;
      width: 3.29rem;
      flex: 1;
      margin-right: 0.2rem;
      box-shadow: 0 0 0.08rem 0.01rem #efefef;
      padding: 0.25rem 0.3rem;
      min-height: 1.75rem;

      .process-bg {
        h3 {
          font-size: 0.13rem;
          font-weight: 600;
          color: #333333;
          margin-bottom: 0.17rem;
        }

        ul {
          padding-bottom: 0.1rem;

          .el-progress {
            width: 1.62rem;
            display: inline-block;
          }

          .color-3458DD {
            color: #3458DD;
          }

          .color-333 {
            color: #333;
            font-size: 0.14rem;
          }
        }
      }
    }

    .xm-money {
      background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-xmfy.png);
      background-size: cover;
      background-position: center;
      width: 3.29rem;
      box-shadow: 0 0 0.08rem 0.01rem #efefef;
      padding: 0.25rem 0.3rem 0;
      min-height: 1.75rem;
      flex: 1;

      .money-bg {

        h3 {
          font-size: 0.13rem;
          font-weight: 600;
          color: #333333;
          margin-bottom: 0.15rem;
        }

        ul {
          padding-bottom: 0.23rem;

          .color-FF980B {
            color: #FF980B;
            font-size: 0.18rem;
          }

          .font14 {
            font-size: 0.14rem;
          }
        }
      }
    }

    .d-ul {
      font-size: 0.13rem;

      li {
        margin-bottom: 0.1rem;
        color: #666666;

        span {
          font-size: 0.18rem;
          color: #FF980B;
        }
      }

      li:last-of-type {
        margin-bottom: 0;
      }
    }
  }

  .content-m {
    // width: 16.7rem;
    max-width: 16.7rem;
max-width: 18.3rem;
    .module-box {
      background: #fff;
      padding-left: 0.3rem;
      box-shadow: 0 0 0.08rem 0.01rem #efefef;

      li {
        display: inline-block;
        width: 1.04rem;
        height: 0.52rem;
        font-size: 0.14rem;
        color: #666666;
        line-height: 0.52rem;
        text-align: center;
        cursor: pointer;
      }

      li.active {
        color: #333;
        background: #F7F7F7;
        font-weight: 600;
        border-bottom: 0.04rem solid #3458DD;
      }
    }

    .project-detail {
      // width: 16.7rem;
      padding: 0.2rem 0.3rem 0.3rem;
      background: linear-gradient(180deg, #F0F6F8 30%, #FFFFFF 100%);

      // 项目概况
      .project-overview {
        .mt {
          margin-bottom: 0.2rem;
        }

        .xmxx {
          width: 10.06rem;
          height: 2.87rem;
          box-shadow: 0 0 0.08rem 0.01rem#efefef;
          margin-right: 0.2rem;
          background: #fff;
          padding: 0.19rem 0.24rem 0;

          .overview-title {
            margin-bottom: 0.25rem;

            h3 {
              font-size: 0.13rem;
              color: #333;
            }

            .el-button {
              background: #F0F4F8;
              color: #1B385C;
              font-size: 0.13rem;
              padding: 0.07rem 0.14rem;

            }
          }

          .xm-name {
            margin-bottom: 0.24rem !important;
          }

          .part-infor {
            width: 100%;

            .check-wholepro {
              padding: 0;
            }

            p {
              width: 33%;
              margin-bottom: 0.24rem;
            }
          }
        }

        .xmyj {
          flex: 1;
          min-height: 2.85rem;
          // width: 5.84rem;
          box-shadow: 0 0 0.08rem 0.01rem#efefef;

          h3 {
            background: #fff;
            font-size: 0.13rem;
            color: #333;
            padding: 0.18rem;

            .icon-gzt-xmyj {
              margin-right: 0.05rem;
            }
          }

          .early-warn {
            background: #E3E3E3;
            display: flex;
            justify-self: flex-start;
            >div{
              flex:1;
              margin-right: 0.03rem;
            }
            >div:last-child{
              margin-right: 0;
            }
            li {
              text-align: center;
              // width: 1.93rem;
              font-size: 0.13rem;
              background: #F7F7F7;
              color: #999999;
              padding: 0.11rem 0;
              // box-shadow: 0.08rem 0rem 0.08rem 0rem #efefef;
              border-top: 0.04rem solid transparent;

              span {
                color: #E30000;

              }
            }

            li.active {
              color: #333;
              font-weight: 600;
              background: #fff;
              border-top: 0.04rem solid #3458DD;
              // box-shadow: 0.08rem 0rem 0.08rem 0rem #efefef;
            }
          }

          .part-warn {
            .warn-item {
              // width: 5.84rem;
              height: 1.87rem;
              background: linear-gradient(180deg, #FFEFEF 0%, #FFFFFF 100%);
              border-radius: 0.04rem;
              padding: 0.19rem 0.26rem;
              overflow-y: auto;

              .warn-xx {
                .warn-time {
                  width: 0.8rem;
                  font-size: 0.13rem;
                  color: #666;
                }

                .warn-line {
                  width: 0.08rem;
                  height: 0.35rem;
                  background: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/xmdt-yx.png');
                  background-size: cover;
                  background-position: center;
                  position: relative;
                  margin: 0.05rem 0.1rem 0;
                }

                // 
                .warn-line.last {
                  width: 0.08rem;
                  height: 0.08rem;
                  background: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/xmdt-yuan.png');
                  background-size: cover;
                  background-position: center;
                  position: relative;
                  margin: 0.05rem 0.1rem 0;

                }

                .warn-desc {
                  width: 4rem;
                  font-size: 0.14rem;
                }
              }

              .warn-jz {
                font-size: 0.14rem;
                color: #3458DD;
                font-weight: 600;
              }

              .warn-yyq {
                color: #E30000;
                font-weight: 600;
                font-size: 0.14rem;

              }

            }

          }
        }

      }

      // 提取 提取 提取 提取 提取 提取 提取
      .task {
        // width: 16rem;
        background: #fff;
        padding: 0.19rem 0.21rem;

        .xmgk-title {
          margin-bottom: 0.1rem;

          .el-button {
            background: #3458DD;
            padding: 0.07rem 0.13rem;
          }
        }

        .task-list {
          width: 16rem;
          font-size: 0.13rem;
        }
      }

      section {
        .floatR {
          float: right;
          text-align: right;
        }

        .mark-card {
          margin-bottom: 0.1rem;
          min-height: 5rem;

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
            min-height: 5rem;
            font-size: 0.13rem;

            /deep/.el-card__body,
            .el-main {
              padding: 0.05rem 0.2rem;
            }

            .flex1 {
              width: 5rem;
            }

            .task-desc-svg {
              width: 5rem;
              display: flex;
              align-items: center;

              svg.icon {
                width: 0.2rem;
                display: none;
              }

              svg.icon.active {
                display: block;
              }
            }

            .lcb-ts-item {
              margin-bottom: 0.2rem;

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

            .marker-table {
              margin: 0.2rem 0;

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
                background: #B3E6FC;
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
  }
}
</style>