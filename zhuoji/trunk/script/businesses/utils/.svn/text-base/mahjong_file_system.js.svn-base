/*************************************************************
 *  mahjong_file_system.js
 *  mahjong
 *
    Created by zengxinxin on 16-09-08
 *  特殊说明：

 使用方法:

 */

(function(){
	var GLOBAL_OBJ = guiyang;

	// 记录已经有了哪些根目录以及代表的内容，防止重复命名
	var ROOTS  = [
		"CreateConf",   // 创建桌子配置信息
	];

	var ROOT   = "";
	var UID    = hall.AccountInfo.userID;

	// _key用来标记唯一一场牌局
	var __findFullPath = function(_key){
		var path = jsb.fileUtils.getWritablePath() + ROOT + UID;
		var name = path + (_key?("/" + _key):"");

		return name;
	};

	GLOBAL_OBJ.businesses.utils.FileSystem = GLOBAL_OBJ.businesses.utils.FileSystem || {
		boot:function(_root){
			ROOT = _root+"/";
			var path = jsb.fileUtils.getWritablePath();
			var root = path + ROOT + UID;

			if (this.uid){
				ty.FileManager.createDir(root);
			}
		},

		shut:function(){
			ROOT = "";
		},

		write:function(_key, _content){
			var name = __findFullPath(_key);

			if (!ty.FileManager.readFile(name)){
				ty.FileManager.createFile(name)
			}
			
			ty.FileManager.writeFile(name, _content, false);
		},

		read:function(_key){
			var name = __findFullPath(_key);

			return ty.FileManager.readFile(name) || "";
		},

		/*
		清空纪录
		如果_fuid为空则清空所有好友的聊天记录
		*/
		clear:function(_key){
			var name = __findFullPath(_key);

			ty.FileManager.deleteFile(name);
		}
	};
})();
