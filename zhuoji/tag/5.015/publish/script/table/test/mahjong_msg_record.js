/*************************************************************
 *  mahjong_msg_record.js
    mahjong_msg_record
 *  mahjong
 	协议记录
 *
 *  Created by nick.kai.lee on 16-09-18
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T 			  = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS          = GLOBAL_OBJ.businesses.functions;
	GLOBAL_OBJ.table.Test.Record = {
		_TAG:"table.Test.Record",
		msgs:[],
		file:null,
		name:null,
		boot:function(){
			GLOBAL_OBJ.LOGD(this._TAG, "MODULE LOAD");
		},

		shut:function(){
			GLOBAL_OBJ.LOGD(this._TAG, "MODULE UNLOAD");
		},

		record:function(_cmd, _result){
			if (_cmd == GLOBAL_OBJ.table.network.EventType.TABLE_LOCATION) {
				this.msgs = [];
				this.msgs.push("var STEPS = []; \n");
			};

			//断线重连
			if (_cmd == GLOBAL_OBJ.table.network.EventType.TABLE_INFO&&true == _result.reconnect) {
				this.msgs = [];
				this.msgs.push("var STEPS = []; \n");
			};

			if (_cmd == GLOBAL_OBJ.table.network.EventType.TABLE_LEAVE
				&& GLOBAL_T.MYSEAT == GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( _result.seatId )) {
				
				// this.msgs.push("return STEPS;\n");
				//本家结束，写文件
				var curDate = new Date();
		 		var day     = curDate.getFullYear() + '_' + (curDate.getMonth() + 1) + '_' + curDate.getDate();
			    var curTime = curDate.toLocaleTimeString() + curDate.getMilliseconds();
			    var path    = jsb.fileUtils.getWritablePath()+"MJ_GAME_RECORD/";

			    curTime     = curTime.replace("/","_");
			    curTime     = curTime.replace(":","_");
			    this.name        = day + '_'+ curTime + ".js"
			    var replay_file  = path + this.name;
				ty.FileManager.createFile(replay_file);
		 		for(var i in this.msgs ){
		 			ty.FileManager.writeFile(replay_file, this.msgs[i],true);
		 		};
		 		cc.log("牌局保存成功!"+replay_file);
		 		this.msgs = [];

		 		this.file = replay_file;
		 		ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                    text:"DEBUG测试环境协议记录，有需要请截图："+day + '_'+ curTime + ".js",
                    duration:10
                });
			}else{
				var json = JSON.stringify({ cmd: _cmd, result:_result});
				this.msgs.push("STEPS["+(this.msgs.length-1)+"] = "+json+'\n');
			};
		},

		upload:function(){
			if (this.file) {
				GLOBAL_OBJ.table.network.C2S.send({
		            "cmd": "game",
		            "params": {
		                "action":"debug_upload_msg",
		                "name":this.name,
		                "data":ty.FileManager.readFile(this.file),
		            }
		        });
			};
		},
	};
	//end
})();

