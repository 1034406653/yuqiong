<template>
	<div class="message_page">
		<headerNav @bNavBack="navBack"></headerNav>
		<ul class="nav_list">
			<li v-for="(item,index) in navList" :class="{active:item.active}" @click="handle_change_type(index)">
				<span>{{item.value}}</span>
				<b v-if='item.active'></b>
			</li>
		</ul>
		<div class="list-box">
			<div class="li-box">
				<van-list v-model="loading" :finished="finished" finished-text="" @load="onLoadBottom">
					<ul>
						<li v-for="item in newsList" @click.stop="goDetails(item)">
							<div class="title">
								<i :class='{"ibgwhite":item.isRead==1}'></i>
								<span>{{item.title}}</span>
								<b>{{item.displayTime}}</b>
							</div>
							<div class="text">
								{{item.content}}
							</div>
						</li>
					</ul>
				</van-list>
				<div class="nomore" v-if="nomore">没有更多了</div>
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from './common/headerNav'
	import Vue from 'vue';
	import { List } from 'vant';
	
	Vue.use(List);
	export default {
		name: "Message",
		data() {
			return {
				nomore: false,				
				loading: false,
				finished: false,
				type: "",
				pageNumber: 1,
				newsList: [],
				navList: [{
					active: true,
					value: '全部',
				}, {
					active: false,
					value: '访客',
				}, {
					active: false,
					value: '停车',
				}, {
					active: false,
					value: '梯控',
				}, {
					active: false,
					value: '会议',
				}, ]
			}
		},
		components: {
			HeaderNav,
		},
		mounted() {
			this.initList();
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			onRefresh() {
				setTimeout(() => {					
					this.initList();
				}, 500);
			},
			/*loadmore*/
			onLoadBottom() {
				this.finished = true;
				this.$axios({
					method: 'post',
					url: 'user/getMessageList',
					data: {
						openId: this.$openId,
						pageSize: 10,
						type: this.type,
						pageNumber: this.pageNumber,
					},
				}).then(res => {
					this.loading = false;
					if(res.data.code == 200) {
						this.pageNumber += 1;
						if(res.data.data.length < 10) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.finished = false;
							this.nomore = false;
						}
						this.newsList = this.newsList.concat(res.data.data);
					}
				}).catch(res => {
					this.loading = false;
					this.finished = false;
					console.log(res)
				});
			},
			initList() {
				this.finished = true;
				this.newsList = [];
				this.pageNumber = 1;
				this.$axios({
					method: 'post',
					url: 'user/getMessageList',
					data: {
						openId: this.$openId,
						pageSize: 10,
						type: this.type,
						pageNumber: this.pageNumber,
					},
				}).then(res => {
					if(res.data.code == 200) {
						this.loading = false;
						this.pageNumber += 1;
						if(res.data.data.length < 10) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.finished = false;
							this.nomore = false;
						}
						this.newsList = res.data.data;
					}
				}).catch(res => {
					this.loading = false;
					this.finished = false;
					console.log(res)
				});
			},
			goDetails(item) {
				if(item.isRead == "0") {
					this.$axios({
						method: 'post',
						url: 'user/message/click',
						data: {
							openId: this.$openId,
							id: item.id,
						},
					}).then(res => {
						console.log(res)
					}).catch(res => {
						console.log(res)
					});
				}
				this.$router.push({
					path: "visitor/details",
					query: {
						'id': item.guestRequestId,
						'title': item.title
					}
				})
			},
			handle_change_type(index) {
				this.navList.forEach((x, i) => {
					if(i == index) {
						x.active = true;
					} else {
						x.active = false;
					}
				})
				if(index == 0) {
					this.type = '';
				} else {
					this.type = parseInt(index) - 1;
				}
				this.initList();
			}
		},
	}
</script>

<style lang="scss">
	@import '../assets/scss/message';
</style>