<template>
	<div class="bindPhone_page">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="form_box">
			<div class="input_box">
				<span class="lebal">手机</span>
				<p class="inputItem">{{$store.state.userPhone}}</p>
			</div>
			<div class="borde"></div>
			<div class="input_box">
				<span class="lebal">验证码</span>
				<input type="text" class="inputItem code" v-model="code" />
				<i></i>
				<b class="active" @click="handleGetCode" v-if='!codeTimeShow'>获取验证码</b>
				<b class="active" v-if='codeTimeShow'>{{codeTime}} 秒后重试</b>
			</div>
		</div>
		<div class="bottom">
			<ColorBtn @handleBtnClick="handBindPhone" :btnClassName.sync='btnClassName'>解绑</ColorBtn>
		</div>
	</div>
</template>

<script>
	import ColorBtn from './common/colorBtn'
	import HeaderNav from './common/headerNav'
	export default {
		name: "UnBindPhone",
		data() {
			return {
				code: "",
				codeTimeShow: false,
				codeTime: 59,
				/*按钮*/
				btnClassName: "colorBtnBlue",
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			handleGetCode() {
				this.codeTimeShow = true;
				if(this.codeTimeShow && this.codeTime == 59) {
					let timer = setInterval(() => {
						if(this.codeTime > 0) {
							this.codeTime--;
						} else {
							this.codeTimeShow = false;
							this.codeTime = 59;
							clearInterval(timer);
						}
					}, 1000)
					this.$axios({
						method: 'post',
						url: 'sms/sendUnBindCode',
						data: {
							phone: this.$store.state.userPhone,
							way: 1,
						},
					}).then(res => {
						if(res.data.code == 200) {
							if(!res.data.data.flag) {
								this.$toast(res.data.data.msg);
							}
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						console.log(res)
					});
				}
			},
			handBindPhone() {
				if(this.code.length != 4) {
					this.$toast('验证码错误');
				} else {
					this.$axios({
						method: 'post',
						url: 'user/unBindPhone',
						data: {
							openId: this.$openId,
							checkCode: this.code,
							phone: this.$store.state.userPhone,
						},
					}).then(res => {
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$store.commit('initUserPhone', '')
								this.$router.push({
									path: "/hint",
									query: {
										type: "unBindSuccess"
									}
								})
							} else {
								this.$toast(res.data.data.msg);
							}
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						console.log(res)
					});
				}
			},
		},
	}
</script>

<style lang="scss">
	@import "../assets/scss/bindPhone";
</style>