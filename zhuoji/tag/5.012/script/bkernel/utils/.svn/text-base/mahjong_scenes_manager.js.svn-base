/*************************************************************
 *  mahjong_scenes_manager.js
    mahjong_scenes_manager
 *  mahjong
 	牌桌场景管理器
 *
 *  Created by nick.kai.lee on 16-05-31
 *  特殊说明：
    使用方法:

    var s = new GLOBAL_OBJ.table.scenes.Table.Scene();
    s.init("games/" + GLOBAL_OBJ.GAMENAME + "/ccbi/table_panel_right.ccbi")
    GLOBAL_OBJ.bkernel.utils.ScenesManager.pushScene(s);
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.utils.ScenesManager = {
		_TAG:"bkernel.utils.ScenesManager",
		_currentScene:[],//当前场景

		getCurrentScene:function(){
			var index = this._currentScene.length-1 < 0 ? 0 : this._currentScene.length-1;
			return this._currentScene[ index ];
		},

		pushScene:function(_scene){
			this._currentScene.push(_scene);

			//大厅非要接这个接口（否则无法调用大厅的layer）
	        hall.PluginInterface.setCurrentSceneController(_scene);

        	var scene = cc.Scene.create();
        	var ccb   = _scene.view.ccbRootNode;
	        if(ccb){
	            scene.addChild(ccb);
	        }

	        if(null == cc.director.getRunningScene()){
	        	cc.director.runWithScene(scene);
	        }else{
	        	cc.director.pushScene(scene);
	        }
		},

		popScene:function(){
			this._currentScene.pop();
			cc.director.popScene();
		},

		replaceScene:function(_scene){
			//大厅非要接这个接口
	        hall.PluginInterface.setCurrentSceneController(_scene);
			
			var index = this._currentScene.length-1 < 0 ? 0 : this._currentScene.length-1;
			this._currentScene[ index ] = _scene;

        	var scene = cc.Scene.create();
        	var ccb   = _scene.view.ccbRootNode;
	        if(ccb){
	            scene.addChild(ccb);
	        }

			if(null == cc.director.getRunningScene()){
	        	cc.director.runWithScene(scene);
	        }else{
	        	cc.director.replaceScene(scene);
	        }

		},

		/*
		释放当前场景的资源*/
		release:function(){
			var curr  = this.getCurrentScene();
			if (curr) {
				curr.onBeforeCleanup();
			}
		}
	};
	//end
})();