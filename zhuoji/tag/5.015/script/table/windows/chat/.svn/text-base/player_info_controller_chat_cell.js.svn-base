//
//  PlayerInfoControllerChatCell
//
//  Created by Luwei on 16-07-01.
// 
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
            
    GLOBAL_OBJ.table.windows.PlayerChat.PlayerInfoControllerChatCell = cc.Class.extend({

    	_TAG:"table.windows.PlayerChat.PlayerInfoControllerChatCell",

    	ctor: function(index, cell, playInfoController) {
    		var self = this;
    		var height = playInfoController['nodeChat'].getContentSize().height;
    		this.playInfoController = playInfoController;
    		this.index = index;
    		// this.chat_cd_time = playInfoController.chat_cd_time;
    		this.scrolling = false;
            // this.isCreate = GLOBAL_OBJ.table.models.TableInfo.getTableType() == GLOBAL_OBJ.TableType.Create;
            this.rootNode = cc.BuilderReader.loadWithController(GLOBAL_OBJ.RES.DDZ_TABLE_PLAYER_INFO_CHAT_CELL_CCBI, this, this);
    		this.rootNode.setScale(0.9);
    		var box = this.rootNode.getBoundingBox();
    		this.rootNode.setPositionY((height - box.height)/2);
    		cell.addChild(this.rootNode);

    		GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHAT_SCROLLING,
    			this.onTableScrollStatusChanged, this);

            var chatTableNode = playInfoController['nodeChat'];
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch, event) {
                	// 触摸开始，则意味着滑动停止
                    self.scrolling = false;

                    // bugfix:
                    // 此TableViewCell中的Button控件，在TableView的可见区域外仍然能接收事件(仅一半露在外头的Cell，全部不可见的Cell会被重用)
                    // 监听`ccbNodeCover`的触摸事件，其层级在按钮之上，先于按钮处理事件，所以通过判断触摸是否在TableView的可见区域内，设置Button控件的是否可用
    	        	var npos = chatTableNode.convertToNodeSpace(touch.getLocation());
    	        	var box = chatTableNode.getBoundingBox();
    	        	box.x = 0; box.y = 0;
    	        	self['ccbBtnEmo'].setEnabled(cc.rectContainsPoint(box, npos));

                    return false;
                },
            }, this['ccbNodeCover']);


    	},

    	destroy: function() {
    		GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
    		this.rootNode.removeFromParent();
    	},

    	onTableScrollStatusChanged: function(data) {
            this.scrolling = data.scrolling;
    	},

    	setIndex: function(index) {
    		this.index = index;
    	},

    	setChatEmoIndex:function(emoindex) {
    		this.emoindex = emoindex;
    		var indexstr = emoindex.toString();
    		var pngname = GLOBAL_OBJ.RES["CHAT_EMO_" + indexstr + "_PNG"];
    		this['ccbSpriteEmo'].setSpriteFrame(pngname);
    	},

    	onBtnClicked: function() {
    		// cc.log("PlayerInfoControllerChatCell.onBtnClicked -> ", this.emoindex);
    		if (this.scrolling) {
    			return;
    		}
    		// if(!this.isCreate && this.chat_cd_time > 0){
    		// 	return;
    		// }
    		this.playInfoController.popWinAction(false);
    		GLOBAL_OBJ.table.network.C2S.requestTableChat(
    			GLOBAL_OBJ.table.models.TableInfo.getRoomId(),
    			GLOBAL_OBJ.table.models.TableInfo.getTableId(),
    			GLOBAL_OBJ.table.models.TableInfo.getActiveServerSeatId(), 1, this.emoindex);
    		// var callFunc = this.playInfoController.params.setTimeFunc;
    		// callFunc(GLOBAL_OBJ.table.models.TableInfo.getChatTime());
    	},

    });

})();
