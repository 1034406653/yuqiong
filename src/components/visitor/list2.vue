<template>
	<div class="listPage listPage2">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="header2">
			<ul>
				<li v-for="(item,index) in navList" :class="{active:item.active}" @click="handleNavClick(index)">
					<p>{{item.text}}</p>
					<b></b>
				</li>
			</ul>
		</div>
		<div class="box">
			<div>
				<div class="select_box" @click="handle_guest_show" v-if="navList[1].active">
					<p>{{typeValue_guest}}</p>
					<img src="@/assets/img/icon_down.png" />
				</div>
				<div class="select_box" @click="handle_visit_show" v-if="navList[2].active">
					<p>{{typeValue_visit}}</p>
					<img src="@/assets/img/icon_down.png" />
				</div>
				<div class="select_box" @click="handle_invite_show" v-if="navList[3].active">
					<p>{{typeValue_invite}}</p>
					<img src="@/assets/img/icon_down.png" />
				</div>
				<van-list class="card_list" v-model="loading" :finished="finished" finished-text="" @load="onLoadBottom">
					<Card :list='recordList' @initList='initList' @handleOthertimeBoxShow='handle_othertime_box_show($event)' @handleRefuseBoxShow='handle_refuse_box_show($event)' @handleQrcodeBoxShow='handle_qrcode_box_show($event)'></Card>
					</Card>
				</van-list>
				<p class="nomore" v-if='nomore'>没有更多了~</p>
			</div>
		</div>
		<div v-if="typeShow_guest">
			<van-popup v-model="typeShow_guest" position="bottom">
				<van-picker show-toolbar :columns="typeList_guest.cn" @cancel="typeShow_guest = false" @confirm="handle_guest_confirm" :default-index="typeList_guest_index" />
			</van-popup>
		</div>
		<div v-if="typeShow_visit">
			<van-popup v-model="typeShow_visit" position="bottom">
				<van-picker show-toolbar :columns="typeList_visit.cn" @cancel="typeShow_visit = false" @confirm="handle_visit_confirm" :default-index="typeList_visit_index" />
			</van-popup>
		</div>
		<div v-if="typeShow_invite">
			<van-popup v-model="typeShow_invite" position="bottom">
				<van-picker show-toolbar :columns="typeList_invite.cn" @cancel="typeShow_invite = false" @confirm="handle_invite_confirm" :default-index="typeList_invite_index" />
			</van-popup>
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
	import HeaderNav from '../common/headerNav'
	import Card from '../common/card'
	import OtherDay from '../common/otherDay'
	import Refuse from '../common/refuse'
	import QrcodeShow from '../common/qrcodeShow'
	import Vue from 'vue';
	import { Popup, List, Picker } from 'vant';
	Vue.use(Popup);
	Vue.use(List);
	Vue.use(Picker);
	export default {
		name: 'VisitorList2',
		components: {
			HeaderNav,
			Card,
			OtherDay,
			Refuse,
			QrcodeShow,
		},
		data() {
			return {
				nomore: false,
				loading: false,
				finished: false,
				pageNumber: 1,
				allLoaded: false,
				navList: [{
					active: true,
					text: "全部",
					value: 0,

				}, {
					active: false,
					text: "我的访客",
					value: 1,

				}, {
					active: false,
					text: "我的访问",
					value: 2,

				}, {
					active: false,
					text: "我的邀约",
					value: 3,

				}],

				typeShow_guest: false,
				typeValue_guest: "全部",
				typeList_guest: {
					'cn': ['全部', '待审核', '待访问', '访问中', '已签离', '已取消', "已超时", '已失效', "已拒绝"],
					'en': ['', 'waitaudit', 'waitvisit', 'visiting', 'out', 'cancel', "timeout", 'invalid', "refused"],
				},
				typeList_guest_index: 0,

				typeShow_visit: false,
				typeValue_visit: "全部",
				typeList_visit: {
					'cn': ['全部', '待审核', '待访问', '访问中', '已签离', '已取消', "已超时", '已失效', "已拒绝"],
					'en': ['', 'waitaudit', 'waitvisit', 'visiting', 'out', 'cancel', "timeout", 'invalid', "refused"],
				},
				typeList_visit_index: 0,

				typeShow_invite: false,
				typeValue_invite: "全部",
				typeList_invite: {
					'cn': ['全部', '待访问', '访问中', '已签离', '已取消', "已超时", '已失效'],
					'en': ['', 'waitvisit', 'visiting', 'out', "cancel", "timeout", 'invalid'],
				},
				typeList_invite_index: 0,

				adminStatus: 0,
				status: "",
				/*列表*/
				recordList: [],
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
			}
		},
		mounted() {
			let paramsId = this.$route.params.id || '';
			if(paramsId) {
				this.navList.forEach((x, i) => {
					this.typeList = this.navList[i].typeList;
					if(i == paramsId) {
						this.navList[i].active = true;
						this.adminStatus = paramsId;
						this.initList();
					} else {
						this.navList[i].active = false;
					}
				})
			} else {
				this.initList();
			}
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			handleNavClick(index) {
				this.navList.forEach((x, i) => {
					this.typeValue_visit = '全部'
					this.typeValue_invite = '全部'
					this.typeValue_guest = '全部'
					if(i == index) {
						this.adminStatus = index,
							this.status = "",
							this.navList[i].active = true;
						this.initList();
					} else {
						this.navList[i].active = false;
					}
				})

			},
			/*选择类型，我的访客*/
			handle_guest_show() {
				this.typeList_guest.en.forEach((x, i) => {
					if(this.status == x) {
						console.log(i)
						this.typeList_guest_index = i;
					}
				})
				this.typeShow_guest = true;
			},
			handle_guest_confirm(value, index) {
				this.typeValue_guest = value;
				this.status = this.typeList_guest.en[index];
				this.typeShow_guest = false;
				this.initList();
			},

			/*选择类型,我的访问*/
			handle_visit_show() {
				this.typeList_visit.en.forEach((x, i) => {
					if(this.status == x) {
						console.log(i)
						this.typeList_visit_index = i;
					}
				})
				this.typeShow_visit = true;
			},
			handle_visit_confirm(value, index) {
				this.typeValue_visit = value;
				this.status = this.typeList_visit.en[index];
				this.typeShow_visit = false;
				this.initList();
			},
			/*选择类型,我的邀约*/
			handle_invite_show() {
				this.typeList_invite.en.forEach((x, i) => {
					if(this.status == x) {
						this.typeList_invite_index = i;
					}
				})
				this.typeShow_invite = true;
			},
			handle_invite_confirm(value, index) {
				this.typeValue_invite = value;
				this.status = this.typeList_invite.en[index];
				this.typeShow_invite = false;
				this.initList();
			},
			initList() {
				this.finished = true;
				this.nomore = false;
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
						pageSize: 10,
						pageNumber: this.pageNumber,
						status: this.status,
						adminStatus: this.adminStatus,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {
						this.finished = false;
						this.recordList = res.data.data.list;
						if(res.data.data.list.length < 10) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.nomore = false;
						}
						this.pageNumber += 1;
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.finished = false;
					this.$toast.clear();
					console.log(res)
				});
			},
			onLoadBottom() {
				this.finished = true;
				this.$axios({
					method: 'post',
					url: '/guest/appointment/record',
					data: {
						openId: this.$openId,
						pageSize: 10,
						pageNumber: this.pageNumber,
						status: this.status,
						adminStatus: this.adminStatus,
					},
				}).then(res => {
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
						this.recordList = this.recordList.concat(res.data.data.list);
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.loading=false;
					this.finished = false;
					console.log(res)
				});
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
	@import "../../assets/scss/visitorList";
	.listPage2 .header2 ul li {
		float: left;
		width: 25%;
		padding-top: 0.16rem;
	}
	
	.select_box {
		width: 142px;
		height: 50px;
		background: rgba(255, 255, 255, 1);
		border-radius: 10px;
		margin: 46px 0 0 48px;
		position: relative;
		font-size: 28px;
		p {
			width: 116px;
			line-height: 50px;
		}
		img {
			width: 16px;
			height: 16px;
			position: absolute;
			right: 10px;
			top: 16px;
			right: 20px;
		}
	}
</style>