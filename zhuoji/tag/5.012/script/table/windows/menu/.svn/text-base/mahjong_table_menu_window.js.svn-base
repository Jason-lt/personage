/*************************************************************
 *  mahjong_table_menu_window.js
    mahjong_table_menu_window
 *  mahjong
 	麻将牌 菜单
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ 					= guiyang;
	var C2S 						= GLOBAL_OBJ.table.network.C2S;
	var AUDIO 						= GLOBAL_OBJ.bkernel.utils.Audio;
	var MODEL_TABLEINFO 			= GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_LEAVE 				= GLOBAL_OBJ.table.models.Leave;
	var MODEL_TASK_LOOPACVIVETASK 	= GLOBAL_OBJ.table.models.loopacvivetask;
	var GLOBAL_T                    = GLOBAL_OBJ.table.global;

	GLOBAL_OBJ.table.windows.Menu.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Menu.Window",
		ctor: function(_params) {
			this._super();
			this.params  			= _params;
			this.visible 			= false;
			this.menuState 			= "waitting";//牌桌等待状态为waitting， 牌桌开始状态为table_begin
			this.isHost	   			= null; //是否是房主
			this.menu_details_state = false;//默认详情不可见
			this.menu_ishu			= false;//是否胡过了
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			var that = this;

			this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;

			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.bkernel.Events.TICK, function(_params){
				var date = new Date( _params.time*1000 );
                that.timeLabel.setString( date.toLocaleTimeString() );
                var month = date.getMonth() + 1;
                that.dateLabel.setString(date.getFullYear()+"-"+month+"-"+date.getDate());
            }, this);
			// this.btnQuit.setEnabled(this.isCreate);
		},

		onCleanup:function() {
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

        setDetailState:function (val) {
            this.menu_details_state = val;
        },
		
		showOpenAni:function () {
			this.visible = true;
			if(this.menu_details_state){
				this.playAnim("openMenuAction4");//金币场结束后的菜单，比平时多一个详情按钮
			}else{
				this.playAnim("openMenuAction");
			}
		},
		showCloseAni:function () {
			this.visible = false;
			if(this.menu_details_state){
				this.playAnim("closeMenuAction4");//金币场结束后的菜单，比平时多一个详情按钮
			}else{
				this.playAnim("closeMenuAction");
			}
		},

				/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            var rect  = this._bgNode.getBoundingBox();
        
            if(!cc.rectContainsPoint(rect, point) && true == this.visible) {
				this.showCloseAni();
            }
            return false;
        },

		setMenuHuState:function (_ishu) {
			this.menu_ishu = _ishu;
		},

		onBlock:function () {

		},

		onClickMore:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			this.menu_details_spr.setVisible(false);
			this.table_open_btn.setScale(1.0);
			this.showOpenAni();
		},

		onClickCloseMenue:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			var curSceen = cc.Director.getInstance().getRunningScene();
			GLOBAL_OBJ.bkernel.windows.Factory.produce(
				GLOBAL_OBJ.businesses.windows.consts.GDMJ_INTRODUCTION_WND,
				{playMode:MODEL_TABLEINFO.getPlayMode(), ruleIndex:"base_sometype"}, curSceen
			);
			//this.showCloseAni();
		},

		onClickSetting:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			this.showCloseAni();
			this.params.onClickSetting();
		},

		onClickChatting:function(){
			this.showCloseAni();
			this.params.onClickChat();
		},

		onClickShare:function(){
			this.showCloseAni();
			this.params.onClickShare();
		},

		onClickQuit:function(){
			var playmode = MODEL_TABLEINFO.getPlayMode();
			var that = this;
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);

			var reason = MODEL_LEAVE.getMineLeaveReson();
			this.showCloseAni();
			if (this.isCreate){

				if(reason != null){//说明已经离开服务器了
					// 返回二级子大厅
					// GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(playmode);
					// 返回金币场房间列表
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, playmode);
					return;
				}

				if(this.isHost){//是房主
					if(this.menuState == "waitting"){//等待状态
						this.onKillRoomByMenu();
					}else if(this.menuState == "table_begin" || this.menuState == "table_end"){//牌桌已经开始状态
						C2S.requestVoteQuit(
							MODEL_TABLEINFO.getRoomId(),
							MODEL_TABLEINFO.getTableId(),
							MODEL_TABLEINFO.getActiveServerSeatId());
					}
				}else{//不是房主
					if(this.menuState == "waitting"){//等待状态
						this.onQuitRoomByMenu();
					}else if(this.menuState == "table_begin" || this.menuState == "table_end"){//牌桌已经开始状态
						C2S.requestVoteQuit(
							MODEL_TABLEINFO.getRoomId(),
							MODEL_TABLEINFO.getTableId(),
							MODEL_TABLEINFO.getActiveServerSeatId());
					}
				}
			}
			else{
				if(this.menuState == "waitting"){//等待状态
					//退出金币场
					GLOBAL_OBJ.table.network.C2S.requestTableLeave(
						MODEL_TABLEINFO.getRoomId(),
						MODEL_TABLEINFO.getTableId(),
						MODEL_TABLEINFO.getActiveServerSeatId()
					);
				}else if(this.menuState == "table_begin"){//牌桌已经开始状态
					var func_leave = function () {
						var cmds = {
							"cmd":"majiang_todotasks",
							"result":{
								"userId": hall.AccountInfo.UserID,
								"gameId": GLOBAL_OBJ.GAMEID,
								"tasks":[
									{
										"action":"pop_general_box",
										"params":{
											"content":"游戏已经开始，请先打完本局再退出",
											"buttons":[
												{
													"content":"确定",
													"tasks":[]
												}
											]
										}
									}
								]
							}
						};
						ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
					}

                    func_leave();

				}else if(this.menuState == "table_end"){//牌桌已经结束
					var callback = function () {
						var miaoshu;
						var loopTimes = MODEL_TASK_LOOPACVIVETASK.getLoopAcviveRoundCount();
						if(loopTimes == 0){
							// //没有配循环局数任务则直接退出金币场
							// GLOBAL_OBJ.table.network.C2S.requestTableLeave(
							// 	MODEL_TABLEINFO.getRoomId(),
							// 	MODEL_TABLEINFO.getTableId(),
							// 	MODEL_TABLEINFO.getActiveServerSeatId()
							// );
							var miaoshu = "是否离开牌局";
							that.params.onClickLeave(miaoshu, 2);
						}else {
							var playTimes = MODEL_TASK_LOOPACVIVETASK.getLoopAcvivePlayTimes();
							var award	  = MODEL_TASK_LOOPACVIVETASK.getLoopAcviveAward();
							var chaTime   = loopTimes - playTimes;
							if(chaTime == 0){
								miaoshu = "您已经玩了0局，再玩" + loopTimes + "局即可获得" + award + "奖励";
							}else{
								miaoshu = "您已经玩了" + playTimes + "局，再玩" + chaTime + "局即可获得" + award + "奖励";
							}
							that.params.onClickLeave(miaoshu, 1 );
						}
					}
					callback();
				}
			}
		},

		onClickDetails:function () {
			GLOBAL_OBJ.LOGD(this._TAG,"onClickDetails");
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			this.showCloseAni();
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_MENU_DETAILS, {});
		},

		setMenuState:function ( _state, _host ) {
			this.menuState 	= _state;
			this.isHost 	= _host || this.isHost;
		},

		getMenuState:function () {
			return this.menuState;
		},

		setDetailSprVisible:function ( _seenState ) {
			var isshow = GLOBAL_OBJ.GlobalVars.getIsShowedTips();
			if(!isshow){
				this.menu_details_spr.setVisible(_seenState);
				GLOBAL_OBJ.GlobalVars.setIsShowedTips(_seenState);
			}
		},

		/*
		 房主的申请关闭房间按钮*/
		onKillRoomByMenu:function(){
			if (MODEL_TABLEINFO.getCustomTablePlayTimes() == 0){ // 第一局
				// 如果不是房主，直接退出，是房主，弹出提示框进行二次确认
				var cmds = {
					"cmd":"majiang_todotasks",
					"result":{
						"userId": hall.AccountInfo.UserID,
						"gameId": GLOBAL_OBJ.GAMEID,
						"tasks":[
							{
								"action":"pop_general_box",
								"params":{
									"content":"开局前退出将关闭房间，不消耗房卡",
									"buttons":[
										{
											"content":"取消",
											"tasks":[]
										},
										{
											"content":"确定",
											"tasks":[
												{
													"action":"send_msg",
													"params":{
														"msg":{
															"cmd":"table_call",
															"params":{
																"action":"create_table_user_leave",
																"roomId":MODEL_TABLEINFO.getRoomId(),
																"tableId":MODEL_TABLEINFO.getTableId(),
																"seatId":MODEL_TABLEINFO.getActiveServerSeatId()
															}
														}
													}
												}
											]
										}
									]
								}
							}
						]
					}
				};
				ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
			}else{ // 非第一局返回需要投票
				C2S.requestVoteQuit(
					MODEL_TABLEINFO.getRoomId(),
					MODEL_TABLEINFO.getTableId(),
					MODEL_TABLEINFO.getActiveServerSeatId());
			}
		},

		/*
		 非房主的申请退出按钮*/
		onQuitRoomByMenu:function(){

			GLOBAL_OBJ.LOGD(this._TAG,"onQuitRoom : create");
			if (MODEL_TABLEINFO.getCustomTablePlayTimes() == 0){ // 第一局
				GLOBAL_OBJ.LOGD(this._TAG,"onQuitRoom : create -> 第一局");

				var cmds = {
					"cmd":"majiang_todotasks",
					"result":{
						"userId": hall.AccountInfo.UserID,
						"gameId": GLOBAL_OBJ.GAMEID,
						"tasks":[
							{
								"action":"pop_general_box",
								"params":{
									"content":"您确定要退出房间吗？",
									"buttons":[
										{
											"content":"取消",
											"tasks":[]
										},
										{
											"content":"确定",
											"tasks":[
												{
													"action":"send_msg",
													"params":{
														"msg":{
															"cmd":"table_call",
															"params":{
																"action":"create_table_user_leave",
																"roomId":MODEL_TABLEINFO.getRoomId(),
																"tableId":MODEL_TABLEINFO.getTableId(),
																"seatId":MODEL_TABLEINFO.getActiveServerSeatId()
															}
														}
													}
												}
											]
										}
									]
								}
							}
						]
					}
				};
				ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);

			}else{ // 非第一局返回需要投票
				GLOBAL_OBJ.LOGD(this._TAG,"onQuitRoom : create -> 非第一局");
				C2S.requestVoteQuit(
					MODEL_TABLEINFO.getRoomId(),
					MODEL_TABLEINFO.getTableId(),
					MODEL_TABLEINFO.getActiveServerSeatId());
			}
		}

	});

})();

