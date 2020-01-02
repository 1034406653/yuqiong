<template>
	<div class="hint_page">
		<div v-if="type=='bookSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>恭喜您，预约登记成功！</p>
			<p class="p2">请及时关注微信公众号信息，审核通过后我们将以微信公众号消息推送方式将预约结果发送给您</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>			
		</div>
		<div v-if="type=='feedbackSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>恭喜您，反馈成功！</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>				
		</div>
		<div v-if="type=='book_changeSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>修改预约成功！</p>
			<p class="p2">请及时关注微信公众号信息，审核通过后我们将以微信公众号消息推送方式将预约结果发送给您</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='bookFail'">
			<img src="@/assets/img/hint_fail.png" />
			<p>抱歉！提交失败</p>
			<p class="p2">错误：请与被访人联系</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='bindSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>您的手机绑定成功！</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='bookChangeSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>恭喜您，预约修改成功！</p>
			<p class="p2">请及时关注微信公众号信息，审核通过后我们将以微信公众号消息推送方式将预约结果发送给您</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='bookCancelSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>取消成功！</p>
			<p class="p2">您已取消了此次访问，感谢您的使用！</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='inviteSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>恭喜您邀请成功！</p>
			<p class="p2">您已成功邀约访客，快将这个消息抄送给您的小伙伴们吧！</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="goCopyto" :btnClassName.sync='btnWhite'>抄送</ColorBtn>
			</div>	
			<div class="btn_box" style="margin-top: 16px;">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>返回个人中心</ColorBtn>
			</div>			
		</div>
		<div v-if="type=='signedSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>签离成功！</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='unBindSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>您已解除手机绑定！</p>
			<p class="p2"></p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='copytoSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>抄送成功！</p>
			<p class="p2">已成功抄送给{{nameList}}</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>返回个人中心</ColorBtn>
			</div>			
		</div>
		<div v-if="type=='blackList'">
			<img src="@/assets/img/hint_fail.png" />
			<p>抱歉！提交失败</p>
			<p class="p2">错误：请与被访人联系</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<div v-if="type=='blackListInvite'">
			<img src="@/assets/img/hint_fail.png" />
			<p>抱歉！提交失败</p>
			<p class="p2">手机为“{{blackListPhone}}”的访客，已被贵公司设为黑名单</p>
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/')" :btnClassName.sync='btnClassName'>我知道了</ColorBtn>
			</div>
		</div>
		<!--会议相关-->
		<div v-if="type=='meetingBookSuccess'">
			<img src="@/assets/img/hint_success.png" />
			<p>预定成功</p>			
			<div class="btn_box">
				<ColorBtn @handleBtnClick="$router.push('/meeting/my')" :btnClassName.sync='btnClassName'>查看我的会议</ColorBtn>
			</div>
		</div>
	</div>
</template>

<script>
	import ColorBtn from './common/colorBtn'
	export default {
		name: "Hint",
		data() {
			return {
				type: "",
				/*抄送id*/
				id: "",
				/*抄送人姓名*/
				nameList: "",
				/*取消访问姓名*/
				cancelName: "",
				/*黑名单手机*/
				blackListPhone: "",
				/*按钮*/
				btnClassName: "colorBtnBlue",
				btnWhite: "colorBtnWhite",
			}
		},
		components: {
			ColorBtn
		},
		mounted() {
			if(this.$route.query.type == 'bookSuccess') {
				this.type = 'bookSuccess';
			} else if(this.$route.query.type == 'feedbackSuccess') {
				this.type = 'feedbackSuccess';
			} else if(this.$route.query.type == 'book_changeSuccess') {
				this.type = 'book_changeSuccess';
			} else if(this.$route.query.type == 'inviteSuccess') {
				this.type = 'inviteSuccess';
				this.id = this.$route.query.id || '';
			} else if(this.$route.query.type == 'bindSuccess') {
				this.type = 'bindSuccess';
			} else if(this.$route.query.type == 'copytoSuccess') {

				this.type = 'copytoSuccess';
				this.nameList = this.$route.query.nameList;
			} else if(this.$route.query.type == 'bookCancelSuccess') {

				this.type = 'bookCancelSuccess';
			} else if(this.$route.query.type == 'bindSuccess') {

				this.type = 'bindSuccess';
			} else if(this.$route.query.type == 'unBindSuccess') {

				this.type = 'unBindSuccess';
			} else if(this.$route.query.type == 'signedSuccess') {

				this.type = 'signedSuccess';
			} else if(this.$route.query.type == 'blackList') {

				this.type = 'blackList';
			} else if(this.$route.query.type == 'blackListInvite') {
				this.type = 'blackListInvite';
				this.blackListPhone = this.$route.query.blackListPhone || '';
				
				/*会议相关*/
			}else if(this.$route.query.type == 'meetingBookSuccess') {
				this.type = 'meetingBookSuccess';				
			}
		},
		methods: {
			goCopyto() {
				this.$router.push({
					path: "/visitor/copyto",
					query: {
						'id': this.id
					}
				})
			}

		}

	}
</script>

<style lang="scss">
	@import "../assets/scss/hint";
</style>