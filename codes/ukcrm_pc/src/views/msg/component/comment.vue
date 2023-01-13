<template>
  <div class="agency" id="dom">
    <div class="title">跟进评论</div>
    <div v-if="comment.length > 0" v-infinite-scroll="load">
      <div class="item" v-for="(v, i) in comment" :key="i">
        <div class="top_time d-flex" v-if="v.date_time">
          <div class="time">{{ v.date_time }}</div>
        </div>

        <div class="msg_item d-flex">
          <div class="img_box">
            <div class="nickname" v-if="!v.comment.avatar">{{v.comment.abbreviation}}</div>
            <el-avatar v-if="v.comment.avatar" :size="38" :src="v.comment.avatar"></el-avatar>
          </div>

          <div class="r_main">
						<div class="r_user">
							<span class="r_user_name">{{v.comment.abbreviation}}</span>
							<span class="r_u_role" :style="{'background':v.comment.role_id==4?'#E8F6FF':'#FFF2E8','color': v.comment.role_id==4?'#4D6FFF':'#F08200'}">{{v.comment.role_id==1?'管理员':v.comment.role_id==2?'子管理员':v.comment.role_id==3?'主管':'销售'}}</span>
						</div>
						<div class="r_ctn">
							<div class="r_text">{{v.content}}</div>
							<div class="r_flw" @click="getComment(v.comment.follow_record_id)">
								<div class="c_tit">跟进记录</div>
								<div class="v_ctn">{{v.comment.follow_record.visit_content}}</div>
							</div>
						</div>
          </div>
        </div>
      </div>
    </div>

    <div class="page_empty" v-else>
      <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"/>
    </div>

    <!-- 跟进评论 -->
    <comment-list
      v-if="showComment"
      ref="refComment"
      @cancel="hideComment"
    ></comment-list>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import commentList from '@/views/customer/comment.vue'
export default {
  data() {
    return {
      showComment: false,
      comment: [],
      page: 1,
      last_page: 1,
      first: true,
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202210/31/1Sc8uYLOL8VIWC9qfyMlBr4ze7YJv0iOuxuUHgA7.png",
    };
  },
  created() {
    this.page = 1
    this.init();
  },
  updated() {
    if (this.first) {
      this.$nextTick(function () {
        let dom = document.getElementById('dom')
        dom.scrollTop = dom.scrollHeight
      });
      this.first = false;
    }
  },

  methods: {
    init() {
      // 产品信息
      getData({url:"/message/comment"}).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {

          let arr = list.data.reverse();
          if (this.page != 1) {
            this.comment = arr.concat(this.comment);
          } else {
            this.comment = arr;
          }
          this.last_page = list ? list.last_page : 1;
        }
      });
      postData({
        url:"/message",
        data:{
          type: 3,
        }
      }).then((res) => {});
    },
    getComment(id) {
      this.showComment = true;
      this.$nextTick(() => {
        this.$refs.refComment.init({follow_record_id:id})
      });
    },
    hideComment() {
      this.showComment = false;
    },
    load() {
      if (this.page < this.last_page) {
        this.page += 1;
        this.init();
      }
    }
  },
  components: { commentList }
};
</script>

<style lang="less" scoped>
.agency {
  height: 100vh;
  width: 436px;
  padding: 48px 48px 48px 24px;
  overflow-y: auto;
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
    margin-bottom: 20px;
  }

  .item {
    margin-bottom: 25px;

    .top_time {
      margin-bottom: 20px;
      justify-content: center;

      .time {
        padding: 0 17px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background-color: #fff;
        border-radius: 20px;

        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
    }

    .msg_item {
      align-items: flex-start;
      width: 100%;

      .img_box {
        flex-shrink: 0;
        width: 44px;
        
        .nickname{
          color: #fff;
          width: 38px;
          height: 38px;
          font-size: 12px;
          line-height: 38px;
          text-align: center;
          background: #4D6FFF;
          border-radius: 50%;
        }
      }

      .r_main {
				margin-left: 11px;
				width: 100%;
				box-sizing: border-box;
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
				color: #333333;
				
				.r_user{
					height: 35px;
					display: flex;
					align-items: center;
					.r_user_name{
						font-size: 14px;
						font-weight: 600;
						color: #333333;
					}
					.r_u_role{
						display: inline-block;
						height: 24px;
						font-size: 12px;
            padding: 3px 11px;
						margin-left: 10px;
						text-align: center;
						background: #FFF2E8;
						border-radius: 12px;
					}
				}
				.r_ctn{
					box-sizing: border-box;
					overflow: hidden;
					border-radius: 10px;
          box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
					.r_text{
						width: 100%;
						padding: 16px 17px;
						background: #fff;
						font-size: 15px;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;

					}
					.r_flw{
						box-sizing: border-box;
						padding: 17px 18px;
						background: linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 100%);
						.c_tit{
							font-size: 15px;
							font-weight: 600;
						}
						.v_ctn{
							margin: 4px 0;
							font-size: 13px;
							font-weight: 400;
							color: #999999;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							
						}
					}
				}
      }
    }
  }
  .page_empty {
    background: #fff !important;
    border: none !important;
  }
}
</style>