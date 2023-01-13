<template>
    <div class="question">
        <h4>账号常见问题</h4>
        <span class="line"></span>
        <div class="question-desc">
            <div class="desc-item" v-for="(v,k) in quesData" :key="k">
                <div class="title"><i class="iconfont icon-a-duobianxing12" :ref="'icon'+k"  @click="drop(k)"></i><h4>{{v.title}}</h4></div>
                <p :ref="'content'+k">{{v.desc}}</p>
            </div>
        </div>
    </div>
  </template>
  <script>
  import '@/assets/css/help.css'
  export default {
    name: "infor",
    data() {
      return{
        quesData:[
            {
                title:'账号无法登录，提示账号已被禁用？',
                desc:"账号已被禁用通常是指您的账号因违反平台相关规定的情况下，平台管理人员对您的账号进行了登录或使用限制。遇到该情况时，您可联系平台在线客服或拨打平台客服电话寻求帮助，我们将依据的账号相关信息给予适当处理。",
                id:1
            },
            {
                title:'如何更改个人/团队（企业）认证信息？',
                desc:"登录平台并根据您所需认证的身份，进入个人中心，点击个人中心-实名认证或企业认证菜单即可进入认证页面，依据您的个人或企业身份提交身份证件图片或企业营业执照图片开始认证。认证信息提交后，平台工作人员进行审核，审核结果将以短信、平台通知的方式发送与您。",
                id:2
            },
            {
                title:'如何更改个人/团队（企业）认证信息？',
                desc:"为保证平台用户的账户信息、资金安全，平台暂不支持已认证信息变更。若您有需求或误填可联系平台工作人员，工作人员进行核实后由平台对您的信息进行更改。",
                id:3
            },
         
        ],
        dis:'block',
        rotate:'0deg'
      }
    },
    created(){
    },
    methods: {
        drop(index){
            if(this.dis=='block'){
                this.dis='none'
                this.rotate='0deg'
            }else{
                this.dis='block'
                this.rotate='180deg'
            }
            this.$refs['content'+index][0].style.display = this.dis
            this.$refs['icon'+index][0].style.rotate = this.rotate
        }
  
    },
  };
  </script>
  <style scoped lang="less">

</style>
