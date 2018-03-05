/*************************************************************
 *  mahjong_table_user_card_window.js
    mahjong_table_user_card_window
 *  mahjong
 	麻将牌桌 名片 等待区
 *
 *  Created by nick.kai.lee on 16-09-10
 *  特殊说明：
 	
    使用方法:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    
	var GLOBAL_T 			              = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS                 	  = GLOBAL_OBJ.businesses.functions;
    var C2S                               = GLOBAL_OBJ.table.network.C2S;
    var MODEL_USER                        = GLOBAL_OBJ.businesses.modules.User.Model;
    var MODEL_TABLEINFO                   = GLOBAL_OBJ.table.models.TableInfo;
	GLOBAL_OBJ.table.windows.UserCard.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.UserCard.Window",
		ctor: function(_params) {
			this._super();
			this.params = _params;
            this.chat_cd_time = this.params.cdtime;//表情的CD时间
            this.coinShow = true;
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that     = this;
            this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
            if(this.isCreate){
                var pos = this.bottomNode01.getPosition();
                this.bottomNode01.setPositionY(pos.y - 13);
            }else{
                var myChips         = hall.ME.getChip();
                GLOBAL_OBJ.LOGD("user_card_window_myChips:", myChips);
                if(myChips <= 0){
                    var pos = this.bottomNode01.getPosition();
                    this.bottomNode01.setPositionY(pos.y - 13);
                    this.coinShow = false;
                }
            }
            that.popWinAction(true);

            GLOBAL_OBJ.LOGD("user_card_window_chat_cd_time:", this.chat_cd_time);
            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.bkernel.Events.TICK, function(){
                if(!that.isCreate){
                    var i;
                    if(that.chat_cd_time > 0){
                        that.chat_cd_time = that.chat_cd_time - 1;
                        for(i = 1; i <= 5; i++){
                            that["EmoColorLayer" + i].setVisible(true);
                            that["EmoColorTime" + i].setString(that.chat_cd_time);
                        }
                    }else{
                        for(i = 1; i <= 5; i++){
                            that["EmoColorLayer" + i].setVisible(false);
                        }
                    }
                }
            }, this);


            var pos      = this.params.pos;

            switch (this.params.sid){
                case GLOBAL_T.SEATS.N0:
                    pos.x = pos.x + 330;
                    pos.y = pos.y + 90;
                    break;
                case GLOBAL_T.SEATS.N1:
                    pos.x = pos.x - 320;
                    pos.y = pos.y - 80;
                    break;
                case GLOBAL_T.SEATS.N2:
                    pos.x = pos.x - 220;
                    pos.y = pos.y - 130;
                    break;
                case GLOBAL_T.SEATS.N3:
                    pos.x = pos.x + 330;
                    pos.y = pos.y + 50;
                    break;
                default:
                    break;
            }

            this.getRootNode().setPosition(pos);

            GLOBAL_OBJ.businesses.modules.User.Portrait.produce( this.params.uid,
                GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, this.portraitNode);
            this.update();
		},

		onCleanup:function() {
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            for (var j in this.allcells) {
                this.allcells[j].destroy();
            }
            this.allcells.length = 0;
            this.allcells = null;

			this._super();
		},

		onEase:function(){
            this._super();
		},

        // 弹出窗的显示和隐藏效果
        popWinAction:function(isVisible){
            var that = this;
            var node = this.getRootNode();
            node.stopAllActions();
            var scaleAction = null;
            var actionTime = 0.25;
            if(isVisible == true){
                node.setScale(0);
                scaleAction = cc.EaseBackOut.create(cc.ScaleTo.create(actionTime,1));
                node.setVisible(true);
                node.runAction(scaleAction);
            }else{
                scaleAction = cc.EaseBackIn.create(cc.ScaleTo.create(actionTime - 0.15,0));
                node.runAction(cc.Sequence.create(scaleAction,cc.CallFunc.create(function () {
                    that.windowClose();
                })));
            }
        },

		/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            // var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefWorld( this.touchNode );
            var rect  = this._bgNode.getBoundingBox();
            if (!cc.rectContainsPoint(rect, point)) {
                // this.windowClose();
                this.popWinAction(false);
                return false;
            };
            return true;
        },

        /*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return true;
		},
		
        update:function(){
            var uid = this.params.uid;

            this.bottomNode01.setVisible(uid != hall.AccountInfo.userID);

            GLOBAL_FUNCS.textureChange( this.sexSpr, MODEL_USER.getSex( uid ) == 1 ? GLOBAL_OBJ.RES.GIRL_ICON_PNG : GLOBAL_OBJ.RES.BOY_ICON_PNG );
            this.nameLabel.setString( MODEL_USER.getName(uid) );

            if (this.isCreate){
                // this.contentLabel01.setString( GLOBAL_FUNCS.formatGold(MODEL_USER.getCustomScore(uid)) ); //积分

            } else{
                if(this.coinShow){
                    var chat_chip_num = MODEL_TABLEINFO.getChatChip();
                    for(var iconnum = 1; iconnum <= 5; iconnum++){
                        this["EmoChipLayer" + iconnum].setVisible(true);
                        this["coinLabel" + (iconnum-1)].setString(chat_chip_num.toString())
                    }
                }
                // this.contentLabel01.setString( GLOBAL_FUNCS.formatGold(MODEL_USER.getCoin(uid)) ); //金币
            }

            // this.contentLabel02.setString( MODEL_USER.getMaxContinuousWin(uid) ); //最大连胡
            // this.contentLabel03.setString( MODEL_USER.getMaxDegree(uid) ); //最大番
            // this.contentLabel04.setString( MODEL_USER.getIP(uid) ); //IP

            // 表情序号
            if (!this.chatemoOrders) {
                this.chatemoOrders = [];
                for (var i = 1; i <= 12; i++) {
                    this.chatemoOrders.push(i);
                }
            }
            this.allcells = [];
            this.chatTableCellSize = cc.size(120, 125);
            this.chatTableSize = this['nodeChat'].getContentSize();
            if(uid == hall.AccountInfo.userID){
                this.nodeChatTableView = this.makeTable();
            }
            this.nodeChat.setVisible(uid == hall.AccountInfo.userID);

        },

        makeTable: function() {
            var tableView = cc.TableView.create(this, this.chatTableSize);

            tableView.getContainer().setLocalZOrder(-1);//使优先级高于内容
            tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
            tableView.setDelegate(
                {
                    scrollViewDidScroll:function() {
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHAT_SCROLLING, {scrolling: true});
                    }
                }
            );
            this['nodeChat'].addChild(tableView);
            tableView.setPosition(cc.p(0, 0));

            tableView.reloadData();
            return tableView;
        },

        tableCellSizeForIndex: function(table, index) {
            return this.chatTableCellSize;
        },

        numberOfCellsInTableView: function(table) {
            return this.chatemoOrders.length;
        },

        tableCellAtIndex: function(table, index) {
            var cell = table.dequeueCell();
           // GLOBAL_OBJ.LOGD("tableCellAtIndex_chat");

            if (!cell) {
                cell = new cc.TableViewCell();
                var ctrl = new GLOBAL_OBJ.table.windows.PlayerChat.PlayerInfoControllerChatCell(index, cell, this);
                this.allcells.push(ctrl);
                cell.ctrl = ctrl;
            }
            cell.ctrl.setIndex(index);
            cell.ctrl.setChatEmoIndex(this.chatemoOrders[index]);
            return cell;
        },

        // runDisappearAction:function(){
        //     if (this._touchListener) {
        //         this._touchListener.setEnabled(false);
        //     }
        //     if (!this._isShowOutingAnimation) {
        //         ddz.GlobalFuncs.popWinAction(false,this.getRootNode(),this);
        //         this._isShowOutingAnimation = true;
        //     }
        // },

        /*
        送钻石*/
        onDiamond:function(){
            if(!this.isCreate && this.chat_cd_time > 0){
                return;
            }
            this.popWinAction(false);
            C2S.requestSendEmoji( 
                MODEL_TABLEINFO.getRoomId(), 
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId(), 
                GLOBAL_OBJ.table.utils.Seat.toServerSeatId( this.params.sid ), 1 );
            if(!this.isCreate){
                var callFunc = this.params.setTimeFunc;
                callFunc(MODEL_TABLEINFO.getChatTime());
            }
            this.btn_Diamond.setEnabled(false);
        },


        /*
        送炸弹*/
        onBomb:function(){
            if(!this.isCreate && this.chat_cd_time > 0){
                return;
            }
            this.popWinAction(false);
            C2S.requestSendEmoji( 
                MODEL_TABLEINFO.getRoomId(), 
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId(), 
                GLOBAL_OBJ.table.utils.Seat.toServerSeatId( this.params.sid ), 0 );
            if(!this.isCreate){
                var callFunc = this.params.setTimeFunc;
                callFunc(MODEL_TABLEINFO.getChatTime());
            }
            this.btn_Bomb.setEnabled(false);
        },


        /*
        送玫瑰*/
        onRose:function(){
            if(!this.isCreate && this.chat_cd_time > 0){
                return;
            }
            this.popWinAction(false);
            C2S.requestSendEmoji( 
                MODEL_TABLEINFO.getRoomId(), 
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId(), 
                GLOBAL_OBJ.table.utils.Seat.toServerSeatId( this.params.sid ), 3 );
            if(!this.isCreate){
                var callFunc = this.params.setTimeFunc;
                callFunc(MODEL_TABLEINFO.getChatTime());
            }
            this.btn_Rose.setEnabled(false);
        },


        /*
        送臭鸡蛋*/
        onEgg:function(){
            if(!this.isCreate && this.chat_cd_time > 0){
                return;
            }
            this.popWinAction(false);
            C2S.requestSendEmoji( 
                MODEL_TABLEINFO.getRoomId(), 
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId(), 
                GLOBAL_OBJ.table.utils.Seat.toServerSeatId( this.params.sid ), 2 );
            if(!this.isCreate){
                var callFunc = this.params.setTimeFunc;
                callFunc(MODEL_TABLEINFO.getChatTime());
            }
            this.btn_Egg.setEnabled(false);
        },

        /*
         送板砖*/
        onBrick:function(){
            if(!this.isCreate && this.chat_cd_time > 0){
                return;
            }
            this.popWinAction(false);
            C2S.requestSendEmoji(
                MODEL_TABLEINFO.getRoomId(),
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId(),
                GLOBAL_OBJ.table.utils.Seat.toServerSeatId( this.params.sid ), 4 );
            if(!this.isCreate){
                var callFunc = this.params.setTimeFunc;
                callFunc(MODEL_TABLEINFO.getChatTime());
            }
            this.btn_Brick.setEnabled(false);
        },
	});
	//end

	/*
	测试用例*/
	GLOBAL_OBJ.table.windows.UserCard.Window.test = function(){
	    var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_USER_CARD,
	    	{}, hall.SceneManager.getCurrentController().getRootNode());
	};
})();

