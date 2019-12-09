<template>
	<div class="elevatorStatus">
		<headerNav @bNavBack="navBack"></headerNav>
		
	</div>
</template>

<script>	
	import HeaderNav from '../common/headerNav'

	export default {
		name: "ElevatorStatus",
		components: {
			HeaderNav,			
		},
		data() {
			return {				
			}
		},		
		mounted() {
			
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},			
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/elevatorStatus";
</style>