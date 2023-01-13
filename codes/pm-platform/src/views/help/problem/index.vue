<template>
    <div class="prob">
     <router-view></router-view>
     <div class="contact">
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
      </div>
  </div>
</template>
  
  <script>
  
  export default {
    data() {
        return {};
    },
    methods: {},
    components: {  }
}
  </script>
  
  <style lang="less" scoped>
.prob{
  width: 100%;
  // position: relative;
  .contact{
  width: 9.2rem;
    position: absolute;
    bottom: 1rem;
    // margin-top: 0.8rem;
    border-top:1px solid #E3E3E3;
    padding: 0.24rem 0;
        h4{
        font-family: PingFang SC;
        color: #333;
        font-size: 0.16rem;
        margin-bottom: 0.12rem;
        }
        .item{
            display: inline-block;
            >div{
                display: inline-block;
            }
            p{
                display: inline-block;
            }
            svg{
                margin-right: 0.07rem;
                display: inline-block;
            }
            span{
                font-size: 0.15rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #333333;
            }
            .fw6{
                font-weight: 600;
            }
            .intro{
                font-size: 0.14rem;
                color: #FF9300;
                margin-right: 0.32rem;
                display: inline-block;
            }
        }
  }
}


  </style>