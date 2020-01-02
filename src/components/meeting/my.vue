<template>
	<div class="meetingMy">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingMy_main">
			<van-tabs v-model="navActive"  @click="handle_navChange">
				<van-tab title="我发起的" name="sponsor">我发起的</van-tab>
				<van-tab title="我收到的" name="receive">我收到的</van-tab>
			</van-tabs>
			<ul class="meetingRecord">
				<li v-for="(item,index) in meetingRecord">
					<div class="time">
						{{item.updateTime}}
					</div>
					<div class="card">
						<p>会议日期：{{item.time.split(' ')[0]}}</p>
						<p>会议时间：{{item.time.split(' ')[1]}}</p>
						<p>会议主题：{{item.subject}}</p>
						<p>会议地点：{{item.address}}</p>
						<p>发起人：{{item.sponsorName}}</p>
						<div class="status">
							<span class="status0"  v-if='item.status==0'>待开始</span>
							<span class="status1" v-if='item.status==1'>会议中</span>
							<span v-if='item.status==2'>已结束</span>
							<span v-if='item.status==3'>已取消</span>
							<span class="status4" v-if='item.status==4'>待接受</span>
							<span v-if='item.status==5'>已拒绝</span>
						</div>
						<div class="card_btn"  v-if='item.status==0'>
							签到
						</div>
						<div class="card_btn"  v-if='item.status==1'>
							通行码
						</div>
						<div class="card_btn"  v-if='item.status==4'>
							<span>拒绝</span>
							<b></b>
							<span>接受</span>
						</div>						
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
				//	状态(0待开始，1会议中，2已结束，3已取消)
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
				this.meetingRecord=[];
				let url='meeting/mySponsor';
				if(this.navActive=='receive') url='meeting/myAccept'
				this.$axios({
					method: 'post',
					url: url,
					data: {
						openId:this.$openId,
						pageSiz:this.pageSize,
						pageNumber:this.pageNumber,
					},
				}).then(res => {
					console.log(res)
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
			handle_navChange(){
				this.initList();
			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingMy";
</style>