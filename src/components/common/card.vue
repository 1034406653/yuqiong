<template>
	<div class="card_list">
		<div v-for='item in list' class="card_item">
			<div class="title_time">
				{{item.displayTime}}
			</div>
			<div class="card" @click="goDetails(item)">
				<div class="card_title">
					<img src="@/assets/img/card_icon1.png" />
					<span v-if='item.currentRequestIdentity==0'>我的访问</span>
					<span v-if='item.currentRequestIdentity==1'>我的邀约</span>
					<span v-if='item.currentRequestIdentity==2'>我的访客</span>
					<b class="unvisit" v-if='item.status=="待访问"'>待访问</b>
					<b class="check" v-if='item.status=="待审核"'>待审核</b>
					<b class="visiting" v-if='item.status=="访问中"'>访问中</b>
					<b v-if='item.status=="已取消"'>已取消</b>
					<b v-if='item.status=="已拒绝"'>已拒绝</b>
					<b v-if='item.status=="已签离"'>已签离</b>
					<b v-if='item.status=="已失效"'>已失效</b>
					<b v-if='item.status=="已超时"'>已超时</b>
				</div>
				<div class="card_time">
					<b v-if='item.status=="待审核"'>预计到访时间</b>
					<p v-if='item.status=="待审核"'> <span>{{item.visitStartTime.slice(0,16)}}</span></p>
					<b v-if='item.status!="待审核"'>访问时间</b>
					<p v-if='item.status!="待审核"'> <span>{{item.visitStartTime.slice(0,16)}}</span> 至 <span>{{item.visitEndTime.slice(0,16)}}</span></p>
				</div>
				<div class="card_company">
					<div class="left">
						<span :class="{noCompany:!item.company}">{{item.name}}</span>
						<b>{{item.company}}</b>
					</div>
					<div class="center">
						<span>访问</span>
						<img src="@/assets/img/card_arrows.png" />
					</div>
					<div class="right">
						<span :class="{noCompany:!item.company}">{{item.receptionistName}}</span>
						<b v-if="item.company">{{item.receptionistCompany}}</b>
					</div>
				</div>
				<ul class="type_list" v-if='item.followList&&item.followList.length>0'>
					<li>
						<span>随访人:</span>
						<b v-for="item2 in item.followList">{{item2.name}}&nbsp;</b>
					</li>
				</ul>
				<ul class="type_list" v-if="item.status=='已签离'">
					<li>
						<span>签离时间:</span>
						<b>{{item.offTime}}</b>
					</li>
				</ul>
				<div class="card_bottom" v-if='item.status=="待访问"&&item.currentRequestIdentity==0'>
					<span @click.stop="handle_qrcode_box_show(item.id)">出示通行二维码</span>
					<b></b>
					<span @click.stop="handleCancelVisit(item)">取消访问</span>
				</div>
				<div class="card_bottom" v-if='item.status=="待访问"&&item.currentRequestIdentity!=0'>
					<span @click.stop="goCopyto(item.id)">抄送</span>
					<b></b>
					<span @click.stop="handleCancelVisit(item)">取消访问</span>
				</div>
				<div class="card_bottom" v-if="item.status=='已取消'&&item.currentRequestIdentity==0">
					<p @click.stop="handleNewVisit(item.id)">重新预约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已取消'&&item.currentRequestIdentity!=0">
					<p @click.stop="handleNewInvite(item.id)">重新邀约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已拒绝'&&item.currentRequestIdentity==0">
					<p @click.stop="handleNewVisit(item.id)">重新预约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已拒绝'&&item.currentRequestIdentity!=0">
					<p @click.stop="handleNewInvite(item.id)">重新邀约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='待审核'&&item.currentRequestIdentity==0">
					<span @click.stop="handleChangeVisit(item)">修改访问</span>
					<b></b>
					<span @click.stop="handleCancelVisit(item)">取消访问</span>
				</div>
				<div class="card_bottom" v-if="item.status=='待审核'&&item.currentRequestIdentity!=0">
					<span @click.stop="handle_refuse_box_show(item.id)" style="width: 25%;">拒绝</span>
					<span @click.stop="handle_othertime_box_show(item)" style="width: 25%;">改期</span>
					<b></b>
					<span @click.stop="handleAgreed(item.id,item.name)">同意</span>
				</div>
				<div class="card_bottom" v-if="item.status=='访问中'&&item.currentRequestIdentity==0">
					<span @click.stop="handle_qrcode_box_show(item.id)">出示通行二维码</span>
					<b></b>
					<span @click.stop="handleSigned(item.id)">签离</span>
				</div>
				<div class="card_bottom" v-if="item.status=='访问中'&&item.currentRequestIdentity!=0">
					<p @click.stop="handleSigned(item.id)">标记签离</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已签离'&&item.currentRequestIdentity==0">
					<p @click.stop="handleNewVisit(item.id)">重新预约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已签离'&&item.currentRequestIdentity!=0">
					<p @click.stop="handleNewInvite(item.id)">重新邀约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已失效'&&item.currentRequestIdentity==0">
					<p @click.stop="handleNewVisit(item.id)">重新预约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已失效'&&item.currentRequestIdentity!=0">
					<p @click.stop="handleNewInvite(item.id)">重新邀约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已超时'&&item.currentRequestIdentity==0">
					<p @click.stop="handleNewVisit(item.id)">重新预约</p>
				</div>
				<div class="card_bottom" v-if="item.status=='已超时'&&item.currentRequestIdentity!=0">
					<p @click.stop="handleNewInvite(item.id)">重新邀约</p>
				</div>
			</div>
		</div>

	</div>

</template>

<script>
	export default {
		name: "Card",
		props: {
			list: {
				type: Array,
				default: [],
			},
		},
		data() {
			return {

			}
		},
		methods: {
			onLoad() {

			},
			/*进入详情*/
			goDetails(item) {
				this.$router.push({
					path: "/visitor/details",
					query: {
						'id': item.id,
						'title': item.status
					}
				})
			},
			/*访客修改访问*/
			handleChangeVisit(item) {
				this.$router.push({
					path: "/visitor/book",
					query: {
						id: item.id
					}
				})
			},
			/*访客重新预约*/
			handleNewVisit(id) {
				this.$router.push({
					path: "/visitor/book",
					query: {
						id_new: id
					}
				})
			},
			/*重新邀约*/
			handleNewInvite(id) {
				this.$router.push({
					path: "/visitor/invite",
					query: {
						id_new: id
					}
				})
			},
			/*抄送*/
			goCopyto(id) {
				this.$router.push({
					path: "/visitor/copyto",
					query: {
						'id': id
					}
				})
			},
			/*同意申请*/
			handleAgreed(id, name) {
				this.$dialog.confirm({
					message: '确定要同意' + name + '的访问？',
				}).then(() => {
					this.$toast.loading({
						duration: 0,
						message: '提交中...',
						forbidClick: true,
						loadingType: 'spinner'
					});
					this.$axios({
						method: 'post',
						url: 'guest/appointment/audit',
						data: {
							openId: this.$openId,
							id: id,
							audit: "agree",
						},
					}).then(res => {
						this.$toast.clear();
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$toast(res.data.data.msg)
								this.$emit('initList');
							} else {
								this.$toast(res.data.data.msg)
							}
						} else {
							this.$toast(res.data.msg)
						}						
					}).catch(res => {
						this.$toast.clear();
					});
				}).catch(() => {
					// on cancel
				});

			},
			/*取消访问*/
			handleCancelVisit(item) {
				this.$dialog.confirm({
					message: '确定要取消访问吗？'
				}).then(() => {
					this.$toast.loading({
						duration: 0,
						message: '提交中...',
						forbidClick: true,
						loadingType: 'spinner'
					});
					this.$axios({
						method: 'post',
						url: 'guest/appointment/cancel',
						data: {
							openId: this.$openId,
							id: item.id,
						},
					}).then(res => {
						this.$toast.clear();
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "bookCancelSuccess",
									}
								})
							} else {
								this.$toast(res.data.data.msg)
							}
						} else {
							this.$toast(res.data.msg)
						}
					}).catch(res => {
						this.$toast.clear();
						console.log(res)
					});
				}).catch(() => {
					// on cancel
				});
			},
			/*签离*/
			handleSigned(id) {
				this.$dialog.confirm({
					message: '确定标记签离？标记后访客出去后不可再进入'
				}).then(() => {
					this.$toast.loading({
						duration: 0,
						message: '提交中...',
						forbidClick: true,
						loadingType: 'spinner'
					});
					this.$axios({
						method: 'post',
						url: 'guest/appointment/signOut',
						data: {
							openId: this.$openId,
							id: id,
						},
					}).then(res => {
						this.$toast.clear();
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "signedSuccess",
									}
								})
							} else {
								this.$toast(res.data.data.msg)
							}
						} else {
							this.$toast(res.data.msg)
						}
					}).catch(res => {
						this.$toast.clear();
						this.$toastLxl.show(res)
					});
				}).catch(() => {
					// on cancel
				});

			},
			/*改期*/
			handle_othertime_box_show(item) {
				this.$emit('handleOthertimeBoxShow', item);
			},
			/*拒绝*/
			handle_refuse_box_show(id) {
				this.$emit('handleRefuseBoxShow', id);
			},
			/*显示二维码*/
			handle_qrcode_box_show(id) {
				this.$emit('handleQrcodeBoxShow', id);
			},
		}
	}
</script>

<style lang="scss">
	.card_list {
		width: 705px;
		margin: 0 auto;
		height: auto;
		overflow: hidden;
		.card_item {
			width: 100%;
			height: auto;
			.title_time {
				width: 100%;
				line-height: 68px;
				height: 62px;
				font-size: 28px;
				color: rgba(193, 199, 207, 1);
			}
			.card {
				width: 100%;
				height: auto;
				background: rgba(255, 255, 255, 1);
				border-radius: 10px;
				.card_title {
					width: 100%;
					height: 94px;
					padding-top: 26px;
					img {
						width: 40px;
						height: 40px;
						margin: 2px 12px 0 28px;
						float: left;
					}
					span {
						float: left;
						font-size: 32px;
						color: rgba(3, 39, 76, 1);
						line-height: 44px;
						letter-spacing: 2px;
						height: 44px;
						font-weight: 600;
					}
					b {
						float: right;
						width: 100px;
						height: 40px;
						line-height: 42px;
						background: #F2F2F2;
						border-radius: 6px;
						color: #262626;
						font-size: 24px;
						margin: 2px 16px 0 0;
					}
					.unvisit {
						color: rgba(255, 109, 109, 1);
						background: rgba(255, 221, 221, 1);
					}
					.check {
						color: #FFA743;
						background: rgba(255, 240, 221, 1);
					}
					.visiting {
						color: #4DA5F7;
						background: rgba(221, 251, 255, 1);
					}
				}
				.card_time {
					width: 100%;
					height: 40px;
					line-height: 40px;
					overflow: hidden;
					padding: 0 26px;
					b {
						float: left;
						color: #97A1AF;
						font-size: 28px;
					}
					p {
						float: left;
						padding-left: 16px;
						color: #03274C;
						font-size: 28px;
						font-weight: 500;
						span {
							padding: 0 4px;
						}
					}
				}
				.card_company {
					width: 100%;
					height: 146px;
					overflow: hidden;
					padding: 26px 40px;
					.left {
						width: 230px;
						height: auto;
						float: left;
						text-align: right;
						span {
							display: block;
							width: 100%;
							height: 40px;
							font-size: 28px;
							font-weight: 600;
							color: rgba(3, 39, 76, 1);
							line-height: 40px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							&.noCompany {
								height: 74px;
								line-height: 106px;
							}
						}
						b {
							display: block;
							width: 100%;
							height: 34px;
							color: rgba(133, 145, 160, 1);
							line-height: 34px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-size: 28px;
						}
					}
					.center {
						width: 162px;
						float: left;
						span {
							height: 24px;
							font-size: 24px;
							display: block;
							font-weight: 400;
							color: rgba(133, 145, 160, 1);
							line-height: 24px;
							margin-top: 8px;
						}
						img {
							display: block;
							margin: 0 auto;
							margin-top: 8px;
							width: 102px;
							height: 24px;
						}
					}
					.right {
						width: 230px;
						text-align: left;
						float: left;
						span {
							display: block;
							height: 40px;
							font-size: 28px;
							font-weight: 600;
							color: rgba(3, 39, 76, 1);
							line-height: 40px;
							&.noCompany {
								height: 74px;
								line-height: 106px;
							}
						}
						b {
							display: block;
							width: 100%;
							height: 34px;
							font-size: 28px;
							color: rgba(133, 145, 160, 1);
							line-height: 34px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
				.type_list {
					width: 660px;
					margin: 0 auto;
					height: auto;
					li {
						text-align: left;
						width: 100%;
						border-top: 2px solid #F2F2F2;
						height: 64px;
						line-height: 62px;
						color: #97a1af;
						padding-left: 4px;
						font-size: 28px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						b {
							color: #03274C;
						}
					}
				}
				.card_bottom {
					width: 660px;
					height: 94px;
					margin: 0 auto;
					border-top: 2px solid #F2F2F2;
					position: relative;
					height: 94px;
					line-height: 92px;
					font-size: 32px;
					color: #03274C;
					b {
						position: absolute;
						width: 2px;
						height: 47px;
						top: 22px;
						left: 49.55%;
						background: rgba(242, 242, 242, 1);
					}
					span {
						width: 50%;
						float: left;
						height: 92px;
					}
					p {
						height: 92px;
					}
				}
			}
		}
	}
</style>