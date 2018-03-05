/*************************************************************
 *  mahjong_table_record_download.js
    mahjong_table_record_download
 *  mahjong
 	牌局回放异步下载模块
 *
 *  Created by zengxx on 16-10-31
 *  特殊说明：

    使用方法:
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var DELETE_TIME = "table_record_delete_time";
	var path = jsb.fileUtils.getWritablePath()+"tableRecord/"+hall.AccountInfo.userID;
    var DownRecordKey = "majiang_record_key";

	GLOBAL_OBJ.businesses.modules.TableRecord.AsyncDownload = {
		_TAG: "GLOBAL_OBJ.businesses.modules.TableRecord.AsyncDownload",

		boot:function(){
	        this.updateRes = null;

	        var time = Math.floor((new Date()).getTime()/1000);
	        var d_time = ty.LocalStorage.getItem(DELETE_TIME) || 0; // 上次清除记录的时间戳
	        // 距离上次清除记录超过一天，立马清空记录
	        if (time - d_time > 24*60*60 && ty.FileManager.isDirectory(path)){
	        	ty.FileManager.deleteFile(path);
				ty.LocalStorage.setItem(DELETE_TIME, time);
	        }

	        if (!ty.FileManager.checkFileExist(path)){
				ty.FileManager.createDir(path);
			}
		},

		shut:function(){
		},

        /*
        @执行下载命令
        */
        doDownload:function(_key, _event, _callFunc){
        	var that = this;
        	var callFunc = _callFunc || function(){};
        	// 下载地址
			var downloadUrl = _event.url;
			// 本地存储路径
            var filename = downloadUrl.slice(downloadUrl.lastIndexOf('/')+1, downloadUrl.lastIndexOf('.'));
            var full_path = path + "/" + filename;
            // 如果本地已经有了，则不需要下载
            if (ty.FileManager.checkFileExist(full_path)){
                var data = ty.FileManager.readFile(full_path) || "";
                GLOBAL_OBJ.LOGD('local readfile  ', data);
                if (data){
                    callFunc(_key, 0, _event, data);
                    GLOBAL_OBJ.LOGD('the file already loaded in native, do not need load ');
                    return ;
                }
            }
            GLOBAL_OBJ.LOGD("record_load_log", "file not exist");
            ty.Http.httpGet({
                'url': downloadUrl,
                'headers': ['Content-Type: application/json; charset=utf-8'],
                'obj': {},
                'callback': function(_param){
                    if (_param.ResponseCode == 200){
                        ty.FileManager.createFile(full_path);
                        ty.FileManager.writeFile(full_path, _param.responseData, false);
                        //success
                        GLOBAL_OBJ.LOGD("record_load_log", "success ");
                        callFunc(_key, 0, _event, _param.responseData);
                    } else {
                        //error
                        GLOBAL_OBJ.LOGD("record_load_log", "error ");
                        callFunc(_key, -1, _event, "");
                    };
               }
            });
        },
    };
})();
