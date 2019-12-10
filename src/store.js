import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/*状态对象*/
const state = {
	shadow_lxl: false,
	userPhone: "",
	realName: "",
	certificateNo: "",
	company: "",
	percent:"",
	bind: false,
	userid: '',
	nickName:"",
	headImg:require('@/assets/img/public/head_portrait.png'),
	book_followList:[],	
	needIdNumber:false,
	needReason:false,
	needCompany:false,
	isAdmin:false,
	employeeCode:"",
	elevatorVip:false,
}
/*触发状态*/
const mutations = {
	initBook_followList(state, book_followList) {
		state.book_followList = book_followList; 
		sessionStorage.setItem('book_followList', state.book_followList);
	},
	initNickName(state, nickName) {
		state.nickName = nickName; 
		sessionStorage.setItem('nickName', state.nickName);
	},
	initHeadImg(state, headImg) {
		state.headImg = headImg; 
		sessionStorage.setItem('headImg', state.headImg);
	},
	initBind(state, bind) {
		if(bind){
			state.bind = true;
		}else{
			state.bind = false;
		}		 
		sessionStorage.setItem('bind', state.bind);
	},
	initUserid(state, id) {
		state.userid = id; 
		sessionStorage.setItem('userid', state.userid);
	},
	initUserPhone(state, newUserPhone) {
		state.userPhone = newUserPhone;
		sessionStorage.setItem('userPhone', state.userPhone);
	},
	initRealName(state, newRealName) {
		state.realName = newRealName;
		sessionStorage.setItem('realName', state.realName);
	},
	initCertificateNo(state, newCertificateNo) {
		state.certificateNo = newCertificateNo;
		sessionStorage.setItem('certificateNo', state.certificateNo);
	},
	initCompany(state, newCompany) {
		state.company = newCompany;
		sessionStorage.setItem('company', state.company);
	},
	initPercent(state, percent) {
		state.percent = percent;
		sessionStorage.setItem('percent', state.percent);
	},
	initNeedIdNumber(state, needIdNumber) {
		if(needIdNumber){
			state.needIdNumber = true;
		}else{
			state.needIdNumber = false;
		}			
		sessionStorage.setItem('needIdNumber', needIdNumber);
	},
	initNeedReason(state, needReason) {
		if(needReason){
			state.needReason = true;
		}else{
			state.needReason = false;
		}			
		sessionStorage.setItem('needReason', needReason);
	},
	initNeedCompany(state, needCompany) {
		if(needCompany){
			state.needCompany = true;
		}else{
			state.needCompany = false;
		}	
		sessionStorage.setItem('needCompany', needCompany);
	},
	initIsAdmin(state, isAdmin) {
		if(isAdmin){
			state.isAdmin = true;
		}else{
			state.isAdmin = false;
		}	
		sessionStorage.setItem('isAdmin', isAdmin);
	},
	initEmployeeCode(state, employeeCode) {
		state.employeeCode = employeeCode;
		sessionStorage.setItem('employeeCode', state.employeeCode);
	},
	initElevatorVip(state, elevatorVip) {
		if(elevatorVip){
			state.elevatorVip = true;
		}else{
			state.elevatorVip = false;
		}	
		sessionStorage.setItem('elevatorVip', elevatorVip);
	},
}
for(let key in state) {
	if(sessionStorage.getItem(key)=='true'){
		state[key] = true;
	}else if(sessionStorage.getItem(key)=='false'){
		state[key] = false;
	}else{
		sessionStorage.getItem(key) ? state[key] = sessionStorage.getItem(key) : false;
	}
	
}
export default new Vuex.Store({
	state,
	mutations
})