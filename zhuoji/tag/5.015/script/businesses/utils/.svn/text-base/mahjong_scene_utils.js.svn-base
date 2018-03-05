/*************************************************************
 *  mahjong_scene_utils.js
    mahjong_scene_utils
 *  mahjong
 	场景utils
 *
 *  Created by nick.kai.lee on 16-07-07
 *  特殊说明：

    使用方法:
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var MANAGER = GLOBAL_OBJ.bkernel.utils.ScenesManager;
	var _currentTableScene = null;

	GLOBAL_OBJ.businesses.utils.Scene = {
		_TAG:"businesses.utils.Scene",
		getCurrentTableScene:function(){
			return _currentTableScene;
		},

		setCurrentTableScene:function(_table){
			_currentTableScene=_table;
		},

		/**
		 * 跳转到房间列表 (金币，比赛)
		 * @param _gameType
		 * @param playMode
		 */
		jumpToRoomList:function(_gameType , playMode){
			MANAGER.release();
			GLOBAL_OBJ.LOGD(this._TAG,"jumpToRoomList  _gameType = " + _gameType);
			var ccbi;
			var cls;

			if (_gameType == GLOBAL_OBJ.PluginGameType.JinBi){
				cls = GLOBAL_OBJ.businesses.scenes.RoomList.Scene;
			}
			else if (_gameType == GLOBAL_OBJ.PluginGameType.Match){
				cls = GLOBAL_OBJ.businesses.scenes.Match.Scene;
			}
			var s = new cls(_gameType,playMode);
            MANAGER.replaceScene(s);
		},

		/**
		 * 跳转到二级子大厅
		 * @param playMode 玩法
		 */
		jumpToSecondHall:function(playMode){

			GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_HALL_BACKGROUND_MUSIC_MP3, true);
			hall.ToDoTask.clearTasks();
			hall.PluginInterface.getCurrentSceneController().destroy(false);

			// GLOBAL_OBJ.LOGD(this._TAG, "enter mj by default 1" + JSON.stringify(playMode));
			MANAGER.release();
			var s = new GLOBAL_OBJ.businesses.scenes.PluginHall.Scene(playMode);
            s.init(GLOBAL_OBJ.RES.MAHJ_PLUGIN_HALL_CCBI);
            MANAGER.replaceScene(s);

		},

		/**
		 * 跳转到比赛场(快速赛)
		 * @param playMode 玩法
		 */
		jumpToMatch:function(playMode){
			GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_HALL_BACKGROUND_MUSIC_MP3, true);
			hall.ToDoTask.clearTasks();
			hall.PluginInterface.getCurrentSceneController().destroy(false);

			// GLOBAL_OBJ.LOGD(this._TAG, "enter mj by default 2" + JSON.stringify(playMode));
			MANAGER.release();
			var s = new GLOBAL_OBJ.businesses.scenes.Match.Scene(null, playMode);
			MANAGER.replaceScene(s);
		},

		/**
		 * 设置设计分辨率
		 */
		setDs:function () {
			if (!hall.PluginInterface.isHall5){
				//老大厅的设计分辨率是960*640的在4：3比例下，牌桌会放不下，要更改设计分辨率
				var screenSize = cc.view.getFrameSize();
				if(screenSize.height / screenSize.width  == 0.75){
					ty.Util.setDesignResolutionSize(1136, 640, 'kResolutionFixedWidth');
				}
			}
		},

		/*
	    返回大厅*/
	    jumpToHall:function(_scene){
	        GLOBAL_OBJ.interface.backHall(_scene);
	    },

		/*
	    进入牌桌*/
	    jumpToTable:function(_replacable){

	    	MANAGER.release();
	    	var _tableScene = new GLOBAL_OBJ.table.scenes.Table.Scene();
            _tableScene.init(GLOBAL_OBJ.RES.TABLE_SCENE_CCBI);
            GLOBAL_OBJ.LOGD(this._TAG,"jumpToTable 进入牌桌 保留牌桌引用");
            this.setCurrentTableScene(_tableScene);
            if (true == _replacable) {
            	MANAGER.replaceScene(this.getCurrentTableScene());
            }else{
            	MANAGER.pushScene(this.getCurrentTableScene());
            }
            if (GLOBAL_OBJ.UserDefault.shareUserDefault().getMusicStatus() > 0){
				GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_TABLEMUSIC_MP3, true);
			}

			//hall.AudioHelper.stopMusic();

            return _tableScene;
	    },

	    /*
	    从牌桌返回*/
	    jumpBack:function(_type, _mode){
	    	var GLOBAL_T        = GLOBAL_OBJ.table.global;
	    	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
			var type 			= _type;//MODEL_TABLEINFO.getTableType();
            var mode 			= _mode;//MODEL_TABLEINFO.getPlayMode();

            GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_HALL_BACKGROUND_MUSIC_MP3, true);
            //按照模式弹出
            this.jumpToRoomList(mode);
	    }
	};
	
})();