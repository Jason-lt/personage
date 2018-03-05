/*************************************************************
 *  mahjong_sichuan_xuezhan_budgets_xzdhlayer.js
 *  mahjong
 	四川麻将-血战玩法结算layer(大胡)
 *
 *  Created by lcr on 17-06-20
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T = GLOBAL_OBJ.table.global;
	var AUDIO = GLOBAL_OBJ.bkernel.utils.Audio;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_FLOW = GLOBAL_OBJ.table.models.Flow;
    var MODEL_USER = GLOBAL_OBJ.businesses.modules.User.Model;
    var C2S = GLOBAL_OBJ.table.network.C2S;
	var MODEL_ROUND_RESULT = GLOBAL_OBJ.table.models.roundresult;
	var MODEL_BUDGETS = GLOBAL_OBJ.table.models.Budget;
	var MODEL_TASK_WINSTREAK = GLOBAL_OBJ.table.models.winstreaktask;
	var MODEL_LEAVE = GLOBAL_OBJ.table.models.Leave;

	GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.XZDHLayer = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.SiChuan.XueZhan.Budgets.XZDHLayer",
		ctor: function(_params) {
			this._super();
			this.params 		= _params;
			this.data 			= { data:{} };//本家流水具体数据初始化
			this.dataxl			= { data:{} };//大胡和牌数据
			this.patternNTV 	= null;
			this.patternNTV1 	= null;
			this.dahuLiushuiNode= null;
            this.sharePicName   = "";
			this.unseenSlots	= [];
			this.methodSlots	= [];
			this.myName			= "";
			this.dahuShouPai	= null;
			this.dahuFanXing	= "";
			this.dahuScores		= null;
			this.dahuFanShu		= null;
			this.dahuFanXingCCB = null;
			this.dahuAni		= null;
			this.mask			= null;
			this.myhead			= null;
			this.detailslayer	= null;
			this.isHaveWinStreak = false;//是否配置了连胜任务
			this.womanAnimal	= null;
			this.dahuShareNode  = null;
			this.init(GLOBAL_OBJ.RES.SICHUAN_XUEZHAN_BUDGETS_XZDHLAYER_CCBI);
		},

		init:function(_ccbi){
			this._super(_ccbi);
		},

		onLoad: function() {
			this._super();
			var that      = this;

			this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			this.isHaveWinStreak = MODEL_TASK_WINSTREAK.getIsHaveWinStreak();
			// 菜单中详情按钮监听
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_MENU_DETAILS, this.onListenXiangqingdhBtn, this);
			this.updateXZ();

			GLOBAL_OBJ.LOGD("SiChuan.XueZhan.Budgets.XZDHLayer onLoad end");
		},

		onCleanup:function() {
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		updateXZ:function(){
            var that = this;

            //大胡不管本家是否输赢，都播赢的音效
            AUDIO.audio( GLOBAL_OBJ.RES.JIPINGHU_EFFECT_EFFECT_GAME_END_ENTER_MP3 );

            this.dahudi_node.setVisible(true);//大胡底界面
            this.params.scene.setPanelAndDisCardVisible(false);//大胡界面，隐藏掉牌桌上的玩家面板和弃牌区面板
            this.dahuNode.setVisible(false);//大胡底界面中自己的部分
            this.table_btns_node.setVisible(false);//牌桌按钮组
            //this.task_node.setVisible(false);//任务面板
            this.dahuShareLayer.setVisible(false);//分享界面
            this.dahuhupai_node.setVisible(false);//玩家和牌详细数据

            /*
             大胡界面数据
             番型-番数-积分金币数 */
			var seatId 				= GLOBAL_T.MYSEAT;
			this.dahuFanShu      	= MODEL_ROUND_RESULT.getTotalFanByLocalId(seatId) || 0;
			this.dahuScores 		= MODEL_ROUND_RESULT.getTotalScoreByLocalId(seatId) || 0;
			var fanxingCCB			= MODEL_BUDGETS.dealWithWinModeInPatterns(seatId);

			var uid      = MODEL_ROUND_RESULT.getUserIdByLocalId(seatId);
			var userName = MODEL_USER.getName(uid);
			// if (userName.length > 6){
			// 	userName = userName.substr(0,6) + "..";
			// }
			this.myName	 = userName;

			if (this["portraitNode_my"].getChildrenCount() == 0 && uid>0) {
				this.myhead = GLOBAL_OBJ.businesses.modules.User.Portrait.produce( uid,
					GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, this["portraitNode_my"]);
				this["portraitNode_my"].setScale(1.5);
			}

			//大胡特效
			that.dahuAni = GLOBAL_OBJ.bkernel.utils.Animation.play(
				that.dahuccbNode,
				GLOBAL_OBJ.RES.XZ_ZM_TX_DAHU_CCBI,
				cc.p(0,0),
				function(_animate) {
					GLOBAL_OBJ.LOGD("mahjong_sichuan_xuanzhan_budgets_xzdhlayer.js","Animation.player(func_1)");
					//大胡背景，多分辨率适配
					var winSize = cc.director.getWinSize();
					var bgSize = _animate['bg'].getContentSize();
					// var scl = Math.max(winSize.width/bgSize.width, winSize.height/bgSize.height);

					_animate['bg'].setScaleX(winSize.width/bgSize.width);
					_animate['bg'].setScaleY(winSize.height/bgSize.height);
					// _animate['bg'].setScale(scl);

					// _animate['bg'].setAnchorPoint(0.5,0.5);
					// _animate['bg'].setPosition(winSize.width/2,winSize.height/2);

					that.womanAnimal = new sp.SkeletonAnimation(GLOBAL_OBJ.RES.SPINE_FIGURES_JSON, GLOBAL_OBJ.RES.SPINE_FIGURES_ATLAS);
					_animate.dahu_woman_node.addChild(that.womanAnimal);
					that.womanAnimal.setAnimation(0, "animation", true);
                    _animate.dahu_woman_node.setScale(-1, 1);

					var size1        = _animate.dahuliushui.getContentSize();
					that.patternNTV1 = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
						viewSize   :cc.size(size1.width,size1.height),
						direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
						fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
						cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
						controller :GLOBAL_OBJ.table.windows.gdmj.jipinghu.Budgets.Detail_Cell,
						container  :_animate.dahuliushui,
						data       :that.data
					});

					_animate.dahuliushui.addChild(that.patternNTV1);
					that.dahuLiushuiNode = _animate.dahuliushui;

					//刷新 手牌模块
					that.unseenSlots   = [
						_animate.unseenSlot_1,  _animate.unseenSlot_2,  _animate.unseenSlot_3,  _animate.unseenSlot_4,
						_animate.unseenSlot_5,  _animate.unseenSlot_6,  _animate.unseenSlot_7,  _animate.unseenSlot_8,
						_animate.unseenSlot_9,  _animate.unseenSlot_10, _animate.unseenSlot_11, _animate.unseenSlot_12,
						_animate.unseenSlot_13, _animate.unseenSlot_14, _animate.unseenSlot_15
					];

					//吃碰杠节点组
					that.methodSlots   = [
						_animate.cpgNode_1,  _animate.cpgNode_2,  _animate.cpgNode_3,  _animate.cpgNode_4
					];
					/*
					 大胡界面数据
					 刷新 本家手牌信息 */
					var totalnum = GLOBAL_OBJ.table.scenes.Table.Functions.dahu_recovery_tiles(MODEL_ROUND_RESULT,
						seatId, GLOBAL_T.SEATS.N2, that.unseenSlots, that.methodSlots, true);
					var dhcpgPos = _animate.dahu_cpg_node.getPosition();
					var offX 	 = 24 * totalnum;
					dhcpgPos.x   = dhcpgPos.x + offX;
					_animate.dahu_cpg_node.setPosition(dhcpgPos);

					that.dahuShouPai = _animate.shoupai_node;

					var shoupai_size = _animate.shoupai_node.getBoundingBox();
					GLOBAL_OBJ.bkernel.utils.Animation.play(
						_animate.shoupai_node,
						GLOBAL_OBJ.RES.XZ_ZM_TX_DAHU1_CCBI,
						cc.p(shoupai_size.width/2.0 + 180, shoupai_size.height/2.0 + 23),
						function (_ani) {},
						function (_ani) {},
						true, 1.0);

					_animate.dahufanshu.setString(that.dahuFanShu.toString());
                    _animate['nodeBeiShu'].setPositionX(_animate['dahufanshu'].x + _animate['dahufanshu'].width + 7);
					var txt = GLOBAL_FUNCS.formatGold(that.dahuScores);
					_animate.dahuscore.setString(txt);

					var icon = that.isCreate ? GLOBAL_OBJ.RES.TABLE_FLOW_FEN_PNG : GLOBAL_OBJ.RES.COIN_SMALL_PNG;
					GLOBAL_FUNCS.textureChange(_animate.dahujjicon, icon);

					//大胡界面中的番型动画
					_animate.dahuFanXingCCB_node.scheduleOnce(function() {
						GLOBAL_OBJ.bkernel.utils.Animation.play(
							_animate.dahuFanXingCCB_node,
							fanxingCCB.ccb,
							cc.p(0, 0),
							function (_animate) {},
							function (_animate) {},
							true, 1.0, "dahu");
					},1.05);
					that.dahuFanXingCCB = _animate.dahuFanXingCCB_node;

					var size2        = _animate.unseenSlot_15.getContentSize();
					that.patternNTV2 = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
						viewSize   :cc.size(size2.width,size2.height),
						direction  :cc.SCROLLVIEW_DIRECTION_HORIZONTAL,
						fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
						cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
						controller :GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.XZDHCell,
						container  :_animate.unseenSlot_15,
						data       :that.dataxl
					});
					_animate.unseenSlot_15.addChild(that.patternNTV2);
					that.dahuMjNode = _animate.unseenSlot_15;

				},
				function(_animate) {
					GLOBAL_OBJ.LOGD("mahjong_sichuan_xuanzhan_budgets_xzdhlayer.js","Animation.player(func_2)");
					_animate.dahuccb_xuanyaospr.setVisible(false);
					_animate.dahuccb_xuanyaotxt.setVisible(false);
					_animate.dahuccb_jixuspr.setVisible(false);
					_animate.dahuccb_jixutxt.setVisible(false);
					that.dahuNode.setVisible(true);//大胡底界面中自己的部分
				},
				true, 1.0, "play");

            var serverId = GLOBAL_OBJ.table.utils.Seat.toServerSeatId(GLOBAL_T.MYSEAT);
			var patt = MODEL_FLOW.getDetailDescList(serverId);
			this.data.data 		= patt;
			//this.data.isCreate 	= this.isCreate;
			this.data.color = "normal";
			this.patternNTV1.reloadData(patt.length);

			var tile     = MODEL_ROUND_RESULT.getWinTile(seatId);
			var k_index = 0;
			for(var key in tile){
				k_index = k_index + 1;
			}
			GLOBAL_OBJ.LOGD("patternNTV2length=", k_index);
			this.dataxl.data = tile;
			this.patternNTV2.reloadData(k_index);
		},

		updateDetailsView:function () {//添加详细结算界面
			var that = this;
			if(!this.detailslayer){
                //this.detailslayer = new GLOBAL_OBJ.table.windows.gdmj.jipinghu.Budgets.Layer( { parents:that, scene: this.params.scene});
				this.detailslayer = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.Layer( { parents:that, scene: this.params.scene});
				// this.detailslayer = new GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.Details({
				// 	backBtn:function() {
				// 		that.onXiangqingBackToTable();
				// 	},
				// 	continueBtn:function() {
				// 		that.onXiangqingContinueBtn();
				// 	},
				// });
				this.budgets_details_node.addChild(this.detailslayer.getRootNode());
			}
		},

		onBackdhBtn:function( _isxiangqing ){//大胡界面的返回按钮事件
			this.setSwallowTouches(false);
			this.continue_node.setVisible(true);
			this.table_btns_node.setVisible(true);//牌桌按钮组
			this.params.scene.setPanelAndDisCardVisible(true);//显示桌上的玩家面板和弃牌区面板

			if (MODEL_ROUND_RESULT.getSiChuanFinal(GLOBAL_T.MYSEAT) == 1) {//自建桌最后一局
				GLOBAL_FUNCS.textureChange(this.table_btns_js_spr,GLOBAL_OBJ.RES.ZMWF_JS_BTN_DJSSPR_PNG);
			}

			if(_isxiangqing && _isxiangqing != "xiangqing"){//详细界面返回牌桌不提示起泡
				AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);//详细界面返回按钮回调不播放音效
				this.params.scene.menu.setDetailSprVisible(true);//返回牌桌需要显示查看详情按钮气泡
			}
			this.params.scene.menu.setMenuState("table_end");//好友场从结算返回牌桌后，重置状态，因为点击返回需要发起结算牌桌

			this.dahudi_node.setVisible(false);//大胡底界面
			this.dahuShareLayer.setVisible(false);//分享界面
			this.dahuhupai_node.setVisible(false);//玩家和牌详细数据
		},

		onXiangqingdhBtn:function ( _from ) {//大胡界面的详情按钮事件
			GLOBAL_OBJ.LOGD("onXiangqingdhBtn:", _from);
			if(_from != "tablemenu"){
				AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			}
			this.setSwallowTouches(false);
			this.dahuhupai_node.setVisible(true);//玩家和牌详细数据
			this.params.scene.setPanelAndDisCardVisible(true);//大胡界面跳到详情界面需要显示桌上的玩家面板和弃牌区面板
			this.updateDetailsView();
			//this.task_node.setVisible(false);
			this.dahudi_node.setVisible(false);//大胡底界面
			this.table_btns_node.setVisible(false);//牌桌按钮组
			this.dahuShareLayer.setVisible(false);//分享界面
		},

		onListenXiangqingdhBtn:function () {
			this.onXiangqingdhBtn("tablemenu");
		},

		onShowShareView:function (sender, controlEvent) {//大胡界面炫耀按钮事件
            var that = this;
            if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER) { //点击按钮
                GLOBAL_OBJ.LOGD(this._TAG,"CONTROL_EVENT_TOUCH_DOWN : ");
                var sTo = cc.ScaleTo.create(0.08,1.1);
                this.shareBtn_fnt.runAction(sTo);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE) { //在按钮范围内松开
                GLOBAL_OBJ.LOGD(this._TAG,"CONTROL_EVENT_TOUCH_UP_INSIDE : ");
                var sTo = cc.ScaleTo.create(0.08,1.0);
                this.shareBtn_fnt.runAction(sTo);

                if (this.dahuShareNode == null) {
                    this.dahuShareNode = new GLOBAL_OBJ.table.windows.gdmj.jipinghu.Budgets.DaHuShare({head:that.myhead});
                    this.fenxiangNode.addChild(this.dahuShareNode.getRootNode());
                    this.fenxiangNode.setScale(0.75);
                    this.fenxiangNode.setPositionY(this.fenxiangNode.getPositionY() + 30);
                    this.dahuShareLayer.setVisible(true);//分享界面
                }
                else {
                    this.dahuShareLayer.setVisible(true);//分享界面
                }
                this.dahuShareNode.setSwallowTouches(true);

            } else if(controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){//滑动出点击范围
                GLOBAL_OBJ.LOGD(this._TAG,"CONTROL_EVENT_TOUCH_DRAG_EXIT : ");
                var sTo = cc.ScaleTo.create(0.08,1.0);
                this.shareBtn_fnt.runAction(sTo);
            }
		},

        onContinuedhBtn:function (sender, controlEvent) {//大胡界面继续按钮事件
            if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER) { //点击按钮
                GLOBAL_OBJ.LOGD(this._TAG,"CONTROL_EVENT_TOUCH_DOWN : ");
                var sTo = cc.ScaleTo.create(0.08,1.1);
                this.continuedhBtn_fnt.runAction(sTo);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE) {//在按钮范围内松开
                GLOBAL_OBJ.LOGD(this._TAG,"CONTROL_EVENT_TOUCH_UP_INSIDE : ");
                var sTo = cc.ScaleTo.create(0.08,1.0);
                this.continuedhBtn_fnt.runAction(sTo);

                this.onContinueXZ();
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT) {//滑动出点击范围
                GLOBAL_OBJ.LOGD(this._TAG,"CONTROL_EVENT_TOUCH_DRAG_EXIT : ");
                var sTo = cc.ScaleTo.create(0.08,1.0);
                this.continuedhBtn_fnt.runAction(sTo);
            }
        },

		doVisibleFenXiangChild:function ( _bool ) {
			if(_bool){
				var that = this;
				AUDIO.audio( GLOBAL_OBJ.RES.JIPINGHU_EFFECT_EFFCET_PHOTOGRAPH_MP3 );
				this.xingjilayer.setVisible(true);
				this.xingjilayer.scheduleOnce(function(){
					var pos = that.fenxiangNode.getPosition();
					pos.y = pos.y + 50;
					that.fenxiangNode.setPosition(pos);
					that.fenxiangNode.setScale(0.8);
					that.xingjilayer.setVisible(false);

					that.closeBtn.setVisible(_bool);
					that.haoyouBtn.setVisible(_bool);
					that.haoyouspr.setVisible(_bool);
					that.haoyoutxt.setVisible(_bool);
					that.pengYQBtn.setVisible(_bool);
					that.pyqspr.setVisible(_bool);
					that.pyqtxt.setVisible(_bool);
				},0.15);
			}else{
				this.xingjilayer.setVisible(false);
				this.closeBtn.setVisible(_bool);
				this.haoyouBtn.setVisible(_bool);
				this.haoyouspr.setVisible(_bool);
				this.haoyoutxt.setVisible(_bool);
				this.pengYQBtn.setVisible(_bool);
				this.pyqspr.setVisible(_bool);
				this.pyqtxt.setVisible(_bool);
			}
		},

		onBackTask:function () {//任务面板的返回按钮
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
			var size = cc.director.getWinSize();
			var xx = size.width * 0.5;
			this.continue_node.setPositionX(xx);

			this.setSwallowTouches(false);
			this.table_btns_node.setVisible(true);//牌桌按钮组
			if(this.isCreate) {//如果是一个自建桌
				if (MODEL_ROUND_RESULT.getSiChuanFinal(GLOBAL_T.MYSEAT) == 1) {//自建桌最后一局
					GLOBAL_FUNCS.textureChange(this.table_btns_js_spr,GLOBAL_OBJ.RES.ZMWF_JS_BTN_DJSSPR_PNG);
				}
			}else{
				this.params.scene.menu.setMenuState("table_end");//大胡金币场从结算返回牌桌后，重置状态，因为点击返回需要离开牌桌
				this.params.scene.menu.setDetailSprVisible(true);//返回牌桌需要显示查看详情按钮气泡
			}
			//this.task_node.setVisible(false);//任务面板
			this.dahudi_node.setVisible(false);//大胡底界面
			this.dahuShareLayer.setVisible(false);//分享界面
			this.dahuhupai_node.setVisible(false);//玩家和牌详细数据
		},
		onContinueTask:function () {//任务面板的继续匹配按钮
			this.onContinueXZ();
		},

		onCloseToTable:function () {//分享界面的返回按钮事件
			if (this.dahuShareLayer) {
				this.dahuShareLayer.setVisible(false);
				this.dahuShareNode.setSwallowTouches(false);
			}
		},

		onXiangqingBackToTable:function () {//详细界面返回按钮事件
			this.onBackdhBtn("xiangqing");
		},
		onXiangqingContinueBtn:function () {//详细界面下一局按钮事件
			this.onContinueXZ();
		},

		onContinueXZ:function(){
			GLOBAL_OBJ.LOGD("onContinueXZ_sichuan_xuezhan!!");
			var that = this;
			//判断桌子类型
			if(this.isCreate){//如果是一个自建桌
				if (MODEL_ROUND_RESULT.getSiChuanFinal( GLOBAL_T.MYSEAT ) == 1) {//自建桌最后一局
					var parent = this.params.parents.getRootNode().getParent();
					parent.removeAllChildren();
					var daparent = this.params.scene.getBigBudgetNode();//大结算节点
					this.params.parents.windowClose();
					GLOBAL_OBJ.bkernel.windows.Factory.produce(
						GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGET_FINAL,
						{scene: this.params.scene},
						daparent
					);
				}else{
					C2S.requestNextRound(
						MODEL_TABLEINFO.getRoomId(),
						MODEL_TABLEINFO.getTableId(),
						MODEL_TABLEINFO.getActiveServerSeatId()
					);
				}
			}else{
				GLOBAL_FUNCS.coinTableDoNext();
			}
			this.windowClose();
		},

		onContinueBtn1:function(){//牌桌继续按钮
			this.onContinueXZ();
		},

		// onLeaveGame:function () {//牌桌离开按钮
		// 	//退出金币场
		// 	GLOBAL_OBJ.table.network.C2S.requestTableLeave(
		// 		MODEL_TABLEINFO.getRoomId(),
		// 		MODEL_TABLEINFO.getTableId(),
		// 		MODEL_TABLEINFO.getActiveServerSeatId()
		// 	);
		// },

		/**
		 *	小结算分享到朋友圈
		 */
		onClickFriendsShare:function(sender, controlEvent) {
			var that = this;
			if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER) {
				GLOBAL_OBJ.LOGD(this._TAG, "onClickFriendsShare CONTROL_EVENT_TOUCH_DOWN");
                var sTo  = cc.ScaleTo.create(0.08, 1.1);
                var sTo1 = cc.ScaleTo.create(0.08, 1.1);
				this.pyqspr.runAction(sTo);
				this.pyqtxt.runAction(sTo1);
			}
			else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE) {
				GLOBAL_OBJ.LOGD(this._TAG, "onClickFriendsShare CONTROL_EVENT_TOUCH_UP_INSIDE");
                var sTo  = cc.ScaleTo.create(0.08, 1);
                var sTo1 = cc.ScaleTo.create(0.08, 1);
                this.pyqspr.runAction(sTo);
                this.pyqtxt.runAction(sTo1);

                if (!this.dahuSharePicName) {
                	this.createDaHuShareImg(function (val) {
						that.dahuSharePicName = val;
						that.shareByType('0');
                    }, that.dahuShareNode.getRootNode());
				}
				else {
                	this.share('0');
				}
			}
			else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT) {
				GLOBAL_OBJ.LOGD(this.TAG, "onClickFriendsShare CONTROL_EVENT_TOUCH_DRAG_EXIT");
                var sTo  = cc.ScaleTo.create(0.08, 1);
                var sTo1 = cc.ScaleTo.create(0.08, 1);
                this.pyqspr.runAction(sTo);
                this.pyqtxt.runAction(sTo1);
			}
		},

		/**
		 *	小结算分享给一个朋友
		 */
		onClickOneFriendShare:function(sender, controlEvent) {
			var that = this;
            if(controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER) {
                GLOBAL_OBJ.LOGD(this._TAG, "onClickOneFriendShare CONTROL_EVENT_TOUCH_DOWN");
                var sTo  = cc.ScaleTo.create(0.08, 1.1);
                var sTo1 = cc.ScaleTo.create(0.08, 1.1);
                this.haoyouspr.runAction(sTo);
                this.haoyoutxt.runAction(sTo1);
            }
            else if(controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE) {
                GLOBAL_OBJ.LOGD(this._TAG, "onClickOneFriendShare CONTROL_EVENT_TOUCH_UP_INSIDE");
                var sTo  = cc.ScaleTo.create(0.08, 1.0);
                var sTo1 = cc.ScaleTo.create(0.08, 1.0);
                this.haoyouspr.runAction(sTo);
                this.haoyoutxt.runAction(sTo1);

                if(this.dahuSharePicName == null){
                    this.createDaHuShareImg(function (val) {
                        that.dahuSharePicName = val;
                        that.shareByType('1');//1分享到微信好友
                    }, that.dahuShareNode.getRootNode());
                }else{
                    this.share('1');
                }
            }
            else if(controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT) {
                GLOBAL_OBJ.LOGD(this._TAG, "onClickOneFriendShare CONTROL_EVENT_TOUCH_DRAG_EXIT");
                var sTo  = cc.ScaleTo.create(0.08, 1.0);
                var sTo1 = cc.ScaleTo.create(0.08, 1.0);
                this.haoyouspr.runAction(sTo);
                this.haoyoutxt.runAction(sTo1);
            }
		},

        /**
         *	手动绘制大胡分享图片
         */
        shareByType:function(type)
        {
            var that = this;
            if(this.dahuSharePicName == null)
            {
                GLOBAL_OBJ.LOGD(this._TAG, "没有大胡分享图片，请先绘制大胡图片再分享" );
                //绘制图片
                this.createDaHuShareImg(function (val) {
                    that.dahuSharePicName = val;
                    that.share(type);
                }, that.dahuShareNode.getRootNode());
            }
            else
            {
                GLOBAL_OBJ.LOGD(this._TAG, "大胡分享图片已经存在，直接分享" );
                this.share(type);
            }
        },

        /**
         *分享
         */
        share:function(type)
        {
            var pic =   jsb.fileUtils.getWritablePath() + this.dahuSharePicName;
            // 判断文件确实存在
            if(ty.FileManager.checkFileExist(pic))
            {
                GLOBAL_OBJ.LOGD(this._TAG, "大胡分享的图片路径： "+pic );
                var title = GLOBAL_OBJ.GlobalVars.getAppName();
                var desc  = "";

                hall.ShareInterface.shareWithPic(title, desc, pic, type);

            }
            else
            {
                GLOBAL_OBJ.LOGD(this._TAG, "分享大胡图片失败 " );
            }
        },

        /*
        绘制大胡分享图片 setVirtualViewport*/
        createDaHuShareImg:function(_callFunc, _shareNode){
            var winSize = cc.Director.getInstance().getWinSize();

            var screenTexture = cc.RenderTexture.create(winSize.width, winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);

            var sharenode = _shareNode;
            sharenode.setPosition(cc.director.convertToGL(cc.p(winSize.width/2, winSize.height/2)));
            // 渲染纹理开始捕捉
            screenTexture.begin();
            _shareNode.visit();
            // 结束捕捉
            screenTexture.end();
            sharenode.setPosition(cc.p(0,0));

            // 保存为JPEG图片
            var name = 'mj_dahu_share.png';
            // var img  = screenTexture.newImage(false);
            screenTexture.saveToFile(name, true);
            var pic =   jsb.fileUtils.getWritablePath() + name;
            GLOBAL_OBJ.LOGD(this._TAG, "mj_dahu_share图片路径： "+pic );
            // 处理回调
            var callFunc = _callFunc || function(){};
            sharenode.runAction(cc.Sequence.create(
                cc.DelayTime.create(0.5),
                cc.CallFunc.create(function(){
                    callFunc(name);
                }))
            );
        },

	});
	//end
})();
