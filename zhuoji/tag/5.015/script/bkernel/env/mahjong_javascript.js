/*****************************************
 *  mahjong_javascript.js
    对JS里原生功能的修改和扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-07
 *  特殊说明：

    使用说明:

 */
(function(){
	/*
	@格式化字符串*/
	String.prototype.format = function () {
	    var formatted = this;
	    for (var i = 0; i < arguments.length; i++) {
	        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
	        formatted = formatted.replace(regexp, arguments[i]);
	    }
	    return formatted;
	};
})();