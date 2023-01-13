<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class='page'>
		<canvas canvas-id="myCanvas" id='canvas' :style="{width: ww + 'px', height: hh + 'px'}"></canvas>
		<image :src="base64" mode="" v-if="base64" class="img" :style="{width: ww + 'px', height: hh + 'px'}"></image>
	</view>

    <view cla="card">
        <view></view>

    </view>
    

    <view class="new_fixed_btm">
      <view class="item" @click="to_edit()">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-bj3"></i> -->
		  <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/bj%402x.png" mode="aspectFit"></image>
        </view>
        编辑
      </view>

      <view class="item" @click="to_down()">
        <view class="icon_box">
          <i class="icon iconfont icon-xz1"></i>
        </view>
        保存图片
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
export default {
  data() {
    return {
      info: {},
      user: {},

      base64:'',
        img_bg:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/20220322-151937.png',
        // img_bg:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/20220323-152615.png',
        img_company:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/20220323-100734.png',
        img_phone:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/20220323-100717.png',
        img_adr:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/20220323-100727.png',
        system_info:[],//系统信息
        hh:'',
        ww:'',
        ratio: 1,
    };
  },
  onShow () {
        this.system_info =uni.getSystemInfoSync();//屏幕宽高
        this.ratio = this.system_info.windowWidth /  375
        this.ww = this.system_info.windowWidth - 30 * this.ratio; //准确的宽高
        this.hh = 204 * this.ratio
       
       

        var that=this;
        const promise =  new Promise((resolve, reject) => {
                getData("/visit_card", {}).then((res) => {
                  const { code,data: { visit_card }} = res;
                  if (code === 200) {
                    uni.stopPullDownRefresh();
                    resolve(visit_card)
                  }
                });
        });
        
        //这里等promise执行，避免拿不到图片临时路径
        const promise_bg = new Promise((resolve, reject) => {
                uni.downloadFile({
                    url:that.img_bg,
                    success:(res)=>{ 	 
                        resolve(res)
                    }
                })
        });

        const promise_company = new Promise((resolve, reject) => {
                uni.downloadFile({
                    url:that.img_company,
                    success:(res)=>{ 	 
                        resolve(res)
                    }
                })
        });

        const promise_phone = new Promise((resolve, reject) => {
                uni.downloadFile({
                    url:that.img_phone,
                    success:(res)=>{ 	 
                        resolve(res)
                    }
                })
        });

        const promise_adr = new Promise((resolve, reject) => {
                uni.downloadFile({
                    url:that.img_adr,
                    success:(res)=>{ 	 
                        resolve(res)
                    }
                })
        });
        Promise.all([promise,promise_bg,promise_company,promise_phone,promise_adr]).then((values) => {
            this.make_canvas(values[0],values[1],values[2],values[3],values[4]);
        }); 
  },
  methods: {
    to_edit() {
      this.$Router.push({
        path: "/card_edit",
      });
    },
    to_down () {
      uni.saveImageToPhotosAlbum({  //保存图片
        filePath:this.base64,  
        success: (res) => {
          uni.showToast({
            title:'保存成功',
          })
        },
        fail(r) {
        }
      })
    },
    make_canvas(info, img_bg, img_company, img_phone, img_adr) {
      let name = info && info.name || '暂无'
      let position = info && info.position || '暂无职位'
      let company = info && info.company_name || '暂无公司'
      let phone = info && info.phone || '暂无'
      let adr = info && info.company_address || '暂无'
      // let adr ='一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十'
      let ratio = this.ratio

      //画布 
      var ctx = uni.createCanvasContext('myCanvas')

      ctx.drawImage(img_bg.tempFilePath, 0, 0, this.ww, this.hh); //填充进图片

      ctx.setFillStyle('#333')
      ctx.setFontSize(24 * ratio);
      ctx.setTextAlign('left')
      ctx.font = 'normal bold';
      ctx.fillText(name, 24 * ratio, 50 * ratio)

      ctx.setFillStyle('#333')
      ctx.setFontSize(14 * ratio);
      ctx.setTextAlign('left')
      if (name.length == 1) {
        ctx.fillText(position, 54 * ratio, 48 * ratio)
      } else if (name.length == 2) {
        ctx.fillText(position, 84 * ratio, 48 * ratio)
      } else if (name.length == 3) {
        ctx.fillText(position, 114 * ratio, 48 * ratio)
      } else {
        ctx.fillText(position, 124 * ratio, 48 * ratio)
      }

      ctx.drawImage(img_company.tempFilePath, 24 * ratio, 62 * ratio, 20 * ratio, 20 * ratio);
      ctx.setFillStyle('#333')
      ctx.setFontSize(16 * ratio);
      ctx.setTextAlign('left')
      ctx.font = 'normal bold';
      ctx.fillText(company, 49 * ratio, 77 * ratio)

      ctx.drawImage(img_phone.tempFilePath, 24 * ratio, 113 * ratio, 9 * ratio, 13 * ratio);
      ctx.setFillStyle('#666')
      ctx.setFontSize(14 * ratio);
      ctx.setTextAlign('left')
      ctx.fillText(phone, 42 * ratio, 125 * ratio)

      if (adr.length <= 20) {
        ctx.drawImage(img_adr.tempFilePath, 24 * ratio, 144 * ratio, 10 * ratio, 11.9 * ratio);
        ctx.setFillStyle('#666')
        ctx.setFontSize(14 * ratio);
        ctx.setTextAlign('left')
        ctx.fillText(adr, 42 * ratio, 155 * ratio)
      } else {
        let adr1 = adr.substring(0, 20)
        ctx.drawImage(img_adr.tempFilePath, 24 * ratio, 144 * ratio, 10 * ratio, 11.9 * ratio);
        ctx.setFillStyle('#666')
        ctx.setFontSize(14 * ratio);
        ctx.setTextAlign('left')
        ctx.fillText(adr1, 42 * ratio, 155 * ratio)

        let adr2 = adr.substring(21, adr.length - 1)
        ctx.setFillStyle('#666')
        ctx.setFontSize(14 * ratio);
        ctx.setTextAlign('left')
        ctx.fillText(adr2, 42 * ratio, 175 * ratio)
      }

      ctx.draw();  //输出到画布中
      uni.showLoading({ //增加loading等待效果
        title: '加载中',
        mask: true,
      })
      setTimeout(() => {  //不加延迟的话，base64有时候会赋予undefined
        uni.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: (res) => {
            this.base64 = res.tempFilePath
          }
        })
        uni.hideLoading();
      }, 1200)
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 27px 15px 130px;
}

.card {
    background: #fff;
}
    
#canvas {
    position: absolute;
    top: -99999899rpx;
    left: -99999899rpx;
    z-index: 9999;
}

.img {
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.08);
    border-radius: 6px;
}

</style>