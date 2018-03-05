/**
 * mahj_match_details_controller.js
 * 比赛报名面板
 * Created by xujing on 17-11-11
 */
(function(){

	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.scenes.Match.MatchDetailsController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG :'businesses.scenes.Match.MatchDetailsController',

		ctor:function (parentNode) {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in ctor new");

			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_DETAILS_CCBI);
			this._matchType = GLOBAL_OBJ.MatchType.quick_upgrade_match;

			parentNode.addChild(this.rootNode);
			this.rootNode.setVisible(false);
		},

		isTimeMatch:function () {
			return this._matchType == GLOBAL_OBJ.MatchType.stage_match;
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," _load");

			/* 奖励详情: ListView的初始化*/
			var rwdSize = this['nodePanel1'].getContentSize();
			this._awardListController = new GLOBAL_OBJ.VBox(rwdSize, 10);
			this._awardListController.setPosition(0,0);
			this['nodePanel1'].addChild(this._awardListController);

			/* 报名费用选择框的初始化 */
			this._registerFeeSelectFrameController = new GLOBAL_OBJ.businesses.base.FeeSelect();
			this["registration_fee_select_pos"].addChild(this._registerFeeSelectFrameController.rootNode);

			var viewSize = this['nodeZhanji'].getContentSize();
			this._recordList = new GLOBAL_OBJ.VBox(viewSize, 10);
			this._recordList.setPosition(0,0);

			this._countDownPanel = new GLOBAL_OBJ.businesses.scenes.Match.SignCountDownPanel();
			this['nodeCountDown'].addChild(this._countDownPanel.getRootNode());
			this._countDownPanel.getRootNode().setPosition(127, 86);

			this['nodeZhanji'].addChild(this._recordList);
		},

		_resetDate:function () {
			// 开赛时间
			this["label_begin_time"].setString("加载中...");
			// 报名条件
			this["label_condition"].setString("加载中...");
			this._registerFeeSelectFrameController.rootNode.setVisible(false);

			this._recordList.removeAllItem();
			this['txtAllCount'].setString('0');
			this['txtTopCount'].setString('0');
			this['txtBest'].setString('--');
			this['txtDesc'].setString('没战绩好心塞，快去参赛吧！');

			this._awardListController.removeAllItem();

			if (this.isTimeMatch()){
				//请求定时赛房间数据
				GLOBAL_OBJ.businesses.network.C2S.requestTimeMatchDes(this._roomInfo.roomId);
			}
			else{
				//请求比赛房间数据
				GLOBAL_OBJ.businesses.network.C2S.requestMatchDes(this._roomInfo.roomId, this._roomInfo.matchId);
			}
		},

		onTabTouch:function () {
			this.tabTouch(0);
		},
		onTabTouch1:function () {
			this.tabTouch(1);
		},
		onTabTouch2:function () {
			this.tabTouch(2);
		},

		tabTouch:function (tabIndex) {
			var showTag = tabIndex;

			var isShow = false;
			var txtColor;
			for (var i = 0; i < 3; i++){
				isShow = i == showTag;
				txtColor = isShow ? hall.GlobalFuncs.hexToColor(0xfefdeb) : hall.GlobalFuncs.hexToColor(0xbe8457);

				this['tabBg' + i].setVisible(isShow);
				this['nodePanel' + i].setVisible(isShow);
				this['txtTab' + i].setColor(txtColor);
			}
		},

		/**
		 * 是否已经开始倒计时（只有定时赛会出现这种情况）
		 * @returns {boolean}
		 */
		isStartCountDown:function () {
			//单位：秒
			var is = this._getLeftTime() <= GLOBAL_OBJ.MatchStartCountDownTime;
			return this.isTimeMatch() && is && GLOBAL_OBJ.businesses.scenes.Match.Model.checkIsSign(this._roomInfo.roomId);
		},

		onSignOut2:function () {
			this.onSignOut();
		},

		onSignOut:function () {
			//定时赛退赛
			var that = this;
			this._showAlert("确定要退出比赛吗？", function () {
				// var cmds = {
				// 	"cmd":"match",
				// 	"result":{
				// 		"gameId":701,
				// 		"action":"signout",
				// 		"roomId":7012301000,
				// 		"ec" : -1
				// 	}
				// };
                //
				// ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
				GLOBAL_OBJ.businesses.network.C2S.requestTimeMatchSignout(that._roomInfo.roomId);
			});
		},

		_addListener:function () {
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_DESC, this._onUpdateMatchDescription, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_SIGNIN, this._onUpdateMatchSignin, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNIN, this._onTimeMatchSignIn, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNOUT, this._onTimeMatchSignOut, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_CANCEL, this._exit, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_START, this._finishExit, this);
		},
		_removeListener:function () {
			this._resetInfoPanel();
			this._removeMsgListener();
		},

		_removeMsgListener:function () {
			GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_DESC, this._onUpdateMatchDescription, this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_SIGNIN, this._onUpdateMatchSignin, this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNIN, this._onTimeMatchSignIn, this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNOUT, this._onTimeMatchSignOut, this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_CANCEL, this._exit, this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_START, this._finishExit, this);
		},

		onCleanup:function () {
			GLOBAL_OBJ.LOGD(this._TAG," destroy");
			this._removeListener();

			if (this._recordList){
				this._recordList = null;
			}

			this._awardListController = null;

			this._registerFeeSelectFrameController = null;
			this._roomInfo = null;
		},

		_onUpdateMatchSignin:function (signsVal) {
			if (signsVal.matchId == this._roomInfo.matchId && signsVal.roomId == this._roomInfo.roomId && signsVal.signs == 1){
				//报名功能，关闭窗口，等待其它消息
				this._exit();
			}
		},

		_onTimeMatchSignIn:function (val) {
			if (val.roomId != this._roomInfo.roomId) return;

			var rs = this._getLeftTime() <= GLOBAL_OBJ.MatchStartCountDownTime;

			this['nodeCountDown'].setVisible(rs);
			this['nodeSignUpInfo'].setVisible(!rs);

			if (rs){
				//已经小于倒计时时间了，启动倒计时
				this._startCountDown();
			}
			else{
				this._setSignBtns(true);
				//准备倒计时
				this._prepareCountDown();
			}
		},

		_startCountDown:function () {
			this['nodeCountDown'].setVisible(true);
			this['nodeSignUpInfo'].setVisible(false);
			//启动Tick
			this._countDownPanel.setCountdownTime(this._getLeftTime());
			//已经开始倒计时,发送enter消息，通知后端，我在等待
			GLOBAL_OBJ.businesses.network.C2S.requestMatchEnter(this._roomInfo.roomId);
		},

		_resetInfoPanel:function () {
			this['nodeCountDown'].setVisible(false);
			this['nodeSignUpInfo'].setVisible(true);
			this._setSignBtns(false);
			this._countDownPanel.unCountDown();
			this.rootNode.unscheduleAllCallbacks();
			this.matchDes = null;
		},

		_onTimeMatchSignOut:function (val) {
			if (val.roomId != this._roomInfo.roomId) return;

			this._resetInfoPanel();
			this._exit();
		},

		/**
		 * 准备倒计时
		 * @private
		 */
		_prepareCountDown:function () {
			var leftTime = this._getLeftTime() - GLOBAL_OBJ.MatchStartCountDownTime;
			GLOBAL_OBJ.LOGD(this._TAG, "准备倒计时 ,还要 ：" + leftTime);
			var that = this;
			this._countDownPanel.rootNode.scheduleOnce(function () {
				that._startCountDown();
			},leftTime);
		},

		enterWithInfo:function (roomInfo) {
			GLOBAL_OBJ.LOGD(this._TAG, "enterWithInfo ,enterWithInfo ：" + JSON.stringify(roomInfo));
			this._roomInfo = roomInfo; // 房间信息（每个比赛是一个房间）
			this._matchType = this._roomInfo.type;
			//标题
			this['label_title'].setString(this._roomInfo.name);
			this._addListener();
			this._resetDate();

			this._enter();
		},

		/**
		 * 获取当前剩余时间
		 * @returns {number}
		 * @private
		 */
		_getLeftTime:function () {
			var curTime = GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime();
			return this._roomInfo.startTime - curTime;
		},
		
		_setSignBtns:function (val) {
			this['btn_signout'].setVisible(val);
			this['btn_register_signup'].setVisible(!val);
		},

		// 进入动画
		_enter:function () {
			this.rootNode.setVisible(true);
			this.rootNode.animationManager.runAnimationsForSequenceNamedTweenDuration('in', 0);

			var isShowCountDown = false;
			if (this.isTimeMatch()){

				if (GLOBAL_OBJ.businesses.scenes.Match.Model.checkIsSign(this._roomInfo.roomId)){
					isShowCountDown = this.isStartCountDown();
					if (isShowCountDown){
						this._startCountDown();
					}
					else {
						this._prepareCountDown();
						this._setSignBtns(true);
					}
				}
				else{
					isShowCountDown = false;
					this._setSignBtns(false);
				}
			}
			else
			{
				isShowCountDown = false;
				this._setSignBtns(false);
			}

			this['nodeCountDown'].setVisible(isShowCountDown);
			this['nodeSignUpInfo'].setVisible(!isShowCountDown);

			this.tabTouch(0);
		},

		_finishEnter:function () {

			// var cmds = {
			// 	"cmd":"match",
			// 	"result":{
			// 		"gameId":701,
			// 		"name":"血流成河iPhoneX争霸赛",
			// 		"ranks":[
			// 			{
			// 				"start":1,
			// 				"end":1,
			// 				"desc":"1元微信红包"
			// 			},
			// 			{
			// 				"start":2,
			// 				"end":2,
			// 				"desc":"1万金币"
			// 			},
			// 			{
			// 				"start":3,
			// 				"end":3,
			// 				"desc":"6000金币"
			// 			},
			// 			{
			// 				"start":4,
			// 				"end":4,
			// 				"desc":"5000金币"
			// 			},
			// 			{
			// 				"start":5,
			// 				"end":8,
			// 				"desc":"4000金币"
			// 			},
			// 			{
			// 				"start":9,
			// 				"end":16,
			// 				"desc":"2600金币"
			// 			},
			// 			{
			// 				"start":17,
			// 				"end":32,
			// 				"desc":"1800金币"
			// 			}
			// 		],
			// 		"type":"stage_match",
			// 		"matchId":7012301000,
			// 		"userId":11248,
			// 		"histories":{
			// 			"bestRank":1,
			// 			"records":[
			// 				{
			// 					"desc":"1元微信红包",
			// 					"time":1510987698
			// 				},
			// 				{
			// 					"time":1510997062,
			// 					"desc":"1元微信红包"
			// 				},
			// 				{
			// 					"time":1511333924,
			// 					"desc":"1元微信红包"
			// 				},
			// 				{
			// 					"desc":"1800金币",
			// 					"time":1511403731
			// 				},
			// 				{
			// 					"time":1511404728,
			// 					"desc":"1元微信红包"
			// 				}
			// 			],
			// 			"playCount":50,
			// 			"crownCount":9
			// 		},
			// 		"matchIntroduce":"本比赛采用。。。。",
			// 		"timeRange":"20分钟",
			// 		"fees":[
			// 			"12万金币",
			// 			"60钻石",
			// 			"3枚幸运戒指"
			// 		],
			// 		"action":"des",
			// 		"stages":[
			// 			{
			// 				"index":1,
			// 				"totalUserCount":128,
			// 				"name":"128进64",
			// 				"riseUserCount":64
			// 			},
			// 			{
			// 				"index":2,
			// 				"totalUserCount":64,
			// 				"name":"64进32",
			// 				"riseUserCount":32
			// 			},
			// 			{
			// 				"index":3,
			// 				"totalUserCount":32,
			// 				"name":"32进16",
			// 				"riseUserCount":16
			// 			},
			// 			{
			// 				"index":4,
			// 				"totalUserCount":16,
			// 				"name":"16进8",
			// 				"riseUserCount":8
			// 			},
			// 			{
			// 				"index":5,
			// 				"totalUserCount":8,
			// 				"name":"8进4",
			// 				"riseUserCount":4
			// 			},
			// 			{
			// 				"index":6,
			// 				"totalUserCount":4,
			// 				"name":"决赛",
			// 				"riseUserCount":1
			// 			}
			// 		],
			// 		"roomId":7012301000,
			// 		"condition":128,
			// 		"desc":"满128人开赛 报名费：12万金币或60钻石或3枚幸运戒指"
			// 	}
			// };
            //
			// ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);

			this._initRecord();
		},

		/**
		 * 弹出二次确认框
		 * @param txtContent 要显示内容
		 * @param msgPar 发送消息的参数
		 * @private
		 */
		_showAlert:function (txtContent, msgPar) {
			var curRoomInfo = GLOBAL_OBJ.businesses.scenes.Match.Model.getCurRoomInfo();
			var cmds = {
				"cmd":"majiang_todotasks",
				"result":{
					"userId": hall.AccountInfo.UserID,
					"gameId": GLOBAL_OBJ.GAMEID,
					"tasks":[
						{
							"action":"pop_general_box",
							"params":{
								"content" : txtContent,
								"buttons":[
									{
										"content":"确定",
										"tasks":[],
										"callBackFun" : msgPar
									},
									{
										"content":"取消",
										"tasks":[]
									}
								]
							}
						}
					]
				}
			};
			ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
		},

		// 退出动画
		_exit:function () {
			if (this._isExiting){
				return;
			}
			this._isExiting = true;
			this.rootNode.animationManager.runAnimationsForSequenceNamedTweenDuration('out', 0);
		},

		_finishExit:function () {
			this._isExiting = false;
			this.rootNode.setVisible(false);
			this._removeListener();
		},

		// 报名按钮回调
		onSignup:function () {
			hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);

			// TODO 报名逻辑
			var feeIndex = this._registerFeeSelectFrameController.getSelectedFeeIndex();

			if (this.isTimeMatch()){
				GLOBAL_OBJ.businesses.network.C2S.requestTimeMatchSignin(this._roomInfo.roomId, feeIndex);
				// var cmds = {
				// 	"cmd": "match",
				// 	"result": {
				// 		"action": "wait",
				// 		"gameId": 701,
				// 		"roomId": 701230,
				// 		"tableId": 70123010000000,
				// 		"riseWait": 3,
				// 		"mname": "血流成河iPhoneX争霸赛",
				// 		"steps": [
				// 			{
				// 				"des": "810人晋级",
				// 				"isCurrent": 1,
				// 				"name": "海选赛"
				// 			},
				// 			{
				// 				"des": "192人晋级",
				// 				"name": "晋级赛"
				// 			},
				// 			{
				// 				"des": "64强",
                //
				// 				"name": "64强赛"
				// 			},
				// 			{
				// 				"des": "32强",
				// 				"name": "32强赛"
				// 			},
				// 			{
				// 				"des": "16强",
				// 				"name": "16强赛"
				// 			},
				// 			{
				// 				"des": "8强",
				// 				"name": "8强赛"
				// 			},
				// 			{
				// 				"des": "决赛",
				// 				"name": "决赛"
				// 			}
				// 		]
				// 	}
				// };

				// var cmds = {
				// 	"cmd":"match",
				// 	"result":{
				// 		"gameId":701,
				// 		"action":"signout",
				// 		"roomId":7012301000
				// 	}
				// };

				// ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
			}
			else{
				GLOBAL_OBJ.businesses.network.C2S.requestMatchSignin(this._roomInfo.roomId, feeIndex, this._roomInfo.matchId);
			}


			//以下是测试用代码
			// var cmds = {
			// 	"cmd":"room",
			// 	"result":{
			// 		"info":"比赛：血流成河1元红包赛名次：第64名胜败乃兵家常事 大侠请重新来过！",
			// 		"gameId":701,
			// 		"mcount":128,
			// 		"rewardDesc":"胜败乃兵家常事 大侠请重新来过！",
			// 		"reward":[  //结算奖励，支持多个
			// 			// {"name":"金币", "count":1000, "icon":"user:chip", "iconPath":"http://ddz.image.tuyoo.com/avatar/head_male_2.png"},
			// 			// {"name":"金币", "count":10000, "icon":"user:chip", "iconPath":"http://ddz.image.tuyoo.com/avatar/head_male_2.png"},
			// 			// {"name":"金币", "count":55000, "icon":"user:chip", "iconPath":"http://ddz.image.tuyoo.com/avatar/head_male_2.png"}
			// 		],
			// 		"mname":"血流成河1元红包赛",
			// 		"matchId":701221,
			// 		"userId":11248,
			// 		"rank":64,
			// 		"date":"2017-11-14",
			// 		"reason":0,
			// 		"time":"11:40",
			// 		"action":"over",
			// 		"roomId":7012201000
			// 	}
			// };
            //

			// var cmds = {
			//     "cmd":"room",
			//     "result":{
			//         "gameId":701,
			//         "isLevelUp":true,
			//         "stageIndex":2,
			//         "matchId":701221,
			//         "userId":11248,
			//         "rank":85,
			//         "rankName":"86/128",
			//         "action":"wait",
			//         "roomId":7012201000,
			//         "cardCount": 1,  //比赛要打几副牌
			//         "tableRank": 1   //如果晋级了，在本桌上的名次
			//     }
			// };
            //
			// ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);

		},

		// 关闭按钮
		onClosed:function () {
			hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
			if (this.isStartCountDown()){
				//已经开始倒计时的，要弹出二级确认
				var that = this;
				this._showAlert("关闭此窗口，会导致你无法进入比赛，确定关闭吗？", function () {
					GLOBAL_OBJ.businesses.network.C2S.requestMatchLeave(that._roomInfo.roomId);
					that._exit();
				});
			}
			else{
				this._exit();
			}
		},

		onClose2:function () {
			this.onClosed();
		},

		_onUpdateMatchDescription:function (matchDes) {

			GLOBAL_OBJ.LOGD(this._TAG,"Run onMatchDescription-----------------");
			this.matchDes = matchDes;


			// 开赛条件
			var condition = "";
			if (this.matchDes.type != GLOBAL_OBJ.MatchType.stage_match){
				condition = "满"+ this.matchDes.condition +"人";
			}else{
				condition = this.matchDes.condition;
			}

			this["label_begin_time"].setString(condition);
			// 报名条件
			this["label_condition"].setString("无");

			this._registerFeeSelectFrameController.rootNode.setVisible(true);
			//载入报名付费列表
			var feeInfo = [];
			var i;
			for (i = 0; i < this.matchDes.fees.length; i++){
				feeInfo.push({desc:this.matchDes.fees[i], selected:false});
			}

			// var feeInfo = [
			// 	{desc:"1000金币", img:"http", selected:false},
			// 	{desc:"1张参赛券", img:"", selected:false},
			// 	{desc:"1张报名券", img:"", selected:false}
			// ];

			this._registerFeeSelectFrameController.refreshFeesList(feeInfo);
		},

		/**
		 * 初始化战绩
		 * @private
		 */
		_initRecord:function () {

			this._recordList.removeAllItem();

			if (!this.matchDes) return;

			// this.matchDes.histories.playCount = 5;

			this['txtTopCount'].setString(this.matchDes.histories.crownCount + "");
			this['txtAllCount'].setString(this.matchDes.histories.playCount + "");

			var desc = "没战绩好心塞，快去参赛吧！";
			var i;
			if (this.matchDes.histories.playCount > 0){
				desc = "只保留最近的10条比赛战绩";

				var recordDataList = this.matchDes.histories.records;
				// var recordDataList = [
				// 	{"time":1462503538,"desc":"第1名,获得5000金币"},
				// 	{"time":1462503538,"desc":"第2名,获得5000金币"},
				// 	{"time":1462503538,"desc":"第3名,获得5000金币"},
				// 	{"time":1462503538,"desc":"第4名,获得5000金币"},
				// 	{"time":1462503538,"desc":"第5名,获得5000金币"}
				// ];

				recordDataList.sort(function (a,b) {
					return a.time < b.time;
				});

				var item;
				for (i = 0 ; i < recordDataList.length; i++){
					item = new GLOBAL_OBJ.businesses.scenes.Match.RecordItem();
					item.setData(recordDataList[i]);
					this._recordList.addItem(item);
				}
			}
			this['txtDesc'].setString(desc);

			this._awardListController.removeAllItem();
			var rankList = this.matchDes.ranks;

			rankList.unshift({'desc' : this.matchDes.desc});

			if (rankList.length > 0){
				var awardItem;
				for (i = 0 ; i < rankList.length; i++){
					awardItem = new GLOBAL_OBJ.businesses.scenes.Match.AwardItem();
					awardItem.setData(rankList[i]);
					this._awardListController.addItem(awardItem);
				}
			}

			//设置最佳名次
			var bestRank = "--";
			if (this.matchDes.histories.bestRank > 0){
				bestRank = "第 " + this.matchDes.histories.bestRank + " 名";
			}
			this['txtBest'].setString(bestRank);
		}

	});

})();