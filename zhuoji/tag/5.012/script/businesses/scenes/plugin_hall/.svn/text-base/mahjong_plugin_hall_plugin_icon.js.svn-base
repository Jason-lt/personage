/*************************************************************
 *  mahjong_plugin_hall_plugin_icon.js
    mahjong_plugin_hall_plugin_icon
 *  mahjong
 	插件大厅 游戏ICON
 *
 *  Created by nick.kai.lee on 16-01-26
 *  特殊说明：
	每一个ICON ccb都要有一个节点 btnNode
    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
	    
	GLOBAL_OBJ.businesses.scenes.PluginHall.iconMap = [
		GLOBAL_OBJ.RES.XLMJ_DT_ICON_HYF_CCBI,  //好友房
		GLOBAL_OBJ.RES.XLMJ_DT_ICON_ZYZ_CCBI,  //自由桌
		GLOBAL_OBJ.RES.XLMJ_DT_ICON_JRFJ_CCBI, //加入房间
		GLOBAL_OBJ.RES.XLMJ_DT_ICON_CJFJ_CCBI  //创建房间
	];

	GLOBAL_OBJ.businesses.scenes.PluginHall.PluginIcon = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.PluginHall.PluginIcon",
		ctor: function(_index) {
			this.index  = _index;
			this.guideHandAni 	= null;
			this.guide2 	  	= null;
			this.guide3 	  	= null;
			this.guide4 	  	= null;
			this._super();

			this.init(GLOBAL_OBJ.businesses.scenes.PluginHall.iconMap[this.index]);
		},

		onLoad: function() {
			this._super();
			if(!this.isEnterPluginHallUI() && this.index == 1){//自由桌
				this.setEnterPluginHallUI();
				this.showGuideHand();
			}
		},

		// 设置进入过比子大厅
		setEnterPluginHallUI:function() {
			hall.LocalStorage.setItem(this.keyPluginHall(), 'true');
		},

		// 是否进入过子大厅hall.AccountInfo.userID
		isEnterPluginHallUI:function() {
			return hall.GlobalFuncs.ReadBoolFromLocalStorage(this.keyPluginHall(), false);
		},


		keyPluginHall:function () {
			return "gdmj_guide_first_hand_" + hall.AccountInfo.userID;
		},

		showGuideHand:function () {
			//手
			this.guideHandAni = GLOBAL_OBJ.bkernel.utils.Animation.play(
				this.rootNode,
				GLOBAL_OBJ.RES.NEWBIE_GUIDE1_CCBI,
				cc.p(105,-70),
				function(_animate){},
				function(_animate){},
				true,1.0,"yindao");

			this.guide2 = GLOBAL_OBJ.bkernel.utils.Animation.play(
				this.gold_guide2,
				GLOBAL_OBJ.RES.NEWBIE_GUIDE2_CCBI,
				cc.p(0,0),
				function(_animate){},
				function(_animate){},
				true,1.0,"yindao");

			this.guide3 = GLOBAL_OBJ.bkernel.utils.Animation.play(
				this.gold_guide3,
				GLOBAL_OBJ.RES.NEWBIE_GUIDE3_CCBI,
				cc.p(0,0),
				function(_animate){},
				function(_animate){},
				true,1.0,"yindao");

			this.guide4 = GLOBAL_OBJ.bkernel.utils.Animation.play(
				this.gold_guide4,
				GLOBAL_OBJ.RES.NEWBIE_GUIDE4_CCBI,
				cc.p(0,0),
				function(_animate){},
				function(_animate){},
				true,1.0,"yindao");
		},

		runZoomIn:function () {
			this.rootNode.setOpacity(255);
			this.rootNode.setScale(1);
			this.playAnimation('dakai');
		},

		removeGuide:function () {
			if (this.index == 1){
				if(this.guideHandAni){
					this.guideHandAni.getRootNode().removeFromParent();
					this.guideHandAni = null;
				}
				if(this.guide2){
					this.guide2.getRootNode().removeFromParent();
					this.guide2 = null;
				}
				if(this.guide3){
					this.guide3.getRootNode().removeFromParent();
					this.guide3 = null;
				}
				if(this.guide4){
					this.guide4.getRootNode().removeFromParent();
					this.guide4 = null;
				}
			}
		},

		runZoomOut:function () {

			this.removeGuide();

			GLOBAL_OBJ.bkernel.Functions.recurseCascadeOpacity(this.rootNode,1);
			var fadeOutAction = cc.FadeTo.create(0.15,0);
			var zoomOutAction = cc.ScaleTo.create(0.15,0.8);

			var spw = cc.Spawn.create(fadeOutAction,zoomOutAction);
			this.rootNode.runAction(spw);
		},

		onBtnTouch:function (sender, controlEvent) {

			if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER){
				this.btnNode.setScale(0.98);
			}
			else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){
				this.btnNode.setScale(1.0);
			}
			else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE) {
				this.btnNode.setScale(1.0);
				this.removeGuide();

				GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.TO_HYZ ,this.index);
			}
		},

		onCleanup:function() {
			this._super();
		}
	});
//end
})();
