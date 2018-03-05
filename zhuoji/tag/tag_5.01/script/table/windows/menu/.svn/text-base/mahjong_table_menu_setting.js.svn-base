/*************************************************************
 *  mahjong_table_menu_window.js
    mahjong_table_menu_window
 *  mahjong
 	麻将牌 菜单
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var AUDIO = GLOBAL_OBJ.bkernel.utils.Audio;
	
	GLOBAL_OBJ.table.windows.Menu.Setting = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Menu.Setting",
		ctor: function() {
			this._super();
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			this.audioModeGroup = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true],
				[this.setting_sound_open, this.setting_sound_close] );
			this.musicModeGroup = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true],
   				[this.setting_music_open, this.setting_music_close] );

			//初始化单击、双击 true 为单击 false 为双击  。互斥组中索引:0为单击 ，1为双击。
			this.audioModeGroup.setVisible(GLOBAL_OBJ.UserDefault.shareUserDefault().getEffectStatus() ? 0 : 1);
			this.musicModeGroup.setVisible(GLOBAL_OBJ.UserDefault.shareUserDefault().getMusicStatus() ? 0 : 1);
		},

		onCleanup:function() {
			this._super();
		},

		onEase:function(){
			this._super();
		},

		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

				/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            var rect  = this._bgNode.getBoundingBox();
        
            return true;
        },

		onClickClose:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLOSEBUTTON_MP3);
			this.windowClose();
		},

		onOpenAudio:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			this.audioModeGroup.setVisible(1);
			GLOBAL_OBJ.UserDefault.shareUserDefault().setEffectStatus(0);
		},

		onCloseAudio:function(){
			this.audioModeGroup.setVisible(0);
			GLOBAL_OBJ.UserDefault.shareUserDefault().setEffectStatus(1);
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
		},

		onOpenMusic:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			this.musicModeGroup.setVisible(1);
			GLOBAL_OBJ.UserDefault.shareUserDefault().setMusicStatus(0);
		},

		onCloseMusic:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			this.musicModeGroup.setVisible(0);
			GLOBAL_OBJ.UserDefault.shareUserDefault().setMusicStatus(1);
		}
	});
	//end

})();

