<template>
	<div class="center_page">
		<div :class="[vipActive ? 'vipActive' : '', 'header']">
			<div class="portrait" @click="$router.push('/information')">
				<img :src="$store.state.headImg" />
				<span v-if="!$store.state.employee">访客</span>
				<span v-if="$store.state.employee">员工</span>
			</div>
			<div class="information" @click="$router.push('/information')">
				<p class="p1"><span>{{$store.state.nickName || ''}}</span></p>
				<p class="p2" v-if="$store.state.userid">ID：{{$store.state.userid}}</p>
				<p class="p3"><span>资料完善</span><b><i ref='percentActive'></i></b><span class="percent">{{$store.state.percent}}</span></p>
			</div>
			<div class="unbindphone" v-if="!$store.state.bind">
				<img src="@/assets/img/head_phone.png" />
				<span v-on:click.stop="$router.push('/bindPhone')">待绑定</span>
			</div>
			<div class="qrcode" v-if="$store.state.employeeCode" @click="$router.push('/staffQrcode')"><img src="@/assets/img/head_qrcode_icon.png"/><span>员工码</span></div>
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
		<div class="part">
			<div class="title">访客服务</div>
			<ul>
				<li @click="$router.push('/visitor/list')" v-if="!$store.state.isAdmin"><img src="@/assets/img/nav_visitor_list.png" /><span>访客列表</span></li>
				<li @click="$router.push('/visitor/list2')" v-if="$store.state.isAdmin"><img src="@/assets/img/nav_visitor_list.png" /><span>访客列表</span></li>
				<li @click="$router.push('/visitor/invite')" v-if="$store.state.isAdmin"><img src="@/assets/img/nav_visitor_invite.png" /><span>我要邀约</span></li>
				<li @click="$router.push('/visitor/book')"><img src="@/assets/img/nav_visitor_book.png" /><span>我要预约</span></li>
			</ul>
		</div>
		<div class="part">
			<div class="title">停车服务</div>
			<ul>
				<li><img src="@/assets/img/nav_park_monthcard.png" /><span>月卡续费</span></li>
				<li><img src="@/assets/img/nav_park_book.png" /><span>车位预约</span></li>
				<li><img src="@/assets/img/nav_park_pay.png" /><span>停车缴费</span></li>
				<li><img src="@/assets/img/nav_park_order.png" /><span>停车订单</span></li>
				<li><img src="@/assets/img/nav_park_car.png" /><span>我的车辆</span></li>
				<li><img src="@/assets/img/nav_park_discount.png" /><span>我的优惠券</span></li>
				<li><img src="@/assets/img/nav_park_lookingfor.png" /><span>我要找车</span></li>
			</ul>
		</div>
		<div class="part">
			<div class="title">其他服务</div>
			<ul>
				<li @click="$router.push('/elevator/status')"><img src="@/assets/img/nav_elevator_status.png" /><span>电梯状态</span></li>
				<li v-if="$store.state.authElevatorVip" @click="handle_nav_elevatorBook"><img src="@/assets/img/nav_elevator_book.png" /><span>申请VIP梯</span></li>
				<li v-if="$store.state.authElevatorVip" @click="handle_nav_elevatorRecord"><img src="@/assets/img/nav_elevator_record.png" /><span>VIP梯申请记录</span></li>
				<li><img src="@/assets/img/nav_meeting_roomList.png" @click="handle_nav_meetingRoomList"/><span>会议室预约</span></li>
				<li><img src="@/assets/img/nav_meeting_my.png" @click="handle_nav_meetingMy"/><span>我的会议</span></li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { Swipe, SwipeItem } from 'vant';
	Vue.use(Swipe).use(SwipeItem);
	export default {
		name: 'Center',
		data() {
			return {
				vipActive: false,
				employeeCode: true,
				/*推送消息列表*/
				newsList: [],
			}
		},
		mounted() {
			this.init();
			this.$refs.percentActive.style.width = this.$store.state.percent;
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
					console.log(res)
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
						let employee = res.data.data.employee ? 1 : '';
						this.$store.commit('initEmployee', employee);
						let isAdmin = res.data.data.admin ? 1 : '';
						this.$store.commit('initIsAdmin', isAdmin);
						let headImg = res.data.data.headimgurl || require('@/assets/img/head_portrait.png');
						this.$store.commit('initHeadImg', headImg);
						let nickName = res.data.data.nickName || '';
						this.$store.commit('initNickName', nickName)
						let bind = res.data.data.bind ? 1 : '';
						this.$store.commit('initBind', bind)
						let elevatorVip = res.data.data.elevatorVip ? 1 : '';
						this.$store.commit('initElevatorVip', elevatorVip)
						let haveVipElevator = res.data.data.haveVipElevator ? 1 : '';
						this.$store.commit('initHaveVipElevator', haveVipElevator)
						let authElevatorVip = res.data.data.authElevatorVip ? 1 : '';
						this.$store.commit('initAuthElevatorVip', authElevatorVip)
						let userid = res.data.data.id || '';
						this.$store.commit('initUserid', res.data.data.id);
						let userPhone = res.data.data.phone || '';
						this.$store.commit('initUserPhone', userPhone)
						let company = res.data.data.company || '';
						this.$store.commit('initCompany', company);
						let realName = res.data.data.realName || '';
						this.$store.commit('initRealName', realName);
						let certificateNo = res.data.data.certificateNo || '';
						this.$store.commit('initCertificateNo', certificateNo);
						let employeeCode = res.data.data.employeeCode || '';
						this.$store.commit('initEmployeeCode', employeeCode);
						let percent = res.data.data.completePercent || '0%';
						this.$store.commit('initPercent', percent)
						this.$refs.percentActive.style.width = percent;
						/*会议室权限*/
						let haveVipMeeting = res.data.data.haveVipMeeting ? 1 : '';
						this.$store.commit('initHaveVipMeeting', haveVipMeeting)
						
						
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
			},
			handle_nav_elevatorRecord() {
				if(!this.$store.state.elevatorVip) return this.$toast('公司VIP权限未开启，请联系物业开启相应权限');
				if(!this.$store.state.haveVipElevator) return this.$toast('大楼VIP通道未开启');
				this.$router.push('/elevator/record');
				
			},
			handle_nav_elevatorBook() {
				if(!this.$store.state.elevatorVip) return this.$toast('公司VIP权限未开启，请联系物业开启相应权限');
				if(!this.$store.state.haveVipElevator) return this.$toast('大楼VIP通道未开启');
				this.$router.push('/elevator/book');				
			},
			handle_nav_meetingRoomList(){
				this.$router.push('/meeting/roomList');	
			},
			handle_nav_meetingMy(){
				this.$router.push('/meeting/my');	
			},
		}
	}
</script>
<style scoped lang="scss">
	@import "../assets/scss/center";
</style>