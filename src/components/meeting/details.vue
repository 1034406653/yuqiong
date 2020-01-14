<template>
	<div class="meetingDetails">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingDetails_main">
			<div class="input_box">
				<div class="label">
					<span>会议主题：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{subject}}</p>
				</div>
			</div>
			<div class="borde"></div>
			<div class="input_box">
				<div class="label">
					<span>会议时间：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{time}}</p>
				</div>
			</div>
			<div class="borde"></div>
			<div class="input_box">
				<div class="label">
					<span>会议地点：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{address}}</p>
				</div>
			</div>
			<div class="borde"></div>
			<div class="input_box">
				<div class="label">
					<span>发起人：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{sponsorName}}</p>
				</div>
			</div>
			<div class="borde"></div>
			<div class="input_box">
				<div class="label">
					<span>参与人：</span>
				</div>
				<div class="right_item">
					<p class="right_p">共{{number}}人</p>
				</div>
			</div>
			<div class="borde"></div>
			<div class="people">
				<div v-if="acceptName.length>0">
					<span>已接受</span>
					<p><b v-for="item in acceptName">{{item.name}}</b></p>
				</div>
				<div v-if="waitAcceptName.length>0">
					<span>待接受</span>
					<p><b v-for="item in waitAcceptName">{{item.name}}</b></p>
				</div>
				<div v-if="rejectName.length>0">
					<span>已拒绝</span>
					<p><b v-for="item in rejectName">{{item.name}}</b></p>
				</div>
			</div>
			<div class="borde"></div>
			<div class="input_box">
				<div class="label">
					<span>外部参与人数：</span>
				</div>
				<div class="right_item">
					<p class="right_p">共{{outerPlayerNumber}}人</p>
				</div>
			</div>
			<div class="borde" v-if='fileInfoList.length>0'></div>
			<div class="fileList_box" v-if='fileInfoList.length>0'>
				<div class="label">
					<span>会议文件：</span>
				</div>
				<div class="fileList">
					<ul>
						<li v-for='(item,index) in fileInfoList'>
							<div class="main">
								<img class="type" :src="item.fileUrl" v-if="item.fileType=='image'" />
								<img class="type" src="@/assets/img/meeting/ppt.png" v-if="item.fileType=='application/vnd.openxmlformats-officedocument.presentationml.presentation'" />
								<img class="type" src="@/assets/img/meeting/excel.png" v-if="item.fileType=='application/vnd.ms-excel'" />
								<img class="type" src="@/assets/img/meeting/word.png" v-if="item.fileType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'" />
								<div class="information">
									<p>{{item.fileName}}</p>
									<p v-if='item.fileSize'>{{(item.fileSize/1024).toFixed(2)}}KB</p>
								</div>
								<div class="download">
									<img src="@/assets/img/meeting/download.png" />
									<a :href="item.fileUrl" download=""></a>
								</div>
							</div>

						</li>
					</ul>
				</div>
			</div>
			<div class="borde" v-if='remark'></div>
			<div class="input_box" v-if='remark'>
				<div class="label">
					<span>备注：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{remark}}</p>
				</div>
			</div>
			<div class="marginBottom20"></div>
			<div class="spanList_box" v-if="serviceList.length>0">
				<div class="label">
					<span>服务：</span>
				</div>
				<div class="right_item">
					<div class="right_spanList"><span v-for="(item,index) in serviceList">{{item.serviceName}}*{{item.serviceAmount}}<span v-if='index<serviceList.length-1'>、</span></span></div>
				</div>
			</div>
			<div class="borde" v-if="serviceList.length>0"></div>
			<div class="input_box">
				<div class="label">
					<span>预计费用：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{expectFee}}元</p>
				</div>
			</div>
		</div>
		<div class="btn_box" v-if="status==0&&sponsor">
			<ColorBtn @handleBtnClick="handle_cancel()" :btnClassName.sync='btnClassNameWhite'>取消</ColorBtn>
			<ColorBtn @handleBtnClick="handle_edit()" :btnClassName.sync='btnClassNameBlue'>修改会议</ColorBtn>
		</div>
		<div class="btn_box" v-if="status==3&&sponsor">
			<ColorBtn @handleBtnClick="handle_new" :btnClassName.sync='btnClassNameBlue' class='btnSign'>再次预约</ColorBtn>			
		</div>
		<div class="btn_box" v-if="status==2&&sponsor">
			<ColorBtn @handleBtnClick="handle_sign" :btnClassName.sync='btnClassNameWhite'>补登</ColorBtn>	
			<ColorBtn @handleBtnClick="handle_new" :btnClassName.sync='btnClassNameBlue'>再次预约</ColorBtn>
		</div>
		<div class="btn_box" v-if="status==4&&!sponsor">
			<ColorBtn @handleBtnClick="handle_deal(id, 0)" :btnClassName.sync='btnClassNameWhite'>拒绝</ColorBtn>
			<ColorBtn @handleBtnClick="handle_deal(id, 1)" :btnClassName.sync='btnClassNameBlue'>接受</ColorBtn>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import ColorBtn from '../common/colorBtn'
	export default {
		name: 'MeetingDetails',
		components: {
			HeaderNav,
			ColorBtn
		},
		data() {
			return {
				id: '',
				sponsor:false,
				fileInfoList: [],
				subject: '',
				address: '',
				time: '',
				sponsorName: '',
				number: '',
				outerPlayerNumber: '',
				remark: '',
				acceptName: '',
				waitAcceptName: '',
				rejectName: '',
				serviceList: [],
				expectFee: '',
				btnClassNameBlue: 'colorBtnBlue',
				btnClassNameWhite: 'colorBtnWhite',
				status:'',
			}
		},

		created() {
			console.log(this.$openId)
			if(this.$route.query.id) {
				this.id = this.$route.query.id;
			} else {
				this.push('/meeting/my')
			}
			this.init();
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
			init() {
				this.$axios({
					method: 'post',
					url: 'meeting/record/detail',
					data: {
						openId: this.$openId,
						recordId: this.id,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.subject = res.data.data.subject;
						this.time = res.data.data.time;
						this.address = res.data.data.address;
						this.sponsorName = res.data.data.sponsorName;
						this.number = res.data.data.number;
						this.outerPlayerNumber = res.data.data.outerPlayerNumber;
						this.fileInfoList = res.data.data.fileInfoList;
						this.remark = res.data.data.remark;
						this.acceptName = res.data.data.acceptName;
						this.waitAcceptName = res.data.data.waitAcceptName;
						this.rejectName = res.data.data.rejectName;
						this.serviceList = res.data.data.serviceList;
						this.expectFee = res.data.data.expectFee;
						this.status = res.data.data.status;
						this.sponsor=res.data.data.sponsor;
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.$toast('系统出错了');
				});
			},
			handle_download(fileUrl) {
				console.log(fileUrl)
				window.location.href = fileUrl;
			},
			handle_cancel() {
				this.$dialog.confirm({
					message: '确定取消此次会议？ '
				}).then(() => {
					this.$toast.loading({
						duration: 0,
						message: '提交中...',
						forbidClick: true,
						loadingType: 'spinner'
					});
					this.$axios({
						method: 'post',
						url: 'meeting/order/cancel',
						data: {
							openId: this.$openId,
							recordId: this.id,
						},
					}).then(res => {
						this.$toast.clear();
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$toast('会议取消成功！')
								setTimeout(()=>{
									this.$router.push('/meeting/my')
								},2000)								
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
			handle_edit() {
				let meetingBookRecordIdChange=this.id;
				sessionStorage.setItem("meetingBookRecordIdChange",meetingBookRecordIdChange)
				this.$router.push('/meeting/book')
			},
			handle_new(){
				let meetingBookRecordIdNew=this.id;
				sessionStorage.setItem("meetingBookRecordIdNew",meetingBookRecordIdNew)
				this.$router.push('/meeting/book')
			},
			/*同意或拒绝*/
			handle_deal(id, status) {
				if(status == 1) {
					this.dealConfirm(id, status);
				} else {
					this.$dialog.confirm({
						message: '确定拒绝参加本次会议？',
					}).then(() => {
						this.dealConfirm(id, status);
					}).catch(() => {
						// on cancel
					});
				}
			},
			dealConfirm(id, status) {
				this.$toast.loading({
					duration: 0,
					message: '提交中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: 'meeting/acceptOrReject',
					data: {
						openId: this.$openId,
						recordId: id,
						accept: status,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$toast(res.data.data.msg)
							this.initList();
						} else {
							this.$toast(res.data.data.msg)
						}
					} else {
						this.$toast(res.data.msg)
					}
				}).catch(res => {
					this.$toast.clear();
				});
			},
			handle_sign(){
				this.$toast('暂未开发')
			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingDetails";
</style>