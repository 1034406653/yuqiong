<template>
	<div class="information_part">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="input_box">
			<input type="text" placeholder="请输入您的单位" v-model="company" />
		</div>
		<div class="bottom">
			<div class="colorBtnWhite" @click="$router.push('/information')">
				取消
			</div>
			<div class="colorBtnBlue" @click="changeCompany">
				确定
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	export default {
		name: 'Informatin_idnumber',
		data() {
			return {
				company: "",
			}
		},
		components: {
			HeaderNav,
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
							MessageBox({
								title: "",
								message: res.data.data.msg,
							});
						}
					} else {
						MessageBox({
							title: "",
							message: res.data.msg,
						});
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