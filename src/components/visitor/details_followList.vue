<template>
	<div class="followList_page">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="followList_page_main">
			<ul v-for="(item,index) in followList">
				<li>
					<div class="morePeople_title">
						随访人{{index+1}}
					</div>
					<div class="input_box">
						<span>姓名</span>
						<input type="text" v-model="item.name" />

					</div>
					<div class="input_box">
						<span>手机</span>
						<input type="text" v-model="item.phone" />
					</div>
					<div class="input_box" v-if="item.certificateNo">
						<span>身份证号</span>
						<input type="text" v-model="item.certificateNo" />
					</div>
				</li>
			</ul>
		</div>

	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	export default {
		name: 'VisitorDetails_followList',
		data() {
			return {
				followList: [],
			}
		},
		components: {
			HeaderNav,
		},

		mounted() {
			if(this.$route.params.followList) {
				this.followList = this.$route.params.followList;
			} else {
				this.$router.go(-1);
			}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/followList';
</style>