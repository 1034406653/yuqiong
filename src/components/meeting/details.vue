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
					<p><b v-for="item in waitAcceptName">{{item.name}}</b><b v-for="item in waitAcceptName">{{item.name}}</b><b v-for="item in waitAcceptName">{{item.name}}</b></p>
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
					<p class="right_p">共{{outPlayerNumber}}人</p>
				</div>
			</div>
			<div class="borde"></div>
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
			<div class="borde"></div>
			<div class="input_box" v-if='remark'>
				<div class="label">
					<span>备注：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{remark}}</p>
				</div>
			</div>
			<div class="marginBottom20" v-if="serviceList.length>0"></div>
			<div class="input_box" v-if="serviceList.length>0">
				<div class="label">
					<span>服务：</span>
				</div>
				<div class="right_item">
					<p class="right_p"><span v-for="item in serviceList"></span></p>
				</div>
			</div>
			<div class="input_box" v-if="expectFee">
				<div class="label">
					<span>预计费用：</span>
				</div>
				<div class="right_item">
					<p class="right_p">{{expectFee}}元</p>
				</div>
			</div>
		</div>
		<div class="btn_box" v-if="status==0">
			<ColorBtn @handleBtnClick="handle_cancel()" :btnClassName.sync='btnClassNameWhite'>取消</ColorBtn>
			<ColorBtn @handleBtnClick="handle_edit()" :btnClassName.sync='btnClassNameBlue'>修改会议</ColorBtn>
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
				fileInfoList: [],
				subject: '',
				address: '',
				time: '',
				sponsorName: '',
				number: '',
				outPlayerNumber: '',
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
						openid: this.$openid,
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
						this.outPlayerNumber = res.data.data.outPlayerNumber;
						this.fileInfoList = res.data.data.fileInfoList;
						this.remark = res.data.data.remark;
						this.acceptName = res.data.data.acceptName;
						this.waitAcceptName = res.data.data.waitAcceptName;
						this.rejectName = res.data.data.rejectName;
						this.serviceList = res.data.data.serviceList;
						this.expectFee = res.data.data.expectFee;
						this.status = res.data.data.status;
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
				let meetingBookRecordId=this.id;
				sessionStorage.setItem("meetingBookRecordId",meetingBookRecordId)
				this.$router.push('/meeting/book')
			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingDetails";
</style>