<template>
	<div class="information_part">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="input_box">
			<input type="text" placeholder="请输入您的姓名" v-model="realName" />
		</div>
		<div class="bottom">
			<div class="colorBtnWhite" @click="$router.push('/information')">
				取消
			</div>
			<div class="colorBtnBlue" @click="changeRealName">
				确定
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	export default {
		name: 'informatin_username',
		data() {
			return {
				realName: "",
			}
		},
		components: {
			HeaderNav,
		},
		mounted() {
			this.realName = this.$store.state.realName
		},
		methods: {
			navBack() {
				this.$router.push('/information');
			},
			changeRealName() {
				this.$axios({
					method: 'post',
					url: 'user/bindInfo',
					data: {
						openId: this.$openId,
						realName: this.realName,
					},
				}).then(res => {
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$router.push('/information');
							this.$store.commit('initRealName', this.realName)
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
			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/information";
</style>