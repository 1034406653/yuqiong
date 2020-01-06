// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
import axios from 'axios'
import store from './store'
import VConsole from 'vconsole'
import { Toast } from 'vant';
import { Dialog } from 'vant';
Vue.use(Toast);
Vue.use(Dialog);
Vue.config.$toast = Toast;
Vue.config.$dialog = Dialog;

Vue.config.productionTip = false

/*axios配置*/
Vue.prototype.$axios = axios;
Vue.prototype.$baseURL = 'https://www.best2sit.com/ssit/visitor/';

axios.defaults.baseURL = 'https://www.best2sit.com/ssit/visitor/';
/*获取openId*/
let openId = window.location.href.split('?openid=')[1] || window.localStorage.getItem('openid') || '';
if(openId == null) {
	MessageBox({
		title: "",
		message: '服务器出错了,请稍后重试',
	});
	window.localStorage.setItem('openid', '');
} else {
	window.localStorage.setItem('openid', openId);
}

router.beforeEach((to, from, next) => {
	if(openId) {
		/*预约清理*/
		if(to.path != '/visitor/book' && to.path != '/visitor/book2' && to.path != '/visitor/book_followList') {
			window.localStorage.removeItem("bookType");
			window.localStorage.removeItem("bookNeed");
			window.localStorage.removeItem("pGuestAppointment");
		}
		/*邀约清理*/
		if(to.path != '/visitor/invite' && to.path != '/visitor/invite_followList') {
			window.localStorage.removeItem("inviteStartTime");
			window.localStorage.removeItem("inviteEndTime");
			window.localStorage.removeItem("pInviteData");
		}
		/*会议预约清理*/		
		if(to.path != '/meeting/participant' && to.path != '/meeting/book') {
			window.sessionStorage.removeItem("meetingBook");			
		}
		next();
	} else {
		if(to.path == '/staff/bindPhone' || to.path == '/staff/qrcode') {
			axios({
				method: 'get',
				url: '/wx/api/login',
			}).then(res => {
				let formPath = '2'
				//let formPath = '3'				
				location.href = res.data.data.url.split('&state')[0] + "&state=" + formPath;
			}).catch(res => {
				console.log(res)
			});
		} else {
			axios({
				method: 'get',
				url: '/wx/api/login',
			}).then(res => {
				let formPath = '1'
				//let formPath = '0'				
				location.href = res.data.data.url.split('&state')[0] + "&state=" + formPath;
			}).catch(res => {
				console.log(res)
			});
		}
	}
	if(to.meta.title) {
		document.title = to.meta.title;
	}
	next()
})

Vue.prototype.$openId = openId;

// 响应拦截器
axios.interceptors.response.use(data => {
	if(data.data.code == "300") {
		window.sessionStorage.setItem('authorization', "")
		Dialog({
			message: '登录失效'
		});
		router.push({
			path: "/"
		})
	}
	if(data.data.code == "999") {
		Dialog({
			message: '服务器出错了'
		});
	}
	if(data.data.code == "305") {
		router.push('/')
		setTimeout(() => {
			Dialog({
				message: '账号在别处登录'
			});
		}, 50)
	}
	return data;
}, error => {
	console.log(error)
})
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})