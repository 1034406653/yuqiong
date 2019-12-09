<template>
	<div class="inOut_page">
		<headerNav @bNavBack="navBack"></headerNav>
		<ul>
			<li v-for="(item,index) in inOutDataList">
				<div :class="{active:item.show=='进入'}">
					<img src="@/assets/img/inOut_in.png" v-if="item.show=='进入'" />
					<img src="@/assets/img/inOut_out.png" v-if="item.show!='进入'" />
					<span>{{item.inOutTime}}</span>
					<b>{{item.show}}</b>
				</div>
				<p v-if="index<inOutDataList.length-1"></p>
			</li>
		</ul>

	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	export default {
		name: 'VisitorDetails_inOutDataList',
		data() {
			return {
				inOutDataList: [],
			}
		},
		components: {
			HeaderNav,
		},
		mounted() {
			if(this.$route.params.inOutDataList) {
				this.inOutDataList = this.$route.params.inOutDataList;
			} else {
				this.$router.go(-1);
			}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
		}
	}
</script>

<style lang="scss">
	.inOut_page {
		width: 100%;
		height: auto;
		padding-top: 78px;
		ul {
			width: 100%;
			height: auto;
			padding-top: 86px;
			background: #fff;
			padding-bottom: 46px;
			li {
				height: auto;
				div {
					width: 100%;
					height: 44px;
					line-height: 44px;
					overflow: hidden;
					img {
						float: left;
						width: 44px;
						height: 44px;
						margin-left: 92px;
						margin-right: 24px;
					}
					span {
						color: #03274C;
						font-size: 28px;
						float: left;
					}
					b {
						color: #03274C;
						font-size: 28px;
						float: right;
						margin-right: 160px;
						
					}
					&.active {
						span {
							color: #2F4153;
							
						}
						b {
							color: #4DA5F7;
						}
					}
				}
				p{
					width: 3px;
					height: 94px;
					background: #ccc;
					margin-left: 114px;
					margin-top: -2px;
				}
			}
		}
	}
</style>