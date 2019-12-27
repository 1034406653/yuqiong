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
					<li v-for="item in assort">{{item}}</li>
					<li>{{room.maxNumber}}人</li>
				</ul>
			</div>
			<div class="book_information">
				<div class="title">
					预订情况
				</div>
				<div class="select_date">
					<div class="select_date_list">
						<ul ref='dateList'>
							<li :class="[item.active?'active':'','clearfloat']" v-for="item in dateSelectList" ref='dateItem' @click="handle_dateSelect_change(item.id)">
								<p v-if="item.id==0">今天</p>
								<p v-else-if="item.id==1">明天</p>
								<p v-else>{{item.text2}}</p>
								<p>{{item.text3}}</p>
							</li>
						</ul>
					</div>
					<img src="@/assets/img/meeting/icon_calendar.png" @click="handle_dateSelectShow" />
				</div>
				<div class="room_status">
					<div class="time_line">
						<div class="bg_box">
							<div class="bg">

							</div>
						</div>
						<div class="time_list">
							<ul>
								<li v-for="item in status.time">{{item.hour}}:{{item.minute}}</li>
							</ul>
						</div>

					</div>
					<div class="time_line">
						<div class="bg_box">
							<div class="bg">

							</div>
						</div>
						<ul class="time_list">
							<li></li>
						</ul>
					</div>
				</div>
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
	import Vue from 'vue';
	import { Popup, Picker } from 'vant';
	Vue.use(Popup);
	Vue.use(Picker);
	export default {
		name: 'MeetingRoomDetails',
		data() {
			return {
				room: {},
				assort: [],
				dateSelectShow: false,
				dateIndex: 0,
				dateSelectList: [],
				startTime: '00:00',
				enTime: '24:00',
				status: {
					time: [],
				}
			}
		},
		components: {
			HeaderNav,
		},
		created() {
			if(sessionStorage.getItem("meetingRoomlist")) {
				let ronterJson = JSON.parse(sessionStorage.getItem("meetingRoomlist"));
				this.room.id = ronterJson.id;
				this.room.day = ronterJson.day || '';
				this.init();
			} else {
				this.$rounter.push('/meeting/roomList')
			}
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			init() {
				/*会议室信息*/
				this.$axios({
					method: 'post',
					url: 'meeting/detail',
					data: {
						meetingId: this.room.id,
						day: '',
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.room = res.data.data;
						this.assort = res.data.data.assort.split(',');
						this.initRoomStatus();
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.$toast('系统出错了');
				});
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
							let day = newDate.getDate();
							let dateDay = checktime(month) + '.' + checktime(day);
							let dateWeek = '';
							let dateValue = year + '-' + checktime(month) + '-' + checktime(day);
							let active = false;
							if(i == 0) {
								active = true;
							}
							let week = newDate.getDay();
							switch(week) {
								case 0:
									dateWeek = '周天';
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
							console.log(this.dateSelectList)
						}
					}
				}).catch(res => {
					console.log(res)
				});
			},
			initRoomStatus() {
				let sHour = this.room.startTime.split(":")[0] || 0;
				sHour = parseInt(sHour);
				let sMinute = this.room.startTime.split(":")[1] || 0;
				sMinute = parseInt(sMinute);
				let eHour = this.room.endTime.split(":")[0] || 0;
				eHour = parseInt(eHour);
				let eMinute = this.room.endTime.split(":")[1] || 0;
				eMinute = parseInt(eMinute);
				for(let i = sHour; i <= eHour; i++) {
					if(i == sHour) {
						if(sMinute < 30) {
							this.status.time.push({
								'hour': checktime(sHour),
								'minute': '00'
							})
						}
						this.status.time.push({
							'hour': checktime(sHour),
							'minute': '30'
						})
					} else if(i == eHour) {
						this.status.time.push({
							'hour': checktime(eHour),
							'minute': '00'
						})
						if(eMinute > 30) {
							this.status.time.push({
								'hour': checktime(eHour),
								'minute': '30'
							})
						}
					} else {
						this.status.time.push({
							'hour': checktime(i),
							'minute': '00'
						})
						this.status.time.push({
							'hour': checktime(i),
							'minute': '30'
						})
					}
				}
				console.table(this.status.time)
			},
			handle_dateSelectShow() {
				this.dateSelectShow = true;
			},
			handle_dateSelect_change(id) {
				this.dateSelectList.forEach((x, i) => {
					if(id == i) {
						x.active = true;
					} else {
						x.active = false;
					}
				})
				this.dateIndex = id;
				this.dateSelectShow = false;
			},
			handle_date_confirm(value) {
				this.handle_dateSelect_change(value.id);
			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingRoomDetails";
</style>