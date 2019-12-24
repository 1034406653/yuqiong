<template>
	<div class="information_page">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="portrait">
			<span class="lebal">头像</span>
			<img :src="$store.state.headImg" alt="用户头像" class="portrait_img" />
			<img src="@/assets/img/icon_next.png" class="icon_next" />
			<div class="borde"></div>
			<input class="headInput" ref="inputer" type="file" accept="image/*" @change="handleFileChange($event)" />
		</div>
		<div class="input_box">
			<span class="lebal">ID</span>
			<div class="inputItem">
				<p>{{$store.state.userid}}</p>
				<div class="borde"></div>
			</div>
		</div>
		<div class="input_box">
			<span class="lebal">姓名</span>
			<div class="inputItem" @click="$router.push('/information/realName')">
				<p>{{$store.state.realName}}</p>
				<div class="borde"></div>
				<img src="@/assets/img/icon_next.png" class="icon_next" />
			</div>
		</div>
		<div class="input_box">
			<span class="lebal">身份证</span>
			<div class="inputItem" @click="$router.push('/information/certificateNo')">
				<p>{{$store.state.certificateNo}}</p>
				<div class="borde"></div>
				<img src="@/assets/img/icon_next.png" class="icon_next" />
			</div>
		</div>
		<div class="input_box">
			<span class="lebal">我的单位</span>
			<div class="inputItem" @click="$router.push('/information/company')">
				<p>{{$store.state.company}}</p>
				<img src="@/assets/img/icon_next.png" class="icon_next" />
			</div>
		</div>
		<div class="input_box top30">
			<span class="lebal">手机绑定</span>
			<div class="inputItem">
				<p v-if="$store.state.bind" @click="$router.push('unBindPhone')">去解绑</p>
				<p v-if="!$store.state.bind" @click="$router.push('/bindPhone')">去绑定</p>
				<img src="@/assets/img/icon_next.png" class="icon_next" />
			</div>
		</div>
	</div>
</template>

<script>
	import HeaderNav from './common/headerNav'
	import { DealImage,DataURLtoFile } from '../../static/uploadImg.js'
	export default {
		name: 'information',
		data() {
			return {
				head_pic: require("../assets/img/head_portrait.png"),
				userName: "",
			}
		},
		components: {
			HeaderNav,
		},		
		methods: {
			navBack() {
				this.$router.push('/');
			},
			handleFileChange(event) {
				let that = this;
				let file = event.currentTarget.files[0];
				let reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(e) {
					DealImage(this.result, {
						width: 600
					}, that.newCanvas);
				}
			},
			newCanvas(base64) {
				let param = new FormData();
				let newFile = DataURLtoFile(base64);
				const isLt5M =newFile.size / 1024 / 1024 < 5;				
				if(!isLt5M) {
					return this.$toast('上传图片过大');
				}
				param.append('file', newFile)
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				}
				let postimgUrl = this.$baseURL + 'user/upload';
				this.$toast.loading({
					duration: 0,
					message: '上传中...',
					forbidClick: true,					
				});
				this.$axios.post(postimgUrl, param, config)
					.then(res => {
						console.log(res)
						this.$toast.clear();
						if(res.data.code==200) {
							this.$axios({
								method: 'post',
								url: 'user/bindInfo',
								data: {
									openId: this.$openId,
									customImgUrl: res.data.data.customImgUrl,
								},
							}).then(res2 => {
								console.log(res2)
								if(res2.data.code == 200) {
									if(res2.data.data.flag) {
										this.$store.commit('initHeadImg',res.data.data.customImgUrl)
									}
								} else {
									this.$toast(res.data.msg);
								}
							}).catch(res => {
								this.$toast(res);
								console.log(res)
							});
						}
					}).catch(err => {
						this.$toast.clear();
						console.log(err);
					})
			},
			
		}
	}
</script>

<style lang="scss">
	@import "../assets/scss/information";
</style>