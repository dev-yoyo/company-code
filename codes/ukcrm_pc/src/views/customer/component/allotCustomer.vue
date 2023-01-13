<template>
  <div class="">
    <el-dialog
      :visible.sync="allotDialogShow"
      width="533px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="dialog_box"
    >
      <div class="">
        <div class="dialog_title d-between">
          <div class="title">分配客户</div>
          <i class="iconfont icon-ykbx" @click="hideDialog()"></i>
        </div>

        <div class="dialog_content">
          <div class="item">
            <div class="tit">负责人</div>
            <div>
              <el-autocomplete
                class="autocomplete_input"
                v-model="moveUser"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="chooseMemebr"
              ></el-autocomplete>
            </div>
          </div>
        </div>

        <div class="dialog_footer d-flex">
          <el-button class="btn_item cancel" @click="hideDialog()">
            取 消
          </el-button>
          <el-button
            class="btn_item"
            type="primary"
            @click="submitMove"
            :loading="createLoading"
            :disabled="createLoading"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getData,postData, getCompanyList } from "@/api/user";
import store from "@/store";

export default {
  props: {
    allotDialogShow: {
      type: Boolean,
      default: false,
    },
    moveType: {
      // one 单个操作 、 all 批量操作
      type: String,
      default: "",
    },
    activeCustomer: {
      // 要分配的客户
      type: Object,
      default: {},
    },
    moveUserCheckList: {
      //表格选中的row
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      // moveType: "",
      // activeCustomer: {}, // 要分配的客户
      // moveUserCheckList: [], //表格选中的row
      moveUser: "", // 分配成员 !!!!!用不到 前端展示用

      activeMember: {}, // 选中分配成员
      createLoading: false,
    };
  },
  created() {
    this.user = store.state.userInfo;
  },
  methods: {
    querySearch(queryString, cb) {
      getData({
        url: "/company/company_department_member",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          let data = user_list && user_list.data;
          data.map((e) => {
            e.value = `${e.user.name}(${e.user.phone})`;
          });
          var restaurants = data;
          var results = queryString
            ? restaurants.filter(this.createFilter(queryString))
            : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
        }
      });

      // getCompanyList({
      //   data: {
      //     search_word: queryString,
      //   },
      // }).then((res) => {
      //   const {
      //     code,
      //     data: {
      //       user_list: { data },
      //     },
      //   } = res;
      //   if (code === 200) {
      //     data.map((e) => {
      //       e.value = `${e.user.name}(${e.user.phone})`;
      //     });
      //     var restaurants = data;
      //     var results = queryString
      //       ? restaurants.filter(this.createFilter(queryString))
      //       : restaurants;
      //     // 调用 callback 返回建议列表的数据
      //     cb(results);
      //   }
      // });
    },

    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    // 分配人员 选中
    chooseMemebr(item) {
      // console.log(item);
      this.activeMember = item;
    },
    // 确定 分配
    submitMove() {
      let ids = [];
      // console.log(this.activeMember, this.activeCustomer);

      if (!this.activeMember.id) {
        return this.$warning("请选择分配负责人");
      }

      if (this.moveType == "all") {
        let arr = this.moveUserCheckList;
        arr.map((e) => {
          ids.push(e.id);
        });
      } else {
        ids = [this.activeCustomer.id];
      }

      this.createLoading = true;
      postData({
        url: "/customer/distribution_customer",
        data: {
          user_id: this.activeMember.user_id,
          customer_ids: ids,
        },
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.hideDialog(true);
        } else if (code === 422) {
          this.$err(msg);
          this.createLoading = false;
        }
      });
    },

    hideDialog(update = false) {
      this.createLoading = false;
      this.$emit("hideAllotDialog", update);

      this.activeMember = {};
      this.moveUser = "";
    },
  },
};
</script>

<style lang="less" scoped>
</style>