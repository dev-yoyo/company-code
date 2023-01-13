<template>
  <div class="move">
    <el-dialog
      class="modal_join"
      title="移出员工"
      width="533px"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose">

      <div class="grey d-between">
        <p>员工名称：<span>{{name}}</span></p>
        <p>员工角色：<span>{{role}}</span></p>
      </div>
      <div class="tip"><i class="iconfont icon-ykb-zy"></i>移出员工后，该员工将不能进入企业，是否移出成员</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="check" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="modal_join"
      title="提示"
      width="533px"
      :modal-append-to-body="false"
      :visible.sync="visible_tran"
      :before-close="handleClose">

      <div class="tip"><i class="iconfont icon-ykb-zy"></i>该员工下有正在跟进的客户，请将客户移交给企业其他成员，才可移出该成员</div>

      <div class="people">
        <div class="tit">移交负责人</div>
        <div class="content">
          <el-autocomplete
            class="autocomplete_input"
            v-model="moveUser"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="chooseMemebr"
          ></el-autocomplete>
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getData,postData, getCompanyList } from "@/api/user";

export default {
  name: "move",
  data() {
    return {
      visible: false,
      visible_tran: false,
      createLoading: false,
      user_id:'',
      name:'',
      role:'',

      moveUser: "",
      activeMember: {}, // 选中移交成员
    };
  },
  methods: {
    check() {
      // 是否存在客户
      getData({
        url: "/user/user_has_customer",
        data: {
          user_id: this.user_id
        }
      }).then((res) => {
        const {
          code,
          data: { has_customer_status, msg },
        } = res;
        if (code === 200) {
          if(has_customer_status) {
            this.visible_tran = true
          }else {
            this.visible_tran = false
            this.confirm()
          }
        }else {
          this.$err(msg)
        }
      });
    },

    querySearch(queryString, cb) {
      getCompanyList({
        data: {
          search_word: queryString,
          exclude_user_id: this.user_id
        },
      }).then((res) => {
        const {
          code,
          data: {
            user_list: { data },
          },
        } = res;
        if (code === 200) {
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
    },

    // 移交人员 选中
    chooseMemebr(item) {
      this.activeMember = item;
    },

    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },


    // ----------------提交----------------
    confirm() {
      this.createLoading = !this.createLoading;
      let id = this.activeMember && this.activeMember.user_id ? this.activeMember.user_id : 0
      postData({
        url: "/company/remove_company",
        data: {
          user_id: this.user_id,
          receive_user_id: id
        }
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.handleClose()
          this.tranClose()
        } else if (code === 422) {
            this.createLoading = false;
            this.$err(msg);
        }else {
          this.createLoading = false;
        }
      })
    },

    handleOpen(id,name,role) {
      this.user_id = id || 0
      this.name = name || '',
      this.role = role || ''
      this.visible = true
    },

    handleClose() {
      this.visible = false
      this.$emit('cancel')
    },
    
    tranClose() {
      this.visible_tran = false
      this.$emit('cancel')
    },
  },
};
</script>

<style lang="less">
.move {

  .grey{
    background: #f7f7f7;
    padding: 23px 67px;
    margin-bottom: 20px;
  }

  .tip {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #333333;
    .iconfont {
      color:#FF9025;
      margin-right: 5px;
    }
  }

  .people {
    margin-top: 20px;
    .tit {
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
      color: #333333;
    }
  }
  
  .el-autocomplete {
    width: 100%!important;
  }
}
</style>s