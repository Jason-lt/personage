/*************************************************************
 *  mahjong_audio_util.js
    mahjong_audio_util
 *  mahjong
 	牌桌音频管理器
 *
 *  Created by nick.kai.lee on 16-09-18
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var SETTING = GLOBAL_OBJ.bkernel.utils.Setting;
	
	GLOBAL_OBJ.bkernel.utils.Audio = {
		_TAG:"bkernel.utils.Audio",
		
		/*
		播放背景音乐
		params: _audioFile 音频文件 
		params: _repeatForever 是否循环*/
		music:function(_audioFile, _repeatForever){
			if (_audioFile == '' || typeof(_audioFile) == 'undefined') {
				return;
			}

			var repeat = _repeatForever ? true : false;
	  		// cc.AudioEngine.getInstance().setMusicVolume(SETTING.get(SETTING.KEY_MUSIC,1));
	  		this.setMusicVolume();
			hall.AudioHelper.playMusic(_audioFile, repeat);
		},

		/*
		播放音效
		params: _audioFile 音频文件
		params: _repeatForever 是否循环*/

		/**
		 * 播放音效
		 * @param _audioFile 音频文件
		 * @param _repeatForever 是否循环
		 * @param _setValume 是否设置音量
		 */
		audio:function(_audioFile, _repeatForever,_setValume){
			if (_audioFile == '' || typeof(_audioFile) == 'undefined') {
				return;
			}
			
			if ( !GLOBAL_OBJ.UserDefault.shareUserDefault().getEffectStatus() )
			{
				return;
			}

			var setValume = arguments.length == 3 ? _setValume : true;


			// cc.AudioEngine.getInstance().setEffectsVolume(SETTING.get(SETTING.KEY_EFFECT,1));

			if (setValume){
				this.setEffectsVolume();
			}

			GLOBAL_OBJ.LOGD(this._TAG,"播放音效："+_audioFile);
			var repeat = _repeatForever ? true : false;
			hall.AudioHelper.playEffect(_audioFile, repeat);
		},

		setMusicVolume:function(){
			hall.AudioHelper.setMusicVolume(SETTING.get(SETTING.KEY_MUSIC,1));
		},

		setEffectsVolume:function(){
			hall.AudioHelper.setEffectsVolume(SETTING.get(SETTING.KEY_EFFECT,1));
		}
	};
	//end
})();

