<template>
	<div class="details_page book_page" ref='details_page'>
		<headerNav @bNavBack="navBack"></headerNav>
		<div v-if="detailsData.status=='待访问'|| detailsData.status=='访问中'">
			<div class="qrcode_title">
				通行二维码
			</div>
			<div class="qrcode_image_box">
				<div ref="qrCode" :class="[isFilter ? 'qrcode_image_filter' : '', 'qrcode_image']"></div>
				<div class="filter_hint" v-if="isFilter">
					<img src="@/assets/img/icon_filter.png" />
					<p>未到达访问时间<br />请耐心等候</p>
				</div>
			</div>
			<div class="effective_time">
				有效时间: <span>{{validPeriod}}</span>
			</div>
			<div class="code_box" id="url">
				<ul class="btn_list">
					<li v-for="(item,index) in code_list" @click="handleChangeQrcode(index)">
						<span>复制{{item.name}}</span>
						<div ref='linkInput' class="btn">{{item.link}}</div>						
					</li>
				</ul>
			</div>
		</div>
		<div class="details_title" @click="listShow.visitor=!listShow.visitor">
			<span>访客信息</span>
			<img src="@/assets/img/detailes_up.png" v-if="listShow.visitor" />
			<img src="@/assets/img/detailes_down.png" v-if="!listShow.visitor" />
		</div>
		<div v-if="listShow.visitor" class="details_list_box">
			<div class="input_box">
				<span class="label_lxl">访客姓名</span>

				<span class="input_item">{{detailsData.name}}</span>
			</div>
			<div class="input_box">
				<span class="label_lxl">访客手机</span>

				<span class="input_item">{{detailsData.phone}}</span>
			</div>
			<div class="input_box" v-if="detailsData.certificateNo">
				<span class="label_lxl">身份证号</span>

				<span class="input_item">{{detailsData.certificateNo}}</span>
			</div>
			<div class="input_box" v-if="detailsData.company">
				<span class="label_lxl">访客单位</span>

				<span class="input_item">{{detailsData.company}}</span>
			</div>
			<div class="input_box" v-if="detailsData.dictidReason">
				<span class="label_lxl">来访事由</span>
				<span class="input_item">{{detailsData.dictidReason}}</span>
			</div>
			<div class="input_box">
				<span class="label_lxl">预计到访时间</span>
				<span class="input_item">{{detailsData.planComingTime}}</span>
			</div>
			<div class="input_box" v-if="detailsData.followList.length>0">
				<span class="label_lxl">随访人</span>
				<div class="input_item followList_item" @click="goDetails_followList">{{detailsData.followList.length}}人</div>
				<img src="@/assets/img/icon_next.png" class="icon_next icon_followList" />
			</div>
		</div>
		<div class="details_title" @click="listShow.interviewee=!listShow.interviewee">
			<span>被访人信息</span>
			<img src="@/assets/img/detailes_up.png" v-if="listShow.interviewee" />
			<img src="@/assets/img/detailes_down.png" v-if="!listShow.interviewee" />
		</div>
		<div v-if="listShow.interviewee" class="details_list_box">
			<div class="input_box">
				<span class="label_lxl">被访公司</span>

				<span class="input_item">{{detailsData.receptionistCompany}}</span>
			</div>
			<div class="input_box">
				<span class="label_lxl">被访人姓名</span>

				<span class="input_item">{{detailsData.receptionistName}}</span>
			</div>
			<div class="input_box">
				<span class="label_lxl">被访人手机</span>
				<span class="input_item">{{detailsData.receptionistPhone}}</span>
			</div>
		</div>
		<div class="details_title" @click="listShow.visit=!listShow.visit" v-if="detailsData.status=='已超时'||detailsData.status=='待访问'||detailsData.status=='访问中'||detailsData.status=='已签离'||detailsData.status=='已失效'">
			<span>访问信息</span>
			<img src="@/assets/img/detailes_up.png" v-if="listShow.visit" />
			<img src="@/assets/img/detailes_down.png" v-if="!listShow.visit" />
		</div>
		<div v-if="listShow.visit" class="details_list_box">
			<div class="input_box" v-if="detailsData.status=='已超时'">
				<span class="label_lxl">超时时间</span>

				<span class="input_item">{{detailsData.operateTime}}</span>
			</div>
			<div class="input_box" v-if="detailsData.status=='待访问'||detailsData.status=='访问中'||detailsData.status=='已签离'||detailsData.status=='已失效'">
				<span class="label_lxl">受访开始时间</span>

				<span class="input_item">{{detailsData.visitStartTime}}</span>
			</div>
			<div class="input_box" v-if="detailsData.status=='待访问'||detailsData.status=='访问中'||detailsData.status=='已签离'||detailsData.status=='已失效'">
				<span class="label_lxl">受访结束时间</span>

				<span class="input_item">{{detailsData.visitEndTime}}</span>
			</div>
			<div class="input_box" v-if="detailsData.status=='待访问'||detailsData.status=='访问中'||detailsData.status=='已签离'||detailsData.status=='已失效'">
				<span class="label_lxl">访问次数</span>
				<span class="input_item"><span v-if='detailsData.visitTimes==0'>不限</span><span v-if='detailsData.visitTimes!=0'>{{detailsData.visitTimes}}次</span></span>
			</div>
		</div>
		<div class="details_title" v-if="detailsData.status=='访问中'||detailsData.status=='已签离'||detailsData.status=='已拒绝'||detailsData.status=='已取消'" @click="listShow.operate=!listShow.operate">
			<span>操作信息</span>
			<img src="@/assets/img/detailes_up.png" v-if="listShow.operate" />
			<img src="@/assets/img/detailes_down.png" v-if="!listShow.operate" />
		</div>
		<div v-if="listShow.operate" class="details_list_box">
			<div class="input_box" v-if="detailsData.status=='访问中'||detailsData.status=='已签离'">
				<span class="label_lxl">签到时间</span>

				<span class="input_item">{{detailsData.signInTime}}</span>
			</div>
			<div class="input_box" v-if="detailsData.status=='访问中'||detailsData.status=='已签离'">
				<span class="label_lxl">进出次数</span>

				<span class="input_item followList_item" @click="goDetails_inOutDataList">{{detailsData.inOutDataList.length}}</span>
				<img src="@/assets/img/icon_next.png" class="icon_next icon_followList" />
			</div>
			<div class="input_box" v-if="detailsData.status=='已签离'">
				<span class="label_lxl">签离时间</span>

				<span class="input_item">{{detailsData.signOutTime}}</span>
			</div>
			<div v-if="detailsData.status=='已拒绝'">
				<div class="input_box">
					<span class="label_lxl">拒绝理由</span>

					<span class="input_item">{{detailsData.refuseReason}}</span>
				</div>
				<div class="input_box">
					<span class="label_lxl">拒绝时间</span>

					<span class="input_item">{{detailsData.operateTime}}</span>
				</div>
				<div class="input_box">
					<span class="label_lxl">操作人</span>
					<span class="input_item">{{detailsData.operator}}</span>
				</div>
			</div>
			<div v-if="detailsData.status=='已取消'">
				<div class="input_box">
					<span class="label_lxl">取消时间</span>
					<span class="input_item">{{detailsData.operateTime}}</span>
				</div>
				<div class="input_box" v-if="detailsData.operator">
					<span class="label_lxl">操作人</span>
					<span class="input_item">{{detailsData.operator}}</span>
				</div>
			</div>
		</div>

		<!--访客待访问-->
		<div class="btn_box_1" v-if="detailsData.status=='待访问'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleCancelVisit" :btnClassName.sync='btnBlue'>取消访问</ColorBtn>
		</div>

		<!--审核人待访问-->
		<div class="btn_box_2" v-if="detailsData.status=='待访问'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="goCopyto" :btnClassName.sync='btnWhite'>抄送</ColorBtn>
			<ColorBtn @handleBtnClick="handleCancelVisit" :btnClassName.sync='btnBlue'>取消访问</ColorBtn>
		</div>

		<!--访客已取消-->
		<div class="btn_box_1" v-if="detailsData.status=='已取消'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleNewBook" :btnClassName.sync='btnBlue'>重新预约</ColorBtn>
		</div>

		<!--审核人已取消-->
		<div class="btn_box_1" v-if="detailsData.status=='已取消'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="handleNewInvite" :btnClassName.sync='btnBlue'>重新邀约</ColorBtn>
		</div>

		<!--访客已拒绝-->
		<div class="btn_box_1" v-if="detailsData.status=='已拒绝'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleNewBook" :btnClassName.sync='btnBlue'>重新预约</ColorBtn>
		</div>

		<!--审核人已拒绝-->
		<div class="btn_box_1" v-if="detailsData.status=='已拒绝'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="handleNewInvite" :btnClassName.sync='btnBlue'>重新邀约</ColorBtn>
		</div>

		<!--访客待审核-->
		<div class="btn_box_2" v-if="detailsData.status=='待审核'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleCancelVisit" :btnClassName.sync='btnWhite'>取消访问</ColorBtn>
			<ColorBtn @handleBtnClick="handleChangeBook" :btnClassName.sync='btnBlue'>修改访问</ColorBtn>
		</div>

		<!--审核人待审核-->
		<div class="btn_box_2" v-if="detailsData.status=='待审核'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="handle_refuse_box_show()" :btnClassName.sync='btnWhite'>拒绝</ColorBtn>
			<ColorBtn @handleBtnClick="handleAgreed" :btnClassName.sync='btnBlue'>同意</ColorBtn>
		</div>

		<!--访客访问中-->
		<div class="btn_box_1" v-if="detailsData.status=='访问中'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleSigned" :btnClassName.sync='btnBlue'>签离</ColorBtn>
		</div>

		<!--审核人访问中-->
		<div class="btn_box_1" v-if="detailsData.status=='访问中'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="handleSigned" :btnClassName.sync='btnBlue'>标记签离</ColorBtn>
		</div>

		<!--访客已签离-->
		<div class="btn_box_1" v-if="detailsData.status=='已签离'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleNewBook" :btnClassName.sync='btnBlue'>重新预约</ColorBtn>
		</div>

		<!--审核人已签离-->
		<div class="btn_box_1" v-if="detailsData.status=='已签离'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="handleNewInvite" :btnClassName.sync='btnBlue'>重新邀约</ColorBtn>
		</div>

		<!--访客已失效-->
		<div class="btn_box_1" v-if="detailsData.status=='已失效'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleNewBook" :btnClassName.sync='btnBlue'>重新预约</ColorBtn>
		</div>

		<!--审核人已失效-->
		<div class="btn_box_1" v-if="detailsData.status=='已失效'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="handleNewInvite" :btnClassName.sync='btnBlue'>重新邀约</ColorBtn>
		</div>

		<!--访客已超时-->
		<div class="btn_box_1" v-if="detailsData.status=='已超时'&&detailsData.currentRequestIdentity=='0'">
			<ColorBtn @handleBtnClick="handleNewBook" :btnClassName.sync='btnBlue'>重新预约</ColorBtn>
		</div>

		<!--审核人已超时-->
		<div class="btn_box_1" v-if="detailsData.status=='已超时'&&detailsData.currentRequestIdentity!='0'">
			<ColorBtn @handleBtnClick="handleNewInvite" :btnClassName.sync='btnBlue'>重新邀约</ColorBtn>
		</div>

		<!--拒绝-->
		<Refuse :boxShow.sync='refuseBoxShow' :id='id' @initList='refuse_success'></Refuse>
	</div>
</template>

<script>
	import ColorBtn from '../common/colorBtn'
	import HeaderNav from '../common/headerNav'
	import Refuse from '../common/refuse'
	import ClipboardJS from 'clipboard'
	export default {
		name: "VisitorDetails",
		data() {
			return {
				id: 0,
				code_list: [],
				link_list: [],
				qrcode: "",
				validPeriod: "",
				isFilter: true,
				shadow_show: false,
				listShow: {
					visitor: false,
					interviewee: false,
					visit: false,
					operate: false,
				},
				detailsData: {
					certificateNo: "",
					company: "",
					dictidReason: "",
					followList: [],
					id: '',
					inOutTimes: '',
					name: "",
					openId: "",
					phone: "",
					planComingTime: "",
					qrCode: '',
					receptionistCompany: "",
					receptionistName: "",
					receptionistPhone: "",
					dictidReason: '',
					signInTime: '',
					signOutTime: '',
					status: "",
					visitEndTime: "",
					visitStartTime: "",
					visitTimes: '',
				},
				/*拒绝*/
				refuseBoxShow: false,
				refuseId: 0,
				/*微信签名配置*/
				nonceStr: "",
				timestamp: "",
				timestamp: "",
				/*按钮*/
				btnWhite: "colorBtnWhite",
				btnBlue: "colorBtnBlue",
				/*复制粘贴*/
				clipboard:null,
			}
		},
		components: {
			HeaderNav,
			ColorBtn,
			Refuse,
			ClipboardJS
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				if(this.$route.query.id) {

					this.id = parseInt(this.$route.query.id);
					this.$axios({
						method: 'post',
						url: 'guest/appointment/detail',
						data: {
							openId: this.$openId,
							id: this.id,
						},
					}).then(res => {
						if(res.data.code == 200) {
							document.title = res.data.data.status;
							console.log(res.data.data.status)
							var iframe = document.createElement('iframe')
							iframe.style.display = 'none'
							// 替换成站标favicon路径或者任意存在的较小的图片即可
							iframe.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
							// onload 回调函数
							var iframeCallback = function() {
								setTimeout(function() {
									iframe.removeEventListener('load', iframeCallback)
									document.body.removeChild(iframe)
								}, 0)
							}
							// 定义事件
							iframe.addEventListener('load', iframeCallback)
							document.body.appendChild(iframe)
							this.detailsData = res.data.data;

							res.data.data.followList.forEach((x, i) => {
								this.$axios({
									method: 'post',
									url: 'https://www.best2sit.com/ssit/public/shorturl',
									data: {
										'url': 'https://www.best2sit.com/mp/h5/qrcode.html?id=' + x.id,
									},
								}).then(res2 => {
									console.log(res2)
									if(res.data.code == 200) {
										this.$set(this.code_list, i, {
											'name': x.name,
											'qrCode': x.qrCode,
											'active': false,
											'id': x.id,
											'link': res2.data.data,
										})
										if(i == 0) {
											this.$set(this.code_list[0], 'active', true)
										}
									}
								}).catch(res => {
									console.log(res)
								});
							})
							if(this.detailsData.status == '待访问' || this.detailsData.status == '访问中') {
								this.$nextTick(() => {
									this.qrcode = new QRCode(this.$refs.qrCode, {
										width: 500,
										height: 500,
									});
									this.qrcode.makeCode(res.data.data.qrCode);
								})
								this.$axios({
									method: 'post',
									url: 'guest/isShowCode',
									data: {
										openId: this.$openId,
										requestId: this.id,
									},
								}).then(res => {
									console.log(res)
									if(res.data.code == 200) {
										this.validPeriod = res.data.data.validPeriod;
										if(res.data.data.flag) {
											this.isFilter = false;
										} else {
											let decTime = parseInt(res.data.data.startTime - res.data.data.currentTime);
											setTimeout(() => {
												this.isFilter = false;
											}, decTime)
										}
										console.log(this.isFilter)
									} else {
										this.$toast(res.data.msg);
									}
								}).catch(res => {
									console.log(res)
								});
							}

						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						console.log(res)
					});

				} else {
					this.$router.push('/');
				}
				this.code_list.forEach((x, i) => {
					if(x.active) {
						id = x.id;
					}
				})
			},
			navBack() {
				if(window.history.length <= 1) {
					this.$router.push('/');
					return false
				} else {
					this.$router.go(-1)
				}
			},

			handleChangeQrcode(index) {
				let dom = this.$refs.linkInput[index];
				
				this.clipboard = new ClipboardJS('.btn', {
			        target: function() {
			            return dom;
			        }
			    });
			
			    this.clipboard.on('success', function(e) {
			        console.log(e);
			    });
			
			    this.clipboard.on('error', function(e) {
			        console.log(e);
			    });
				this.$toast('复制成功');
			},

			/*随访人*/
			goDetails_followList() {
				this.$router.push({
					name: "VisitorDetails_followList",
					params: {
						'followList': this.detailsData.followList,
					}
				})
			},
			/*进出次数*/
			goDetails_inOutDataList() {
				this.$router.push({
					name: "VisitorDetails_inOutDataList",
					params: {
						'inOutDataList': this.detailsData.inOutDataList,
					}
				})
			},
			/*取消访问*/
			handleCancelVisit() {
				this.$dialog.confirm({
					message: '确定取消访问吗？'
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
							id: this.id,
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
								this.$toast(res.data.data.msg);;
							}
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						this.$toast.clear();
						console.log(res)
					});
				}).catch(() => {
					// on cancel
				});
			},
			/*拒绝申请*/
			handle_refuse_box_show() {
				this.refuseBoxShow = true;
			},
			refuse_success() {
				this.$router.push('/');
			},
			/*同意访问*/
			handleAgreed() {
				this.$dialog.confirm({
					message: '确定要同意该访问？'
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
							id: this.id,
							audit: "agree",
						},
					}).then(res => {
						this.$toast.clear();
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$toast(res.data.data.msg);;
								setTimeout(() => {
									this.$router.push('/');
								}, 2000)
							} else {
								this.$toast(res.data.data.msg);;
							}
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						this.$toast.clear();
					});
				}).catch(() => {
					// on cancel
				});

			},
			/*签离*/
			handleSigned() {
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
							id: this.id,
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
								this.$toast(res.data.data.msg);;
							}
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						this.$toast.clear();
						console.log(res)
					});
				}).catch(() => {
					// on cancel
				});

			},
			handleNewBook() {
				this.$router.push({
					path: "/visitor/book",
					query: {
						id_new: this.id
					}
				})
			},
			handleChangeBook() {
				this.$router.push({
					path: "/visitor/book",
					query: {
						id: this.id
					}
				})
			},
			handleNewInvite() {
				this.$router.push({
					path: "/visitor/invite",
					query: {
						id_new: this.id
					}
				})
			},
			handleChangeInvite() {
				this.$router.push({
					path: "/visitor/invite",
					query: {
						id: this.id
					}
				})
			},
			goCopyto() {
				this.$router.push({
					path: "/visitor/copyto",
					query: {
						'id': this.detailsData.id
					}
				})
			},

		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/visitorBook';
	@import '../../assets/scss/visitorDetails';
	.copy_link {
		width: 500px;
		height: 40px;
		opacity: 1;
		left: 0;
		top: 0;
		z-index: 1000;
		position: absolute;
		border: 1px solid #ddd;
	}
</style>