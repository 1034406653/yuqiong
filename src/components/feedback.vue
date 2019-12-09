<template>
	<div class="feedbackPage">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="title">
			<span>问题和意见</span>
			<b>{{pFeedback.content.length}}/150</b>
		</div>
		<textarea v-model="pFeedback.content" placeholder="请填写10个字以上的问题描述,以便我们提供更好的帮助" @keyup="textChange"></textarea>
		<div class="title">
			<span>图片（选填，提供问题截图）</span>
			<b>{{pic.length}}/3</b>
		</div>
		<div class="pic clearfloat">
			<div class="pic_box" v-for="(item,index) in pic">
				<img src="@/assets/img/feedback_delete.png" class="del" @click="handleDel(index)" />
				<img :src="item" />
			</div>
			<div class="pic_btn" v-if="pic.length<3">
				<img src="@/assets/img/feedback_btn.png" />
				<input class="headInput" ref="inputer" type="file" accept="image/*" @change="handleFileChange($event)" />
			</div>
		</div>
		<div class="title">
			<span>联系手机</span>
		</div>
		<input type="text" v-model="pFeedback.phone" placeholder="选填，便于我们与你联系" />		
		<div class="btn_box">
			<ColorBtn @handleBtnClick="handleSubmit" :btnClassName.sync='btnClassName'>提交</ColorBtn>
		</div>
	</div>
</template>

<script>
	import ColorBtn from './common/colorBtn'
	import HeaderNav from './common/headerNav'
	export default {
		name: "Feedback",
		components: {
			HeaderNav,
			ColorBtn
		},
		data() {
			return {
				pFeedback: {
					content: "",
					phone: "",
				},
				pic: [],
				uploadMessage: "",
				/*按钮*/
				btnClassName:"colorBtnBlue",
			}
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			textChange() {
				if(this.pFeedback.content.length > 150) {
					this.pFeedback.content = this.pFeedback.content.slice(0, 150)
				}
			},
			handleFileChange(event) {
				let that = this;
				let file = event.currentTarget.files[0];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(e) {
					dealImage(this.result, {
						width: 600
					}, that.newCanvas);
				}
			},
			newCanvas(base64) {
				let param = new FormData();
				let newFile = dataURLtoFile(base64);
				console.log(newFile)
				const isLt5M = newFile.size / 1024 / 1024 < 5;
				if(!isLt5M) {
					return Toast('上传图片过大');
				}
				param.append('file', newFile)
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				}
				let postimgUrl = this.$baseURL + 'user/upload';
				Indicator.open({
					text: '上传中...',
					spinnerType: 'fading-circle'
				});
				this.$axios.post(postimgUrl, param, config)
					.then(res => {
						this.$refs.inputer.value = '';
						Indicator.close();
						if(res.data.code == 200) {
							if(res.data.data.customImgUrl) {
								this.pic.push(res.data.data.customImgUrl);
							}
						}
					}).catch(err => {
						Toast(err);
						Indicator.close();
						this.$refs.inputer.value = '';
					})
			},
			handleDel(index) {
				this.pic.splice(index, 1);
			},
			handleSubmit() {
				let feedback = {
					openId: this.$openId
				};
				if(this.pFeedback.content.length < 10) {
					return Toast('问题和意见长度不能小于10');
				} else {
					feedback.content = this.pFeedback.content;
				}
				this.pFeedback.phone=allTrim(this.pFeedback.phone);
				if(this.pFeedback.phone && !reg_phone.test(this.pFeedback.phone)) return Toast('手机号格式不正确');
				if(this.pFeedback.phone) {
					feedback.phone = this.pFeedback.phone;
				}
				this.pic.forEach((x, i) => {
					feedback[`pic${i+1}Url`] = x;
				})
				Indicator.open({
					text: '提交中...',
					spinnerType: 'fading-circle'
				});
				this.$axios({
					method: 'post',
					url: 'user/feedback',
					data: feedback,
				}).then(res => {
					Indicator.close();
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$router.push({
								path: "/hint",
								query: {
									type: "feedbackSuccess"
								}
							})
						} else {
							Toast(res.data.data.msg);
						}
					} else {
						Toast(res.data.msg);
					}
				}).catch(res => {
					Toast(res);
					Indicator.close();
				});
			}
		}
	}
</script>

<style lang="scss">
	.feedbackPage {
		width: 100%;
		text-align: left;
		padding-top: 80px;
		.title {
			width: 100%;
			height: 98px;
			font-size: 32px;
			padding: 0 50px;
			overflow: hidden;
			line-height: 98px;
			span {
				float: left;
			}
			b {
				float: right;
			}
		}
		textarea {
			padding: 30px 50px;
			width: 100%;
			height: 246px;
			font-size: 28px;
			line-height: 48px;
			color: #8B95A2;
			background: #fff;
			border: none;
			outline: none;
			resize: none;
			display: block;
			caret-color: #8B95A2;
		}		
		.pic {
			width: 100%;
			height: 260px;
			background: #fff;
			padding: 18px 33px;
			overflow: hidden;
			.pic_box {
				width: 200px;
				height: 200px;
				float: left;
				margin: 10px;
				position: relative;
				.del {
					position: absolute;
					width: 32px;
					height: 32px;
					top: -10px;
					right: -10px;
				}
			}
			.pic_btn {
				width: 200px;
				height: 200px;
				float: left;
				margin: 10px;
				position: relative;
				img {
					width: 100%;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
				}
				input {
					width: 100%;
					height: 100%;
					display: block;
					opacity: 0;
				}
			}
			img {
				width: 200px;
				height: 200px;
				display: block;
			}
		}
		input {
			display: block;
			width: 100%;
			height: 90px;
			line-height: 50px;
			padding: 20px 50px;
			font-size: 28px;
			color: #8B95A2;
			background: #fff;
			float: right;
			caret-color: #8B95A2;
		}		
		.btn_box{
			text-align: center;
			width: 600px;
			margin: 110px auto;
			margin-bottom: 40px;
		}
	}
</style>