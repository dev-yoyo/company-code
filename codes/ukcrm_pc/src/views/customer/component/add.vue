<template>
    <div class="add_detail">
        <el-drawer
            :visible.sync="drawer"
            direction="rtl"
            :before-close="cancel"
            :show-close="false"
            :withHeader="false"
            size="667px"
            class="drawer_box"
            :close-on-press-escape="false"
            :wrapperClosable="true"
        >
            <div class="title">{{ isEdit ? "编辑客户" : "创建客户" }}</div>
            <div
                class="close_icon d-center"
                @click="cancel"
            >
                <i class="iconfont icon-ykbx"></i>
            </div>
            <div class="kuang">
                <el-form
                    :model="form"
                    ref="customerForm"
                    :rules="rules"
                    label-width="80px"
                    class="demo-form"
                >
                    <div class="form_tit">基础信息</div>

                    <div class="d-between">
                        <el-form-item
                            label="客户性质"
                            required
                            prop="customer_type"
                        >
                            <el-select
                                v-model="form.customer_type"
                                placeholder="请选择"
                                :disabled="isEdit"
                            >
                                <el-option
                                    v-for="(v, i) in typeList"
                                    :key="i"
                                    :label="v"
                                    :value="i"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            label="客户状态"
                            required
                            prop="customer_status"
                        >
                            <el-select
                                v-model="form.customer_status"
                                placeholder="请选择"
                                :disabled="isEdit"
                            >
                                <el-option
                                    v-for="(v, i) in statusList"
                                    :key="i"
                                    :label="v"
                                    :value="i"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="d-between">
                        <el-form-item
                            label="客户名称"
                            required
                            prop="name"
                        >
                            <el-input
                                v-model="form.name"
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>

                        <el-form-item
                            label="企业名称"
                            required
                            prop="company_name"
                        >
                            <el-input v-model="form.company_name"></el-input>
                        </el-form-item>
                    </div>

                    <div class="d-between">
                        <el-form-item label="岗位职务">
                            <el-input v-model="form.position"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="企业角色"
                            required
                            prop="company_role"
                        >
                            <el-select
                                v-model="form.company_role"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(v, i) in roleList"
                                    :key="i"
                                    :label="v"
                                    :value="v"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="d-between">
                        <el-form-item
                            label="所在地区"
                            required
                            prop="area"
                        >
                            <el-cascader
                                v-model="form.area"
                                :options="areaList"
                                @change="chooseArea"
                            ></el-cascader>
                        </el-form-item>
                    </div>

                    <el-form-item
                        label="详细地址"
                        prop="address"
                    >
                        <el-input
                            type="textarea"
                            v-model="form.address"
                            maxlength="30"
                        ></el-input>
                    </el-form-item>
                    <div class="form_tit">
                        联系方式<span class="xuantian">（选填其一）</span>
                    </div>
                    <div class="d-between">
                        <el-form-item label="联系电话">
                            <el-input
                                v-model="form.phone"
                                placeholder="请输入"
                                maxlength="25"
                                @bulr="checkbulrFn()"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="微信账号">
                            <el-input
                                v-model="form.wechat"
                                placeholder="请输入"
                                maxlength="25"
                            ></el-input>
                        </el-form-item>
                    </div>

                    <div class="form_tit">扩展信息</div>
                    <div class="d-between">
                        <el-form-item
                            label="客户标签"
                            prop="tag"
                        >
                            <el-select
                                v-model="form.tag"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(v, i) in tagList"
                                    :key="i"
                                    :label="v"
                                    :value="i"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            label="客户来源"
                            prop="from"
                        >
                            <el-select
                                v-model="form.from"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(v, i) in fromList"
                                    :key="i"
                                    :label="v"
                                    :value="i"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="d-between">
                        <el-form-item
                            label="所属行业"
                            prop="industry"
                        >
                            <el-select
                                v-model="form.industry"
                                placeholder="请选择"
                                @click="industry_list"
                            >
                                <el-option
                                    v-for="(v, i) in industryList"
                                    :key="i"
                                    :label="v"
                                    :value="v"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            label="客户级别"
                            prop="level"
                        >
                            <el-select
                                v-model="form.level"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(v, i) in levelList"
                                    :key="i"
                                    :label="v"
                                    :value="v"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="d-between">
                        <el-form-item label="客户名片" prop="industry">
                            <div class="img_box" v-if="form.business_card">
                                <el-image class="iimg" :src="form.business_card" :preview-src-list="[form.business_card]" fit="cover"></el-image>
                                <span @click="delImg" class="delImg"><i class="iconfont icon-ykbx"></i></span>
                            </div>
                            <el-upload
                                v-else
                                action=""
                                :file-list="fileList"
                                :show-file-list="false"
                                :before-upload="handleBeforeUpload"
                                :http-request="img_upload"
                                accept=".jpg,.png"
                            >
                                <el-button class="uploadBtn"size="small" type="primary">
                                    <img class="cloud" src="../../../assets/images/cloud.png" alt="">
                                    选择图片
                                </el-button>
                                <span class="el-upload__tip">文件仅支持jpg、png格式</span>
                            </el-upload>
                        </el-form-item>
                    </div>

                    <div class="form_tit">其他信息</div>
                    <div class="d-between">
                        <el-form-item
                            label="创建人"
                            prop="tag"
                        >
                            <el-input
                                v-model="user.name"
                                placeholder="请输入"
                                disabled
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="创建时间">
                            <el-input
                                v-model="time"
                                placeholder="请输入"
                                disabled
                            ></el-input>
                        </el-form-item>
                    </div>

                    <el-form-item
                        label="备注"
                        class="remarks_item"
                    >
                        <el-input
                            type="textarea"
                            v-model="form.remarks"
                            placeholder="请输入内容(内容限制在150个字以内)"
                            maxlength="150"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <!-- <el-button type="primary" @click="submitForm('form')">
            立即创建
          </el-button>
          <el-button @click="resetForm('form')">重置</el-button> -->

                        <div class="form_btns">
                            <el-button
                                class="com_btn cancel_btn"
                                @click="cancel"
                            >
                                取消
                            </el-button>

                            <el-button
                                class="com_btn"
                                @click="submitForm"
                                :loading="createLoading"
                                :disabled="createLoading"
                            >
                                保存
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";
import { getNowDate } from "@/libs/util";

export default {
    data() {
        let isCellPhone = (val) => {
            if (!/^1[3456789]\d{9}$/.test(val)) {
                return false;
            } else {
                return true;
            }
        };

        let isChenese = (val) => {
            // console.log(val);
            var sucess = (typeof val === "string" && val != "") || false;
            for (var i in val) {
                var j = val.substr(i, 1);
                if (/^[\u4e00-\u9fa5]/.test(j)) {
                    sucess = false;
                    break;
                }
            }
            return sucess;
        };

        let checkphone = () => {
            // if (value === "") {
            //   callback(new Error("联系电话与微信账号必须选填其一"));
            // } else if (!isChenese(value)) {
            //   callback(new Error("手机号码格式不正确"));
            // } else {
            //   callback();
            // }
        };
        let checkwechat = () => {
            // if (value === "") {
            //   callback(new Error("微信账号与联系电话必须选填其一"));
            // } else {
            //   callback();
            // }
        };

        let checkCustomerName = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入客户名称"));
            } else if (value.length > 4) {
                callback(new Error("限4个字符"));
            } else {
                callback();
            }
        };

        return {
            fileList: [],
            drawer: true,
            isEdit: false,
            createLoading: false,
            user: {},
            userName: "",
            customer_id: "",
            form: {
                customer_type: "",
                customer_status: "",
                name: "",
                phone: "",
                wechat: "",
                company_name: "",
                area: "", // 所在地区
                address: "", // 详细地址
                position: "", // 职务
                level: "",
                company_role: "",
                business_card: "", // 名片

                tag: "",
                from: "",
                industry: "",
                areaIds: [], // 地区ids
                remarks: "",
            },
            rules: {
                customer_type: [
                    {
                        required: true,
                        message: "请选择客户性质",
                        trigger: ["change", "blur"],
                    },
                ],
                customer_status: [
                    {
                        required: true,
                        message: "请选择客户状态",
                        trigger: ["change", "blur"],
                    },
                ],
                name: [
                    // {
                    //   required: true,
                    //   message: "请输入客户名称",
                    //   trigger: ["change", "blur"],
                    // },
                    { validator: checkCustomerName, trigger: ["blur", "change"] },
                ],
                phone: [{ validator: checkphone, trigger: ["blur", "change"] }],
                wechat: [{ validator: checkwechat, trigger: ["blur", "change"] }],
                company_name: [
                    {
                        required: true,
                        message: "请输入企业名称",
                        trigger: ["change", "blur"],
                    },
                ],
                company_role: [
                    {
                        required: true,
                        message: "请选择企业角色",
                        trigger: ["change", "blur"],
                    },
                ],
                area: [
                    {
                        required: true,
                        message: "请选择所在地区",
                        trigger: ["change", "blur"],
                    },
                ],
            },

            typeList: [], // 性质
            roleList: [], // 角色
            levelList: ["A类(重要客户)", "B类(普通客户)", "C类(非优先客户)"], // 级别
            statusList: [],
            tagList: [],
            fromList: [],
            industryList: [],
            areaList: [], // 全国省市区
            time: "", // 今天时间
        };
    },
    created() {
        // this.init();
        this.industry_list();
        this.getArea();

        this.user = store.state.userInfo;
        const { y, m, d } = getNowDate();
        this.time = `${y}-${m}-${d}`;
    },
    methods: {
        init(customer_id) {
            // console.log("customer_id >>", customer_id);
            this.customer_id = customer_id;

            this.$nextTick(() => {
                this.resetForm();
                this.getTag();

                // 编辑
                if (customer_id) {
                    this.isEdit = true;

                    getData({
                        url: "/customer/customer_detail",
                        data: {
                            customer_id: this.customer_id,
                        },
                    }).then((res) => {
                        const { code, data } = res;
                        if (code === 200) {
                            let customer = data.customer;

                            this.form.name = customer.name;
                            this.form.phone = customer.phone;
                            this.form.wechat = customer.wechat;
                            this.form.position = customer.position;
                            this.form.company_name = customer.company;
                            this.form.address = customer.address;
                            this.form.company_role = customer.company_role;
                            this.form.remarks = customer.remarks;
                            this.form.business_card = customer.business_card;

                            this.form.customer_type = customer.customer_type;
                            this.form.customer_status = customer.customer_status;

                            this.form.tag = customer.tag ? customer.tag - 1 : "";
                            this.form.from = customer.from ? customer.from - 1 : "";

                            this.form.industry = customer.industry;
                            this.form.level = customer.level;
                            this.time = customer.created_at;

                            this.form.area = [
                                customer.area.id,
                                customer.area_city.id,
                                customer.area_area.id,
                            ];
                            this.form.areaIds = [
                                customer.area.id,
                                customer.area_city.id,
                                customer.area_area.id,
                            ];
                            this.user.name = data.user_customer.user.name;
                            // console.log("form >>>>>>", this.form.areaIds);
                        }
                    });
                }
            });
        },
        getTag() {
            // 标签
            getData({ url: "/customer/tag" }).then((res) => {
                const {
                    code,
                    data: {
                        company_role,
                        customer_tag,
                        customer_from,
                        customer_type,
                        customer_status,
                        customer_level
                    },
                } = res;
                if (code === 200) {
                    this.typeList = customer_type;
                    this.roleList = company_role;
                    this.statusList = customer_status;
                    this.tagList = customer_tag;
                    this.fromList = customer_from;
                    this.levelList = customer_level;
                }
            });
        },
        // 所属行业
        industry_list() {
            getData({
                url: "/company/industry",
            }).then((res) => {
                const {
                    code,
                    data: { list },
                } = res;
                if (code === 200) {
                    this.industryList = list;
                }
            });
        },
        // 全国省市区
        getArea() {
            getData({ url: "/area" }).then((res) => {
                const {
                    code,
                    data: { list },
                } = res;
                if (code === 200) {
                    let arr = list;
                    arr.map((e) => {
                        e.label = e.name;
                        e.value = e.id;

                        if (e.children) {
                            e.children.map((v) => {
                                v.label = v.name;
                                v.value = v.id;

                                if (v.children) {
                                    v.children.map((item) => {
                                        item.label = item.name;
                                        item.value = item.id;
                                    });
                                }
                            });
                        }
                    });

                    this.areaList = arr;
                }
            });
        },

        chooseArea(v) {
            this.form.areaIds = v;
            // console.log("chooseArea >>>", this.form.areaIds);
        },

        submitForm() {
            this.$refs["customerForm"].validate((valid) => {
                if (valid) {
                    this.createLoading = true;

                    let info = this.form;
                    let url = this.isEdit ? "/customer/update" : "/customer/store";

                    postData({
                        url,
                        data: {
                            customer_id: this.customer_id,
                            customer_type: info.customer_type,
                            customer_status: info.customer_status,
                            name: info.name,
                            phone: info.phone,
                            wechat: info.wechat,
                            company: info.company_name,
                            address: info.address,
                            business_card: info.business_card || '',

                            tag: info.tag === "" ? "" : info.tag + 1,
                            from: info.from === "" ? "" : info.from + 1,
                            industry: info.industry,
                            position: info.position,
                            company_role: info.company_role,
                            level: info.level,

                            province: info.areaIds[0],
                            city: info.areaIds[1],
                            area: info.areaIds[2],
                            remarks: info.remarks,
                        },
                    })
                        .then((res) => {
                            // console.log(this.form.phone);
                            // console.log(this.form.wechat);
                            this.form.phone == "" && this.form.wechat == ""
                                ? this.$err("手机号与微信号必须选填其一")
                                : this.$success("保存成功");
                            const {
                                code,
                                data: { msg, customer_type, customer_status },
                            } = res;
                            if (code === 200) {
                                this.$emit("cancel", true);
                                this.$success(msg);
                            } else if (code === 422) {
                                if (customer_type) {
                                    this.$err(customer_type[0]);
                                }
                                if (customer_status) {
                                    this.$err(customer_status[0]);
                                } else if (msg) {
                                    this.$err(msg);
                                }

                                this.createLoading = false;
                            }
                        })
                        .catch(() => {
                            this.createLoading = false;
                        });
                } else {
                    // console.log("error submit!!");
                    this.createLoading = false;
                    return false;
                }
            });
        },

        cancel() {
            this.$emit("cancel");
            this.resetForm();
        },
        resetForm() {
            this.$refs["customerForm"].resetFields();
        },
        handleBeforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isLt2M) {
                this.$err("上传图片大小不能超过 1MB!");
                return false;
            }
        },
        img_upload(e) {
            this.$success('图片上传中...');
            const formData = new FormData();
            formData.append("file", e.file);
            postData({url: "/single",data: formData}).then((res) => {
                const {code,data: { path_url, msg }} = res;
                if (code === 200) {
                    this.$success('图片上传成功')
                    this.form.business_card = path_url;
                } else if (code === 422) {
                    this.$err(msg);
                }
            });
        },
        delImg(){
            this.$confirm("确认删除这张名片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
            }).then(() => {
                this.$nextTick(()=>{
                    this.form.business_card = '';
                })
                this.$success('删除成功')
            })
        }
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
  .el-cascader {
    line-height: 12px !important;
  }
  .kuang {
    margin-left: 25px;
  }
  /deep/.el-form-item__error {
    top: 86% !important;
  }
  /deep/.el-form-item__content {
    line-height: 25px !important;
  }
}
.xuantian {
  color: #b3b3b3;
}
.remarks_item {
  /deep/.el-form-item__label {
    text-align: center !important;
  }
}
.cloud{
    width: 13px;
    height: 9px;
}
.el-upload__tip{
    padding-left: 8px;
    color: #98ACFF;
}
.uploadBtn{
    border: none;
    color:#4D6FFF;
    display:inline-block;
    background: #E5EAFE;
}

.img_box{
    width: 34px;
    height: 34px;
    position: relative;
    .iimg{
        width: 100%;
        height: 100%;
    }
}
.img_box:hover .delImg{
    opacity: 1;
}
.delImg{
    opacity: 0;
    transform: scale(0.8);
    cursor: pointer;
    position: absolute;
    top:-12px;right: -10px;
    transition: all 0.3s ease;
}
</style>
