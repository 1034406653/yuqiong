<template>
	<div class="meetingMy">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingMy_main">
			<van-tabs v-model="navActive" @click="handle_navChange">
				<van-tab title="我发起的" name="sponsor">我发起的</van-tab>
				<van-tab title="我收到的" name="receive">我收到的</van-tab>
			</van-tabs>
			<div class="meetingRecord" v-if='meetingRecord.length>0'>
				<van-list v-model="loading" :finished="finished" finished-text="" @load="onLoadBottom">
					<ul>
						<li v-for="(item,index) in meetingRecord" @click="handle_nav_details(item.id)">
							<div class="time">
								{{item.displayTime}}
							</div>
							<div class="card">
								<div class="text">
									<p>会议日期：{{item.time.split(' ')[0]}}</p>
									<p>会议时间：{{item.time.split(' ')[1]}}</p>
									<p>会议主题：{{item.subject}}</p>
									<p>会议地点：{{item.address}}</p>
									<p>发起人：{{item.sponsorName}}</p>
								</div>
								<div class="status">
									<span class="status0" v-if='item.status==0'>待开始</span>
									<span class="status1" v-if='item.status==1'>会议中</span>
									<span v-if='item.status==2'>已结束</span>
									<span v-if='item.status==3'>已取消</span>
									<span class="status4" v-if='item.status==4'>待接受</span>
									<span v-if='item.status==5'>已拒绝</span>
								</div>
								<div class="card_btn" v-if='item.status==0' @click.stop="handle_qrcode_show(item)">
									签到
								</div>
								<div class="card_btn" v-if='item.status==1' @click.stop="handle_qrcode_show(item)">
									通行码
								</div>
								<div class="card_btn" v-if='item.status==4'>
									<span @click.stop="handle_deal(item.id,2)">拒绝</span>
									<b></b>
									<span @click.stop="handle_deal(item.id,1)">接受</span>
								</div>
							</div>
						</li>
					</ul>
				</van-list>
				<p class="nomore" v-if='nomore'>没有更多了~</p>
			</div>
			<div class="nodata" v-if='meetingRecord.length<1 && inited'>
				<img src="@/assets/img/meeting/nodata.png" />
				<p>暂无记录</p>
			</div>
		</div>
		<div class="shadow_meeting" v-if="qrcodeShow" @click="handle_qrcode_hide"></div>
		<div class="qrcode_modal" v-if="qrcodeShow">
			<p class="title">{{qrcodeName}}</p>
			<div class="qrcode_image_box">
				<div ref="qrCode"></div>
			</div>
			<p class="time_title">签到时间：</p>
			<p class="time_value">{{qrcodeTime}}</p>
		</div>
	</div>
</template>
<script>
	import HeaderNav from '../common/headerNav'
	import Vue from 'vue';
	import { Tab, Tabs, List } from 'vant';
	Vue.use(Tab).use(Tabs);
	Vue.use(List);
	export default {
		name: 'MeetingMy',
		data() {
			return {
				inited: false,
				loading: false,
				finished: false,
				nomore: false,
				navActive: 'a',
				meetingRecord: [],
				pageSize: 10,
				pageNumber: 1,
				//	状态(0待开始，1会议中，2已结束，3已取消)
				qrcodeShow: false,
				qrcodeName: '',
				qrcodeTime: '',

			}
		},
		components: {
			HeaderNav
		},
		created() {
			this.initList();
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			initList() {
				this.inited = false;
				this.meetingRecord = [];
				let url = 'meeting/mySponsor';
				this.pageNumber = 1;
				if(this.navActive == 'receive') url = 'meeting/myAccept'
				this.$toast.loading({
					duration: 0,
					message: '加载中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: url,
					data: {
						openId: this.$openId,
						pageSiz: this.pageSize,
						pageNumber: this.pageNumber,
					},
				}).then(res => {
					console.log(res)
					this.$toast.clear();
					if(res.data.code == 200) {
						this.loading = false;
						this.meetingRecord = res.data.data;
						if(res.data.data.length == 0) {
							this.inited = true;
						}
						if(res.data.data.length < 3) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.nomore = false;
							this.finished = false;
						}
						this.pageNumber += 1;
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.loading = false;
					this.finished = true;
					this.$toast('系统出错了');
					this.$toast.clear();
				});
			},
			handle_navChange() {
				this.initList();
			},
			onLoadBottom() {
				this.finished = true;
				let url = 'meeting/mySponsor';
				if(this.navActive == 'receive') url = 'meeting/myAccept'
				this.$axios({
					method: 'post',
					url: url,
					data: {
						openId: this.$openId,
						pageSiz: this.pageSize,
						pageNumber: this.pageNumber,
					},
				}).then(res => {
					console.log(res)
					this.$toast.clear();
					if(res.data.code == 200) {
						if(res.data.data.length < 10) {
							this.finished = true;
							this.nomore = true;
							this.loading = false;
						} else {
							this.nomore = false;
							this.finished = false;
							this.loading = false;
							this.pageNumber += 1;
						}

						this.meetingRecord = this.meetingRecord.concat(res.data.data);
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.loading = false;
					this.finished = true;
					this.$toast('系统出错了');
					this.$toast.clear();
				});

			},
			
			handle_qrcode_show(item) {
				this.qrcodeName = item.name || "三牧";
				this.qrcodeTime = item.time;
				this.qrcodeShow = true;
				this.$nextTick(() => {
					this.qrcode = new QRCode(this.$refs.qrCode, {
						width: 500,
						height: 500,
					});
					this.qrcode.makeCode(item.barcode);
				})
			},
			handle_qrcode_hide() {
				this.qrcodeShow = false;
			},
			handle_deal(id, status) {
				if(status == 1) {
					this.dealConfirm(id, status);
				} else {
					this.$dialog.confirm({
						message: '确定拒绝参加本次会议？',
					}).then(() => {
						this.dealConfirm(id, status);
					}).catch(() => {
						// on cancel
					});
				}
			},
			dealConfirm(id, status) {
				this.$toast.loading({
					duration: 0,
					message: '提交中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: 'meeting/acceptOrReject',
					data: {
						openId: this.$openId,
						recordId: id,
						accept: status,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$toast(res.data.data.msg)
							this.initList();
						} else {
							this.$toast(res.data.data.msg)
						}
					} else {
						this.$toast(res.data.msg)
					}
				}).catch(res => {
					this.$toast.clear();
				});
			},
			handle_nav_details(id){
				this.$router.push({
					path:'/meeting/details',
					query:{
						id:id,
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingMy";
</style>