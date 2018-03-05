/*************************************************************
 *  mahjong_poyang_budgets_cell00.js
    mahjong_poyang_budgets_cell00
 *  mahjong
 	麻将牌 鄱阳麻将结算 界面01 格子
 *
 *  Created by nick.kai.lee on 16-09-29
 *  特殊说明：
    使用方法:

 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;

	var GLOBAL_T     				  		= GLOBAL_OBJ.table.global;
	var MODEL_TABLEINFO                    	= GLOBAL_OBJ.table.models.TableInfo;

	var TEXT    							= [
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1020,
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1021,
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1022,
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1023,
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1024,
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1025,
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1026,
        GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1027
	];

	var TEXT_WUHAN = [
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1038,
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1039,
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1040,
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1041,
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1042,
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1043,
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1044,
		GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1045
	];

	var AUDIO                     = GLOBAL_OBJ.bkernel.utils.Audio;
    var AUDIO_RES                 = GLOBAL_OBJ.table.utils.Audio;

	GLOBAL_OBJ.table.windows.Menu.Chat.Cell00 = GLOBAL_OBJ.bkernel.base.BaseCellController.extend(
	{
		_TAG:'GLOBAL_OBJ.table.windows.Menu.Chat.Cell00',
		ctor:function(_index, _config){
			this._super();
			this.config = _config;
			this.index  = _index;
			this.init(GLOBAL_OBJ.RES.TABLE_CHAT_TEXT_CELL_CCBI);
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
		},

		onCleanup:function(){
			this._super();
		},

		update:function(_index, _config){

			this.index  = _index;
			this.config = _config;

			var txtList;

			var playMode = MODEL_TABLEINFO.getPlayMode();

			switch (playMode){
				case GLOBAL_T.PLAYMODE.WuHan:
					txtList = TEXT_WUHAN;
					break;
				default:
					txtList = TEXT;
					break;
			}

			this["textLabel"].setString(txtList[this.index]);
		},

		onText:function(){
			var txt = this["textLabel"].getString();
			this.config.data.callFunc(txt);
		}
	});
})();