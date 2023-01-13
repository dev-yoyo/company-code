<template>
  <div class="add_detail">
    <el-drawer
      :visible="historyVisable"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      :close-on-press-escape="false"
      size="667px"
      class="drawer_box"
      :wrapperClosable="true"
    >
      <div class="title">历史版本</div>
      <div class="close_icon d-center" @click="cancel()">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <el-table
        ref="singleTable"
        :data="tableData"
        style="width: 100%; overflow: auto"
        :header-row-style="{
          color: '#657180',
          'font-size': '12px',
        }"
        :cell-style="{ color: '#657180', 'font-size': '12px' }"
        class="demo_table"
        :border="show"
      >
        <el-table-column
          label="修改人"
          min-width="117"
          align="center"
          prop="user.name"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          min-width="155"
          align="center"
          prop="type"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          label="时间"
          min-width="169"
          align="center"
          prop="created_at"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          prop="product_price"
          min-width="130"
          align="center"
        >
          <template slot-scope="scope">
            <div class="edit">
              <div class="view" @click="view(scope.$index, scope.row)">
                查看
              </div>
              <div
                :class="
                  scope.$index === 0 ||
                  !customer_belong ||
                  queryType == 'revoke'
                    ? 'acitvie'
                    : 'recovery'
                "
                @click="recovery(scope.$index, scope.row)"
              >
                恢复
              </div>
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
    </el-drawer>

    <el-dialog
      title="查看"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogView"
      width="533px"
      height="421px"
    >
      <div class="edit-box">
        <div class="edit-name">
          <span class="info-title">创建人：</span>
          <span class="info-content">{{
            info.user && info.user.name ? info.user.name : "————"
          }}</span>
        </div>
        <div class="create-time">
          <span class="info-title">创建时间：</span>
          <span class="info-content">{{
            info.created_at ? info.created_at : "——"
          }}</span>
        </div>
      </div>

      <div class="info-title">客户信息：</div>

      <div class="customer-info">
        <div class="info-data">
          <div class="custer-name">
            <span class="info-title">客户名称：</span>
            <span class="info-content">{{ info.name ? info.name : "——" }}</span>
          </div>
          <div class="phone">
            <span class="info-title">联系电话：</span>
            <span class="info-content">{{
              info.phone ? info.phone : "——"
            }}</span>
          </div>
        </div>
        <div class="info-data">
          <div>
            <span class="info-title">企业角色：</span>
            <span class="info-content">{{
              info.company_role ? info.company_role : "——"
            }}</span>
          </div>
          <div>
            <span class="info-title">微信账号：</span>
            <span class="info-content">{{
              info.wechat ? info.wechat : "——"
            }}</span>
          </div>
        </div>
        <div class="info-list">
          <span class="info-title">关联企业：</span>
          <span class="info-content">{{
            info.company ? info.company : "——"
          }}</span>
        </div>
        <div class="info-list">
          <span class="info-title">企业地址：</span>
          <span class="info-content">{{
            info.address ? info.address : "——"
          }}</span>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogView = false">取 消</el-button>
        <el-button
          :disabled="!customer_belong || queryType == 'revoke' || index === 0"
          type="primary"
          @click="recoveryEdit"
        >
          恢复当前版本</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";

export default {
  props: {
    historyVisable: {
      type: Boolean,
      default: true,
    },
    customer_belong: {
      type: Boolean,
      default: true,
    },
    queryType: {
      type: String,
      default: "",
    },
    customer_id: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      show: true,
      tableData: [],
      dialogView: false,
      info: {},
      id: "",
      index: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let customer_id = this.customer_id;
      this.$nextTick(() => {
        // 编辑
        if (customer_id) {
          getData({
            url: "/customer/customer_log?id=" + customer_id,
            data: {},
          }).then((res) => {
            const {
              code,
              data: { list },
            } = res;
            if (code === 200) {
              let data = list.data;
              this.tableData = data;
            }
          });
        }
      });
    },

    // 恢复
    recovery(i, t) {
      if (i === 0 || !this.customer_belong || this.queryType == "revoke")
        return;
      this.recoveryEdition(t.id);
    },

    // 查看
    view(i, t) {
      this.index = i;
      this.info = t;
      this.id = this.info.id;
      this.dialogView = true;
    },

    recoveryEdit() {
      this.recoveryEdition(this.id);
    },

    // 恢复当前版本
    recoveryEdition(id) {
      let data = {
        id: id,
      };
      postData({
        url: "/customer/rollback_customer",
        data: data,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.dialogView = false;
          this.init();
        } else if (code === 422) {
          this.$err(msg);
          this.init();
          this.dialogView = false;
        }
      });
    },

    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less" scoped>
.add_detail {
  .title {
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
    line-height: 17px;
    color: #464c5b;
  }
}

.edit {
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  opacity: 1;

  .view {
    cursor: pointer;
    color: #3399ff;
  }

  .active {
    color: #eaedf2;
  }

  .recovery {
    cursor: pointer;
    color: #3399ff;
  }
}

.edit-box {
  width: 485px;
  // height: 76px;
  background: rgba(239, 246, 255, 1);
  opacity: 1;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  padding: 27px 66px 27px 33px;

  .info-content {
    font-size: 15px;
    font-weight: 600;
    color: #464c5b;
  }

  .info-title {
    font-size: 14px;
    font-weight: 600;
    color: #464c5b;
  }
}

.info-title {
  font-weight: 400;
  line-height: 18px;
  color: #999999;
  // letter-spacing: 20px;
  margin: 16px 0 10px 0;
}

.customer-info {
  width: 485px;
  // height: 181px;
  background: rgba(250, 250, 250, 1);
  opacity: 1;
  border-radius: 4px;
  padding: 20px 31px 20px 33px;

  .info-data {
    padding-right: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
    div {
      width: 45%;
    }
  }

  .info-list {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 2; //行数
    line-clamp: 2;
    -webkit-box-orient: vertical; //盒子中内容竖直排列
    margin-top: 14px;
  }

  .info-title {
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 18px;
    color: #666666;
  }

  .inf-content {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }
}
</style>