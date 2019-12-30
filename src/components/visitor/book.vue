<template>
	<div class="book_page" ref='book_page'>
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="title">
			被访人信息
		</div>
		<div class="input_box">
			<span class="label_lxl">被访人手机</span>
			<div class="borde" v-if='pGuestAppointment.receptionistCompany'></div>
			<input type="text" placeholder="请输入" class="input_item" v-model="pGuestAppointment.receptionistPhone" />
		</div>
		<div class="input_box" v-if='pGuestAppointment.receptionistCompany'>
			<span class="label_lxl" style="color: #99a3b0;">访问公司</span>
			<div class="borde"></div>
			<p class="input_item">{{pGuestAppointment.receptionistCompany}}</p>
			
		</div>
		<div class="input_box" v-if='pGuestAppointment.receptionistName'>
			<span class="label_lxl" style="color: #99a3b0;">被访人姓名</span>
			<div class="borde"></div>
			<p class="input_item">{{pGuestAppointment.receptionistName}}</p>			
		</div>
		<div class="btn_box">
			<ColorBtn @handleBtnClick="handleNext" :btnClassName.sync='btnClassName'>下一步</ColorBtn>
		</div>
	</div>
</template>
<script>
	import ColorBtn from '../common/colorBtn'
	import HeaderNav from '../common/headerNav'
	export default {
		name: "VisitorBook",
		data() {
			return {
				/*:新的预约，change：修改预约，new:重新预约*/
				bookType: "",
				causeList:{
					'cn':['商务洽谈', '技术交流', '领导视察', '面试', '其它'],
					'en':["business", "tech", "leader", "interview", "other"],
				},
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
				btnClassName:"colorBtnBlue",
				/*必填设置*/
				bookNeed: {
					needCompany: false,
					needIdNumber: false,
					needReason: false,
				}				
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		watch: {
			pGuestAppointment: {
				handler: function(val, oldval) {
					this.pGuestAppointment.receptionistPhone=allTrim(val.receptionistPhone);
					if(val.receptionistPhone.length == 11) {
						this.$axios({
							method: 'post',
							url: 'user/getReceptionInfo',
							data: {
								openId: this.$openId,
								phone: val.receptionistPhone,
								type: 0,
							},
						}).then(res => {
							console.log(res)
							if(res.data.code == 200) {
								if(res.data.data.flag) {
									this.pGuestAppointment.receptionistCompany = res.data.data.receptionistCompany;
									this.pGuestAppointment.receptionistName = res.data.data.receptionistName;									
									this.bookNeed.needCompany=res.data.data.needCompany;
									this.bookNeed.needIdNumber=res.data.data.needIdNumber;
									this.bookNeed.needReason=res.data.data.needReason;
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
						this.pGuestAppointment.receptionistCompany = '';
						this.pGuestAppointment.receptionistName = '';
						this.bookNeed= {
							needCompany: false,
							needIdNumber: false,
							needReason: false,
						}
					}
				},
				deep: true //对象内部的属性监听，也叫深度监听
			},
		},
		mounted() {
			let id = '';
			if(window.localStorage.getItem('pGuestAppointment')) {
				this.pGuestAppointment = JSON.parse(window.localStorage.getItem('pGuestAppointment'));
			}
			if(this.$route.query.id) {
				id = this.$route.query.id;
				this.bookType = 'change';
				this.pGuestAppointment.id = this.$route.query.id;
				this.initList(id);
			}
			if(this.$route.query.id_new) {
				id = this.$route.query.id_new
				this.bookType = 'new';
				this.initList(id);
			}			
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			initList(id) {
				this.$axios({
					method: 'post',
					url: 'guest/appointment/detail',
					data: {
						openId: this.$openId,
						id: id,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.pGuestAppointment.name = res.data.data.name;
						this.pGuestAppointment.phone = res.data.data.phone;
						this.pGuestAppointment.certificateNo = res.data.data.certificateNo;
						this.pGuestAppointment.company = res.data.data.company;
						if(this.bookType=='change'){
							this.pGuestAppointment.planComingTime = res.data.data.planComingTime;
						}						
						this.pGuestAppointment.receptionistPhone = res.data.data.receptionistPhone;
						this.pGuestAppointment.receptionistCompany = res.data.data.receptionistCompany;
						this.pGuestAppointment.receptionistName = res.data.data.receptionistName;
						res.data.data.followList.forEach((x,i)=>{
							this.pGuestAppointment.followList[i]={};
							this.pGuestAppointment.followList[i].name=x.name || '';;
							this.pGuestAppointment.followList[i].phone=x.phone || '';;
							if(x.certificateNo){								
								this.pGuestAppointment.followList[i].certificateNo=x.certificateNo;
							}							
						})						
						this.causeList.cn.forEach((x, i) => {
							if(res.data.data.dictidReason == x) {
								this.pGuestAppointment.dictidReason = this.causeList.en[i];
							}
						})
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					console.log(res)
				});
			},
			handleNext() {
				console.log(this.pGuestAppointment)
				if(!this.pGuestAppointment.receptionistCompany) return this.$toast('请先填写被访人手机');
				window.localStorage.setItem('bookType', this.bookType);
				window.localStorage.setItem('pGuestAppointment', JSON.stringify(this.pGuestAppointment));
				window.localStorage.setItem('bookNeed', JSON.stringify(this.bookNeed));
				this.$router.push('/visitor/book2')
			}
		},
	}
</script>

<style lang="scss">
	@import '../../assets/scss/visitorBook';
</style>