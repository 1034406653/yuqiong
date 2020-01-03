<template>
	<div class="meetingRoomlist">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="meetingRoomlist_main">
			<div class="meetingRoomlist_shadow" v-if="selectContentShow"></div>
			<div class="select_box">
				<div class="updownBtn" @click="selectContentShow=!selectContentShow">
					<span>高级筛选</span>
					<img src="@/assets/img/meeting/up.png" />
				</div>
				<div :class='[selectContentShow?"selectContent_active":"","select_content"]'>
					<div class="part">
						<div class="title">
							日期/时间
						</div>
						<div class="time_box">
							<div class="select_item">
								<div class="top">
									开会日期
								</div>
								<van-picker :columns="dateList" :default-index="0" @change="onChangeSelectDate" :item-height='30' v-if='selectTimeShow' />
							</div>
							<div class="select_item">
								<div class="top">
									开会时间
								</div>
								<van-picker :columns="timeList" :default-index="0" @change="onChangeSelectTime" :item-height='30' v-if='selectTimeShow' />
							</div>
						</div>
					</div>
					<div class="part">
						<div class="title">
							人数
						</div>
						<ul class="people_list">
							<li :class="{'active':item.active}" v-for="(item,index) in peopleList" @click="handle_selectPeople(index)">
								{{item.label}}
							</li>
						</ul>

					</div>
					<div class="part">
						<div class="title">
							会议室地址
						</div>
						<input type="text" class="roomNumber" placeholder="请输入会议室门牌号" v-model="address" />
					</div>
					<div class="btn_box">
						<div class="reset" @click="handle_reset">
							重置
						</div>
						<div class="submit" @click="handle_search">
							确定
						</div>
					</div>
				</div>
			</div>
			<div class="room_box" v-if='roomList.length>0'>
				<van-list v-model="loading" :finished="finished" finished-text="" @load="onLoadBottom">
					<ul>
						<li v-for="item in roomList" @click="handle_nav_detail(item)">
							<img :src="item.photo" class="room_pic" />
							<div class="room_information">
								<div class="information_left">
									<p class="p1">{{item.name}}</p>
									<p class="p2">{{item.address}}</p>
									<div><span v-for="(item2,index2) in item.assort.split(',')" v-if="index2<2">{{item2}}</span><span>{{item.maxNumber}}人</span></div>
								</div>
								<div class="information_right">
									<p>￥{{item.price}}/半小时</p>
									<span @click.stop="handle_nav_book(item)">预订</span>
								</div>
							</div>
						</li>
					</ul>

				</van-list>
				<p class="nomore" v-if='nomore'>没有更多了~</p>
			</div>
			<div class="nodata" v-if='roomList.length<1'>
				<img src="@/assets/img/meeting/nodata.png"/>
				<p>暂无匹配结果</p>
			</div>

		</div>
	</div>
</template>

<script>
	import HeaderNav from '../common/headerNav'
	import Vue from 'vue';
	import { Picker,List } from 'vant';	
	Vue.use(Picker);
	Vue.use(List);
	export default {
		name: 'MeetingRoomlist',
		data() {
			return {
				selectContentShow: false,
				timeList: ['不限时间'],
				dateList: [],
				selectTimeShow: true,
				maxDays: 30,
				peopleList: [{
					label: '不限',
					active: true,
					value: '0',
				}, {
					label: '1~10人',
					active: false,
					value: '1~10',
				}, {
					label: '11~20人',
					active: false,
					value: '11~20',
				}, {
					label: '21~30人',
					active: false,
					value: '21~30',
				}, {
					label: '31~40人',
					active: false,
					value: '31~40',
				}, {
					label: '41~50人',
					active: false,
					value: '41~50',
				}, {
					label: '51~100人',
					active: false,
					value: '51~100',
				}, {
					label: '100人以上',
					active: false,
					value: '100~1000',
				}],
				address: '',
				day: '',
				hour: '',
				pSelect: {
					openId: '',
					address: '',
					day: '',
					hour: '0',
					number: '0',
					pageSize: 3,
					pageNumber: 1,
				},
				loading: false,
				finished: false,
				nomore: false,
				roomList: [],
			}
		},
		components: {
			HeaderNav,
		},
		created() {
			this.initSelect();
		},
		mounted() {
			this.pSelect.openId = this.$openId;
			this.initList();
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			initSelect() {
				/*获取配置信息*/
				this.$axios({
					method: 'post',
					url: 'meeting/config',
					data: {
						openId: this.$openId,
					},
				}).then(res => {
					console.log(res)
					if(res.data.code == 200) {
						let maxDays = parseInt(res.data.data.subscribeMpAdvanceDays);
						for(let i = 0; i < maxDays; i++) {
							let newDate = new Date();
							newDate.setDate(newDate.getDate() + i);
							let year = newDate.getYear() + 1900;
							let month = newDate.getMonth() + 1;
							let day = newDate.getDate();
							let dateLabel = '';
							let dateValue = year + '-' + checktime(month) + '-' + checktime(day);
							switch(i) {
								case 0:
									dateLabel = '今天' + '(' + checktime(month) + '.' + checktime(day) + ')';
									break;
								case 1:
									dateLabel = '明天' + '(' + checktime(month) + '.' + checktime(day) + ')';
									break;
								default:
									let week = newDate.getDay();
									switch(week) {
										case 0:
											dateLabel = '周日' + '(' + checktime(month) + '.' + checktime(day) + ')';
											break;
										case 1:
											dateLabel = '周一' + '(' + checktime(month) + '.' + checktime(day) + ')';
											break;
										case 2:
											dateLabel = '周二' + '(' + checktime(month) + '.' + checktime(day) + ')';
											break;
										case 3:
											dateLabel = '周三' + '(' + checktime(month) + '.' + checktime(day) + ')';
											break;
										case 4:
											dateLabel = '周四' + '(' + checktime(month) + '.' + checktime(day) + ')';
											break;
										case 5:
											dateLabel = '周五' + '(' + checktime(month) + '.' + checktime(day) + ')';
											break;
										case 6:
											dateLabel = '周六' + '(' + checktime(month) + '.' + checktime(day) + ')';
											break;
										default:
											break;
									}
							}

							this.dateList.push({
								text: dateLabel,
								text2: dateValue
							});
						}
					}
				}).catch(res => {
					console.log(res)
				});
				this.timeList = ['不限时间'];
				for(let i = 0; i < 24; i++) {
					let hour = checktime(i);
					let time1 = hour + ':00';
					let time2 = hour + ':30';
					this.timeList.push({
						text: time1,
						text2: time1 + ':00'
					});
					this.timeList.push({
						text: time2,
						text2: time2 + ':00'
					});
				}
			},
			initList() {
				this.roomList =[];
				this.finished = true;
				this.loading = false;
				this.pSelect.pageNumber = 1;
				this.$toast.loading({
					duration: 0,
					message: '加载中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: 'meeting/search',
					data: this.pSelect,
				}).then(res => {
					
					this.$toast.clear();
					if(res.data.code == 200) {
						this.loading = false;
						this.roomList = res.data.data;
						if(res.data.data.length < 3) {
							this.finished = true;
							this.nomore = true;
						} else {
							this.nomore = false;
							this.finished = false;
						}
						this.pSelect.pageNumber += 1;
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.loading = false;
					this.finished = true;
					this.$toast('系统出错了');
					this.$toast.clear();
				});
			},
			onLoadBottom() {
				this.finished = true;
				this.$axios({
					method: 'post',
					url: 'meeting/search',
					data: this.pSelect,
				}).then(res => {
					if(res.data.code == 200) {						
						if(res.data.data.length < 3) {
							this.finished = true;
							this.nomore = true;	
							this.loading = false;
						} else {
							this.nomore = false;
							this.finished = false;
							this.loading = false;
							this.pSelect.pageNumber += 1;
						}
						this.roomList = this.roomList.concat(res.data.data);
					} else {
						this.$toast(res.data.msg);
					}
				}).catch(res => {
					this.loading = false;
					this.finished = true;
					this.$toast('系统出错了');
				});
			},
			onChangeSelectDate(picker, value, index) {
				this.day = value;
			},
			onChangeSelectTime(picker, value, index) {
				this.hour = value;
			},
			handle_selectPeople(index) {
				this.peopleList.forEach((x, i) => {
					if(i == index) {
						x.active = true;
					} else {
						x.active = false;
					}
				})
			},
			handle_reset() {
				this.selectTimeShow = false;
				this.peopleList.forEach((x, i) => {
					if(i == 0) {
						x.active = true;
					} else {
						x.active = false
					}
				})
				this.address = '';
				this.pSelect = {
					openId: this.$openId,
					address: '',
					day: '',
					hour: '0',
					number: '0',
					pageSize: '3',
					pageNumber: 1,
				};
				this.day = '';
				this.hour = '';
				setTimeout(() => {
					this.selectTimeShow = true;
				}, 50)
			},
			handle_search() {
				this.pSelect.address = this.address;
				this.pSelect.day = this.day.text2 || '';
				this.pSelect.hour = this.hour.text2 || '0';
				this.peopleList.forEach((x, i) => {
					if(x.active) {
						this.pSelect.number = x.value;
					}
				})
				this.initList();
				this.selectContentShow=false;
			},
			handle_nav_detail(item){
				let meetingRoomlistJson = {};
				meetingRoomlistJson.id = item.id;
				if(this.day){
					meetingRoomlistJson.day=this.day
				}				
				let meetingRoomlistStr = JSON.stringify(meetingRoomlistJson);				
				sessionStorage.setItem("meetingRoomIdDay",meetingRoomlistStr);
				this.$router.push("/meeting/room")
			},
			handle_nav_book(item){
				let meetingRoomlistJson = {};
				meetingRoomlistJson.id = item.id;
				if(this.day){
					meetingRoomlistJson.day=this.day.text2;
				}				
				let meetingRoomlistStr = JSON.stringify(meetingRoomlistJson);				
				sessionStorage.setItem("meetingRoomIdDay",meetingRoomlistStr);
				this.$router.push("/meeting/book")
			},
			
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/meetingRoomlist";
</style>