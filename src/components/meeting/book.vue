<template>
	<div class="meetingBook">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingBook_main">
			<div class="input_box">
				<div class="label">
					<span>会议室名称：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{pBook.name}}</p>
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>开会日期：</span>
				</div>
				<div class="right_item" @click="handle_day_show">
					<p class="right_p">{{pBook.day || '请选择开会日期'}}</p>
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>会议开始时间：</span>
				</div>
				<div class="right_item" @click="handle_startTime_show">
					<p class="right_p">{{startTime || '请选择会议开始时间'}}</p>
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box" style="margin-bottom: 40px;">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>会议结束时间：</span>
				</div>
				<div class="right_item" @click="handle_endTime_show">
					<p class="right_p">{{endTime || '请选择会议结束时间'}}</p>
				</div>
			</div>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>会议主题：</span>
				</div>

				<div class="right_item">
					<input type="text" class="right_input" placeholder="请输入" />
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>会议参与人：</span>
				</div>
				<div class="right_item">
					<p class="right_p">请选择</p>
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<span>外部参与人数：</span>
				</div>
				<div class="right_item">
					<van-stepper v-model="value" input-width="40px" button-size="32px" :min='0' :show-plus='stepperShow'/>
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<span>提醒：</span>
				</div>
				<div class="iput_item">
					<p>提前10分钟</p>
					<i></i>
				</div>
			</div>
		</div>
		<div v-if="dayShow" @touchmove.prevent>
			<van-popup v-model="dayShow" position="bottom">
				<van-picker show-toolbar :columns="dayList" :default-index="dayIndex" @confirm='handle_day_confirm' @cancel='dayShow=false' />
			</van-popup>
		</div>
		<div v-if="startTimeShow" @touchmove.prevent>
			<van-popup v-model="startTimeShow" position="bottom">
				<van-datetime-picker v-model="startTimePicker" type="time" @confirm='handle_startTime_confirm' @cancel='startTimeShow=false' :filter="filter" />
			</van-popup>
		</div>
		<div v-if="endTimeShow" @touchmove.prevent>
			<van-popup v-model="endTimeShow" position="bottom">
				<van-datetime-picker v-model="endTimePicker" type="time" @confirm='handle_endTime_confirm' @cancel='endTimeShow=false' :filter="filter" />
			</van-popup>
		</div>

	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import Vue from 'vue';
	import { Popup, Picker, DatetimePicker, Stepper } from 'vant';
	Vue.use(Popup);
	Vue.use(Picker);
	Vue.use(DatetimePicker);
	Vue.use(Stepper);
	export default {
		name: 'MeetingBook',
		components: {
			HeaderNav,
		},
		data() {
			return {
				/*设置信息*/
				openWeek: '',
				aaa: '0',
				/*日期选择*/
				dayShow: false,
				dayList: [],
				dayIndex: 0,
				/*时间段*/
				startTimeShow: false,
				startTimePicker: "00:00",
				startTime: "00:00",
				endTimeShow: false,
				endTimePicker: "23:59",
				endTime: "23:59",
				stepperShow:true,
				pBook: {
					id: '',
					name: '',
					timeStart: '12:00',
					endStart: '12:00',
				},
			}
		},
		created() {
			if(sessionStorage.getItem("meetingRoomlist")) {
				let ronterJson = JSON.parse(sessionStorage.getItem("meetingRoomlist"));
				console.log(ronterJson)
				this.pBook.id = ronterJson.id;
				this.pBook.day = ronterJson.day || '';
				this.init(this.pBook.day);
				console.log(this.pBook)
			} else {
				this.$rounter.push('/meeting/roomList')
			}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
			init(day) {
				this.$axios({
					method: 'post',
					url: 'meeting/detail',
					data: {
						meetingId: this.pBook.id,
						day: day,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.pBook.name = res.data.data.name;
						this.openWeek = res.data.data.openWeek;
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
							let dateWeek = '';
							let dateValue = year + '-' + checktime(month) + '-' + checktime(day);
							if(dateValue == this.pBook.day) {
								this.pBook.day = dateValue;
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
							this.openWeek.split(',').forEach((y, j) => {
								if(y == dateWeek) {
									let id = this.dayList.length;
									this.dayList.push({
										text: dateValue,
										id: id,
										active: active,
									});
								}
							})
						}
						let hasActive = false;
						this.dayList.forEach((x, i) => {
							if(x.active) {
								hasActive = true;
								this.dayIndex = i;
							}
						})
						if(!hasActive) {
							this.pBook.day = this.dayList[0].text;
							this.dayIndex = this.dayList[0].id;
						}
						console.log(this.dayIndex)
					}
				}).catch(res => {
					console.log(res)
				});
			},
			handle_day_show() {
				this.dayShow = true;
			},
			handle_day_confirm(value) {
				this.pBook.day = value.text;
				this.dayIndex = value.id;
				this.dayShow = false;
			},
			/*访问时间段*/
			handle_startTime_show() {
				this.startTimePicker = this.startTime;
				this.startTimeShow = true;
			},
			handle_startTime_confirm(val) {
				this.startTime = val;
				this.startTimePicker = val;
				this.startTimeShow = false;
			},
			handle_endTime_show() {
				this.endTimePicker = this.endTime;
				this.endTimeShow = true;
			},
			handle_endTime_confirm(val) {
				this.endTime = val;
				this.endTimePicker = val;
				this.endTimeShow = false;
			},
			filter(type, options) {
				if(type === 'minute') {
					return options.filter(option => option % 30 === 0)
				}
				return options;
			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingBook";
</style>