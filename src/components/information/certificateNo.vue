<template>
	<div class="information_part">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="input_box">
			<input type="text" placeholder="请输入您的身份证号" v-model="certificateNo" />
		</div>
		<div class="bottom">
			<div class="btn">
				<ColorBtn @click="$router.push('/information')" :btnClassName.sync='btnClassNameWhite'>取消</ColorBtn>
			</div>
			<div class="btn">
				<ColorBtn @click="changeCertificateNo" :btnClassName.sync='btnClassNameBlue'>确定</ColorBtn>
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import ColorBtn from '../common/colorBtn'
	export default {
		name: 'Informatin_idnumber',
		data() {
			return {
				certificateNo: "",
				/*按钮*/
				btnClassNameWhite: 'colorBtnWhite',
				btnClassNameBlue: 'colorBtnBlue',
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		mounted() {
			this.certificateNo = this.$store.state.certificateNo;
		},
		methods: {
			navBack() {
				this.$router.push('/information');
			},
			changeCertificateNo() {
				this.certificateNo = allTrim(this.certificateNo);
				if(this.certificateNo && this.certificateNo.length != 18) {
					this.$toast('身份证格式不正确')
				} else {
					this.$axios({
						method: 'post',
						url: 'user/bindInfo',
						data: {
							openId: this.$openId,
							certificateNo: this.certificateNo,
						},
					}).then(res => {
						console.log(res)
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push('/information');
								this.$store.commit('initCertificateNo', this.certificateNo)
							} else {
								this.$toast(res.data.data.msg)

							}
						} else {
							this.$toast(res.data.msg)

						}
					}).catch(res => {
						console.log(res)
					});
				}

			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/information";
</style>