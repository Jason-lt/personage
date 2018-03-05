/*************************************************************
 *  mahjong_match_info_window.js
    mahjong_match_info_window
 *  mahjong
 	比赛列表中的比赛详情window
 *
 *  Created by zengxx on 16-03-28
 *  特殊说明：

    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL        = GLOBAL_OBJ.businesses.scenes.MatchListCenter.Model;
	var STATIC       = GLOBAL_OBJ.businesses.scenes.MatchListCenter.static;

	GLOBAL_OBJ.businesses.scenes.MatchListCenter.InfoWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:'GLOBAL_OBJ.businesses.scenes.MatchListCenter.InfoWindow',

		ctor:function(_params){
			this._super();
			this.mParams = _params;
			this.mRoomId = MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex);
			ty.extend.schedulerExtend(this);
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
			var that = this;

			// 标签按钮
			GLOBAL_FUNCS.toggleButtonGroup(this.tabBtn_1,this.tabBtn_2,this.tabBtn_3);
			
			this.tabSpr01Group = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible",
                [false,true],[this.tabBtnSpr_1_1,this.tabBtnSpr_1_2]);
            this.tabSpr02Group = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible",
                [false,true],[this.tabBtnSpr_2_1,this.tabBtnSpr_2_2]);
            this.tabSpr03Group = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible",
                [false,true],[this.tabBtnSpr_3_1,this.tabBtnSpr_3_2]);

			this.mTabNodeGroup   = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true], [this.detailNode, this.rewardNode, this.helpNode]);
			this.tabBtn_2.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

			// 概况
			this.startTimeLabel.setString(GLOBAL_FUNCS.formatTimeForTimeStamp("h:m", MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex)));
			var matchType = MODEL.getMatchTypeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex);
			switch(matchType){
				case STATIC.MATCHTYPE.OLD:
					this.oldMatchInfoNode.setVisible(true);
					this.endTimeLabel.setString(GLOBAL_FUNCS.formatTimeForTimeStamp("h:m", MODEL.getEndTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex)));
					this.personLimitLabel.setString(MODEL.getPersonLimitByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
					this.matchConditionLabel.setString(MODEL.getConditionByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
					break;
				case STATIC.MATCHTYPE.MTT:
					this.mttMatchInfoNode.setVisible(true);
					this.continueTimeLabel.setString(GLOBAL_FUNCS.formatTimeString("h:m:s", MODEL.getContinueTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex)));
					this.signinCountLabel.setString(MODEL.getPersonByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
					this.signFeesLabel.setString(MODEL.getFeesByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
					break;
				default:
					break;
			}

			// 奖励&规则
			this.createRewardList();
			this.createHelpList();

			// 刷新人数
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_UPDATE,function(){
				that.signinCountLabel.setString(MODEL.getPersonByTabIndexAndCellIndex(STATIC.index, that.mParams.cellIndex));
			},this);

			// 刷新报名状态
			if (matchType == STATIC.MATCHTYPE.OLD){
				this.btnNode.setVisible(false);
			}
			var signGroup = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible", [false,true],[this.signinNode,this.signoutNode]);
			signGroup.setVisible(MODEL.hasSigninedByRoomId(that.mRoomId)==1?1:0);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_MATCH_SIGNS,function(){
				signGroup.setVisible(MODEL.hasSigninedByRoomId(that.mRoomId)==1?1:0);
			}, this);

			if (MODEL.getMatchTypeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex) == STATIC.MATCHTYPE.MTT){
	            // 每固定时间间隔请求一次报名人数
	            var _reqUpdate = function(){
	                that.unschedule("delay");
	                that.schedule("match_update",function(){
	                	GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(that.mRoomId, MODEL.getMatchInstIdByRoomId(that.mRoomId));
	                },MODEL.getReqUpdateIntervalByRoomId(that.mRoomId));
	            };

	            var time = MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex) - GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime(); // 剩余时间
	            if (time <= MODEL.getSigninCDByRoomId(this.mRoomId) || MODEL.getSigninCDByRoomId(this.mRoomId) == 0){
	                _reqUpdate();
	            }else{
	                // 到了CD时间内开启定时请求
	                this.schedule("delay", function(){
	                    _reqUpdate();
	                }, time-MODEL.getSigninCDByRoomId(this.mRoomId), 1);
	            }
	        }

	        GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(this.mRoomId, MODEL.getMatchInstIdByRoomId(this.mRoomId));
		},

		onCleanup:function(){
        	this.unschedule("match_update");
        	this.unschedule("delay");
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		onEase:function(){
			this._super();
		},

		/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            var rect  = this._bgNode.getBoundingBox();
            if (!cc.rectContainsPoint(rect, point)) {
                this.touchDownOutSide = true; // 在窗口外点击
            }
            return true;
        },

		onTouchEnded:function(_touch,_event){
			this._super();
			
			var touch = _touch;
			//获取GL坐标
			var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
			var rect  = this._bgNode.getBoundingBox();
			if (!cc.rectContainsPoint(rect, point) && this.touchDownOutSide) {
                this.touchDownOutSide = false;
				this.windowClose();
			}
		},

		/**
	     * 概括&奖励&规则 标签按钮
	     */
	    onClickTab_1:function(){
	    	this.tabSpr01Group.setVisible(1);
            this.tabSpr02Group.setVisible(0);
            this.tabSpr03Group.setVisible(0);
	        this.mTabNodeGroup.setVisible(0);
	    },

	    onClickTab_2:function(){
	    	this.tabSpr01Group.setVisible(0);
            this.tabSpr02Group.setVisible(1);
            this.tabSpr03Group.setVisible(0);
	        this.mTabNodeGroup.setVisible(1);
	    },

	    onClickTab_3:function(){
	    	this.tabSpr01Group.setVisible(0);
            this.tabSpr02Group.setVisible(0);
            this.tabSpr03Group.setVisible(1);
	        this.mTabNodeGroup.setVisible(2);
	    },

	    onClose:function(){
	    	this.windowClose();
	    },

	    onSignin:function(){
	    	if (this.mRoomId != -1){
	    		GLOBAL_OBJ.businesses.network.C2S.requestMatchSignin(this.mRoomId);
	    		GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(this.mRoomId, MODEL.getMatchInstIdByRoomId(this.mRoomId));
	    	}
	    },

	    onSignout:function(){
	    	if (this.mRoomId != -1){
	    		GLOBAL_OBJ.businesses.network.C2S.requestMatchSignout(this.mRoomId, MODEL.getMatchInstIdByRoomId(this.mRoomId));
	    		GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(this.mRoomId, MODEL.getMatchInstIdByRoomId(this.mRoomId));
	    	}
	    },
		
		// 内部函数
		createRewardList:function(){
			var that = this;

			var size      = this.rewardViewNode.getContentSize();
            var tableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :cc.size(size.width,size.height),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                priority   :0,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   :cc.size(size.width, 55),
                controller :GLOBAL_OBJ.businesses.scenes.MatchListCenter.InfoRewardListCell,
                container  :this.rewardViewNode,
                roomId     :that.mRoomId
            });
            this.rewardViewNode.addChild(tableview);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_REWARD_LIST,function(){
				tableview.reloadData(MODEL.getRewardListCountByRoomId(that.mRoomId));
			},this);

			if (MODEL.getRewardListCountByRoomId(this.mRoomId) > 0){
				tableview.reloadData(MODEL.getRewardListCountByRoomId(this.mRoomId));
			}else{
				GLOBAL_OBJ.businesses.network.C2S.requestMatchRewardList(this.mRoomId);
			}
		},

		createHelpList:function(){
			var that = this;
			var matchType = MODEL.getMatchTypeByRoomId(this.mRoomId);
			var help = {list:[]};

			var size      = this.helpViewNode.getContentSize();
            var tableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :cc.size(size.width,size.height),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                priority   :0,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                // cellSize   :cc.size(size.width, 55),
                controller :GLOBAL_OBJ.businesses.scenes.MatchListCenter.HelpListCell,
                container  :this.helpViewNode,
                help       :help
            });
            this.helpViewNode.addChild(tableview);
           	
           	switch(matchType){
           		case STATIC.MATCHTYPE.OLD:
           			help.list = STATIC.HELP.old;
           			tableview.reloadData(STATIC.HELP.old.length);
           			break;
           		case STATIC.MATCHTYPE.MTT:
           			help.list = STATIC.HELP.mtt;
           			tableview.reloadData(STATIC.HELP.mtt.length);
           			break;
           		default:
           			break;
           	}
		}
	});
})();