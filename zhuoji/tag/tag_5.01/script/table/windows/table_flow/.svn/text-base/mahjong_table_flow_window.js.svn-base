/*************************************************************
 *  mahjong_table_flow_window.js
    mahjong_table_flow_window
 *  mahjong
 	四川血战麻将牌桌对局流水
 *
 *  Created by simon on 17-06-19
 */

(function(){
    var GLOBAL_OBJ = guiyang;
    
	var GLOBAL_FUNCS    = GLOBAL_OBJ.businesses.functions;
    var GLOBAL_T        = GLOBAL_OBJ.table.global;
	var MODEL_FLOW 		= GLOBAL_OBJ.table.models.Flow;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
	var AUDIO           = GLOBAL_OBJ.bkernel.utils.Audio;

	GLOBAL_OBJ.table.windows.Flow.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Flow.Window",
		ctor: function(_params) {
			this._super();
			this.params = _params;
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var size = this.viewNode.getContentSize();

			var totalScore = MODEL_FLOW.getTotalScore();
			this.scoreLab.setString(GLOBAL_FUNCS.formatGold(totalScore));

			var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			if (isCreate)
			{
				this.fengDingLab.setVisible(true);
				var maxFan = MODEL_FLOW.getMaxFanDesc();
				this.fengDingLab.setString(maxFan);
			}
			else
			{
				this.fengDingLab.setVisible(false);
			}
			
			var detailData = MODEL_FLOW.getDetailDescList(GLOBAL_T.MYSEAT);
			var dataNum = detailData.length;

            this.flowTableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   : cc.size(size.width, size.height),
                direction  : cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  : cc.TABLEVIEW_FILL_TOPDOWN,
                cell       : GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   : cc.size(size.width, 50),
                controller : GLOBAL_OBJ.table.windows.Flow.Cell,
                container  : this.viewNode,
                data       : detailData,
            });

            this.viewNode.addChild(this.flowTableview);
            this.flowTableview.reloadData(dataNum);
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

