/*************************************************************
 *  mahjong_table_record_file_system.js
    Created by zengxinxin on 16-08-01
 *  特殊说明：

 使用方法:

 */

(function(){
	var GLOBAL_OBJ = guiyang;
	var ROOT   = "tableRecord/";
	var UID    = hall.AccountInfo.userID;

	// _key用来标记唯一一场牌局
	var __findFullPath = function(_key, _curCardCount){
		var path = jsb.fileUtils.getWritablePath() + ROOT + UID + "/" + _key;
		// _curCardCount传入－1表示非牌局文件，创建一个文件用来记录牌局下标
		var name = path + (_curCardCount!=-1?("/" + _curCardCount):"/record");

		return name;
	};

	GLOBAL_OBJ.businesses.modules.TableRecord.FileSystem = GLOBAL_OBJ.businesses.modules.TableRecord.FileSystem || {
		boot:function(){
			var path = jsb.fileUtils.getWritablePath();
			var root = path + ROOT + UID;

			// cc.log("fsdjfksdjfksdfsfsfdfsdsdsfds "+path)

			if (this.uid){
				ty.FileManager.createDir(root);
			}
		},

		shut:function(){

		},

		createDir:function(_dirName){
			var root = jsb.fileUtils.getWritablePath() + ROOT + UID + "/" + _dirName;

			if (!ty.FileManager.isDirectory(root)){
				ty.FileManager.createDir(root);
			}
		},

		write:function(_key, _curCardCount, _content){
			var name = __findFullPath(_key, _curCardCount);

			if (!ty.FileManager.readFile(name)){
				ty.FileManager.createFile(name)
			}

			ty.FileManager.writeFile(name, _content, false);
		},

		read:function(_key, _curCardCount){
			var name = __findFullPath(_key, _curCardCount);

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
