<template>
	<div class="meetingBook">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingBook_main">
			<div class="input_box">
				<div class="label">
					<span>会议室名称：</span>
				</div>
				<input type="text" class="input_item" />
				<b class="borde"></b>
			</div> 
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>开会日期：</span>
				</div>
				<input type="text" class="input_item" />
				<b class="borde"></b>
			</div>
			<div class="input_box" style="margin-bottom: 40px;">
				<div class="label">
					<span>开会时间：</span>
				</div>
				<input type="text" class="input_item" />
			</div>
			<div class="input_box">
				<div class="label">
					<span>开会时间：</span>
				</div>
				<input type="text" class="input_item" />
			</div>
		</div>

	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	export default {
		name: 'MeetingBook',
		components: {
			HeaderNav,
		},
		data() {
			return {}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingBook";
</style>