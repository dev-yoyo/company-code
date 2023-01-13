<template>
    <div class="check-task">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="7rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4>结算</h4>
            <div class="task-c">
                <section class="top">
                    <div class="flex-box">
                        <p class="color_666 flex-item"><span class="wid-j">用户名：</span><span
                                class="color_333" v-if="settleList.user">{{settleList.user.stage_name}}</span></p>
                        <p class="color_666 flex-item"><span class="wid-j">成员角色：</span><span
                                class="color_333">{{settleList.role}}</span></p>
                        <p class="color_666 flex-item"><span class="wid-j">应付费用：</span><span
                                class="color_333">￥{{settleList.price}}</span></p>
                        <p class="color_666 flex-item"><span class="wid-j">已结费用：</span><span class="color_FF980B">￥{{settleList.settle_price}}</span>
                        </p>
                    </div>
                    <div class="flex-center settle-money">
                        <div>
                            <p class="color_999">剩余结算金额</p>
                            <p class="w-600">￥{{settleList.left_price}}</p>
                        </div>
                        <div>
                        <label for=""  class="color_999">结算金额：</label>
                            <el-input  placeholder="请输入" style="width:2.56rem;"  v-model="settleData.settle_price"></el-input>
                        </div>
                    </div>
                    <div class="module-center">
                            <el-button type="" class="canclel"  @click="cancel()">取消</el-button>
                            <el-button type="primary" class="confirm" @click="confirm" :loading="listLoading" :disabled="listLoading">确定 </el-button>
                        </div>

                </section>
               
            </div>
        </el-drawer>
    </div>
</template>
  
<script>
     import { postData, getData } from "@/api/user";
export default {
    // name:'checkQuestion',
    props:['memberId','memberRow','currentUrl'],
    data() {
        return {
            listLoading:false,
        settleList:[],
        settleData:{
            user_join_id:'',
            settle_price:''
        }
        }
    },
    created() {
        this.settleList=this.memberRow
        console.log(this.settleList);
        this.settleData.user_join_id=this.memberRow.id
    },
    methods: {
        cancel() {
            this.$emit("cancel", {});
        },
        confirm() {
            var data =this.settleData
            if(!this.settleData.settle_price){
                this.$message.error('请输入结算金额');
                return false
            }
            this.listLoading= !this.listLoading
            postData({
                url: "/workbech/"+this.currentUrl+"/project_member/store_settle_price",
                data
            }).then((res) => {
                this.listLoading= !this.listLoading
                if (res.code == 200) {
                    this.$success(res.data.msg)
                    this.$emit("cancel", {});
                } else {

                }
            }).catch(err=>{
                this.listLoading= !this.listLoading
            })
 
        }
    },
    components: {
    },
}
</script>
  
<style lang="less" scoped>
.check-task {

    .task-c {
        width: 6.19rem;
        height: calc(100%-1rem);

        background: linear-gradient(180deg, #EAF1F5 20%, #FFFFFF 50%);
        padding: 0.13rem 0.21rem 0;
        margin-top: 0.2rem;

        .top {
            height: 4rem;

            .flex-item {
                width: 2.5rem;
            }
            .module-center{
            width:6rem;
            margin:  0.4rem auto 0;
            text-align: center;
            .el-button{
                width: 1.82rem;
            }
        }
        .settle-money{
            margin: 0.64rem 0;

        }


            p {
                font-size: 0.14rem;
                margin-bottom: 0.08rem;

                .wid-j {
                    width: 0.7rem;
                    display: inline-block;
                    text-align: justify;
                    text-align-last: justify;
                }
            }

            .mb {
                width: 100%;
                margin-bottom: 0.5rem;
            }
        }

       
    }
}
</style>