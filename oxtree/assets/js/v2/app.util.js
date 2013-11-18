//dependencies hogan.js
J(function($,p,pub){
	pub.id = "util";
	pub.$win = $(window);
	pub.heredoc = function(fn){return (fn.toString().split('\n').slice(1,-1).join('\n') + '\n');};
	pub.toHtml=function(tpl,obj,ext){tpl = Hogan.compile(tpl);return (tpl.render(obj,ext));};
	/**
	* 获取指定的URL查询字符串
	* @public
	* @function
	* @name J#util#getUrlParam
	* @param {String} name 查询字符串的键名
	*/
	pub.getUrlParam = function (name) {
		var paramStr = location.search;
		if (paramStr.length == 0) return null;
		if (paramStr.charAt(0) != '?') return null;
		paramStr = unescape(paramStr);
		paramStr = paramStr.substring(1);
		if (paramStr.length == 0) return null;
		var params = paramStr.split('&');
		for (var i = 0; i < params.length; i++) {
			var parts = params[i].split('=', 2);
			if (parts[0] == name) {
				if (parts.length < 2 || typeof (parts[1]) == "undefined" || parts[1] == "undefined" || parts[1] == "null") return "";
				return parts[1];
			}
		}
		return null;
	};
	pub.getPageId = function(){
		var pid = pub.getUrlParam('pid');
		pid = pid||'-J8QqMggbkbbPbmJa4re';
		return pid;
	};
});