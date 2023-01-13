<template>
    <div class="question">
        <h4>保证金常见问题</h4>
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
                title:'参与项目需要缴纳保证金吗？',
                desc:"不是所有项目都需要缴纳保证金，平台所有项目均为官方发布，在发布项目时，会根据项目的大小来设定该项目是否需要缴纳保证金。",
                id:1
            },
            {
                title:'保证金怎么缴纳？',
                desc:"工程师在竞价成功后，进入工作台找到相应的项目缴纳保证金。目前平台可通过两种方式缴纳保证金：支付宝支付和微信支付",
                id:2
            },
            {
                title:'保证金如何退回？',
                desc:"工程师可在个人中心-我的钱包申请保证金提现（只有完结或终止的项目可提取保证金），保证金提现一般在3个工作日即可到账（节假日顺延）",
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
