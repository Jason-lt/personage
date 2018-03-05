/*************************************************************
 *  mahjong_create_room_info_window.js
    mahjong_create_room_info_window
 *  mahjong
 	自建桌的信息 window
 *
 *  Created by nick.kai.lee on 16-07-05
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var C2S 								        = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_FUNCS							    = GLOBAL_OBJ.businesses.functions;
	var MODEL 										=  GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.InfoWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.InfoWindow",
		ctor: function(params_) {
			this._super();
			this.params=params_;
			//this.init(GLOBAL_OBJ.RES.CREATE_ROOM_INFO_WND_CCBI);
		},

		initData: function(data_) {
			// GLOBAL_OBJ.LOGD(this._TAG,"GLOBAL_OBJ.businesses.scenes.CustomRoom.InfoWindow initData : "+data_);
			// this.params = data_;
            //
			// var that 	  = this;
			// var data 	  = { data:[] };
            // var tableView = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
             //    viewSize   :this.viewNode.getContentSize(),
             //    direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
             //    fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
             //    bounce     :true,
             //    cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
             //    // cellSize   :cc.size(0, 0),
             //    controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.InfoCell,
             //    container  :this.viewNode,
             //    data       :data
            // });
            // this.viewNode.addChild(tableView);
            //
            // // 刷新数据
            // var _f_update_ = function(){
            	// data.data = MODEL.getCreateRoomDescList();
            	// tableView.reloadData(data.data.length);
            	// that.roomIdLabel.setString( "房间:"+(that.params.createTableNo||0));
            // };
            //
			// /*
			// @通知注册*/
			// GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_DESC_LIST,function(){
			// 	_f_update_();
			// },this);
            //
			// GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_INFO, function(){
			// 	_f_update_();
			// }, this);
            //
			// _f_update_();

		},

		onLoad: function() {
			// GLOBAL_OBJ.LOGD(this._TAG,"GLOBAL_OBJ.businesses.scenes.CustomRoom.InfoWindow onload : "+this.params);
			this._super();
		},

		/*
		弹窗弹出完毕 */
		onEase:function(){
			this._super();
			if (this.params.isClose && this.params.isClose == true){
				this.playAnim("close");
			}
		},

		onClose:function(){
			this.windowClose();
		},

		onCleanup:function(){
			this._super();
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

		/*
		touch响应，基类重载 */
		onTouchBegan:function(_touch,_event){
			this._super();
 			return false;
		},

		// 是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可
		isKeyBackListenEnabled:function(){
			return false;
		},

		/*
		展开*/
		// onExpand:function(){
		// 	if       ( this.panelNode.isVisible() && this.getRootNode().getNumberOfRunningActions()==0) {
		// 		this.playAnim("close");
		// 	}else if (!this.panelNode.isVisible() && this.getRootNode().getNumberOfRunningActions()==0) {
		// 		this.playAnim("open");
		// 	};
		// },
	});
	//end
})();

