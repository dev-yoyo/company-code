<template>
  <div class="home" :style="{ 'height': h + 'px' }">
    <!-- 头部 -->
    <head-Nav></head-Nav>
    <div class="home_i">
      <el-carousel :autoplay="false" :style="{ 'height': h + 'px' }">
        <el-carousel-item>
          <div class="home-item">
            <img src="../../assets/images/gzt/home1.jpg" alt="">
            <div class="intro_text">
              <h1 class="title"><em>一站式<span class="color_0075FF">高效</span>协作</em></h1>
              <p class="desc">通过平台，实现项目全流程管理，<br>快速创建任务、敏捷开发</p>
              <div class="btn_jump" @click="goProject">
                <span class="btn_text">进入项目大厅</span><span class="go">GO</span>
              </div>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="home-item">
            <img src="../../assets/images/gzt/home2.jpg" alt="">
            <div class="intro_text">
              <h1 class="title"><em>产品研发更敏捷<span class="color_FDAC41">更敏捷</span></em></h1>
              <p class="desc">随时随地查看项目进度，突破时间和空间的限制，<br>高效驱动项目进度</p>
              <div class="btn_jump bg_FDAC41" @click="goWork">
                <span class="btn_text">进入工作台</span><span class="go">GO</span>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>




  </div>
</template>

<script>
import { getData } from "@/api/user";
import store from "@/store";
export default {
  name: "home",
  data() {
    return {
      firstTips: true,
      homeData: [],
      role_id: '',
      h: '100'
    }
  },

  created() {
    this.homeIndex()
    this.h = window.innerHeight
    window.addEventListener("resize", this.setHeight)


  },

  mounted() {

  },

  methods: {
    setHeight() {
      this.h = window.innerHeight;
    },
    goWork() {
      this.role_id = store.state.userInfo.role_id;

      this.$router.push('/workbench/project')
    },

    homeIndex() {


      getData({
        url: "/home/index/",
      }).then((res) => {
        this.homeData = res.data

      }).catch(err => {
        console.log(err);
      })



    },
    goAgreement() {
    },
    goProject() {
      let role_id = store.state.userInfo.role_id
      let login = JSON.parse(localStorage.getItem('login'))
      if (role_id == 1) {
        if (!login) {
          this.$router.push('/login')
        }
      } else if (role_id != 1) {
        this.$router.push('/workbench/hall')
      }
    },


  },
  components: {
  },
};
</script>
<style scope src="@/assets/css/style.css">

</style>
<style lang='less' scoped>
.home {
  max-width: 19.2rem;
  height: 100%;
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;

  /deep/.el-carousel__container {
    width: 100%;
    height: 100%;
  }


  /deep/.el-carousel__indicators--horizontal {
    position: absolute;
    bottom: 1.14rem;

    .el-carousel__button {
      width: 0.1rem;
      height: 0.1rem;
      background: #fff;
      border-radius: 50%;
    }

  }

  /deep/.el-carousel__indicator--horizontal.is-active {
    .el-carousel__button {
      width: 0.46rem;
      border-radius: 0.08rem;
    }
  }

  .home-item {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .intro_text {
      position: absolute;
      top: 3.37rem;
      left: 3.1rem;

      .title {
        font-size: 0.52rem;
        color: #164174;
        font-weight: 600;
        margin-bottom: 0.34rem;
      }

      .color_0075FF {
        color: #0075FF;
      }

      .color_FDAC41 {
        color: #FDAC41;
      }

      .bg_FDAC41 {
        background: linear-gradient(90deg, #FFCF74 0%, #FD9B29 100%) !important;

        .go {
          color: #FF9300 !important;
        }
      }

      .desc {
        width: 3.6rem;
        line-height: 0.41rem;
        color: #164174;
        font-size: 0.24rem;
        margin-bottom: 0.94rem;
      }

      .btn_jump {
        width: 2.17rem;
        height: 0.52rem;
        line-height: 0.52rem;
        border-radius: 0.26rem;
        text-align: center;
        color: #FFFFFF;
        cursor: pointer;
        background: linear-gradient(90deg, #5488FD 0%, #3193FA 3%, #2578FA 100%);

        .btn_text {
          margin-right: 0.27rem;
          margin-left: 0.35rem;
          font-size: 0.18rem;
        }

        .go {
          width: 0.41rem;
          height: 0.41rem;
          background: #fff;
          box-shadow: 0rem 0rem 0rem rgba(6, 66, 126, 0.22);
          border-radius: 50%;
          text-align: center;
          line-height: 0.41rem;
          color: #4078F9;
          font-size: 0.22rem;
          display: inline-block;

        }

      }
    }
  }


}
</style>