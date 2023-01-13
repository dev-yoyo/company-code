<template>
  <div class="">
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-row-style="{ color: '#464C5B', 'font-size': '12px' }"
      :cell-style="{ color: '#657180', 'font-size': '12px' }"
       height="calc(100vh - 300px)"
       @sort-change="tableSortChange"

    >

      <el-table-column prop="deal_status" label="成交状态" min-width="100" fixed >
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="chooseDeal">
            <span class="el-dropdown-link">
              成交状态
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in dealStatusList" :key="i" :command="i">
                {{ v }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope">
          
          <div class="com-line-1" :class="scope.row.deal_status === true ? 'deal-success ' : 'deal-fail'">
            <div :class="scope.row.deal_status === true ? 'deal-success-icon ' : 'deal-fail-icon'">
              
            </div>
            {{ scope.row.deal_status ? '已成交' : '未成交' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="跟进时间" prop="follow_at" min-width="100" sortable="custom" fixed >
        <template slot-scope="scope">
          <div style="width: 100px">
            {{ scope.row.follow_at ? scope.row.follow_at : '' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed  prop="name" label="客户名称" min-width="100">
        <template slot-scope="scope">
          <div class="customer_name com-line-1" @click="customerDetail(scope.row)">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="company" label="企业名称" min-width="190"
      :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.company }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="所在地区" min-width="130" :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-popover popper-class="popover_area" placement="bottom-start" trigger="hover">
            <div slot="reference">
              所在地区
              <i class="el-icon-caret-bottom"></i>
            </div>

            <el-cascader-panel :options="areaColumns" :props="{ checkStrictly: true }" @change="change_cate" clearable>
            </el-cascader-panel>
          </el-popover>
        </template>

        <template slot-scope="scope">
          <div class="com-line-1">
            <span v-if="scope.row.area">{{ scope.row.area.name }}</span>
            <span v-if="scope.row.area_city">
              {{ scope.row.area_city.name }}
            </span>
            <span v-if="scope.row.area_area">
              {{ scope.row.area_area.name }}
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="level" label="级别" min-width="100" 
      :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="chooseLevel">
            <span class="el-dropdown-link">
              级别
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in levelList" :key="i" :command="i">
                {{ v }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.level || "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" prop="phone" min-width="120" 
      :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="企业角色" prop="company_role" min-width="100" :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="chooseRole">
            <span class="el-dropdown-link">
              企业角色
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in roleList" :key="i" :command="i">
                {{ v }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column label="来源" min-width="90" :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="chooseFrom">
            <span class="el-dropdown-link">
              来源
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in fromList" :key="i" :command="i">
                {{ v }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.from ? fromList[scope.row.from] : "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="负责人" prop="user_customer.user.name" min-width="90">
      </el-table-column>

      <el-table-column label="客户行业" min-width="120" :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="chooseIndustry">
            <span class="el-dropdown-link">
              客户行业
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in industryList" :key="i" :command="i">
                {{ v }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.industry || "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="客户状态" min-width="100" :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="chooseStatus">
            <span class="el-dropdown-link">
              客户状态
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in statusList" :key="i" :command="i">
                {{ v }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.customer_status === 0 ? "新获取" : "老客户" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="客户标签" min-width="100" :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="chooseTag">
            <span class="el-dropdown-link">
              客户标签
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in tagList" :key="i" :command="i">
                {{ v }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope">
          <div class="com-line-1">
            {{ scope.row.tag ? tagList[scope.row.tag] : "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" prop="modify_at" min-width="130" sortable="custom" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column label="创建时间" prop="created_at" min-width="100" sortable="custom" :show-overflow-tooltip="true">
      </el-table-column>
      <template slot="empty">
        <div class="table_empty">
          <img
            src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png" />
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: [
    "tableData",
    "levelList",
    "dealStatusList",
    "roleList",
    "fromList",
    "statusList",
    "tagList",
    "industryList",
    "areaColumns",
  ],
  data() {
    return {};
  },
  methods: {
    change_cate(i) {
      this.$emit("change_cate", i);
    },
    chooseLevel(i) {
      this.$emit("chooseLevel", i);
    },
    chooseDeal(i) {
      this.$emit("chooseDeal", i);
    },
    chooseRole(i) {
      this.$emit("chooseRole", i);
    },
    chooseFrom(i) {
      this.$emit("chooseFrom", i);
    },
    chooseIndustry(i) {
      this.$emit("chooseIndustry", i);
    },
    chooseStatus(i) {
      this.$emit("chooseStatus", i);
    },
    chooseTag(i) {
      this.$emit("chooseTag", i);
    },
    customerDetail(row) {
      this.$emit("customerDetail", row);
    },

    // 排序方法
    tableSortChange(column) {
      this.$emit("tableSortChange", column);
    },
  },
};
</script>

<style lang="less" scoped>
.deal-success {
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #03C919;
  opacity: 1;
  position: relative;
  display: flex;
  align-items: center;
  .deal-success-icon {
    width: 5px;
    height: 5px;
    background: rgba(49,211,67,0.3900);
    border-radius: 50%;
    opacity: 1;
    margin-right: 6px;
  }
}

.deal-fail {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 17px;
  color: #657180;
  opacity: 1;
  display: flex;
  align-items: center;
  .deal-fail-icon {
    width: 5px;
    height: 5px;
    background: rgba(101,113,128,0.3900);
    border-radius: 50%;
    opacity: 1;
    margin-right: 6px;
  }
}

</style>