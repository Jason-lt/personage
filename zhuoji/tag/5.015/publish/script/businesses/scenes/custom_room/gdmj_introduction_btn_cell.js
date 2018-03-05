/*************************************************************
 *  mahjong_create_gameplay_introduction_btn_cell.js
 	mahjong_create_gameplay_introduction_btn_cell
 *  mahjong
 	玩法介绍按钮  button cell
 *
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.gameplayIntrCell",
		ctor: function(_index,_config) {
			this._super();
			this.index  		= _index;
			this.data 			= _config.data;
			this.playName 		= this.data.data[this.index];
			this.init( GLOBAL_OBJ.RES.GDMJ_INTRODUCTION_BTN_CELL_CCBI );
		},

		onLoad: function() {
			this._super();
			var that     = this;
			GLOBAL_OBJ.LOGD(this._TAG, "load_this_normalLabel:" + this.playName );
			this.normalLabel.setString(this.playName);
			GLOBAL_OBJ.LOGD(this._TAG, "load_this_selectedLabel:" + this.playName );
			this.selectedLabel.setString(this.playName);
			/*
			 @bind_block_scrolling_touch扩展，可以扩展一个适用于tableview的按钮扩展，该api返回touch管理者，提供默认的几个api
			 详情参考源码
			 该模块将edgeNode设置的和touchNode一致，就是一个普通按钮，仅仅是滑动时不支持touch响应而已
			 外部使用getTouchManager暴露出去的touch管理者，重新设置edgeNode，以便支持tableview边界时屏蔽touch
			 */
			this.manager = GLOBAL_OBJ.bkernel.extend.Touch.bind_block_scrolling_touch(
				this.buttonNode,
				this.buttonNode,
				false,
				function(listener, touch, event){ /*touch began*/ return true; },
				function(){ /*touch moved*/ },
				function(listener, touch, event){
					/*touch ended*/
					GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_GAMEPLAY_INTRODUCTION_BTN_TOUCH,that.index);
				},
				function(){ /*touch canceled*/ return false; }
			);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_GAMEPLAY_INTRODUCTION_BTN_TOUCH,this.onGameBtnSelect,this);
		},

		onGameBtnSelect:function (sidx) {
			GLOBAL_OBJ.LOGD("gameplayIntrCell_onGameBtnSelect_index:", sidx);
			var selected = sidx == this.index;

			this.normalNode.setVisible( !selected );
			this.selectedNode.setVisible( selected );
			this.manager.setTouchEnabled( !selected );
		},

		onCleanup:function() {

			this.manager.unbind();
			this.manager = null;

			this.data    = null;

			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

			this._super();
		},

		/*
		界面刷新
		*/
		update:function(_index, _config){
			// GLOBAL_OBJ.LOGD(this._TAG, "update_this_normalLabel:" + this.playName );
			// this.normalLabel.setString(this.playName);
			// GLOBAL_OBJ.LOGD(this._TAG, "update_this_selectedLabel:" + this.playName );
			// this.selectedLabel.setString(this.playName);
			var sIndex = this.data.selectedIndex;
			this.normalNode.setVisible( sIndex != this.index );
			this.selectedNode.setVisible( sIndex == this.index );
			this.manager.setTouchEnabled( sIndex != this.index );
		}
	});
	//end
})();

