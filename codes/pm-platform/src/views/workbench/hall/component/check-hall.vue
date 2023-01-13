<template>
    <div class="check-hall">
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="11.15rem" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false"
            v-loading="listLoading">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <h4 class="ck">查看</h4>
            <div class="hall-detail">
                <section class="list-box">
                    <div class="list-infor">
                        <div class="project-title">
                            <h3>
                                <svg class="icon" aria-hidden="true" v-if="dataList.front_status == '筹备中'">
                                    <use xlink:href="#icon-xmdt-cbz"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" v-else-if="dataList.front_status == '竞价结束'">
                                    <use xlink:href="#icon-xmdt-jjjs1"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" v-else-if="dataList.front_status == '竞价中'">
                                    <use xlink:href="#icon-xmdt-jjz"></use>
                                </svg>{{ dataList.name }}
                            </h3>
                            <!-- 筹备中 竞价中 竞价结束  -->
                            <!-- 预约提醒 竞价报名 按钮隐藏  -->
                            <span v-if="dataList.front_status != '竞价结束'">
                                    <span  v-if="dataList.front_status == '筹备中'">
                                        <el-button v-if=" !dataList.has_order" plain class="btn-alert" @click="appoint(dataList.id)"><i class="icon iconfont icon-xmdt-yytx"></i>
                                            预约提醒</el-button>
                                            <el-button v-if="dataList.has_order" plain class="btn-alert appoint"  disabled>已预约</el-button>
                                    </span>
                                    <span  v-else-if="dataList.front_status == '竞价中'">
                                        <el-button v-if=" !dataList.regist_status" plain class="btn-alert"  @click="signUp(signForm.type)">竞价报名</el-button>
                                        <el-button v-if=" dataList.regist_status" plain class="btn-alert appoint"  disabled>已报名</el-button>
                                    </span>
                            </span>
                        </div>
                        <div class="project-tag">
                            <p class="project-desc" v-if="dataList.margin && dataList.margin!='0.00'">
                                <span>保证金：</span><span class="color_FF980B">{{ dataList.margin }}</span>
                            </p>
                            <p class="project-desc" v-if="dataList.bidding_end_time">
                                <span>报名截止：</span><span class="color_3458DD">{{ dataList.bidding_end_time }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="basic-info">
                        <h4>基本信息：</h4>
                        <div class="mb55">
                            <div class="project-type">
                                <p v-if="dataList.type">项目类型：<span>{{ dataList.type }}</span> </p>
                                <p v-if="dataList.system">应用系统：<span>{{ dataList.system }}</span></p>
                                <p v-if="dataList.platform">主控平台：<span>{{ dataList.platform }}</span></p>
                                <p v-if="dataList.period">项目周期：<span>{{ dataList.period }}{{ dataList.period_type
                                }}</span></p>
                            </div>
                            <div class="fj" v-if="dataList.document">
                                <p>项目附件：<span class="color_3458DD">项目需求文档</span> <span class="color_3458DD dw"
                                        @click="downloadDoc(dataList.document)">下载</span></p>
                            </div>
                        </div>
                        <div class="project-desc mb55" v-if="dataList.desc">
                            <h4>需求描述：</h4>
                            <p v-html="dataList.desc"  class="p-desc"></p>

                        </div>
                    </div>

                    <div v-if="(dataList.team_bidding != null || (dataList.user_bidding && dataList.user_bidding.length != 0))"
                        :class="dataList.front_status == '竞价结束' ? 'pro_end' : ''">
                        <h4 class="recruit_title">招募信息：</h4>
                        <div class="recruit-box" id="aim-bm">
                            <!-- 个人 -->
                            <div class="recruit-item individual" v-for="(item, index) in dataList.user_bidding"
                                :key="index">
                                <div class="member-box" :class="item.status == '已录用'?'yly':''">
                                    <div class="member-title">

                                        <h3>
                                            <i class="iconfont iconfont icon-grhd"></i>
                                            <span v-if="item.role">{{ item.role }}</span>
                                        </h3>
                                        <div class="recruited" v-if="item.status == '已录用'">
                                            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-yzm.png"
                                                alt="">
                                        </div>
                                        <p class="project-price"><span class="font13">￥</span>{{ item.price_low }}-{{
                                                item.price_high
                                        }}</p>
                                    </div>


                                    <p class="member-level">
                                        等级要求：<span>lv.{{ item.request_level }}</span></p>
                                    <p class="member-skill"><span v-for="(val, key) in item.request_skill" :key="key">{{
                                            val
                                    }}</span></p>
                                </div>
                            </div>

                            <div class="recruit-item team" v-if="dataList.team_bidding != null">
                                <div class="member-box"  :class="dataList.team_bidding.status == '已录用'?'yly':''">
                                    <div class="member-title" v-if="dataList.team_bidding">
                                        <h3>
                                            <i class="iconfont icon-tdhd"></i>
                                            团队竞价</h3>
                                        <div class="recruited" v-if="dataList.team_bidding.status == '已录用'">
                                            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/xmxq-yzm.png"
                                                alt="">
                                        </div>
                                        <p class="project-price"><span class="font13">￥</span>{{
                                                dataList.team_bidding.price_low
                                        }}-{{ dataList.team_bidding.price_high }}</p>
                                    </div>
                                    <p class="member-level">
                                        等级要求：<span>lv.{{ dataList.team_bidding.request_level }}</span></p>
                                    <p class="member-skill " v-if="dataList.team_bidding"><span
                                            v-for="(val, key) in  dataList.team_bidding.request_skill" :key="key">{{ val
                                            }}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


        </el-drawer>
        <el-dialog title="竞价报名" width="30%" :visible.sync="dialogVisible" @close="cloasDia">
            <el-form label-position="top" :model="signForm" class="jjbm" :rules="rules" ref="signForm" >
                <el-form-item label="竞价岗位：" prop="bidding_id">
                    <el-select v-model="oVal" placeholder="请选择" style="width:5.35rem;" @change="getV" value-key="role">
                       <div v-if="role_id == 3">
                            <el-option v-for="(item, i) in selectPost" :key="i" :label="item.role" :value="item"
                                :disabled="item.type=='user'? true:false">
                            </el-option>
                       </div> 
                       <div v-else-if="role_id == 4">
                            <el-option v-for="(item, i) in selectPost" :key="i" :label="item.role" :value="item"
                            :disabled="item.type=='team'?true:false">
                            </el-option>
                       </div> 
                    </el-select>
                </el-form-item>
                <div class="post-infor" v-if="checkOption">
                    <div>
                        <p class="project-price">竞价区间：<span class="color_FF980B font13">¥</span><span
                                class="color_FF980B font16">{{ checkOption.price_low }}-{{ checkOption.price_high }}</span>
                        </p>
                    </div>
                    <div>
                        <p>等级要求：<span class="color_3458DD">LV.{{ checkOption.request_level }}</span></p>
                    </div>
                    <div class="skill-yq" v-if="checkOption.request_skill && checkOption.request_skill.length!=0">
                        <p>技能要求：<span class="font14" v-for="(v, i) in checkOption.request_skill" :key="i">{{ v }}</span>
                        </p>
                    </div>
                </div>
                <el-form-item label="您的竞价：" prop="price">
                    <el-input v-model="signForm.price" placeholder="¥ 请输入金额"></el-input>
                </el-form-item>
                <el-form-item label="预估时间："  prop="estimated_time">
                    <el-input placeholder="请输入天数" v-model="signForm.estimated_time"
                        style="width:5rem;margin-right: 0.1rem;"></el-input><span>天</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cloasDia">取 消</el-button>
                <el-button type="primary" @click="submit('signForm')">确 定</el-button>
            </span>

        </el-dialog>
    </div>
</template>
  
<script>
import { postData, getData } from "@/api/user";
import store from '@/store'
import config from "@/libs/config";
export default {
    name: "hallDeatil",
    props: ['detail_id'],
    data() {
        return {
            rateNum: 1,
            listLoading: false,
            dataList: [],
            dialogVisible: false,
            oVal: '',
            clickVal: '',
            is_leader: '',
            signForm: {
                price: '',
                estimated_time: '',
                type: '',
                bidding_id: '',
                project_id:""
            },
            selectPost: [],
            checkOption: '',
            searchOpt: [],
            rules:{
                bidding_id: [
                    { required: true, message: '请选择竞价岗位', trigger: 'change' }
                ],
                price: [
                    { required: true, message: '请输入您的竞价', trigger: 'change' }
                ],
                estimated_time: [
                    { required: true, message: '请输入预估时间', trigger: 'change' }
                ],
            },
            cr_url:''
            
        }
    },
    created() {
        this.cr_url =  process.env.NODE_ENV === "development"
        ? config.baseUrl.dev
        : config.baseUrl.pro;
        this.role_id = store.state.userInfo.role_id
        if (this.role_id == 3) {
            this.signForm.type = 'team'
        } else if (this.role_id == 4) {
            this.signForm.type = 'user'
        } else {
            this.signForm.type = ''
        }
        this.projectDetail();
    },
    methods: {
        cloasDia() {
            this.dialogVisible = false;
            this.checkOption = '';
            this.signForm.price = ''
            this.signForm.estimated_time = ''
            this.signForm.bidding_id = ''
            this.oVal=''
        },
        getV(item) {
            this.checkOption=item
            this.signForm.bidding_id=item.id
            this.signForm.project_id= this.dataList.id
            
        },
        cancel() {
            this.$emit('cancel', {})
        },
     
        // c查询竞价报名状态
        projectStoreApply(type, bidding_id, callback) {
            var apply_status = ''
            postData({
                url: "/project/check_apply",
                data: {
                    type,
                    bidding_id,
                },
            }).then((res) => {
                // code==422时 您已报名该项目岗位,无法参与该岗位竞争 true
                if (res.code == 200) {
                    apply_status = true
                    callback(apply_status)
                } else if (res.code == 422) {
                    apply_status = false
                    callback(apply_status)
                } else {
                    apply_status = false
                    callback(apply_status)
                }
            }).catch((err) => {

            })
        },

        // 文件下载
        downloadDoc(url) {
            window.open(this.cr_url+"/common/download?path=" + url)
        },
        // 预约 
        appoint(project_id) {
            var userinfor = store.state.userInfo

            if (this.role_id == 1 || this.role_id == 2) {
                this.$err('当前身份不允许预约！')
                return false
            }
            postData({
                url: "/project/store_order",
                data: {
                    project_id:project_id
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this.dialogVisible = false
                    this.projectDetail()

                }
            });


        },
        //竞价报名
        signUp(type) {
            this.dialogVisible = true
            // 2 非管理员非项目经理才可以报名

            // 4 已报名过项目的不可以报名相同项目 （个人和团队不能重复报名同一个项目!!!）
            var userinfor = store.state.userInfo

            if (this.role_id == 1 || this.role_id == 2) {
                this.$err('当前身份不允许报名！')
                return false
            }
            this.dialogVisible = true

        },
        //  表单提交 竞价报名
        submit(formName) {
            this.$refs[formName].validate((valid) =>{
                if(valid){
                    var data = this.signForm
                    postData({
                        url: "/project/store_apply",
                        data
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$message({
                                message: res.data.message,
                                type: 'success'
                            })
                            this.dialogVisible = false
                            this.projectDetail()
                            this.signForm = {}
                        }
                    });
                }

            })
            

        },
        // 列表查询
        projectDetail() {
            this.listLoading = true
            getData({
                url: "/project/detail/" + this.detail_id,
            }).then((res) => {
                this.listLoading = false
                this.dataList = res.data.info
                var arr = []
                //  当只有团队竞价时
                
                // 当只有个人竞价时
               
                if (res.data.info.user_bidding && res.data.info.user_bidding.length != 0 && res.data.info.team_bidding && res.data.info.team_bidding != null) {
                    res.data.info.team_bidding.role = '团队竞价'
                    arr.push(res.data.info.team_bidding)
                    this.selectPost = [...res.data.info.user_bidding, ...arr]
                }else if (res.data.info.team_bidding && res.data.info.team_bidding != null) {
                    res.data.info.team_bidding.role = '团队竞价'
                    arr.push(res.data.info.team_bidding)
                    this.selectPost = [...arr]
                }else  if (res.data.info.user_bidding && res.data.info.user_bidding.length != 0) {
                    this.selectPost = [...res.data.info.user_bidding]
                }

            });
        },
    }
}
</script>
  
<style lang="less" scoped>
p.p-desc {

    /deep/img {
        width: 100% !important;
    }
}
.drawer_box {
    /deep/.el-drawer__body {
        padding: 0.8rem 0.6rem 0.4rem 0.68rem;
    }
}
// /deep/.el-select-dropdown__item.hover,   /deep/.el-select-dropdown__item:hover{
//         background-color: #EDF9FF!important;
//         color: #3458DD;
//     }
.list-infor {
    border-bottom: 1px solid #E8E8E8;
    padding-bottom: 0.29rem;
}

.check-hall {
    position: relative;
    height: 100vh;
    position: relative;
    box-sizing: border-box;

    /deep/.el-dialog__body {
        padding: 20px;
    }
    .yly{
        background:#F8F8F8 ;
        
      svg,  h3,p span,.iconfont,p.project-price{
            color: #C3C3C3!important;
            font-weight: 300;
        }
    }

    .dialog-footer{
        .el-button{
            width: 0.68rem!important;
            height: 0.32rem!important;
            padding: 0!important;
            text-align: center;
        
        }
    }
    .color_FF980B {
        color: #FF980B !important;
    }

    .post-infor {
        width: 100%;
        background-color: #F4F4F4;
        padding: 0.15rem 0.2rem 0.1rem;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.2rem;

        span {
            color: #666666;
        }

        .font14 {
            font-size: 0.14rem;
        }

        .font16 {
            font-size: 0.16rem;
        }

        .skill-yq {
            width: 100%;
            margin-bottom: 0;

            span {
                margin-right: 0.05rem;
            }
        }

        div {
            width: 50%;
            margin-bottom: 0.14rem;

            p {
                color: #999999;
                font-size: 0.13rem;
            }
        }

    }

    .jjbm {

        /deep/.el-form-item__label {
            font-size: 0.13rem;
            color: #333;
            // margin-bottom: 0.08rem;
            line-height: initial;

        }

        /deep/.el-input__inner {
            height: 0.38rem;
            line-height: 0.38rem;
        }

    }

    .ck {
        font-size: 0.16rem;
        margin-bottom: 0.24rem;

    }

    .pro_end {
        filter: grayscale();
    }

    .project-title {
        display: flex;
        margin-bottom: 0.21rem;
        align-items: flex-start;

        .btn-alert {
            width: 0.95rem;
            height: 0.3rem;
            background: #3458DD;
            box-shadow: 0rem 0rem 0rem rgba(12, 69, 160, 0.25);
            border-radius: 0.04rem;
            color: #fff;
            padding: 0;
            font-size: 0.13rem;
            vertical-align: top;

            i {
                font-size: 0.13rem;
            }
        }

        .appoint {
            background: #CECECE !important;
            border: 1px solid #CECECE !important;
        }

        svg {
            width: 0.52rem;
            height: 0.21rem;
            margin-right: 0.1rem;
            align-self: center;
        }

        h3 {
            font-size: 0.21rem;
            color: #333;
            margin-right: 0.1rem;
            width: 90%;
        }



    }

    .project-tag {


        .project-desc {
            font-size: 0.14rem;
            color: #333;
            margin-right: 0.4rem;
            display: inline-block;

            // margin-bottom: 0.56rem;
            h4 {
                margin-bottom: 0.1rem;
                color: #333;
                font-size: 0.16rem;
            }

            span {
                color: #666;
            }
        }
    }

    .dw {
        text-decoration: underline;
        cursor: pointer;
    }

    .recruit_title {
        margin-bottom: 0.17rem;
    }

    .recruit-box {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        position: relative;
        -moz-user-select: none;
        /* Firefox私有属性 */

        -webkit-user-select: none;
        /* WebKit内核私有属性 */

        -ms-user-select: none;
        /* IE私有属性(IE10及以后) */

        -khtml-user-select: none;
        /* KHTML内核私有属性 */

        -o-user-select: none;
        /* Opera私有属性 */

        user-select: none;
        /* CSS3属性 */

        .recruit-item:nth-child(3n) {
            margin-right: 0;
        }

        .recruit-item {
            width: 3.21rem;
            // height: 1.14rem;
            box-shadow: 0 0 0.05rem 0.01rem #efefef;
            margin: 0 0.08rem 0.08rem 0;
            position: relative;



            .member-box {
                width: 3.21rem;
                height: 1.41rem;
                padding: 0.2rem;

                .member-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;

                    h3 {
                        font-size: 0.16rem;
                        color: #333;
                        margin-bottom: 0.1rem;

                        // svg {
                        //     margin-right: 0.06rem;
                        // }
                        .iconfont{
                            margin-right: 0.06rem;
                        }
                        .icon-tdhd{
                            color: #FF980B;
                        }
                        .icon-grhd{
                            color: #3458DD;
                        }
                    }

                    .el-button {
                        padding: 0.06rem 0.13rem;
                        background: #3458DD;
                    }

                    .grey {
                        background: #D9D9D9 !important;
                        border: 1px solid #D9D9D9 !important;
                    }

                    .recruited {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 0.93rem;
                        height: 0.73rem;
                    }

                }

                .project-price {
                    font-size: 0.16rem;
                    font-weight: 600;
                    color: #FF980B;
                    margin-bottom: 0.11rem;

                    .font13 {
                        font-size: 0.13rem;
                    }

                }

                .member-infor {
                    margin-bottom: 0.1rem;

                    img {
                        width: 0.25rem;
                        height: 0.25rem;
                        border-radius: 50%;
                        margin-right: 0.08rem;
                        vertical-align: middle;
                    }

                    span {
                        font-size: 0.14rem;
                        font-weight: 500;
                        color: #333333;
                    }

                }

                .team-member-infor {
                    margin-bottom: 0.44rem;
                }

                .member-level {
                    font-size: 0.13rem;
                    font-weight: 400;
                    line-height: 0.18rem;
                    color: #999999;
                    margin-bottom: 0.1rem;

                    span {
                        font-size: 0.14rem;
                        font-weight: 400;
                        line-height: 0.2rem;
                        color: #333333;
                    }

                }

                .member-skill {
                    width: 2.5rem;
                    // height: 0.4rem;
                    font-size: 0.14rem;
                    font-weight: 400;
                    line-height: 0.2rem;
                    color: #333333;

                    span {
                        margin-right: 0.05rem;
                    }
                }

                .vague {
                    filter: blur(0.1rem);
                    pointer-events: none;
                }
            }
        }


    }


    .project-type {
        display: flex;
        justify-content: flex-start;

        p {
            margin-right: 0.5rem;
            font-size: 0.14rem;
            margin-bottom: 0.16rem;
            color: #666666;

            span {
                color: #333;
            }
        }

    }

    .fj {
        font-size: 0.14rem;

    }

    .mb55 {
        margin-bottom: 0.55rem;
    }

    .basic-info {
        padding-top: 0.31rem;

        h4 {
            font-size: 0.16rem;
            color: #333;
            margin-bottom: 0.1rem;
        }
    }


}
</style>