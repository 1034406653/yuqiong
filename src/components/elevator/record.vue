<template>
	<div class="elevatorRecord">
		<headerNav @bNavBack="navBack"></headerNav>
		<ul>
			<li v-for="(item,index) in recordList" :class="[item.status=='服务中'?'active':'']">
				<div class="top">
					<div class="top_left">
						{{item.building}}
					</div>
					<div class="top_center" v-if="item.status=='服务中'">
						<span class="s1">{{item.startFloor}}F</span>
						<p><b class="b1"></b><b class="b2"></b></p>
						<span class="s2">{{item.currentFloor}}F</span>
						<p><b class="b2"></b><b class="b1"></b></p>
						<span class="s3">{{item.endFloor}}F</span>
					</div>
					<div class="top_center" v-if="item.status=='已结束'">
						<span class="s3">{{item.startFloor}}F</span>
						<p><b class="b3"></b><b class="b3"></b></p>						
						<span class="s3">{{item.endFloor}}F</span>
					</div>
					<div class="top_right">
						{{item.status}}
					</div>
				</div>
				<div class="center" v-if="item.status=='服务中'">
					<p>出发时间：{{item.startTime}}</p>
					<p>预计时长：{{item.expectedTime}}分钟</p>					
					<p>已用时长：{{item.usedTime}}</p>
					<p>VIP电梯：{{item.elevator}}号</p>					
					<div><b><i>¥</i><i>{{item.expectedCost}}</i></b><span>预计费用</span></div>
				</div>
				<div class="center" v-if="item.status=='已结束'">
					<p>出发时间：{{item.startTime}}</p>					
					<p>乘梯时长：{{item.usedTime}}</p>					
					<p>VIP电梯：{{item.elevator}}号</p>
					<p>结束时间：{{item.endTime}}</p>
					<div><b><i>¥</i><i>{{item.expectedCost}}</i></b><span>乘梯费用</span></div>
				</div>
				<div class="bottom">
					<div class="btn_box" v-if="item.status=='服务中'">
						<span>结束用梯</span>
						<i></i>
						<span>身份验证</span>
					</div>
					<div class="btn" v-if="item.status=='已结束'">重新申请</div>
				</div>
			</li>
		</ul>
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
				recordList: [{
					building: "森禾广场A座",
					startFloor: '1',
					currentFloor: '3',
					endFloor: '13',					
					status:'服务中',
					startTime:'2019-09-21 10:02:23',
					endTime:'',
					expectedTime:'10',
					usedTime:'3分23秒',
					elevator:'2',
					expectedCost:'5',
					cost:'10',
				},{
					building: "森禾广场A座",
					startFloor: '1',
					currentFloor: '3',
					endFloor: '13',					
					status:'已结束',
					startTime:'2019-09-21 10:02:23',
					endTime:'2019-09-21 11:02:23',
					expectedTime:'10',
					usedTime:'3分23秒',
					elevator:'2',
					expectedCost:'5',
					cost:'10',
				}]
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
	@import "../../assets/scss/elevatorRecord";
</style>