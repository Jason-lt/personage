/*************************************************************
 *  mahjong_match_center_list_cell.js
    mahjong_match_center_list_cell
 *  mahjong
 	赛事中心 列表 cell
 *
 *  Created by nick.kai.lee on 16-09-05
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ						 = guiyang;
	var GLOBAL_B 			          	 = GLOBAL_OBJ.businesses.global;
	var GLOBAL_FUNCS					 = GLOBAL_OBJ.businesses.functions;
	var MODEL_LIST                       = GLOBAL_OBJ.businesses.scenes.Match.Models.List;
	var C2S								 = GLOBAL_OBJ.businesses.network.C2S;

	GLOBAL_OBJ.businesses.scenes.Match.Cell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.Match.Cell",
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;//第几页

			this.bgs = [
				GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_DZGB_PNG,
				GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_JDSC_PNG,
				GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_HEB_PNG,
				GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_XZDD_PNG,
				GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_XLCH_PNG,
				GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_ERMJ_PNG
			];

			this.init(GLOBAL_OBJ.RES.MATCHCENTERLISTCELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			var that     = this;

			/*
	        time tick*/
	        GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.bkernel.Events.TICK, function(_params){
	        	var time     = _params.time;
	        	var begin    = MODEL_LIST.getMatchBeginTimestamp( that.config.data.type, that.index );
	        	var interval = (begin - time)<0 ? 0 : begin - time;

	        	if (interval >= 3600){ // 1小时以外显示周几(当天就显示“今天”,明天显示"明天")，1小时以内倒计时
	        		that.descLabel2.setString( GLOBAL_FUNCS.getDayForTimeStamp(begin) );
					that.beginTimeLabel.setString( GLOBAL_FUNCS.formatTimeForTimeStamp("h:m", begin) );
					that.descLabel2.setColor( cc.color(98, 51, 22) );
					that.beginTimeLabel.setColor( cc.color(98, 51, 22) );
				}else{
					that.descLabel2.setString( "即将开始" );
					that.beginTimeLabel.setString( GLOBAL_FUNCS.formatTimeString("m:s", interval) );	
					that.descLabel2.setColor( cc.color(0, 153, 11) );
					that.beginTimeLabel.setColor( cc.color(0, 153, 11) );
				}
				that.infoNode.setVisible(true);

				//在viewnode内的格子才间隔请求在线人数
				var parent = that.view.ccbRootNode.getParent();
				if (parent) {
					C2S.requestMatchCenterUpdate(MODEL_LIST.getMatchRoomId( that.config.data.type, that.index ),
	                	MODEL_LIST.getMatchInstance( that.config.data.type, that.index ));
				}
	        }, this);
			
			/*
			刷新在线人数*/
	        GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_CENTER_ONLINES_INFO, function(_params){
	        	//在线人数
				this.onlineLabel.setString( MODEL_LIST.getMatchOnlines( that.config.data.type, that.index) );
	        }, this);
			
	        //按钮组
	        this.btnGroup   = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true], 
	        	[this.operationNode1, this.operationNode2, this.operationNode3, this.operationNode4]);

			/*
			@bind_block_scrolling_touch扩展，可以扩展一个适用于tableview的按钮扩展，该api返回touch管理者，提供默认的几个api
			详情参考源码
			该模块将edgeNode设置的和touchNode一致，就是一个普通按钮，仅仅是滑动时不支持touch响应而已
			外部使用getTouchManager暴露出去的touch管理者，重新设置edgeNode，以便支持tableview边界时屏蔽touch
			*/
			this.manager = GLOBAL_OBJ.bkernel.extend.Touch.bind_block_scrolling_touch( this.bgNode, this.bgNode, false,
					function(listener, touch, event){ /*touch began*/ return true; }, 
					function(){ /*touch moved*/ }, 
					function(listener, touch, event){
						//touch ended
						that.config.data.onDetail( that.config.data.type, that.index);
					}, function(){ /*touch canceled*/ return false; } );

		},

		onCleanup:function() {
			this._super();
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

		/*
		界面刷新 */
		update:function(_index, _config){
			this.index    = _index;
			this.config   = _config;
			var type      = this.config.data.type; 
			var feeType   = MODEL_LIST.getMatchFeeType(type, this.index);
			var matchType = MODEL_LIST.getMatchType(type, this.index);
			//比赛名
			this.nameLabel.setString( MODEL_LIST.getMatchName( type, this.index) );

			//比赛花费 1 金币赛 2 积分赛
			GLOBAL_FUNCS.textureChange( this.feeTypeSpr, 2 == feeType ? GLOBAL_OBJ.RES.EJ_YJS_MARK_JIFEN_PNG : GLOBAL_OBJ.RES.EJ_YJS_MARK_GOLD_PNG );
			
			//在线人数
			this.onlineLabel.setString( MODEL_LIST.getMatchOnlines( type, this.index) );

			var bg = this.bgs[this.index % this.bgs.length];
			GLOBAL_OBJ.LOGI(this._TAG, ">>>>>>>>>>>>>>>>> 当前背景：" + bg)
			GLOBAL_FUNCS.textureChange( this.modeSpr, bg );
			//玩法类型
			// switch( MODEL_LIST.getMatchMode( type, this.index ) ){
			// 	case GLOBAL_B.PLAYMODE.CRAZY:
			// 		GLOBAL_FUNCS.textureChange( this.modeSpr, GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_DZGB_PNG );
			// 		break;
			// 	case GLOBAL_B.PLAYMODE.SICHUAN:
			// 		GLOBAL_FUNCS.textureChange( this.modeSpr, GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_JDSC_PNG );
			// 		break;
			// 	case GLOBAL_B.PLAYMODE.HARBIN:
			// 		GLOBAL_FUNCS.textureChange( this.modeSpr, GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_HEB_PNG );
			// 		break;
			// 	case GLOBAL_B.PLAYMODE.XZ:
			// 		GLOBAL_FUNCS.textureChange( this.modeSpr, GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_XZDD_PNG );
			// 		break;
			// 	case GLOBAL_B.PLAYMODE.XLCH:
			// 		GLOBAL_FUNCS.textureChange( this.modeSpr, GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_XLCH_PNG );
			// 		break;
			// 	case GLOBAL_B.PLAYMODE.DOUBLE:
			// 		GLOBAL_FUNCS.textureChange( this.modeSpr, GLOBAL_OBJ.RES.EJ_YJS_MARK_TYPE_ERMJ_PNG );
			// 		break;
			// 	default:
			// 		break;
			// }



			//操作区域的选择
			//玩法规则 1 麻将老比赛, 2 麻将sng, 3 麻将mtt
			switch( matchType ){
				case 1:
					if (MODEL_LIST.getMatchJointState(type, this.index)) {
						//已经参加 老比赛 显示 “回到比赛”按钮
						this.btnGroup.setVisible(0);
						this.conditionLabel.setString("");
					}else{
						//没有参加 老比赛 显示 “加入比赛”按钮
						this.btnGroup.setVisible(1);
						this.conditionLabel.setString( MODEL_LIST.getMatchJointCondition(type, this.index) );
					}
					break;
				case 2:
					break;
				case 3:
					if (MODEL_LIST.getMatchSignInState(type, this.index)) {
						//已经报名 新比赛 显示 “取消报名”按钮
						this.btnGroup.setVisible(3);
						this.conditionLabel.setString("");
					}else{
						//没有报名 新比赛 显示 “报名”按钮
						this.btnGroup.setVisible(2);
						this.conditionLabel.setString( MODEL_LIST.getMatchSignInCondition(type, this.index) );
					}
					break;
			}
		},

		/* 返回比赛 - 老比赛 1 */
		onBackToCoinGame:function(){

		},

		/* 加入比赛 - 老比赛 1 */
		onJoinInCoinGame:function(){

		},

		/* 报名比赛 - 新比赛 3 */
		onJoinInScoreGame:function(){
			C2S.requestMatchCenterSignIn( MODEL_LIST.getMatchRoomId( this.config.data.type, this.index ) );
		},

		/* 取消报名比赛 - 新比赛 3 */
		onCancelJoinInScoreGame:function(){
			C2S.requestMatchCenterCancelSignedIn( 
				MODEL_LIST.getMatchRoomId( this.config.data.type, this.index ), 
				MODEL_LIST.getMatchInstance( this.config.data.type, this.index ) );
		}

	});
	//end
})();

