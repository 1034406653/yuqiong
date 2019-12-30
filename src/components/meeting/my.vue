<template>
	<div class="meetingMy">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingMy_main">
			<van-tabs v-model="navActive">
				<van-tab title="我发起的" name="a">我发起的</van-tab>
				<van-tab title="我收到的" name="b">我收到的</van-tab>
			</van-tabs>
			<ul class="meetingRecord">
				<li v-for="">
					<div class="time">

					</div>
					<div class="card">

					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import Vue from 'vue';
	import { Tab, Tabs } from 'vant';
	Vue.use(Tab).use(Tabs);
	export default {
		name: 'MeetingMy',
		data() {
			return {
				loading:false,
				nomore:false,
				navActive: 'a',
				meetingRecord: [],
				pageSize:10,
				pageNumber:1,				
			}
		},
		components: {
			HeaderNav
		},
		created(){
			this.initList();
		},
		methods:{
			navBack(){
				this.$router.push('/');
			},
			initList(){
				this.$axios({
					method: 'post',
					url: 'meeting/mySponsor',
					data: {
						openId:this.$openId,
						pageSiz:this.pageSize,
						pageNumber:this.pageNumber,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {
						this.loading = false;
						this.meetingRecord = res.data.data;
						if(res.data.data.length < 3) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.nomore = false;
							this.finished = false;
						}
						this.pList.pageNumber += 1;
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.loading = false;
					this.finished = true;
					this.$toast('系统出错了');
					this.$toast.clear();
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingMy";
</style>