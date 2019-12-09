function DealImage(path, obj, callback) {
	var img = new Image();
	img.src = path;
	img.onload = function() {
		var that_2 = this;
		// 默认按比例压缩
		var w = that_2.width,
			h = that_2.height,
			scale = w / h;
		w = obj.width || w;
		h = obj.height || (w / scale);
		var quality = 1; // 默认图片质量为0.7
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		// 创建属性节点
		var anw = document.createAttribute("width");
		anw.nodeValue = w;
		var anh = document.createAttribute("height");
		anh.nodeValue = h;
		canvas.setAttributeNode(anw);
		canvas.setAttributeNode(anh);
		ctx.drawImage(that_2, 0, 0, w, h);
		// 图像质量
		if(obj.quality && obj.quality <= 1 && obj.quality > 0) {
			quality = obj.quality;
		}
		// quality值越小，所绘制出的图像越模糊
		var base64 = canvas.toDataURL('image/png', quality);
		callback(base64);
		canvas = null;
	}
}
function DataURLtoFile(dataurl, filename = 'file') {
	let arr = dataurl.split(',')
	let mime = arr[0].match(/:(.*?);/)[1]
	let suffix = mime.split('/')[1]
	let bstr = atob(arr[1])
	let n = bstr.length
	let u8arr = new Uint8Array(n)
	while(n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], `${filename}.${suffix}`, {
		type: "image/png"
	})
}
export { DealImage,DataURLtoFile }
