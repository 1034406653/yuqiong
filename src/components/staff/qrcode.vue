<template>
	<div class="qrcodePage" v-show="pageShow">
		<div class="code-box">
			<span>{{name}}</span>
			<div id="QRcanvas" class="card_img"></div>
			<p>扫码可通行闸机、电梯</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Qrcode',
		data() {
			return {
				pageShow:false,
				qrcode: "",
				name: ''
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				this.$axios({
					method: 'post',
					url: 'user/employee/isBind',
					data: {
						openId: this.$openId,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.pageShow=true;
							this.name=res.data.data.name;
							this.qrcode = new QRCode(document.getElementById("QRcanvas"), {
								width: 500,
								height: 500,
							});
							this.qrcode.makeCode(res.data.data.qrCode);
						}else{
							this.$router.push('/staff/bindPhone')
						}
					}
				}).catch(res => {
					console.log(res)
				});
			}
		}
	}
</script>

<style lang="scss">
	.qrcodePage {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		text-align: left;
		.code-box {
			width: 582px;
			height: 812px;
			overflow: hidden;
			background: url('../../assets/img/qrcode_box_bg.png');
			background-size: 100% 100%;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-top: -456px;
			margin-left: -291px;
			span {
				height: 124px;
				line-height: 56px;
				padding-left: 66px;
				padding-top: 68px;
				font-size: 40px;
				display: block;
			}
			.card_img {
				width: 450px;
				height: 450px;
				position: relative;
				margin-left: 66px;
				margin-top: 38px;
				canvas {
					width: 450px !important;
					height: 450px !important;
				}
				img {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
				}
			}
			p {
				height: 50px;
				line-height: 50px;
				font-size: 36px;
				padding-left: 66px;
				margin-top: 100px;
			}
		}
	}
</style>