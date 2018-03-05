/*************************************************************
 *  mahjong_setting.js
    mahjong_setting
 *  mahjong
 	牌桌音频管理器
 *
 *  Created by nick.kai.lee on 16-12-05
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.utils.Setting = {
		_TAG:"bkernel.utils.Setting",
		KEY_DISCARD: "DISCARD_MODE",
		KEY_MUSIC: hall.SETTING_MUSIC_KEY,
		KEY_EFFECT: hall.SETTING_EFFECT_KEY,

		/*
		存储
		params: _key 
		params: _value*/
		set:function(_key, _value){
			GLOBAL_OBJ.LOGD(this._TAG,"存储设置："+_key+":"+_value);
			hall.LocalStorage.setItem(_key, _value);
		},

		/*
		读取
		params: _key 
		params: _defaultValue 缺省值*/
		get:function(_key, _defaultValue){
			var ret = hall.GlobalFuncs.ReadNumFromLocalStorage(_key, _defaultValue);
			GLOBAL_OBJ.LOGD(this._TAG,"存储读取："+_key+":"+ret);
			return ret;
		},
	};
	//end
})();

