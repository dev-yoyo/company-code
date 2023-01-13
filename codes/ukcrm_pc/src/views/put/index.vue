<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <setting-menu :activeMenu="activeMenu"></setting-menu>
      <top-nav active_title="应用中心" type="2"></top-nav>

      <div class="content_main">
        <div class="put_title">已开启应用</div>
        <ul class="ok_list">
          <li class="ok_item" v-for="(item,index) in ok_list" :key="'ok'+index">
            <div class="ok_wrap">
              <i class="t-icon" :class="item.icon"></i>
              <p class="name">{{item.name}}</p>
              <p class="tag"><span class="dian"></span>已启用</p>
            </div>
          </li>
        </ul>
        <div class="put_title">未启用</div>
        <ul class="ok_list">
          <li class="ok_item" v-for="(item,index) in no_list" :key="'no'+index">
            <div class="ok_wrap">
              <i class="t-icon" :class="item.icon"></i>
              <p class="name">{{item.name}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { delData, getData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      activeMenu: "put",
      ok_list: [
        {
          icon:'t-icon-khgl3',
          name:'客户管理'
        },
        {
          icon:'t-icon-cpgl3',
          name:'产品管理'
        },
        {
          icon:'t-icon-jygl3',
          name:'交易管理'
        }
      ],
      no_list: [
        {
          icon:'t-icon-zsk3',
          name:'知识库'
        },
        {
          icon:'t-icon-sjfx3',
          name:'数据分析'
        },
      ]
    };
  },
  components: {

  },
  created() {

  },
  methods: {
    
  },
};
</script>

<style lang="less" scoped>
.put_title {
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  color: #464C5B;
  margin-bottom: 15px;
}

.ok_list {
  .ok_item {
    display: inline-block;
    height: 210px;
    width: calc((100% - 24px) / 3);
    background: rgba(255, 255, 255, 0.39);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    margin-bottom: 28px;
    margin-right: 12px;
    background: #fff;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  .ok_wrap {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .t-icon {
    margin-bottom: 20px;
    width: 40px;
    height: 40px;
  }
  .name {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #657180;
    margin-bottom: 5px;
  }
  .tag {
    width: 66px;
    height: 24px;
    background: #F0F5FF;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    color: #4D6FFF;
    text-align: center;
    .dian {
      display:inline-block;
      width: 6px;
      height: 6px;
      background: #4D6FFF;
      border-radius: 50%;
      margin-right: 4px;
    }
    
  }
}
</style>
