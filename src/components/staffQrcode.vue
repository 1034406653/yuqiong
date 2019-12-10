<template>
	<div class="qrcodePage">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="code-box">
			<span>{{$store.state.realName}}</span>
			<div id="QRcanvas" class="card_img"></div>
			<p>扫码可通行闸机、电梯</p>
		</div>
	</div>
</template>

<script>
	import HeaderNav from './common/headerNav'
	export default {
		name: 'staffQrcode',
		components: {
			HeaderNav,
		},
		data() {
			return {
				qrcode: "",
				name: ''
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {				
				this.qrcode = new QRCode(document.getElementById("QRcanvas"), {
					width: 500,
					height: 500,
				});
				this.qrcode.makeCode(this.$store.state.employeeCode);
			},
			navBack() {
				this.$router.push('/');
			},
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
			background: url('../assets/img/qrcode_box_bg.png');
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