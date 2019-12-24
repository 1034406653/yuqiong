<template>
	<div class="information_part">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="input_box">
			<input type="text" placeholder="请输入您的单位" v-model="company" />
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
				company: "",
				/*按钮*/
				btnClassNameWhite:'colorBtnWhite',
				btnClassNameBlue:'colorBtnBlue',
			}
		},
		components: {
			HeaderNav,
			ColorBtn
		},
		mounted() {
			this.company = this.$store.state.company;
		},
		methods: {
			navBack() {
				this.$router.push('/information');
			},
			changeCompany() {
				this.$axios({
					method: 'post',
					url: 'user/bindInfo',
					data: {
						openId: this.$openId,
						company: this.company,
					},
				}).then(res => {
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$router.push('/information');
							this.$store.commit('initCompany', this.company)
						} else {
							this.$toast(res.data.data.msg)							
						}
					} else {
						this.$toast(res.data.msg)
					}
				}).catch(res => {
					console.log(res)
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/information";
</style>