<template>
	<div class="refuse_page" @touchmove.prevent>
		<div class="shadow_lxl" v-if="boxShow"></div>
		<div class="modal_box refuse_box" v-show="boxShow">
			<div class="modal_box_title">
				<span>提示</span>
				<img src="@/assets/img/icon_close.png" @click="handle_refuse_box_hide" />
			</div>
			<div class="top_border"></div>
			<div class="modal_box_main">
				<div class="main_title">
					拒绝理由
				</div>
				<div class="radio_box">
					<van-radio-group v-model="refuseValue">
						<van-radio v-for='(item,index) in refuseList' :name="item.value" :key='index'>{{item.label}}</van-radio>
					</van-radio-group>
					<textarea v-model="refusetextareaValue" placeholder="请输入拒绝理由"></textarea>
				</div>
			</div>
			<div class="modal_bottom">
				<span @click="handle_refuse_box_hide">取消</span>
				<b></b>
				<span @click="handle_refuse_conform" style="color: #4DA5F7;">确定</span>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import { RadioGroup, Radio } from 'vant';
	Vue.use(RadioGroup);
	Vue.use(Radio);
	export default {
		name: "Refuse",
		props: {
			boxShow: {
				type: Boolean,
				default: false,
			},
			id: {
				type: Number,
				default: 0,
			},
		},
		data() {
			return {
				refuseValue: "时间不合适",
				refusetextareaValue: "",
				refuseList: [{
						label: '时间不合适',
						value: '时间不合适',
					},
					{
						label: '场地不合适',
						value: '场地不合适'
					},
					{
						label: '合作意向已定',
						value: '合作意向已定'
					},
					{
						label: '其他',
						value: '4'
					}
				],
				loading: null,
			}
		},

		methods: {
			/*拒绝申请*/
			handle_refuse_box_hide() {
				this.$emit('update:boxShow', false);
				this.refuseValue = "时间不合适";
				this.refusetextareaValue = "";
			},
			handle_refuse_conform() {
				let refuseReason = '';
				if(this.refuseValue == 4) {
					refuseReason = this.refusetextareaValue;
					if(!this.refusetextareaValue) {
						refuseReason = "时间不合适"
					};
				} else {
					refuseReason = this.refuseValue;
				}
				this.$toast.loading({
					duration: 0,
					message: '提交中...',
					forbidClick: true,
					loadingType: 'spinner'
				});
				this.$axios({
					method: 'post',
					url: 'guest/appointment/audit',
					data: {
						openId: this.$openId,
						id: this.id,
						audit: "refused",
						refuseReason: refuseReason,
					},
				}).then(res => {
					this.$toast.clear();
					if(res.data.code == 200) {
						if(res.data.data.flag) {
							this.$toast(res.data.data.msg)
							this.handle_refuse_box_hide();
							this.$emit('initList');
						} else {
							this.$toast(res.data.data.msg)
						}
					} else {
						this.$toast(res.data.msg)
					}
				}).catch(res => {
					this.$toast.clear();
				});
			},
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/modal_box';
</style>