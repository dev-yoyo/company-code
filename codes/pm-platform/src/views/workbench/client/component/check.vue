<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false" >
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>查看</h4>
            <div class="task-c">
                <section class="top">
                    <p><span>客户名称：</span> <span>{{dataList.name}}</span></p>
                    <p><span>客户简称：</span><span>{{dataList.abbr}}</span></p>
                    <div class="flex-center">
                        <p><span>联系人：</span><span>{{dataList.contact_name}}</span></p>
                        <p><span>联系方式：</span><span>{{dataList.contact_phone}}</span></p>
                    </div>
                    <div  class="flex-center">
                        <p><span>登录账号：</span><span>{{dataList.account}}</span></p>
                        <p><span>登录密码：</span><span>{{dataList.password}}</span></p>
                    </div>
                </section>
            </div>
        </el-drawer>
    </div>
</template>
  
<script>
import { getData } from "@/api/user";
export default {
props:['historyRow'],
    data() {
        return {
            collapseList:[],
            sqShow:true,
            openIndex:0,
            showAll:true,
            dataList:[],
            listLoading:true,
        }

    },
    created() {
      this.dataList=  this.historyRow
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },

    
    },
   
}
</script>
  
<style lang="less" scoped>
.check-task {

    .task-c{
        width: 6.19rem;
        height: calc(100%-1rem);
        background: linear-gradient(180deg, #EAF1F5 30%, #FFFFFF 100%);
        padding:  0.27rem ;
        margin-top: 0.2rem;
        p{
            margin-bottom: 0.3rem;
            font-size: 0.14rem;
            span:nth-of-type(1){
                display: inline-block;
                width: 0.75rem;
                color: #657180;
                text-align: justify;
                text-align-last: justify;
            }
            span:nth-of-type(2){
                width: 0.75rem;
                color: #333333;
            }
        }
        .flex-center{
            p{
                width: 2.5rem;
            }
        }
        
    }
}
</style>