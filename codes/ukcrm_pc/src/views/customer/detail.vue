<template>
  <div class="customer_detail">
    <div class="top_info d-flex">
      <div class="com_card info_main">
        <div class="name d-flex">
          {{ customer.name || '未填写' }}
          <div class="tag d-center" v-if="customer.tag_name">
            {{ customer.tag_name }}
          </div>

          <el-tooltip
            class="item-tooltip"
            effect="dark"
            :content="levelValue"
            :disabled="isShowTooltip"
            placement="bottom-start"
          >
            <el-rate
              class="rate"
              v-model="value"
              :max="value"
              disabled
              text-color="#ff9900"
              @mouseover="onMouseOver(str)"
            >
            </el-rate>
          </el-tooltip>

          <el-dropdown
            @visible-change="dropShow"
            trigger="click"
            placement="bottom"
            class="edit"
            @command="handleCommand"
            v-if="customer_belong && queryType != 'revoke'"
          >
            <div :class="dropClick ? 'edit-box_active' : 'edit-box'">
              <div class="edit-icon"></div>
              <div class="edit-icon"></div>
              <div class="edit-icon"></div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="editCustomer">编辑</el-dropdown-item>
              <el-dropdown-item command="moveCustomer">移交</el-dropdown-item>
              <el-dropdown-item
                v-if="customer.customer_status !== 1"
                command="overFollow"
                >放弃</el-dropdown-item
              >
              <el-dropdown-item command="changeCustomer"
                >更改客户级别</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-dialog
          title="客户级别"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="dialogCustmerVisible"
          width="533px"
          height="233px"
        >
          <el-form label-position="top">
            <el-form-item label="客户级别" :label-width="formLabelWidth">
              <el-select
                @change="levalChange"
                v-model="levelSelect"
                placeholder="请选择客户级别"
              >
                <el-option
                  label="A类(重要客户)"
                  value="A类(重要客户)"
                ></el-option>
                <el-option
                  label="B类(普通客户)"
                  value="B类(普通客户)"
                ></el-option>
                <el-option
                  label="C类(非优先客户)"
                  value="C类(非优先客户)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCustmerVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitLevel">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="备注"
          :visible.sync="dialogRemarkVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="533px"
          height="233px"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 8 }"
            placeholder="请输入内容"
            show-word-limit
            maxlength="150"
            v-model="newRemark"
          >
          </el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRemarkVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitRemark">确 定</el-button>
          </div>
        </el-dialog>

        <div class="information d-flex">
          <div class="item">
            联系方式：<span>{{ customer.phone || customer.wechat }}</span>
          </div>

          <div class="line"></div>

          <div class="item">
            关联企业：<span>{{ customer.company || "" }}</span>
          </div>

          <div class="line" v-if="chargeInfo && chargeInfo.user"></div>
          <div class="item" v-if="chargeInfo && chargeInfo.user">
            负责人：<span>{{
              chargeInfo.user ? chargeInfo.user.name : ""
            }}</span>
          </div>

          <div
            class="line"
            v-if="
              customer.customer_status == 0 && customer.customer_prescription
            "
          ></div>
          <div
            class="item"
            v-if="
              customer.customer_status == 0 && customer.customer_prescription
            "
          >
            跟进时效：<span>{{ customer.customer_prescription.end_time }}</span>
          </div>
        </div>
        <div class="remark d-flex">
          <span>
            <i @click="editRemark" class="iconfont icon-ykb-gj"></i>
            {{ remark || '未填写' }}
          </span>
        </div>

        <div
          class="btns_box d-flex"
          v-if="customer_belong && queryType != 'revoke'"
        >
          <div class="btns d-flex">
            <div class="item" @click="addFollow()">
              <i class="iconfont icon-ykb-gj"></i>
              写跟进
            </div>
            <div class="item" @click="addVisit">
              <i class="iconfont icon-ykb-xjjh"></i>
              新建计划
            </div>
            <div class="item" @click="addOffer()">
              <i class="iconfont icon-ykb-xjbj"></i>
              新建报价
            </div>
            <div class="item" @click="addContract()">
              <i class="iconfont icon-ykb-xjht"></i>
              新建合同
            </div>
            <div class="item" @click="addReturn()">
              <i class="iconfont icon-ykb-xjhk"></i>
              新建回款
            </div>
          </div>

          <div class="btns d-flex">
            <!-- <div class="item" @click="editCustomer">
              <i class="iconfont icon-ykb-bj1"></i>
              编辑
            </div> -->
            <!-- <div class="item" @click="overFollow" v-if="customer.customer_status !== 1">
              <i class="iconfont icon-ykb-fq"></i>
              放弃
            </div> -->
            <!-- <div class="item" @click="moveCustomer">
              <i class="iconfont icon-ykb-yj"></i>
              移交
            </div> -->
          </div>
        </div>

        <div class="btns_box" v-if="queryType == 'revoke'">
          <div class="btns d-flex">
            <div class="item" @click="revoke">
              <i class="iconfont icon-cx"></i>
              撤销
            </div>
          </div>
        </div>
      </div>

      <div class="com_card customer_count">
        <div class="tit">客户统计</div>

        <div class="info">
          <div class="item">
            跟进次数：<span>{{ info.follow_num }}次</span>
          </div>
          <div class="item">
            签单数：<span>{{ info.contract_num }}单</span>
          </div>
          <div class="item">
            合同总额：<span>{{ info.contract_money }}元</span>
          </div>
          <div class="item">
            回款总额：<span>{{ info.payment_money }}元</span>
          </div>
          <div class="item">
            未回款总额：<span>{{ info.pending_payment }}元</span>
          </div>
        </div>
      </div>

      <div class="com_card plan">
        <div class="tit">拜访计划</div>

        <div class="time_line">
          <div v-if="visitPlanList.length > 0">
            <div class="item" v-for="(v, i) in visitPlanList" :key="i">
              <div class="l_line">
                <div class="dian d-center">
                  <div class="cell"></div>
                </div>
                <div class="line"></div>
              </div>

              <div>
                <div class="time">
                  时间：
                  <span>
                    {{ v.visit_time || "-" }}
                  </span>
                </div>
                <div class="time target">
                  目的：
                  <span>
                    {{ v.visit_type_name || "" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="nodata" v-else>暂无拜访计划</div>
        </div>
      </div>
    </div>

    <!-- ---------------  tabs  --------------------- -->

    <div class="tabs_main">
      <div class="historic-version" @click="getHistory">
        <i class="iconfont icon-lishi"></i>
        <div>历史版本</div>
      </div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane name="follow" label="跟进记录">
          <span slot="label">
            <div class="tabs_label">跟进记录</div>
          </span>

          <div v-if="followList.length > 0">
            <div class="follow_list">
              <div class="item d-flex" v-for="(v, i) in followList" :key="i">
                <div class="left_time">
                  <!-- 同一天只展示一个  今天 -->
                  <div class="name" v-if="v.showDate">
                    {{ v.add_name }}
                  </div>
                  <div class="time">{{ v.add_at }}</div>
                </div>

                <div class="r_main" v-if="v.visit_type != 2">
                  <div class="user_info d-align-center">
                    <el-image
                      style="width: 38px; height: 38px; border-radius: 50%"
                      :src="v.user.avatar"
                      fit="fill"
                      v-if="v.user.avatar"
                    >
                    </el-image>
                    <el-image v-else>
                      <div slot="error" class="image-slot d-center">
                        {{ v.user.abbreviation }}
                      </div>
                    </el-image>

                    <div class="tit">
                      <span>{{ v.user.name }} 的跟进记录</span>
                    </div>
                    <div @click="getComment(v.id)" class="comment">{{v.comment_count}} 条评论</div>
                  </div>

                  <div class="r_info">
                    <div class="d-flex">
                      <div class="type">
                        跟进方式：
                        {{ v.visit_type == 0 ? "线上拜访" : "线下拜访" }}
                      </div>
                      <div class="type">跟进时间： {{ v.visit_time }}</div>
                    </div>

                    <div class="content">
                      <div class="content_text">{{ v.visit_content || "" }}</div>
                      <div class="commentEdit" v-if="v.diff_status">
                        <span  @click="addFollow(v.id)" style="color:#3399FF;cursor: pointer;">编辑</span>
                        <span class="or"></span>
                        <span @click="delFollow(v.id)" style="color:#FF1400;cursor: pointer;">删除</span>
                      </div>
                    </div>
                  </div>

                  <div class="line"></div>
                </div>

                <div class="r_main" v-else>
                  <div class="user_info d-align-center">
                    <el-image
                      style="width: 38px; height: 38px; border-radius: 50%"
                      :src="v.user.avatar"
                      fit="fill"
                      v-if="v.user.avatar"
                    >
                    </el-image>
                    <el-image v-else>
                      <div slot="error" class="image-slot d-center">
                        {{ v.user.abbreviation }}
                      </div>
                    </el-image>

                    <div class="tit">{{ v.user.name }} 放弃跟进</div>
                  </div>
                  <div class="r_info">
                    <div class="type">放弃原因：</div>
                    <div class="content com-line-1">
                      {{ v.visit_content || "" }}
                    </div>
                  </div>
                  <div class="line"></div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="pagination_box">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[15, 20, 50, 100]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="followTotal"
              >
              </el-pagination>
            </div>
          </div>

          <div class="slogan" v-else>
            <el-image
              style="width: 128px; height: 128px"
              :src="noData"
              fit="fill"
            ></el-image>
            <div class="txt">暂无记录</div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="报价单" name="offer">
          <span slot="label">
            <div class="tabs_label">报价单 ({{ info.offer_record }})</div>
          </span>

          <!-- 报价列表 -->
          <offer-list ref="offerList" @edit="addOffer"></offer-list>
        </el-tab-pane>

        <el-tab-pane label="合同订单" name="contract">
          <span slot="label">
            <div class="tabs_label">合同订单 ({{ info.contract_num }})</div>
          </span>

          <!-- 合同列表 -->
          <contract-list ref="contractList" @edit="addContract"></contract-list>
        </el-tab-pane>

        <el-tab-pane label="回款单" name="return">
          <span slot="label">
            <div class="tabs_label">回款单 ({{ info.payment_collection }})</div>
          </span>

          <!-- 回款列表 -->
          <return-list ref="returnList" @edit="addReturn"></return-list>
        </el-tab-pane>

        <el-tab-pane label="基本信息" name="information">
          <span slot="label">
            <div class="tabs_label">基本信息</div>
          </span>

          <div class="information_box">
            <div class="info_tit">基础信息</div>
            <div class="form_item">
              <el-form label-width="70px" class="demo-form">
                <div class="form_item_box">
                  <div class="form_item_box_child">
                    <el-form-item label="客户状态">
                      <el-input v-model="customer.customer_status_name || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="客户名称">
                      <el-input v-model="customer.name || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="联系电话">
                      <el-input v-model="customer.phone || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="微信账号">
                      <el-input v-model="customer.wechat || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="企业名称">
                      <el-input v-model="customer.company || '未填写'" disabled> </el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="岗位职务">
                      <el-input v-model="customer.position || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="企业角色">
                      <el-input v-model="customer.company_role || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="所在地区">
                      <el-input v-model="areaInfo" disabled> </el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="详细地址">
                      <el-input v-model="customer.address || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>

            <div class="info_tit">扩展信息</div>
            <div class="form_item">
              <el-form label-width="70px" class="demo-form">
                <div class="form_item_box">
                  <div class="form_item_box_child">
                    <el-form-item label="客户标签">
                      <el-input v-model="customer.tag_name || '未填写'" disabled>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="客户来源">
                      <el-input
                        v-model="customer.from_name || '未填写'"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="所属行业" class="right_none">
                      <el-input v-model="customer.industry || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="客户级别">
                      <el-input v-model="customer.level || '未填写'" disabled> </el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="客户名片">
                      <el-image v-if="customer.business_card" class="iimg" :src="customer.business_card" :preview-src-list="[customer.business_card]" fit="cover"></el-image>
                      <span v-else class="business_card">未上传</span>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>

            <div class="info_tit">其他信息</div>
            <div class="form_item">
              <el-form label-width="80px" class="demo-form">
                <div class="form_item_box" id="third">
                  <div class="form_item_box_child">
                    <el-form-item label="负责人">
                      <el-input v-model="chargeInfo.user.name || '未填写'" disabled v-if="chargeInfo && chargeInfo.user"></el-input>
                      <el-input disabled v-else> </el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="最后更新时间" min-width="100">
                      <el-input v-model="customer.modify_at || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="创建人" class="build">
                      <el-input v-model="customer.user.name || '未填写'" disabled v-if="customer.user"></el-input>
                    </el-form-item>
                  </div>
                  <div class="form_item_box_child">
                    <el-form-item label="创建时间">
                      <el-input v-model="customer.created_at || '未填写'" disabled></el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 操作弹框  操作弹框  操作弹框  操作弹框  操作弹框  操作弹框  操作弹框  操作弹框  操作弹框 -->

    <!-- 新增、编辑  客户-->
    <add v-if="addShow" ref="add" @cancel="hideCustomerAdd"></add>

    <!-- 移交客户 -->
    <move-member
      :dialogShow="moveShow"
      :activeCustomer="activeCustomer"
      :personCustomer="personCustomer"
      @hideDialog="hideDialog"
    ></move-member>

    <!-- 放弃客户 -->
    <over-customer
      :dialogShow="overShow"
      :activeCustomer="activeCustomer"
      :personCustomer="personCustomer"
      @hideDialog="hideOverShow"
    ></over-customer>

    <!-- 新建跟进记录 -->
    <add-follow
      ref="addFollowForm"
      :addFollowShow="addFollowShow"
      :personCustomer="personCustomer"
      @cancel="hideAddFollowShow"
    ></add-follow>

    <!-- 新建计划 -->
    <add-visit
      v-if="addVisitShow"
      :activeCustomer="activeCustomer"
      ref="addVisitForm"
      @cancel="hideAddVisit"
    >
    </add-visit>

    <!-- 新建回款 -->
    <add-return
      v-if="addReturnShow"
      ref="refAddReturn"
      @cancel="hideAddReturn"
    ></add-return>

    <!-- 新建报价 -->
    <add-offer
      v-if="addOfferShow"
      ref="refAddOffer"
      @cancel="hideAddOffer"
    ></add-offer>

    <!-- 新建合同 -->
    <add-contract
      v-if="addContractShow"
      ref="refAddContract"
      @cancel="hideAddContract"
    ></add-contract>

    <!-- 历史版本 -->
    <historic-version
      v-if="historyVisable"
      :customer_belong="customer_belong"
      :queryType="queryType"
      :customer_id="customer_id"
      ref="refHistory"
      @cancel="hideHistory"
    ></historic-version>

    <!-- 跟进评论 -->
    <comment-list
      v-if="showComment"
      ref="refComment"
      @cancel="hideComment"
    ></comment-list>
  </div>
</template>

<script>
import add from "./component/add.vue";
import moveMember from "./component/moveMember.vue";
import overCustomer from "./component/overCustomer.vue";

import addFollow from "@/views/customer/follow/component/add.vue";
import addVisit from "@/views/visit/component/add.vue";
import addReturn from "@/views/transaction_management/returnMoney/component/add.vue";
import addOffer from "@/views/transaction_management/offer/component/add.vue";
import addContract from "@/views/transaction_management/contract/component/add.vue";

import offerList from "./component/offer_list.vue";
import contractList from "./component/contract_list.vue";
import returnList from "./component/return_list.vue";

import historicVersion from "./component/historicVersion.vue";
import commentList from "./comment.vue";

import { getData, postData, delData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      customer_id: "",
      user: {},
      page: 1,
      pagesize: 15,
      total: 0,
      noData: store.state.no_data,
      value: null, // 星级评分
      isShowTooltip: false, // 是否展示提示
      isshow1: true,
      isshow2: true, // 是否展示提示框
      levelValue: "", // 客户提示框
      levelSelect: "", // 客户选择框
      dropClick: false, // 是否点击click

      dialogCustmerVisible: false, // 选择客户框
      dialogRemarkVisible: false, // 备注编辑
      formLabelWidth: "120px",
      remark: "", // 备注
      newRemark: "", // 新建备注

      activeName: "follow",
      queryType: "", // revoke 回收站来的
      customer_belong: false,

      areaInfo: "",
      info: {},
      customer: {},
      chargeInfo: {},
      followList: [],
      followTotal: 1,
      queryType: "", // revoke 客户回收站来的 展示撤销删除

      visitPlanList: [
        // {
        //   visit_plan: {
        //     visit_type_name: "213234",
        //     visit_time_m: "2020-2-2",
        //   },
        // },
      ],

      addShow: false,

      // 移交客户
      moveShow: false,
      activeCustomer: {}, // 要移交的客户
      personCustomer: "", // 客户负责人

      overShow: false, // 放弃跟进
      addFollowShow: false, // 新建 跟进
      addVisitShow: false, // 新建 计划
      addReturnShow: false, // 新建 回款
      addOfferShow: false, // 新建 报价
      addContractShow: false, // 新建 合同
      historyVisable: false, // 历史版本
      showComment: false, // 跟进评论
    };
  },
  created() {
    this.user = store.state.userInfo;

    const { query } = this.$route;
    // console.log(query);

    this.customer_id = query.customer_id;
    this.queryType = query.type;
    this.init();
    this.getFollowList();

    this.$emit(
      "change",
      true,
      `客户管理 / ${query.type == "revoke" ? "回收站" : "我的客户"} / 客户详情`
    );
  },
  methods: {
    init() {
      getData({
        url: "/customer/customer_detail",
        data: {
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.info = data;
          this.customer = data.customer;
          this.customer.company = this.customer.company.slice(0,16)
          res.data.customer.phone == null
            ? (this.isshow1 = false)
            : (this.isshow1 = true);
          res.data.customer.wechat == null
            ? (this.isshow2 = false)
            : (this.isshow2 = true);
          if (data.user_customer) {
            this.chargeInfo = data.user_customer;
          }
          this.visitPlanList = data.visit_plan;

          this.areaInfo = `${data.customer.area.name} ${data.customer.area_city.name} ${data.customer.area_area.name}`;

          if (data.customer && data.customer.remarks) {
            this.remark = data.customer.remarks;
            this.newRemark = this.remark;
          }

          if (data.customer && data.customer.level === "A类(重要客户)") {
            this.value = 3;
            this.levelValue = data.customer.level;
          } else if (data.customer && data.customer.level === "B类(普通客户)") {
            this.value = 2;
            this.levelValue = data.customer.level;
          } else if (
            data.customer &&
            data.customer.level === "C类(非优先客户)"
          ) {
            this.value = 1;
            this.levelValue = data.customer.level;
          } else {
            this.levelValue = "";
            this.value = null;
          }

          this.levelSelect = this.levelValue;
        }
      });

      // console.log("activeName", this.activeName);

      getData({
        url: `/customer/customer_belong?customer_id=${this.customer_id}`,
        data: {
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.customer_belong = data.customer_belong;
        }
      });
    },

    // 跟进记录
    getFollowList() {
      getData({
        url: "/follow/follow_record_list",
        data: {
          page: this.page,
          pagesize: this.pagesize,
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          let arr = list.data;
          arr.map((v, i) => {
            if (i != 0) {
              if (v.add_name != arr[i - 1].add_name) {
                v.showDate = true;
              } else {
                v.showDate = false;
              }
            } else {
              v.showDate = true;
            }
          });
          this.followList = arr;
          this.followTotal = list.total;
        }
      });
    },

    // 分页条数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getFollowList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getFollowList();
    },

    // 编辑
    handleCommand(command) {
      switch (command) {
        case "editCustomer":
          this.editCustomer();
          break;
        case "moveCustomer":
          this.moveCustomer();
          break;
        case "changeCustomer":
          this.changeCustomer();
          break;
        case "overFollow":
          this.overFollow();
          break;
      }
    },

    // 更改客户信息
    levalChange(e) {
      // console.log(e,'信息');
    },

    // 更改客户级别
    async submitLevel() {
      await this.updataCustemer("level", this.levelSelect);
      this.init();
      this.dialogCustmerVisible = false;
    },

    // 修改用户备注
    async submitRemark() {
      await this.updataCustemer("remarks", this.newRemark);
      this.init();
      this.dialogRemarkVisible = false;
    },

    // 用户的数据更改
    updataCustemer(type, value) {
      return new Promise((resolve, reject) => {
        let params = {
          id: this.customer_id,
          remarks: this.remark,
        };
        if (type == "level") {
          params["level"] = value;
        } else {
          params["remarks"] = value;
        }

        postData({
          url: "/customer/update_customer",
          data: params,
        }).then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            resolve();
          } else if (code === 422) {
            this.$err(msg);
            resolve();
          }
        });
      });
    },

    // 新增编辑信息
    editCustomer() {
      this.addShow = true;
      this.$nextTick(() => {
        // console.log("id >>>>", this.customer_id);
        this.$refs.add.init(this.customer_id);
      });
    },
    hideCustomerAdd(update = false) {
      // console.log("update >>", update);
      this.activeName = "information";
      if (update) {
        this.init();
      }
      this.addShow = false;
    },

    // 更改用户等级事件
    changeCustomer() {
      this.dialogCustmerVisible = true;
    },

    // 编辑备注
    editRemark() {
      if (this.customer_belong && this.queryType != "revoke") {
        this.dialogRemarkVisible = true;
        this.newRemark = this.remark;
      } else {
        return;
      }
    },

    tabClick(tab) {
      // console.log("tabClick 》》》》", tab);

      switch (tab.name) {
        case "follow":
          this.getFollowList();
          break;
        case "offer":
          this.getOffer();
          break;
        case "contract":
          this.getContract();
          break;
        case "return":
          this.getReturn();
          break;
        case "information":
          this.init();
          break;

        default:
          break;
      }
    },

    // 出现下拉弹窗
    dropShow(e) {
      if (e) {
        this.dropClick = true;
      } else {
        this.dropClick = false;
      }
    },

    getContract() {
      this.$nextTick(() => {
        // console.log("id >>>>", this.customer_id);
        this.$refs.contractList.init({ customer_id: this.customer_id });
      });
    },
    getReturn() {
      this.$nextTick(() => {
        // console.log("id >>>>", this.customer_id);
        this.$refs.returnList.init({ customer_id: this.customer_id });
      });
    },
    getOffer() {
      this.$nextTick(() => {
        // console.log("id >>>>", this.customer_id);
        this.$refs.offerList.init({ customer_id: this.customer_id });
      });
    },

    // 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户
    // 隐藏弹框
    hideDialog(update) {
      this.moveShow = false;
      if (update) {
        this.$router.go(-1);
      }
    },
    // 1 点击移交 展示弹框
    moveCustomer() {
      let member_count = this.info.member_count;
      if (member_count > 0) {
        this.activeCustomer = this.customer;
        this.personCustomer = this.chargeInfo.user.name;
        this.moveShow = true;
      } else {
        this.$warning("企业暂无成员，无法移交");
      }
    },
    // 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户 移交客户

    // 放弃客户 放弃客户 放弃客户 放弃客户 放弃客户 放弃客户
    overFollow() {
      this.activeCustomer = this.customer;
      this.personCustomer = this.chargeInfo.user.name;

      this.overShow = true;
    },
    // 隐藏弹框
    hideOverShow(update) {
      this.overShow = false;
      if (update) {
        this.$router.go(-1);
      }
    },
    // 放弃客户 放弃客户 放弃客户 放弃客户 放弃客户 放弃客户

    // 跟进记录 跟进记录 跟进记录 跟进记录 跟进记录 跟进记录
    // 删除
    delFollow(id) {
      this.$confirm("确定删除该跟进记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        confirmButtonClass: "msgBoxBtn",
        cancelButtonClass: "msgBoxBtn_cancel",
        type: "warning",
      })
        .then(() => {
          delData({
            url: "/follow/" + id,
            data: {},
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$success(msg);
              this.init();
              this.getFollowList();
            } else if (code === 422) {
              this.$err(msg);
            }
          });
        })
        .catch(() => {});
    },
    // 新建、编辑
    addFollow(id) {
      this.personCustomer = this.chargeInfo.user.name;
      this.$nextTick(() => {
        this.$refs.addFollowForm.init({
          customer_id: this.customer.id,
          follow_id: id,
        });
      });

      this.addFollowShow = true;
    },
    // 隐藏弹框
    hideAddFollowShow(update) {
      // console.log("隐藏弹框");
      this.activeName = "follow";

      this.addFollowShow = false;
      if (update) {
        this.init();
        this.getFollowList();
      }
    },
    // 跟进记录 跟进记录 跟进记录 跟进记录 跟进记录 跟进记录

    // 计划 计划 计划 计划 计划
    addVisit() {
      this.addVisitShow = true;
      this.activeCustomer = this.customer;
      this.$nextTick(() => {
        this.$refs.addVisitForm.init();
      });
    },
    hideAddVisit(update = false) {
      if (update) {
        this.init();
      }
      this.addVisitShow = false;
    },
    // 计划 计划 计划 计划 计划

    // 新建回款 新建回款 新建回款 新建回款 新建回款
    addReturn(row) {
      // console.log("return_list > 新建、编辑回款 >>>", row);
      this.addReturnShow = true;

      this.$nextTick(() => {
        this.$refs.refAddReturn.init({
          return_id: row ? row.id : false,
          //   contract_id: row ? row.contract.id : false,
          contract_id: this.customer_id,
        });
      });
    },
    hideAddReturn({ update_list }) {
      this.activeName = "return";

      // if (update_list) {
      this.init();
      this.getReturn();
      // }

      this.addReturnShow = false;
    },
    // 新建回款 新建回款 新建回款 新建回款 新建回款

    // 新建合同 新建合同 新建合同 新建合同 新建合同 新建合同
    addContract(row) {
      // console.log("新建、编辑 >>>", row);
      this.addContractShow = true;

      this.$nextTick(() => {
        this.$refs.refAddContract.init({
          contract_id: row ? row.id : false,
          customer: this.customer,
        });
      });
    },
    hideAddContract({ update_list }) {
      this.activeName = "contract";

      // if (update_list) {
      this.init();
      this.getContract();
      // }

      this.addContractShow = false;
    },
    // 新建合同 新建合同 新建合同 新建合同 新建合同 新建合同

    // 历史版本

    // 获取历史版本
    getHistory() {
      this.$nextTick(() => {
        // console.log("id >>>>", this.customer_id);
        this.historyVisable = true;
        // this.$refs.refHistory.init({ customer_id: this.customer_id });
      });
    },

    hideHistory() {
      this.init();
      this.historyVisable = false;
    },
    // 历史版本


    hideComment() {
      this.showComment = false;
    },
    getComment(id) {
      this.showComment = true;
      this.$nextTick(() => {
        this.$refs.refComment.init({follow_record_id:id})
      });
    },

    // 新建报价 新建报价 新建报价 新建报价 新建报价 新建报价 新建报价
    addOffer(row) {
      // console.log("return_list > 新建、编辑报价 >>>", row);
      this.addOfferShow = true;

      this.$nextTick(() => {
        this.$refs.refAddOffer.init({
          offer_id: row ? row.id : false,
          customer: this.customer,
        });
      });
    },
    hideAddOffer({ update_list }) {
      this.activeName = "offer";
      // console.log("customer hide");

      // if (update_list) {
      this.init();
      this.getOffer();
      // }

      this.addOfferShow = false;
    },
    // 新建报价 新建报价 新建报价 新建报价 新建报价 新建报价 新建报价

    revoke() {
      this.$confirm("撤销后，该客户将进入公海池，是否撤销？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        confirmButtonClass: "msgBoxBtn",
        cancelButtonClass: "msgBoxBtn_cancel",
        type: "warning",
      })
        .then(() => {
          postData({
            url: "/customer/revoke_customer",
            data: {
              customer_ids: [this.customer_id],
            },
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$success(msg);
              this.$router.push({
                path: "/seas_customer_detail",
                query: {
                  customer_id: this.customer_id,
                },
              });
              return;
            } else if (code === 422) {
              this.$err(msg);
            }
          });
        })
        .catch(() => {});
    },
  },
  components: {
    add,
    moveMember,
    overCustomer,

    addFollow,
    addVisit,
    addReturn,
    addOffer,
    addContract,

    offerList,
    returnList,
    contractList,
    historicVersion,
    commentList
  },
};
</script>

<style lang="less" scoped>
.customer_detail {
  padding: 26px 24px;

  .top_info {
    justify-content: space-around;

    .com_card {
      padding: 25px 24px 0;
      height: 208px;
      background: #ffffff;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
      border-radius: 18px;

      .tit {
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 600;
        line-height: 17px;
        color: #464c5b;
      }
    }

    .info_main {
      width: 100%;
      min-width: 560px;

      .name {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #464c5b;
        width: 100%;
        position: relative;

        .tag {
          margin-left: 13px;
          padding: 0 9px;
          height: 24px;
          background: #e5eaff;
          border-radius: 4px;

          font-size: 12px;
          font-weight: 400;
          color: #4d6fff;
        }
      }

      .information {
        align-items: center;
        flex-wrap: wrap;
        width: 105%;
        line-height: 1;

        .item {
          display: flex;
          align-items: center;

          font-size: 12px;
          font-weight: 400;
          color: #9ea7b4;

          span {
            // display: inline-block;
            // max-width: 202px;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            color: #657180;
          }
        }

        .line {
          margin: 0 14px;
          height: 14px;
          border: 1px solid #bababa;
        }
      }

      .btns_box {
        margin-top: 0px;
        flex-wrap: wrap;

        .btns {
          flex-wrap: wrap;

          .item {
            margin-top: 12px;
            margin-right: 12px;
            display: flex;
            align-items: center;
            padding: 0 12px;
            height: 34px;
            background: #fff;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.14);
            border-radius: 8px;

            font-size: 12px;
            font-weight: 400;
            color: #464c5b;
            cursor: pointer;

            .iconfont {
              margin-right: 4px;
            }
          }

          .item:hover {
            background: #edf3fe;
            box-shadow: 0px 0px 4px rgba(1, 27, 49, 0.34);
            color: #4d6fff;
          }
        }
      }
    }

    .customer_count {
      margin-left: 24px;
      min-width: 210px;
      flex-shrink: 0;

      .item {
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #9ea7b4;

        span {
          color: #657180;
        }
      }

      :last-child {
        margin-bottom: 0;
      }
    }

    .plan {
      margin-left: 24px;
      padding-right: 2px;
      min-width: 210px;
      flex-shrink: 0;
      overflow: hidden;

      .time_line {
        padding-bottom: 24px;
        height: 100%;
        overflow: auto;

        .item {
          display: flex;

          .l_line {
            position: relative;
            margin-right: 6px;
            width: 10px;

            .dian {
              width: 10px;
              height: 10px;
              background: #3965f9;
              border-radius: 50%;

              .cell {
                width: 4px;
                height: 4px;
                background: #fff;
                border-radius: 50%;
              }
            }

            .line {
              position: absolute;
              left: 50%;
              top: 10px;
              transform: translateX(-50%);
              height: 100%;
              width: 1px;
              background-color: #e7e7e7;
            }
          }

          .time {
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: #9ea7b4;

            span {
              color: #657180;
            }
          }

          .target {
            margin-bottom: 24px;
          }
        }
      }

      .nodata {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #9ea7b4;
      }
    }
  }

  .tabs_main {
    margin-top: 24px;
    padding: 24px 46px;
    background: #fff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    position: relative;
  }
}

.tabs_label {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
/deep/.el-tabs__item {
  color: #9ea7b4 !important;
}
/deep/.el-tabs__item.is-active {
  color: #409eff !important;
}
/deep/.el-tabs__content {
  overflow: initial;
}

.follow_list {
  .item {
    position: relative;
    align-items: flex-start;
    margin-bottom: 27px;

    .left_time {
      margin-right: 18px;
      width: 64px;
      z-index: 1;
      flex-shrink: 0;
      background-color: #fff;

      .name {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #464c5b;
      }

      .time {
        padding-bottom: 5px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;
      }
    }

    .line {
      position: absolute;
      top: 0;
      left: 22px;
      width: 1px;
      height: 100%;
      background-color: #e7e7e7;
    }

    .r_main {
      padding: 24px 25px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 0px 6px -3px rgb(0, 0, 0, 0.04);
      border-radius: 6px;

      .user_info {
        position: relative;
        /deep/.el-image {
          margin-right: 12px;

          .image-slot {
            width: 36px;
            height: 36px;
            background: #4d6fff;
            border-radius: 50%;

            font-size: 12px;
            font-weight: 400;
            color: #ffffff;
          }
        }

        .tit {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #333333;
        }
        .comment{
          cursor: pointer;
          position: absolute;
          right: 0;
          color: #FFF;
          height: 34px;
          font-size: 14px;
          padding: 7px 24px;
          background: #FCAC4E;
          border-radius: 12px 12px 12px 0px;
        }
      }

      .r_info {
        padding-left: 48px;

        .type {
          margin-right: 43px;
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #999999;
        }

        .content {
          margin-top: 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #333333;
          display: flex;
          justify-content: space-between;
          .content_text{
            flex: 1;
            max-width: 1000px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .commentEdit{
            visibility: hidden;
            width: 74px;
            height: 17px;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            .or{
              display: inline-block;
              width: 0px;
              height: 14px;
              border: 1px solid #BABABA;
            }
          }
        }
      }
    }
    .r_main:hover .r_info>.content>.commentEdit{
      visibility: visible;
    }

    .btns {
      position: absolute;
      top: 20px;
      right: 20px;

      .btn {
        padding: 0 14px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #3399ff;
        cursor: pointer;
      }

      .del {
        color: #ff1400;
        border-left: 1px solid #bababa;
      }
    }
  }

  :last-child {
    margin-bottom: 0;
  }
}

.slogan {
  padding: 94px 0 0;
}

.information_box {
  .info_tit {
    margin-bottom: 19px;
    padding: 9px 24px;
    width: 100%;
    height: 34px;
    background: #f0f5ff;

    font-size: 12px;
    font-weight: 600;
    color: #464c5b;
  }

  .demo-form {
    .el-form-item {
      margin-right: 36px;
      width: 100%;
    }
  }

  .right_none {
    margin-right: 0 !important;
  }

  // .area_item {
  //   max-width: 270px !important;
  // }

  .form_item {
    margin-bottom: 24px;
  }
  .form_item_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }
  .form_item_box_child {
    width: 330px;
    margin-right: 36px;
    .business_card{
      color: #C0C4CC;
      line-height: 32px;
    }
  }
  #third {
    margin-left: -11px !important;
  }
  .el-input {
    width: 270px !important;
  }
}

.rate {
  margin-left: 12px;

  /deep/ .el-rate__item {
    width: 18px;
  }

  .item-tooltip {
    display: inline-block;
    max-width: 150px;
    margin-left: 8px;
  }
}

.edit {
  position: absolute;
  right: 0;
}

.edit-box {
  width: 39px;
  height: 22px;
  background: #f4f5f8;
  opacity: 1;
  border-radius: 2px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  padding: 0 10px;

  .edit-icon {
    width: 3px;
    height: 3px;
    background: rgba(112, 112, 112, 1);
    border-radius: 50%;
    opacity: 1;
  }

  &&:hover {
    background: #e2e5eb;
  }

  &&:active {
    background: #e5eafe;
  }
}

.edit-box_active {
  width: 39px;
  height: 22px;
  background: #657180;
  opacity: 1;
  border-radius: 2px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  padding: 0 10px;

  .edit-icon {
    width: 3px;
    height: 3px;
    background: #ffffff;
    border-radius: 50%;
    opacity: 1;
  }
}

.remark {
  width: 100%;
  // height: 66px;
  background: rgba(244, 245, 248, 1);
  opacity: 1;
  padding: 5px 12px;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 17px;
  color: #586c86;
  opacity: 1;
  margin-top: 14px;
  display: flex;

  i {
    margin: 0 10px 0 2px;

    &:hover {
      color: #3399ff;
    }
  }
}

.el-select {
  width: 485px;
}

.historic-version {
  padding: 8px;
  background: #eaeeff;
  opacity: 1;
  border-radius: 5px;
  position: absolute;
  right: 46px;
  top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #345afd;
  cursor: pointer;
  z-index: 999;

  &:hover {
    background: #d7defa;
  }

  &:active {
    background: #d7defa;
  }

  i {
    margin-right: 3px;
  }
}

.iimg{
  width:32px;
  height:32px
}
</style>