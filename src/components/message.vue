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
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
				<div slot="pulling" class="refresh-top">
					<img src="@/assets/img/loadTop.gif" />
				</div>
				<div slot="loosing" class="refresh-top">
					<img src="@/assets/img/loadTop.gif" />
				</div>
				<div slot="loading" class="refresh-top">
					<img src="@/assets/img/loadTop.gif" />
				</div>
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

			</van-pull-refresh>

		</div>
	</div>
</template>

<script>
	import HeaderNav from './common/headerNav'
	import Vue from 'vue';
	import { PullRefresh, List } from 'vant';
	Vue.use(PullRefresh);
	Vue.use(List);
	export default {
		name: "Message",
		data() {
			return {
				nomore: false,
				isLoading: false,
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
					this.isLoading = false;
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
						type:this.type,
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
						type:this.type,
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
			handle_change_type(index){
				this.navList.forEach((x,i)=>{
					if(i==index){
						x.active=true;
					}else{
						x.active=false;
					}
				})	
				if(index==0){
					this.type='';
				}else{
					this.type=parseInt(index)-1;
				}
				this.initList();
			}
		},
	}
</script>

<style lang="scss">
	.message_page {
		width: 100%;
		height: auto;
		padding-top: 76px;
		height: 100%;
		.nav_list {
			width: 100%;
			height: 90px;
			display: flex;
			background: #fff;
			margin-top: 2px;
			margin-bottom: 10px;
			li {
				width: 20%;
				height: 90px;
				padding: 0 24px;
				span {
					display: block;
					height: 86px;
					line-height: 86px;
					font-size: 32px;
					font-weight: 500;
				}
				b {
					width: 100%;
					height: 4px;
					background: #359EF9;
					border-radius: 2px;
					display: block;
				}
				&.active {
					span {
						color: #359EF9;
					}
				}
			}
		}
		.list-box {
			width: 100%;
			height: 100%;
			overflow: scroll;
			.li-box {
				min-height: 1100px;
			}
			.van-list {
				ul {
					padding-top: 2px;
					width: 100%;
					li {
						width: 100%;
						height: auto;
						background: #fff;
						padding-top: 14px;
						padding: 24px 30px 10px 38px;
						border-bottom: 2px solid #eee;
						.title {
							width: 100%;
							height: 40px;
							line-height: 40px;
							i {
								float: left;
								display: block;
								width: 14px;
								height: 14px;
								background: rgba(248, 86, 84, 1);
								margin-top: 12px;
								margin-right: 12px;
								border-radius: 50%;
								&.ibgwhite {
									background: transparent;
								}
							}
							span {
								float: left;
								font-size: 32px;
								width: 400px;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								color: rgba(3, 39, 76, 1);
								text-align: left;
							}
							b {
								font-size: 26px;
								color: #97A1AF;
								float: right;
								text-align: right;
							}
						}
						.text {
							margin-top: 13px;
							line-height: 40px;
							font-size: 28px;
							color: rgba(151, 161, 175, 1);
							padding-left: 20px;
							text-align: left;
							margin-bottom: 13px;
						}
					}
				}
			}
		}
	}
</style>