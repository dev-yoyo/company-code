<template>
	<view class="home">
		<view class="start_animation" v-if="show_start">
			<u-swiper :list="steupList" height="100%" :autoplay="false" @change="aniChange" indicator indicatorMode="line"></u-swiper>

			<view class="end_txt" v-if="showAniBtn"><view class="btn" @click="startMini">立即体验</view></view>
		</view>

		<view v-else>
			<u-sticky offset-top="0">
				<view :class="scrollShow ? 'title_bg_white' : 'title_bg'">
					<u-navbar bgColor="transparent" title="友客帮" leftIcon=" " fixed />
					<u-navbar bgColor="transparent" leftIcon=" " placeholder />
				</view>
			</u-sticky>

			<view class="container_main">
				<view class="top_bgc"></view>
				<!-- 总额度 -->
				<view class="money_target">
					<!-- 企业年度目标  -->
					<view class="company_target" v-if="user.role_id < 3">
						<view class="finished_money d-center" @click="nav('achievement_target')">
							<view class="proportion">{{ percent || '0' }}%</view>
							<view class="txt">完成额</view>
							<view class="txt money_txt">¥{{ completion_money || '0' }}</view>

							<battery v-if="annual" :percent="percent > 100 ? 0 : 100 - percent"></battery>

							<battery v-else :percent="100"></battery>
						</view>
						<view class="d-center">
							<view class="target_money money">
								企业年度目标：
								<text class="money icon">¥</text>
								<text class="money">{{ money || '0' }}</text>
							</view>
						</view>
					</view>

					<!-- 部门 + 我的目标  -->
					<view class="branch_target" v-else-if="user.role_id > 2">
						<view class="item d-between">
							<view class="l_money">
								<view class="tit">部门年度目标</view>
								<view class="txt">
									完成额：
									<text class="money icon">¥</text>
									<text class="money">{{ completion_money || '0' }}</text>
								</view>
								<view class="txt">
									目标额：
									<text class="money icon">¥</text>
									<text class="money">{{ money || '0' }}</text>
								</view>
							</view>

							<view class="proportion_money d-center branch">
								<view class="txt branch_txt">{{ percent || '0' }}%</view>
								<battery :percent="percent > 100 ? 0 : 100 - percent"></battery>
							</view>
						</view>

						<view class="line"></view>

						<!-- 我的目标 -->
						<view class="item d-between">
							<view class="l_money">
								<view class="tit">我的业绩目标</view>
								<view class="txt">
									完成额：
									<text class="money icon">¥</text>
									<text class="money">{{ my_completion_money || '0' }}</text>
								</view>
								<view class="txt">
									目标额：
									<text class="money icon">¥</text>
									<text class="money">{{ my_money || '0' }}</text>
								</view>
							</view>

							<view class="proportion_money d-center">
								<div class="txt">{{ my_percent || '0' }}%</div>
								<battery :percent="my_percent > 100 ? 0 : 100 - my_percent"></battery>
							</view>
						</view>
						<!-- 我的目标 -->
					</view>
				</view>

				<view class="menus_box">
					<view class="items d-flex">
						<view class="item" v-for="(v, i) in menus" :key="i" @click="menuNav(v)">
							<view class="icon_box"><image :src="ossImgUrl + v.img" mode="aspectFit"></image></view>
							<view class="txt">{{ v.name || '' }}</view>
						</view>
					</view>
				</view>

				<!-- 仪表盘 -->
				<view class="dash_board">
					<view class="com_top_tit d-center">
						<view class="tit">仪表盘</view>
						<view class="r_select d-center">
							<view class="item d-center" @click="dashDateShow">
								{{ dashSelectInfo.activeDate || '本年度' }}
								<i class="icon iconfont icon-xl2"></i>
							</view>

							<view class="item d-center" v-if="role_id > 0 && role_id < 4" @click="dashMemberShow">
								{{ showActiveMember || '全部' }}
								<i class="icon iconfont icon-xl2"></i>
							</view>
						</view>
					</view>

					<view class="dash_mian">
						<view class="tit">销售简报</view>

						<view class="data_content d-flex">
							<!-- 新增合同 -->
							<view class="item l_item t_item">
								<view class="top_info d-flex">
									<view class="item_tit">新增合同</view>

									<view class="t_r_info">
										<view class="txt" v-if="dashSelectInfo.showTxt">较{{ dashInfo.last_time_word || '' }}</view>
										<view class="txt" v-else></view>
										<view
											class="count"
											:class="
												dashInfo.contract_count_percent
													? dashInfo.contract_count_percent && dashInfo.percent1 == 1
														? 'add'
														: dashInfo.percent1 == 2
														? 'sub'
														: ''
													: ''
											"
										>
											<view v-if="dashSelectInfo.showTxt">{{ dashInfo.contract_count_percent ? dashInfo.contract_count_percent + '%' : '-' }}</view>
										</view>
									</view>
								</view>

								<view class="btm_info">
									<text :class="dashInfo.new_contract_count ? 'num' : ''">{{ dashInfo.new_contract_count || '-' }}</text>
									单
								</view>
							</view>
							<!-- 新增合同 -->

							<!-- 合同金额 -->
							<view class="item t_item">
								<view class="top_info d-flex">
									<view class="item_tit">合同金额</view>

									<view class="t_r_info">
										<view class="txt" v-if="dashSelectInfo.showTxt">较{{ dashInfo.last_time_word || '' }}</view>
										<view class="txt" v-else></view>
										<view
											class="count"
											:class="
												dashInfo.contract_money_percent
													? dashInfo.contract_money_percent && dashInfo.percent2 == 1
														? 'add'
														: dashInfo.percent2 == 2
														? 'sub'
														: ''
													: ''
											"
										>
											<view v-if="dashSelectInfo.showTxt">{{ dashInfo.contract_money_percent ? dashInfo.contract_money_percent + '%' : '-' }}</view>
										</view>
									</view>
								</view>

								<view class="btm_info">
									<text :class="dashInfo.index_current_contract_money ? 'price' : ''">
										{{ dashInfo.index_current_contract_money ? dashInfo.index_current_contract_money : '-' }}
									</text>
									元
								</view>
							</view>
							<!-- 合同金额 -->

							<!-- 已回款 -->
							<view class="item l_item">
								<view class="top_info d-flex">
									<view class="item_tit">已回款</view>

									<view class="t_r_info">
										<view class="txt" v-if="dashSelectInfo.showTxt">较{{ dashInfo.last_time_word || '' }}</view>
										<view class="txt" v-else></view>
										<view
											class="count"
											:class="
												dashInfo.payment_collection_percent
													? dashInfo.payment_collection_percent && dashInfo.percent3 == 1
														? 'add'
														: dashInfo.percent3 == 2
														? 'sub'
														: ''
													: ''
											"
										>
											<view v-if="dashSelectInfo.showTxt">{{ dashInfo.payment_collection_percent ? dashInfo.payment_collection_percent + '%' : '-' }}</view>
										</view>
									</view>
								</view>

								<view class="btm_info">
									<text :class="dashInfo.index_current_payment_collection ? 'price' : ''">{{ dashInfo.index_current_payment_collection || '-' }}</text>

									元
								</view>
							</view>
							<!-- 已回款 -->

							<!-- 新增客户 -->
							<view class="item">
								<view class="top_info d-flex">
									<view class="item_tit">新增客户</view>

									<view class="t_r_info">
										<view class="txt" v-if="dashSelectInfo.showTxt">较{{ dashInfo.last_time_word || '' }}</view>
										<view class="txt" v-else></view>
										<view
											class="count"
											:class="
												dashInfo.newly_added_customer_percent
													? dashInfo.newly_added_customer_percent && dashInfo.percent4 == 1
														? 'add'
														: dashInfo.percent4 == 2
														? 'sub'
														: ''
													: ''
											"
										>
											<view v-if="dashSelectInfo.showTxt">
												{{ dashInfo.newly_added_customer_percent ? dashInfo.newly_added_customer_percent + '%' : '-' }}
											</view>
										</view>
									</view>
								</view>

								<view class="btm_info">
									<text :class="dashInfo.newly_added_customer ? 'num' : ''">{{ dashInfo.newly_added_customer || '-' }}</text>
									人
								</view>
							</view>
							<!-- 新增客户 -->

							<!-- 新增成交客户 -->
							<view class="item l_item btm_tiem">
								<view class="top_info d-flex">
									<view class="item_tit">新增成交客户</view>

									<view class="t_r_info">
										<view class="txt" v-if="dashSelectInfo.showTxt">较{{ dashInfo.last_time_word || '' }}</view>
										<view class="txt" v-else></view>
										<view
											class="count"
											:class="
												dashInfo.newly_added_deal_customer_count_percent
													? dashInfo.newly_added_deal_customer_count_percent && dashInfo.percent5 == 1
														? 'add'
														: dashInfo.percent5 == 2
														? 'sub'
														: ''
													: ''
											"
										>
											<view v-if="dashSelectInfo.showTxt">
												{{ dashInfo.newly_added_deal_customer_count_percent ? dashInfo.newly_added_deal_customer_count_percent + '%' : '-' }}
											</view>
										</view>
									</view>
								</view>

								<view class="btm_info">
									<text :class="dashInfo.newly_added_deal_customer_count ? 'num' : ''">{{ dashInfo.newly_added_deal_customer_count || '-' }}</text>
									人
								</view>
							</view>
							<!-- 新增成交客户 -->

							<!-- 近1月未跟进 -->
							<view class="item btm_tiem">
								<view class="top_info d-flex">
									<view class="item_tit">未跟进客户</view>

									<view class="t_r_info">
										<view class="txt" v-if="dashSelectInfo.showTxt">较{{ dashInfo.last_time_word || '' }}</view>
										<view class="txt" v-else></view>
										<view
											class="count"
											:class="
												dashInfo.not_follow_up_percent
													? dashInfo.not_follow_up_percent && dashInfo.percent6 == 1
														? 'add'
														: dashInfo.percent6 == 2
														? 'sub'
														: ''
													: ''
											"
										>
											<view v-if="dashSelectInfo.showTxt">{{ dashInfo.not_follow_up_percent ? dashInfo.not_follow_up_percent + '%' : '-' }}</view>
										</view>
									</view>
								</view>

								<!-- 近1月未跟进 -->
								<view class="btm_info">
									<text :class="dashInfo.not_follow_up ? 'num' : ''">{{ dashInfo.not_follow_up || '-' }}</text>
									人
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 仪表盘 -->

				<!-- 签单对比 -->
				<view class="sign_contrast" v-if="role_id > 0 || role_id < 3">
					<view class="com_top_tit d-center">
						<view class="tit">签单对比</view>
						<view class="r_select d-center">
							<view class="item d-center" @click="signSelectShow = true">
								{{ signSelect.activeDate }}
								<i class="icon iconfont icon-xl2"></i>
							</view>
						</view>
					</view>

					<view class="sign_mian">
						<view class="tit">单/月</view>
						<view class="charts-box"><qiun-data-charts :canvas2d="true" type="line" :chartData="chartsDataLine1" /></view>
					</view>
				</view>
				<!-- 签单对比 -->

				<!-- 销售产品 -->
				<view class="sell_product">
					<view class="com_top_tit d-center">
						<view class="tit">销售产品</view>
						<view class="r_select d-center">
							<view class="item d-center" @click="sellDateShow">
								{{ sellSelectInfo.activeDate || '本年度' }}
								<i class="icon iconfont icon-xl2"></i>
							</view>
						</view>
					</view>

					<view class="sell_main">
						<view class="list" v-if="sellList.length > 0">
							<block v-for="(v, i) in sellList" :key="i">
								<view class="item d-between" @click="nav(v)" v-if="i < 3">
									<view class="l_info d-between">
										<image :src="v.topImg" mode="aspectFit"></image>

										<view class="name u-line-1">{{ v.product_name || '' }}</view>
									</view>

									<view class="pirce">
										<text>¥</text>
										{{ v.t_price || '' }}
									</view>
								</view>
							</block>

							<view class="more_btn" @click="nav('sell_top')" v-if="sellList.length > 3">更多 ></view>
						</view>

						<view class="slogan" v-else>
							<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

							<view class="txt">暂无数据</view>
						</view>
					</view>
				</view>
				<!-- 销售产品 -->

				<!-- 业绩排行 -->
				<view class="achievement_ranking">
					<view class="com_top_tit d-center">
						<view class="tit">业绩排行</view>
						<view class="r_select d-center">
							<view class="item d-center" @click="achiDateShow">
								{{ achiSelectInfo.activeDate || '本年度' }}
								<i class="icon iconfont icon-xl2"></i>
							</view>
						</view>
					</view>

					<view class="per_main">
						<view class="list" v-if="achievementList.length > 0">
							<block v-for="(v, i) in achievementList" :key="i">
								<view class="item d-between" @click="nav(v)" v-if="i < 3">
									<view class="l_info d-center">
										<image :src="v.topImg" v-if="i < 3" mode="aspectFit"></image>
										<view class="count" v-else>{{ i + 1 }}</view>

										<view class="user_info avatar_box d-center">
											<u-avatar :src="v.user.avatar" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit" v-if="v.user.avatar"></u-avatar>
											<u-avatar :text="v.user.abbreviation" :size="42" shape="square" bg-color="#4D6FFF" mode="aspectFit" v-else></u-avatar>

											<view class="info">
												<view class="name u-line-1">{{ v.user ? v.user.name : '' }}</view>
												<view class="branch_name">{{ v.user.department ? v.user.department.name : '' }}</view>
											</view>
										</view>
									</view>

									<view class="r_info">
										<view class="count">{{ v.contract_num }}笔</view>
										<view class="pirce">
											<text>¥</text>
											{{ v.total_money }}
										</view>
									</view>
								</view>
							</block>

							<view class="more_btn" @click="nav('achievement_top')" v-if="achievementList.length > 3">更多 ></view>
						</view>

						<view class="slogan" v-else>
							<u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

							<view class="txt">暂无数据</view>
						</view>
					</view>
				</view>
				<!-- 业绩排行 -->
			</view>
		</view>

		<!-- 全部成员 部门选择 -->
		<u-popup :show="memberShow" :round="10" mode="bottom" :safeAreaInsetBottom="false" @close="memberShow = false">
			<view class="home_choose_member">
				<view class="propup_main">
					<view class="tit">请选择</view>

					<view class="choose_list">
						<view class="item_li d-between" :class="!activeMember ? 'active' : ''" @click="chooseMember('')">
							<view class="label">{{ role_id > 2 ? '本部门' : '全公司' }}</view>
							<i class="t-icon iconfont t-icon-guo-l"></i>
						</view>

						<view class="item_li d-between" :class="activeMember == '仅本人' ? 'active' : ''" @click="chooseMember('仅本人')">
							<view class="label">仅本人</view>
							<i class="t-icon iconfont t-icon-guo-l"></i>
						</view>

						<view class="item_li d-between" :class="activeMember == 'diy' ? 'active' : ''" @click="chooseMember('diy')">
							<view class="label">自定义</view>
							<view class="r_ipt d-center">
								<u-input
									v-model="diyMemberInfo.name"
									placeholder="去设置"
									placeholderStyle="#999999"
									fontSize="13"
									border="none"
									inputAlign="right"
									readonly
								></u-input>

								<i class="icon iconfont icon-you"></i>
							</view>
						</view>
					</view>
				</view>

				<view class="popup_btns">
					<view class="btn cancel" @click="memberShow = false">取消</view>
					<view class="btn" @click="submitChooseMember">确定</view>
				</view>
			</view>
		</u-popup>

		<!-- 选择时间 -->
		<choosedate :dateShow="dateShow" :dateList="dateList" :dateInfo="dateInfo" @chooseTime="chooseTime" @submitDate="submitDate" @hideChooseDate="hideChooseDate"></choosedate>

		<!-- 签单时间 年月 -->
		<u-datetime-picker
			ref="datetimePicker"
			:show="signSelectShow"
			v-model="signValue"
			mode="year-month"
			:formatter="formatter"
			@confirm="signConfirm"
			@cancel="signSelectShow = false"
		></u-datetime-picker>
	</view>
</template>

<script>
import { getData } from '@/common/api';
import { getNowDate } from '@/common/hooks';

import store from '@/store';
//下面是演示数据，您的项目不需要引用，数据需要您从服务器自行获取
import Battery from '@/components/Battery.vue';
import choosedate from '@/components/chooseDate.vue'; // 选择时间

export default {
	data() {
		return {
			// 开机动画步骤
			show_start: false, //开机动画
			showAniBtn: false, //开机动画 立即体验
			ossImgUrl: store.state.ossBaseUrl,
			steupList: [
				`${store.state.ossBaseUrl}direct/resource/202204/06/yRjCJFdKbPcQ5smKz2t86Qsidxr2D5nw1649223239891.png`,
				`${store.state.ossBaseUrl}direct/resource/202204/06/Yi4wzWCWx7TYB7YHeGAyc54yMferaFrp1649207647694.png`,
				`${store.state.ossBaseUrl}direct/resource/202204/06/zHsHBMkRsz45rANEcjpQKP3PsWzhGPaw1649207817911.png`,
				`${store.state.ossBaseUrl}direct/resource/202204/06/XM4SfCrB8bjscsZefY6MBFGP8ptw8BNy1649207829870.png`
			],
			menus: [
				{
					name: '客户列表',
					url: 'client',
					tabbar: true,
					img: 'direct/resource/202202/25/RQQzc654H62hHhsSWKJDBE3ic8fiyp521645753510291.png'
				},
				{
					name: '销售合同',
					url: 'contract',
					img: 'direct/resource/202202/25/Met2edEakeNkJNsicyRZWAxSjKJscWnt1645753558548.png'
				},
				{
					name: '回款统计',
					url: 'return_money',
					img: 'direct/resource/202202/25/hSxHAr7aEhAb3byF3cj4rjk8YX4cGcnM1645753624869.png'
				},
				{
					name: '报价单',
					url: 'offer',
					img: 'direct/resource/202203/27/%E5%9B%BE%E7%89%87%281%29/bjd12.png',
					unline: false
				},
				{
					name: '保修统计',
					url: 'repair',
					img: 'res/images/202210/21/ogHH9tUGPTfVFFpcLv3MsH9bBpZV0AsvkawyPwOY.png'
				},
				{
					name: '拜访计划',
					url: 'visit_plan',
					img: 'direct/resource/202202/25/ExMy5FRHYcWkmMkjmsbGeYEQDrRnXpHQ1645753649339.png'
				}
			],
			topImgs: [
				'direct/resource/202202/25/4M7eSQchwcKYC3F5FbyRhFaMwYDSZp3f1645754278394.png',
				'direct/resource/202202/25/sXyzdWFSTzz7w6KAbe4PPsfT6QGHKAHJ1645754323319.png',
				'direct/resource/202202/25/hD5bxQc2dntrWi3ccB84Dk8cfYtbZtPB1645754333279.png'
			],
			noData: store.state.no_data,
			role_id: null,
			user: {},
			my_annual: {},
			annual: {},

			completion_money: '',
			money: '',
			my_completion_money: '',
			my_money: '',
			percent: 0,
			my_percent: 0,

			sellList: [], // 销售产品
			achievementList: [], // 业绩排行
			dashInfo: {}, // 仪表盘数据

			chartsDataLine1: {
				categories: [],
				series: []
			}, // 折线图

			dateShow: false, // 时间选择
			dateList: ['今天', '昨天'],
			dateInfo: {
				selectType: 'dash', // 当前是哪个筛选日期  dash 仪表盘 sell 销售
				activeDate: 0, // i 后端arr diy 自定义
				startTime: '',
				endTime: '',
				showStartTime: '',
				showEndTime: ''
			},

			dashSelectInfo: {
				selectType: 'dash', // 当前是哪个筛选日期  dash 仪表盘 sell 销售
				activeDate: '本年度', // i 后端arr diy 自定义
				startTime: '',
				endTime: '',
				showStartTime: '',
				showEndTime: '',
				showTxt: true // 展示 较上月 等
			}, //仪表盘筛 选时间
			sellSelectInfo: {
				selectType: 'sell', // 当前是哪个筛选日期  dash 仪表盘 sell 销售
				activeDate: '本年度', // i 后端arr diy 自定义
				startTime: '',
				endTime: '',
				showStartTime: '',
				showEndTime: '',
				user_id: '', // 筛选员工 、部门
				department_id: '' // 筛选员工 、部门
			}, //销售列表 筛选时间
			achiSelectInfo: {
				selectType: 'achi', // 当前是哪个筛选日期  dash 仪表盘 sell 销售
				activeDate: '本年度', // i 后端arr diy 自定义
				startTime: '',
				endTime: '',
				showStartTime: '',
				showEndTime: ''
			}, //业绩排行 筛选时间

			memberShow: false, // 员工 部门选择
			showActiveMember: '', // 默认全部
			activeMember: '', //  全公司  仅本人 自定义 diy
			chooseMemberTabs: 0, // 0 员工 、1 部门
			diyMemberInfo: {},

			signSelectShow: false,
			signValue: Number(new Date()),
			signSelect: {
				activeDate: '',
				defaultIndex: [0, 0],
				signColumns: []
			},
			scrollShow: false
		};
	},
	onReady() {
		// 微信小程序需要用此写法
		this.$refs.datetimePicker.setFormatter(this.formatter);
	},
	onLoad() {
		uni.getStorage({
			key: 'start_ani',
			success: res => {
				uni.showTabBar();
			},
			fail: res => {
				this.show_start = true;
				uni.hideTabBar();
			}
		});
	},
	onShow() {
		this.initDate();

		uni.getStorage({
			key: 'start_ani',
			success: res => {
				uni.showTabBar();
				this.init();
			},
			fail: res => {
				this.show_start = true;
				uni.hideTabBar();
			}
		});

		// 接受选择的 部门、员工
		let _th = this;
		uni.$on('homeChooseMember', function(data) {
			_th.activeMember = data.activeMember;
			_th.chooseMemberTabs = data.chooseMemberTabs;
			_th.diyMemberInfo = JSON.parse(data.info);
		});
	},
	methods: {
		startMini() {
			this.show_start = false;
			this.init();
			uni.showTabBar();

			uni.setStorage({
				key: 'start_ani',
				data: true,
				success: function() {}
			});
		},
		// 动画
		aniChange(i) {
			this.showAniBtn = i.current == 3;
		},
		init() {
			if (!this.signSelect.activeDate) {
				const { y, m } = getNowDate();
				this.signSelect.activeDate = `${y}-${m}`;
			}

			let achiInfo = this.achiSelectInfo;
			let achievement_timing = achiInfo.activeDate;
			if (achiInfo.showStartTime && achiInfo.showEndTime) {
				achievement_timing = [achiInfo.showStartTime, achiInfo.showEndTime];
			}

			let sellInfo = this.sellSelectInfo;
			let sale_timing = sellInfo.activeDate;
			if (sellInfo.showStartTime && sellInfo.showEndTime) {
				sale_timing = [sellInfo.showStartTime, sellInfo.showEndTime];
			}

			getData('/index/achievement_sale_bill', {
				params: {
					achievement_timing,
					sale_timing,
					bill_timing: this.signSelect.activeDate
				}
			}).then(res => {
				const {
					code,
					data: {
						time_search,

						user,
						performance_ranking,
						contract_product,
						departments,
						days,

						my_annual,
						annual,

						completion_money,
						money,
						my_completion_money,
						my_money,
						percent,
						my_percent
					}
				} = res;
				if (code == 200) {
					this.dateList = time_search;

					// 公司目标
					// this.my_annual = my_annual;
					// this.annual = annual;

					this.completion_money = completion_money;
					this.money = money;
					this.my_completion_money = my_completion_money;
					this.my_money = my_money;
					this.percent = percent || 0;
					this.my_percent = my_percent || 0;

					this.user = user;
					this.role_id = user.role_id;
					this.getDash();

					// 业绩排行
					let perArr = performance_ranking;
					perArr.map((e, i) => {
						e.topImg = `${store.state.ossBaseUrl}${this.topImgs[i]}`;
					});
					this.achievementList = perArr;

					// 销售产品
					let productArr = contract_product;
					productArr.map((e, i) => {
						e.topImg = `${store.state.ossBaseUrl}${this.topImgs[i]}`;
					});
					this.sellList = productArr;

					// 签单对比
					let newDays = days;
					let dayArr = [];
					newDays.map((e, i) => {
						if ((i + 1) % 5 == 0 || i == 0) {
							dayArr.push(e);
						} else {
							dayArr.push('');
						}
					});
					dayArr[dayArr.length - 1] = days[days.length - 1];

					if (newDays.length > 30) {
						dayArr[dayArr.length - 2] = '';
					}

					let dArr = departments;
					if (dArr.length > 0) {
						dArr.map(e => {
							e.data = e.department_month_value;
						});
						this.chartsDataLine1 = {
							categories: dayArr,
							series: dArr
						};
					} else {
						this.chartsDataLine1 = {
							categories: dayArr,
							series: [
								{
									name: '',
									data: []
								}
							]
						};
					}
				}
			});

			// this.getSignInfo();
		},
		// 仪表盘
		getDash() {
			let info = this.dashSelectInfo;
			let timing = info.activeDate;
			if (info.showStartTime && info.showEndTime) {
				timing = [info.showStartTime, info.showEndTime];
			}

			let user_id = this.user.role_id == 4 ? this.user.id : '';
			let department_id = '';

			if (!this.activeMember) {
				if (this.user.role_id == 3) {
					department_id = this.user.department_id;
				}
			}

			if (this.activeMember == '仅本人') {
				user_id = this.user.id;
			}

			if (this.activeMember == 'diy') {
				if (this.chooseMemberTabs == 0) {
					user_id = this.diyMemberInfo.id;
				} else {
					department_id = this.diyMemberInfo.id;
				}
			}
			getData('/index/dashboard', {
				params: {
					timing,
					user_id,
					department_id
				}
			}).then(res => {
				const {
					code,
					data: { comprehensive }
				} = res;
				if (code === 200) {
					uni.stopPullDownRefresh();
					this.dashInfo = comprehensive;
				}
			});
		},
		// 销售产品
		getSellProduct() {
			let info = this.sellSelectInfo;
			let timing = info.activeDate;
			if (info.showStartTime && info.showEndTime) {
				timing = [info.showStartTime, info.showEndTime];
			}

			getData('/index/sale_product', {
				params: {
					timing
				}
			}).then(res => {
				const {
					code,
					data: {
						contract_product: { data }
					}
				} = res;
				if (code === 200) {
					uni.stopPullDownRefresh();
					let arr = data;
					arr.map((e, i) => {
						e.topImg = `${store.state.ossBaseUrl}${this.topImgs[i]}`;
					});
					this.sellList = arr;
				}
			});
		},
		// 业绩排行
		getAchi() {
			let info = this.achiSelectInfo;
			let timing = info.activeDate;
			if (info.showStartTime && info.showEndTime) {
				timing = [info.showStartTime, info.showEndTime];
			}

			getData('/index/performance_ranking', {
				params: {
					timing
				}
			}).then(res => {
				const {
					code,
					data: {
						performance_ranking: { data }
					}
				} = res;
				if (code === 200) {
					uni.stopPullDownRefresh();
					let arr = data;
					arr.map((e, i) => {
						e.topImg = `${store.state.ossBaseUrl}${this.topImgs[i]}`;
					});
					this.achievementList = arr;
				}
			});
		},
		// 获取业绩目标 公司创建的年份 月份
		getCompanyTarget() {
			const d = new Date();
			const year = d.getFullYear();
			let month = d.getMonth() + 1;

			let monArr = [];
			for (let i = 0; i < 12; i++) {
				if (month == i + 1) {
					this.signSelect.defaultIndex[1] = i;
				}
				monArr.push({
					val: i + 1,
					label: `${i + 1}月`
				});
			}
			this.signSelect.signColumns[1] = monArr;

			getData('/achievement/achievement_year_director', {}).then(res => {
				const {
					code,
					data: { list }
				} = res;
				if (code === 200) {
					uni.stopPullDownRefresh();
					let yearArr = [];
					if (list.length > 0) {
						list.map((e, i) => {
							if (year == e.year) {
								this.signSelect.defaultIndex[0] = i;
							}

							yearArr.push({
								label: `${e.year}年`,
								val: e.year
							});
						});
					} else {
						yearArr.push({
							label: `${year}年`,
							val: year
						});
					}

					this.signSelect.signColumns[0] = yearArr;
				}
			});
		},
		//  签单对比数据
		getSignInfo() {
			// if (!this.signSelect.activeDate) {
			//   const { y, m } = getNowDate();
			//   this.signSelect.activeDate = `${y}-${m}`;
			// }
			let month = this.signSelect.activeDate;

			getData('/index/signature_comparison', {
				params: {
					month
				}
			}).then(res => {
				const {
					code,
					data: { days, departments }
				} = res;
				if (code === 200) {
					uni.stopPullDownRefresh();

					let newDays = days;
					let dayArr = [];
					newDays.map((e, i) => {
						if ((i + 1) % 5 == 0 || i == 0) {
							dayArr.push(e);
						} else {
							dayArr.push('');
						}
					});
					dayArr[dayArr.length - 1] = days[days.length - 1];

					if (newDays.length > 30) {
						dayArr[dayArr.length - 2] = '';
					}

					let arr = departments;
					if (arr.length > 0) {
						arr.map(e => {
							e.data = e.department_month_value;
						});
						this.chartsDataLine1 = {
							categories: dayArr,
							series: arr
						};
					} else {
						this.chartsDataLine1 = {
							categories: dayArr,
							series: [
								{
									name: '',
									data: []
								}
							]
						};
					}
				}
			});
		},
		menuNav(v) {
			if (v.unline) {
				return this.$u.toast('即将上线');
			}

			if (v.tabbar) {
				this.$Router.replaceAll({
					path: `/${v.url}`
				});
			} else {
				this.$Router.push({
					path: `/${v.url}`,
					query: {
						from: 'home'
					}
				});
			}
		},
		nav(v) {
			this.$Router.push({
				path: `/${v}`,
				query: {}
			});
		},

		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`;
			}
			if (type === 'month') {
				return `${value}月`;
			}
			if (type === 'day') {
				return `${value}日`;
			}
			return value;
		},

		// 选择时间 ----------- 选择时间 -----------选择时间 -----------
		// 时间默认值
		initDate() {
			const d = new Date();
			const year = d.getFullYear();
			let month = d.getMonth() + 1;
			let day = d.getDate();
			month = month < 10 ? `0${month}` : month;
			day = day < 10 ? `0${day}` : day;

			let val = `${year}-${month}-${day}`;
			this.dateInfo.startTime = val;
			this.dateInfo.endTime = val;

			this.achiSelectInfo.startTime = val;
			this.achiSelectInfo.endTime = val;

			this.dashSelectInfo.startTime = val;
			this.dashSelectInfo.endTime = val;

			this.sellSelectInfo.startTime = val;
			this.sellSelectInfo.endTime = val;
		},
		dashDateShow() {
			this.dateInfo = this.dashSelectInfo;
			this.dateShow = true;
		},
		sellDateShow() {
			this.dateInfo = this.sellSelectInfo;
			this.dateShow = true;
		},
		achiDateShow() {
			this.dateInfo = this.achiSelectInfo;
			this.dateShow = true;
		},
		// 确认 时间选择
		submitDate(v) {
			// 仪表盘
			if (v.selectType == 'dash') {
				// 自定义
				if (v.activeDate == 'diy' || !v.showTxt) {
					if (!v.showStartTime) {
						return this.$u.toast('请选择开始时间');
					}
					if (!v.showEndTime) {
						return this.$u.toast('请选择结束时间');
					}

					v.activeDate = `${v.showStartTime}...`;
				}

				this.dashSelectInfo = v;
				this.getDash();
			} else if (v.selectType == 'sell') {
				// 销售产品
				// 自定义
				if (v.activeDate == 'diy') {
					if (!v.showStartTime) {
						return this.$u.toast('请选择开始时间');
					}
					if (!v.showEndTime) {
						return this.$u.toast('请选择结束时间');
					}

					v.activeDate = `${v.showStartTime}...`;
				}

				this.sellSelectInfo = v;
				this.getSellProduct();
			} else if (v.selectType == 'achi') {
				// 业绩排行
				// 自定义
				if (v.activeDate == 'diy') {
					if (!v.showStartTime) {
						return this.$u.toast('请选择开始时间');
					}
					if (!v.showEndTime) {
						return this.$u.toast('请选择结束时间');
					}

					v.activeDate = `${v.showStartTime}...`;
				}

				this.achiSelectInfo = v;
				this.getAchi();
			}

			this.dateShow = false;
		},

		hideChooseDate() {
			this.dateShow = false;
		},
		// 选择时间 ----------- 选择时间 -----------选择时间 -----------

		// 选择成员 选择成员 选择成员 选择成员  选择成员  选择成员  选择成员 dash
		dashMemberShow() {
			this.memberShow = true;
		},
		chooseMember(val) {
			this.activeMember = val;

			if (val == 'diy') {
				this.$Router.push({
					path: '/choose_member',
					query: {
						chooseMemberTabs: this.chooseMemberTabs,
						activeMember: this.activeMember,
						diyMemberInfo: JSON.stringify(this.diyMemberInfo),
						role: this.role_id,
						from_type: 'home'
					}
				});
			}
		},
		submitChooseMember() {
			this.memberShow = false;
			if (this.activeMember == 'diy') {
				this.showActiveMember = this.diyMemberInfo.name;
			} else {
				this.showActiveMember = this.activeMember;
			}

			this.getDash();
		},
		// 选择成员 选择成员 选择成员 选择成员  选择成员  选择成员  选择成员 dash

		// 签单对比 筛选月份
		signConfirm(v) {
			this.signValue = v.value;
			const { y, m } = getNowDate(new Date(v.value));
			this.signSelect.activeDate = `${y}-${m}`;
			this.signSelectShow = false;

			this.getSignInfo();
		},

		onPullDownRefresh() {
			this.page = 1;
			this.init();
		},
		onPageScroll(e) {
			this.scrollShow = e.scrollTop > 280;
		}
	},
	components: {
		Battery,
		choosedate
	}
};
</script>

<style lang="less" scoped>
// 开机动画
.start_animation {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	width: 100%;
	height: 100%;

	image {
		width: 100%;
		height: 100%;
	}

	.end_txt {
		position: absolute;
		bottom: 50px;
		left: 0;
		padding: 0 20px;
		width: 100%;

		.btn {
			width: 100%;
			height: 45px;
			line-height: 45px;
			font-weight: 600;
			color: #4d6fff;
			font-size: 16px;
			text-align: center;
			background-color: #fff;
			border-radius: 20px;
		}
	}
}

/deep/.u-swiper__indicator {
	bottom: 80px !important;
}

/deep/.u-navbar {
	z-index: 9;
}

.title_bg {
	padding: 0 20px;
	background: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/06/pic46/sy-bg1.png');
	background-size: 100% 100%;

	/deep/.u-navbar__content__title {
		color: #fff;
	}
}

.title_bg_white {
	padding: 0 20px;
	background: white;
	box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);

	/deep/.u-navbar__content__title {
		color: #333;
	}
}

.home {
	position: relative;
}

.top_bgc {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 362px;
	background: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/06/%E9%A3%9E%E4%B9%A620220407-085455.png');
	background-size: 100% 100%;
	z-index: -1;
}

.container_main {
	padding: 15px 15px 10px;
	z-index: 2;
}

.money_target {
	margin-bottom: 17px;

	// 企业年度目标
	.company_target {
		.finished_money {
			position: relative;
			flex-direction: column;
			margin: 0 auto 18px;
			width: 160px;
			height: 160px;
			border-radius: 50%;
			background-color: #fff;
			overflow: hidden;
			text-shadow: 0px 1px 4px rgba(157, 73, 1, 0.6);
			box-shadow: 0 0 0 15px rgba(255, 255, 255, 0.1);

			.proportion {
				font-size: 41px;
				font-weight: 600;
				color: #ffffff;
				z-index: 3;
			}

			.txt {
				font-size: 13px;
				font-weight: 600;
				line-height: 18px;
				color: #ffffff;
				z-index: 3;
				text-shadow: 0px 1px 4px rgba(157, 73, 1, 0.6);
			}

			.money_txt {
				font-size: 16px;
			}
		}

		.target_money {
			padding: 0 20px;
			min-width: 195px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			background: linear-gradient(142deg, #5d7cff 0%, #1e48fa 100%);
			border-radius: 15px;
			font-size: 12px;
			color: #fff;
			font-weight: 600;

			.money {
				color: #f6b54d;
				font-size: 16px;
				font-weight: 600;
			}

			.icon {
				font-size: 12px;
			}
		}
	}

	/deep/.battery {
		position: absolute;
		top: 0;
		left: 0;
		width: 100% !important;
		height: 100% !important;
	}

	.line {
		margin: 20px 0;
		border: 1px solid #5880f7;
	}

	// 部门 + 我的目标
	.branch_target {
		padding: 0 30px;

		.item {
			.l_money {
				.tit {
					margin-bottom: 6px;
					font-size: 13px;
					font-weight: 600;
					line-height: 18px;
					color: #ffffff;
				}

				.txt {
					font-size: 16px;
					font-weight: 600;
					line-height: 22px;
					color: #fff;

					.money {
						font-size: 16px;
						color: #fcac4e;
					}

					.icon {
						font-size: 12px;
					}
				}
			}

			.proportion_money {
				position: relative;
				width: 90px;
				height: 90px;
				background-color: #fff;
				border-radius: 50%;
				overflow: hidden;
				box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.1);

				.txt {
					font-size: 26px;
					font-weight: 600;
					color: #ffffff;
					z-index: 3;
					text-shadow: 0px 1px 4px rgba(157, 73, 1, 0.6);
				}

				.branch_txt {
					text-shadow: 0px 1px 4px rgba(0, 67, 193, 0.6);
				}
			}

			.branch {
				/deep/.battery {
					background-color: #d0d9ff !important;
					// background-color: rgba(91, 122, 250, 0.1) !important;

					.wave1,
					.wave2,
					.wave3 {
						background-color: rgba(91, 122, 250, 0.4) !important;
					}
				}
			}
		}
	}
}

.slogan {
	padding: 24px 0 0;
}

// 导航菜单
.menus_box {
	margin-bottom: 23px;
	padding: 20px 0 0;
	width: 100%;
	height: 186px;
	background-color: #fff;
	box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
	overflow: hidden;

	.items {
		padding: 0 10px;
		flex-wrap: wrap;
		justify-content: space-around;

		.item {
			margin-bottom: 26px;
			width: 33%;
			white-space: nowrap;

			.icon_box {
				margin: 0 auto 6px;
				padding: 2px;
				width: 38px;
				height: 38px;
				line-height: 38px;
				text-align: center;
				background: #f8faff;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.txt {
				font-size: 13px;
				font-weight: 600;
				line-height: 1;
				color: #333333;
				text-align: center;
			}
		}
	}
}

.com_top_tit {
	padding: 0 5px 14px;
	justify-content: space-between;

	.tit {
		font-size: 14px;
		font-weight: 600;
		color: #333333;
	}

	.r_select {
		.item {
			margin-left: 20px;
			font-size: 12px;
			font-weight: 400;
			line-height: 1;
			color: #333333;

			.iconfont {
				margin-left: 6px;
				font-size: 6px;
			}
		}
	}
}

// 仪表盘
.dash_board {
	margin-bottom: 20px;

	.dash_mian {
		padding: 25px 25px 0;
		width: 100%;
		height: 297px;
		background: #fff;
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
		border-radius: 10px;

		.tit {
			margin-bottom: 20px;
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
			color: #333333;
		}

		.data_content {
			flex-wrap: wrap;

			.item {
				padding: 20px 13px 11px;
				width: 50%;
				border-bottom: 1px solid #f2f2f2;

				.top_info {
					justify-content: space-between;
					align-items: baseline;
					.item_tit {
						font-size: 13px;
						font-weight: 400;
						color: #333;
					}

					.t_r_info {
						text-align: right;
						font-size: 12px;
						font-weight: 400;
						line-height: 16px;
						color: #999999;

						.count {
							color: #999999;
						}

						.add {
							color: #ff4500 !important;
						}

						.sub {
							color: #2ab22a !important;
						}
					}
				}

				.btm_info {
					font-size: 12px;
					color: #666666;
					line-height: 1;

					text {
						font-size: 16px;
						color: #999999;
						margin-right: 3px;
					}

					.price {
						font-size: 16px;
						font-weight: 600;
						color: #ff9d00;
					}

					.num {
						font-size: 16px;
						font-weight: 600;
						color: #4d6fff;
					}
				}
			}

			.t_item {
				padding-top: 0;
			}

			.l_item {
				padding-left: 0;
				border-right: 1px solid #f2f2f2;
			}

			.btm_tiem {
				border-bottom: none;
			}
		}
	}
}

// 签单对比
.sign_contrast {
	margin-bottom: 20px;

	.sign_mian {
		width: 100%;
		min-height: 230px;
		background-color: #fff;
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
		border-radius: 10px;

		.tit {
			padding: 20px 20px 10px;
			font-size: 11px;
			font-weight: 400;
			line-height: 16px;
			color: #999999;
		}
	}
}

// 销售产品
.sell_product {
	margin-bottom: 20px;

	.sell_main {
		padding: 18px 10px 20px;
		width: 100%;
		background-color: #fff;
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
		border-radius: 10px;

		.list {
			.item {
				margin-bottom: 29px;

				.l_info {
					image {
						margin-right: 13px;
						width: 21px;
						height: 21px;
						flex-shrink: 0;
					}

					.name {
						font-size: 14px;
						font-weight: 600;
						color: #333333;
					}
				}

				.pirce {
					margin-left: 75px;
					font-size: 16px;
					font-weight: 600;
					line-height: 22px;
					color: #ff9d00;
					flex-shrink: 0;

					text {
						font-size: 13px;
					}
				}
			}

			:last-child {
				margin-bottom: 0;
			}

			.more_btn {
				font-size: 12px;
				font-weight: 400;
				line-height: 17px;
				color: #999999;
				text-align: center;
			}
		}
	}
}

// 业绩排行
.achievement_ranking {
	margin-bottom: 20px;

	.per_main {
		padding: 20px 10px;
		width: 100%;
		background-color: #fff;
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
		border-radius: 10px;

		.item {
			margin-bottom: 20px;
			padding-bottom: 20px;
			border-bottom: 1px solid #f2f2f2;

			.l_info {
				image {
					margin-right: 13px;
					width: 21px;
					height: 21px;
					flex-shrink: 0;
				}

				.count {
					margin-left: 2px;
					margin-right: 14px;
					width: 18px;
					height: 18px;
					line-height: 18px;
					font-size: 13px;
					font-weight: 600;
					color: #999999;
					text-align: center;
					background-color: #ebebeb;
					border-radius: 50%;
					flex-shrink: 0;
				}

				.user_info {
					.info {
						margin-left: 10px;

						.name {
							margin-bottom: 3px;
							font-size: 14px;
							font-weight: 600;
							line-height: 20px;
							color: #333333;
						}
						.branch_name {
							font-size: 12px;
							font-weight: 400;
							line-height: 1;
							color: #666666;
						}
					}
				}
			}

			.r_info {
				text-align: right;

				.count {
					font-size: 12px;
					font-weight: 400;
					line-height: 17px;
					color: #999999;
				}

				.pirce {
					font-size: 16px;
					font-weight: 600;
					line-height: 22px;
					color: #ff9d00;

					text {
						font-size: 13px;
					}
				}
			}
		}
		:last-child {
			border-bottom: none;
			margin-bottom: 0;
		}

		.more_btn {
			font-size: 12px;
			font-weight: 400;
			line-height: 17px;
			color: #999999;
			text-align: center;
		}
	}
}

.choose_date {
	.propup_main {
		padding: 11px 20px 0;

		.tit {
			margin-bottom: 16px;
			font-size: 12px;
			font-weight: 400;
			line-height: 17px;
			color: #999999;
		}

		.list {
			margin-bottom: 15px;
			width: 105%;
			flex-wrap: wrap;

			.item {
				margin: 0 10px 14px 0;
				width: 76px;
				height: 42px;
				line-height: 42px;
				background: #f4f4f4;
				border-radius: 8px;
				font-size: 13px;
				font-weight: 400;
				color: #333333;
				text-align: center;
			}

			.active {
				background-color: #4d6fff;
				color: #fff;
			}
		}

		// 自定义日期
		.definition_box {
			margin-bottom: 60px;

			.item_ipt {
				position: relative;
				.iconfont {
					position: absolute;
					top: 50%;
					left: 10px;
					transform: translateY(-50%);
					font-size: 14px;
					color: #c3c3c3;
				}

				/deep/.u-input {
					padding-left: 34px !important;
					width: 100%;
					height: 42px;
					border: 1px solid #dedede;
					border-radius: 8px;
				}
			}

			.txt {
				margin: 0 12px;
				font-size: 14px;
				font-weight: 400;
				color: #999999;
			}
		}
	}

	.popup_btns {
		padding-bottom: 28px;
	}
}
</style>
