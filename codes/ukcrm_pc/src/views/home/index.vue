<template>
  <div class="com_body_main">
    <left-menu :activeMenu="activeMenu"></left-menu>
    <top-nav active_title="首页"></top-nav>

    <div class="com_right_main">
      <div class="home_box d-flex home_flex">
        <!-- 企业年度目标 -->
        <div class="global home_white">
          <div class="home_title d-between">
            企业年度目标
            <el-select
              v-model="year_global"
              placeholder="请选择年"
              @change="change_global"
            >
              <el-option
                v-for="item in year_list"
                :key="item.year"
                :label="item.year"
                :value="item.year"
              >
              </el-option>
            </el-select>
          </div>
          <div class="current_box">
            <div class="l_tabs d-center" v-if="role_id == 3 || role_id == 4">
              <div
                class="item"
                :class="{ active: annual_activeTab == v.type }"
                v-for="(v, i) in annual_tabs"
                :key="i"
                @click="changAnTab(v.type)"
              >
                {{ v.name }}
              </div>
            </div>
          </div>
          <div class="global_pie">
            <el-progress
              :show-text="false"
              :width="168"
              :stroke-width="12"
              type="circle"
              :percentage="current.percent_num"
              class="back_progress"
              color="#4D6FFF"
            >
            </el-progress>
            <div class="circleCenter">
              <div class="num">
                <span>{{ current.percent || "0" }}</span
                >%
              </div>
              <div class="text">已完成</div>
            </div>
          </div>
          <ul class="global_txt">
            <li class="txt_box">
              <p class="title">完成额<span>（元）</span></p>
              <p class="money">{{ current.completion_money }}</p>
            </li>
            <li class="txt_box">
              <p class="title">目标额<span>（元）</span></p>
              <div v-if="role_id == 1 || role_id == 2">
                <p class="money" v-if="q_money > 0">
                  {{ current.money }}
                </p>
                <p v-else class="money_btn" @click="to_target()">去设置</p>
              </div>
              <p class="money" v-else>{{ current.money }}</p>
            </li>
          </ul>
        </div>

        <!-- 本月数据汇总 -->
        <div class="info home_white">
          <div class="home_title d-between">本月数据汇总</div>
          <div>
            <div class="info_box">
              <div class="home_sub">客户汇总</div>
              <ul class="info_list">
                <li class="info_item">
                  <p class="name">新增客户</p>
                  <p class="num">
                    {{ monthInfo.newly_added_customer || 0 }}<span>个</span>
                  </p>
                </li>
                <li class="info_item">
                  <p class="name">转成交客户</p>
                  <p class="num">
                    {{ monthInfo.newly_added_deal_customer_count || 0
                    }}<span>个</span>
                  </p>
                </li>
              </ul>
            </div>

            <div class="info_box">
              <div class="home_sub"></div>
              <ul class="info_list">
                <li class="info_item">
                  <p class="name">放入公海池客户</p>
                  <p class="num">
                    {{ monthInfo.giving_up_customer_num || 0 }}<span>个</span>
                  </p>
                </li>
                <li class="info_item">
                  <p class="name">公海池领取</p>
                  <p class="num">
                    {{ monthInfo.receive_customer_num || 0 }}<span>个</span>
                  </p>
                </li>
              </ul>
            </div>

            <div class="info_box">
              <div class="home_sub">跟进汇总</div>
              <ul class="info_list">
                <li class="info_item">
                  <p class="name">跟进客户</p>
                  <p class="num">
                    {{ monthInfo.follow_num || 0 }}<span>个</span>
                  </p>
                </li>
                <li class="info_item">
                  <p class="name">跟进次数</p>
                  <p class="num">
                    {{ monthInfo.follow_count || 0 }}<span>次</span>
                  </p>
                </li>
              </ul>
            </div>

            <div class="info_box">
              <div class="home_sub">报价汇总</div>
              <ul class="info_list">
                <li class="info_item">
                  <p class="name">新增报价</p>
                  <p class="num">
                    {{ monthInfo.offer_num || 0 }}<span>个</span>
                  </p>
                </li>
                <li class="info_item">
                  <p class="name">关联报价</p>
                  <p class="num">
                    {{ monthInfo.relation_offer_num || 0 }}<span>个</span>
                  </p>
                </li>
              </ul>
            </div>

            <div class="info_box">
              <div class="home_sub">合同汇总</div>
              <ul class="info_list">
                <li class="info_item">
                  <p class="name">签约合同</p>
                  <p class="num">
                    {{ monthInfo.contract_num || 0 }}<span>个</span>
                  </p>
                </li>
                <li class="info_item">
                  <p class="name">合同金额</p>
                  <p class="num">
                    {{ monthInfo.index_current_contract_money || 0
                    }}<span>元</span>
                  </p>
                </li>
              </ul>
            </div>

            <div class="info_box">
              <div class="home_sub">回款汇总</div>
              <ul class="info_list">
                <li class="info_item">
                  <p class="name">已回款</p>
                  <p class="num">
                    {{ monthInfo.index_current_payment_collection || 0
                    }}<span>元</span>
                  </p>
                </li>
                <li class="info_item">
                  <p class="name">预计回款</p>
                  <p class="num">
                    {{ monthInfo.estimate_return_money || 0 }}<span>元</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="home_box">
        <!-- 销售简报 -->
        <div class="sale home_white">
          <div class="home_title d-between">
            销售简报
            <div class="d-flex">
              <!-- 部门 -->
              <el-popover
                popper-class="popover_back"
                placement="bottom-start"
                trigger="click"
                v-model="potSelect.visible"
              >
                <div class="reference" slot="reference" v-if="role_id != 4">
                  {{ potSelect.txt || (role_id == 3 ? "全部门" : "全公司") }}
                  <i class="iconfont icon-xl1"></i>
                </div>

                <div>
                  <div class="option" @click="change_pot(1)">
                    {{ role_id > 2 ? "全部门" : "全公司" }}
                  </div>
                  <div class="option" @click="change_pot(2)">仅本人</div>

                  <!-- 自定义 -->
                  <el-popover
                    popper-class="branch_popover"
                    placement="left-start"
                    trigger="click"
                    v-model="potSelect.show"
                  >
                    <div slot="reference">
                      <div class="option">自定义</div>
                    </div>

                    <div>
                      <div v-if="role_id == 3">
                        <div class="member_tabs d-center">
                          <div class="item">员工列表</div>
                        </div>
                        <div class="member_list" v-infinite-scroll="load">
                          <div
                            class="memeber_item"
                            v-for="(item, index) in member_list"
                            :key="index"
                            @click="pot_member(item)"
                          >
                            <span v-if="item.user">{{ item.user.name }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div class="back_tabs d-center">
                          <div
                            class="item"
                            :class="{
                              active: pot_activeTab == v.type,
                              l_item: i == 0,
                            }"
                            v-for="(v, i) in back_tabs"
                            :key="i"
                            @click="changPotTab(v.type)"
                          >
                            {{ v.name }}
                            <div class="line"></div>
                          </div>
                        </div>
                        <div
                          class="member_list"
                          v-if="pot_activeTab == 1"
                          v-infinite-scroll="load"
                        >
                          <div
                            class="memeber_item"
                            v-for="(item, index) in member_list"
                            :key="index"
                            @click="pot_member(item)"
                          >
                            <span v-if="item.user">{{ item.user.name }}</span>
                          </div>
                        </div>
                        <div class="depart_list" v-else>
                          <div
                            class="memeber_item"
                            v-for="(item, index) in department_list"
                            :key="index"
                            @click="pot_depart(item)"
                          >
                            {{ item.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </el-popover>

              <!-- 年月日 -->
              <el-popover
                popper-class="popover_date"
                placement="bottom-start"
                trigger="click"
                v-model="dashSelect.visible"
              >
                <div slot="reference" class="reference">
                  {{ dashSelect.txt }}
                  <i class="el-icon-date"></i>
                </div>

                <div>
                  <div class="select_time_box d-center">
                    <div>
                      <div
                        class="tip_item"
                        v-for="(item, index) in tipDate"
                        :key="index"
                      >
                        {{ item }}
                      </div>
                    </div>

                    <div class="items d-flex">
                      <div
                        class="item d-center"
                        v-for="(item, index) in dateList"
                        :key="index"
                        @click="change_dash(item)"
                      >
                        <div
                          class="txt d-center"
                          :class="{ active: dashSelect.txt == item }"
                        >
                          {{ item }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="self_txt">自定义</div>
                  <el-date-picker
                    v-model="dashSelect.time"
                    value-format="yyyy-MM-dd"
                    @change="time_dash"
                    @blur="blur_dash"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </div>
              </el-popover>
            </div>
          </div>

          <ul class="sale_list d-between">
            <li class="sale_item">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/xzht.png"
                alt=""
              />
              <div>
                <div class="sale_title">
                  <p class="tit">新增合同</p>
                  <p class="trend">
                    较{{ dashInfo.last_time_word || "" }}
                    <i
                      class="iconfont"
                      :class="{
                        add:
                          dashInfo.contract_count_percent &&
                          dashInfo.percent1 == 1,
                        sub:
                          dashInfo.contract_count_percent &&
                          dashInfo.percent1 == 2,
                        'icon-sq':
                          dashInfo.contract_count_percent &&
                          dashInfo.percent1 == 1,
                        'icon-xl1':
                          dashInfo.contract_count_percent &&
                          dashInfo.percent1 == 2,
                      }"
                    ></i>
                    <span>
                      {{
                        dashInfo.contract_count_percent
                          ? dashInfo.contract_count_percent + "%"
                          : "0%"
                      }}
                    </span>
                  </p>
                </div>

                <p class="num">
                  {{ dashInfo.new_contract_count || "0" }}
                  <span>单</span>
                </p>
              </div>
            </li>

            <div class="dash_line"></div>

            <li class="sale_item">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/htje.png"
                alt=""
              />
              <div>
                <div class="sale_title">
                  <p class="tit">合同金额</p>
                  <p class="trend d-flex">
                    较{{ dashInfo.last_time_word || "" }}
                    <i
                      class="iconfont"
                      :class="{
                        add:
                          dashInfo.contract_money_percent &&
                          dashInfo.percent2 == 1,
                        sub:
                          dashInfo.contract_money_percent &&
                          dashInfo.percent2 == 2,
                        'icon-sq':
                          dashInfo.contract_money_percent &&
                          dashInfo.percent2 == 1,
                        'icon-xl1':
                          dashInfo.contract_money_percent &&
                          dashInfo.percent2 == 2,
                      }"
                    ></i>
                    <span>
                      {{
                        dashInfo.contract_money_percent
                          ? dashInfo.contract_money_percent + "%"
                          : "0%"
                      }}
                    </span>
                  </p>
                </div>

                <p class="num">
                  {{
                    dashInfo.index_current_contract_money
                      ? dashInfo.index_current_contract_money
                      : "0"
                  }}
                  <span>元</span>
                </p>
              </div>
            </li>
            <div class="dash_line"></div>
            <li class="sale_item">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/yhk.png"
                alt=""
              />
              <div>
                <div class="sale_title">
                  <p class="tit">已回款</p>
                  <p class="trend d-flex">
                    较{{ dashInfo.last_time_word || "" }}
                    <i
                      class="iconfont"
                      :class="{
                        add:
                          dashInfo.payment_collection_percent &&
                          dashInfo.percent3 == 1,
                        sub:
                          dashInfo.payment_collection_percent &&
                          dashInfo.percent3 == 2,
                        'icon-sq':
                          dashInfo.payment_collection_percent &&
                          dashInfo.percent3 == 1,
                        'icon-xl1':
                          dashInfo.payment_collection_percent &&
                          dashInfo.percent3 == 2,
                      }"
                    ></i>
                    <span>
                      {{
                        dashInfo.payment_collection_percent
                          ? dashInfo.payment_collection_percent + "%"
                          : "0%"
                      }}
                    </span>
                  </p>
                </div>

                <p class="num">
                  {{
                    dashInfo.index_current_payment_collection
                      ? dashInfo.index_current_payment_collection
                      : "0"
                  }}
                  <span>元</span>
                </p>
              </div>
            </li>
          </ul>

          <ul class="sale_list d-between">
            <li class="sale_item">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/xzkh.png"
                alt=""
              />
              <div>
                <div class="sale_title">
                  <p class="tit">新增客户</p>
                  <p class="trend d-flex">
                    较{{ dashInfo.last_time_word || "" }}
                    <i
                      class="iconfont"
                      :class="{
                        add:
                          dashInfo.newly_added_customer_percent &&
                          dashInfo.percent4 == 1,
                        sub:
                          dashInfo.newly_added_customer_percent &&
                          dashInfo.percent4 == 2,
                        'icon-sq':
                          dashInfo.newly_added_customer_percent &&
                          dashInfo.percent4 == 1,
                        'icon-xl1':
                          dashInfo.newly_added_customer_percent &&
                          dashInfo.percent4 == 2,
                      }"
                    ></i>
                    <span>
                      {{
                        dashInfo.newly_added_customer_percent
                          ? dashInfo.newly_added_customer_percent + "%"
                          : "0%"
                      }}
                    </span>
                  </p>
                </div>

                <p class="num">
                  {{
                    dashInfo.newly_added_customer
                      ? dashInfo.newly_added_customer
                      : "0"
                  }}<span>人</span>
                </p>
              </div>
            </li>

            <div class="dash_line"></div>

            <li class="sale_item">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/xzcjkh.png"
                alt=""
              />
              <div>
                <div class="sale_title">
                  <p class="tit">新增成交客户</p>
                  <p class="trend d-flex">
                    较{{ dashInfo.last_time_word || "" }}
                    <i
                      class="iconfont"
                      :class="{
                        add:
                          dashInfo.newly_added_deal_customer_count_percent &&
                          dashInfo.percent5 == 1,
                        sub:
                          dashInfo.newly_added_deal_customer_count_percent &&
                          dashInfo.percent5 == 2,
                        'icon-sq':
                          dashInfo.newly_added_deal_customer_count_percent &&
                          dashInfo.percent5 == 1,
                        'icon-xl1':
                          dashInfo.newly_added_deal_customer_count_percent &&
                          dashInfo.percent5 == 2,
                      }"
                    ></i>
                    <span>
                      {{
                        dashInfo.newly_added_deal_customer_count_percent
                          ? dashInfo.newly_added_deal_customer_count_percent +
                            "%"
                          : "0%"
                      }}
                    </span>
                  </p>
                </div>

                <p class="num">
                  {{
                    dashInfo.newly_added_deal_customer_count
                      ? dashInfo.newly_added_deal_customer_count
                      : "0"
                  }}<span>人</span>
                </p>
              </div>
            </li>

            <div class="dash_line"></div>

            <li class="sale_item">
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/wgjkh.png"
                alt=""
              />
              <div>
                <div class="sale_title">
                  <p class="tit">未跟进客户</p>
                  <p class="trend d-flex">
                    较{{ dashInfo.last_time_word || "" }}
                    <i
                      class="iconfont"
                      :class="{
                        add:
                          dashInfo.not_follow_up_percent &&
                          dashInfo.percent6 == 1,
                        sub:
                          dashInfo.not_follow_up_percent &&
                          dashInfo.percent6 == 2,
                        'icon-sq':
                          dashInfo.not_follow_up_percent &&
                          dashInfo.percent6 == 1,
                        'icon-xl1':
                          dashInfo.not_follow_up_percent &&
                          dashInfo.percent6 == 2,
                      }"
                    ></i>
                    <span>
                      {{
                        dashInfo.not_follow_up_percent
                          ? dashInfo.not_follow_up_percent + "%"
                          : "0%"
                      }}
                    </span>
                  </p>
                </div>

                <p class="num">
                  {{ dashInfo.not_follow_up ? dashInfo.not_follow_up : "0" }}
                  <span>人</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="home_box">
        <!-- 目标完成情况 -->
        <div
          class="complete home_white home_item"
          v-if="role_id == 1 || role_id == 2"
        >
          <div class="home_title d-between">
            目标完成情况
            <el-select
              v-model="year_complete"
              placeholder="请选择年"
              @change="change_complete"
            >
              <el-option
                v-for="item in year_list"
                :key="item.year"
                :label="item.year"
                :value="item.year"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <div class="l_tabs d-center">
              <div
                class="item"
                :class="{ active: activeTab == v.type }"
                v-for="(v, i) in tabs"
                :key="i"
                @click="changTab(v.type)"
              >
                {{ v.name }}
              </div>
            </div>

            <div class="square_box" v-if="activeTab == 1">
              <div
                v-if="activeTab == 1 && department_annual_list.length > 0"
                class="square"
                v-for="(item, index) in department_annual_list"
                :key="index"
              >
                <div class="name">{{ item.depart && item.depart.name }}</div>
                <div class="money d-between">
                  <span class="already">￥{{ item.completion_money }}</span>
                  <span class="all">￥{{ item.money }}</span>
                </div>
                <el-progress
                  :percentage="item.percent"
                  :show-text="false"
                  color="#4D6FFF"
                ></el-progress>
              </div>
              <div
                class="page_empty"
                v-if="activeTab == 1 && department_annual_list.length == 0"
              >
                <img
                  src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
                />
              </div>
            </div>
            <div v-if="activeTab == 2">
              <div id="over" style="height: 250px"></div>
            </div>
          </div>
        </div>

        <!-- 回款统计 -->
        <div class="back home_white home_item">
          <div class="home_title d-between">
            回款统计
            <div class="d-flex">
              <!-- 部门 -->
              <el-popover
                popper-class="popover_back"
                placement="bottom-start"
                trigger="click"
                v-model="otherSelect.visible"
              >
                <div class="reference" slot="reference" v-if="role_id != 4">
                  {{ otherSelect.txt || (role_id == 3 ? "全部门" : "全公司") }}
                  <i class="iconfont icon-xl1"></i>
                </div>

                <div>
                  <div class="option" @click="change_other(1)">
                    {{ role_id > 2 ? "全部门" : "全公司" }}
                  </div>
                  <div class="option" @click="change_other(2)">仅本人</div>

                  <!-- 自定义 -->
                  <el-popover
                    popper-class="branch_popover"
                    placement="left-start"
                    trigger="click"
                    v-model="otherSelect.show"
                  >
                    <div slot="reference">
                      <div class="option">自定义</div>
                    </div>

                    <div>
                      <div v-if="role_id == 3">
                        <div class="member_tabs d-center">
                          <div class="item">员工列表</div>
                        </div>
                        <div class="member_list" v-infinite-scroll="load">
                          <div
                            class="memeber_item"
                            v-for="(item, index) in member_list"
                            :key="index"
                            @click="back_member(item)"
                          >
                            <span v-if="item.user">{{ item.user.name }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div class="back_tabs d-center">
                          <div
                            class="item"
                            :class="{
                              active: back_activeTab == v.type,
                              l_item: i == 0,
                            }"
                            v-for="(v, i) in back_tabs"
                            :key="i"
                            @click="changBackTab(v.type)"
                          >
                            {{ v.name }}
                            <div class="line"></div>
                          </div>
                        </div>
                        <div
                          class="member_list"
                          v-if="back_activeTab == 1"
                          v-infinite-scroll="load"
                        >
                          <div
                            class="memeber_item"
                            v-for="(item, index) in member_list"
                            :key="index"
                            @click="back_member(item)"
                          >
                            <span v-if="item.user">{{ item.user.name }}</span>
                          </div>
                        </div>
                        <div class="depart_list" v-else>
                          <div
                            class="memeber_item"
                            v-for="(item, index) in department_list"
                            :key="index"
                            @click="back_depart(item)"
                          >
                            {{ item.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </el-popover>

              <!-- 年月日 -->
              <el-popover
                popper-class="popover_date"
                placement="bottom-start"
                trigger="click"
                v-model="backSelect.visible"
              >
                <div slot="reference" class="reference">
                  {{ backSelect.txt }}
                  <i class="el-icon-date"></i>
                </div>

                <div>
                  <div class="select_time_box d-center">
                    <div>
                      <div
                        class="tip_item"
                        v-for="(item, index) in tipDate"
                        :key="index"
                      >
                        {{ item }}
                      </div>
                    </div>

                    <div class="items d-flex">
                      <div
                        class="item d-center"
                        v-for="(item, index) in dateList"
                        :key="index"
                        @click="change_back(item)"
                      >
                        <div
                          class="txt d-center"
                          :class="{ active: backSelect.txt == item }"
                        >
                          {{ item }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="self_txt">自定义</div>
                  <el-date-picker
                    v-model="backSelect.time"
                    value-format="yyyy-MM-dd"
                    @change="time_back"
                    @blur="blur_back"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </div>
              </el-popover>
            </div>
          </div>
          <div class="back_box d-between">
            <div class="back_pie">
              <el-progress
                :show-text="false"
                :width="168"
                :stroke-width="12"
                type="circle"
                :percentage="backInfo.percent_num"
                class="back_progress"
                color="#4D6FFF"
              >
              </el-progress>
              <div class="circleCenter">
                <div class="num">
                  <span>{{ backInfo.percent || 0 }}</span
                  >%
                </div>
                <div class="text">已完成</div>
              </div>
            </div>
            <ul class="global_txt back_txt">
              <li class="txt_box">
                <p class="title">计划回款<span>（元）</span></p>
                <p class="money">{{ backInfo.plan_money || 0 }}</p>
              </li>
              <li class="txt_box">
                <p class="title">已回款<span>（元）</span></p>
                <p class="money">{{ backInfo.han_return_money || 0 }}</p>
              </li>
              <li class="txt_box">
                <p class="title">未回款<span>（元）</span></p>
                <p class="money">{{ backInfo.no_pay_money || 0 }}</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- 签单对比 -->
        <div class="order home_white home_item">
          <div class="home_title d-between">
            签单对比
            <el-date-picker
              class="order_time"
              @change="time_order"
              v-model="orderSelect.activeDate"
              type="month"
              placeholder="选择月"
              :clearable="false"
            >
            </el-date-picker>
          </div>

          <div>
            <div id="main" style="height: 300px"></div>
          </div>
        </div>

        <!-- 业绩排行 -->
        <div class="rate home_white home_item">
          <div class="home_title d-between">
            业绩排行
            <div>
              <el-popover
                popper-class="popover_date"
                placement="bottom-start"
                trigger="click"
                v-model="achiSelect.visible"
              >
                <div class="reference" slot="reference">
                  {{ achiSelect.txt }}
                  <i class="el-icon-date"></i>
                </div>

                <div>
                  <div class="select_time_box d-center">
                    <div>
                      <div
                        class="tip_item"
                        v-for="(item, index) in tipDate"
                        :key="index"
                      >
                        {{ item }}
                      </div>
                    </div>

                    <div class="items d-flex">
                      <div
                        class="item d-center"
                        v-for="(item, index) in dateList"
                        :key="index"
                        @click="change_achi(item)"
                      >
                        <div
                          class="txt d-center"
                          :class="{ active: achiSelect.txt == item }"
                        >
                          {{ item }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="self_txt">自定义</div>
                  <el-date-picker
                    v-model="achiSelect.time"
                    value-format="yyyy-MM-dd"
                    @change="time_achi"
                    @blur="blur_achi"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </div>
              </el-popover>
            </div>
          </div>
          <div>
            <div v-if="achievementList.length > 0">
              <el-table
                ref="multipleTable"
                :data="achievementList.slice(0, 4)"
                style="width: 100%"
                :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
                :cell-style="{ color: '#657180', 'font-size': '12px' }"
              >
                <el-table-column label="排名" >
                  <template slot-scope="scope">
                    <div class="sort" :class="'sort_' + scope.row.idx">
                      {{ scope.row.idx }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="姓名" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.user && scope.row.user.name }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="部门" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{
                        scope.row.user &&
                        scope.row.user.department &&
                        scope.row.user.department.name
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="签单数" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.contract_num }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="签单金额" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.total_money }}
                    </div>
                  </template>
                </el-table-column>
                <template slot="empty">
                  <div class="table_empty">
                    <img
                      src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
                    />
                  </div>
                </template>
              </el-table>
              <div
                class="more"
                @click="perform"
                v-if="achievementList.length > 3"
              >
                更多排名
              </div>
            </div>
            <div class="page_empty" v-else>
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
              />
            </div>
          </div>
        </div>

        <!-- 销售产品 -->
        <div class="goods home_white home_item">
          <div class="home_title d-between">
            销售产品
            <el-popover
              popper-class="popover_date"
              placement="bottom-start"
              trigger="click"
              v-model="saleSelect.visible"
            >
              <div class="reference" slot="reference">
                {{ saleSelect.txt }}
                <i class="el-icon-date"></i>
              </div>

              <div>
                <div class="select_time_box d-center">
                  <div>
                    <div
                      class="tip_item"
                      v-for="(item, index) in tipDate"
                      :key="index"
                    >
                      {{ item }}
                    </div>
                  </div>

                  <div class="items d-flex">
                    <div
                      class="item d-center"
                      v-for="(item, index) in dateList"
                      :key="index"
                      @click="change_sale(item)"
                    >
                      <div
                        class="txt d-center"
                        :class="{ active: saleSelect.txt == item }"
                      >
                        {{ item }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="self_txt">自定义</div>
                <el-date-picker
                  v-model="saleSelect.time"
                  value-format="yyyy-MM-dd"
                  @change="time_sale"
                  @blur="blur_sale"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
            </el-popover>
          </div>

          <div class="goods_box" v-if="sell_show">
            <ul class="goods_list">
              <li
                class="goods_item"
                v-for="(v, i) in sellList"
                :key="i"
                v-if="i < 3"
              >
                <img
                  class="goods_img"
                  :class="'goods_img' + i"
                  :src="v.product"
                  alt=""
                />
                <img class="goods_num" :src="v.topImg" />
                <div class="goods_txt com-line-1">{{ v.product_name || "" }}</div>
              </li>
            </ul>
            <div class="more" @click="sale" v-if="sellList.length > 3">
              更多排名
            </div>
          </div>

          <div class="page_empty" v-else>
            <img
              src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 业绩排行 -->
    <perform v-if="performShow" ref="perform" @cancel="hideperform"></perform>
    <!-- 销售排行 -->
    <sale v-if="saleShow" ref="sale" @cancel="hidesale"></sale>
  </div>
</template>

<script>
import { getData } from "@/api/user";
import perform from "./component/perform.vue";
import sale from "./component/sale.vue";
import store from "@/store";
import { nextTick } from "q";

export default {
  name: "home",
  data() {
    return {
      activeMenu: "home",
      role_id: null,
      user: {},
      year: "",
      year_list: [],
      dateList: [],
      department_list: [],
      member_list: [],
      page: 1,
      last_page: 1,

      // 年度目标
      q_money: 0,
      current: {},
      my_annual: {}, // 我的
      annual: {}, // 企业
      year_global: "",

      annual_activeTab: 1,
      annual_tabs: [
        {
          name: "我的年度目标",
          type: 1,
        },
        {
          name: "部门目标",
          type: 2,
        },
      ],

      // 本月数据
      monthInfo: {},

      // 目标完成情况
      activeTab: 1,
      tabs: [
        {
          name: "部门目标",
          type: 1,
        },
        {
          name: "完成额对比",
          type: 2,
        },
      ],
      department_annual_list: [],
      chart_over: null,
      year_complete: "",

      // 回款计划
      back_activeTab: 1,
      back_tabs: [
        {
          name: "员工列表",
          type: 1,
        },
        {
          name: "部门列表",
          type: 2,
        },
      ],
      backInfo: {},
      backSelect: {
        visible: false,
        activeDate: "本年度",
        time: "",
        txt: "本年度",
      },
      otherSelect: {
        visible: false,
        show: false,
        txt: "",
      },

      // 销售简报
      dashInfo: {},
      dashSelect: {
        visible: false,
        activeDate: "本年度",
        time: "",
        txt: "本年度",
      },
      potSelect: {
        visible: false,
        show: false,
        txt: "",
      },
      pot_activeTab: 1,

      // 签单对比
      chart: null,
      chartsDataLine1: {},
      orderSelect: {
        activeDate: "",
      },

      // 业绩排行
      topImgs: [
        "direct/resource/202202/25/4M7eSQchwcKYC3F5FbyRhFaMwYDSZp3f1645754278394.png",
        "direct/resource/202202/25/sXyzdWFSTzz7w6KAbe4PPsfT6QGHKAHJ1645754323319.png",
        "direct/resource/202202/25/hD5bxQc2dntrWi3ccB84Dk8cfYtbZtPB1645754333279.png",
      ],

      performShow: false,
      achievementList: [],
      achiSelect: {
        visible: false,
        activeDate: "本年度",
        time: "",
        txt: "本年度",
      },

      // 销售产品
      saleShow: false,
      sellList: [],
      sell_show: true,
      saleSelect: {
        visible: false,
        activeDate: "本年度",
        time: "",
        txt: "本年度",
      },

      tipDate: ["天", "周", "月", "季", "年"],
    };
  },
  created: function () {
    // this.get_year();
    // this.get_member();
    this.init();
  },
  mounted() {
    window.addEventListener("resize", () => {
      nextTick(() => {
        if (this.chart) {
          this.chart.resize();
        }
        if (this.chart_over) {
          this.chart_over.resize();
        }
      });
    });
  },
  methods: {
    init() {
      // 当前年为激活年
      const d = new Date();
      const year = d.getFullYear();
      const month = this.formater(d.getMonth() + 1);
      getData({
        url: "/index/achievement_sale_bill",
        data: {
          achievement_timing: "本年度",
          sale_timing: "本年度",
          timing: "本年度",
          bill_timing: `${year}-${month}`,
        },
      }).then((res) => {
        const {
          code,
          data: {
            time_search,
            user,
            performance_ranking,
            contract_product,
            departments,
            days,
            plan_money,
            han_return_money,
            no_pay_money,
            pay_percent,
            department_annual_list,
            my_completion_money,
            my_money,
            my_percent,
            completion_money,
            money,
            percent,
            department_list,
            Month_data_summary,
            company_department_member,
            year,
            q_money,
          },
        } = res;
        if (code == 200) {
          this.user = user;
          this.role_id = this.user.role_id;
          this.dateList = time_search;
          // 年
          const d = new Date();
          const y = d.getFullYear();
          const m = this.formater(d.getMonth() + 1);
          this.year_list = year;
          let bol = false;
          this.year_list &&
            this.year_list.forEach((v) => {
              if (v.year == y) {
                bol = true;
              }
              v.year = v.year + "年";
            });
          if (bol) {
            this.year = y + "年";
            this.year_global = y + "年";
            this.year_complete = y + "年";
          }
          this.orderSelect.activeDate = `${y}-${m}`;

          // 员工列表
          this.page = 1;
          let user_list = company_department_member.user_list;
          let user_data = user_list && user_list.data;
          this.member_list = user_data;
          this.last_page = user_list ? user_list.last_page : 1

          // 公司目标
          this.q_money = q_money;
          this.my_annual = {
            completion_money: my_completion_money || "0.00",
            money: my_money || "0.00",
            percent: my_percent || 0,
            percent_num: (my_percent > 100 ? 100 : my_percent) || 0,
          };
          this.annual = {
            completion_money: completion_money || "0.00",
            money: money || "0.00",
            percent: percent || 0,
            percent_num: (percent > 100 ? 100 : percent) || 0,
          };

          this.current =
            this.role_id == 1 || this.role_id == 2
              ? this.annual
              : this.my_annual;

          // 本月数据汇总
          // this.getInfo();
          this.monthInfo = Month_data_summary;

          // 目标完成情况
          this.department_annual_list = department_annual_list;
          this.department_annual_list &&
            this.department_annual_list.map((v, i) => {
              v.percent = (v.percent > 100 ? 100 : v.percent) || 0;
            });
          this.departments = department_list;

          // 回款统计
          this.backInfo = {
            plan_money: plan_money || 0,
            han_return_money: han_return_money || 0,
            no_pay_money: no_pay_money || 0,
            percent: pay_percent || 0,
            percent_num: (pay_percent > 100 ? 100 : pay_percent) || 0,
          };

          // 销售简报
          this.getDash();

          // 签单对比
          nextTick(() => {
            this.chart = this.$echarts.init(document.getElementById("main"));
            // x轴
            let newDays = days;
            let dayArr = [];
            newDays.map((e, i) => {
              if ((i + 1) % 5 == 0 || i == 0) {
                dayArr.push(e);
              } else {
                dayArr.push("");
              }
            });

            dayArr[dayArr.length - 1] = days[days.length - 1];

            if (newDays.length > 30) {
              dayArr[dayArr.length - 2] = "";
            }

            // 数据
            let dArr = departments;
            let y = [];
            if (dArr.length > 0) {
              dArr.map((e) => {
                e.data = e.department_month_value;
                e.type = "line";
                y.push(e.name);
              });
              this.chartsDataLine1 = {
                tooltip: {
                  trigger: "axis",
                },
                legend: {
                  data: y,
                  x: "center",
                  y: "bottom",
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "20%",
                  top: "5%",
                  containLabel: true,
                },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: days,
                },
                yAxis: {
                  type: "value",
                },
                series: dArr,
              };
            } else {
              this.chartsDataLine1 = {
                tooltip: {
                  trigger: "axis",
                },
                legend: {
                  data: y,
                  x: "center",
                  y: "bottom",
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "20%",
                  top: "5%",
                  containLabel: true,
                },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: days,
                },
                yAxis: {
                  type: "value",
                },
                series: [
                  {
                    name: "",
                    type: "line",
                    data: [0],
                  },
                ],
              };
            }

            this.chart.setOption(this.chartsDataLine1);
          });

          // 业绩排行
          let perArr = performance_ranking;
          perArr.map((e, i) => {
            e.idx = i + 1;
          });
          this.achievementList = perArr;

          // 销售产品
          let productArr = contract_product;
          let arr = [
            {
              product:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202205/17/%E9%A3%9E%E4%B9%A620220517-092730.png",
              product_name: "-",
              topImg:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/25/sXyzdWFSTzz7w6KAbe4PPsfT6QGHKAHJ1645754323319.png",
            },
            {
              product:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202205/17/%E9%A3%9E%E4%B9%A620220517-092730.png",
              product_name: "-",
              topImg:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/25/4M7eSQchwcKYC3F5FbyRhFaMwYDSZp3f1645754278394.png",
            },
            {
              product:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202205/17/%E9%A3%9E%E4%B9%A620220517-092730.png",
              product_name: "-",
              topImg:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/25/hD5bxQc2dntrWi3ccB84Dk8cfYtbZtPB1645754333279.png",
            },
          ];

          this.sell_show = productArr.length > 0;
          productArr &&
            productArr.map((e, i) => {
              if (i == 0) {
                e.topImg = arr[1].topImg;
                arr[1] = e;
              } else if (i == 1) {
                e.topImg = arr[0].topImg;
                arr[0] = e;
              } else if (i == 2) {
                e.topImg = arr[2].topImg;
                arr[2] = e;
              } else {
                arr[i] = e;
              }
            });
          this.sellList = arr;
        }
      });
    },

    get_department() {
      getData({
        url: "/department/list ",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { department_list, msg },
        } = res;
        if (code === 200) {
          this.department_list = department_list;
        } else {
          this.department_list = [];
          this.$err(msg);
        }
      });
    },

    get_member() {
      getData({
        url: "/company/company_department_member",
        data: {
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          let data = user_list && user_list.data;
          if (this.page != 1) {
            this.member_list = data.concat(this.member_list);
          } else {
            this.member_list = data;
          }
          this.last_page = user_list ? user_list.last_page : 1
        }
      });
    },
    // -----------------------业绩目标-----------------------
    get_year() {
      let url = "";
      if (this.user.role_id < 3) {
        url = `/achievement/achievement_year_director`;
      } else if (this.user.role_id == 3) {
        url = `/achievement/achievement_department_year?department_id=${this.user.department_id}`;
      }
      getData({
        url,
        data: {},
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        if (code === 200) {
          const d = new Date();
          const y = d.getFullYear();
          const m = this.formater(d.getMonth() + 1);
          this.year_list = list;
          let bol = false;
          this.year_list &&
            this.year_list.forEach((v) => {
              if (v.year == y) {
                bol = true;
              }
              v.year = v.year + "年";
            });
          if (bol) {
            this.year = y + "年";
            this.year_global = y + "年";
            this.year_complete = y + "年";
          }
          this.orderSelect.activeDate = `${year}-${month}`;
        } else {
          this.$err(msg);
        }
      });
    },
    formater(n) {
      return n >= 10 ? n : "0" + n;
    },
    change_global(type) {
      let year = this.year_global.slice(0, this.year_global.length - 1);
      getData({
        url: "/index/annual_target",
        data: {
          year,
        },
      }).then((res) => {
        const {
          code,
          data: {
            my_completion_money,
            my_money,
            my_percent,
            completion_money,
            money,
            percent,
            q_money,
          },
        } = res;
        if (code === 200) {
          this.q_money = q_money;
          this.my_annual = {
            completion_money: my_completion_money || "0.00",
            money: my_money || "0.00",
            percent: my_percent || 0,
            percent_num: (my_percent > 100 ? 100 : my_percent) || 0,
          };
          this.annual = {
            completion_money: completion_money || "0.00",
            money: money || "0.00",
            percent: percent || 0,
            percent_num: (percent > 100 ? 100 : percent) || 0,
          };

          if (type == 1) {
            this.current =
              this.role_id == 1 || this.role_id == 2
                ? this.annual
                : this.my_annual;
          } else {
            this.current = this.annual;
          }
        }
      });
    },
    changAnTab(type) {
      this.annual_activeTab = type;
      this.change_global(type);
    },
    // -----------------------本月数据汇总-----------------------
    getInfo() {
      getData({
        url: "/index/month_data_summary",
        data: {},
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.monthInfo = data;
        }
      });
    },

    // -----------------------目标完成情况-----------------------
    changTab(type) {
      this.activeTab = type;
      if (this.activeTab == 2) {
        this.over();
      }
    },
    over() {
      nextTick(() => {
        let y = [];
        this.departments.map((e) => {
          e.data = e.department_month_value;
          e.type = "line";
          y.push(e.name);
        });

        this.chart_over = this.$echarts.init(document.getElementById("over"));
        this.chart_over.setOption({
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: y,
            x: "center",
            y: "bottom",
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "20%",
            top: "5%",
            containLabel: true,
          },
          yAxis: {
            type: "value",
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
            ],
          },
          series: this.departments,
        });
      });
    },
    change_complete() {
      let year = this.year_complete.slice(0, this.year_complete.length - 1);
      getData({
        url: "/index/target_detail",
        data: {
          year,
        },
      }).then((res) => {
        const {
          code,
          data: { department_annual_list, departments },
        } = res;
        if (code === 200) {
          this.department_annual_list = department_annual_list;
          this.department_annual_list &&
            this.department_annual_list.map((v, i) => {
              v.percent = (v.percent > 100 ? 100 : v.percent) || 0;
            });
          this.departments = departments;
        }
      });
    },
    to_target() {
      this.$router.push({
        path: "/target",
      });
    },
    // -----------------------回款统计-----------------------
    getBack(type, id, name) {
      let info = this.backSelect;
      let timing = info.activeDate;
      if (info.time.length > 0) {
        timing = info.time;
      }

      
      let user_id = this.user.id;
      let department_id = this.user.department_id;
      if (type == 1) {
        user_id = "";
        department_id = this.user.department_id;
        this.otherSelect.txt = this.role_id > 2 ? "全部门" : "全公司";
      } else if (type == 2) {
        user_id = this.user.id;
        department_id = "";
        this.otherSelect.txt = "仅本人";
      } else if (type == 3) {
        user_id = id;
        department_id = "";
        this.otherSelect.txt = name;
      } else if (type == 4) {
        user_id = "";
        department_id = id;
        this.otherSelect.txt = name;
      } 

      getData({
        url: "/index/payment_collection_statistics",
        data: {
          timing,
          user_id,
          department_id,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          data.percent = data.percent || 0;
          data.percent_num = (data.percent > 100 ? 100 : data.percent) || 0;
          this.backInfo = data;
        }
      });
    },

    change_back(item) {
      this.backSelect = {
        visible: false,
        activeDate: item,
        time: [],
        txt: item,
      };
      this.getBack();
    },

    time_back(e) {
      this.backSelect = {
        visible: false,
        activeDate: "",
        time: e,
        txt: `${e[0]}至${e[1]}`,
      };
    },

    blur_back() {
      this.getBack();
    },

    change_other(e) {
      this.getBack(e);
      this.otherSelect.visible = false;
      this.otherSelect.show = false;
    },

    changBackTab(type) {
      this.back_activeTab = type;
      this.page = 1;
      if (type == 1) {
        this.get_member();
      } else {
        this.get_department();
      }
    },

    back_member(v) {
      this.getBack(3, v.user_id, v.user.name);
      this.otherSelect.visible = false;
      this.otherSelect.show = false;
    },

    back_depart(v) {
      this.getBack(4, v.id, v.name);
      this.otherSelect.visible = false;
      this.otherSelect.show = false;
    },
    load() {
      if (this.page < this.last_page) {
        this.page += 1;
        this.get_member();
      }
    },

    // -----------------------销售简报-----------------------
    getDash(type, id, name) {
      let info = this.dashSelect;
      let timing = info.activeDate;
      if (info.time.length > 0) {
        timing = info.time;
      }

      let user_id = this.role_id == 4 ? this.user.id : "";
      let department_id = this.role_id == 3 ? this.user.department_id : "";
      if (type == 1) {
        user_id = "";
        department_id = this.user.department_id;
        this.potSelect.txt = this.role_id > 2 ? "全部门" : "全公司";
      } else if (type == 2) {
        user_id = this.user.id;
        department_id = "";
        this.potSelect.txt = "仅本人";
      } else if (type == 3) {
        user_id = id;
        department_id = "";
        this.potSelect.txt = name;
      } else if (type == 4) {
        user_id = "";
        department_id = id;
        this.potSelect.txt = name;
      } else {
        user_id = this.role_id == 4 ? this.user.id : "";
        department_id = this.role_id == 3 ? this.user.department_id : "";
      }

      getData({
        url: "/index/dashboard",
        data: {
          timing,
          user_id,
          department_id,
        },
      }).then((res) => {
        const {
          code,
          data: { comprehensive },
        } = res;
        if (code === 200) {
          this.dashInfo = comprehensive;
        }
      });
    },
    change_dash(item) {
      this.dashSelect = {
        visible: false,
        activeDate: item,
        time: [],
        txt: item,
      };
      this.getDash();
    },

    time_dash(e) {
      this.dashSelect = {
        visible: false,
        activeDate: "",
        time: e,
        txt: `${e[0]}至${e[1]}`,
      };
    },

    blur_dash() {
      this.getDash();
    },

    change_pot(e) {
      this.getDash(e);
      this.potSelect.visible = false;
      this.potSelect.show = false;
    },

    changPotTab(type) {
      this.pot_activeTab = type;
      this.page = 1;
      if (type == 1) {
        this.get_member();
      } else {
        this.get_department();
      }
    },
    pot_member(v) {
      this.getDash(3, v.user_id, v.user.name);
      this.potSelect.visible = false;
      this.potSelect.show = false;
    },
    pot_depart(v) {
      this.getDash(4, v.id, v.name);
      this.potSelect.visible = false;
      this.potSelect.show = false;
    },
    // -----------------------签单对比-----------------------
    getOrder() {
      getData({
        url: "/index/signature_comparison",
        data: {
          month: this.orderSelect.activeDate,
        },
      }).then((res) => {
        const {
          code,
          data: { days, departments },
        } = res;
        if (code === 200) {
          nextTick(() => {
            // x轴
            let newDays = days;
            let dayArr = [];
            newDays.map((e, i) => {
              if ((i + 1) % 5 == 0 || i == 0) {
                dayArr.push(e);
              } else {
                dayArr.push("");
              }
            });

            dayArr[dayArr.length - 1] = days[days.length - 1];

            if (newDays.length > 30) {
              dayArr[dayArr.length - 2] = "";
            }
            // 数据
            let dArr = departments;
            let y = [];
            if (dArr.length > 0) {
              dArr.map((e) => {
                e.data = e.department_month_value;
                e.type = "line";
                y.push(e.name);
              });
              this.chartsDataLine1 = {
                tooltip: {
                  trigger: "axis",
                },
                legend: {
                  data: y,
                  x: "center",
                  y: "bottom",
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "20%",
                  top: "5%",
                  containLabel: true,
                },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: days,
                },
                yAxis: {
                  type: "value",
                },
                series: dArr,
              };
            } else {
              this.chartsDataLine1 = {
                tooltip: {
                  trigger: "axis",
                },
                legend: {
                  data: y,
                  x: "center",
                  y: "bottom",
                },
                grid: {
                  left: "3%",
                  right: "4%",
                  bottom: "20%",
                  top: "5%",
                  containLabel: true,
                },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: days,
                },
                yAxis: {
                  type: "value",
                },
                series: [
                  {
                    name: "",
                    data: [],
                  },
                ],
              };
            }
            this.chart.setOption(this.chartsDataLine1);
          });
        }
      });
    },
    time_order(e) {
      this.orderSelect.activeDate = e;
      this.getOrder();
    },

    // -----------------------业绩排行-----------------------
    perform(v) {
      this.performShow = true;
      this.$nextTick(() => {
        this.$refs.perform.init();
      });
    },

    hideperform() {
      this.performShow = false;
      this.init();
    },
    getAchi() {
      let info = this.achiSelect;
      let timing = info.activeDate;
      if (info.time.length > 0) {
        timing = info.time;
      }

      getData({
        url: "/index/performance_ranking",
        data: {
          timing,
        },
      }).then((res) => {
        const {
          code,
          data: {
            performance_ranking: { data },
          },
        } = res;
        if (code === 200) {
          let arr = data;
          arr.map((e, i) => {
            e.idx = i + 1;
          });
          this.achievementList = arr;
        }
      });
    },

    change_achi(item) {
      this.achiSelect = {
        visible: false,
        activeDate: item,
        time: [],
        txt: item,
      };
      this.getAchi();
    },
    time_achi(e) {
      this.achiSelect = {
        visible: false,
        activeDate: "",
        time: e,
        txt: `${e[0]}至${e[1]}`,
      };
    },

    blur_achi() {
      this.getAchi();
    },

    // -----------------------销售产品-----------------------
    sale(v) {
      this.saleShow = true;
      this.$nextTick(() => {
        this.$refs.sale.init();
      });
    },

    hidesale() {
      this.saleShow = false;
      this.init();
    },

    getSale() {
      let info = this.saleSelect;
      let timing = info.activeDate;
      if (info.time.length > 0) {
        timing = info.time;
      }
      this.sellList = [];
      getData({
        url: "/index/sale_product",
        data: {
          timing,
        },
      }).then((res) => {
        const {
          code,
          data: {
            contract_product: { data },
          },
        } = res;
        if (code === 200) {
          let productArr = data;
          let arr = [
            {
              product:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202205/17/%E9%A3%9E%E4%B9%A620220517-092730.png",
              product_name: "-",
              topImg:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/25/sXyzdWFSTzz7w6KAbe4PPsfT6QGHKAHJ1645754323319.png",
            },
            {
              product:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202205/17/%E9%A3%9E%E4%B9%A620220517-092730.png",
              product_name: "-",
              topImg:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/25/4M7eSQchwcKYC3F5FbyRhFaMwYDSZp3f1645754278394.png",
            },
            {
              product:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202205/17/%E9%A3%9E%E4%B9%A620220517-092730.png",
              product_name: "-",
              topImg:
                "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/25/hD5bxQc2dntrWi3ccB84Dk8cfYtbZtPB1645754333279.png",
            },
          ];

          this.sell_show = productArr.length > 0;
          productArr &&
            productArr.map((e, i) => {
              if (i == 0) {
                e.topImg = arr[1].topImg;
                arr[1] = e;
              } else if (i == 1) {
                e.topImg = arr[0].topImg;
                arr[0] = e;
              } else if (i == 2) {
                e.topImg = arr[2].topImg;
                arr[2] = e;
              } else {
                arr[i] = e;
              }
            });
          this.sellList = arr;
        }
      });
    },

    change_sale(item) {
      this.saleSelect = {
        visible: false,
        activeDate: item,
        time: [],
        txt: item,
      };
      this.getSale();
    },
    time_sale(e) {
      this.saleSelect = {
        visible: false,
        activeDate: "",
        time: e,
        txt: `${e[0]}至${e[1]}`,
      };
    },

    blur_sale() {
      this.getSale();
    },
  },
  components: {
    perform,
    sale,
  },
};
</script>

<style lang='less' scoped>
.com_right_main {
  padding: 16px 24px;
  .home_white {
    background: #fff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
  }

  .home_title {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #464c5b;
    margin-bottom: 14px;
  }

  .home_box {
    width: 100%;
    margin-bottom: 25px;
  }
  .home_flex {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: stretch;
  }

  .global {
    width: 480px;
    margin-right: 25px;
    padding: 20px 25px 32px;

    .current_box {
      height: 50px;
    }

    .global_pie {
      position: relative;
      text-align: center;
      width: 168px;
      margin-left: 28%;
      margin-bottom: 34px;
    }

    .circleCenter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .num {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #4d6fff;
        margin-bottom: 4px;
        span {
          font-size: 28px;
        }
      }
      .text {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;
      }
    }
    .back_txt {
      margin: 0 0 0 100px;
    }
  }

  .global_txt {
    width: 140px;
    margin: 0 auto;

    .txt_box {
      margin-bottom: 18px;
    }

    .money_btn {
      width: 105px;
      height: 32px;
      background: #f3f3f3;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 32px;
      color: #9ea7b4;
      padding: 0 12px;
      cursor: pointer;
    }

    .title {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
      margin-bottom: 6px;
      span {
        color: #9ea7b4;
      }
    }

    .money {
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      color: #464c5b;
      word-break: break-all;
    }
  }

  .info {
    flex: 1;
    padding: 26px 24px 18px;
    min-height: 480px;

    .info_box {
      display: inline-block;
      margin-right: 25px;
      width: calc((100% - 25px) / 2);

      &:nth-child(2n) {
        margin-right: 0;
      }

      @media only screen and (max-width: 1366px) {
        width: 100%;
      }
    }
    .home_sub {
      font-size: 12px;
      font-weight: 600;
      line-height: 17px;
      color: #464c5b;
      margin-bottom: 13px;
    }

    .info_list {
      margin-bottom: 18px;
      .info_item {
        display: inline-block;
        width: calc((100% - 25px) / 2);
        height: 72px;
        border-radius: 8px;
        margin-right: 25px;
        padding: 12px;
        box-shadow: rgb(0 0 0 / 8%) 0px 0px 10px 1px inset;

        &:nth-child(2n) {
          margin-right: 0;
        }

        .name {
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #657180;
          margin-bottom: 10px;
        }
        .num {
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
          color: #464c5b;

          span {
            margin-left: 5px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: #657180;
          }
        }
      }
    }
  }

  /*-----------目标完成情况-------------------*/
  .complete {
    .square_box {
      height: 260px;
      overflow-x: hidden;
      overflow-y: auto;
      padding-right: 20px;
    }
    .square {
      margin-top: 26px;
      .name {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;
        margin-bottom: 4px;
      }
      .money {
        margin-bottom: 8px;
        .already {
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #657180;
        }
        .all {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #ff9d00;
        }
      }
    }
  }

  /*---------- 回款计划-------------------*/
  .back {
    .back_box {
      margin-top: 80px;
      padding: 0 15%;
      @media only screen and (max-width: 1366px) {
        padding: 0 4%;
      }
    }
    .back_pie {
      position: relative;
      text-align: center;
      width: 168px;
    }

    .circleCenter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .num {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #4d6fff;
        margin-bottom: 4px;
        span {
          font-size: 28px;
        }
      }
      .text {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;
      }
    }
    .text {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
    }
    .back_txt {
      margin: 0;
    }
  }

  /*-----------签单对比-------------------*/
  .order {
    /deep/.order_time {
      width: 100px;
      height: 32px;

      .el-input__inner {
        height: 32px;
        line-height: 32px;
        padding-right: 0;
      }

      .el-input__icon {
        line-height: 32px;
      }
    }
  }

  /*-----------业绩排行-------------------*/
  /deep/.el-table {
    th {
      padding: 0 !important;
      height: 42px !important;
      background-color: #f3f7f9 !important;
    }
    td {
      padding: 0 !important;
      height: 48px !important;
    }

    .cell {
      overflow: initial;
    }

    .is-leaf {
      overflow: initial !important;
    }
  }

  .rate {
    flex: 1;
  }

  .sort {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
  }
  .sort_1 {
    background: #ffce29;
    color: #fff;
  }

  .sort_2 {
    background: #bcbbb6;
    color: #fff;
  }

  .sort_3 {
    background: #d57d17;
    color: #fff;
  }

  .sale {
    width: 100%;
    padding: 26px 24px 56px;
    margin-bottom: 25px;
  }

  .sale_list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 48px;
    padding: 0 2%;
    .sale_item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      min-width: 290px;
    }
    .dash_line {
      width: 0px;
      height: 41px;
      border-right: 1px solid #EAEAEA;
    }
    img {
      height: 48px;
      width: 48px;
      margin-right: 24px;
    }
    .sale_title {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
    }

    .tit {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
      width: 100px;
    }

    .trend {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;

      .iconfont {
        margin: 0 -4px 0 10px;
        font-size: 12px;
      }

      span {
        font-size: 12px;
        font-weight: 600;
        line-height: 17px;
        color: #464c5b;
      }

      .add {
        color: #ff4500 !important;
      }

      .sub {
        color: #2ab22a !important;
      }
    }

    .num {
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      color: #464c5b;
      span {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;
        margin-left: 3px;
      }
    }

    // .price {
    //   font-size: 16px;
    //   font-weight: 600;
    //   color: #ff9d00;
    // }

    // .num {
    //   font-size: 16px;
    //   font-weight: 600;
    //   color: #4d6fff;
    // }
  }

  /*-----------销售产品-------------------*/
  .goods {
    .goods_list {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 56px;
      margin-top: 72px;
    }
    .goods_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .goods_img {
      display: block;
      width: 89px;
      height: 89px;
      opacity: 1;
      border-radius: 4px;
      margin-bottom: 12px;
    }
    .goods_img1 {
      width: 111px;
      height: 111px;
    }
    .goods_num {
      display: block;
      width: 24px;
      height: 24px;
      margin-bottom: 12px;
    }
    .goods_txt {
      width: 100px;
      text-align: center;
    }
  }
}

/deep/.el-select {
  width: 100px;
  height: 32px;

  .el-input__inner {
    height: 32px;
    line-height: 32px;
    padding: 10px;
  }

  .el-input__icon {
    line-height: 25px;
  }
}

.page_empty {
  background: #fff !important;
  border: none !important;
  padding: 20px 0 !important;
  img {
    height: 200px;
  }
}

.more {
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #3399ff;
  margin-top: 20px;
  cursor: pointer;
}

.time_box {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 12px;
  .time_item {
    display: inline-block;
    width: 50%;
    text-align: center;
  }
  .time_square {
    width: 50px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    margin: 0 auto;
    cursor: pointer;
    margin-bottom: 3px;
  }
  .time_square:hover {
    background: #f3f2f3;
  }
}
.self {
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #657180;
  margin-bottom: 12px;
}

.home_item {
  float: left;
  min-height: 400px;
  width: calc((100% - 25px) / 2);
  padding: 26px 24px;
  margin-right: 25px;
  margin-bottom: 25px;
  &:nth-child(2n) {
    margin-right: 0;
  }
}

.l_tabs {
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;

  .item {
    min-width: 80px;
    padding: 0 10px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    background: #F4F7FB;
    border: 1px solid #e9ecf2;

    font-size: 12px;
    font-weight: 400;
    color: #9ea7b4;
    cursor: pointer;
  }

  .active {
    font-weight: 600;
    color: #4d6fff;
    background: #fff;
  }
}

/deep/.el-date-editor {
  width: 100%;
}
</style>


<style lang="less">
.popover_classify {
  width: 375px !important;
}

.popover_back {
  width: 150px !important;

  .option {
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
  .option:hover {
    background: #f3f3f3;
  }
}

.el-date-editor .el-range-separator {
  padding: 0 25px !important;
}

.reference {
  cursor: pointer;
  border: 1px solid red;
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding: 0 12px;
  border: 1px solid #d6dde6;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #9ea7b4;
}
</style>

<style lang="less">
// 部门筛选
.branch_popover {
  padding: 17px 30px 10px;
  width: 250px;
  height: 331px;
  background: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
}

.back_tabs {
  overflow: hidden;
  flex-shrink: 0;

  .item {
    width: 50px;
    font-size: 12px;
    font-weight: 400;
    color: #657180;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;

    .line {
      margin-top: 13px;
      width: 100%;
      height: 4px;
      background: #fff;
      border-radius: 4px;
    }
  }
  .l_item {
    margin-right: 30px;
  }

  .active {
    color: #4d6fff;
    font-weight: 600;

    .line {
      background-color: #4d6fff;
    }
  }
}
.member_tabs {
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
  .item {
    width: 80px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-bottom: 4px solid #fff;
    font-size: 12px;
    font-weight: 600;
    color: #464c5b;
    cursor: pointer;
    padding-bottom: 10px;
  }
}
.member_list {
  padding: 10px 0;
  height: 260px;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.depart_list {
  padding: 10px 0;
  height: 260px;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.memeber_item {
  height: 30px;
  line-height: 30px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
}
.memeber_item:hover {
  background: #f3f2f3;
}
</style>