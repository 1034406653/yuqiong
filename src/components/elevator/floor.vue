<template>
	<div class="elevatorFloor">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="elevatorFloor_main">
			<div class="top">
				当前默认楼层：{{defaultFloor}}
			</div>
			<div class="center">
				<p>我的权限楼层：</p>
				<ul>
					<li v-for="(item,index) in floorList" :class="{active:item.active}" @click="handle_change_floor(index)">
						<span>{{item.value}}F</span>
						<b v-if="item.active">默认</b>
					</li>
				</ul>
			</div>
			<ColorBtn @handleBtnClick="handle_submit" class='sub_btn' :btnClassName.sync='btnClassName'>保存</ColorBtn>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import ColorBtn from '../common/colorBtn'
	export default {
		name: "ElevatorFloor",
		components: {
			HeaderNav,
			ColorBtn
		},
		data() {
			return {
				defaultFloor:'',
				floorList: [],
				btnClassName: 'colorBtnBlue',
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$axios({
					method: 'post',
					url: 'elevator/myFloor',
					data: {
						openId: this.$openId,						
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.defaultFloor=res.data.data.defaultFloor || '';
						res.data.data.authFloor.forEach((x,i)=>{
							let active=false;
							if(x==this.defaultFloor){
								active=true;
							}
							this.floorList.push({'value':x,'active':active})
						})
						
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					console.log(res)
				});
			},
			navBack() {
				this.$router.push('/elevator/status');
			},
			handle_change_floor(index) {
				this.floorList.forEach((x, i) => {
					if(i == index) {
						x.active = true;
					} else {
						x.active = false;
					}
				})
			},
			handle_submit() {

			}
		}
	}
</script>

<style lang="scss">
	.elevatorFloor {
		width: 100%;
		height: auto;
		padding-top: 78px;
		color: #333;
		text-align: left;
		.top {
			width: 100%;
			height: 80px;
			margin-bottom: 4px;
			line-height: 80px;
			font-size: 28px;
			background: #fff;
			padding: 0 30px;
		}
		.center {
			width: 100%;
			height: auto;
			background: #fff;
			p {
				line-height: 80px;
				padding-left: 30px;
				font-size: 28px;
			}
			ul {
				width: 100%;
				height: auto;
				padding: 0 30px;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				li {
					width: 161px;
					height: 60px;
					background: #fff;
					border-radius: 4px;
					border: 2px solid #359EF9;
					margin-right: 15px;
					margin-bottom: 20px;
					line-height: 56px;
					color: #359EF9;
					text-align: center;
					font-size: 28px;
					&:nth-of-type(4n) {
						margin-right: 0;
					}
					&.active {
						background: #359EF9;
						color: #fff;
						position: relative;
						b {
							position: absolute;
							right: -2px;
							top: -2px;
							width: 56px;
							height: 28px;
							background: #fff;
							border-radius: 0 4px 0 0;
							font-size: 20px;
							color: #359EF9;
							line-height: 28px;
						}
					}
				}
			}
		}
		.sub_btn {
			width: 600px;
			margin: 120px auto;
		}
	}
</style>