<template>
	<div class="bindPhone_page">
		<div class="form_box">
			<div class="input_box">
				<span class="lebal">手机号</span>
				<input class="inputItem" placeholder="请输入" v-model="phone" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')" /> </input>
			</div>
			<div class="borde"></div>
			<div class="input_box">
				<span class="lebal">验证码</span>
				<input type="text" class="inputItem code" v-model="checkCode" />
				<i></i>
				<b :class="{active: isActive}" @click="handleGetCode" v-if='!codeTimeShow'>获取验证码</b>
				<b :class="{active: isActive}" v-if='codeTimeShow'>{{codeTime}} 秒后重试</b>
			</div>
		</div>
		<div class="bottom">
			<ColorBtn @handleBtnClick="handBindPhone" :btnClassName.sync='btnClassName'>提交</ColorBtn>			
		</div>		
	</div>
</template>

<script>	
	import ColorBtn from '../common/colorBtn'
	export default {
		name: "Staff_bindPhone",
		data() {
			return {
				checkCode: "",
				isActive: false,
				codeTimeShow: false,
				codeTime: 59,
				phone: "",
				/*按钮*/
				btnClassName: "colorBtnBlue",
			}
		},
		components: {			
			ColorBtn
		},
		watch: {
			phone: {
				handler: function(val, oldval) {
					this.phone=allTrim(val);
					if(val.length == 11) {
						this.isActive = true;
					} else {
						this.isActive = false;
					}
				},
				deep: true //对象内部的属性监听，也叫深度监听
			},
		},
		methods: {
			handleGetCode() {
				if(this.isActive) {
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
					}					
					this.$axios({
						method: 'post',
						url: '/user/employee/sendCode',
						data: {
							phone: this.phone,
						},
					}).then(res => {
						console.log(res)
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
				if(this.checkCode.length != 4) {
					this.$toast('验证码错误');
				} else {
					this.$axios({
						method: 'post',
						url: 'user/employee/bindOpenId',
						data: {
							openId: this.$openId,
							checkCode: this.checkCode,
							phone: this.phone,
						},
					}).then(res => {
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push('/staff/qrcode')
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
	@import "../../assets/scss/bindPhone";
</style>