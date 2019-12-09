import Vue from 'vue'
import Router from 'vue-router'

/*个人中心*/
const Center = () =>
	import('@/components/center')
/*提示*/
const Hint = () =>
	import('@/components/hint')
/*绑定账号*/
const BindPhone = () =>
	import('@/components/bindPhone')
const UnBindPhone = () =>
	import('@/components/unBindPhone')
/*意见反馈*/
const Feedback = () =>
	import('@/components/feedback')
/*消息中心*/
const Message = () =>
	import('@/components/message')
/*个人信息 */
const Information = () =>
	import('@/components/information')
const Information_realName = () =>
	import('@/components/information/realName')
const Information_certificateNo = () =>
	import('@/components/information/certificateNo')
const Information_company = () =>
	import('@/components/information/company')
/*员工通道*/
const Staff_bindPhone = () =>
	import('@/components/staff/bindPhone')
const Staff_qrcode = () =>
	import('@/components/staff/qrcode')

/*
 * 
 * 访客
 * 
 */
/*访客中心*/
const VisitorCenter = () =>
	import('@/components/visitor/center')
/*访客列表*/
const VisitorList = () =>
	import('@/components/visitor/list')
const VisitorList2 = () =>
	import('@/components/visitor/list2')
/*访客详情*/
const VisitorDetails = () =>
	import('@/components/visitor/details')
const VisitorDetails_followList = () =>
	import('@/components/visitor/details_followList')
const VisitorDetails_inOutDataList = () =>
	import('@/components/visitor/details_inOutDataList')
/*预约邀约*/
const VisitorBook = () =>
	import('@/components/visitor/book')
const VisitorBook2 = () =>
	import('@/components/visitor/book2')
const VisitorBook_followList = () =>
	import('@/components/visitor/book_followList')
const VisitorInvite = () =>
	import('@/components/visitor/invite')
const VisitorInvite_followList = () =>
	import('@/components/visitor/invite_followList')
/*抄送*/	
const VisitorCopyto = () =>
	import('@/components/visitor/copyto')

/*
 * 
 梯控
 * 
 */
	
const ElevatorApply = () =>
	import('@/components/elevator/apply')
const ElevatorRecord = () =>
	import('@/components/elevator/record')
const ElevatorStatus = () =>
	import('@/components/elevator/status')

Vue.use(Router)
export default new Router({
	routes: [{
			path: '/',
			name: 'Center',
			component: Center,
			meta: {
				title: "个人中心"
			}
		},
		/*提示页面*/
		{
			path: '/hint',
			name: 'Hint',
			component: Hint,
			meta: {
				title: ""
			}
		},
		/*个人信息*/
		{
			path: '/information',
			name: 'Information',
			component: Information,
			meta: {
				title: "个人信息"
			}
		},
		{
			path: '/information/realName',
			name: 'Information_realName',
			component: Information_realName,
			meta: {
				title: "填写姓名"
			}
		},
		{
			path: '/information/certificateNo',
			name: 'Information_certificateNo',
			component: Information_certificateNo,
			meta: {
				title: "填写身份证号"
			}
		},
		{
			path: '/information/company',
			name: 'Information_company',
			component: Information_company,
			meta: {
				title: "填写单位"
			}
		},
		/*意见反馈*/
		{
			path: '/feedback',
			name: 'Feedback',
			component: Feedback,
			meta: {
				title: "意见反馈"
			}
		},
		/*消息中心*/
		{
			path: '/message',
			name: 'Message',
			component: Message,
			meta: {
				title: "消息中心"
			}
		},
		/*账号绑定、解绑*/
		{
			path: '/bindPhone',
			name: 'BindPhone',
			component: BindPhone,
			meta: {
				title: "账号绑定"
			}
		},
		{
			path: '/unBindPhone',
			name: 'UnBindPhone',
			component: UnBindPhone,
			meta: {
				title: "账号解绑"
			}
		},
		/*员工通道*/
		{
			path: '/staff/qrcode',
			name: 'Staff_qrcode',
			component: Staff_qrcode,
			meta: {
				title: "通信二维码"
			}
		},
		{
			path: '/staff/bindPhone',
			name: 'Staff_bindPhone',
			component: Staff_bindPhone,
			meta: {
				title: "绑定手机"
			}
		},
		
		/*
		 *访客
		 *
		 */
		{
			path: '/visitor/center',
			name: 'VisitorCenter',
			component: VisitorCenter,
			meta: {
				title: "访客中心"
			}
		},
		{
			path: '/visitor/details',
			name: 'VisitorDetails',
			component: VisitorDetails,
			meta: {
				title: ""
			}
		},
		{
			path: '/visitor/details_followList',
			name: 'VisitorDetails_followList',
			component: VisitorDetails_followList,
			meta: {
				title: "随访人"
			}
		},
		{
			path: '/visitor/details_inOutDataList',
			name: 'VisitorDetails_inOutDataList',
			component: VisitorDetails_inOutDataList,
			meta: {
				title: "进出次数"
			}
		},	
		{
			path: '/visitor/list',
			name: 'VisitorList',
			component: VisitorList,
			meta: {
				title: "访客列表"
			},
		},
		{
			path: '/visitor/list2',
			name: 'VisitorList2',
			component: VisitorList2,
			meta: {
				title: "访客列表"
			},
		},
		{
			path: '/visitor/book',
			name: 'VisitorBook',
			component: VisitorBook,
			meta: {
				title: "预约登记"
			}
		},
		{
			path: '/visitor/book2',
			name: 'VisitorBook2',
			component: VisitorBook2,
			meta: {
				title: "预约登记"
			}
		},
		{
			path: '/visitor/book_followList',
			name: 'VisitorBook_followList',
			component: VisitorBook_followList,
			meta: {
				title: "添加随访人"
			}
		},
		{
			path: '/visitor/invite',
			name: 'VisitorInvite',
			component: VisitorInvite,
			meta: {
				title: "邀请访客"
			}
		},
		{
			path: '/visitor/invite_followList',
			name: 'VisitorInvite_followList',
			component: VisitorInvite_followList,
			meta: {
				title: "添加随访人"
			}
		},
		{
			path: '/visitor/copyto',
			name: 'VisitorCopyto',
			component: VisitorCopyto,
			meta: {
				title: "抄送"
			}
		},
		/*
		 *梯控
		 *
		 */
		{
			path: '/elevator/apply',
			name: 'ElevatorApply',
			component: ElevatorApply,
			meta: {
				title: "申请VIP梯"
			}
		},
		{
			path: '/elevator/record',
			name: 'ElevatorRecord',
			component: ElevatorRecord,
			meta: {
				title: "VIP梯申请记录"
			}
		},
		{
			path: '/elevator/status',
			name: 'ElevatorStatus',
			component: ElevatorStatus,
			meta: {
				title: "申请VIP梯"
			}
		},
	]
})