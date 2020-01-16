<template>
	<div class="book_page" ref='book_page'>
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="book_page_main">
			<div class="title">
				访客信息
			</div>
			<div class="input_box">
				<span class="label_lxl">访客姓名</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pInviteData.name" />
			</div>
			<div class="input_box">
				<span class="label_lxl">访客手机</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pInviteData.phone" />
			</div>
			<div class="input_box" v-if="$store.state.needIdNumber">
				<span class="label_lxl">身份证号</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pInviteData.certificateNo" />
			</div>
			<div class="input_box" v-if="$store.state.needCompany">
				<span class="label_lxl">访客单位</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pInviteData.company" />
			</div>
			<div class="input_box" v-if="$store.state.needReason">
				<span class="label_lxl">来访事由</span>
				<div class="borde"></div>
				<div class="input_item" @click="handle_cause_show">
					<p v-if="!causeValue">请选择</p>
					<p v-if="causeValue">{{causeValue}}</p>
				</div>
			</div>

			<div class="input_box">
				<span class="label_lxl">随访人</span>
				<div class="input_item followList_item" @click="goInvite_followList"><span style="display: inline-block">{{pInviteData.followList.length}} <b>人</b></span><img src="@/assets/img/icon_next.png" class="icon_next icon_followList" /></div>
			</div>
			<div class="title">
				被访人信息
			</div>
			<div class="input_box">
				<span class="label_lxl">被访人手机</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pInviteData.receptionistPhone" />
			</div>
			<div class="input_box">
				<span class="label_lxl">被访人姓名</span>
				<div class="borde"></div>
				<p class="input_item">{{pInviteData.receptionistName}}</p>
			</div>
			<div class="input_box">
				<span class="label_lxl">选择访问日期</span>
				<div class="borde"></div>
				<div class="input_item" @click="handle_date_show">
					<p v-if="!pInviteData.visitDate">请选择</p>
					<p v-if="pInviteData.visitDate">{{pInviteData.visitDate}}</p>
				</div>
			</div>
			<div class="input_box">
				<span class="label_lxl">访问开始时间</span>
				<div class="borde"></div>
				<div class="input_item" @click="handle_startTime_show">
					<p>{{startTime}}</p>
				</div>
			</div>
			<div class="input_box">
				<span class="label_lxl">访问结束时间</span>
				<div class="borde"></div>
				<div class="input_item" @click="handle_endTime_show">
					<p>{{endTime}}</p>
				</div>
			</div>
			<div class="input_box">
				<span class="label_lxl">选择访问次数</span>
				<div class="borde"></div>
				<div class="input_item" @click="handle_number_show">
					<p>{{numberValue}}</p>
				</div>
			</div>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="handleSubmit" :btnClassName.sync='btnClassName'>提交</ColorBtn>
			</div>
		</div>
		<div v-if="causeShow" @touchmove.prevent>
			<van-popup v-model="causeShow" position="bottom">
				<van-picker show-toolbar :columns="causeList.cn" @cancel="causeShow = false" @confirm="handle_cause_confirm" :default-index="cause_index" />
			</van-popup>
		</div>
		<div v-if="dateShow" @touchmove.prevent>
			<van-popup v-model="dateShow" position="bottom">
				<van-datetime-picker v-model="datePicker" type="date" :min-date="startDate" @confirm='handle_date_confirm' @cancel='dateShow=false' :formatter='formatter' />
			</van-popup>
		</div>
		<div v-if="startTimeShow" @touchmove.prevent>
			<van-popup v-model="startTimeShow" position="bottom">
				<van-datetime-picker v-model="startTimePicker" type="time" @confirm='handle_startTime_confirm' @cancel='startTimeShow=false' />
			</van-popup>
		</div>
		<div v-if="endTimeShow" @touchmove.prevent>
			<van-popup v-model="endTimeShow" position="bottom">
				<van-datetime-picker v-model="endTimePicker" type="time" @confirm='handle_endTime_confirm' @cancel='endTimeShow=false' />
			</van-popup>
		</div>
		<div v-if="numberShow" @touchmove.prevent>
			<van-popup v-model="numberShow" position="bottom">
				<van-picker show-toolbar :columns="numberList.label" @cancel="numberShow = false" @confirm="handle_number_confirm" :default-index="number_index" />
			</van-popup>
		</div>
	</div>
</template>

<script>
	import ColorBtn from '../common/colorBtn'
	import HeaderNav from '../common/headerNav'
	import Vue from 'vue';
	import { Popup, Picker, DatetimePicker } from 'vant';
	Vue.use(Popup);
	Vue.use(Picker);
	Vue.use(DatetimePicker);
	export default {
		name: "Book",
		data() {
			return {
				/*原因*/
				causeShow: false,
				causeValue: "",
				causeList: {
					'cn': ['商务洽谈', '技术交流', '领导视察', '面试', '其它'],
					'en': ["business", "tech", "leader", "interview", "other"],
				},
				cause_index: 0,
				/*日期*/
				dateShow: false,
				datePicker: new Date(),
				startDate: new Date(),
				datePickerVal: "",
				dateValue: "",
				/*时间段*/
				startTimeShow: false,
				startTimePicker: "00:00",
				startTime: "00:00",

				endTimeShow: false,
				endTimePicker: "23:59",
				endTime: "23:59",
				/*次数*/
				numberShow: false,
				numberValue: "不限",
				numberList: {
					'label': ['不限', '1次', '2次', '3次'],
					'value': [0, 1, 2, 3],
				},
				number_index: 0,
				/*参数*/
				pInviteData: {
					openId: this.$openId,
					name: "",
					phone: "",
					certificateNo: "",
					company: "",
					dictidReason: "",
					receptionistPhone: "",
					receptionistCompany: "",
					receptionistName: "",
					followList: [],
					visitDate: "",
					visitPeriod: "",
					visitTimes: 0,
				},
				/*按钮*/
				btnClassName: "colorBtnBlue",
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		watch: {
			pInviteData: {
				handler: function(val, oldval) {
					this.pInviteData.receptionistPhone = allTrim(val.receptionistPhone);
					if(val.receptionistPhone.length == 11) {
						this.$axios({
							method: 'post',
							url: 'user/getReceptionInfo',
							data: {
								openId: this.$openId,
								phone: val.receptionistPhone,
								type: 1,
							},
						}).then(res => {
							console.log(res)
							if(res.data.code == 200) {
								if(res.data.data.flag) {
									this.pInviteData.receptionistCompany = res.data.data.receptionistCompany;
									this.pInviteData.receptionistName = res.data.data.receptionistName;
								} else {
									this.$toast(res.data.data.msg);
								}
							} else {
								this.$toast(res.data.msg);
							}
						}).catch(res => {
							console.log(res)
						});
					} else {
						this.pInviteData.receptionistCompany = '';
						this.pInviteData.receptionistName = '';
					}
				},
				deep: true //对象内部的属性监听，也叫深度监听
			},
			startTime: {
				handler: function(val, oldval) {
					let endTime = this.endTime.split(":");
					let startTime = val.split(":");
					if(parseInt(startTime[0]) > parseInt(endTime[0])) {
						this.startTime = oldval;
						this.$toast('开始时间必须小于结束时间');
					} else if(parseInt(startTime[0]) == parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1])) {
						this.startTime = oldval;
						this.$toast('开始时间必须小于结束时间');
					}
				},
				deep: true //对象内部的属性监听，也叫深度监听
			},
			endTime: {
				handler: function(val, oldval) {
					let startTime = this.startTime.split(":");
					let endTime = val.split(":");
					if(parseInt(startTime[0]) > parseInt(endTime[0])) {
						this.endTime = oldval;
						this.$toast('结束时间必须大于开始时间');
					} else if(parseInt(startTime[0]) == parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1])) {
						this.endTime = oldval;
						this.$toast('结束时间必须大于开始时间');
					}
				},
				deep: true //对象内部的属性监听，也叫深度监听
			},
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				/*访客参数获取*/
				this.$axios({
					method: 'post',
					url: 'user/getConfig',
					data: {
						openId: this.$openId,
					},
				}).then(res => {
					if(res.data.code == 200) {
						this.$store.commit('initNeedReason', res.data.data.needReason)
						this.$store.commit('initNeedCompany', res.data.data.needCompany)
						this.$store.commit('initNeedIdNumber', res.data.data.needIdNumber)
					}
				}).catch(res => {
					console.log(res)
				});
				if(window.localStorage.getItem('pInviteData')) {
					this.pInviteData = JSON.parse(window.localStorage.getItem('pInviteData'));
					this.causeList.en.forEach((x, i) => {
						if(this.pInviteData.dictidReason == x) {
							this.causeValue = this.causeList.cn[i];
						}
					})
					this.numberList.value.forEach((x, i) => {
						if(this.pInviteData.visitTimes == x) {
							this.numberValue = this.numberList.label[i];
						}
					})
					this.startTime = window.localStorage.getItem('inviteStartTime') || '';
					this.startTimePicker = this.startTime;
					this.endTime = window.localStorage.getItem('inviteEndTime') || '';
					this.endTimePicker = this.endTime;
				} else {
					this.initAgain();
				}
			},
			initAgain() {
				if(this.$route.query.id_new) {
					this.$axios({
						method: 'post',
						url: 'guest/appointment/detail',
						data: {
							openId: this.$openId,
							id: this.$route.query.id_new,
						},
					}).then(res => {
						console.log(res);
						if(res.data.code == 200) {
							this.pInviteData.name = res.data.data.name;
							this.pInviteData.phone = res.data.data.phone;
							this.pInviteData.certificateNo = res.data.data.certificateNo;
							this.pInviteData.company = res.data.data.company;
							this.pInviteData.receptionistPhone = res.data.data.receptionistPhone;
							this.pInviteData.receptionistCompany = res.data.data.receptionistCompany;
							this.pInviteData.receptionistName = res.data.data.receptionistName;
							res.data.data.followList.forEach((x, i) => {
								if(this.$store.state.needIdNumber) {
									this.pInviteData.followList.push({
										'certificateNo': x.certificateNo,
										'name': x.name,
										'phone': x.phone,
									})
								} else {
									this.pInviteData.followList.push({
										'name': x.name,
										'phone': x.phone,
									})
								}
							})
							this.causeList.cn.forEach((x, i) => {
								if(res.data.data.dictidReason == x) {
									this.pInviteData.dictidReason = this.causeList.en[i];
									this.causeValue = x;
									this.causePickerValue = x;
								}
							})
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						console.log(res)
					});
				}
			},
			navBack() {
				window.localStorage.removeItem("pInviteData");
				this.$router.push('/');
			},

			/*访问事由*/
			handle_cause_show() {
				this.causeList.en.forEach((x, i) => {
					if(this.pInviteData.dictidReason == x) {
						this.cause_index = i;
					}
				})
				this.causeShow = true;
			},
			handle_cause_confirm(value, index) {
				this.causeValue = value;
				this.pInviteData.dictidReason = this.causeList.en[index];
				this.causeShow = false;
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

			/*次数*/
			handle_number_show() {
				this.numberList.value.forEach((x, i) => {
					if(this.pInviteData.visitTimes == x) {
						this.number_index = i;
					}
				})
				this.numberShow = true;
			},

			handle_number_confirm(value, index) {
				this.numberValue = value;
				this.pInviteData.visitTimes = this.numberList.value[index];
				this.numberShow = false;
			},

			/*日期选择*/
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
			handle_date_show() {
				if(this.pInviteData.visitDate) {
					this.datePicker = new Date(this.pInviteData.visitDate)
				} else {
					this.datePicker = new Date();
				}
				this.dateShow = true;
			},
			handle_date_confirm(val) {
				this.datePicker = val;

				function checktime(i) {
					if(i < 10) {
						i = "0" + i;
					}
					return i;
				}
				let year = val.getYear() + 1900;
				let month = val.getMonth() + 1;
				let day = val.getDate();
				this.pInviteData.visitDate = year + '-' + checktime(month) + '-' + checktime(day);
				this.dateShow = false;
			},
			/*随访人*/
			goInvite_followList() {
				window.localStorage.setItem('inviteStartTime', this.startTime);
				window.localStorage.setItem('inviteEndTime', this.endTime);
				window.localStorage.setItem('pInviteData', JSON.stringify(this.pInviteData));
				this.$router.push('/visitor/invite_followList')
			},

			submitTest() {
				this.isSubmitText = false;
				let phoneArr = [];
				this.pInviteData.phone = allTrim(this.pInviteData.phone);
				phoneArr.push(this.pInviteData.phone);
				let certificateNoArr = [];
				this.pInviteData.certificateNo = allTrim(this.pInviteData.certificateNo);
				certificateNoArr.push(this.pInviteData.certificateNo);
				this.pInviteData.followList.forEach((x, i) => {
					let noPhone = true;
					x.phone = allTrim(x.phone);
					phoneArr.forEach((y, j) => {
						if(y == x.phone) {
							noPhone = false;
						}
					})
					if(noPhone) phoneArr.push(x.phone);
					let noCertificateNo = true;
					x.certificateNo = allTrim(x.certificateNo);
					certificateNoArr.forEach((y, j) => {
						if(y == x.certificateNo) {
							noCertificateNo = false;
						}
					})
					if(noCertificateNo) certificateNoArr.push(x.certificateNo);
				})
				this.pInviteData.name = this.pInviteData.name.trim();
				if(!reg_nameE.test(this.pInviteData.name) && !reg_nameC.test(this.pInviteData.name)) return this.$toast('请输入访客姓名');
				if(!reg_phone.test(this.pInviteData.phone)) return this.$toast('访客手机格式不正确');
				if(phoneArr.length != this.pInviteData.followList.length + 1) return this.$toast('访客手机重复');
				let phonePass = true;
				phoneArr.forEach((x, i) => {
					if(x == this.pInviteData.receptionistPhone) return phonePass = false;
				})
				if(!phonePass) return this.$toast('访客与被访人手机不能相同');
				if(this.$store.state.needIdNumber) {
					if(this.pInviteData.certificateNo && this.pInviteData.certificateNo.length != 18) return this.$toast('身份证号格式不正确');
					if(certificateNoArr.length != this.pInviteData.followList.length + 1) return this.$toast('访客身份证号重复');
				} else {
					delete this.pInviteData["certificateNo"];
				};
				if(this.$store.state.needCompany) {
					if(!this.pInviteData.company) return this.$toast('请输入访客单位');
				} else {
					delete this.pInviteData["company"];
				};
				if(this.$store.state.needReason) {
					if(!this.pInviteData.dictidReason) return this.$toast('请选择来访事由');
				} else {
					delete this.pInviteData["dictidReason"];
				};
				if(this.pInviteData.receptionistPhone.length != 11) return this.$toast('被访人手机格式不正确');
				if(!this.pInviteData.receptionistCompany) return this.$toast('被访人手机不存在');
				if(!this.pInviteData.visitDate) return this.$toast('请选择访问日期');
				let time = new Date(this.pInviteData.visitDate + " 23:59:59").getTime();
				let nowTime = new Date().getTime();
				if(time < nowTime) return this.$toast('访问日期不能小于当前日期');
				if(!this.startTime) return this.$toast('请选择访问开始时间');
				if(!this.endTime) return this.$toast('请选择访问结束时间');
				this.pInviteData.visitPeriod = this.startTime + ':00~' + this.endTime + ":59";
				console.log(this.pInviteData)
				this.isSubmitText = true;
			},
			handleSubmit() {
				this.submitTest()
				if(this.isSubmitText) {
					this.$toast.loading({
						duration: 0,
						message: '提交中...',
						forbidClick: true,
						loadingType: 'spinner'
					});
					this.$axios({
						method: 'post',
						url: 'guest/invite',
						data: this.pInviteData,
					}).then(res => {
						this.$toast.clear();
						window.localStorage.removeItem("pInviteData");
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "inviteSuccess",
										id: res.data.data.id,
									}
								})
							} else if(res.data.data.blackList) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "blackListInvite",
										blackListPhone: res.data.data.phone,
									}
								})
							} else {
								this.$toast(res.data.data.msg);
							}
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						this.$toast.clear();
						window.localStorage.removeItem("pInviteData");
					});
				}
			},
		},
	}
</script>

<style lang="scss">
	@import '../../assets/scss/visitorBook';
	.loading {
		position: fixed;
		top: 20px;
		left: 50%;
		z-index: 1000;
	}
</style>