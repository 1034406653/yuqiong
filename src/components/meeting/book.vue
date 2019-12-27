<template>
	<div class="meetingBook">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingBook_main">
			<div class="input_box">
				<div class="label">
					<span>会议室名称：</span>
				</div>
				<div class="iput_item">
					<p>{{pBook.name}}</p>
				</div>				
				<b class="borde"></b>
			</div>
			<div class="input_box">
				<div class="label">
					<img src="@/assets/img/meeting/icon_necessary.png" />
					<span>开会日期：</span>
				</div>				
				<input type="text" class="input_item" v-model="pBook.day" placeholder="请选择开会日期"/>
				<b class="borde"></b>
			</div>
			<div class="input_box" style="margin-bottom: 40px;">
				<div class="label">
					<span>开会时间：</span>
				</div>
				<input type="text" class="input_item" />
			</div>
			<div class="input_box">
				<div class="label">
					<span>会议主题：</span>
				</div>
				<input type="text" class="input_item" />
			</div>
			<div class="input_box">
				<div class="label">
					<span>会议参与人：</span>
				</div>
				<div class="iput_item">
					<p>未选择</p>
					<i></i>
				</div>
			</div>
			<div class="input_box">
				<div class="label">
					<span>外部参与人数：</span>
				</div>
				<div class="iput_item">
					<van-stepper v-model="aaa" integer />
				</div>
			</div>
			<div class="input_box">
				<div class="label">
					<span>提醒：</span>
				</div>
				<div class="iput_item">
					<p>提前10分钟</p>
					<i></i>
				</div>
			</div>
		</div>
		<div v-if="dateSelectShow" @touchmove.prevent>
			<van-popup v-model="dateSelectShow" position="bottom">
				<van-picker :columns="dateList" :default-index="0" @change="onChangeSelectDate" :item-height='30' v-if='selectTimeShow' />
			</van-popup>
		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import Vue from 'vue';
	import { Stepper } from 'vant';
	Vue.use(Stepper);
	export default {
		name: 'MeetingBook',
		components: {
			HeaderNav,
		},
		data() {
			return {
				aaa: '0',
				dateSelectShow:false,
				pBook :{
					id: '',
					name: '',
				}
			}
		},
		created() {
			if(sessionStorage.getItem("meetingRoomlist")) {
				let ronterJson = JSON.parse(sessionStorage.getItem("meetingRoomlist"));
				this.pBook.id = ronterJson.id;
				this.pBook.day=ronterJson.day || '';
				this.init();
			} else {
				this.$rounter.push('/meeting/roomList')
			}
		},
		methods: {
			navBack() {
				this.$router.go(-1);
			},
			init() {
				this.$axios({
					method: 'post',
					url: 'meeting/detail',
					data: {
						meetingId: this.pBook.id,
						day: '',
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						this.pBook.name=res.data.data.name;
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.$toast('系统出错了');
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingBook";
</style>