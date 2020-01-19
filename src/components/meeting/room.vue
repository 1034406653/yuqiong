<template>
	<div class="meetingRoomDetails">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingRoomDetails_main">
			<div class="room_information">
				<img :src="room.photo" class="pic" />
				<div class="top">
					<div class="left">
						<p class="p1">{{room.name}}</p>
						<p class="p2">{{room.address}}</p>
					</div>
					<div class="right">
						￥{{room.price}}/半小时
					</div>
				</div>
				<ul class="assort">
					<li v-for="item in assort" v-if='item'>{{item}}</li>
					<li>{{room.maxNumber}}人</li>
				</ul>
			</div>
			<div class="book_information">
				<div class="title">
					<div class="text">
						预订情况
					</div>
					<div class="label">
						<p><b class="colorGreen"></b><span>已预订</span></p>
						<p><b class="colorYellow"></b><span>会议中</span></p>
					</div>
				</div>
				<div class="select_date">
					<div class="select_date_list">
						<ul ref='dateList'>
							<li :class="[item.active?'active':'','clearfloat']" v-for="item in dateSelectList" ref='dateItem' @click="handle_dateSelect_change(item.id)">
								<p>{{item.text2}}</p>
								<p>{{item.text3}}</p>
							</li>
						</ul>
					</div>
					<img src="@/assets/img/meeting/icon_calendar.png" @click="handle_dateSelectShow" />
				</div>
				<div class="room_status">
					<div class="time_line">
						<ul>
							<li v-for="item in statusList" v-if='item.hour<12'>
								<div class="bg">
									<div class="book_bg" v-if='item.status==0'></div>
									<div class="ing_bg" v-if='item.status==1'></div>
								</div>
								<div class="time" v-if="item.minute=='00'">{{item.hour}}:{{item.minute}}</div>
							</li>
						</ul>
					</div>
					<div class="time_line">
						<ul>
							<li v-for="item in statusList" v-if='item.hour>=12'>
								<div class="bg">
									<div class="book_bg" v-if='item.status==0'></div>
									<div class="ing_bg" v-if='item.status==1'></div>
								</div>
								<div class="time" v-if="item.minute=='00'">{{item.hour}}:{{item.minute}}</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="handle_nav_book()" :btnClassName.sync='btnClassName'>立即预订</ColorBtn>
			</div>
		</div>

		<div v-if="dateSelectShow" @touchmove.prevent>
			<van-popup v-model="dateSelectShow" position="bottom">
				<van-picker show-toolbar :columns="dateSelectList" :default-index="dateIndex" @confirm='handle_date_confirm' @cancel='dateSelectShow=false' />
			</van-popup>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import ColorBtn from '../common/colorBtn'
	import Vue from 'vue';
	import { Popup, Picker } from 'vant';
	Vue.use(Popup);
	Vue.use(Picker);
	export default {
		name: 'MeetingRoomDetails',
		data() {
			return {
				/*按钮*/
				btnClassName: "colorBtnBlue",
				room: {},
				selectDay: '',
				assort: [],
				dateSelectShow: false,
				dateIndex: 0,
				dateSelectList: [],
				startTime: '00:00',
				enTime: '24:00',
				statusList: [],
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		created() {
			if(sessionStorage.getItem("meetingRoomIdDay")) {
				let ronterJson = JSON.parse(sessionStorage.getItem("meetingRoomIdDay"));
				this.room.id = ronterJson.id;
				if(ronterJson.day) {
					this.selectDay = ronterJson.day.text2;
				}
				this.init();
			} else {
				this.$rounter.push('/meeting/roomList')
			}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
			init() {
				/*会议室信息*/
				this.$axios({
					method: 'post',
					url: 'meeting/detail',
					data: {
						meetingId: this.room.id,
						day: this.selectDay,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.room = res.data.data;
						this.assort = res.data.data.assort.split(',');
						this.initSelectDate();
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.$toast('系统出错了');
				});
			},
			initSelectDate() {
				/*获取配置信息选择日期*/
				this.$axios({
					method: 'post',
					url: 'meeting/config',
					data: {
						openId: this.$openId,
					},
				}).then(res => {
					if(res.data.code == 200) {
						let maxDays = parseInt(res.data.data.subscribeMpAdvanceDays);
						for(let i = 0; i < maxDays; i++) {
							let newDate = new Date();
							newDate.setDate(newDate.getDate() + i);
							let year = newDate.getYear() + 1900;
							let month = newDate.getMonth() + 1;
							let active = false;
							let day = newDate.getDate();
							let dateDay = checktime(month) + '.' + checktime(day);
							let dateWeek = '';
							let dateValue = year + '-' + checktime(month) + '-' + checktime(day);
							if(dateValue == this.selectDay) {
								active = true;
								this.selectDay = dateValue;
							}
							let week = newDate.getDay();
							switch(week) {
								case 0:
									dateWeek = '周日';
									break;
								case 1:
									dateWeek = '周一';
									break;
								case 2:
									dateWeek = '周二';
									break;
								case 3:
									dateWeek = '周三';
									break;
								case 4:
									dateWeek = '周四';
									break;
								case 5:
									dateWeek = '周五';
									break;
								case 6:
									dateWeek = '周六';
									break;
								default:
									break;
							}
							this.room.openWeek.split(',').forEach((y, j) => {
								if(y == dateWeek) {
									let id = this.dateSelectList.length;
									this.dateSelectList.push({
										text: dateValue,
										text2: dateWeek,
										text3: dateDay,
										active: active,
										id: id,
									});
								}
							})
						}
						let hasActive = false;
						this.dateSelectList.forEach((x, i) => {
							if(x.active) {
								hasActive = true;
							}
						})
						if(!hasActive) {
							this.dateSelectList[0].active = true;
							this.selectDay = this.dateSelectList[0].text;
						}
						this.changeRoomStatus(this.selectDay);
					}
				}).catch(res => {
					console.log(res)
				});
			},
			initRoomStatus() {
				let statusList = this.timeSlice(this.room.startTime, this.room.endTime, 5);
				let orderTimeList = [];
				if(this.room.orderTimePeriodList) {
					this.room.orderTimePeriodList.forEach((x, i) => {
						if(x.status == 0) {
							orderTimeList.push(this.timeSlice(x.startTime, x.endTime, 0));
						}
						if(x.status == 1) {
							orderTimeList.push(this.timeSlice(x.startTime, x.endTime, 1));
						}
					})
				}
				statusList.forEach((a, b) => {
					orderTimeList.forEach((c, d) => {
						c.forEach((e, f) => {
							if(a.hour == e.hour && a.minute == e.minute) {
								a.status = e.status;
							}
						})
					})
				})
				this.statusList = statusList;
			},
			changeRoomStatus(day) {
				this.$axios({
					method: 'post',
					url: 'meeting/detail',
					data: {
						meetingId: this.room.id,
						day: day,
					},
				}).then(res => {
					console.log(res.data.data.orderTimePeriodList)
					if(res.data.code == 200) {
						this.room = res.data.data;
						this.initRoomStatus();
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.$toast('系统出错了');
				});
			},
			timeSlice(startTime, endTime, status) {
				let sHour = startTime.split(":")[0] || 0;
				sHour = parseInt(sHour);
				let sMinute = startTime.split(":")[1] || 0;
				sMinute = parseInt(sMinute);
				let eHour = endTime.split(":")[0] || 0;
				eHour = parseInt(eHour);
				let eMinute = endTime.split(":")[1] || 0;
				eMinute = parseInt(eMinute);
				let timeList = [];
				for(let i = sHour; i <= eHour; i++) {
					if(i == sHour && i == eHour) {
						if(sMinute == '00' && eMinute == '29') {
							timeList.push({
								'hour': checktime(i),
								'minute': '00',
								'status': status,
							})
						} else if(sMinute == '00' && eMinute == '59') {
							timeList.push({
								'hour': checktime(i),
								'minute': '00',
								'status': status,
							})
							timeList.push({
								'hour': checktime(i),
								'minute': '30',
								'status': status,
							})
						} else if(sMinute == '30' && eMinute == '59') {
							timeList.push({
								'hour': checktime(i),
								'minute': '30',
								'status': status,
							})
						}
					} else if(i == sHour && i < eHour) {
						if(sMinute == '00') {
							timeList.push({
								'hour': checktime(sHour),
								'minute': '00',
								'status': status,
							})
							timeList.push({
								'hour': checktime(i),
								'minute': '30',
								'status': status,
							})
						} else {
							timeList.push({
								'hour': checktime(i),
								'minute': '30',
								'status': status,
							})
						}

					} else if(i > sHour && i < eHour) {
						timeList.push({
							'hour': checktime(i),
							'minute': '00',
							'status': status,
						})
						timeList.push({
							'hour': checktime(i),
							'minute': '30',
							'status': status,
						})
					} else if(i > sHour && i == eHour) {
						if(eMinute == '29') {
							timeList.push({
								'hour': checktime(eHour),
								'minute': '00',
								'status': status,
							})
						} else {
							timeList.push({
								'hour': checktime(i),
								'minute': '00',
								'status': status,
							})
							timeList.push({
								'hour': checktime(i),
								'minute': '30',
								'status': status,
							})
						}
					}
				}
				return timeList;
			},
			handle_dateSelectShow() {
				this.dateSelectShow = true;
			},
			handle_dateSelect_change(id) {
				this.dateSelectList.forEach((x, i) => {
					if(id == i) {
						x.active = true;
						this.selectDay = x.text;
					} else {
						x.active = false;
					}
				})
				this.dateIndex = id;
				this.dateSelectShow = false;
				this.changeRoomStatus(this.selectDay);
			},
			handle_date_confirm(value) {
				this.handle_dateSelect_change(value.id);
			},
			handle_nav_book() {
				let meetingRoomlistJson = {};
				meetingRoomlistJson.id = this.room.id;
				if(this.selectDay) {
					meetingRoomlistJson.day = this.selectDay;
				}
				let meetingRoomlistStr = JSON.stringify(meetingRoomlistJson);
				sessionStorage.setItem("meetingRoomIdDay", meetingRoomlistStr);
				this.$router.push("/meeting/book")
			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingRoom";
</style>