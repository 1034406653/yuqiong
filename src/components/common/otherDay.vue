<template>
	<div class="otherDay" @touchmove.prevent>
		<div class="shadow_lxl" v-if="boxShow"></div>
		<div class="modal_box othertime_box" v-if="boxShow">
			<div class="modal_box_title">
				<span>改期</span>
				<img src="@/assets/img/icon_close.png" @click="handle_othertime_box_hide" />
			</div>
			<div class="top_border"></div>
			<div class="part">
				<div class="select_date">
					<span>请选择访问日期</span>
					<p @click="handleDateShow"><b>{{selectDate}}</b><img src="@/assets/img/icon_otherDay.png" /></p>
				</div>
				<div class="select_time_box">
					<p class="title">请选择访问时间段</p>
					<div class="select_time">
						<div>
							<span>开始时间</span>
							<p @click="handleStartTimeShow">{{startTime}}</p>
						</div>
						<div>
							<span>结束时间</span>
							<p @click="handleEndTimeShow">{{endTime}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="part">
				<p class="title">请选择访问次数</p>
				<div class="numbers">
					<van-radio-group v-model="othertimenumbersValue">
						<van-radio v-for='(item,index) in othertimenumbersList' :name="item.value" :key='index'>{{item.label}}</van-radio>
					</van-radio-group>
				</div>
			</div>
			<div class="modal_bottom">
				<span @click="handle_othertime_box_hide">取消</span>
				<b></b>
				<span @click="handle_othertime_box_confirm" style="color: #4DA5F7;">确定</span>
			</div>
		</div>
		<van-popup v-model="dateShow" position="bottom">
			<van-datetime-picker v-model="selectDatePicker" type="date" :min-date="startDate" @confirm='handleDateConfirm' @cancel='dateShow=false' :formatter='formatter'/>
		</van-popup>
		<van-popup v-model="startTimeShow" position="bottom">
			<van-datetime-picker v-model="startTimePicker" type="time" @confirm='handleStartTimeConfirm' @cancel='startTimeShow=false' />
		</van-popup>
		<van-popup v-model="endTimeShow" position="bottom">
			<van-datetime-picker v-model="endTimePicker" type="time" @confirm='handleEndTimeConfirm' @cancel='endTimeShow=false' />
		</van-popup>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { RadioGroup, Radio, Popup, DatetimePicker } from 'vant';
	Vue.use(RadioGroup);
	Vue.use(Radio);
	Vue.use(Popup);
	Vue.use(DatetimePicker);
	export default {
		name: "OtherDay",
		props: {
			boxShow: {
				type: Boolean,
				default: false,
			},
			id: {
				type: Number,
				default: 0,
			},
			startTime: {
				type: String,
				default: '00:00',
			},
			selectDate: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				selectDatePicker: '',
				startTimePicker: '00:00',
				endTimePicker: "23:59",
				endTime: "23:59",
				othertimenumbersValue: '0',
				startDate: new Date(),
				othertimenumbersList: [{
						label: '不限',
						value: '0',
					},
					{
						label: '1次',
						value: '1'
					},
					{
						label: '2次',
						value: '2'
					},
					{
						label: '3次',
						value: '3'
					}
				],
				dateShow: false,
				startTimeShow: false,
				endTimeShow: false,
			}
		},
		watch: {
			startTime: {
				handler: function(val, oldval) {					
					let endTime = this.endTime.split(":");
					let startTime = val.split(":");
					if(parseInt(startTime[0]) > parseInt(endTime[0])) {
						this.$emit('update:startTime', oldval)
						this.$toast('开始时间必须小于结束时间');						
					} else if(parseInt(startTime[0]) == parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1])) {
						this.$emit('update:startTime', oldval)
						this.$toast('开始时间必须小于结束时间');
						
					}
				},
				deep: true
			},
			endTime: {
				handler: function(val, oldval) {					
					let startTime = this.startTime.split(":");
					let endTime = val.split(":");
					if(parseInt(startTime[0]) > parseInt(endTime[0])) {
						this.endTime = oldval;						
						this.$toast('开始时间必须小于结束时间');
					} else if(parseInt(startTime[0]) == parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1])) {
						this.endTime = oldval;
						this.$toast('开始时间必须小于结束时间');
					}
				},
				deep: true
			},
		},
		methods: {
			formatter(type, value) {　　
				if(type === 'year') {　　
					return `${value}年`;　　
				} else if(type === 'month') {　　
					return `${value}月`　　
				} else if(type === 'day') {　　
					return `${value}日`　　
				}　　
				return value;　　
			},
			handleDateShow() {
				this.selectDatePicker=new Date(this.selectDate);
				this.dateShow = true;
			},			
			handleDateConfirm(val) {
				function checktime(i) {
					if(i < 10) {
						i = "0" + i;
					}
					return i;
				}
				let year = val.getYear() + 1900;
				let month = val.getMonth() + 1;
				let day = val.getDate();
				let hour = val.getHours();
				let minute = val.getMinutes();
				this.$emit('update:selectDate', year + '-' + checktime(month) + '-' + checktime(day));				
				this.selectDatePicker =val;
				this.dateShow=false;
			},			
			handleStartTimeShow() {
				this.startTimePicker=this.startTime;
				this.startTimeShow = true;
			},
			handleStartTimeConfirm(val) {
				this.$emit('update:startTime', val)
				this.startTimeShow = false;
			},
			handleEndTimeShow() {
				this.endTimePicker=this.endTime;
				this.endTimeShow = true;
			},
			handleEndTimeConfirm(val) {
				this.endTime = val;
				this.endTimeShow = false;
			},
			handle_othertime_box_hide() {
				this.$emit('update:boxShow', false)
				this.$emit('update:startTime', "00:00")
				this.$emit('update:endTime', "23:59")
			},
			handle_othertime_box_confirm() {
				this.handle_othertime_box_hide();
				let visitStartTime = this.selectDate + ' ' + this.startTime + ":00";
				let visitEndTime = this.selectDate + ' ' + this.endTime + ":00";
				let visitTimes = parseInt(this.othertimenumbersValue);
				this.$toast.loading({
					duration: 0,
					message: '提交中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: 'guest/appointment/audit',
					data: {
						openId: this.$openId,
						id: this.id,
						audit: "updateTime",
						visitStartTime: visitStartTime,
						visitEndTime: visitEndTime,
						visitTimes: visitTimes,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$toast(res.data.data.msg);
							this.$emit('initList');
						} else {
							this.$toast(res.data.data.msg);
						}
					} else {
						this.$toast(res.data.msg);
					}

				}).catch(res => {
					this.$toast.clear();
					console.log(res)
				});
			},
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/modal_box';
</style>