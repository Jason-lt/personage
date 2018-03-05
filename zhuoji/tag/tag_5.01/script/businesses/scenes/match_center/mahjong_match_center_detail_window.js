/*************************************************************
 *  mahjong_match_center_detail_window.js
    mahjong_match_center_detail_window
 *  mahjong
 	比赛列表中的比赛详情window
 *
 *  Created by nick.kai.lee on 16-09-09
 *  特殊说明：

    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS 							  = GLOBAL_OBJ.businesses.functions;
	var MODEL_LIST                        		  = GLOBAL_OBJ.businesses.scenes.Match.Models.List;
	var C2S                               		  = GLOBAL_OBJ.businesses.network.C2S;
	GLOBAL_OBJ.businesses.scenes.Match.Detail.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:'GLOBAL_OBJ.businesses.scenes.Match.Detail.Window',

		ctor:function(_params){
			this._super();
			this.params = _params;
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
			var that = this;

			/*
			@标签按钮组*/ 
			GLOBAL_FUNCS.toggleButtonGroup(this.tabBtn_1, this.tabBtn_2, this.tabBtn_3);
			this.tabSpr01Group = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible",
                [false, true],[this.tabBtnSpr_1_1, this.tabBtnSpr_1_2]);
            this.tabSpr02Group = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible",
                [false, true],[this.tabBtnSpr_2_1, this.tabBtnSpr_2_2]);
            this.tabSpr03Group = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible",
                [false, true],[this.tabBtnSpr_3_1, this.tabBtnSpr_3_2]);
			this.mTabNodeGroup = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true], 
				[this.detailNode, this.rewardNode, this.helpNode]);
			//默认打开奖励
			this.tabBtn_1.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_UP_INSIDE);


            /*
            详情列表*/
            //1.概况
            var size       = this.viewNode00.getContentSize();
            var data00     = { data: [
            		{ key: "开赛时间：", value: GLOBAL_FUNCS.formatTimeForTimeStamp("h:m", MODEL_LIST.getMatchBeginTimestamp( this.params.type, this.params.index ) ) },
            		{ key: "比赛时长：", value: GLOBAL_FUNCS.formatTimeString("h:m:s", MODEL_LIST.getMatchTimeSpend( this.params.type, this.params.index ) ) },
            		{ key: "报名人数：", value: MODEL_LIST.getMatchOnlines( this.params.type, this.params.index ) },
            		{ key: "报名费用：", value: MODEL_LIST.getMatchSignInCondition( this.params.type, this.params.index ) }
            	] };
            var tvDetail00 = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :size,
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   :cc.size(610, 50),
                controller :GLOBAL_OBJ.businesses.scenes.Match.Detail.Cell00,
                container  :this.viewNode00,
                data       :data00
            });
            this.viewNode00.addChild(tvDetail00);
            tvDetail00.reloadData(4);
            tvDetail00.setTouchEnabled(false);

            //2.奖励
            var size       = this.viewNode01.getContentSize();
            var data01     = { data: [] };
            var tvDetail01 = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :size,
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   :cc.size(610, 50),
                controller :GLOBAL_OBJ.businesses.scenes.Match.Detail.Cell01,
                container  :this.viewNode01,
                data       :data01
            });
            this.viewNode01.addChild(tvDetail01);
            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_CENTER_REWARDS_INFO, function(_params){
            	data01.data = MODEL_LIST.getMatchRewards( MODEL_LIST.getMatchRoomId( this.params.type, this.params.index ) );
            	tvDetail01.reloadData( data01.data.length );    
            }, this);

            //3.奖励
            var size       = this.viewNode02.getContentSize();
            var data02     = { data: GLOBAL_OBJ.businesses.scenes.Match.static.RULES };
            var tvDetail03 = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :size,
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                cellSize   :cc.size(610, 50),
                controller :GLOBAL_OBJ.businesses.scenes.Match.Detail.Cell02,
                container  :this.viewNode02,
                data       :data02
            });
            this.viewNode02.addChild(tvDetail03);
            tvDetail03.reloadData( data02.data.length );
            
			// // 概况
			// this.startTimeLabel.setString(GLOBAL_FUNCS.formatTimeForTimeStamp("h:m", MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex)));
			// var matchType = MODEL.getMatchTypeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex);
			// switch(matchType){
			// 	case STATIC.MATCHTYPE.OLD:
			// 		this.oldMatchInfoNode.setVisible(true);
			// 		this.endTimeLabel.setString(GLOBAL_FUNCS.formatTimeForTimeStamp("h:m", MODEL.getEndTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex)));
			// 		this.personLimitLabel.setString(MODEL.getPersonLimitByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
			// 		this.matchConditionLabel.setString(MODEL.getConditionByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
			// 		break;
			// 	case STATIC.MATCHTYPE.MTT:
			// 		this.mttMatchInfoNode.setVisible(true);
			// 		this.continueTimeLabel.setString(GLOBAL_FUNCS.formatTimeString("h:m:s", MODEL.getContinueTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex)));
			// 		this.signinCountLabel.setString(MODEL.getPersonByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
			// 		this.signFeesLabel.setString(MODEL.getFeesByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex));
			// 		break;
			// 	default:
			// 		break;
			// }

			// // 奖励&规则
			// this.createRewardList();
			// this.createHelpList();

			// // 刷新人数
			// GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_UPDATE,function(){
			// 	that.signinCountLabel.setString(MODEL.getPersonByTabIndexAndCellIndex(STATIC.index, that.mParams.cellIndex));
			// },this);

			// // 刷新报名状态
			// if (matchType == STATIC.MATCHTYPE.OLD){
			// 	this.btnNode.setVisible(false);
			// }
			// var signGroup = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible", [false,true],[this.signinNode,this.signoutNode]);
			// signGroup.setVisible(MODEL.hasSigninedByRoomId(that.mRoomId)==1?1:0);
			// GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_MATCH_SIGNS,function(){
			// 	signGroup.setVisible(MODEL.hasSigninedByRoomId(that.mRoomId)==1?1:0);
			// }, this);

			// if (MODEL.getMatchTypeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex) == STATIC.MATCHTYPE.MTT){
	  //           // 每固定时间间隔请求一次报名人数
	  //           var _reqUpdate = function(){
	  //               that.unschedule("delay");
	  //               that.schedule("match_update",function(){
	  //               	GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(that.mRoomId, MODEL.getMatchInstIdByRoomId(that.mRoomId));
	  //               },MODEL.getReqUpdateIntervalByRoomId(that.mRoomId));
	  //           };

	  //           var time = MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mParams.cellIndex) - GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime(); // 剩余时间
	  //           if (time <= MODEL.getSigninCDByRoomId(this.mRoomId) || MODEL.getSigninCDByRoomId(this.mRoomId) == 0){
	  //               _reqUpdate();
	  //           }else{
	  //               // 到了CD时间内开启定时请求
	  //               this.schedule("delay", function(){
	  //                   _reqUpdate();
	  //               }, time-MODEL.getSigninCDByRoomId(this.mRoomId), 1);
	  //           }
	  //       }

	  //       GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(this.mRoomId, MODEL.getMatchInstIdByRoomId(this.mRoomId));
		},

		onCleanup:function(){
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		onEase:function(){
			C2S.requestMatchCenterRewardInfo( MODEL_LIST.getMatchRoomId( this.params.type, this.params.index ) );
			this._super();
		},

		/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            // var touch = _touch;
            // var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            // var rect  = this._bgNode.getBoundingBox();
            // if (!cc.rectContainsPoint(rect, point)) {
            //     this.touchDownOutSide = true; // 在窗口外点击
            // }
            return true;
        },

		/**
	     * 概括&奖励&规则 标签按钮*/
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

	    onJoinInScoreGame:function(){
	    	C2S.requestMatchCenterSignIn( 
	    		MODEL_LIST.getMatchRoomId( this.params.type, this.params.index ) );
	    },

	    onCancelJoinInScoreGame:function(){
	    	C2S.requestMatchCenterCancelSignedIn( 
				MODEL_LIST.getMatchRoomId( this.params.type, this.params.index ), 
				MODEL_LIST.getMatchInstance( this.params.type, this.params.index ) );
	    }
	});
})();