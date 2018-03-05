/*************************************************************
 *  mahjong_table_scene.js
    mahjong_table_scene
 *  mahjong
    牌桌场景
 *
 *  Created by nick.kai.lee on 16-05-31
 *  特殊说明：
      牌桌场景仅仅是一个节点容器
    使用方法:
 */

(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    var TAG = 'table.scenes.Table.Scene';

	var GLOBAL_FUNCS     = GLOBAL_OBJ.businesses.functions;
	var GLOBAL_T         = GLOBAL_OBJ.table.global;
    var MODEL_TABLEINFO  = GLOBAL_OBJ.table.models.TableInfo;
    var C2S              = GLOBAL_OBJ.table.network.C2S;
    var MODEL_USER       = GLOBAL_OBJ.businesses.modules.User.Model;
    var AUDIO            = GLOBAL_OBJ.bkernel.utils.Audio;
    var MODEL_TINGRESULT = GLOBAL_OBJ.table.models.Ting_Result;

	GLOBAL_OBJ.table.scenes.Table.Scene = GLOBAL_OBJ.bkernel.base.BaseSceneController.extend({
		_TAG:"table.scenes.Table.Scene",
		ctor: function() {
			this._super();
            GLOBAL_OBJ.businesses.utils.Scene.setDs();
		},

		onLoad: function() {
			this._super();

            var size  = cc.director.getWinSize();
            var bgSize = this['table_bg'].getContentSize();
            var scal = Math.max(size.width/bgSize.width, size.height/bgSize.height);
            this['table_bg'].setScale(scal);

            this['table_bg'].setAnchorPoint(0.5,0.5);
            this['table_bg'].x = size.width / 2;
            this['table_bg'].y = size.height / 2; //剧中对齐

            //对操作按钮区，进行适配
            this['methodsNode'].setPosition((size.width / 2), 130);

            var that           = this;
            this.isCreate      = null;
            this.menu          = null;
            this.isShowInvite  = true;
            this.chat_time     = 0; // 用来记录金币场，玩家没金币后，发表情的cd时间
            this.isMethod      = 0;

            this.isChipReadyBtn = true; // 这个字段是用来控制，是否要显示金币场游戏开始按钮的开关

            // 牌桌玩法文字
            var txtMode = MODEL_TABLEINFO.getPlayMode();
            if (txtMode == GLOBAL_T.PLAYMODE.ZhuoJi) {
                GLOBAL_FUNCS.textureChange(this.wanFaImg, GLOBAL_OBJ.RES.GYMJ_TABLE_TXT_0_PNG);
            }
            else if (txtMode == GLOBAL_T.PLAYMODE.ErDingGuai) {
                GLOBAL_FUNCS.textureChange(this.wanFaImg, GLOBAL_OBJ.RES.GYMJ_TABLE_TXT_1_PNG);
            }
            else if (txtMode == GLOBAL_T.PLAYMODE.SanDingGuai) {
                GLOBAL_FUNCS.textureChange(this.wanFaImg, GLOBAL_OBJ.RES.GYMJ_TABLE_TXT_2_PNG);
            }

            if (!GLOBAL_OBJ.tableEffectPlayer) {
                //插件内，只初始化一次，退出插件时销毁
                GLOBAL_OBJ.tableEffectPlayer = new GLOBAL_OBJ.table.EffectManager();
                GLOBAL_OBJ.tableEffectPlayer.initEffects();
            }

            /*
             @通知注册-用来控制好友场，玩家坐满后，邀请好友按钮隐藏*/
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_SITDOWN_INVITE, function(){
                var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
                if(isCreate){
                    var counts      = MODEL_TABLEINFO.getSeatCount();
                    var sitCounts   = 0;
                    for(var i = 0 ; i < counts ; ++i){
                        if(that.panels[i].portrait != null){
                            sitCounts = sitCounts + 1;
                        }
                    }
                    // GLOBAL_OBJ.LOGD("UPDATE_TABLE_SIT_sitCounts:", sitCounts + " counts:" + counts);
                    if(sitCounts == counts){
                        that.isShowInvite = false;
                        that['inviteBtn'].setVisible( false );
                        that['inviteBtnTxt'].setVisible( false );
                    }else{
                        that.isShowInvite = true;
                        var isFangZhu = hall.AccountInfo.userID == MODEL_TABLEINFO.getCustomTableHostUid();
                        var isfirst   = MODEL_TABLEINFO.getCustomTablePlayTimes() == 0 ? 1 : 0;
                        // GLOBAL_OBJ.LOGD("UPDATE_TABLE_SIT_isFangzhu:", + isFangZhu + "  isfirst:" + isfirst);
                        //是房主，且当前使用的房卡数是1，就是第一局
                        if( isFangZhu && isfirst)
                        {
                            that['inviteBtn'].setVisible( true );
                            that['inviteBtnTxt'].setVisible( true );
                        }
                    }
                }
            }, this);

            // 门风
            this.wind          = new GLOBAL_OBJ.table.scenes.Table.Wind();
            this['windNode'].addChild(this.wind.getRootNode());

            this.tableInfoPanel = new GLOBAL_OBJ.table.scenes.Table.Info();
            this['node_tableInfo'].addChild(this.tableInfoPanel.getRootNode());

            // this.voicePanel = new GLOBAL_OBJ.businesses.windows.VoiceTalking.Window();
            // this['node_voicePanel'].addChild(this.voicePanel.getRootNode());

            this.batteryPanel = new GLOBAL_OBJ.table.scenes.Table.Battery();
            this['node_Battery'].addChild(this.batteryPanel.getRootNode());

            // 菜单
            this.menu = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU, {
                    onClickSetting:function(){
                        GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_SETTING,{}, that['windowNode']);
                    },
                    onClickChat:function(){
                        GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_CHAT,{}, that['windowNode']);
                    },
                    onClickShare:function(){
                        // 显示分享界面
                        GLOBAL_FUNCS.screenShot(function(_name){
                            GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_TABLE_SHARE_WND,
                                {shareUrl: null, shareTitle: GLOBAL_OBJ.GlobalVars.getAppName(), shareDesc: "", picName:_name},
                                that['windowNode']);
                        });
                    },
                    onClickLeave:function( _parems, _type ){//金币场，配了循环任务的
                        GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_LEAVE_TIP,
                            {miaoshu:_parems, type:_type, setFunc:function(_isHDS){}}, that['windowNode']);
                    }
                },
                this['menuNode']
            );

            // 语音聊天
            // this.voicePanel.initData(
            //     {
            //         "name":MODEL_USER.getName(hall.AccountInfo.UserID),
            //         "roomId":MODEL_TABLEINFO.getRoomId(),
            //         "tableId":MODEL_TABLEINFO.getTableId(),
            //         "seatId":MODEL_TABLEINFO.getActiveServerSeatId()
            //     }
            // );

            /*
            @玩家区域
            1.左区&右区不根据屏幕适配进行自动等比缩放
            2.上区&下区等比缩放
            3.中区是玩家打出的牌的放置区，fix width ，height no change
            */
            var left_panel,  right_panel,  top_panel,  bottom_panel;
            var left_avatar, right_avatar, top_avatar, bottom_avatar;
            var count       = MODEL_TABLEINFO.getSeatCount();

            // 四个方位面板以及弃牌区域面板
            this.panels     = {};
            // this.avatarPanels     = {};

            top_panel   = new GLOBAL_OBJ.table.scenes.Table.Panels.Player(GLOBAL_T.SEATS.N2);
            top_panel.init(GLOBAL_OBJ.RES.TABLE_PANEL_TOP_CCBI);
            top_panel.getRootNode().setScale(GLOBAL_FUNCS.autoScaleFactor());
            top_panel.getRootNode().setAnchorPoint(cc.p(0.5,1));
            top_panel.getRootNode().setPosition(cc.p(size.width*0.5,size.height));
            this['panelNode2'].addChild(top_panel.getRootNode());
            this.panels[GLOBAL_T.SEATS.N2] = top_panel;
            top_panel.tableScene = this;

            // 弃牌区域
            this.discard_panel = new GLOBAL_OBJ.table.scenes.Table.Panels.Discard(GLOBAL_T.SEATS.N4);
            this.discard_panel.init(GLOBAL_OBJ.RES.TABLE_PANEL_CENTER_CCBI);
            this.discard_panel.getRootNode().setAnchorPoint(cc.p(0.5,0.5));
            this.discard_panel.getRootNode().setPosition(cc.p(size.width*0.5,size.height*0.5));
            this['panelDiscardNode'].addChild(this.discard_panel.getRootNode());
            this.discard_panel.tableScene = this;

            // case 4:
            left_panel  = new GLOBAL_OBJ.table.scenes.Table.Panels.Player(GLOBAL_T.SEATS.N3);
            left_panel.init(GLOBAL_OBJ.RES.TABLE_PANEL_LEFT_CCBI);
            left_panel.getRootNode().setScale(GLOBAL_FUNCS.autoScaleFactor());
            left_panel.getRootNode().setAnchorPoint(cc.p(0,0.5));
            left_panel.getRootNode().setPosition(cc.p(0,size.height*0.5));
            this['panelNode3'].addChild(left_panel.getRootNode());
            this.panels[GLOBAL_T.SEATS.N3] = left_panel;
            left_panel.tableScene = this;

            right_panel = new GLOBAL_OBJ.table.scenes.Table.Panels.Player(GLOBAL_T.SEATS.N1);
            right_panel.init(GLOBAL_OBJ.RES.TABLE_PANEL_RIGHT_CCBI);
            right_panel.getRootNode().setScale(GLOBAL_FUNCS.autoScaleFactor());
            right_panel.getRootNode().setAnchorPoint(cc.p(1,0.5));
            right_panel.getRootNode().setPosition(cc.p(size.width,size.height*0.5));
            this['panelNode1'].addChild(right_panel.getRootNode());
            this.panels[GLOBAL_T.SEATS.N1] = right_panel;
            right_panel.tableScene = this;

            //本家
            bottom_panel = new GLOBAL_OBJ.table.scenes.Table.Panels.Player.Own(GLOBAL_T.SEATS.N0);
            bottom_panel.init(GLOBAL_OBJ.RES.TABLE_PANEL_BOTTOM_CCBI);
            bottom_panel.getRootNode().setScale(GLOBAL_FUNCS.autoScaleFactor());
            this['panelNode0'].addChild(bottom_panel.getRootNode());
            this.panels[GLOBAL_T.SEATS.N0] = bottom_panel;
            bottom_panel.tableScene = this;

            //修改麻将相关Node到同一个Node中，减少渲染队列，提升渲染效率

            var mpos;

            mpos = top_panel['mahjNode'].parent.convertToWorldSpace(top_panel['mahjNode'].getPosition());
            GLOBAL_FUNCS.changeParent(top_panel['mahjNode'], this['mahjPanel'], mpos);

            mpos = right_panel['mahjNode'].parent.convertToWorldSpace(right_panel['mahjNode'].getPosition());
            GLOBAL_FUNCS.changeParent(right_panel['mahjNode'], this['mahjPanel'], mpos);

            mpos = left_panel['mahjNode'].parent.convertToWorldSpace(left_panel['mahjNode'].getPosition());
            GLOBAL_FUNCS.changeParent(left_panel['mahjNode'], this['mahjPanel'], mpos);

            // mpos = bottom_panel['mahjNode'].parent.convertToWorldSpace(bottom_panel['mahjNode'].getPosition());
            var winSize = cc.director.getWinSize();
            GLOBAL_FUNCS.changeParent(bottom_panel['mahjNode'], this['mahjPanel'], cc.p(winSize.width/2,0));

            top_panel['mahjNode'].setLocalZOrder(0);
            right_panel['mahjNode'].setLocalZOrder(1);
            left_panel['mahjNode'].setLocalZOrder(2);
            this.panelDiscardNode.setLocalZOrder(3);
            bottom_panel['mahjNode'].setLocalZOrder(4);
            
            this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;

            // this.windNode.setVisible(true);//牌桌风门
            this['restTilesNode'].setVisible(false);//剩余牌数
            this['wanFaBtnNode'].setVisible(false);//玩法按钮-wanFa
            this['curRoundNode'].setVisible(false);//当前局数
            //this['flowNode'].setVisible(false);//flow牌局流水
            this['vipWaitingRoomNode'].setVisible(false);//牌桌等待区（里面有很多等待界面需要显示的控件）

            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.bkernel.Events.TICK,   function(_params){
                if(this.chat_time > 0){
                    this.chat_time = this.chat_time - 1;
                }
                // this.tileCountLabel.setString(GLOBAL_OBJ.table.models.Draw.getRemainedCount());
                if (this.isCreate) {
                    this['curRoundLabel'].setVisible(true);
                    this['totalRoundLabel'].setVisible(true);
                    this.roundLabel.setVisible(true);
                    this['curRoundLabel'].setString(MODEL_TABLEINFO.getCustomTableQuan() + 1);
                    this['totalRoundLabel'].setString(MODEL_TABLEINFO.getTotalTableQuan());
                    this.roundLabel.setString("        /    圈" + MODEL_TABLEINFO.getFengquan());
                }
            }, this);

            // 刷新牌桌剩余牌数
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_DRAW, function(){
                var remainCount = GLOBAL_OBJ.table.models.Draw.getRemainedCount();
                if(parseInt(remainCount) <= 5){
                    var scaleUp     = cc.ScaleTo.create(0.4, 1.5);
                    var scaleDown   = cc.ScaleTo.create(0.3, 1);
                    var zoomUp      = cc.EaseExponentialIn.create(scaleUp);
                    var zoomDown    = cc.EaseExponentialOut.create(scaleDown);
                    var seq         = cc.Sequence.create(zoomUp, cc.CallFunc.create(function(){
                        that['tileCountLabel'].setString(remainCount.toString());
                        that['restTilesNode'].setVisible(true);
                    }),zoomDown);
                    this['tileCountLabel'].runAction(seq);
                }else{
                    that['tileCountLabel'].setString(remainCount.toString());
                    that['restTilesNode'].setVisible(true);
                }
            }, this);

            if(MODEL_TABLEINFO.getCustomTablePlayTimes() == 0) {//只有开局才设置可见
                for (var i = 0; i < MODEL_TABLEINFO.getSeatCount(); ++i) {
                    var sid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                    var panel = that.panels[sid];
                    panel.doinviteBtnVisible(true);
                }
            }

            GLOBAL_OBJ.table.modules.Table.hook(GLOBAL_OBJ.table.modules.static.NAMES.TABLE, this);

            // 新版表情文字聊天监听
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_NEW_CHAT, function(){
                GLOBAL_OBJ.LOGD("进入 表情文字按钮的监听事件 测试一下 ");
                GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_CHAT,{}, that.windowNode);
            }, this);

            // 牌桌特效消息
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.SHOW_TABLE_EFFECT, this.showTableEffct, this);

            // 牌局流水总数消息
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_FLOW, function(_param){
                // var total           = _param.totalScore;
                // var txt             = GLOBAL_FUNCS.formatGold(total);
                // var isScoreChange   = that.flow_score == total;
                // that.flow_score     = total;
                // // GLOBAL_OBJ.LOGD("UPDATE_TABLE_FLOW", "flow_score:" + that.flow_score + "   total:" + total);
                // if(!isScoreChange){//当流水数值有变化时才有缩放特效
                //     var scaleUp     = cc.ScaleTo.create(0.3, 1.2);
                //     var scaleDown   = cc.ScaleTo.create(0.3, 1);
                //     var zoomUp      = cc.EaseExponentialIn.create(scaleUp);
                //     var zoomDown    = cc.EaseExponentialOut.create(scaleDown);
                //     var seq         = cc.Sequence.create(zoomUp, cc.CallFunc.create(function(){
                //         that['flowLabel'].setString(txt);
                //     }),zoomDown);
                //     that['flowNode'].runAction(seq);
                // }else{
                //     that['flowLabel'].setString(txt);
                // }
            }, this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_RESULT, this.onRecvShowTipBtn, this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOICE_TALKING_METHOD,this.onSetIsMethod, this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_READY_BUTTON,this.theChipIsReadyState, this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_WIN_STREAK_BTN_STATE,this.theChipIsReadyState, this);

            this.theAllWaitingAction();

            // 听牌提示面板
            this.tipPanel = new GLOBAL_OBJ.table.windows.TingPreview.Tips();
            this.tips_hu.addChild(this.tipPanel.getRootNode());
            this.btnEnable.setVisible(true);
		},

        /**
         * 显示庄家优先出牌TIPS
         */
        showBankerPlayTips:function () {
		    var playTipsNode;
            if (!this.bankerPlayTips){
                this.bankerPlayTips = new GLOBAL_OBJ.table.windows.TableTips.BankerPlayTips();
                this.getRootNode().addChild(this.bankerPlayTips.getRootNode());
            }

            playTipsNode = this.bankerPlayTips.getRootNode();

            var winSize = cc.director.getWinSize();
            playTipsNode.setPosition(winSize.width/2, 250);
            playTipsNode.setVisible(true);

            playTipsNode.scheduleOnce(function () {
                playTipsNode.setVisible(false);
            },2.5);
        },

        onSetIsMethod:function ( _method ) {
            if (_method) {
                this.isMethod = 1;
            } else {
                this.isMethod = 0;
            }
            GLOBAL_OBJ.LOGD(this._TAG,"onSetIsMethod  this.isMethod = " + this.isMethod);
        },

        onRecvShowTipBtn:function (_data) {
            var that = this;
            if (GLOBAL_OBJ.inStart) {
                // 开局动画期间延时延时听牌提示小按钮
                that.tipNodeBtn.scheduleOnce(function () {
                    that.onRecvShowTipBtn(_data);
                }, 0.3, "patch");
                return;
            }

            var mypanel = this.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
            var tingState = mypanel.getLocalTingState();
            if (tingState) {
                that.tipNodeBtn.setVisible(false);
                return;
            }
            //that.tips_node.setVisible(false);
            if (mypanel.checkCanOut()) {
                that.tipNodeBtn.setVisible(false);
                return;
            }
            var visible = _data.length > 0;
            that.tipNodeBtn.setVisible(visible);
        },

        ontipBtn:function () {
            this.tips_hu.setVisible(true);
            this.btnEnable.setVisible(true);
            var mypanel = this.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
            mypanel.hideTingTips();
            var tingData = MODEL_TINGRESULT.getTingResult();
            this.tipPanel.update(tingData);
            var offY = 100 * this.isMethod;
            this.tipPanel.updatePos(offY);
        },

        onLayerEnable:function () {
            this.tips_node.setVisible(false);
            this.btnEnable.setVisible(false);
            this.tips_hu.setVisible(false);
        },

        onBeforeCleanup:function(){
            if (GLOBAL_OBJ.tableEffectPlayer) {
                GLOBAL_OBJ.tableEffectPlayer.removeAllEffects();
            }
            
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            GLOBAL_OBJ.LOGI(TAG, "牌桌主动进行销毁，进行清理！！！！！");
            this._super();
        },

		onCleanup:function() {
            this.tableInfoPanel = null;
            // this.voicePanel = null;
            this.batteryPanel = null;
            this.tipPanel = null;

            this._super();
            GLOBAL_OBJ.LOGI(TAG, "牌桌销毁，进行清理！！！！！");
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

        /**
         *  播放一个全屏任意位置牌桌特效
         * @param pars [ccbName, pt, removed, beforePlayFun, afterPlayFun]
         */
        showTableEffct:function (pars) {

            GLOBAL_OBJ.LOGD(this._TAG, "showTableEffct start;");
            var ccbName = pars[0];
            var pt = pars[1];
            var removed = pars[2];
            var scale = pars[3];
            var beforePlayFun = pars[4]; //function(_animate){},
            var afterPlayFun = pars[5];  //function(_animate){},

            pt = this.getEffectNode().convertToNodeSpace(pt);
            GLOBAL_OBJ.LOGD("showTableEffct_removed = ", removed + " ccbName:" + ccbName);
            GLOBAL_OBJ.bkernel.utils.Animation.play(
                this.getEffectNode(),
                ccbName, pt,
                beforePlayFun,
                afterPlayFun,
                removed,
                scale
            );

            GLOBAL_OBJ.LOGD(this._TAG, "showTableEffct end;");
        },

		onBack:function(){
            // 请求离桌
            C2S.requestVoteQuit(
                MODEL_TABLEINFO.getRoomId(),
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId());
		},

        setChat_Time:function ( _second ) {
            var myChips         = hall.ME.getChip();
            // var chat_chip_num   = MODEL_TABLEINFO.getChatChip();
            var protectValue    = MODEL_TABLEINFO.getProtectValue();//金币扣除下限
            // GLOBAL_OBJ.LOGD("myChips_num:", myChips + "   protectValue ：" + protectValue);
            if(myChips <= protectValue){
                this.chat_time = _second;
            }else{
                this.chat_time = 0;
            }
        },

        getChat_Time:function () {
            return this.chat_time;
        },

        getClothsNode:function(){
            return this.clothsNode;
        },

        getMethodNode:function(){
            return this.methodsNode;
        },

        /*
        获得结算节点*/
        getBudgetNode:function(){
            return this.budgetNode;
        },

        /*
         获得大结算节点*/
        getBigBudgetNode:function(){
            return this.bigBudgetNode;
        },

        getReadyHandNode:function(){
            return this.readyHandNode || null;
        },

        getEffectNode:function(){
            return this.effectNode;
        },

        getGameFlowNode:function(){
            return this.gameFlowNode;
        },

        getTrusteeNode:function(){
            return this.trusteeNode;
        },

        getDealingNode:function(){
            return this.dealingNode;
        },

        getUserCardNode:function(){
            return this.userCardNode;
        },

        getPanelByLocalSeatId:function(_seatId){
            return this.panels[_seatId] || null;
        },

        getShareNode:function(){
            return this.shareNode;
        },

        getWindowNode:function(){
            return this.windowNode;
        },

        getVoteNode:function(){
            return this.voteNode;
        },

        getAbsenceNode:function () {
            return this.absenceNode;
        },

        getTipPanelNode:function()
        {
            return this.tipPanel.getRootNode();
        },

        /*
        @获取除了 _seatId 以外的所有有效panels
        */
        getPanelsExceptLocalSeatId:function(_seatId){
            var panels = [];
            for(var sid in this.panels){
                if (sid!=_seatId) {
                    panels.push(this.panels[sid]);
                }
            }
            return panels;
        },

        getDiscardPanel:function(){
            return this.discard_panel || null;
        },

        getWind:function(){
            return this.wind;
        },

        getOfflineNode:function(){
            return this.offlineNode;
        },

        getTipsNode:function()
        {
            return this.tips_node;
        },

        //下面的方法是从等待界面移过来的，去掉等待界面了
        setWaitingNodeVisible:function ( isSeen ) {//控制等待界面显示内容—and—控制进入牌桌后界面的显示内容

            GLOBAL_OBJ.LOGD(this._TAG, "setWaitingNodeVisible start;");

            this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
            var isFangZhu = hall.AccountInfo.userID == MODEL_TABLEINFO.getCustomTableHostUid();

            if(isSeen == true){
                // this.windNode.setVisible(false);//牌桌风门
                this.wind.wind_shaizi.setVisible(true);
                this.wind.wind_jishi_node.setVisible(false);//牌桌风门倒计时节点
                this.wind.effectNode.setVisible(false);//牌桌风门闪烁特效
                this.restTilesNode.setVisible(false);//剩余牌数
                this.wanFaBtnNode.setVisible(false);//玩法按钮-wanFa
                this.curRoundNode.setVisible(false);//当前局数
                //this.flowNode.setVisible(false);//flow牌局流水
                this.vipWaitingRoomNode.setVisible(true);//牌桌等待区（里面有很多等待界面需要显示的控件）
                this.menu.setMenuState("waitting",isFangZhu);// 设置菜单当前的状态为等待界面状态

            }else if(isSeen == "BeginGame"){
                this.vipWaitingRoomNode.setVisible(false);
                for(var i = 0 ; i < MODEL_TABLEINFO.getSeatCount(); ++i){
                    var sid   = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                    this.panels[sid].setPortraitIpVisbile(false);
                }
                //开局动画点击退出时,游戏进入托管状态,这里提前设置 menu状态进行避免
                this.menu.setMenuState("table_begin",isFangZhu);// 设置菜单当前的状态为牌桌开始状态
            }else{
                // GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_SHOWZHUANGSPR,{});//显示庄
                if (!this.isCreate){
                    this.wanFaBtnNode.setVisible(false);//玩法按钮-wanFa
                    this.curRoundNode.setVisible(false);//当前局数
                }
                else
                {
                    this.curRoundNode.setVisible(true);
                    this.wanFaBtnNode.setVisible(true);
                }
                // this.windNode.setVisible(true);
                this.wind.wind_shaizi.setVisible(false);
                this.wind.wind_jishi_node.setVisible(true);//牌桌风门倒计时节点
                this.wind.effectNode.setVisible(true);//牌桌风门闪烁特效
                this.restTilesNode.setVisible(true);//剩余牌数
                //this.flowNode.setVisible(true);//flow牌局流水
                this.vipWaitingRoomNode.setVisible(false);
                for(var i = 0 ; i < MODEL_TABLEINFO.getSeatCount(); ++i){
                    var sid   = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                    this.panels[sid].setPortraitIpVisbile(false);
                }
                this.menu.setMenuState("table_begin",isFangZhu);// 设置菜单当前的状态为牌桌开始状态
            }
            GLOBAL_OBJ.LOGD(this._TAG, "setWaitingNodeVisible end;");
        },

        /* 玩法介绍 */
        // onRules:function(){
        //     cc.log("MODEL_TABLEINFO.getPlayMode() "+MODEL_TABLEINFO.getPlayMode());
        //     var curSceen = cc.Director.getInstance().getRunningScene();
        //     //pk modify:显示玩法说明，参数：{playMode:"玩法"}：打开界面默认显示玩法
        //     var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(
        //         GLOBAL_OBJ.businesses.windows.consts.CREATE_ROOM_RULES_WND_HALL,
        //         {playMode:MODEL_TABLEINFO.getPlayMode()}, curSceen
        //     );
        // },

        theAllWaitingAction:function () {
            GLOBAL_OBJ.LOGD(this._TAG, "theAllWaitingAction start;");
            this.addSelfPortrait();
            this.controlBackBtn();
            // this.fangHaoShow();
            this.sameIpTips();
            // this.showChipReadyButton();
            GLOBAL_OBJ.LOGD(this._TAG, "theAllWaitingAction end;");
        },

        showChipReadyButton:function () {//金币场，游戏开始按钮，这个按钮存在的意义是牌局结束，玩家闪断，回到牌桌，玩家可以继续游戏
            if(!this.isCreate){
                var that = this;
                this.chipReadyBtnTxt.scheduleOnce(function(){
                    if(that.isChipReadyBtn){
                        that.chipReadyBtn.setVisible(true);
                        that.chipReadyBtnTxt.setVisible(true);
                    }
                },0.5);
            }
        },

        theChipIsReadyState:function () {
            this.isChipReadyBtn = false;
            this.chipReadyBtn.setVisible(false);
            this.chipReadyBtnTxt.setVisible(false);
        },

        addSelfPortrait:function () {

            GLOBAL_OBJ.LOGD(this._TAG, "addSelfPortrait start;");

            var that = this;

            //给自己的头像设置一个准备完成的函数，如果是自己的头像收到准备的话，且有这个函数，就会把准备按钮去掉
            var portrait = this.panels[GLOBAL_T.SEATS.N0].portrait;
            if (portrait){
                portrait.readyFunction = function(){
                    if ( (MODEL_TABLEINFO.getCustomTablePlayTimes() == 0
                        &&
                        hall.AccountInfo.userID != MODEL_TABLEINFO.getCustomTableHostUid())
                        ||
                        MODEL_TABLEINFO.getCustomTablePlayTimes() != 0
                    ) {
                    that.tipNode.setVisible(true);
                    }
                    //等待其他玩家的提示
                    that.animationBegin();
                    that.readyBtn.setVisible( false );
                    that.readyBtnTxt.setVisible( false );
                    that.inviteBtn.setVisible( false );
                    that.inviteBtnTxt.setVisible( false );
                };
            }

            GLOBAL_OBJ.LOGD(this._TAG, "addSelfPortrait end;");
        },

        controlBackBtn:function () {

            GLOBAL_OBJ.LOGD(this._TAG, "controlBackBtn start;");

            var that = this;

            /*
             准备按钮控制group
             如果是房主账号，显示微信邀请（主动准备）
             其他玩家，则显示准备按钮（被动准备）*/
            var readyBtnGroup = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true],
                [this.inviteBtn, this.readyBtn] );
            var readyBtnGroupTxt = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true],
                [this.inviteBtnTxt, this.readyBtnTxt] );
            //是房主且当前在使用第一张房卡。
            //房主是默认准备的，也就是，默认会下发一个ready状态。所以，房主不会显示准备按钮。
            //房主需要邀请其他玩家。但是也只有第一次的时候会邀请。
            //牌桌不能解散
            var isFangZhu = hall.AccountInfo.userID == MODEL_TABLEINFO.getCustomTableHostUid() ? 1 : 0;//当前用户就是房主
            var isFirst   = MODEL_TABLEINFO.getCustomTablePlayTimes() == 0 ? 1 : 0;//当前使用的房卡数是1，就是第一局
            readyBtnGroup.setVisible(isFangZhu && isFirst ? 0 : 1);
            readyBtnGroupTxt.setVisible(isFangZhu && isFirst ? 0 : 1);

            if(!that.isShowInvite){//牌桌坐满了，房主不显示邀请按钮了
                that.inviteBtn.setVisible( false );
                that.inviteBtnTxt.setVisible( false );
            }
            // GLOBAL_OBJ.LOGD("controlBackBtn_isFangZhu:", + isFangZhu + " isFirst:" + isFirst + "  isShowInvite:" + that.isShowInvite);

            /*
             退出按钮控制group
             如果是房主账号，显示 解散房间
             其他玩家，则显示 退出房间*/
            // var backBtnGroup  = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true],
            //     [this.killRoomBtn, this.quitRoomBtn] );
            // backBtnGroup.setVisible( hall.AccountInfo.userID == MODEL_TABLEINFO.getCustomTableHostUid() ? 0 : 1 );

            //金币场逻辑判断
            if (MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Normal || MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Match){
                GLOBAL_OBJ.LOGD("check_1111111112222");
                this.killRoomBtn.setVisible(false);
                this.quitRoomBtn.setVisible(false);
                this.readyBtn.setVisible(false);
                this.readyBtnTxt.setVisible(false);

                GLOBAL_FUNCS.textureChange(this.tip_note, GLOBAL_OBJ.RES.PAIZHUO_PLAYER_MATCH_WAIT_PNG);
            }

            GLOBAL_OBJ.LOGD(this._TAG, "controlBackBtn end;");
        },

        fangHaoShow:function () {

            GLOBAL_OBJ.LOGD(this._TAG, "fangHaoShow start;");

            var that = this;
            //只有第一局，显示房号
            if(MODEL_TABLEINFO.getCustomTablePlayTimes() == 0){
                this.table_waiting_id.setVisible(true);
                this.table_waiting_id.setString(MODEL_TABLEINFO.getCustomTableId());
                this.nameSpr.setVisible(false);
            }else{
                this.table_waiting_id.setVisible(false);
                this.nameSpr.setVisible(true);
            }
            GLOBAL_OBJ.LOGD(this._TAG, "fangHaoShow end;");

        },

        sameIpTips:function () {

            GLOBAL_OBJ.LOGD(this._TAG, "sameIpTips start;");

            var that = this;
            //同IP提示
            var record = {};
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_SIT, function(){
                var counts      = MODEL_TABLEINFO.getSeatCount();
                var samePlayers = {};
                for(var i = 0 ; i < counts ; ++i){
                    var uid  = MODEL_TABLEINFO.getPlayer( GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i) );

                    if (uid !== hall.AccountInfo.userID && uid !== null) {
                        var name = MODEL_USER.getName(uid);
                        var ip   = MODEL_USER.getIP(uid);
                        // GLOBAL_OBJ.LOGD("sameIpTips_ip:", ip  + "--   uid:" + uid + "   num:" + MODEL_TABLEINFO.getCustomTablePlayTimes());
                        samePlayers[ip] = samePlayers[ip] || [];

                        if (ip && ip.length > 0) {
                            samePlayers[ip].push(name);
                        }
                    }
                }

                var content = "";
                for(var ip in samePlayers){
                    if (samePlayers[ip].length > 1) {
                        for(var i = 0 ; i < samePlayers[ip].length; ++i){
                            content = content + samePlayers[ip][i];
                            if (i != samePlayers[ip].length-1) {
                                content = content + " 与 ";
                            }
                        }
                        content = content + " 在同一IP下！！！";
                        if (MODEL_TABLEINFO.getCustomTablePlayTimes() == 0 && !record[content]){
                            record[content] = true;
                            that.async(function(){
                                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                                    text:content,
                                    duration:5
                                });
                            },1);
                        }
                        break;
                    }
                }
            }, this);

            GLOBAL_OBJ.LOGD(this._TAG, "sameIpTips end;");
        },

        setPos:function(ref_,ax_,ay_,x_,y_,sx_,sy_,r_,a_){

            GLOBAL_OBJ.LOGD(this._TAG, "setPos start;");

            ref_.setAnchorPoint(cc.p(ax_,ay_));
            ref_.setPosition(cc.p(x_,y_));
            ref_.setScale(sx_,sy_);
            ref_.setRotation(r_);
            ref_.setOpacity(a_);

            GLOBAL_OBJ.LOGD(this._TAG, "setPos end;");
        },

        animationBegin:function (){

            GLOBAL_OBJ.LOGD(this._TAG, "animationBegin start;");

            this.setPos(this.tip_note,  0.00, 1.00, -158.00  ,18.00, 1, 1, 0, 255);
            if (MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Normal || MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Match){
                //金币场等待提示
                this.setPos(this.pointSpr0, 0.00, 1.00, 210.00   ,-1.00, 1, 1, 0, 0);
                this.setPos(this.pointSpr1, 0.00, 1.00, 227.00   ,-1.00, 1, 1, 0, 0);
                this.setPos(this.pointSpr2, 0.00, 1.00, 244.00   ,-1.00, 1, 1, 0, 0);
            }else{
                this.setPos(this.pointSpr0, 0.00, 1.00, 151.00   ,-1.00, 1, 1, 0, 0);
                this.setPos(this.pointSpr1, 0.00, 1.00, 168.00   ,-1.00, 1, 1, 0, 0);
                this.setPos(this.pointSpr2, 0.00, 1.00, 185.00   ,-1.00, 1, 1, 0, 0);
            }

            this.pointSpr0.stopAllActions();
            this.pointSpr1.stopAllActions();
            this.pointSpr2.stopAllActions();
            var xs=6;
            var d=cc.delayTime;
            var m=cc.moveTo;
            var s=cc.scaleTo;
            var r=cc.rotateTo;
            var f=cc.fadeTo;
            var p=cc.p;
            var h=cc.hide;
            var sw=cc.show;
            var seq=cc.sequence;
            this.tip_note.runAction(seq(d(0.5*xs),cc.callFunc(this.animationBegin,this)));
            this.pointSpr0.runAction(seq(d(0.07*xs),sw(),f(0.03*xs,255)));
            this.pointSpr1.runAction(seq(d(0.17*xs),sw(),f(0.03*xs,255)));
            this.pointSpr2.runAction(seq(d(0.27*xs),sw(),f(0.03*xs,255)));

            GLOBAL_OBJ.LOGD(this._TAG, "animationBegin end;");
        },

        /*
         非房主的准备按钮*/
        onReady:function(){
            AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
            C2S.requestReady(
                MODEL_TABLEINFO.getRoomId(),
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId());
        },

        /*
         房主的微信邀请按钮*/
        onInvite:function(){
            AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
            C2S.requestInvite(
                MODEL_TABLEINFO.getRoomId(),
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId());
        },

        getSeatPositionByLocalSeatId:function ( _localSid) {//获取玩家头像位置
            var pos = this.panels[_localSid].getPortraitZhuangPos();
            return pos;
        },

        // 获取玩家头像定缺角标位置
        getDQPositionByLocalSeatId:function (_localSid) {
            var pos = this.panels[_localSid].getPortraitDingQuePos();
            return pos;
        },

        setPanelAndDisCardVisible:function( _seen ){//控制panels和弃牌区是否可见

            GLOBAL_OBJ.LOGD(this._TAG, "setPanelAndDisCardVisible start;");

            this.panelNode0.setVisible(_seen);
            this.panelNode1.setVisible(_seen);
            this.panelNode2.setVisible(_seen);
            this.panelNode3.setVisible(_seen);
            this.panelDiscardNode.setVisible(_seen);
            this.windNode.setVisible(_seen);
            this.mahjPanel.setVisible(_seen);

            GLOBAL_OBJ.LOGD(this._TAG, "setPanelAndDisCardVisible end;");
        },

        onTableFlow:function()
        {
            GLOBAL_OBJ.LOGD(this._TAG, "onTableFlow start;");
            AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
            GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_FLOW,
                {}, this.windowNode);
            GLOBAL_OBJ.LOGD(this._TAG, "onTableFlow end;");
        },

        onTaskBtn:function () {
            GLOBAL_OBJ.LOGD(this._TAG, "onTaskBtn start;");
            AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
            GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_TASK,
                {}, this.windowNode);
            GLOBAL_OBJ.LOGD(this._TAG, "onTaskBtn end;");
        },

        onWanFa:function()
        {
            GLOBAL_OBJ.LOGD(this._TAG, "onWanFa start;");
            AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
            var param = {
                from     : "game",
                playMode : MODEL_TABLEINFO.getPlayMode(),
                moshi    : GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.getCreateRoomPlayDescList(),
            };
            
            GLOBAL_OBJ.bkernel.windows.Factory.produce(
                        GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_01,
                        param,
                        this.windowNode);
            GLOBAL_OBJ.LOGD(this._TAG, "onWanFa end;");
        },

        onChipReady:function () {//金币场玩家掉线重连，
            GLOBAL_FUNCS.coinTableDoNext();
        },

        removeWindowNodeChild:function(){
            this.windowNode.removeAllChildren();
        },

        // 取消选择听牌，返回到听+过界面
        onBtnCancelTingPreview:function () {
            GLOBAL_OBJ.LOGD(this._TAG, " ___onBtn__CancelTingPreview__start__");

            GLOBAL_OBJ.LOGD(this._TAG, " ___onBtn__CancelTingPreview__end__");
        }

    });
	//end
})();
