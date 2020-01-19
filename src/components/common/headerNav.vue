<template>
	<div class="header_box">
		<div class="header">
			<img src="@/assets/img/base_header_back.png" class="nav_back" @click="navBack" />
			<img src="@/assets/img/base_header_show.png" class="nav_right" @click="nav_page=!nav_page" />
		</div>
		<div class="nav_page" v-show="nav_page">
			<img src="@/assets/img/base_header_close.png" class="nav_page_close" @click="nav_page=!nav_page" />
			<ul>
				<li @click="$router.push('/')">
					<img src="@/assets/img/base_header_icon1.png" />
					<span>个人中心</span>
				</li>
				<!--<li @click="$router.push('/visitor/center')">
					<img src="@/assets/img/base_header_icon1.png" />
					<span>访客中心</span>
				</li>-->
				<li @click="$router.push('/message')">
					<img src="@/assets/img/base_header_icon2.png" />
					<span>消息中心</span>
				</li>
				<li @click="$router.push('/information')">
					<img src="@/assets/img/base_header_icon3.png" />
					<span>个人信息</span>
				</li>
				<li @click="$router.push('/feedback')">
					<img src="@/assets/img/base_header_icon4.png" />
					<span>意见反馈</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: "HeaderNav",
		props: {

		},
		data() {
			return {
				nav_page: false,
			}
		},
		methods: {
			navBack() {
				this.$emit('bNavBack')
			},
		}
	}
</script>

<style lang="scss">
	/*按钮颜色*/
	
	.header_box {		
		width: 100%;
		height: auto;
		.header {
			position: absolute;
			top: 0;	
			left: 0;		
			z-index: 100;
			width: 100%;
			height: 76px;
			border-bottom: 2px solid #FAFAFA;
			background: #fff;
			overflow: hidden;
			.nav_back {
				float: left;
				width: 40px;
				height: 40px;
				margin: 18px 0 0 28px;
			}
			.nav_right {
				float: right;
				width: 40px;
				height: 40px;
				margin: 18px 28px 0 0;
			}
		}
		.nav_page {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1001;
			background: #fff;
			.nav_page_close {
				width: 40px;
				height: 40px;
				position: absolute;
				top: 18px;
				right: 28px;
			}
			ul {
				width: 100%;
				height: auto;
				padding: 0 48px;
				padding-top: 156px;
				li {
					width: 100%;
					height: 140px;
					border-bottom: 2px solid #D8D8D8;
					padding: 74px 0 0 36px;
					img{
						width: 50px;
						height: 50px;
						float: left;
					}
					span {
						margin-left: 6px;
						float: left;
						font-size: 28px;
						font-family: PingFangSC-Regular;
						font-weight: 400;
						color: rgba(3, 39, 76, 1);
						line-height: 48px;
					}
				}
			}
		}
	}
</style>