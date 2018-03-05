/*************************************************************
 *  mahjong_create_room_type_button_cell.js
    mahjong_create_room_type_button_cell
 *  mahjong
 	创建房间 玩法按钮button cell
 *
 *  Created by nick.kai.lee on 16-06-21
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var MODEL = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	var GLOBAL_FUNCS					            = GLOBAL_OBJ.businesses.functions;

	GLOBAL_OBJ.businesses.scenes.CustomRoom.TypeButtonCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.TypeButtonCell",
		ctor: function(_index,_config,_ccb) {
			// _ccb是通过子类传进来的
			this._super();
			this.index = _index;
			this.data = _config.data[_index];

			this.init(_ccb ? _ccb : GLOBAL_OBJ.RES.CREATE_ROOM_TYPE_BUTTON_CELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that     = this;

			// this.txtNormalName.setString(this.data.playModeDesc);
			// this.txtSelectedName.setString(this.data.playModeDesc);

			var cfg = MODEL.getBtnCfg(this.data.playMode);
			if (cfg){
				GLOBAL_FUNCS.textureChange(this.imgNormal, cfg[0]);
				GLOBAL_FUNCS.textureChange(this.imgSelect, cfg[1]);
			}
			else{
				this.imgNormal.setVisible(false);
				this.imgSelect.setVisible(false);
			}

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
					GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_TAB_TOUCH,that.index);
				},
				function(){ /*touch canceled*/ return false; }
			);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_TAB_TOUCH,this.onSelect,this);
		},

		onSelect:function (sidx) {

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
		}
	});
})();