<template>
	<div class="elevatorStatus">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="elevatorStatus_main">
			<div class="header">
				<img class="adress_icon" src="@/assets/img/elevator/icon_status_adress.png"/>
				<span>森和广场</span>
				<img class="select_icon" src="@/assets/img/elevator/icon_status_select.png"/>
			</div>
			<ul class="elevator_list">
				<li v-for='item in elevator' :class="item.type">
					<div class="top">
						<i></i>						
						<span v-if="item.type=='up'">上行</span>
						<span v-if="item.type=='down'">下行</span>
						<span v-if="item.type=='free'">空闲</span>
						<span v-if="item.type=='breakdown'">故障</span>
					</div>	
					<div class="main">
						<div>
							<i></i>
							<span>6F</span>
						</div>
					</div>
					<div class="bottom">
						<span>{{item.name}}</span>
					</div>
				</li>				
			</ul>
		</div>
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
				elevator:[{
					type:'up',
					name:'1号梯'
				},{
					type:'down',
					name:'2号梯'
				},{
					type:'free',
					name:'3号梯'
				},{
					type:'breakdown',
					name:'4号梯'
				},]
			}
		},		
		mounted() {	
			this.elevator.forEach((x,i)=>{
				x.className=x.type;
			})
			this.init();
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},	
			init(){
				var ua = navigator.userAgent;
				console.log(ua)
			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/elevatorStatus";
</style>