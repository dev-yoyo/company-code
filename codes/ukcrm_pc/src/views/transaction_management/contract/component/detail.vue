<template>
  <div class="add_detail">
    <el-drawer
      :visible.sync="show"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="1054px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="detail_title">合同</div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div class="detail_main">
        <div class="edit_btn d-between">
          <div class="detail_status d-align-center">
            <div class="no">{{ info.contract_no }}</div>

            <div
              class="item"
              :class="{
                end: info.contract_status == '终止',
              }"
            >
              {{ info.contract_status || "" }}
            </div>
            <i
              class="el-message__icon el-icon-warning end_icon"
              v-if="info.contract_status == '终止'"
              @click="showEndedReason"
            ></i>
          </div>

          <div class="d-align-center">
            <el-button class="edit" @click="edit" v-if="canEdit">
              编辑
            </el-button>
            <el-button class="edit gray" @click="endShow = true" v-if="canEnd">
              终止
            </el-button>
          </div>
        </div>

        <div class="customer_info">
          <div class="item_box d-flex">
            <div class="item">
              关联客户：<span>{{ info.customer_name }}</span>
            </div>
            <div class="item">
              负责人：<span>{{
                user_customer && user_customer.name ? user_customer.name : ""
              }}</span>
            </div>
            <div class="item">
              签订时间：<span>{{ info.sign_time }}</span>
            </div>
          </div>

          <div class="item_box d-flex">
            <div class="item">
              合同金额：<span>{{ info.money }}元</span>
            </div>
            <div class="item">
              已回款：<span>{{ info.has_return_money }}元</span>
            </div>
            <div class="item">
              待回款：<span>{{ info.return_money }}元</span>
            </div>
          </div>
        </div>

        <el-tabs v-model="activeName">
          <el-tab-pane name="detail">
            <span slot="label">
              <div class="tabs_label">详细信息</div>
            </span>

            <el-form
              :model="info"
              ref="returnForm"
              label-width="80px"
              class="demo-form"
            >
              <div class="form_tit">基础信息</div>

              <div class="d-flex">
                <el-form-item label="合同编号" style="margin-right: 150px">
                  <el-input v-model="info.contract_no" disabled> </el-input>
                </el-form-item>

                <el-form-item label="合同名称">
                  <el-input v-model="info.contract_name" disabled> </el-input>
                </el-form-item>
              </div>

              <div class="d-flex">
                <el-form-item label="客户名称" style="margin-right: 150px">
                  <el-input v-model="info.customer_name" disabled></el-input>
                </el-form-item>

                <el-form-item label="关联企业">
                  <el-input
                    v-model="info.customer_company_name"
                    disabled
                  ></el-input>
                </el-form-item>
              </div>

              <div class="d-flex">
                <el-form-item label="合同金额" style="margin-right: 150px">
                  <el-input v-model="info.money" disabled></el-input>
                </el-form-item>

                <el-form-item label="签订人">
                  <el-input v-model="info.sign_user" disabled></el-input>
                </el-form-item>
              </div>

              <el-form-item label="签订日期">
                <el-input v-model="info.sign_time" disabled></el-input>
              </el-form-item>

              <el-form-item label="备注" style="width: 720px">
                <el-input
                  type="textarea"
                  v-model="info.remarks"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="product">
            <span slot="label">
              <div class="tabs_label">产品信息</div>
            </span>

            <div class="product_info">
              <el-table
                :data="info.contract_product"
                style="width: 100%; overflow: auto"
                :header-row-style="{
                  color: '#657180',
                  'font-size': '12px',
                }"
                :cell-style="{ color: '#657180', 'font-size': '12px' }"
                :border="true"
                class="demo_table"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  min-width="72"
                  align="center"
                >
                </el-table-column>

                <el-table-column label="产品名称" min-width="230" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.product_name }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  label="类别"
                  min-width="72"
                  align="center"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <!-- <div class="com-line-1"> -->
                    <span
                      class="com-line-1"
                      v-if="scope.row.product.s_classify"
                    >
                      {{ scope.row.product.s_classify.name }}
                    </span>
                    <span
                      class="com-line-1"
                      v-else-if="scope.row.product.f_classify"
                    >
                      {{ scope.row.product.f_classify.name }}
                    </span>
                    <!-- </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  label="指导报价"
                  prop="offer_product"
                  min-width="267"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="guide_price">
                      <div
                        class="price_box"
                        v-if="scope.row.product.price.length > 0"
                      >
                        <div
                          class="item d-flex"
                          v-for="v in scope.row.product.price"
                          :key="v.num"
                        >
                          <div class="txt">≥{{ v.num }}个</div>
                          <div class="txt">{{ v.price }}元</div>
                        </div>
                      </div>

                      <div class="no_price" v-else></div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  label="预购数量"
                  prop="product_num"
                  min-width="100"
                  align="center"
                >
                </el-table-column>

                <el-table-column
                  label="产品单价(元)"
                  prop="product_price"
                  min-width="117"
                  sortable
                  align="center"
                >
                </el-table-column>
                <template slot="empty">
                  <div class="table_empty">
                    <img
                      src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
                    />
                  </div>
                </template>
              </el-table>

              <div class="total_money">
                共
                <span>
                  {{ info.contract_product ? info.contract_product.length : 0 }}
                </span>
                种产品 总金额：<span>{{ info.money }}</span> 元
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane name="return">
            <span slot="label">
              <div class="tabs_label">回款信息</div>
            </span>

            <div class="return_info">
              <div class="item">
                <div class="tit_info d-between">
                  <div class="form_tit">回款计划</div>
                  <el-button
                    class="com_btn add_pro"
                    icon="el-icon-plus"
                    @click="addReturnPlan"
                    v-if="
                      info.contract_status != '完毕' &&
                      info.contract_status != '终止' &&
                      exists
                    "
                  >
                    新建回款计划
                  </el-button>
                </div>

                <el-table
                  :data="info.payplan"
                  style="width: 100%; overflow: auto"
                  :header-row-style="{
                    color: '#657180',
                    'font-size': '12px',
                  }"
                  :cell-style="{ color: '#657180', 'font-size': '12px' }"
                  class="demo_table"
                >
                  <el-table-column
                    label="期数"
                    min-width="70"
                    align="center"
                    prop="period"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>

                  <el-table-column
                    label="计划回款金额"
                    min-width="100"
                    align="left"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div class="com-line-1">
                        {{ scope.row.return_money }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="计划回款日期"
                    min-width="120"
                    align="center"
                    prop="return_time"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>

                  <el-table-column
                    label="回款方式"
                    min-width="120"
                    align="center"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div class="con-line-1">
                        {{ scope.row.pay_type || "-" }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="汇款银行"
                    min-width="120"
                    align="center"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div class="con-line-1">
                        {{ scope.row.pay_bank || "-" }}
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
              </div>

              <div>
                <div class="tit_info d-between">
                  <div class="form_tit">回款记录</div>
                  <el-button
                    class="com_btn add_pro"
                    icon="el-icon-plus"
                    @click="addReturn"
                    v-if="
                      info.contract_status != '完毕' &&
                      info.contract_status != '终止' &&
                      exists
                    "
                  >
                    新建回款
                  </el-button>
                </div>

                <el-table
                  :data="info.payment"
                  style="width: 100%; overflow: auto"
                  :header-row-style="{
                    color: '#657180',
                    'font-size': '12px',
                  }"
                  :cell-style="{ color: '#657180', 'font-size': '12px' }"
                  class="demo_table"
                >
                  <el-table-column
                    label="回款编号"
                    prop="return_num"
                    min-width="100"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div
                        class="customer_name com-line-1"
                        @click="showDetail(scope.row.id)"
                      >
                        {{ scope.row.return_num }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="期数"
                    min-width="70"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div class="com-line-1">
                        {{
                          scope.row.payment_plan
                            ? scope.row.payment_plan.period
                            : "-"
                        }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="回款金额"
                    min-width="100"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div class="com-line-1">
                        {{ scope.row.return_money }}元
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="回款方式"
                    min-width="120"
                    align="center"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div class="con-line-1">
                        {{ scope.row.pay_type || "-" }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="汇款银行"
                    min-width="120"
                    align="center"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <div class="con-line-1">
                        {{ scope.row.pay_bank || "-" }}
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
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane name="shipment">
            <span slot="label">
              <div class="tabs_label">出货信息</div>
            </span>

            <div class="product_info">
              <el-table
                :data="info.shipment"
                style="width: 100%; overflow: auto"
                :header-row-style="{
                  color: '#657180',
                  'font-size': '12px',
                }"
                :cell-style="{ color: '#657180', 'font-size': '12px' }"
                :border="true"
                class="demo_table"
              >
                <el-table-column label="批次" min-width="160" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.shipment_code }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="出货时间" min-width="100" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.shipment_time }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="出货数量" min-width="80" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.total_num }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="经办人" min-width="130" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.user_name }}
                    </div>
                  </template>
                </el-table-column>

                <!-- <el-table-column label="出货产品" min-width="130" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      {{ scope.row.ship_good[0].contract_product.product_name}}
                    </div>
                  </template>
                </el-table-column> -->

                <el-table-column label="质保期" min-width="120" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">{{ info.warranty }}年</div>
                  </template>
                </el-table-column>

                <el-table-column label="产品条码" min-width="70" align="left">
                  <template slot-scope="scope">
                    <div class="com-line-1">
                      <!-- {{ scope.row.product_name }} -->
                      <span @click="getProductCode(scope.row.id)" style="color: #4d6fff">查看</span>
                    </div>
                  </template>
                </el-table-column>

                <template slot="empty">
                  <div class="table_empty">
                    <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"/>
                  </div>
                </template>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <el-dialog
      :visible.sync="endShow"
      width="533px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="dialog_box"
    >
      <div class="">
        <div class="dialog_title d-between">
          <div class="title">终止合同</div>
          <i class="iconfont icon-ykbx" @click="hideEnd()"></i>
        </div>

        <div class="dialog_content">
          <div class="item">
            <div class="tit">现有负责人</div>
            <div>
              <el-input
                placeholder="请输入"
                :value="
                  user_customer && user_customer.name ? user_customer.name : ''
                "
                disabled
              >
              </el-input>
            </div>
          </div>

          <div class="item">
            <div class="tit">终止原因：</div>
            <div>
              <el-input
                type="textarea"
                v-model="ended_reason"
                :readonly="readonlyReason"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="dialog_footer d-flex" v-if="!readonlyReason">
          <el-button class="btn_item cancel" @click="hideEnd()">
            取 消
          </el-button>
          <el-button
            class="btn_item"
            type="primary"
            @click="submitEnd"
            :loading="createLoading"
            :disabled="createLoading"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="出库产品条码" :visible.sync="productCode">
      <div class="collapse">
        <div class="c_item" v-for="(v, k) in p_list" :key="k">
          <div class="i_title" @click="open(k, v.show)">
            <div>
              <span>{{ v.name }}</span>
              <span style="color: #4d6fff; margin-left: 10px">{{v.list.length}}</span>
            </div>
            <div :style="{transition: 'all 0.3s ease',transform: v.show ? 'rotate(0deg)' : 'rotate(180deg)'}">
              <i class="el-icon-caret-top"></i>
            </div>
          </div>
          <div class="i_list" :style="{height:v.show?Math.ceil(v.list.length/4)*50+36+'px':'0px',padding:v.show?'18px 20px':'0 20px',overflow:v.show?'auto':'hidden'}">
            <div class="i_l_name" v-for="(vv, kk) in v.list" :key="kk" :style="{'background': vv.status?'#F8F8F8':'#FFF2F2'}" @click="repairLog(vv.name,vv.status)">
              <div :style="{'color': vv.status?'#333':'#E80303'}">{{vv.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 新建回款 -->
    <add-return
      v-if="addReturnShow"
      ref="refAddReturn"
      @cancel="hideAddReturn"
    ></add-return>

    <add-plan
      v-if="addReturnPlanShow"
      ref="refAddReturnPlan"
      @cancel="hideAddReturnPlan"
    >
    </add-plan>

    <!-- 新建合同 -->
    <add-contract
      v-if="addContractShow"
      ref="refaddContract"
      @cancel="hideAddContract"
    ></add-contract>

    <!-- 合同详情 -->
    <returndetail
      v-if="detailShow"
      ref="refDetail"
      @cancel="hideDetail"
    ></returndetail>

    <!-- 维修记录 -->
    <repair-log
      v-if="repairShow"
      ref="refRepair"
      @cancel="hideRepair"
    ></repair-log>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";
import returndetail from "@/views/transaction_management/returnMoney/component/detail.vue";
import addReturn from "@/views/transaction_management/returnMoney/component/add.vue";
import addPlan from "@/views/transaction_management/returnMoney/component/add_plan.vue";
import repairLog from "./repair_log.vue";
import addContract from "./add.vue";

export default {
  data() {
    return {
      p_list: [], // 商品编码
      productCode: false,
      show: true,
      user: {},
      activeName: "detail",

      contract_id: "",
      info: {},
      exists: false,
      canEdit: false,
      canEnd: false, // 能否终止
      productTable: [],

      endShow: false, // 终止弹框
      readonlyReason: false, // 终止原因
      createLoading: false,
      ended_reason: "",
      user_customer: {}, // 负责人

      addReturnShow: false, // 新建 回款
      addReturnPlanShow: false, // 新建 回款计划

      addContractShow: false,
      detailShow: false,
      repairShow: false,
    };
  },
  methods: {
    init(contract_id) {
      // console.log("合同详情 >>", contract_id);

      this.contract_id = contract_id;
      getData({
        url: "/contract/contract_detail",
        data: {
          id: contract_id,
        },
      }).then((res) => {
        const {
          code,
          data: { list, exists },
        } = res;
        if (code === 200) {
          this.info = list;
          this.exists = exists;
          this.canEdit =
            exists && list.contract_status == "新签约" ? true : false;
          this.canEnd =
            exists &&
            (list.contract_status == "新签约" ||
              list.contract_status == "执行中")
              ? true
              : false;

          // 终止原因
          this.ended_reason = list.ended_reason;
          this.user_customer = list.user_customer.user;
        }
      });
    },
    edit() {
      // console.log("edit >> ", this.info);
      this.addContract(this.info);
    },
    cancel() {
      this.$emit("cancel");
    },

    showEndedReason() {
      this.endShow = true;
      this.readonlyReason = true;
    },

    // 新建合同 新建合同 新建合同 新建合同 新建合同 新建合同
    addContract(row) {
      // console.log("新建、编辑 >>>", row);
      this.addContractShow = true;

      this.$nextTick(() => {
        this.$refs.refaddContract.init({
          contract_id: row ? row.id : false,
          customer: this.customer,
        });
      });
    },
    hideAddContract({ update_list }) {
      if (update_list) {
        this.init(this.contract_id);
      }

      this.addContractShow = false;
    },
    // 新建合同 新建合同 新建合同 新建合同 新建合同 新建合同

    submitEnd() {
      this.createLoading = true;
      postData({
        url: "/contract/termination_contract",
        data: {
          id: this.contract_id,
          ended_reason: this.ended_reason,
        },
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.hideEnd();
        } else if (code === 422) {
          this.$err(msg);
        }

        this.createLoading = false;
      });
    },
    hideEnd() {
      this.createLoading = false;
      this.endShow = false;
      this.readonlyReason = false;
      this.init(this.contract_id);
    },

    // 新建回款 新建回款 新建回款 新建回款 新建回款
    addReturn() {
      this.addReturnShow = true;

      this.$nextTick(() => {
        this.$refs.refAddReturn.init({
          contract_id: this.info.id,
        });
      });
    },
    hideAddReturn({ update_list, isEdit, contract_id }) {
      if (update_list) {
        this.$nextTick(() => {
          this.init(contract_id);
        });
      }
      this.addReturnShow = false;
    },
    // 新建回款 新建回款 新建回款 新建回款 新建回款

    // 新建 回款计划 新建 回款计划 新建 回款计划 新建 回款计划
    addReturnPlan() {
      this.addReturnPlanShow = true;

      this.$nextTick(() => {
        this.$refs.refAddReturnPlan.init({
          contract_id: this.info.id,
        });
      });
    },
    hideAddReturnPlan({ update_list, isEdit, contract_id }) {
      if (update_list) {
        this.$nextTick(() => {
          this.init(contract_id);
        });
      }
      this.addReturnPlanShow = false;
    },
    // 新建 回款计划 新建 回款计划 新建 回款计划 新建 回款计划
    showDetail(row_id) {
      // console.log("详情 id》》》", row_id);

      this.detailShow = true;
      this.$nextTick(() => {
        this.$refs.refDetail.init(row_id);
      });
    },
    hideDetail() {
      this.detailShow = false;
    },
    hideRepair() {
      this.repairShow = false;
    },

    getProductCode(id){
      this.p_list = [];
      this.productCode = true;
      getData({
        url: "/contract/product_code_list",
        data: {
          shipment_id: id,
        }
      }).then(res => {
        let data = JSON.parse(JSON.stringify(res.data.detail.ship_good));
        let arr = [];
        for(let i = 0; i<data.length;i++){
          arr.push({name: '',show: false,list:[]});
          arr[i].name = data[i].contract_product?.product_name || '';
          arr[i].show = false;
          for(let j = 0;j<data[i].product_code.length;j++){
            arr[i].list.push({name:'',status: 1})
            arr[i].list[j].name = data[i].product_code[j];
            arr[i].list[j].status = 1;
          }
        }
        let r_arr = [];
        data.map(i=>{
          if(i.rework_shop_goods && i.rework_shop_goods.length){
            r_arr = [...r_arr, ...i.rework_shop_goods]
          }
        })
        // 重复数组
        r_arr = [...new Set(r_arr)];
        // 循环重复标红
        for(let i = 0;i<r_arr.length;i++){
          for(let j = 0;j<arr[i].list.length;j++){
            if(r_arr[i] == arr[i].list[j].name){
              arr[i].list[j].status = 0;
            }
          }
        }
        this.p_list = arr;
      })
    },

    // 返修记录
    repairLog(v,s) {
      if(!s){
        this.repairShow = true;
        this.$nextTick(() => {
          this.$refs.refRepair.init({
            code: v,
          });
        });
      }
    },

    // 折叠框
    open(v, k) {
      this.p_list.map((i) => (i.show = false));
      this.p_list[v].show = !k;
    },
  },
  components: {
    addReturn,
    addPlan,
    addContract,
    returndetail,
    repairLog
  },
};
</script>

<style lang="less" scoped>
.collapse {
  width: 100%;
  .c_item {
    width: 100%;
    margin-top: 6px;
    border: 1px solid #f0f0f0;
    border-radius: 2px 2px 0px 0px;
    .i_title {
      width: 100%;
      height: 51px;
      padding: 0 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 8px 8px 0px 0px;
      box-shadow: 0px 2px 1px #00000008;
      background: linear-gradient(90deg, #f2f6ff 0%, #ffffff 100%);
    }
    .i_list {
      width: 100%;
      max-height: 186px;
      display: flex;
      flex-wrap: wrap;
      background: #f8f8f8;
      transition: all 0.3s ease;
      justify-content: flex-start;
      box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.03);
      .i_l_name {
        width: 20%;
        height: 31px;
        min-width: 145px;
        padding: 6px 12px;
        margin: 6px 20px;
        font-size: 14px;
        text-align: center;
        box-sizing: border-box;
      }
    }
  }
}
.add_detail {
  .detail_title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .form_tit {
    margin: 24px 0 16px;
    font-size: 12px;
    font-weight: 600;
    color: #464c5b;
  }
}

.detail_main {
  padding-left: 24px;
}

.edit_btn {
  margin-bottom: 22px;

  .detail_status {
    .no {
      margin-right: 24px;
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      color: #464c5b;
    }

    .item {
      margin-right: 8px;
      padding: 0 9px;
      height: 24px;
      line-height: 24px;
      background: #f0f5ff;
      border-radius: 4px;

      font-size: 12px;
      font-weight: 400;
      color: #4d6fff;
    }

    .end {
      background-color: #ffeedd;
      color: #ffa629;
    }

    .end_icon {
      color: #ffa629;
      cursor: pointer;
    }
  }

  .edit {
    padding: 0;
    width: 68px;
    height: 32px;
    background: #0064f9;
    border-radius: 3px;

    color: #fff;
    font-size: 14px;
    font-weight: 400;
  }

  .gray {
    color: #666666;
    background-color: #fafafa;
    border: 1px solid #dddddd;
  }

  .err {
    color: #fff;
    background-color: #ff1400;
  }
}

.customer_info {
  padding: 25px 24px;
  margin-bottom: 23px;
  background: #f4f6ff;
  border-radius: 4px;

  .item_box {
    margin-bottom: 12px;

    .item {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #9ea7b4;

      span {
        color: #657180;
      }
    }
  }
}

.tabs_label {
  padding: 0 16px;
  height: 34px;
  line-height: 34px;
  background: #f4f7fb;
  border: 1px solid #e9ecf2;

  font-size: 12px;
  font-weight: 400;
  color: #9ea7b4;
}

/deep/.el-tabs__item {
  padding: 0;
  height: 34px;
}

.is-active {
  .tabs_label {
    color: #4d6fff !important;
    background-color: #fff !important;
  }
}

/deep/.el-tabs__active-bar {
  background-color: transparent;
}

.demo_table {
  border: 1px solid #e9ecf2;
}

.product_info {
  border: 1px solid #eaedf2;

  .guide_price {
    padding: 22px 24px;

    .price_box {
      border-left: 1px solid #d7dce6;

      .item {
        .txt {
          padding-left: 12px;
          width: 109px;
          height: 27px;
          line-height: 27px;
          font-size: 12px;
          font-weight: 400;
          color: #657180;
          text-align: left;

          border-right: 1px solid #d7dce6;
          border-top: 1px solid #d7dce6;
          border-bottom: 1px solid #d7dce6;
        }
      }
    }

    .no_price {
      margin: 0 auto;
      width: 24px;
      border: 1px solid #d1d7e2;
    }
  }

  .total_money {
    text-align: right;
    padding: 23px 25px 28px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #657180;

    span {
      color: #ffa629;
    }
  }
}

.return_info {
  .add_pro {
    width: auto !important;
    padding: 0 12px !important;
    height: 34px !important;
    font-size: 12px !important;
    color: #4d6fff !important;
    border: 1px solid #e7e7e7 !important;
    background-color: #e5eafe !important;
    border-radius: 4px !important;
  }

  .form_tit {
    margin: 0;
  }

  .tit_info {
    margin-bottom: 10px;
  }

  .item {
    margin-bottom: 28px;
  }
}
</style>
