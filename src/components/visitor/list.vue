<template>
	<div class="listPage">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="header2">
			<ul>
				<li v-for="(item,index) in navList" :class="{active:item.active}" @click="handleNavClick(index)">
					<p>{{item.text}}</p>
					<b></b>
				</li>
			</ul>
		</div>
		<div class="listPage_main">
			<van-list class="card_list" v-model="loading" :finished="finished" finished-text="" @load="onLoadBottom">
				<Card :list='recordList' @initList='onLoadBottom' @handleOthertimeBoxShow='handle_othertime_box_show($event)' @handleRefuseBoxShow='handle_refuse_box_show($event)' @handleQrcodeBoxShow='handle_qrcode_box_show($event)'></Card>
			</van-list>
			<p class="nomore" v-if='nomore'>没有更多了~</p>
		</div>
		<!--二维码-->
		<QrcodeShow :id.sync='qrcodeId'></QrcodeShow>
	</div>
</template>
<script>
	import HeaderNav from '../common/headerNav'
	import Card from '../common/card'
	import QrcodeShow from '../common/qrcodeShow'
	import Vue from 'vue'
	import { List } from 'vant';
	Vue.use(List);
	export default {
		name: 'Center',
		components: {
			HeaderNav,
			Card,
			QrcodeShow
		},
		data() {
			return {
				loading: false,
				finished: false,
				nomore: false,
				navList: [{
					active: true,
					text: "全部",
					status: "",
				}, {
					active: false,
					text: "待审核",
					status: 'waitaudit',
				}, {
					active: false,
					text: "待访问",
					status: 'waitvisit',
				}, {
					active: false,
					text: "已签离",
					status: 'out',
				}, {
					active: false,
					text: "未生效",
					status: 'ineffective',
				}],
				status: "",
				recordList: [],
				pageNumber: 1,

				/*二维码*/
				qrcodeShow: false,
				qrcodeId: 0,
			}
		},
		mounted() {
			let activeIndex = this.$route.params.id || ''
			this.handleNavClick(activeIndex)
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			initList() {				
				this.finished = true;
				this.loading = false;
				this.recordList = [];
				this.pageNumber = 1;
				this.$toast.loading({
					duration: 0,
					message: '加载中...',
					forbidClick: true,
					loadingType: 'spinner'
				});			
				this.$axios({
					method: 'post',
					url: '/guest/appointment/record',
					data: {
						openId: this.$openId,
						pageSize: 10,
						pageNumber: this.pageNumber,
						index: 1,
						status: this.status,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {		
						this.loading = false;
						this.recordList = res.data.data.list;
						if(res.data.data.list.length < 10) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.nomore = false;
							this.finished = false;							
						}
						this.pageNumber += 1;
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
			onLoadBottom() {
				this.finished = true;
				this.$axios({
					method: 'post',
					url: '/guest/appointment/record',
					data: {
						openId: this.$openId,
						pageSize: 10,
						pageNumber: this.pageNumber,
						index: 1,
						status: this.status,
					},
				}).then(res => {					
					if(res.data.code == 200) {						
						this.pageNumber += 1;
						if(res.data.data.list.length < 10) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.nomore = false;
							this.finished = false;
							this.loading=false;
						}
						this.recordList = this.recordList.concat(res.data.data.list);
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.loading=false;
					this.finished = true;										
					this.$toast('系统出错了');
				});
			},
			handleNavClick(index){
				this.navList.forEach((x, i) => {
					if(i == index) {
						this.navList[i].active = true;
						this.status = this.navList[i].status;
					} else {
						this.navList[i].active = false;
					}
				})		
				this.nomore = false;
				this.initList();
			},
			/*显示二维码*/
			handle_qrcode_box_show(id) {
				this.qrcodeId = id;
			},
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	@import "../../assets/scss/visitorCenter";
	@import "../../assets/scss/visitorList";
</style>