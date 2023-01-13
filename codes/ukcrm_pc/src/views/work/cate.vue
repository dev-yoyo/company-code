<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <setting-menu :activeMenu="activeMenu"></setting-menu>
      <top-nav active_title="产品类目" type="2"></top-nav>

      <div class="content_main">
        <div class="title">产品类目设置<span class="tip">注：产品类目最多设置2级</span></div>
        <div class="cate">
          <div class="top d-between">
            <p class="sub">全部分类</p>
            <div class="btn" @click="add()"><i class="iconfont icon-ykb-tj"></i>添加一级分类</div>
          </div>

          <ul class="one_list">
            <li class="one_item" v-for="(v) in list" :key="v.id">
              <div class="bg d-between">
                <div class="name d-flex" @click="toggle(v)">
                  <i class="iconfont icon-ykb-fljj1" v-if="v.open"></i>
                  <i class="iconfont icon-ykb-fljh1" v-else></i>
                  {{v.name}}
                </div>
                <div class="action">
                  <span @click="add(v.id)">添加子类</span>
                  <span @click="name(v)">重命名</span>
                  <span @click="remove(v,1)">删除</span>
                </div>
              </div>
              <ul class="two_list" v-show="v.open">
                <li class="two_item d-between" v-for="(a,b) in v.children" :key="b">
                  <div class="bg d-between">
                    <div class="name d-flex">{{a.name}}</div>
                    <div class="action">
                      <span @click="name(a)">重命名</span>
                      <span @click="remove(a,2)">删除</span>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <add ref="add" v-if="visible"  @cancel="hideadd"></add>
      <remove ref="remove" v-if="visible_remove"  @cancel="hideremove"></remove>
      <!-- <el-dialog
        class="modal_join"
        title="提示"
        :modal-append-to-body="false"
        :visible.sync="visible"
        :before-close="handleClose">
        <span>确认删除这吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()"  :disabled="createLoading">取 消</el-button>
          <el-button type="primary" @click="confirm" :loading="createLoading" :disabled="createLoading">确 定</el-button>
        </span>
      </el-dialog> -->
    </div>
  </div>
</template>

<script>
import { delData, getData } from "@/api/user";
import store from "@/store";
import add from './component/cate_add.vue'
import remove from './component/cate_del.vue'

export default {
  data() {
    return {
      activeMenu: "cate",
      list:[],
      visible: false,
      visible_remove: false
    };
  },
  components: {
    add,
    remove
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getData({
        url: "/classify",
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        if (code === 200) {
          this.list = list
          if(this.list.length > 0) {
            this.list.forEach((v,k)=>{
              v.open = true
            })
          }
        }else {
          this.list = []
          this.$err(msg)
        }
      });
    },
    toggle(v) {
      if(v.children && v.children.length > 0) {
        let bol = !v.open
        this.$set(v, 'open', bol)
        this.$forceUpdate()
      }
    },

    // -----------------------新增--------------------
    add (id) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.add.handleOpen(id);
      });
    },

    hideadd() {
      this.visible = false
      this.init()
    },

    name (v) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.add.handleName(v.id,v.name);
      });
    },

    // -----------------------删除--------------------
    remove (v,level) {
      this.visible_remove = true;
      this.$nextTick(() => {
        this.$refs.remove.handleOpen(v.id,v.name);
      });
    },

    hideremove() {
      this.visible_remove = false
      this.init()
    },

  },
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 23px;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: #464c5b;
  .tip {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
      margin-left: 12px;
  }
  }
.cate {
  min-height: 85vh;
  padding: 26px 24px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 18px;
  background: #fff;

  .sub {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #464C5B;
  }
  
  .btn {
    width: 116px;
    height: 34px;
    background: #4D6FFF;
    border: 1px solid #E7E7E7;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 400;
    line-height: 34px;
    color: #FFFFFF;
    text-align:center;
    cursor: pointer;
    .iconfont {
      font-size: 12px;
      margin-right: 3px;
    }
  }

  .top {
    margin-bottom: 15px;
  }

  li {
    line-height: 40px;
    margin-bottom: 1px;
  }

  .bg {
    padding: 0 24px;
    width: 100%;
  }

  .two_item {
    .name {
      padding: 0 0 0 40px;
    }
  }

  .name {
    font-size: 12px;
    font-weight: 400;
    line-height: 40px;
    color: #657180;
    cursor: pointer;
    .iconfont {
      margin-right: 4px;
    }
  }

  .action {
    font-size: 12px;
    font-weight: 400;
    line-height: 40px;
    color: #3399FF;
    display: none;
    span {
      display: inline-block;
      margin-left: 12px;
      cursor: pointer;
    }
  }

  .bg:hover {
    background: #F7F7F7;
    .action {
      display: inline-block;
    }
  }
}
</style>
