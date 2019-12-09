<template>
	<div class="copyto_page">
		<headerNav @bNavBack="navBack"></headerNav>
		<div class="search_title">
			搜索
		</div>
		<div class="serach_box">
			<img src="@/assets/img/copyto_search.png" class="serach_icon" v-if="!searchWord" />
			<img src="@/assets/img/copyto_clear.png" class="serach_clear" v-if="clearIconShow" />
			<input type="text" v-model="searchWord" placeholder="输入关键词" @focus="handleFocus" />
			<b v-if="cancleShow"></b>
			<span v-if="cancleShow" @click="handleCancle">取消</span>
		</div>
		
		<div class="list_box">
			<ul class="org_list" v-if='!cancleShow'>
				<li v-for="(item,index) in orgList">
					<div class="orgName" v-if="item.employeeInfoList.length>0" @click="handleChangeOrgNameClassName(index)">
						<span>{{item.orgName}}</span>
						<img src="@/assets/img/copyto_icon_up.png" v-if="!item.className" />
						<img src="@/assets/img/copyto_icon_down.png" v-if="item.className" />
					</div>
					<transition name="fade">
						<ul v-if="item.className">
							<li v-for="(item2,index2) in item.employeeInfoList" @click="handleChangeNameClassName(index,index2)">
								<div :class='[item2.className?"active":"","check_box"]'></div>
								<div class="name">
									<p class="p1">{{item2.name}}</p>
									<p class="p2">{{item.orgName}}&nbsp;{{item2.duty}}</p>
								</div>
							</li>
						</ul>
					</transition>
				</li>
			</ul>
			<ul class="name_list" v-if='cancleShow'>
				<li v-for="(item,index) in nameList" @click="handleChangeNameClassName2(index)">
					<div :class='[item.className?"active":"","check_box"]'></div>
					<div class="name">
						<p class="p1">{{item.name}}</p>
						<p class="p2">{{item.orgName}}&nbsp;{{item.duty}}</p>
					</div>
				</li>
			</ul>
		</div>
		<div class="bottom">
			<ColorBtn @handleBtnClick="$router.go(-1)" :btnClassName.sync='btnWhite'>取消</ColorBtn>	
			<ColorBtn @handleBtnClick="handleSubmit" :btnClassName.sync='btnBlue'>确定</ColorBtn>				
		</div>
	</div>
</template>

<script>	
	import ColorBtn from '../common/colorBtn'
	import HeaderNav from '../common/headerNav'
	import Vue from 'vue'
	import Vuetree from 'vue-simple-tree'
	Vue.use(Vuetree)
	export default {
		name: "Copyto",
		components: {
			HeaderNav,
			ColorBtn
		},
		data() {
			return {
				clearIconShow: false,
				cancleShow: false,
				searchWord: "",
				orgList: [],
				nameList: [],
				inviteId: "",
				/*按钮*/
				btnWhite:"colorBtnWhite",
				btnBlue:"colorBtnBlue",
			}
		},
		watch: {
			searchWord: {
				handler: function(val, oldval) {
					if(val.length > 0) {
						this.$axios({
							method: 'post',
							url: 'org/getOrgListByName',
							data: {
								openId: this.$openId,
								name: val,
								pageNumber: 1,
								pageSize: 10000,
							},
						}).then(res => {
							if(res.data.code == 200) {
								let list = res.data.data;
								list.forEach((x, i) => {
									x.className = false;
								})
								this.nameList = list;
							} else {
								this.$toast(res.data.msg);
							}
						}).catch(res => {
							console.log(res)
						});
					}else{
						this.nameList=[];
					}
				},
				deep: true //对象内部的属性监听，也叫深度监听
			},
		},
		mounted() {
			if(this.$route.query.id) {
				this.inviteId = this.$route.query.id;
			} else {
				this.$router.push('/');
			}
			this.init();
		},
		methods: {
			navBack() {
				this.$router.push('/');
			},
			init() {
				this.$axios({
					method: 'post',
					url: 'org/getOrgList',
					data: {
						openId: this.$openId,
						pageSize: 10000,
						pageNumber: 1,
					},
				}).then(res => {
					if(res.data.code == 200) {
						let list = res.data.data;
						list.forEach((x, i) => {
							x.className = false;
							x.employeeInfoList.forEach((y, j) => {
								y.className = false;
							})
						})
						this.orgList = list;
					}
				}).catch(res => {
					console.log(res)
				});
			},
			handleFocus() {
				this.cancleShow = true;
			},
			handleCancle() {
				this.cancleShow = false;
				this.searchWord = '';
				this.nameList = [];
			},
			handleSubmit() {
				let idList = [];
				let nameList = [];
				this.orgList.forEach((x, i) => {
					if(x.employeeInfoList) {
						x.employeeInfoList.forEach((y, j) => {
							if(y.className) {
								idList.push(y.id);
								nameList.push(y.name);
							}
						})
					}
				})
				this.nameList.forEach((x, i) => {
					if(x.className) {
						idList.push(x.id);
						nameList.push(x.name);
					}
				})
				if(idList.length > 0) {					
					this.$axios({
						method: 'post',
						url: 'guest/carbonCopy',
						data: {
							openId: this.$openId,
							ids: idList,
							inviteId: this.inviteId,
						},
					}).then(res => {
						console.log(res)
						if(res.data.code == 200) {
							if(res.data.data.flag) {
								this.$router.push({
									path: "/hint",
									query: {
										type: "copytoSuccess",
										nameList:nameList.join('、'),
									}
								})
							} else {
								this.$toast(res.data.data.msg);
							}
						} else {
							this.$toast(res.data.msg);
						}
					}).catch(res => {
						console.log(res)
					});
				}else{
					this.$toast('请选择抄送人');
				}
			},
			handleChangeOrgNameClassName(index) {
				this.orgList[index].className = !this.orgList[index].className;
			},
			handleChangeNameClassName(index, index2) {
				this.orgList[index].employeeInfoList[index2].className = !this.orgList[index].employeeInfoList[index2].className;
			},
			handleChangeNameClassName2(index) {
				this.nameList[index].className = !this.nameList[index].className;
			}
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/visitorCopyto';
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .2s;
	}	
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>