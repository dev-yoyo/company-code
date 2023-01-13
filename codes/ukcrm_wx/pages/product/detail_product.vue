<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view v-if="info.thumb.length > 0">
      <u-swiper :list="info.thumb" height="379" imgMode="aspectFit"></u-swiper>

      <view class="product_name">
        {{ info.name || "" }}
      </view>
    </view>

    <!-- tabs -->
    <view class="info_main_box">
      <view class="tab_list_box">
        <u-sticky>
          <u-tabs
            :list="tabList"
            :current="activeTab"
            :activeStyle="activeStyle"
            :inactiveStyle="inactiveStyle"
            lineColor="#4D6FFF"
            lineWidth="40"
            lineHeight="3"
			itemStyle="padding-left: 8.5%; padding-right: 8.5%; padding-bottom: 12px;padding-top: 12px"
            @change="tabChange"
          ></u-tabs>
        </u-sticky>
      </view>

      <view class="tab_main">
        <view v-if="activeTab == 0">
          <view class="html_content">
            <view v-if="info.product_no" class="no"
              >产品编号：{{ info.product_no }}</view
            >
            <view class="no">
              产品分类：
              <text v-if="info.s_classify">
                {{ info.s_classify.name }}
              </text>
              <text v-else-if="info.f_classify">
                {{ info.f_classify.name }}
              </text>
            </view>

            <u-parse :content="info.parameter"></u-parse>

            <view class="images_box">
              <view class="item" v-for="(v, i) in info.content_image" :key="i">
                <u--image
                  :showLoading="true"
                  :src="v"
                  @click="previewImg(i)"
                ></u--image>
              </view>
            </view>
          </view>
        </view>

        <view v-if="activeTab == 1">
          <view class="product_price_textarea">
            <view v-if="info.price && info.price.length > 0">
              <view class="tr">
                <view class="td">数量（个）</view>
                <view class="td">单价（元）</view>
              </view>

              <view class="tr" v-for="(a, b) in info.price" :key="b">
                <view class="td">{{ a.num }}+</view>
                <view class="td">{{ a.price }}</view>
              </view>
            </view>

            <view v-else>暂无报价</view>
          </view>
        </view>
		
		<!-- 产品手册 -->
		<view v-if="activeTab == 2">
          <view class="product_file_list">
            <view v-if="info.pruduct_file && info.pruduct_file.length > 0">
				<view class="product_file_item" v-for="(i,t) in info.pruduct_file" :key="t">
					<view class="product_file_title">
						<view class="product_file_icon">
							<i class="icon newIconfont icon-sc34"></i>
						</view>
						<view class="product_file_name">
							{{i.file_name}}
						</view>
					</view>
					
					<view class="product_file_edit">
						<view class="product_file_down" @click="fileDownLoad(t)">
							<i class="icon newIconfont icon-xz09"></i>
						</view>
						<!-- <view class="product_file_share" @click="fileShare(t)">
							<button class="share_btn" open-type="share"></button>
							<i class="icon newIconfont icon-zf98 "></i>
						</view> -->
					</view>
				</view>
            </view>

			<view class="slogan" v-else>
				<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
				<view class="txt"> 暂无数据 </view>
			</view>
          </view>
        </view>
		
      </view>
    </view>

    <!-- <view class="new_fixed_btm" v-if="role_id < 3">
      <view class="item" @click="edit">
        <view class="icon_box">
		  <image src="../../static/images/bj@2x.png" mode=""></image>
        </view>
        编辑
      </view>

      <view class="item" @click="delShow = true">
        <view class="icon_box">
		  <image src="../../static/images/sc@2x.png" mode=""></image>
        </view>
        删除
      </view>
    </view> -->

    <u-modal
      :show="delShow"
      @confirm="confirmDel"
      @cancel="delShow = false"
      showCancelButton
    >
      <view class="slot-content"> 确定删除这个产品吗？ </view>
    </u-modal>
  </view>
</template>

<script>
import { getData, postData, isSelfClient } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      role_id: null,
      product_id: "",
      info: {}, // 业务信息
      role_id: "",
      activeTab: 0,
      noData: store.state.no_data, // 没有信息
      downStatus: false,
      inactiveStyle: {
        // 菜单 非选中时的样式
        color: "#666666",
        "font-size": "15",
      },
      activeStyle: {
        // 菜单 选中时的样式
        color: "#4D6FFF",
        "font-weight": 600,
      },
      tabList: [
        {
          name: "基本信息",
        },
        {
          name: "指导报价",
        },
        {
          name: "商品文档",
        },
      ],

      delShow: false,
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);
    if (query.product_id) {
      this.product_id = query.product_id;
      this.init();
    }
  },
  methods: {
    init() {
      getData("/product/" + this.product_id).then((res) => {
        const {
          code,
          data: { product, role_id },
        } = res;
        if (code === 200) {
          this.info = product;
          this.role_id = role_id;
        }
      });
    },
	
	// 分享文件
	fileShare(i) {
		this.product_index = i;
		// uni.share({
		//     provider: 'weixin',
		//     scene: "WXSceneSession",
		//     type: 5,
		//     imageUrl: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/962fc340-4f2c-11eb-bdc1-8bd33eb6adaa.png',
		//     title: '欢迎体验uniapp',
		//     miniProgram: {
		//         id: 'gh_abcdefg',
		//         path: 'pages/index/index',
		//         type: 0,
		//         webUrl: 'http://uniapp.dcloud.io'
		//     },
		//     success: ret => {
		//         console.log(JSON.stringify(ret));
		//     }
		// });
	},
	
	// 下载文件
	fileDownLoad(t) {
		
		if(this.downStatus) {
			this.$u.toast('请勿重复点击下载');
			return
		}
		uni.showLoading({
			title: '下载中...'
		});
		// getData("/product/down_product_file", {
		// 	params: {
		// 		id: this.info.pruduct_file[t].id,
		// 	}
		// }).then((res) => {
		//   const {
		//     code,
		//     data: { msg, data },
		//   } = res;
		//   if (code === 200) {
		// 	  console.log(data);
		//   }else {
		//     this.$u.toast(msg);
		//   }
		// });
		let that = this;
		let url = encodeURI(this.info.pruduct_file[t].url); //注意中文文件名的网络地址需要encodeURI
		uni.downloadFile({
			url, //文件链接
			success: function(res) {
				//statusCode状态为200表示请求成功，tempFIlePath临时路径
				that.downStatus = true;
				if (res.statusCode == 200) {
					console.log("ccc", res.tempFilePath);
					//保存到本地
					uni.saveFile({
						// tempFilePath: that.fileNameEscape(res.tempFilePath),
						tempFilePath: res.tempFilePath,
						success: function(res) {
							console.log('成功下载文档');
							//res.savedFilePath文件的保存路径
							//保存成功并打开文件
							uni.openDocument({
								filePath: res.savedFilePath,
								showMenu: true,
								success: (res) => console.log('成功打开文档'),
								fail(err) {
									console.log(err,'文件打开失败');
								}
							})
							console.log("bbb", res);
							that.downStatus = false;
						},
						fail() {
							that.downStatus = false;
							uni.hideLoading();
							console.log('打开失败')
						}
					})
				}
				uni.hideLoading();
			},
			fail() {
				uni.hideLoading();
				that.downStatus = false;
				console.log('下载失败')
			}
		})
	},
	
	fileNameEscape(filename) {
		if (uni.getSystemInfoSync().platform == "ios") {
			filename = escape(filename);
		}
		return filename;
	},

    tabChange({ index }) {
      this.activeTab = index;
      this.page = 1;
      this.next_page = true;
    },

    previewImg(index) {
      uni.previewImage({
        urls: this.info.content_image,
        current: index,
      });
    },
    nav(name) {
      this.$Router.push({
        name,
      });
    },

    confirmDel() {
      postData("/product/down", {
        product_id: this.product_id,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.delShow = false;
          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 1 });
            },
          });
        }else {
          this.$u.toast(msg);
        }
      });
    },
    onPullDownRefresh() {
      this.init();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
  onShareAppMessage() {
 //  	return {
	//   title: '产品分享',
	//   path: '/pages/product/detail_product/' + this.product_id,
	//   imageUrl: this.info.thumb[0]
	// }
  }
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 130px;

  .product_name {
    padding: 17px 20px 29px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #333333;
    background-color: #fff;
  }
}

.info_main_box {
  margin-top: 10px;
  background-color: #fff;

  .tab_main {
    padding: 20px;

    .html_content {
      word-break: break-all;
      .no {
        margin-bottom: 10px;
      }

      /deep/ img {
        width: 100% !important;
      }

      .images_box {
        margin-top: 10px;
        background-color: #fff;

        .item {
          margin-bottom: 10px;
        }
      }
    }

    .product_price_textarea {
      .tr {
        display: flex;
        border: 1px solid #e5e5e5;
        border-left: none;
        margin-top: -1px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333333;
        .td {
          width: 48%;
          height: 35px;
          line-height: 35px;
          text-align: center;
          border-left: 1px solid #e5e5e5;
        }
      }
    }
	
	.product_file_list {
		// padding: 20px;
		
		.product_file_item {
			padding: 20px 0;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			
			.product_file_title {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				
				.product_file_icon {
					width: 16px;
					height: 18px;
					margin-right: 7px;
					
					.icon-sc34 {
						color: rgb(255, 108, 29);
					}
				}
				
				.product_file_name {
					font-size: 14px;
					font-weight: 400;
					line-height: 20px;
					color: #333333;
					opacity: 1;
				}
				
			}
			
			.product_file_edit {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				
				.product_file_down {
					width: 30px;
					height: 30px;
					background: rgba(248,248,248,1);
					opacity: 1;
					border-radius: 4px;
					margin-right: 22px;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.icon-xz09{
						color: rgb(152, 152, 152);
					}
				}
				
				.product_file_share {
					width: 30px;
					height: 30px;
					background: rgba(248,248,248,1);
					opacity: 1;
					border-radius: 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					
					.share_btn {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						opacity: 0;
					}
					
					.icon-zf98{
						color: rgb(152, 152, 152);
					}
				}
			}
		}
	}
	
	.slogan {
		padding-top: 0;
	}
  }
}
</style>