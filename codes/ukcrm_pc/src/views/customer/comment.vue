<template>
  <div class="comment_detail">
    <el-drawer
      :visible="show"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      :append-to-body="true"
      :close-on-press-escape="false"
      size="667px"
      class="drawer_box"
      :wrapperClosable="true"
    >
      <div class="title">评论 <span style="color:#FCAC4E;">{{comment.length}}</span> 条</div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div class="comment">
        <div v-if="comment.length" class="cmtbox">
          <div class="c_item" v-for="(v,k) in comment" :key="k">
            <div class="c_tx">
              <div class="nickname" v-if="!v.avatar">{{v.abbreviation}}</div>
              <el-avatar v-if="v.avatar" :size="38" :src="v.avatar"></el-avatar>
            </div>
            <div class="i_ctn">
              <div class="i_tit">
                <div>
                  <span class="i_uname">{{v.abbreviation}}</span>
                  <span class="i_role" :style="{'background':v.role_id==4?'#E8F6FF':'#FFF2E8','color': v.role_id==4?'#4D6FFF':'#F08200'}">{{v.role_id==1?'管理员':v.role_id==2?'子管理员':v.role_id==3?'主管':'销售'}}</span>
                </div>
                <div>
                  <span style="color: #666">{{v.created_at}}</span>
                  <span @click="delComment(v.id)" v-if="v.diff_comment_status" class="i_del">删除</span>
                </div>
              </div>
              <div class="i_text">{{v.content}}</div>
            </div>
          </div>
        </div>
        <div v-if="!comment.length" class="slogan">
          <el-image
            style="width: 128px; height: 128px"
            :src="noData"
            fit="fill"
          ></el-image>
          <div class="txt">暂无记录</div>
        </div>
        <div class="addcmt">
          <div class="c_ctn">
            <div style="margin-right:10px;">
              <el-avatar :size="30" :src="avatar"></el-avatar>
            </div>
            <div style="flex:1">
              <el-input
                type="textarea"
                placeholder="请输入评论内容"
                v-model="content"
                rows="6"
                show-word-limit
                resize="none"
              >
              </el-input>
            </div>
          </div>
          <div class="c_btn">
            <el-button @click="content = ''">清空</el-button>
            <el-button @click="addComment" type="primary">评论</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import store from '@/store'
import { getData, postData } from "@/api/user";

export default {
  props: {},
  data() {
    return {
      show: true,
      content: '',
      comment: [],
      noData: store.state.no_data,
      avatar: store.state.userInfo.avatar,
    };
  },
  methods: {
    init({follow_record_id}) {
      this.follow_record_id = follow_record_id;
      getData({
        url: "/comment",
        data: {
          follow_record_id
        },
      }).then((res) => {
        this.comment = res.data.comment;
      });
    },
    addComment(){
      if(!this.content){
        this.$err('请输入评论内容！')
        return
      }
      postData({
        url: '/comment',
        data: {
          follow_record_id: this.follow_record_id,
          content: this.content
        }
      }).then(res => {
        if(res.code == 200){
          this.content = '';
          this.$success(res.data.msg)
          this.init({follow_record_id:this.follow_record_id})
        }
      })
    },
    delComment(id){
      this.$confirm('确认删除这条评论吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postData({
          url: '/comment/delete',
          data: {
            comment_id: id
          }
        }).then(res => {
          if(res.code == 200){
            this.init({follow_record_id:this.follow_record_id})
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
      });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less" scoped>
.comment_detail {
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
}

.comment{
  height: 85%;
  width: 100%;
  position: relative;
  .cmtbox{
    max-height: 520px;
    overflow: auto;
    .c_item{
      display: flex;
      padding: 30px ;
      justify-content: flex-start;
      border-bottom: 1px solid #EFEFEF;
      .c_tx{
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
      .i_ctn{
        width: 100%;
        padding: 0 12px;
        .i_tit{
          width: 100%;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .i_uname{
            font-size: 14px;
            font-weight: 600;
            color: #333333;
          }
          .i_role{
            margin-left: 10px;
            padding: 2px 11px;
            height: 24px;
            font-size: 12px;
            text-align: center;
            border-radius: 12px;
          }
          .i_del{
            margin-left: 10px;
            color: #4D6FFF;
          }
        }
        .i_text{
          max-width: 500px;
          margin: 10px 0 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.addcmt{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 40px;
  .c_ctn{
    display: flex;
  }
  .c_btn{
    display: flex;
    margin: 24px 0;
    justify-content: flex-end;
  }
}
</style>