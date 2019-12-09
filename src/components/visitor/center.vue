<template>
	<div class="visitorCenterPage">
		<div class='pull-box'>
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
				<div slot="pulling" class="refresh-top">
					<img src="@/assets/img/loadTop.gif" />
				</div>
				<div slot="loosing" class="refresh-top">
					<img src="@/assets/img/loadTop.gif" />
				</div>
				<div slot="loading" class="refresh-top">
					<img src="@/assets/img/loadTop.gif" />
				</div>
				<div class="header">
					<div class="information">
						<img :src="$store.state.headImg" class="left" @click="$router.push('/information')" />
						<div class="center" v-on:click.stop="$router.push('/information')">
							<p class="p1">{{$store.state.nickName || ''}}</p>
							<p class="p2" v-if="$store.state.userid">ID：{{$store.state.userid}}</p>
							<p class="p3">{{$store.state.company || ''}}</p>
						</div>
						<div class="right">
							<img src="@/assets/img/head_phone.png" />
							<span v-if="!$store.state.bind" v-on:click.stop="$router.push('/bindPhone')">待绑定</span>
							<span v-if="$store.state.bind" v-on:click.stop="$router.push('/unBindPhone')">已绑定</span>
						</div>
					</div>
					<!--非审核人-->
					<ul class="nav_list" v-if="!$store.state.isAdmin">
						<li @click="$router.push({name:'VisitorList',params:{'id':'1'}})">
							<span>{{waitAuditCount}}</span>
							<b>待审核</b>
						</li>
						<li @click="$router.push({name:'VisitorList',params:{'id':'2'}})">
							<span>{{waitVisitCount}}</span>
							<b>待访问</b>
						</li>
						<li @click="$router.push({name:'VisitorList',params:{'id':'3'}})">
							<span>{{signOutCount}}</span>
							<b>已签离</b>
						</li>
						<li @click="$router.push({name:'VisitorList',params:{'id':'4'}})">
							<span>{{ineffectiveCount}}</span>
							<b>未生效</b>
						</li>
					</ul>
					<!--审核人-->
					<ul class="nav_list2" v-if="$store.state.isAdmin">
						<li @click="$router.push({name:'VisitorList2',params:{'id':'1'}})">
							<span>{{myGuest}}</span>
							<b>我的访客</b>
						</li>
						<li @click="$router.push({name:'VisitorList2',params:{'id':'2'}})">
							<span>{{myVisit}}</span>
							<b>我的访问</b>
						</li>
						<li @click="$router.push({name:'VisitorList2',params:{'id':'3'}})">
							<span>{{myInvite}}</span>
							<b>我的邀约</b>
						</li>
					</ul>
					<div class="message" @click="$router.push('/message')">
						<img src="@/assets/img/head_message_icon.png" class="icon_message" />
						<van-swipe :autoplay="3000" vertical :show-indicators='false' :touchable='false'>
							<van-swipe-item v-for='(item,index) in newsList' v-if='newsList.length>0' :key='index'>
								<p :class="item.content2?'p1':'p3'"><span>{{item.carouselTitle || item.content}}</span><b>{{item.displayTime}}</b></p>
								<p class="p2"><span>{{item.carouselTitle2 || item.content2}}</span><b v-if="item.content2">{{item.displayTime2}}</b></p>
							</van-swipe-item>
							<van-swipe-item v-if='newsList.length<1'>
								<p class="p3"><span>欢迎关注杭州宇穹科技</span></p>
							</van-swipe-item>

						</van-swipe>
						<img src="@/assets/img/icon_next.png" class="icon_next" />
					</div>
				</div>
				<div class="main">
					<div class="title">
						<img src="@/assets/img/icon_title.png" />
						<span>访问动态</span>
					</div>
					<!--二维码-->
					<van-list class="card_list" v-model="loading" :finished="finished" finished-text="" @load="onLoadBottom">
						<Card :list.sync='recordList' @initList='initList' @handleOthertimeBoxShow='handle_othertime_box_show($event)' @handleRefuseBoxShow='handle_refuse_box_show($event)' @handleQrcodeBoxShow='handle_qrcode_box_show($event)' @touchmove.prevent>
						</Card>
					</van-list>
					<p class="nomore" v-if='nomore'>没有更多了~</p>
				</div>
			</van-pull-refresh>

		</div>

		<div class="center_bottom">
			<div class="btn_box_1" v-if="!$store.state.isAdmin">
				<ColorBtn @handleBtnClick="$router.push('/visitor/book')" :btnClassName.sync='btnBlue'>我要预约</ColorBtn>
			</div>
			<div class="btn_box_2" v-if="$store.state.isAdmin">
				<ColorBtn @handleBtnClick="$router.push('/visitor/invite')" :btnClassName.sync='btnYellow'>我要邀约</ColorBtn>
				<ColorBtn @handleBtnClick="$router.push('/visitor/book')" :btnClassName.sync='btnBlue'>我要预约</ColorBtn>
			</div>
		</div>
		<!--二维码-->
		<QrcodeShow :id.sync='qrcodeId'></QrcodeShow>
		<!--拒绝-->
		<Refuse :boxShow.sync='refuseBoxShow' :id='refuseId' @initList='initList'></Refuse>
		<!--改期-->
		<OtherDay :boxShow.sync='othertimeBoxShow' :id='updateTimeId' :selectDate.sync="othertimeSelectDate" :startTime.sync="othertimeStartTime" @initList='initList'></OtherDay>
	</div>
</template>
<script>
	import ColorBtn from '../common/colorBtn'
	import Card from '../common/card'
	import QrcodeShow from '../common/qrcodeShow'
	import OtherDay from '../common/otherDay'
	import Refuse from '../common/refuse'
	import Vue from 'vue';
	import { Swipe, SwipeItem, List, PullRefresh, } from 'vant';
	Vue.use(Swipe).use(SwipeItem);
	Vue.use(List);
	Vue.use(PullRefresh);
	export default {
		name: 'VisitorCenter',
		components: {
			ColorBtn,
			Card,
			QrcodeShow,
			OtherDay,
			Refuse,
		},
		data() {
			return {
				/*用户基本信息*/
				user: {
					bind: false,
					certificateNo: "342401125303962563",
					company: "",
					headimgurl: require('@/assets/img/head_portrait.png'),
					id: "",
					nickName: "",
					openId: "",
					phone: "",
					realName: "",
				},
				/*导航列表数量*/
				ineffectiveCount: 0,
				signOutCount: 0,
				waitAuditCount: 0,
				waitVisitCount: 0,
				myGuest: 0,
				myInvite: 0,
				myVisit: 0,
				/*推送消息列表*/
				newsList: [],
				/*loadmore*/
				loading: false,
				finished: false,
				isLoading: false,
				nomore: false,
				/*列表*/
				recordList: [],
				pageNumber: 1,
				/*拒绝*/
				refuseBoxShow: false,
				refuseId: 0,
				/*改期*/
				othertimeBoxShow: false,
				updateTimeId: 0,
				othertimeSelectDate: '',
				othertimeStartTime: '',
				/*二维码*/
				qrcodeShow: false,
				qrcodeId: 0,
				/*按钮*/
				btnYellow: "colorBtnYellow",
				btnBlue: "colorBtnBlue",
			}
		},
		mounted() {
			if(this.$openId) {
				this.init();
				this.initList();
			}
		},
		methods: {
			init() {
				/*用户信息*/
				this.$axios({
					method: 'post',
					url: '/user/getUserInfo',
					data: {
						openId: this.$openId,
					},
				}).then(res => {
					if(res.data.code == 200) {
						if(!res.data.data.id) {
							this.$axios({
								method: 'get',
								url: '/wx/api/login',
							}).then(res => {
								location.href = res.data.data.url.split('&state')[0] + '&state=' + '0';
							}).catch(res => {
								console.log(res)
							});
						}
						let isAdmin = res.data.data.admin ? 1 : '';
						this.$store.commit('initIsAdmin', isAdmin);
						this.user.id = res.data.data.id || '暂无信息';
						this.user.nickName = res.data.data.nickName || '';
						this.user.openId = res.data.data.openId || '';
						let headImg = res.data.data.headimgurl || require('@/assets/img/head_portrait.png');
						this.$store.commit('initHeadImg', headImg);
						this.$store.commit('initNickName', this.user.nickName)
						let bind = res.data.data.bind ? 1 : '';
						this.$store.commit('initBind', bind)
						let userid = res.data.data.id || '';
						this.$store.commit('initUserid', res.data.data.id);
						let userPhone = res.data.data.phone || '';
						this.$store.commit('initUserPhone', userPhone)
						let company = res.data.data.company || '';
						this.$store.commit('initCompany', company);
						let realName = res.data.data.realName || '';
						this.$store.commit('initRealName', realName);
						let certificateNo = res.data.data.certificateNo || '';
						this.$store.commit('initCertificateNo', certificateNo)
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					console.log(res)
				});
				/*轮播消息*/
				this.$axios({
					method: 'post',
					url: 'user/getMessageList',
					data: {
						openId: this.$openId,
						pageNumber: 10,
						pageNumber: 1,
					},
				}).then(res => {
					if(res.data.code == 200) {
						let newsListArr = [];
						res.data.data.forEach((x, i) => {
							if(i % 2 != 1) {
								newsListArr[i / 2] = {}
								newsListArr[i / 2].content = x.content;
								newsListArr[i / 2].carouselTitle = x.carouselTitle;
								newsListArr[i / 2].displayTime = x.displayTime;
							} else {
								let index = (i - 1) / 2;
								newsListArr[index].content2 = x.content;
								newsListArr[index].displayTime2 = x.displayTime;
							}
						})
						this.newsList = newsListArr;
					}
				}).catch(res => {
					console.log(res)
				});
				/*访客参数获取*/
				this.$axios({
					method: 'post',
					url: 'user/getConfig',
					data: {
						openId: this.$openId,
					},
				}).then(res => {
					console.log(res);
					if(res.data.code == 200) {
						this.$store.commit('initNeedReason', res.data.data.needReason)
						this.$store.commit('initNeedCompany', res.data.data.needCompany)
						this.$store.commit('initNeedIdNumber', res.data.data.needIdNumber)
					}
				}).catch(res => {
					console.log(res)
				});
			},
			initList() {
				this.nomore = false;
				this.finished = true;
				this.recordList = [];
				this.pageNumber = 1;
				this.$toast.loading({
					duration: 0,
					message: '加载中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: '/guest/appointment/record',
					data: {
						openId: this.$openId,
						index: 0,
						pageSize: 10,
						pageNumber: this.pageNumber,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {
						this.loading=false;
						this.pageNumber += 1;
						if(res.data.data.list.length < 10) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.nomore = false;
							this.finished = false;
						}
						this.recordList = res.data.data.list;
						this.ineffectiveCount = res.data.data.ineffectiveCount;
						this.signOutCount = res.data.data.signOutCount;
						this.waitAuditCount = res.data.data.waitAuditCount;
						this.waitVisitCount = res.data.data.waitVisitCount;
						this.myGuest = res.data.data.myGuest;
						this.myInvite = res.data.data.myInvite;
						this.myVisit = res.data.data.myVisit;
					}
				}).catch(res => {
					this.$toast.clear();
					this.finished = false;
					this.loading=false;
				});
			},
			/*loadmore*/
			onLoadBottom() {
				this.finished = true;
				this.$axios({
					method: 'post',
					url: '/guest/appointment/record',
					data: {
						openId: this.$openId,
						index: 0,
						pageSize: 10,
						pageNumber: this.pageNumber,
					},
				}).then(res => {
					setTimeout(() => {
						this.loading = false;
						if(res.data.code == 200) {
							this.finished = false;
							this.pageNumber += 1;
							if(res.data.data.list.length < 10) {
								this.finished = true;
								this.nomore = true;
							} else {
								this.nomore = false;
							}
							this.recordList = this.recordList.concat(res.data.data.list);
						}
					}, 1000);
				}).catch(res => {
					this.finished = false;
				});
			},
			onRefresh() {
				setTimeout(() => {
					this.pageNumber = 1;
					this.isLoading = false;
					this.pageNumber = 1;
					this.init();
					this.initList();
				}, 500);

			},
			/*改期*/
			handle_othertime_box_show(item) {
				this.othertimeBoxShow = true;
				this.updateTimeId = item.id;
				this.othertimeSelectDate = item.visitStartTime.slice(0, 10);
				this.othertimeStartTime = item.visitStartTime.slice(11, 16);
			},
			/*拒绝*/
			handle_refuse_box_show(id) {
				this.refuseId = id;
				this.refuseBoxShow = true;
			},
			/*显示二维码*/
			handle_qrcode_box_show(id) {
				this.qrcodeId = id;
			},

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	@import "../../assets/scss/visitorCenter";
</style>