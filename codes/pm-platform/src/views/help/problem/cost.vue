<template>
    <div class="question">
        <h4>费用结算常见问题</h4>
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
                title:'项目结束后或开发过程中，费用如何结算',
                desc:"平台会在工程师开始开发工作之前在线下与其签订项目开发协议，约定项目费用的结算方式等其他事项。平台会根据签署的协议在线上进行结算，结算后工程师可在个人中心我的钱包中申请提现。",
                id:1
            },
            {
                title:'项目费用如何提现？收取手续费吗？',
                desc:"目前平台仅支持银行卡提现，工程师申请提现的金额是多少到账金额就是多少，平台不收取手续费哦~",
                id:2
            },
            {
                title:'提现要多长时间可以到账？',
                desc:"提现后一般是T+1个工作日到账（部分银行时间会延长）",
                id:3
            },
            {
                title:'若中途退出或难度略大完不成项目，费用如何结算？',
                desc:"若因工程师原因造成项目无法进行下去，平台会与工程师进行协商进行费用结算",
                id:4
            },
            {
                title:'提现为什么要实名认证？',
                desc:"一方面是保证用户资金安全，防止用户账号密码被盗时出现资金被盗的风险。另一方面，银行或支付宝在提现时候也必须与用户实名认证一致，否则具有洗钱嫌疑，属于违法行为。",
                id:5
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
