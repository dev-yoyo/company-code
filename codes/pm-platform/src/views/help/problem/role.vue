<template>
    <div class="question">
        <!-- <el-button class="buttonDiv" size="small">查询</el-button>
<el-button class="buttonDiv" size="small">重置</el-button> -->
        <h4>身份角色常见问题</h4>
        <span class="line"></span>
        <div class="question-desc">
            <div class="desc-item" v-for="(v,k) in quesData" :key="k">
                <div class="title"><i class="iconfont icon-a-duobianxing12" :ref="'icon'+k"  @click="drop(k)"></i><h4>{{v.title}}</h4></div>
                <div :ref="'content'+k"   class="desc-mb" >
                    <p  v-for="(a,b) in v.desc" :key="b">{{a}}</p>
                </div>
                
            </div>
        </div>


        <!-- <div class="contact">
            <h4>问题未结局？没有找到您想找的问题？可以通过以下方式联系我们：</h4>
            <div class="item">
                <div> 
                    <svg class="icon svg-icon" aria-hidden="true">
                      <use xlink:href="#icon-a-lujing2417"></use>
                    </svg>
                    <p><span class="desc">客服电话：</span><span class="fw6">17714209983</span><span class="intro">（推荐，沟通及时、高效）</span> </p>
               </div>
            <div  class="item">
                <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-a-lujing2418"></use>
                </svg>
                <p><span class="desc">客服微信：</span><span>ebainas</span></p>
            </div>
            </div>
        </div> -->
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
                title:'什么是身份与角色？',
                desc:[
                    '1、身份',
                    '在平台针对工程师的身份有两种：团队（企业）、个人，主要用于识别您在平台进行某些操作过程中的身份类型，从而为您提供与身份对应页面及功能。例如：在报名时可选择团队或个人进行报名、团队工作台、个人工作台等',
                    '2、角色',
                    '平台在发布项目时，会招募不同岗位的工程师，比如：硬件工程师、软件工程师、结构设计等，工程师选择竞价相应的岗位，那么竞价成后在该项目就会承担相应的角色工作。',
                  ],
                id:1
            },
            {
                title:'一个人是否可以同时有个人和团队两种身份？',
                
                desc:['当然可以。用户在个人中心团队（企业）认证后就默认视为同时拥有个人和团队两个身份，可以在项目大厅中以不同的身份去报名项目，但是同一个项目只允许以一种身份报名。','当工程师申请了团队（企业）认证并通过后，可以进入团队的工作台邀请成员加入到自己的团队，并通过工作台可分配并查看团队成员的目前的任务进度等信息。','当工程师以个人身份承接项目时，在工作台可查看自己所参与的所有项目。'],
                id:2
            },
            {
                title:'保证金如何退回？',
                
                desc:["工程师可在个人中心-我的钱包申请保证金提现（只有完结或终止的项目可提取保证金），保证金提现一般在3个工作日即可到账（节假日顺延）"],
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
            this.$refs['icon'+index][0].focus()
        }
  
    },
  };
  </script>
  <style scoped lang="less">

// i, i:focus:not(i:hover){ 
//     margin-right: 12px;
//     border-radius: 2px;
//     box-shadow: 0 2px 4px 0 #f4f4f4;
//     color: #2794f8;
//     background: white;
// }
// .icon-a-duobianxing12, .icon-a-duobianxing12:focus:not(.icon-a-duobianxing12:hover){ 
//     margin-right: 12px;
//     border: 1px solid #2794f8;
//     border-radius: 2px;
//     box-shadow: 0 2px 4px 0 #f4f4f4;
//     color: #2794f8;
//     background: white;
// }
</style>
