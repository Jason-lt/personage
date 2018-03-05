/*************************************************************
 *  mahjong_upload_game_msg.js
    mahjong_table_info
 *  mahjong
 	麻将牌桌 信息
 *
 *  Created by nick.kai.lee on 16-09-03
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T 			          = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS                  = GLOBAL_OBJ.businesses.functions;
	var MODEL_USER                	  = GLOBAL_OBJ.businesses.modules.User.Model;
	var MODEL_TABLEINFO           	  = GLOBAL_OBJ.table.models.TableInfo;
	GLOBAL_OBJ.table.Test.UploadGameMsg  = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.Test.UploadGameMsg",
		ctor: function() {
			this._super();
			this.init(GLOBAL_OBJ.RES.UPLOAD_GAME_MSG_CCBI);
		},

		onLoad: function() {
			this._super();
			/*
            @ 注册通知*/    
            GLOBAL_OBJ.bkernel.utils.Notification.listen("debug_upload_msg", function(_params){
                if (_params&&_params.name) {
					ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                        text:"记录上传成功："+_params.name,
                        duration:5
                    });
                };
            }, this);
		},

		onCleanup:function() {
			this._super();
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

		onUploadGameMsg:function(){
			GLOBAL_OBJ.table.Test.Record.upload();
		},
	});
	//end
})();

