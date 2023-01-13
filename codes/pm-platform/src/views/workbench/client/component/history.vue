<template>
    <div class="add">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7.39rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false"  v-loading="listLoading">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="title">历史记录</h4>
            <div> 
                <el-table :data="dataList" border style="width: 100%">
                <el-table-column prop="version" label="版本号">
                </el-table-column>
                <el-table-column prop="created_at" label="时间">
                </el-table-column>
                <el-table-column prop="user.stage_name" label="操作人">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="checkMore(scope.row)">查看</el-button>
                    </template>
                    
                </el-table-column>
            </el-table>
            </div>
        </el-drawer>
        <check v-if="checkShow" ref="refCheck" @cancel="checkShow=false"  :historyRow="historyRow"></check>
      
    </div>
    
</template>
  
<script>

import { getData } from "@/api/user";
import Check from './check.vue';
export default {
    components: {
        Check
    },
    props:['detailId'],
    data() {
        return {
            dataList:[{}],
            listLoading:true,
            checkShow:false,
            detail_id:'',
            historyRow:''
            
        }

    },
    created() {
        this.custormerHistory()
        console.log(this.detailId);
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        custormerHistory(){
            this.listLoading=true
            getData({
                url: "/workbech/admin_workbench/customer/history/"+this.detailId,
            }).then((res) => {
                this.listLoading=false
                this.dataList=res.data.list
            });
        },
        checkMore(row){

            this.checkShow=true
            // this.detail_id=id
            this.historyRow=row
        }
    },

}
</script>
  
<style lang="less" scoped>
.add {
    padding: 0.08rem 0.65rem 0;
    .title{
        margin-bottom: 0.28rem;
    }
    
}
</style>