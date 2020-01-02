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
					<p class="right_p">{{pBook.startTime || '请选择会议开始时间'}}</p>
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>会议结束时间：</span>
				</div>
				<div class="right_item" @click="handle_endTime_show">
					<p class="right_p">{{pBook.endTime || '请选择会议结束时间'}}</p>
				</div>
			</div>
			<div class="marginBottom40"></div>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>会议主题：</span>
				</div>

				<div class="right_item">
					<input type="text" class="right_input" v-model="pBook.meetingTitle" placeholder="请输入" />
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>会议参与人：</span>
				</div>
				<div class="right_item" @click="handle_nav_peopelSelect">
					<p class="right_p"><span v-for="(item,index) in pBook.participantList" v-if='index<2'>{{item.name}}<span v-if="index<pBook.participantList.length-1&&index!=1">,</span></span><span v-if="pBook.participantList.length>2">等</span><span v-if="pBook.participantList.length<1">请选择</span></p>
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<span>外部参与人数：</span>
				</div>
				<div class="right_item" style="display: flex;justify-content: flex-end;">
					<van-stepper v-model="pBook.outParticipant" input-width="40px" button-size="32px" :min='0' />
				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<span>提醒：</span>
				</div>
				<div class="right_item" @click="handle_remind_show">
					<p class="right_p">{{pBook.remind}}</p>
					<i></i>
				</div>
			</div>
			<b class="borde"></b>
			<div class="fileList_box">
				<div class="label">
					<span>会议文件：</span>
				</div>
				<div class="fileList">
					<ul>
						<li v-for='(item,index) in pBook.fileList'>						
							<div class="main">
								<img :src="item.fileUrl" v-if="item.fileType=='image'"/>
								<img src="@/assets/img/meeting/ppt.png" v-if="item.fileType=='application/vnd.openxmlformats-officedocument.presentationml.presentation'"/>
								<img src="@/assets/img/meeting/excel.png" v-if="item.fileType=='application/vnd.ms-excel'"/>
								<img src="@/assets/img/meeting/word.png" v-if="item.fileType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'"/>
								<div class="information">
									<p>{{item.fileName}}</p>
									<p>{{(item.fileSize/1024).toFixed(2)}}KB</p>
								</div>
							</div>
							<div class="del_btn" @click="handle_file_delete(index)">
								删除
							</div>
						</li>
					</ul>
					<div class="add_btn">
						<img src="@/assets/img/meeting/addBtn.png" />
						<input ref="inputer" type="file" @change="handleFileChange($event)" />
					</div>

				</div>
			</div>
			<b class="borde"></b>
			<div class="input_box">
				<div class="label">
					<span>备注：</span>
				</div>
				<div class="right_item">
					<input type="text" class="right_input" v-model="pBook.remark" placeholder="请输入" />
				</div>
			</div>
			<b class="borde"></b>
			<div class="check_box">
				<div class="label">
					<span>服务：</span>
				</div>
				<div class="right_item">
					<div v-for='(item,index) in pBook.serviceList' @click="handle_service_click(index)">
						<img src="@/assets/img/meeting/uncheck.png" v-if="!item.active" />
						<img src="@/assets/img/meeting/checked.png" v-if="item.active" />
						<span>{{item.serviceName}}(¥{{item.price}}/人)</span>
					</div>
				</div>
			</div>
		</div>
		<div class="totalFee">预计费用：{{expectFee}}元</div>
		<div class="btn_box">
			<ColorBtn @handleBtnClick="handle_submit()" :btnClassName.sync='btnClassName'>提交</ColorBtn>
		</div>
		<div v-if="dayShow" @touchmove.prevent>
			<van-popup v-model="dayShow" position="bottom">
				<van-picker show-toolbar :columns="pBook.dayList" :default-index="dayIndex" @confirm='handle_day_confirm' @cancel='dayShow=false' />
			</van-popup>
		</div>
		<div v-if="startTimeShow" @touchmove.prevent>
			<van-popup v-model="startTimeShow" position="bottom">
				<van-datetime-picker v-model="startTimePicker" type="time" @confirm='handle_startTime_confirm' @cancel='startTimeShow=false' :filter="filterStart" />
			</van-popup>
		</div>
		<div v-if="endTimeShow" @touchmove.prevent>
			<van-popup v-model="endTimeShow" position="bottom">
				<van-datetime-picker v-model="endTimePicker" type="time" @confirm='handle_endTime_confirm' @cancel='endTimeShow=false' :filter="filterEnd" />
			</van-popup>
		</div>
		<div v-if="remindShow" @touchmove.prevent>
			<van-popup v-model="remindShow" position="bottom">
				<van-picker show-toolbar :columns="remindList.label" @cancel="remindShow = false" @confirm="handle_remind_confirm" :default-index="remindIndex" />
			</van-popup>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import ColorBtn from '../common/colorBtn'
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
			ColorBtn
		},
		data() {
			return {
				/*日期选择*/
				dayShow: false,
				dayIndex: 0,
				/*时间段*/
				startTimeShow: false,
				startTimePicker: "",
				endTimeShow: false,
				endTimePicker: "",
				/*提醒时长设置*/
				remindList: {
					'label': ['不提醒', '提前5分钟', '提前10分钟', '提前15分钟', '提前20分钟', '提前25分钟', '提前30分钟'],
					'value': [0, 5, 10, 15, 20, 25, 30],
				},
				remindShow: false,
				remindPicker: "不提醒",
				remindIndex: 0,
				/*session保存参数*/
				pBook: {
					configStart: '00',
					configEnd: '00',
					openWeek: '',
					roomPrice: '',
					dayList: [],
					meetingId: '',
					name: '',
					day: '',
					startTime: "",
					endTime: "",
					meetingTitle: '',
					participantList: [],
					outParticipant: 0,
					remind: '不提醒',
					expectFee: 0,
					remark: '',
					fileList: [],
					serviceList: [],
				},
				expectFee: 0,
				/*提交参数*/
				postBook: {
					meetingId: '',
					day: '',
					hour: '',
					meetingTitle: '',
					participantIds: '',
					outParticipant: 0,
					remindMinute: 0,
					expectFee: 0,
					remark: '',
					fileList: [],
					serviceList: [],
				},
				/*按钮*/
				btnClassName: "colorBtnBlue",
			}
		},
		beforeRouteEnter(to, from, next) {
			if(from.path != '/meeting/participant') {
				console.log('000')
				window.sessionStorage.removeItem("meetingBook");
			}
			next();
		},
		watch: {
			pBook: {
				handler(val, oldVal) {
					this.priceChange()
				},
				deep: true
			}
		},
		created() {
			if(sessionStorage.getItem("meetingBook")) {
				this.pBook = JSON.parse(sessionStorage.getItem("meetingBook"));
			} else if(sessionStorage.getItem("meetingRoomIdDay")) {
				let ronterJson = JSON.parse(sessionStorage.getItem("meetingRoomIdDay"));
				this.pBook.meetingId = ronterJson.id;
				this.pBook.day = ronterJson.day || '';
				this.init();
				this.initService();
			} else {
				this.$router.push('/meeting/roomList')
			}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
			init() {
				this.$axios({
					method: 'post',
					url: 'meeting/detail',
					data: {
						meetingId: this.pBook.meetingId,
						day: this.pBook.day,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.pBook.name = res.data.data.name;
						this.pBook.roomPrice = res.data.data.price;
						this.pBook.openWeek = res.data.data.openWeek;
						this.pBook.configStart = res.data.data.startTime.split(':')[0];
						this.pBook.configEnd = res.data.data.endTime.split(':')[0];
						this.initSelectDate();
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.$toast('系统出错了');
				});
			},
			initService() {
				this.$axios({
					method: 'post',
					url: 'meeting/service',
					data: {
						meetingId: this.pBook.meetingId,
					},
				}).then(res => {
					if(res.data.code == 200) {
						res.data.data.forEach((x, i) => {
							if(x.status) {
								this.pBook.serviceList.push({
									'serviceName': x.serviceName,
									'price': x.price,
									'active': false,
									'serviceId': x.id
								})
							}
						})
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
							this.pBook.openWeek.split(',').forEach((y, j) => {
								if(y == dateWeek) {
									let id = this.pBook.dayList.length;
									this.pBook.dayList.push({
										text: dateValue,
										id: id,
										active: active,
									});
								}
							})
						}
						let hasActive = false;
						this.pBook.dayList.forEach((x, i) => {
							if(x.active) {
								hasActive = true;
								this.dayIndex = i;
							}
						})
						if(!hasActive) {
							this.dayIndex = this.pBook.dayList[0].id;
						}
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
				this.startTimePicker = this.pBook.startTime;
				this.startTimeShow = true;
			},
			handle_startTime_confirm(val) {
				let sh = val.split(':')[0];
				let sm = val.split(':')[1];
				let eh = this.pBook.endTime.split(':')[0];
				let em = this.pBook.endTime.split(':')[1];
				if(parseInt(sh) > parseInt(eh)) return this.$toast('会议开始时间不能比结束时间晚')
				if(parseInt(sh) == parseInt(eh) && parseInt(sm) >= parseInt(em)) return this.$toast('会议开始时间不能比结束时间晚')
				this.pBook.startTime = val;
				this.startTimePicker = val;
				this.startTimeShow = false;

			},
			handle_endTime_show() {
				this.endTimePicker = this.pBook.endTime;
				this.endTimeShow = true;
			},
			handle_endTime_confirm(val) {
				let sh = this.pBook.startTime.split(':')[0];
				let sm = this.pBook.startTime.split(':')[1];
				let eh = val.split(':')[0];
				let em = val.split(':')[1];
				if(parseInt(sh) > parseInt(eh)) return this.$toast('会议结束时间不能比开始时间早')
				if(parseInt(sh) == parseInt(eh) && parseInt(sm) >= parseInt(em)) return this.$toast('会议结束时间不能比开始时间早')
				this.pBook.endTime = val;
				this.endTimePicker = val;
				this.endTimeShow = false;
			},
			timeCheck() {
				if(this.pBook.endTime && this.pBook.startTime) {
					let sh = this.pBook.startTime.split(':')[0];
					let sm = this.pBook.startTime.split(':')[0];
					let eh = this.pBook.endTime.split(':')[0];
					let em = this.pBook.endTime.split(':')[1];
					if(parseInt(sh) > parseInt(eh)) return '会议结束时间不能比开始时间早'
					if(parseInt(sh) == parseInt(eh) && parseInt(sm) >= parseInt(em)) return '会议结束时间不能比开始时间早'
				}
				return false;
			},
			/*提醒时间设置*/
			handle_remind_show() {
				this.remindList.label.forEach((x, i) => {
					if(this.pBook.remind == x) {
						this.remindIndex = i;
					}
				})
				this.remindPicker = this.pBook.remind;
				this.remindShow = true;
			},
			handle_remind_confirm(value, index) {
				this.pBook.remind = value;
				this.remindShow = false;
			},
			filterStart(type, options) {
				if(type === 'hour') {
					let eH = 23;
					if(this.pBook.endTime) {
						eH = this.pBook.endTime.split(':')[0];
					}
					return options.filter(option => parseInt(option) >= parseInt(this.pBook.configStart) && parseInt(option) <= parseInt(this.pBook.configEnd) && parseInt(option) <= parseInt(eH));
				}
				if(type === 'minute') {

					return options.filter(option => option % 30 === 0)
				}
				return options;
			},
			filterEnd(type, options) {
				if(type === 'hour') {
					let sH = 0;
					if(this.pBook.startTime) {
						sH = this.pBook.startTime.split(':')[0];
					}
					return options.filter(option => parseInt(option) >= parseInt(this.pBook.configStart) && parseInt(option) <= parseInt(this.pBook.configEnd) && parseInt(option) >= parseInt(sH));
				}
				if(type === 'minute') {
					return options.filter(option => option % 30 === 0)
				}
				return options;
			},
			handle_nav_peopelSelect() {
				sessionStorage.setItem('meetingBook', JSON.stringify(this.pBook));
				this.$router.push('/meeting/participant')
			},
			handleFileChange(event) {
				let file = event.currentTarget.files[0];
				console.log(file);
				let param = new FormData();
				param.append('file', file)
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				}
				let postFileUrl = this.$baseURL + 'meeting/file/upload';				
				this.$toast.loading({
					duration: 0,
					message: '上传中...',
					forbidClick: true,
				});
				this.$axios.post(postFileUrl, param, config)
					.then(res => {
						if(res.data.code==200){
							let dJson=res.data.data;
							let type= res.data.data.fileType.split('/')[0]=='image'?'image':res.data.data.fileType;							
							this.pBook.fileList.push({'fileUrl':dJson.fileUrl,'fileSize':dJson.fileSize,'fileName':dJson.fileName,'fileType':type})
						}
						this.$toast.clear();
					}).catch(err => {
						this.$toast.clear();
						console.log(err);
					})
			},
			handle_file_delete(index){
				this.pBook.fileList.splice(index,1)
			},
			handle_service_click(index) {
				this.pBook.serviceList.forEach((x, i) => {
					if(i == index) {
						x.active = !x.active;
					}
				})
			},
			priceChange() {
				this.expectFee = 0;
				/*会议室费用*/
				if(this.pBook.startTime && this.pBook.endTime) {
					let sH = parseInt(this.pBook.startTime.split(':')[0]) || 0;
					let sM = parseInt(this.pBook.startTime.split(':')[1]) || 0;
					let eH = parseInt(this.pBook.endTime.split(':')[0]) || 0;
					let eM = parseInt(this.pBook.endTime.split(':')[1]) || 0;
					let num = (eH - sH) * 2 + (eM - sM) / 30;
					this.expectFee += num * parseInt(this.pBook.roomPrice);
				}
				/*增值服务费*/
				if(this.pBook.serviceList) {
					this.pBook.serviceList.forEach((x, i) => {
						if(x.active) {
							this.expectFee += x.price * (this.pBook.outParticipant + this.pBook.participantList.length);
						}
					})
				}
			},
			handle_submit(){				
				if(!this.pBook.day) return this.$toast('请选择开会日期');
				if(!this.pBook.startTime) return this.$toast('请选择会议开始时间');
				if(!this.pBook.endTime) return this.$toast('请选择会议结束时间');
				let eh = this.pBook.endTime.split(':')[0];
				let em = this.pBook.endTime.split(':')[1];
				if(em=='30'){
					em='29'
				}else{
					em='59'
					eh=checktime(parseInt(eh)-1)
				}
				let hour = this.pBook.startTime + ':00~' + eh + ':' + em + ':59'
				if(!this.pBook.meetingTitle) return this.$toast('请输入会议主题');
				if(this.pBook.meetingTitle.length>20) return this.$toast('会议主题长度不超过20个字符');
				if(this.pBook.participantList.length<1) return this.$toast('请选择会议参与人');
				let remindMinute=0;
				this.remindList.label.forEach((x, i) => {
					if(this.pBook.remind == x) {
						remindMinute=this.remindList.value[i];
					}
				})
				if(this.pBook.remark.length>50) return this.$toast('备注长度不超过50个字符');
				let serviceList=[];
				this.pBook.serviceList.forEach((x,i)=>{
					if(x.active){
						serviceList.push({'serviceName':x.serviceName,'price':x.price,'serviceId':x.serviceId})
					}
				})
				
				this.$toast.loading({
					duration: 0,
					message: '提交中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: 'meeting/order',
					data: {
						openId: this.$openId,
						meetingId:this.pBook.meetingId,
						day:this.pBook.day,
						hour:hour,
						meetingTitle:this.pBook.meetingTitle,
						participantIds:this.pBook.participantList,
						outParticipant:this.pBook.outParticipant,
						remindMinute:this.pBook.remindMinute,
						expectFee:this.expectFee,
						remark:this.pBook.remark,
						serviceList:this.serviceList,
						fileList:this.pBook.fileList,
					},
				}).then(res => {
					console.log(res)
					this.$toast.clear();
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$router.push({
								path: "/hint",
								query: {
									type: "meetingBookSuccess"
								}
							})
						}else {
							this.$toast(res.data.data.msg);
						}
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.$toast.clear();
				});

			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingBook";
</style>