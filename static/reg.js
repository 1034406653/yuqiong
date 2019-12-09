var reg_identity = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
var reg_phone = /^((17[0-9])|(14[0-9])|(16[0-9])|(13[0-9])|(15[^4,\D])|(18[0-9])|(19[8-9]))\d{8}$/;
var reg_email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
var reg_nameC = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{1,30}$/;
var reg_nameE = /^[a-z\/ ]{1,30}$/i;

function checktime(i) {
	if(i < 10) {
		i = "0" + i;
	}
	return i;
}


function trim(str) {
	return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
}

function allTrim(str) {
	if(str) {
		return str.replace(/\s*/g, "");
	} else {
		return '';
	}

}

function checkStr(item, itemName) {
	item = trim(item);
	if(item.length < 1) {
		return itemName + '不能为空';
	}
	if(item.length > 20) {
		return itemName + '长度不能超过20';
	}
	if(item == ' ') {
		return itemName + '不能为空格';
	}
	if(item == 'null') {
		return itemName + '不能为null';
	}
	if(item == '&nbsp;') {
		return itemName + '不能为&nbsp;';
	}
	if(item == 'NULL') {
		return itemName + '不能为NULL';
	}
	return false;
}

function checkAdress(item, itemName) {
	item = trim(item);
	if(item.length < 1) {
		return itemName + '不能为空';
	}
	if(item.length > 100) {
		return itemName + '长度不能超过100';
	}
	if(item == ' ') {
		return itemName + '不能为空格';
	}
	if(item == 'null') {
		return itemName + '不能为null';
	}
	if(item == '&nbsp;') {
		return itemName + '不能为&nbsp;';
	}
	if(item == 'NULL') {
		return itemName + '不能为NULL';
	}
	return false;
}