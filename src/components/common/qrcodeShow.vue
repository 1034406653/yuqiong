<template>
	<div @touchmove.prevent>
		<div class="shadow_lxl" v-if="boxShow" @click="handleBoxHide"></div>
		<div class="qrcode_box_modal" v-if="boxShow">
			<p class="title">通行二维码</p>
			<div class="qrcode_image_box">
				<div ref="qrCode" :class="[isFilter ? 'qrcode_image_filter' : '', 'qrcode_image']"></div>
				<div class="filter_hint" v-if="isFilter">
					<img src="@/assets/img/icon_filter.png" />
					<p>未到达访问时间<br />请耐心等候</p>
				</div>
			</div>
			<div class="center_border"></div>
			<span class="left_border"></span>
			<span class="right_border"></span>
			<p class="time_title">有效时间：</p>
			<p class="time_value">{{qrcodeDetails.time}}</p>
		</div>
	</div>

</template>

<script>
	export default {
		name: "QrcodeShow",
		props: {
			id: {
				type: Number,
				default: 0,
			},
		},
		data() {
			return {
				boxShow: "",
				qrcode: "",
				qrcodeDetails: {
					qrCode: "",
					time: ""
				},
				isFilter: true,
			}
		},
		watch: {
			id: {
				handler: function(val, oldval) {
					if(val != 0) {
						this.handleBoxShow(val)
						this.isFilterInit(val)
					}
				},
				deep: true
			},
		},
		methods: {
			handleBoxShow(id) {
				this.$axios({
					method: 'post',
					url: 'guest/appointment/detail',
					data: {
						openId: this.$openId,
						id: id,
					},
				}).then(res => {
					if(res.data.code == 200) {
						this.boxShow = true;
						this.$nextTick(() => {
							this.qrcode = new QRCode(this.$refs.qrCode, {
								width: 500,
								height: 500,
							});
							this.qrcode.makeCode(res.data.data.qrCode);
						})
					} else {
						this.$toast(res.data.msg)
					}
				}).catch(res => {
					console.log(res)
				});
			},
			isFilterInit(id) {
				this.$axios({
					method: 'post',
					url: 'guest/isShowCode',
					data: {
						openId: this.$openId,
						requestId: id,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.qrcodeDetails.time = res.data.data.validPeriod;
						if(res.data.data.flag) {
							this.isFilter = false;
						} else {
							let decTime = parseInt(res.data.data.startTime - res.data.data.currentTime);
							setTimeout(() => {
								this.isFilter = false;
							}, decTime)
						}
					} else {
						this.$toast(res.data.msg)
					}
				}).catch(res => {
					console.log(res)
				});
			},
			handleBoxHide() {
				this.$emit('update:id', 0);
				this.boxShow = false;
			},
		}
	}
</script>

<style lang="scss">
	.qrcode_box_modal {
		position: fixed;
		left: 50%;
		top: 50%;
		margin-top: -405px;
		margin-left: -291px;
		width: 580px;
		height: 760px;
		text-align: left;
		border-radius: 10px;
		z-index: 1001;
		background: url('../../assets/img/visitor/qrcode_box_bg.png');
		background-size: 100% 100%;
		overflow: hidden;
		.title {
			width: 100%;
			height: 56px;
			margin-top: 40px;
			padding-left: 66px;
			font-size: 40px;
			line-height: 56px;
			color: rgba(38, 57, 75, 1);
			margin-bottom: 40px;
		}
		.qrcode_image_box {
			display: block;
			width: 449px;
			height: 449px;
			margin: 0 auto;
			margin-bottom: 72px;
			position: relative;
			.qrcode_image {
				position: absolute;
				left: 0;
				top: 0;
				width: 449px;
				height: 449px;
				display: block;				
				img {
					position: absolute;
					left: 0;
					top: 0;
					display: block;
					width: 449px;
					height: 449px;
				}			
				canvas {
					width: 449px;
					height: 449px;
				}
				
			}
			.qrcode_image_filter {
					filter: blur(20px);
					opacity: 0.4;
				}
			.filter_hint {
				display: block;
				width: 449px;
				height: 449px;
				overflow: hidden;
				img {
					display: block;
					width: 80px;
					height: 80px;
					margin: 0 auto;
					margin-top: 120px;
					margin-bottom: 20px;
				}
				p {
					text-align: center;
					color: #26394B;
					font-size: 36px;
					line-height: 50px;
				}
			}
		}
		.time_title {
			width: 100%;
			height: 40px;
			line-height: 40px;
			padding-left: 66px;
			font-size: 28px;
			color: #26394B;
			font-weight: 600;
		}
		.time_value {
			width: 100%;
			font-size: 24px;
			font-weight: 400;
			line-height: 34px;
			color: rgba(38, 57, 75, 1);
			padding-left: 66px;
		}
	}
</style>