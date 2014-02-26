/**
 * @namespace 简单的js模块工厂,利用Module Pattern组织页面的js代码
 * @description A simple javascript module factory using Javascript Module Pattern
 * @author Levin
 * @version 1.0
 */
var JF = (function ($) {
	var p = {},
	/**
	* @scope JF.prototype
	*/
		pub = {};
	/*private area*/
	p._modules = {};
	/**
	* @private
	* @description onLoaded方法,统一管理页面加载完毕后的回调方法
	* 说明:onLoaded方法接管所有页面上注册到$(document).ready(callback)中的callback方法;
	* 如果你要新增一个$(callback)或$(document).ready,请将你的callback方法放在onLoaded方法体内
	*/
	p.onLoaded = function () {
		var k = null;
		for (var m in p._modules) {
			k = m;
			if ((m = p._modules[m]) && m.onLoad) {
				try {
					m.onLoad(m);
				} catch (e) {
					alert('Error init module [' + k + ']:' + e.message || e.description);
				}
			};
		};
	};
	/**
	* @private
	* @description initEvents方法
	*作用:用于为页面dom元素注册各种事件!
	*说明:Html页面仅用于表现，任何时候应在标签里面直接注册事件。即避免如<a onclick="xx"/>
	*/
	p.initEvents = function (opts) {
		$(document).ready(p.onLoaded);
	};
	/*public area
	+++++++++++++++++++++++++++++*/
	/**
	* 页面js逻辑的唯一入口
	* @public
	* @function
	* @name JF#Init
	* @param {Object} opts 配置对象
	* @description
	* 理想状态下每个页面对应一个交互用的js文件，在页面末尾通过下面代码初始化js交互逻辑
	* <code>
	* <script type="text/javascript">
	*    JF.Init({x:'kk',y:'zz'});
	* </script>
	* </code>
	*/
	pub.Init = function (opts) {
		pub.opts = p.opts = opts = opts || {};
		var k = null;
		for (var m in p._modules) {
			k = m;
			if ((m = p._modules[m]) && m.init) {
				try {
					m.init(opts);
				} catch (e) {
					alert('Error init module [' + k + ']:' + e.message || e.description);
				}
			};
		};
		p.initEvents(opts);
	};
	/**
	 * 初始化子模块
	 * @public
	 * @function
	 * @name JF#InitSub
	 * @param {Object} sub sub module
	 */
	pub.InitSub = function(sub) {
		for (var c in sub) {
			c = sub[c];
			if (!c) {
				continue;
			};
			for (var c1 in c) {
				c1 = c[c1];
				if (!c1) continue;

				if (c1.init) {
					c1.init.call(c1);
				};
			};
		};
	};
	/**
	* onLoaded之后加载子模块
	* @public
	* @function
	* @name JF#LoadSub
	* @param {Object} sub sub module
	*/
	pub.LoadSub = function (sub) {
		for (var c in sub) {
			c = sub[c];
			if (!c) {
				continue;
			};
			for (var c1 in c) {
				c1 = c[c1];
				if (!c1) continue;

				if (c1.onLoad) {
					c1.onLoad.call(c1);
				};
			};
		};
	};	
	/**
	* 往模块工程JF注册一个功能模块.请在Init方法前调用
	* @public
	* @name JF#AddModule
	* @function
	* @param {string} key 模块的id
	* @param {Object} module 模块的实例，如'<code>{init:function(opts){},onLoad:function(opts){}}</code>'
	*/
	pub.AddModule = function (key, module) {
		if (p._modules[key]) {
			JF.log("Module with key '" + key + "' has beed registered!");
			return;
		};
		p._modules[key] = module;
		//register namespace
		pub[key] = module;
		return pub;
	};
	/**
	* 根据id获取指定注册的模块
	* @public
	* @function
	* @name JF#GetModule
	* @param {string} key 模块的id
	*/
	pub.GetModule = function (key) {
		return p._modules[key];
	};
	/**
	* AddModule 和 GetModule 的快捷方法
	* @public
	* @function
	* @name JF#M
	* @param {string} key 模块的id
	* @param {Object} module 模块实例
	* @returns 返回JF或者模块实例
	* @description 当没有指定module参数时想到于调用了JF.GetModule方法;当指定了module参数时，相当于调用了JF.AddModule方法
	*/
	pub.M = function (key, module) {
		if (arguments.length == 1) {
			return pub.GetModule(key);
		};
		if (arguments.length == 2) {
			return pub.AddModule(key, module);
		};
		return null;
	};
	/**
	* 简单的html模板解析方法
	* @public
	* @function
	* @name JF#EvalTpl
	* @description
	* simple js template parser
	* 例如：
	* <code>
	*	var str="<a href=/u/%uid%>%username%</a>",
	*	    data={uid:1,username:'levin'}
	*	alert(JF.EvalTpl(str,data));
	*	//提示信息为："<a href=/u/1>levin</a>"
	*  </code>
	* @param {string} str html模板，字段用%包含
	* @param {Object} data json数据
	*/
	pub.EvalTpl = function (str, data) {
		var result;
		var patt = new RegExp("%([a-zA-z0-9]+)%");
		while ((result = patt.exec(str)) != null) {
			var v = data[result[1]] || '';
			str = str.replace(new RegExp(result[0], "g"), v);
		};
		return str;
	};
	/**
	* 获取指定长度的随机字符串。注意：仅仅由数字和字母组成
	* @public
	* @function
	* @name JF#RdStr
	* @param {int} size 随机字符串的长度
	* @param {Boolean} plusTimeStamp 是否加上当前时间戳
	*/
	pub.RdStr = function (size, plusTimeStamp) {
		var size0 = 8;
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		size = size || size0; size = size < 1 ? size0 : size; size = size > chars.length ? size0 : size;
		var s = '';
		for (var i = 0; i < size; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			s += chars.substring(rnum, rnum + 1);
		};
		if (plusTimeStamp) {
			s += new Date().getTime();
		};
		return s;
	};
	/**
	* 即:function(){return false;}
	* @public
	* @function
	* @name JF#NoPropagation
	*/
	pub.NoPropagation = function () { return false; };
	/**
	* NoopHandler
	* @public
	* @function
	* @name JF#NoopHandler
	*/
	pub.NoopHandler = function (e) {
		e.stopPropagation();
		e.preventDefault();
	};
	/**
	* 获取字符串的长度，一个汉字的字符长度为2
	* @public
	* @function
	* @name JF#charLength
	* @param {string} str 字符串
	*/
	pub.charLength = function (str) {
		var nstr = str.replace(/[^x00-xff]/g, "JJ");
		return nstr.length;
	};
	/**
	* 截断字符串
	* @public
	* @function
	* @name JF#Tail
	* @param {string} str 待截断的字符串
	* @param {int} size 截断长,注:1个中文字符长度为2
	* @param {string} tailStr 截断后加在末尾的小尾巴,默认"..."
	*/
	pub.Tail = function (str, size, tailStr) {
		str = $.trim(str);
		var cLen = pub.charLength(str);
		size = size <= 0 ? cLen : size;
		if (size >= cLen) return str;
		while (pub.charLength(str) > size) {
			str = str.substr(0, str.length - 1);
		};
		str += (tailStr || "...");
		return str;
	};
	/**
	* document.getElementById的快捷方法
	* @public
	* @function
	* @name JF#g
	* @param {string} id 元素id
	*/
	pub.g = function (id) {
		return document.getElementById(id);
	};
	/**
	* window.console.log的快捷方法
	* @public
	* @function
	* @name JF#log
	* @param {Object} obj log的对象
	*/
	pub.log = function (obj) {
		if (!p.opts.debug) return;
		if (window['console'] && window['console'].log) {
			window['console'].log(obj);
		}
	};

	/**
	* 获取指定的URL查询字符串
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

	/**
	* 获取url的查询字符串并转换为json对象.
	* 需约定查询字符串是json字符串
	*/
	pub.getUrlJson = function () {
		var paramStr = location.search,
			retVal = {};
		if (paramStr.length == 0 || paramStr.charAt(0) != '?') return retVal;
		paramStr = unescape(paramStr);
		paramStr = paramStr.substring(1);
		if (paramStr.length == 0) return retVal;

		try {
			retVal = JSON.parse(paramStr);
		} catch (e) {

		}
		return retVal;

	};
	/**
	* ajax json post，适用于asp.net mvc ajax json post
	* @param {String} url ajax url
	* @param {Object} opts options
	*/
	pub.jsonPost = function (url, opts) {

		opts = opts || {};
		if (opts.data) {
			opts.data = JSON.stringify(opts.data);
		}
		var opts0 = {
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			type: "POST"
		};



		var xhrObj = $.ajax(url, $.extend(opts0, opts));

		return xhrObj;

	};

	/**
	* ajax json get，适用于asp.net mvc ajax json get request
	* @param {String} url ajax url
	* @param {Object} opts options
	*/
	pub.jsonGet = function (url, opts) {

		opts = opts || {};
		var opts0 = {
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			type: "GET"
		};



		var xhrObj = $.ajax(url, $.extend(opts0, opts));

		return xhrObj;

	};

	//给外部调用（例如android的webview调用)
	pub.onLoad = p.onLoaded;

	return pub;

})(window["jQuery"]);

//常用简单的JQ插件
;(function ($) {
	$.fn.serializeJSON = function () {
		var json = {};
		jQuery.map($(this).serializeArray(), function (n, i) {
			json[n['name']] = n['value'];
		});
		return json;
	};
})(jQuery);