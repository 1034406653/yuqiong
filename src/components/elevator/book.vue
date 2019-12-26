<template>
	<div class="elevatorBook">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="elevatorStatus_main">
			<div class="paddingTop"></div>
			<div class="select_part">
				<div class="title">
					选择出发楼层
				</div>
				<div class="upDown" v-if="elevatorListStart.length>4">
					<img src="@/assets/img/elevator/icon_up.png" v-if="!elevatorListStartShow" @click="elevatorListStartShow=true" />
					<img src="@/assets/img/elevator/icon_down.png" v-if="elevatorListStartShow" @click="elevatorListStartShow=false" />
				</div>
				<ul>
					<li v-for='(item,index) in elevatorListStart' :class="[item.active?'active':'']" v-if="index<4||elevatorListStartShow" @click="handle_elevatorStart(index)">
						{{item.value}}
					</li>
				</ul>
			</div>
			<div class="select_part">
				<div class="title">
					选择目的楼层
				</div>
				<div class="upDown" v-if="elevatorListEnd.length>4">
					<img src="@/assets/img/elevator/icon_up.png" v-if="!elevatorListEndShow" @click="elevatorListEndShow=true" />
					<img src="@/assets/img/elevator/icon_down.png" v-if="elevatorListEndShow" @click="elevatorListEndShow=false" />
				</div>
				<ul>
					<li v-for='(item,index) in elevatorListEnd' :class="[item.active?'active':'']" v-if="index<4||elevatorListEndShow" @click="handle_elevatorEnd(index)">
						{{item.value}}
					</li>
				</ul>
			</div>
			<div class="select_part">
				<div class="title">
					预计使用时长
				</div>
				<ul>
					<li v-for='(item,index) in elevatorListTime' :class="[item.active?'active':'']" @click="handle_elevatorTime(index)">
						{{item.value}}
					</li>
					<li @click="handle_userDefined" v-show='!userDefined'>自定义</li>
					<li v-show='userDefined' class="userdefined"><input type="text" v-model="newTime" onkeyup="this.value=this.value.replace(/[^\d^\.]+/g,'')" ref='userDefinedInput' /><span>分钟</span><b @click="handle_userDefined_confirm">确定</b></li>
				</ul>
			</div>
			<div class="input_box">
				<div class="input_part">
					<div class="top">
						<span class="label">是否开启欢迎语：</span>
						<div @click="welcome.show=!welcome.show">
							<p :class="[welcome.show?'active':'']"><i></i></p>
							<b v-if="welcome.show">开启</b>
							<b v-if="!welcome.show">关闭</b>
						</div>
					</div>
					<input type="text" v-model="welcome.text" v-if="welcome.show" placeholder="请输入欢迎语，不超过20个字" />
				</div>
				<div class="input_part">
					<div class="top">
						<span class="label">备注：(选填）</span>
					</div>
					<input type="text" v-model="remark" placeholder="可输入访客姓名和所属单位" />
				</div>
			</div>
			<div class="pay">
				<span>预计费用：</span><b>{{pay}}元</b>
			</div>
		</div>
		<ColorBtn @handleBtnClick="handle_submit" class='sub_btn' :btnClassName.sync='btnClassName'>提交申请</ColorBtn>
	</div>
</template>
<script>
	import HeaderNav from '../common/headerNav'
	import ColorBtn from '../common/colorBtn'
	export default {
		name: "ElevatorStatus",
		components: {
			HeaderNav,
			ColorBtn
		},
		data() {
			return {
				elevatorListStartShow: false,
				elevatorListStart: [],
				elevatorListEndShow: false,
				elevatorListEnd: [],
				elevatorListTime: [{
					value: '5分钟',
					active: true,
				}, {
					value: '10分钟',
					active: false,
				}, {
					value: '15分钟',
					active: false,
				}, {
					value: '30分钟',
					active: false,
				}, {
					value: '90分钟',
					active: false,
				}, {
					value: '120分钟',
					active: false,
				}],
				newTime: "",
				userDefined: false,
				welcome: {
					show: false,
					text: "",
				},
				remark: "",
				pay: 5,
				btnClassName: 'colorBtnBlue',
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
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
						this.defaultFloor = res.data.data.defaultFloor || '';
						res.data.data.authFloor.forEach((x, i) => {
							let active = false;							
							this.elevatorListEnd.push({
								'value': x,
								'active': active
							})
							this.elevatorListStart.push({
								'value': x,
								'active': active
							})
						})
						
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					console.log(res)
				});
			},
			handle_elevatorStart(index) {
				this.elevatorListStart.forEach((x, i) => {
					if(i != index) {
						x.active = false;
					} else {
						x.active = true;
					}
				})
			},
			handle_elevatorEnd(index) {
				this.elevatorListEnd.forEach((x, i) => {
					if(i != index) {
						x.active = false;
					} else {
						x.active = true;
					}
				})
			},
			handle_elevatorTime(index) {
				this.userDefined = false;
				this.elevatorListTime.forEach((x, i) => {
					if(i != index) {
						x.active = false;
					} else {
						x.active = true;
					}
				})
			},
			handle_userDefined() {
				this.userDefined = true;
				this.newTime = '';
				setTimeout(() => {
					this.$refs.userDefinedInput.focus();
				}, 100)

			},
			handle_userDefined_confirm() {
				this.newTime = Number(this.newTime) || '';
				if(this.newTime && 0 <= this.newTime && this.newTime <= 360) {
					this.elevatorListTime.forEach((x, i) => {
						x.active = false;
					})
					let jsonText = `{"value":"${this.newTime}分钟","active":true}`;
					this.elevatorListTime.push(JSON.parse(jsonText));
					this.userDefined = false;
					this.newTime = '';
				} else {
					this.$toast('请填写0~360');
					this.newTime = '';
				}
			},
			handle_submit() {

			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/elevatorBook";
</style>