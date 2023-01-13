<template>
    <div>
        <el-drawer :visible="true" direction="rtl" :before-close="cancel" :show-close="false" :withHeader="false"
            size="1054px" class="drawer_box" :close-on-press-escape="false" :wrapperClosable="false">
            <div class="close_icon d-center" @click="cancel()">
                <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                    <use xlink:href="#icon-gzt-xx"></use>
                </svg>
            </div>
            <div class="project-desc">
                <p class="desc">项目信息</p>
                <h4 class="desc-title">基本信息</h4>
                <div class="flex-box jb_infor">
                    <div v-if="dataList.name">
                        <span>项目名称：</span>{{ dataList.name }}
                    </div>
                    <div v-if="dataList.number">
                        <span>项目编号：</span>{{ dataList.number }}
                    </div>
                    <div v-if="dataList.background_status" class="color_3458DD">
                        <span>项目状态：</span>{{ dataList.background_status }}
                    </div>
                    <div v-if="dataList.type">
                        <span>项目类型：</span>{{ dataList.type }}
                    </div>
                    <div v-if="dataList.customer && dataList.customer.name && projShow">
                        <span>客户名称：</span>{{ dataList.customer.name }}
                    </div>
                    <div v-if="dataList.project_cost_detail && dataList.project_cost_detail.price && projShow">
                        <span>项目费用：</span> {{ dataList.project_cost_detail.price }}
                    </div>
                    <div v-if="dataList.platform">
                        <span>应用平台：</span>{{ dataList.platform }}
                    </div>
                    <div v-if="dataList.period && dataList.period_type">
                        <span>项目周期：</span>{{ dataList.period }}{{ dataList.period_type }}
                    </div>
                    <div v-if="dataList.manager_user && dataList.manager_user.stage_name">
                        <span>项目经理：</span>{{ dataList.manager_user.stage_name }}
                    </div>
                </div>
            </div>
            <h4 class="desc-title">项目需求</h4>
            <p v-html="dataList.desc" class="p-desc"></p>
            <p v-if="!dataList.desc" class="p-desc">待说明</p>
            <div class="flex-box jb_infor" v-if="dataList.attachments!=''">
                <span>项目附件：</span>
                <div class="file-box">
                    <div class="file-item" v-for="(v,i) in dataList.attachments" :key="i">
                        <svg class="icon icon-gzt-xmyj" aria-hidden="true">
                            <use xlink:href="#icon-xmdt-wj"></use>
                        </svg>
                        <!-- com-line-1 -->
                        <span class="f_name ">{{v.document_name}}</span>
                        <a class="dw" @click="downloadDoc(v.document)">下载</a>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script>
import { postData, getData } from "@/api/user";
import config from '@/libs/config'
import store from "@/store";
export default {
    props: ['allProject_id', 'currentUrl'],
    data() {
        return {
            dataList:  {
                    attachments:[]
                }
            ,
            cr_url: '',
            role_id: "",
            projShow: false
        }
    },
    created() {
        this.cr_url = process.env.NODE_ENV === "development"
            ? config.baseUrl.dev
            : config.baseUrl.pro;
        this.projectDetail()
        this.role_id = store.state.userInfo.role_id
        this.projShow = (this.role_id == 1 || this.role_id == 2) ? true : false;
    },
    methods: {
        // 文件下载
        downloadDoc(url) {
            window.open(this.cr_url + "/common/download?path=" + url)

        },
        // 详情
        projectDetail() {
            this.listLoading = true
            getData({
                url: "/workbech/" + this.currentUrl + "/project/detail/" + this.allProject_id,
            }).then((res) => {
                this.dataList = res.data.info
            });
        },
        cancel() {
            this.$emit("cancel", {});
        },
    }
};

</script>
<style lang="less" scoped>
.desc-title {
    font-size: 0.16rem;
    color: #464C5B;
    margin-bottom: 0.18rem;
    position: relative;
    margin-left: 0.1rem;
}

.desc-title::before {
    position: absolute;
    left: -0.1rem;
    top: 0.02rem;
    content: '';
    width: 0.04rem;
    height: 0.18rem;
    background-color: #3458DD;
}

.project-desc {
    margin-bottom: 0.28rem;

    .desc {
        font-size: 0.16rem;
        color: #333;
        font-weight: 600;
        margin-bottom: 0.28rem;
    }


    .jb_infor {
        padding-bottom: 0.28rem;
        border-bottom: 1px solid #EAEAEA;
        font-size: 0.14rem;

        div {
            width: 3rem;
            margin-bottom: 0.28rem;
            color: #333333;
        }

        span {
            width: 0.7rem;
            display: inline-block;
            color: #666666 !important;
        }

    }
}

.file-item {
    margin-bottom: 0.19rem;
    display: flex;

    svg {
        margin-right: 0.06rem;
    }

    .f_name {
        display: inline-block;
        // max-width: 2rem;
        color: #333333;
        font-size: 0.14rem;
        margin-right: 0.05rem;
    }

    .dw {
        color: #3458DD;
        font-size: 0.12rem;
    }

    .dw:hover {
        text-decoration: un;
    }
}

p.p-desc {
    margin-bottom: 0.28rem;

    /deep/img {
        width: 100% !important;
    }
}
</style>