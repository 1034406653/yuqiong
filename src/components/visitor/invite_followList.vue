<template>
	<div class="followList_page">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="followList_page_main">
			<ul v-for="(item,index) in invite_followList">
				<li>
					<img src="@/assets/img/icon_close.png" @click="handleDeletePeople(index)" class="close" />
					<div class="morePeople_title">
						随访人{{index+1}}
					</div>
					<div class="input_box">
						<span>姓名</span>
						<input type="text" v-model="item.name" placeholder="请输入" />
					</div>
					<div class="input_box">
						<span>手机</span>
						<input type="text" v-model="item.phone" placeholder="请输入" />
					</div>
					<div class="input_box" v-if="$store.state.needIdNumber">
						<span>身份证号</span>
						<input type="text" v-model="item.certificateNo" placeholder="请输入" />
					</div>
				</li>
			</ul>
			<div class="add" @click="handleAddPeople">添加随访人</div>
			<div class="bottom">
				<ColorBtn @handleBtnClick="handleConfirm" :btnClassName.sync='btnClassName'>保存</ColorBtn>
			</div>
		</div>
	</div>
</template>

<script>
	import ColorBtn from '../common/colorBtn'
	import HeaderNav from '../common/headerNav'
	export default {
		name: 'Invite_followList',
		data() {
			return {
				invite_followList: [],
				pInviteData: {},
				/*按钮*/
				btnClassName: "colorBtnBlue",
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		mounted() {
			if(window.localStorage.getItem('pInviteData')) {
				this.pInviteData = JSON.parse(window.localStorage.getItem('pInviteData'));
				this.invite_followList = JSON.parse(window.localStorage.getItem('pInviteData')).followList;
				if(this.invite_followList.length < 1) {
					this.handleAddPeople();
				}
			} else {
				this.$router.push('/visitor/invite');
			}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
			handleAddPeople() {
				if(this.$store.state.needIdNumber) {
					this.invite_followList.push({
						"name": "",
						"phone": "",
						"certificateNo": "",
					})
				} else {
					this.invite_followList.push({
						"name": "",
						"phone": "",
					})
				}

			},
			handleDeletePeople(index) {
				this.invite_followList.splice(index, 1);
			},
			handleConfirm() {
				let hint = ''
				let phoneArr = [];
				let certificateNoArr = [];
				this.invite_followList.forEach((x, i) => {
					x.name = trim(x.name)
					x.phone = allTrim(x.phone)
					let noPhone = true;
					phoneArr.forEach((y, j) => {
						if(y.phone == x.phone) {
							noPhone = false;
							hint = `${x.name}与${y.name}的电话号重复`
						}
					})
					if(noPhone) phoneArr.push({
						'phone': x.phone,
						'name': x.name
					});
					if(this.$store.state.needIdNumber) {
						let noCertificateNo = true;
						x.certificateNo = x.certificateNo.trim();
						certificateNoArr.forEach((y, j) => {
							if(y.certificateNo == x.certificateNo) {
								noCertificateNo = false;
								hint = `${x.name}与${y.name}的身份证号重复`
							}
						})
						if(noCertificateNo) certificateNoArr.push({
							'certificateNo': x.certificateNo,
							'name': x.name
						});
					}
				})
				this.invite_followList.forEach((x, i) => {
					if(!reg_nameE.test(x.name) && !reg_nameC.test(x.name)) {
						hint = `随访人${i+1}姓名的格式不正确`
					} else if(!reg_phone.test(x.phone)) {
						hint = `随访人${i+1}的手机格式不正确`
					} else if(this.$store.state.needIdNumber) {
						if(x.certificateNo.length != 18) {
							hint = `随访人${i+1}的身份证号格式不正确`
						}
					}
				})
				if(!hint) {
					this.pInviteData.followList = this.invite_followList;
					window.localStorage.setItem('pInviteData', JSON.stringify(this.pInviteData));
					this.$router.go(-1);
				} else {
					this.$toast(hint);
				}
			},
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/followList';
</style>