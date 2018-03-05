/*************************************************************
 *  mahjong_create_room_rules_button_cell.js
    mahjong_create_room_rules_button_cell
 *  mahjong
 	自建桌 玩法介绍按钮button cell
 *
pk modify:这个文件原来是有的 现利用上
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS					                 = GLOBAL_OBJ.businesses.functions;
	var STATIC                                           = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
	var MODEL 										     = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesButtonCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.RulesButtonCell",
		ctor: function(_index,_config) {

			this._super();

			this.index  = _index;
			// cc.log(_index+"sdfsdf====123231===" + JSON.stringify(_config.data));
			this.data = _config.data.data[this.index];

			this.init( GLOBAL_OBJ.RES.CREATE_ROOM_RULE_BUTTON_CELL_CCBI );
		},


		onLoad: function() {
			this._super();

			var that     = this;

			this.normalLabel.setString(this.data.title);
			this.selectedLabel.setString(this.data.title);
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

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_TAB_TOUCH,this.onSelecttt,this);
		},

		onSelecttt:function (sidx) {
			GLOBAL_OBJ.LOGD("onSelecttt=====", sidx);
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

			this.normalLabel.setString(this.data.title);
			this.selectedLabel.setString(this.data.title);
			var sIndex = this.data.selectedIndex;
			this.normalNode.setVisible( sIndex != this.index );
			this.selectedNode.setVisible( sIndex == this.index );
			this.manager.setTouchEnabled( sIndex != this.index );
		}
	});
	//end
})();

