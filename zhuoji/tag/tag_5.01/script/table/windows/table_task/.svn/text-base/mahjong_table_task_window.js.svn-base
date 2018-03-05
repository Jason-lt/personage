/*************************************************************
 *  mahjong_table_task_window.js
    mahjong_table_task_window
 *  mahjong
 	金币场任务列表
 *
 *  Created by lcr on 17-08-09
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var MODEL_TABLE_SHOWTASKTIPS  	= GLOBAL_OBJ.table.models.showtasktips;
	var AUDIO           			= GLOBAL_OBJ.bkernel.utils.Audio;

	GLOBAL_OBJ.table.windows.TableTask.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.TableTask.Window",
		ctor: function(_params) {
			this._super();
			this.params = _params;
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that		= this;
			var size 		= this.viewNode.getContentSize();

			// var detailData	= ["aaaaaaaa", "bbbbbbbbb", "ccccccccc", "ddddddddd"];
			var detailData  = MODEL_TABLE_SHOWTASKTIPS.getStreakAllDescInfo();
			var dataNum 	= detailData.length;

            this.taskTableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   : cc.size(size.width, size.height),
                direction  : cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  : cc.TABLEVIEW_FILL_TOPDOWN,
                cell       : GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   : cc.size(size.width, 50),
                controller : GLOBAL_OBJ.table.windows.TableTask.Cell,
                container  : that.viewNode,
                data       : detailData,
            });

            this.viewNode.addChild(this.taskTableview);
            this.taskTableview.reloadData(dataNum);
		},


		onCleanup:function() {
			this._super();
			//GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
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
            return true;
        },

        onClose:function()
        {
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLOSEBUTTON_MP3);
        	this.windowClose();
        },

	});
	//end
})();

