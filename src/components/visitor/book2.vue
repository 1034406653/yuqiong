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
				<input type="text" placeholder="请输入" class="input_item" v-model="pGuestAppointment.name" />
			</div>
			<div class="input_box">
				<span class="label_lxl">访客手机</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pGuestAppointment.phone" />
			</div>
			<div class="input_box" v-if="bookNeed.needIdNumber">
				<span class="label_lxl">身份证号</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pGuestAppointment.certificateNo" />
			</div>
			<div class="input_box" v-if="bookNeed.needCompany">
				<span class="label_lxl">访客单位</span>
				<div class="borde"></div>
				<input type="text" placeholder="请输入" class="input_item" v-model="pGuestAppointment.company" />
			</div>
			<div class="input_box" v-if="bookNeed.needReason">
				<span class="label_lxl">来访事由</span>
				<div class="borde"></div>
				<div class="input_item" @click="handle_cause_show">
					<p v-if="!causeValue">请选择</p>
					<p v-if="causeValue">{{causeValue}}</p>
				</div>
			</div>
			<div class="input_box">
				<span class="label_lxl">预计到访时间</span>
				<div class="borde"></div>
				<div class="input_item" @click="handle_datetime_show">
					<p v-if="!pGuestAppointment.planComingTime">请选择</p>
					<p v-if="pGuestAppointment.planComingTime">{{pGuestAppointment.planComingTime}}</p>
				</div>
			</div>
			<div class="input_box">
				<span class="label_lxl">随访人</span>
				<div class="input_item followList_item" @click="goBook_followList"><span style="display: inline-block">{{pGuestAppointment.followList.length}} <b>人</b></span><img src="@/assets/img/icon_next.png" class="icon_next icon_followList" /></div>
			</div>
			<!--新增-->
			<div class="btn_box" v-if='bookType!="change"'>
				<ColorBtn @handleBtnClick="handleSubmit" :btnClassName.sync='btnClassName'>提交</ColorBtn>
			</div>
			<!--修改-->
			<div class="btn_box" v-if='bookType=="change"'>
				<ColorBtn @handleBtnClick="handleSubmit_change" :btnClassName.sync='btnClassName'>提交</ColorBtn>
			</div>
		</div>

		<div v-if="causeShow" @touchmove.prevent>
			<van-popup v-model="causeShow" position="bottom">
				<van-picker show-toolbar :columns="causeList.cn" @cancel="causeShow = false" @confirm="handle_cause_confirm" :default-index="cause_index" />
			</van-popup>
		</div>
		<div v-if="datetimeShow" @touchmove.prevent>
			<van-popup v-model="datetimeShow" position="bottom">
				<van-datetime-picker v-model="datePicker" type="datetime" :min-date="startDate" @confirm='handle_datetime_confirm' @cancel='datetimeShow=false' :formatter='formatter' />
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
		name: "VisitorBook2",
		data() {
			return {
				bookType: '',

				causeShow: false,
				causeValue: "",
				causeList: {
					'cn': ['商务洽谈', '技术交流', '领导视察', '面试', '其它'],
					'en': ["business", "tech", "leader", "interview", "other"],
				},
				cause_index: 0,

				datetimeShow: false,
				datePicker: new Date(),
				startDate: new Date(),
				dateValue: "",

				pGuestAppointment: {
					openId: this.$openId,
					name: "",
					phone: "",
					certificateNo: "",
					company: "",
					dictidReason: "",
					planComingTime: "",
					receptionistPhone: "",
					receptionistCompany: "",
					receptionistName: "",
					followList: [],
				},
				/*按钮*/
				btnClassName: "colorBtnBlue",
				/*必填设置*/
				bookNeed: {
					needCompany: false,
					needIdNumber: false,
					needReason: false,
				},
				/*是否通过校验*/
				isSubmitText: false,
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		mounted() {
			this.bookType = window.localStorage.getItem('bookType');
			this.pGuestAppointment = JSON.parse(window.localStorage.getItem('pGuestAppointment'));
			this.bookNeed = JSON.parse(window.localStorage.getItem('bookNeed'));
			this.causeList.en.forEach((x, i) => {
				if(this.pGuestAppointment.dictidReason == x) {
					this.causeValue = this.causeList.cn[i];
				}
			})
		},
		methods: {
			navBack() {
				this.$router.push('/visitor/book');
			},
			/*访问事由*/
			handle_cause_show() {
				this.causeList.en.forEach((x, i) => {
					if(this.pGuestAppointment.dictidReason == x) {
						this.cause_index = i;
					}
				})
				this.causeShow = true;
			},
			handle_cause_confirm(value, index) {
				this.causeValue = value;
				this.pGuestAppointment.dictidReason = this.causeList.en[index];
				this.causeShow = false;
			},
			/*预计访问时间*/
			formatter(type, value) {　　
				if(type === 'year') {　　
					return `${value}年`;　　
				} else if(type === 'month') {　　
					return `${value}月`　　
				} else if(type === 'day') {　　
					return `${value}日`　　
				}　
				else if(type === 'hour') {　　
					return `${value}时`　　
				}　
				else if(type === 'minute') {　　
					return `${value}分`　　
				}　　
				return value;　　
			},
			handle_datetime_show() {
				if(this.pGuestAppointment.planComingTime) {
					this.datePicker = new Date(this.pGuestAppointment.planComingTime)
				} else {
					this.datePicker = new Date();
				}
				this.datetimeShow = true;
			},
			handle_datetime_confirm(val) {
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
				let hour = val.getHours();
				let minute = val.getMinutes();
				this.pGuestAppointment.planComingTime = year + '-' + checktime(month) + '-' + checktime(day) + ' ' + checktime(hour) + ":" + checktime(minute) + ':00'
				this.datetimeShow = false;
			},
			goBook_followList() {
				window.localStorage.setItem('pGuestAppointment', JSON.stringify(this.pGuestAppointment));
				this.$router.push('/visitor/book_followList')
			},
			submitTest() {
				/*初始校验设为false*/
				this.isSubmitText = false;
				/*校验随访人手机号、校验随访人身份证号*/
				let phoneArr = [];
				this.pGuestAppointment.phone = allTrim(this.pGuestAppointment.phone);
				phoneArr.push(this.pGuestAppointment.phone);
				let certificateNoArr = [];
				this.pGuestAppointment.certificateNo = allTrim(this.pGuestAppointment.certificateNo);
				certificateNoArr.push(this.pGuestAppointment.certificateNo);
				this.pGuestAppointment.followList.forEach((x, i) => {
					x.phone = allTrim(x.phone);
					let noPhone = true;
					phoneArr.forEach((y, j) => {
						if(y == x.phone) {
							noPhone = false;
						}
					})
					if(noPhone) phoneArr.push(x.phone);
					if(this.bookNeed.needIdNumber) {
						x.certificateNo = allTrim(x.certificateNo);
						let noCertificateNo = true;
						certificateNoArr.forEach((y, j) => {
							if(y == x.certificateNo) {
								noCertificateNo = false;
							}
						})
						if(noCertificateNo) certificateNoArr.push(x.certificateNo);
					}
				})
				/*校验姓名格式*/
				if(!reg_nameE.test(this.pGuestAppointment.name) && !reg_nameC.test(this.pGuestAppointment.name)) return this.$toast('访客姓名格式不正确');
				/*校验手机号格式*/
				if(!reg_phone.test(this.pGuestAppointment.phone)) return this.$toast('访客手机格式不正确');
				/*校验手机号是否重复*/
				if(phoneArr.length != this.pGuestAppointment.followList.length + 1) return this.$toast('访客手机重复');
				/*校验手机号与受访人手机号是否相同*/
				let phonePass = true;
				phoneArr.forEach((x, i) => {
					if(x == this.pGuestAppointment.receptionistPhone) return phonePass = false;
				})
				if(!phonePass) return this.$toast('访客与被访人手机不能相同');
				/*校验身份证号是否重复*/
				if(this.bookNeed.needIdNumber) {
					if(this.pGuestAppointment.certificateNo && !reg_identity.test(this.pGuestAppointment.certificateNo)) return this.$toast('身份证号格式不正确');
					if(certificateNoArr.length != this.pGuestAppointment.followList.length + 1) return this.$toast('访客身份证号重复');
				} else {
					delete this.pGuestAppointment.certificateNo;
				}
				/*校验访客单位*/
				if(this.bookNeed.needCompany) {
					if(!this.pGuestAppointment.company) return this.$toast('请输入访客单位');
				} else {
					delete this.pGuestAppointment.company;
				}
				/*校验来访事由*/
				if(this.bookNeed.needReason) {
					if(!this.pGuestAppointment.dictidReason) return this.$toast('请输入来访事由');
				} else {
					delete this.pGuestAppointment.dictidReason;
				}
				/*校验预计到访时间*/
				let time = new Date(this.pGuestAppointment.planComingTime).getTime();
				let nowTime = new Date().getTime();
				if(!this.pGuestAppointment.planComingTime) return this.$toast('请选择预计到访时间');
				if(time < nowTime) return this.$toast('预计到访时间不能小于当前时间');
				/*通过校验*/
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
						url: 'guest/appointment',
						data: this.pGuestAppointment,
					}).then(res => {
						this.$toast.clear();
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "bookSuccess"
									}
								})
							} else if(res.data.data.blackList) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "blackList"
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
					});
				}
			},
			handleSubmit_change() {
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
						url: 'guest/appointment/update',
						data: this.pGuestAppointment,
					}).then(res => {
						this.$toast.clear();
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "book_changeSuccess"
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
						console.log(res)
					});
				}

			}
		},
	}
</script>

<style lang="scss">
	@import '../../assets/scss/visitorBook';
</style>