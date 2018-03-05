/*****************************************
 *  mahjong_table_module.js
 *   麻将 牌桌模块
 *  Created by zengxx on 16-06-07
 */

(function(){
    "use strict";
    var GLOBAL_OBJ                = guiyang;
    var GLOBAL_T                  = GLOBAL_OBJ.table.global;
    var GLOBAL_FUNCS              = GLOBAL_OBJ.businesses.functions;
    var C2S                       = GLOBAL_OBJ.table.network.C2S;
    var AUDIO                     = GLOBAL_OBJ.bkernel.utils.Audio;
    var AUDIO_RES                 = GLOBAL_OBJ.table.utils.Audio;
    var FAKE_MSG                  = GLOBAL_OBJ.table.network.FakeMsg;

    var MODEL_PROTOTYPE           = GLOBAL_OBJ.table.models.Prototype;

    var MODEL_USER                = GLOBAL_OBJ.businesses.modules.User.Model;
    var MODEL_IN_TABLE_CHECK      = GLOBAL_OBJ.table.models.InTableCheck;

    var MODEL_TABLEINFO           = GLOBAL_OBJ.table.models.TableInfo;
    var MODEL_LOCATION            = GLOBAL_OBJ.table.models.Location;
    var MODEL_TABLEEVENT          = GLOBAL_OBJ.table.models.TableEvent;
    var MODEL_DEAL                = GLOBAL_OBJ.table.models.Deal;
    var MODEL_DRAW                = GLOBAL_OBJ.table.models.Draw;
    var MODEL_DISCARD             = GLOBAL_OBJ.table.models.Discard;
    var MODEL_CHOW                = GLOBAL_OBJ.table.models.Chow;
    var MODEL_PONG                = GLOBAL_OBJ.table.models.Pong;
    var MODEL_KONG                = GLOBAL_OBJ.table.models.Kong;

    var MODEL_ASK_ABSENCE         = GLOBAL_OBJ.table.models.Absence;
    var MODEL_ABSENCE_OWN         = GLOBAL_OBJ.table.models.Absence_Own;
    var MODEL_ABSENCE_END         = GLOBAL_OBJ.table.models.Absence_End;

    var MODEL_ASK_TING            = GLOBAL_OBJ.table.models.Ask_Ting;
    var MODEL_TING_STATE          = GLOBAL_OBJ.table.models.Ting_State;
    var MODEL_TING_END            = GLOBAL_OBJ.table.models.Ting_End;

    var MODEL_CHONG_FENG          = GLOBAL_OBJ.table.models.Chong_Feng;

    var MODEL_TRUSTEE             = GLOBAL_OBJ.table.models.Trustee;
    var MODEL_LEAVE               = GLOBAL_OBJ.table.models.Leave;
    var MODEL_BUDGETS             = GLOBAL_OBJ.table.models.Budget;
    var MODEL_ACTIONID            = GLOBAL_OBJ.table.models.ActionId;
    var MODEL_CHAT                = GLOBAL_OBJ.table.models.Chat;
    var MODEL_NOTIFY_TIMEOUT      = GLOBAL_OBJ.table.models.notifytimeout;
    var MODEL_TABLE_SHOWTIPS      = GLOBAL_OBJ.table.models.showtips;
    var MODEL_TABLE_SHOWTASKTIPS  = GLOBAL_OBJ.table.models.showtasktips;

    var MODEL_CHARGING            = GLOBAL_OBJ.table.models.charging;
    var MODEL_ASK_CHARGE          = GLOBAL_OBJ.table.models.ask_charge;
    var MODEL_CHARGED             = GLOBAL_OBJ.table.models.charged;

    // var MODEL_ROUND_RESULT        = GLOBAL_OBJ.table.models.roundresult;
    var MODEL_GRAB_GANG_HU        = GLOBAL_OBJ.table.models.grabganghu;
    var MODEL_NOTIFY_GRAB_GANG_HU = GLOBAL_OBJ.table.models.notifygrabganghu;
    var MODEL_UPDATE_ROUNDCOUNT   = GLOBAL_OBJ.table.models.updateroundcount;

    var MODEL_COUNT_DOWN          = GLOBAL_OBJ.table.models.CountDown;
    var MODEL_READY               = GLOBAL_OBJ.table.models.Ready;

    var MODEL_CUSTOM              = GLOBAL_OBJ.table.models.Custom;
    var MODEL_VOTE                = GLOBAL_OBJ.table.models.Vote;
    var MODEL_SIT                 = GLOBAL_OBJ.table.models.Sit;
    var MODEL_BUDGETS_FINAL       = GLOBAL_OBJ.table.models.FinalBudget;

    var MODEL_FLOW                = GLOBAL_OBJ.table.models.Flow;
    var MODEL_TASK_WINSTREAK	  = GLOBAL_OBJ.table.models.winstreaktask;
    var MODEL_TASK_LOOPWINTIMESTASK	= GLOBAL_OBJ.table.models.loopwintimestask;
    var MODEL_TASK_LOOPACVIVETASK	= GLOBAL_OBJ.table.models.loopacvivetask;

    var MODEL_TINGRESULT = GLOBAL_OBJ.table.models.Ting_Result;

    var MODEL_MATCH               = GLOBAL_OBJ.businesses.scenes.Match.Model;

    var PROXY_METHODS;

    var receive_budgets_count = 0;
    var receive_round_result = false;
    var cleanEffects = {};

    /*
    @MVC models 数据清理*/
    var ___f_models_clean         = function(){
        MODEL_PROTOTYPE.doClean();

        MODEL_LOCATION.doClean();
        MODEL_TABLEINFO.doClean();
        MODEL_TABLEEVENT.doClean();
        MODEL_DEAL.doClean();
        MODEL_DRAW.doClean();
        MODEL_DISCARD.doClean();
        MODEL_CHOW.doClean();
        MODEL_PONG.doClean();
        MODEL_KONG.doClean();

        MODEL_ASK_ABSENCE.doClean();
        MODEL_ABSENCE_OWN.doClean();
        MODEL_ABSENCE_END.doClean();

        MODEL_ASK_TING.doClean();
        MODEL_TING_STATE.doClean();
        MODEL_TING_END.doClean();

        MODEL_BUDGETS.doClean();
        MODEL_LEAVE.doClean();
        MODEL_ACTIONID.doClean();
        MODEL_TRUSTEE.doClean();
        MODEL_CHAT.doClean();
        MODEL_BUDGETS_FINAL.doClean();
        MODEL_NOTIFY_TIMEOUT.doClean();
        MODEL_TABLE_SHOWTIPS.doClean();
        MODEL_TABLE_SHOWTASKTIPS.doClean();
        MODEL_CHARGING.doClean();
        MODEL_ASK_CHARGE.doClean();
        MODEL_CHARGED.doClean();
        // MODEL_ROUND_RESULT.doClean();
        MODEL_UPDATE_ROUNDCOUNT.doClean();

        MODEL_COUNT_DOWN.doClean();
        MODEL_READY.doClean();
	    MODEL_VOTE.doClean();
	    MODEL_CUSTOM.doClean();
	    MODEL_SIT.doClean();
        MODEL_FLOW.doClean();
	    MODEL_GRAB_GANG_HU.doClean();
	    MODEL_NOTIFY_GRAB_GANG_HU.doClean();
	    MODEL_TASK_WINSTREAK.doClean();
        MODEL_TASK_LOOPWINTIMESTASK.doClean();
        MODEL_TASK_LOOPACVIVETASK.doClean();
        if (PROXY_METHODS){
            PROXY_METHODS.destroy();
            PROXY_METHODS = null;
        }
        GLOBAL_OBJ.inStart = false;

	    cleanEffects = {};
	};

    /*
    @MVC controller生成器（工厂）*/
    var ____f_controller_producer = function( _name, _view ){
        var view   = _view;
        var name   = _name;
        var spineAni = null;

        /*
        @ 托管代理(这个要不要使用代理有待思考，因为目前来说只是一个弹窗，没有承载其他东西)*/
        var PROXY_TRUSTEE = GLOBAL_OBJ.table.proxy.Trustee.produce();

        // 吃碰杠听胡操作面板代理
        PROXY_METHODS = GLOBAL_OBJ.table.proxy.Methods.produce();
        PROXY_METHODS.boot(view.getMethodNode());

        // 自建桌投票退出代理
        var PROXY_VOTE     = GLOBAL_OBJ.table.proxy.Vote.produce();

        var PROXY_CHARGE   = GLOBAL_OBJ.table.proxy.ChargePreview.produce();

        var PROXY_ABSENCE  = GLOBAL_OBJ.table.proxy.Absence.produce();

        // 出牌函数
        var FUNCTION_DISCARD00 = function ( _mahj, _seatId, _isTing, discardModel) {

            GLOBAL_OBJ.LOGD("MAHJONG_TABLE_MODULE_FUNCTION_DISCARD_START ", " seatId:" + _seatId);

            var mahj     = _mahj;
            var seatId   = _seatId;
            var panel    = view.getPanelByLocalSeatId( _seatId );
            var discard  = view.getDiscardPanel();

            if(seatId == GLOBAL_T.MYSEAT){
                PROXY_METHODS.shut();//出牌也可以取消吃碰杠面板
            }

            panel.sayGo(); /*禁止出牌，可以选择查看*/

            discard.doRecv(seatId, mahj, false, discardModel);

            // 出牌音效
            //听的信息无论谁听都下发。但是自己的打牌不是服务器广播的，所以，会造成错误。
            if(_seatId != GLOBAL_T.MYSEAT){
                //上听的时候，播放听的音效。
                if(_isTing){
                    AUDIO.audio(AUDIO_RES.audioMethods(MODEL_USER.getSex( MODEL_TABLEINFO.getPlayer( _seatId )), "ting"), false, false);
                }else{
                    AUDIO.audio(AUDIO_RES.audioTile(MODEL_USER.getSex(MODEL_TABLEINFO.getPlayer(_seatId )), mahj.getTile()), false, false);
                }
            }else{//托管后，服务器广播中本家的出牌，需要播放音效
                AUDIO.audio(AUDIO_RES.audioTile(MODEL_USER.getSex( MODEL_TABLEINFO.getPlayer( _seatId )), mahj.getTile()), false, false);
            }

            GLOBAL_OBJ.LOGD("MAHJONG_TABLE_MODULE_FUNCTION_DISCARD_END ", " seatId:" + _seatId);
        };

        return {
            _TAG:"____f_controller_producer",
            boot:function(){
                GLOBAL_OBJ.LOGD(this._TAG, "牌桌controller启动");
                /*
                @监听协议通知&挂接消息缓存模块*/
                var E_TYPE = GLOBAL_OBJ.table.Events;

                // 牌局协议通知 
                this.doListen( MODEL_TABLEINFO, E_TYPE.UPDATE_TABLE_TABLE_INFO,  this.onRecvTableInfo, true );
                this.doListen( MODEL_SIT,       E_TYPE.UPDATE_TABLE_SIT,         this.onRecvSit,       true );
                this.doListen( MODEL_DEAL,      E_TYPE.UPDATE_TABLE_DEAL,        this.onRecvDeal,      true );
                this.doListen( MODEL_DRAW,      E_TYPE.UPDATE_TABLE_DRAW,        this.onRecvDraw,      true );
                this.doListen( MODEL_DISCARD,   E_TYPE.UPDATE_TABLE_DISCARD,     this.onRecvDiscard,   true );
                this.doListen( MODEL_CHOW,      E_TYPE.UPDATE_TABLE_CHOW,        this.onRecvChow,      true );
                this.doListen( MODEL_PONG,      E_TYPE.UPDATE_TABLE_PONG,        this.onRecvPong,      true );
                this.doListen( MODEL_KONG,      E_TYPE.UPDATE_TABLE_KONG,        this.onRecvKong,      true );
                this.doListen( MODEL_LEAVE,     E_TYPE.UPDATE_TABLE_LEAVE,       this.onRecvLeave,     true);
                this.doListen( MODEL_READY,     E_TYPE.UPDATE_TABLE_READY,       this.onRecvReady,     true);
                this.doListen( MODEL_CHAT,      E_TYPE.UPDATE_TABLE_CHAT,        this.onRecvChat,      false);
                this.doListen( MODEL_VOTE,      E_TYPE.UPDATE_TABLE_VOTE,        this.onRecvVote,      false);
                this.doListen( MODEL_TRUSTEE,   E_TYPE.UPDATE_TABLE_TRUSTEE,     this.onRecvTrustee,   true);
                this.doListen( MODEL_BUDGETS,   E_TYPE.UPDATE_TABLE_BUDGET,      this.onRecvWinLose,   true);
                this.doListen( MODEL_COUNT_DOWN,         E_TYPE.UPDATE_TABLE_COUNT_DOWN,     this.onRecvCountDown,    true);
                // 牌桌文字提示
                this.doListen( MODEL_TABLE_SHOWTIPS,     E_TYPE.UPDATE_TABLE_SHOWTIPS,       this.onRecvShowTips,     true );
                // 牌桌任务进度文字提示
                this.doListen( MODEL_TABLE_SHOWTASKTIPS, E_TYPE.UPDATE_TABLE_SHOWTASKTIPS,   this.onRecvShowTaskTips, true );
                // 抢杠胡
                this.doListen(MODEL_GRAB_GANG_HU,        E_TYPE.UPDATE_GRAB_GANG_HU,         this.onRecvGrabGangHu,   true);
                // 抢杠胡
                this.doListen(MODEL_NOTIFY_GRAB_GANG_HU, E_TYPE.UPDATE_NOTIFY_GRAB_GANG_HU,  this.onRecvNotifyGrabGangHu, true);
                // 牌桌倒计时刷新协议
                this.doListen(MODEL_NOTIFY_TIMEOUT,      E_TYPE.UPDATE_TABLE_NOTIFY_TIMEOUT, this.onRecvNotifyTimeOut, true);
                // 充值弹窗界面,其他人
                this.doListen(MODEL_CHARGING,            E_TYPE.UPDATE_TABLE_CHARGING,       this.onRecvCharging,      true);
                // 充值弹窗界面,自己
                this.doListen(MODEL_ASK_CHARGE,          E_TYPE.UPDATE_TABLE_ASK_CHARGE,     this.onRecvAskCharge,     true);
                // 充值结果广播
                this.doListen(MODEL_CHARGED,             E_TYPE.UPDATE_TABLE_CHARGD,         this.onRecvCharged,       true);
                // 刷新好友桌圈数
                this.doListen(MODEL_UPDATE_ROUNDCOUNT,   E_TYPE.UPDATE_TABLE_UPDATE_ROUNDCOUNT, this.onRecvUpdateRoundCount, true);

                // 定缺
                this.doListen(MODEL_ASK_ABSENCE,         E_TYPE.UPDATE_TABLE_ASK_ABSENCE,    this.onRecvAskAbsence, true);
                this.doListen(MODEL_ABSENCE_OWN,         E_TYPE.UPDATE_TABLE_ABSENCE_OWN,    this.onRecvAbsenceOwn, true);
                this.doListen(MODEL_ABSENCE_END,         E_TYPE.UPDATE_TABLE_ABSENCE_END,    this.onRecvAbsenceEnd, true);

                // 听牌消息
                this.doListen(MODEL_ASK_TING,            E_TYPE.UPDATE_TABLE_ASK_TING,       this.onRecvAskTing, true);
                this.doListen(MODEL_TING_STATE,          E_TYPE.UPDATE_TABLE_TING_STATE,     this.onRecvTingState, true);
                this.doListen(MODEL_TING_END,            E_TYPE.UPDATE_TABLE_TING_END,       this.onRecvTingEnd, true);

                this.doListen(MODEL_CHONG_FENG,          E_TYPE.UPDATE_TABLE_CHONG_FENG,     this.onRecvChongFeng, true);

                // 监听用户当前房间是否解散
                ty.NotificationCenter.listen(hall.EventType.MSG_ON_LOC, this.onUserInfoLoc, this);

                // 听牌流程的开始
                GLOBAL_OBJ.bkernel.utils.Notification.listen(E_TYPE.UPDATE_TABLE_TING_BEGIN, function () {
                    this.isTingOperate = true;
                }, this);

                // 听按钮点击事件
                GLOBAL_OBJ.bkernel.utils.Notification.listen(E_TYPE.UPDATE_TABLE_BTN_TING, this.doTingPreview, this);

                // 掷骰子动画
                GLOBAL_OBJ.bkernel.utils.Notification.listen(E_TYPE.UPDATE_TABLE_CRAPSHOOT, this.onRecvCrapshoot, this);
                GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.SHUT_TRUSTEE, this.onShutTrustee, this);
                // 胡牌锁住面板，不可再出牌
                GLOBAL_OBJ.bkernel.utils.Notification.listen(E_TYPE.WIN_LOCK_PANEL, this.onLockPanel, this);

                GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_PIAO_ZHUANG_COMPLETE, this.piaoZhuangComplete, this);
                
                
                GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.DO_SHOW_HU_PREVIEW, this.updateHuPreview, this);
                
                // 执行&关闭缓存消息
                GLOBAL_OBJ.bkernel.network.MsgCache.run( name );

                return this;
            },

            shut:function(){
                GLOBAL_OBJ.LOGD(this._TAG, "牌桌controller卸载");
                ty.NotificationCenter.ignore(hall.EventType.MSG_ON_LOC, this.onUserInfoLoc, this);

                GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
                GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(this);//清理超时
                GLOBAL_OBJ.bkernel.network.MsgCache.clean( name );
                
                ___f_models_clean();
            },

            onUserInfoLoc:function (larr) {
                //gameId - roomId - tableId - seatId
                if ( (larr[0] == '0') && (larr[1] == '0') && (larr[2] == '0') && (larr[3] == '0') ) { //游戏已经结束
                    if(view){
                        GLOBAL_OBJ.tableEffectPlayer.removeAllEffects();
                    }
                    // 二级子大厅
                    // GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());
                    // 金币场房间列表
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                    // hall.PluginInterface.backHall(view);
                }else{
                    GLOBAL_OBJ.businesses.network.C2S.requestGameStart(MODEL_TABLEINFO.getPlayMode(), larr[1], larr[2]);
                }
            },
            
            /*
            @监听通知，挂接消息缓存模块*/
            doListen:function(_model, _event, _callFunc, _cache){
                var that = this;
                GLOBAL_OBJ.LOGD(that._TAG," doListen start");
                if (_cache) {
                    GLOBAL_OBJ.bkernel.network.MsgCache.hook( name, _event, function( _data ){
                        GLOBAL_OBJ.LOGD(that._TAG," 执行缓存消息:"+_event+"    "+JSON.stringify(_data));
                        //将缓存的协议再次交由model层处理，model不会抛出通知（否则还会缓存）
                        //推荐model和回调隔离，当然也可以直接传参数_data给_callFunc处理，这样_callFunc就代替了model的作用了
                        if( _model.parse(_data, true) ){
                            _callFunc.call(that, {});
                        }
                    } );
                }

                //监听协议通知
                GLOBAL_OBJ.bkernel.utils.Notification.listen(_event, function(){
                    _callFunc.call(that, {});
                }, this);
            },

            /*
            @ 协议通知处理区域 */
            onRecvTableInfo:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvTableInfo start;");

                //初始化 东南西北门风
                // var sid  = MODEL_TABLEINFO.getActiveServerSeatId();
                // view.getWind().setWind(sid, (sid+1)%4, (sid+2)%4, (sid+3)%4);
                
                // 断线标记关闭
                // PROXY_OFFLINE.shut();
                view.setWaitingNodeVisible(true);//显示等待界面控件
                view.menu.setDetailState(false);

                var count= MODEL_TABLEINFO.getSeatCount();
                if (count== 2) {
                    view.getPanelByLocalSeatId(1).getRootNode().setVisible(false);
                    view.getPanelByLocalSeatId(3).getRootNode().setVisible(false);
                }

                //断线重连的牌桌恢复不会操作指向（虽然指向数据已经被更改到3号位的玩家了，因为以下for循环最后处理的就是3号位玩家）
                this.doWindUpdate(MODEL_TABLEINFO);

                var i = 0;
                var index = 0;
                var tiles;
                var localSeatId;
                var remoteSeatId;
                var userId;

                for (index; index < MODEL_TABLEINFO.getSeatCount(); ++index){
                    localSeatId   = MODEL_TABLEINFO.getPlayersLocalSeatIdByIndex(index);
                    remoteSeatId  = MODEL_TABLEINFO.getPlayersServerSeatIdByIndex(index);
                    var panel     = view.getPanelByLocalSeatId( localSeatId );

                    // 二人场本地sid是0和2
                    userId = MODEL_TABLEINFO.getPlayer(localSeatId);

                    if (null == userId || userId == 0) {
                        continue;
                    }

                    // 断线重连 玩家各种操作面板或状态恢复判断
                    // 清空手牌
                    panel.doClean();

                    // 已经入桌的玩家 恢复判断
                    GLOBAL_OBJ.LOGD(this._TAG, "已经入桌的本地玩家【"+localSeatId+":"+userId+"】恢复坐下");
                    FAKE_MSG.fakeSit( remoteSeatId, userId, { direct: true} );

                    // 托管面板 恢复判断
                    if ( GLOBAL_T.MYSEAT == localSeatId && true == MODEL_TABLEINFO.getTrustee( localSeatId ) ){
                        GLOBAL_OBJ.LOGD(this._TAG, "断线重连，本地玩家【"+localSeatId+"】恢复托管");
                        FAKE_MSG.fakeTrustee( { direct: true} );
                    }

                    // 托管面板 恢复判断
                    var trusteeState = MODEL_TABLEINFO.getTrusteeStateBySeatId( localSeatId );
                    FAKE_MSG.fakeTrusteeOther(index, trusteeState, { direct: true});

                    /*
                    发牌手牌恢复, 如果玩家已经胡牌(非本家)，不能走发牌了，因为要亮牌，亮牌是同步，发牌是异步，最后导致
                    牌还是变到unseenSlot上去了。本家赢牌后不能断线重连回来
                    */
                    if (false == MODEL_TABLEINFO.getWinnerCheck( userId ) || GLOBAL_T.MYSEAT == localSeatId) {
                        tiles = MODEL_TABLEINFO.getDealingTilesByLocalSeatId( localSeatId );
                        if ( tiles.length > 0 ) {
                            var draw = null;
                            //
                            if (tiles.length % 3 === 2) {
                                // 数据里包含了摸牌的信息
                                draw = tiles.pop();
                            }
                            GLOBAL_OBJ.LOGD(this._TAG, "断线重连，本地玩家【"+localSeatId+"】恢复手牌："+tiles);
                            FAKE_MSG.fakeDealing( tiles, remoteSeatId, { direct: true} );

                            if ( draw != null ) {
                                GLOBAL_OBJ.LOGD(this._TAG, "断线重连，本地玩家【"+localSeatId+"】恢复摸牌："+tiles);
                                FAKE_MSG.fakeDraw( draw, remoteSeatId, { direct: true}, MODEL_TABLEINFO.getRemainedCount() );
                            }
                        }else {
                            //断线重连没有手牌时,设置 menu状态为坐下等待状态
                            view.menu.setMenuState("waitting");
                        }
                    }else{
                        panel.showMahjNode();//手牌可见
                    }

                    // 弃牌区的牌恢复
                    var drops       = MODEL_TABLEINFO.getDiscardTilesByLocalSeatId( localSeatId );
                    var ting_result = MODEL_TABLEINFO.getTingResult(localSeatId);
                    for (i = 0; i < drops.length; ++i){
                        GLOBAL_OBJ.LOGD(this._TAG, "断线重连，本地玩家【"+localSeatId+"】恢复弃牌："+drops[i]);
                        FAKE_MSG.fakeDiscard( drops[i], remoteSeatId, ting_result, { direct: true} ,MODEL_TABLEINFO.getRemainedCount());
                    }

                    // 杠牌状态恢复 -> 杠的断线重连 需要等待后面的一个发牌。所以杠的要在其他之前进行伪造
                    // 吃碰站的协议下发的时候，会似的玩家再次进入操作状态。
                    var kongs = MODEL_TABLEINFO.getKongTilesByLocalSeatId( localSeatId );
                    var kongObj;
                    for (i = 0; i < kongs.length; ++i){
                        kongObj = kongs[i];
                        GLOBAL_OBJ.LOGD(this._TAG, "断线重连，本地玩家【"+localSeatId+"】恢复杠牌：{ tile : "+kongObj.tile+" pattern : "+kongObj.pattern+" style : "+kongObj.style+"}");
                        FAKE_MSG.fakeKong( kongObj, remoteSeatId, 0, { direct: true} );
                    }

                    // 吃牌状态恢复
                    var chows = MODEL_TABLEINFO.getChowTilesByLocalSeatId( localSeatId );
                    for (i = 0; i < chows.length; ++i){
                        GLOBAL_OBJ.LOGD(this._TAG, "断线重连，本地玩家【"+localSeatId+"】恢复吃牌："+chows);
                        FAKE_MSG.fakeChow( chows[i].pattern, remoteSeatId, chows[i].playerSeatId, { direct: true} );
                    }

                    // 碰牌状态恢复
                    var pongs = MODEL_TABLEINFO.getPongTilesByLocalSeatId( localSeatId );
                    for (i = 0; i < pongs.length; ++i){
                        GLOBAL_OBJ.LOGD(this._TAG, "断线重连，本地玩家【"+localSeatId+"】恢复碰牌 "+i+" ："+pongs[i]);
                        FAKE_MSG.fakePong( pongs[i].pattern, remoteSeatId, pongs[i].playerSeatId, { direct: true} );
                    }

                    /*  贵宾桌   */
                    var state = MODEL_TABLEINFO.getStateByLocalSeatId( localSeatId );
                    switch(state){
                        case "ready": //贵宾桌玩家准备状态
                        GLOBAL_OBJ.LOGD(this._TAG, "等待区已经有玩家准备，本地玩家【"+localSeatId+"】");
                        FAKE_MSG.fakeCustomReady( remoteSeatId, { direct: true} );
                        break;
                        case "waiting":
                        break;
                        case "leave":
                            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_RENSHU_LEAVE, localSeatId);
                            break;
                        case "confirm_loose":
                            this.doShowTableRenshu(localSeatId);
                            break;
                        default:
                        break;
                    }
                }

                for (index = 0; index < MODEL_TABLEINFO.getSeatCount(); ++index) {
                    // 以下操作涉及玩家信息对其他人的影响，断线重连后，需要先初始化所有人的信息后，再循环一次
                    //因为发消息是异步的，其实此处仍然有坑，但是一般情况下，应该遇不到
                    localSeatId = MODEL_TABLEINFO.getPlayersLocalSeatIdByIndex(index);
                    remoteSeatId = MODEL_TABLEINFO.getPlayersServerSeatIdByIndex(index);

                    // 二人场本地sid是0和2
                    userId = MODEL_TABLEINFO.getPlayer(localSeatId);

                    if (null == userId || userId == 0) {
                        continue;
                    }

                    // 听亮牌状态恢复
                    var tingLiangStatus = MODEL_TABLEINFO.getTingLiangByLocalSeatId(localSeatId);
                    tiles = MODEL_TABLEINFO.getLiangTilesByLocalSeatId(localSeatId,"liang");
                    
                    var winTiles = MODEL_TABLEINFO.getWinTilesByLocalSeatId(localSeatId);
                    var kouTiles = MODEL_TABLEINFO.getKouTilesByLocalSeatId(localSeatId);
                    if (tingLiangStatus) {
                        GLOBAL_OBJ.LOGD(this._TAG, "ddd  断线重连，本地玩家【" + localSeatId + "】恢复亮牌：" + JSON.stringify(tiles));
                        FAKE_MSG.fakeReadyHand(tiles, winTiles, kouTiles, remoteSeatId, { direct: true });
                    }
                }

                var vote = MODEL_TABLEINFO.getCustomTableVote();
                if (vote) {
                    GLOBAL_OBJ.LOGD(this._TAG, "断线重连，恢复投票退出");
                    FAKE_MSG.fakeVote(vote, { direct: true});
                }

                // 结算状态恢复
                for (index = 0; index < MODEL_TABLEINFO.getWinnersCount(); ++index){
                    tiles  = MODEL_TABLEINFO.getWinnerTilesInfoByLocalSeatId(index);
                    FAKE_MSG.fakeWin(
                        MODEL_TABLEINFO.getWinnerUserIdByIndex(index),
                        MODEL_TABLEINFO.getWinnerSeatIdByIndex(index),
                        MODEL_TABLEINFO.getWinnerWinModeByIndex(index),
                        tiles.tiles, tiles.chows, tiles.pongs, tiles.kongs, tiles.wonTiles,
                        MODEL_TABLEINFO.getLoserInfoByIndex(index), { direct: true} );
                }

                //恢复庄
                if (MODEL_TABLEINFO.getReconnect()){
                    //断线重连，恢复庄
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_SHOWZHUANGSPR,{});//显示庄
                }

                //恢复冲锋鸡
                if (MODEL_TABLEINFO.getChongFengJiId() >= 0){
                    var _panel = view.getPanelByLocalSeatId( MODEL_TABLEINFO.getChongFengJiId() );
                    _panel.createEffectJi(1,true);//1冲锋鸡  2责任鸡
                }

                //恢复责任鸡
                if (MODEL_TABLEINFO.getZerenJiId() >= 0){
                    var _panel = view.getPanelByLocalSeatId( MODEL_TABLEINFO.getZerenJiId() );
                    _panel.createEffectJi(2,true);//1冲锋鸡  2责任鸡
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvTableInfo end;");
            },

            doShowTableRenshu:function ( _localSeatId ) {
                var panel = view.getPanelByLocalSeatId(_localSeatId);
                panel.doShowRenShu();
            },

            /**
             * 播放开局动画
             */
            playGameBeginAnimation:function (_points) {
                var that = this;
                GLOBAL_OBJ.LOGD(that._TAG, "playGameBeginAnimation start;");

                AUDIO.audio( GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_GAME_START_MP3 );
                GLOBAL_OBJ.tableEffectPlayer.play(
                    view.getEffectNode(),
                    GLOBAL_OBJ.RES.XZ_ZM_TX_KAIJU4_CCBI,
                    cc.p(0,0),
                    function(_animate){

                        var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
                        var fuwufei = "";
                        if(!isCreate){
                            fuwufei = "本局服务费:免费";
                            var ff = MODEL_TABLEINFO.getServerFee();
                            if(ff){
                                fuwufei = "本局服务费:" + ff;
                            }
                        }
                        _animate.fwf_bg.setVisible(!isCreate);
                        _animate.fuwufei.setString(fuwufei);
                        view.wind.wind_shaizi.setVisible(false);
                        var headerNode, sid, uid;
                        var playerCount = MODEL_TABLEINFO.getSeatCount();
                        for(var i = 0 ; i < playerCount; ++i){
                            sid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                            uid = MODEL_TABLEINFO.getPlayer(sid);
                            _animate['headLayer_'+sid].setVisible(true);
                            headerNode = _animate["yxks_head" + sid];

                            GLOBAL_OBJ.businesses.modules.User.Portrait.produce(uid, GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, headerNode);
                            headerNode.setScale(1.9);
                        }
                    },
                    function(_animate){
                        that.shaiziPointFun(_points);
                        var headerNode;
                        for(var i = 0 ; i < 4; ++i){
                            headerNode = _animate["yxks_head" + i];
                            headerNode.removeAllChildren();
                        }
                        if (MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Match)
                        {
                            var curDes = MODEL_MATCH.getCurDes();
                            if (curDes) {
                                // GLOBAL_OBJ.LOGD(that._TAG, "playGameBeginAnimation curDes = " + JSON.stringify(curDes));
                                if (curDes.type == GLOBAL_OBJ.MatchType.quick_upgrade_match){
                                    //如果是比赛场(快速赛)，要添加开桌说明动画
                                    GLOBAL_OBJ.tableEffectPlayer.play(
                                        view.getRootNode(),
                                        // view.getEffectNode(),
                                        GLOBAL_OBJ.RES.MAHJ_MATCH_TABLE_SHOW_CCBI,
                                        cc.p(0,0),
                                        function(_ani){
                                            GLOBAL_OBJ.LOGD(that._TAG, "playGameBeginAnimation 如果是比赛场(快速赛)，要添加开桌说明动画 ");
                                            var curWaitingInfo = MODEL_MATCH.getCurWaitInfo();
                                            var cardCount = curWaitingInfo.cardCount;
                                            GLOBAL_FUNCS.textureChange(_ani['txtCardCount'], GLOBAL_OBJ.RES['MAHJ_MATCH_NUM_' + cardCount + '_PNG']);

                                            var isFinalMatch = MODEL_MATCH.isFinalMatch(curWaitingInfo.roomId, curWaitingInfo.matchId, curWaitingInfo.stageIndex);

                                            _ani['nodeMatch0'].setVisible(!isFinalMatch);
                                            _ani['nodeMatch1'].setVisible(isFinalMatch);

                                        },
                                        function(_ani){
                                        },
                                        false
                                    );
                                }
                                else if (curDes.type == GLOBAL_OBJ.MatchType.arena_match){
                                    //如果是比赛场(快速赛)，要添加开桌说明动画
                                    GLOBAL_OBJ.tableEffectPlayer.play(
                                        view.getRootNode(),
                                        // view.getEffectNode(),
                                        GLOBAL_OBJ.RES.MAHJ_MATCH_TABLE_SHOW_ARENA_CCBI,
                                        cc.p(0,0),
                                        function(_ani){

                                            var curWaitingInfo = MODEL_MATCH.getCurWaitInfo();
                                            // GLOBAL_OBJ.LOGD(that._TAG, "playGameBeginAnimation curWaitingInfo = " + JSON.stringify(curWaitingInfo));
                                            var cardCount = curWaitingInfo.cardCount;
                                            GLOBAL_FUNCS.textureChange(_ani['txtCardCount'], GLOBAL_OBJ.RES['MAHJ_MATCH_NUM_' + cardCount + '_PNG']);

                                            var isFinalMatch = MODEL_MATCH.isFinalMatch(curWaitingInfo.roomId, curWaitingInfo.matchId, curWaitingInfo.stageIndex);

                                            _ani['nodeMatch0'].setVisible(!isFinalMatch);
                                            _ani['nodeMatch1'].setVisible(isFinalMatch);

                                            if (!isFinalMatch){
                                                var rizeCount = 0;
                                                var stageObj;
                                                for (var i = 0; i < curDes.stages.length; i++){
                                                    stageObj = curDes.stages[i];
                                                    if (curWaitingInfo.stageIndex == stageObj.index){
                                                        rizeCount = stageObj.riseUserCount;
                                                        break;
                                                    }
                                                }

                                                _ani['txtRank'].setString(rizeCount + '');
                                                _ani['nodeEnd'].x = _ani['txtRank'].x + _ani['txtRank'].width;
                                                _ani['nodeTxt'].width = _ani['nodeEnd'].x + _ani['nodeEnd'].width;
                                            }
                                        },
                                        function(_ani){
                                        },
                                        false
                                    );
                                }
                            }

                        }
                        // GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_SHOWZHUANGSPR,{});//显示庄

                    },
                    false
                );

                GLOBAL_OBJ.LOGD(this._TAG, "playGameBeginAnimation end;");
            },

            /**
             * 骰子动画
             */
            shaiziPointFun:function (_points) {

                var self  = this;
                var _scene  = view;
                var _parent = _scene.windNode;
                _parent.setVisible(true);
                _scene.wind.counterLabel.setVisible(false);

                var getShaiZiPint = function ( _num ) {
                    var pointImg;
                    switch(_points[_num]) {
                        case 1:
                            pointImg = GLOBAL_OBJ.RES.XLMJ_ZM_TX_HAIZID1_PNG;
                            break;
                        case 2:
                            pointImg = GLOBAL_OBJ.RES.XLMJ_ZM_TX_HAIZID2_PNG;
                            break;
                        case 3:
                            pointImg = GLOBAL_OBJ.RES.XLMJ_ZM_TX_HAIZID3_PNG;
                            break;
                        case 4:
                            pointImg = GLOBAL_OBJ.RES.XLMJ_ZM_TX_HAIZID4_PNG;
                            break;
                        case 5:
                            pointImg = GLOBAL_OBJ.RES.XLMJ_ZM_TX_HAIZID5_PNG;
                            break;
                        case 6:
                            pointImg = GLOBAL_OBJ.RES.XLMJ_ZM_TX_HAIZID6_PNG;
                            break;
                        default:
                            pointImg = GLOBAL_OBJ.RES.XLMJ_ZM_TX_HAIZID1_PNG;
                            break;
                    }
                    return pointImg;
                };

                // GLOBAL_OBJ.LOGD("shaiziPointFun!!!!!", JSON.stringify(_points));
                cleanEffects["shaiziAni"] = GLOBAL_OBJ.tableEffectPlayer.play(
                    _parent,
                    GLOBAL_OBJ.RES.XZ_ZM_TX_SHAIZI_CCBI,
                    cc.p(0, 0),
                    function(_animate){
                        AUDIO.audio(GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_CARD_DICE_MP3);
                        var shaizi_1 = getShaiZiPint(0);
                        var shaizi_2 = getShaiZiPint(1);
                        GLOBAL_FUNCS.textureChange(_animate.shaiziPoint_1, shaizi_1);
                        GLOBAL_FUNCS.textureChange(_animate.shaiziPoint_2, shaizi_2);
                    },
                    function(){
                        _scene.wind.counterLabel.setVisible(true);
                        //漂庄。。。。
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_PIAO_ZHUANG,null);
                    },
                    false
                );
            },

            piaoZhuangComplete:function () {
                this.playDealAni();
            },

            // 播放发牌动画
            playDealAni:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "playDeal_Ani start;");

                var self = this;
                var mjTiles = MODEL_DEAL.getTiles();
                if (mjTiles) {
                    mjTiles.sort(function(a, b) {
                        return a > b;
                    });
                }
                var showTips    = view.getTipsNode();

                // 发牌动画
                var count = MODEL_TABLEINFO.getSeatCount();
                GLOBAL_OBJ.tableEffectPlayer.play(
                    view.getDealingNode(),
                    GLOBAL_OBJ.RES.TABLE_DEALING_CCBI,
                    cc.p(0, 0),
                    function(_animate){
                        // 发牌音效
                        _animate.bottomNode.scheduleOnce(function() {
                            AUDIO.audio(GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_FAPAI_MP3);
                        },0.36);

                        if (count == 2) {
                            _animate.rightNode.setVisible(false);
                            _animate.leftNode.setVisible(false);
                        } else if (count == 3) {
                            _animate.topNode.setVisible(false);
                        }

                        _animate.rightNode.setScale(GLOBAL_FUNCS.autoScaleFactor());
                        _animate.leftNode.setScale(GLOBAL_FUNCS.autoScaleFactor());
                        _animate.topNode.setScale(GLOBAL_FUNCS.autoScaleFactor());
                        _animate.bottomNode.setScale(GLOBAL_FUNCS.autoScaleFactor());

                        if (mjTiles && mjTiles.length > 1) {
                            for (var i = 1; i <= 13; i++) {
                                var tiesColor = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_" + mjTiles[i-1] + "_PNG";
                                GLOBAL_FUNCS.textureChange(_animate["own_mj_" + i], GLOBAL_OBJ.RES[tiesColor]);
                            }
                        }
                    },
                    function(_animate){
                        self.initOtherUserMahjs();
                        showTips.setVisible(true);

                        // 播放完发牌特效后让手牌可见
                        var panels = view.panels;
                        for (var key in panels) {
                            panels[key].unseenNode.setVisible(true);

                            // 二人麻将,三人麻将分别隐藏不存在玩家的手牌node(三人桌隐藏对面玩家)
                            if (panels[key].getPortraitNode().getChildrenCount() == 0) {
                                panels[key].unseenNode.setVisible(false);
                            }
                        }
                        var panel = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                        panel.doUnlock();

                        GLOBAL_OBJ.inStart = false;
                        PROXY_METHODS.show();

                        // 如果自己是庄家，显示优先出牌的TIPS
                        if (GLOBAL_T.MYSEAT == MODEL_TABLEINFO.getBankerSeatId()){
                            view.showBankerPlayTips();
                        }
                    },
                    false
                );

                GLOBAL_OBJ.LOGD(this._TAG, "playDeal_Ani end;");
            },

            // 掷骰子动画
            onRecvCrapshoot:function(_points)
            {
                GLOBAL_OBJ.inStart = true;
                GLOBAL_OBJ.LOGD("onRecvCrapshoot!!!");
                view.setWaitingNodeVisible("BeginGame");
                this.playGameBeginAnimation(_points);

                view.tipNode.setVisible(false);
            },

            onRecvNotifyTimeOut:function () {//刷新牌桌倒计时
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvNotifyTimeOut start;");
                var windView    = view.getWind();
                var timeout     = MODEL_NOTIFY_TIMEOUT.getNotifyTimeOut();
                var times       = MODEL_NOTIFY_TIMEOUT.getNotifyTimes();
                var activitySeatId = MODEL_NOTIFY_TIMEOUT.getNotifyTimeActivitySeatId();
                GLOBAL_OBJ.LOGD("onRecvNotifyTimeOut   timeout=", timeout + "  times=" + times + "activitySeatId=" + activitySeatId);

                windView.updateNotifyTimeOut(activitySeatId, timeout, times);//风门倒计时
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvNotifyTimeOut end;");
            },

            // 提示打牌文字信息(提示打出万，筒，条这个是跟随下大雨蒙版一起出现的，服务器做了判断，如果存在下大雨，就不会发showtips协议下来，这样就不会冲突了)
            onRecvShowTips:function()
            {
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvShowTips start;");
                var myPanel = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                var node = view.getTipsNode();
                node.setVisible(true);
                myPanel.doShowTips( view.getTipsNode() );
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvShowTips end;");
            },

            onRecvShowTaskTips:function()
            {
                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_ShowTaskTips start;");

                // var task_txt_1 = MODEL_TABLE_SHOWTASKTIPS.getLoopTaskInfo();
                // var task_txt_2 = MODEL_TABLE_SHOWTASKTIPS.getLoopWinTimesInfo();
                // var task_txt_3 = MODEL_TABLE_SHOWTASKTIPS.getWinStreakInfo();
                // // task_txt_1 = "10连胜:6000金币";
                // // task_txt_2 = "玩2/6局:600金币";
                // // task_txt_3 = "赢2/4:6奖券";
                //
                // var task_txt = [];
                // if(task_txt_1.length > 0){
                //     task_txt.push(task_txt_1);
                // }
                // if(task_txt_2.length > 0){
                //     task_txt.push(task_txt_2);
                // }
                // if(task_txt_3.length > 0){
                //     task_txt.push(task_txt_3);
                // }
                //
                // var hasTasks = task_txt.length > 0;
                // view['table_task_node'].setVisible(hasTasks);
                // view['table_task_txt_bg'].setVisible(hasTasks);
                //
                // var detailData  = MODEL_TABLE_SHOWTASKTIPS.getStreakAllDescInfo();
                // var dataNum 	= detailData.length;
                // view['taskBtn'].setVisible(dataNum > 0);
                //
                // for(var i = 0; i < task_txt.length; i++){
                //     view["table_task_" + (i + 1)].setVisible(true);
                //     view["table_task_" + (i + 1) + "_" + (i + 1)].setVisible(true);
                //
                //     var txtArr = task_txt[i].split(":");
                //     view["table_task_" + (i + 1)].setString(txtArr[0] + ":");
                //     view["table_task_" + (i + 1) + "_" + (i + 1)].setString(txtArr[1]);
                //     var length1 = view["table_task_" + (i + 1)].getBoundingBox().width;
                //     GLOBAL_OBJ.LOGD("onRecvShowTaskTips_length1==:", length1);
                //     view["table_task_" + (i + 1) + "_" + (i + 1)].setPositionX(length1);
                // }

                var detailData = MODEL_TABLE_SHOWTASKTIPS.getStreakAllDescInfo();
                if(detailData && detailData.length > 0){
                    view.taskBtn.setVisible(true);//任务按钮
                }else{
                    view.taskBtn.setVisible(false);//任务按钮
                }
                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_ShowTaskTips end;");
            },

            doShutShowTips:function() {
                GLOBAL_OBJ.LOGD(this._TAG, "doShutShowTips start;");
                var myPanel = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                myPanel.doShutShowTips();
                // view.onLayerEnable();
                GLOBAL_OBJ.LOGD(this._TAG, "doShutShowTips end;");
            },

            updateHuPreview:function(param) {
                var myPanel  = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                var tingState = myPanel.getLocalTingState();
                if (tingState) {
                    return;
                }
                var _mahj = param._mahj;
                var isShow = param.isShow;
                var tipPanelNode = view.getTipPanelNode();
                GLOBAL_OBJ.LOGD(this._TAG, "updateHuPreview isShow = " + isShow);
                if (isShow === false) {
                    tipPanelNode.setVisible(isShow || false);//
                    return
                }
                var _tile = _mahj.getTile();

                if (myPanel.checkCanOut()) {
                    var huData = MODEL_DRAW.getHuAction();
                    var _isTing = MODEL_DRAW.isReadyHand();
                    // view.tipPanel.setHudata(huData);
                    if (huData[_tile] && _isTing == 0) {
                        myPanel.hideTingTips();
                        view.tips_hu.setVisible(true);
                        view.btnEnable.setVisible(false);
                        myPanel.hideTingTips();
                        view.tipPanel.update(huData[_tile]);
                        var isMethod = myPanel.getOwnIsMethod();
                        var offY = 100 * isMethod;
                        view.tipPanel.updatePos(offY);
                    }else {
                        tipPanelNode.setVisible(false);
                    }
                }
            },

            /*
             * 抢杠胡
             * */
            onRecvGrabGangHu:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvGrabGangHu start;");

                var ganghuTile   = MODEL_GRAB_GANG_HU.getGrabHuTile();
                var playerSeatId = MODEL_GRAB_GANG_HU.getGrabPlayerSeatId();//被抢杠胡玩家的本地座位号
                var panel        = view.getPanelByLocalSeatId(playerSeatId);

                //添加出牌放大的动画效果
                var ccp = panel.getEffectPoint();
                if (playerSeatId == GLOBAL_T.MYSEAT)
                {
                    ccp.y = ccp.y + 80;
                }

                var ani = function(){
                    GLOBAL_OBJ.bkernel.utils.Animation.play(
                        panel.getEffectNodeWorld(),
                        GLOBAL_OBJ.RES.TABLE_DROPCARD_VIEW_CCBI,
                        ccp,
                        function(_animate){
                            var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_" + ganghuTile + "_PNG";
                            GLOBAL_FUNCS.textureChange( _animate.imgTile, GLOBAL_OBJ.RES[res] );
                        },
                        function(_animate){},
                        false);
                };
                ani();

                // 检验是否有“吃碰杠听胡”等操作
                this.doMethods( MODEL_GRAB_GANG_HU, MODEL_GRAB_GANG_HU.getMethods() );
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvGrabGangHu end;");
            },

            /*
            * 抢杠胡结果广播
            * */
            onRecvNotifyGrabGangHu:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvNotifyGrabGangHu start;");

                var localSeatId = MODEL_NOTIFY_GRAB_GANG_HU.getNotifyGrabSeatId();
                var grabTile    = MODEL_NOTIFY_GRAB_GANG_HU.getNotifyGrabHuTile();
                var panel       = view.getPanelByLocalSeatId(localSeatId);
                if(localSeatId == GLOBAL_T.MYSEAT){//如果是自己，则删除被抢杠的手牌
                    this.doShutShowTips();//取消牌桌提示tips
                    panel.pteShortenMahjsTeamByTile( grabTile );//这里是续杠的处理，抢杠胡就会删除手中那张要续杠的牌
                    GLOBAL_OBJ.table.global.tableMethodState = 0; //取消等待框状态
                }else{//其他玩家显示删除一张牌
                    panel.pteShortenMahjsTeamOfOne();
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvNotifyGrabGangHu end;");
            },

            onRecvCountDown:function(){
                /*
                cmd: count_down
                */
            },

            onRecvReady:function(){
                /*
                cmd: ready
                */
            },

            onRecvSit:function(){
                /*
                cmd: sit
                */
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvSit start;");
                var seatId = MODEL_SIT.getActiveLocalSeatId();
                var userId = MODEL_SIT.getUserIdByLocalSeatId(seatId);
                var panel  = view.getPanelByLocalSeatId( seatId );
                panel.doSit( userId, function(){
                    var parView = view.getUserCardNode();
                    if (parView.getChildrenCount() > 0) {
                        return;
                    }
                    
                    var headPos = view.getSeatPositionByLocalSeatId(seatId);
                    var chat_cd_time = view.getChat_Time();
                    var set_CD_time  = function ( _second ) {
                        view.setChat_Time(_second);
                    }
                    GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_USER_CARD,
                        { uid: userId, sid: seatId, pos: headPos, cdtime: chat_cd_time, setTimeFunc: set_CD_time }, parView );
                } ); //玩家坐下

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvSit end;");
            },

            /*
             离桌
             客户端不做处理*/
            onRecvLeave:function(){
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvLeave start;");

                var sid     = MODEL_LEAVE.getActiveLocalSeatId();   //离桌人的sid
                var reson   = MODEL_LEAVE.getUserLeaveReson();
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvLeave_data :   sid:" + sid + "   reson:" + reson);
                if (GLOBAL_T.MYSEAT == sid) {
                    var mypanel  = view.getPanelByLocalSeatId( GLOBAL_T.MYSEAT );

                    switch (reson){
                        case "friendTableOwnerLeave":    // 自建桌房主离开
                            // 返回子大厅
                            //GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());

                            // 返回金币场房间列表
                            GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                            break;

                        case "friendTablePlayerLeave":    // 自建桌玩家离开
                            // 返回子大厅
                            //GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());

                            // 返回金币场房间列表
                            GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                            break;

                        case "readyTimeOut"://自建桌准备时间超时
                            // 5.1大厅没有公共弹窗，为了做兼容，这里改用游戏内弹窗
                            var cmds = {
                                "cmd":"majiang_todotasks",
                                "result":{
                                    "userId": hall.AccountInfo.UserID,
                                    "gameId": GLOBAL_OBJ.GAMEID,
                                    "tasks":[
                                        {
                                            "action":"pop_general_box",
                                            "params":{
                                                "content":"缺角打不起来，约好好友再来开房吧！房间将被关闭，开房卡将被退回",
                                                "buttons":[
                                                    {
                                                        "content":"确定",
                                                        "tasks":[
                                                            {
                                                                "action":"jump_to_second_hall",
                                                                "params":{
                                                                    "playMode":MODEL_TABLEINFO.getPlayMode()
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
                            break;

                        case "noOptionTimeOut"://长时间无操作超时
                            //GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());
                            GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                            break;

                        case "friendTableDissolve"://自建桌解散，不做处理，因为需要显示大结算
                            break;

                        case "autoDecide"://金币桌托管离开，目前不做处理  捉鸡麻将在结算界面倒计时结束时做处理
                            // var cmds = {
                            //     "cmd":"majiang_todotasks",
                            //     "result":{
                            //         "userId": hall.AccountInfo.UserID,
                            //         "gameId": GLOBAL_OBJ.GAMEID,
                            //         "tasks":[
                            //             {
                            //                 "action":"pop_general_box",
                            //                 "params":{
                            //                     "content":"由于您的托管行为，该房间已解散，为了您的账号安全，您即将返回大厅",
                            //                     "buttons":[
                            //                         {
                            //                             "content":"确定",
                            //                             "tasks":[
                            //                                 {
                            //                                     "action":"jump_to_second_hall",
                            //                                     "params":{
                            //                                         "playMode":MODEL_TABLEINFO.getPlayMode()
                            //                                     }
                            //                                 }
                            //                             ]
                            //                         }
                            //                     ]
                            //                 }
                            //             }
                            //         ]
                            //     }
                            // };
                            // ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                            break;

                        case "chipNotEnough"://金币不足
                            break;

                        case "isRobot"://机器人
                            break;

                        case "isConfirmLoose"://认输
                            var callback = function () {
                                var cmds = {
                                    "cmd":"majiang_todotasks",
                                    "result":{
                                        "userId": hall.AccountInfo.UserID,
                                        "gameId": GLOBAL_OBJ.GAMEID,
                                        "tasks":[
                                            {
                                                "action":"pop_general_box",
                                                "params":{
                                                    "content":"为你的牌技点赞~但还是差了一点的小运气，听说免费金币场中有增加运气的宝典哦！",
                                                    "buttons":[
                                                        {
                                                            "content":"确定",
                                                            "tasks":[
                                                                {
                                                                    "action":"jump_to_second_hall",
                                                                    "params":{
                                                                        "playMode":MODEL_TABLEINFO.getPlayMode()
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
                            }
                            callback();
                            // GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode(), callback);
                            break;

                        case "leave"://用户手点离开
                            var ishds    = mypanel.getPanelOwnIsHDS();//通过点击换对手离开的
                            var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
                            GLOBAL_OBJ.LOGD("onRecvLeave_ishds :", ishds);
                            if(ishds && !isCreate){//金币场，自己先胡了，弹出 换对手、继续 按钮，点击换对手的前端标记
                                //流程是这样的，前端点击换对手，先向后端发送leave，等返回leave，
                                //就通过ishds判断是不是通过点击换对手过来的，如果是就在发quick_start
                                mypanel.setPanelOwnIsHDS(false);
                                GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin(
                                    MODEL_TABLEINFO.getPlayMode(),
                                    MODEL_TABLEINFO.getRoomId()
                                );
                            }else{
                                if(isCreate){
                                    var callback = function () {
                                        var cmds = {
                                            "cmd":"majiang_todotasks",
                                            "result":{
                                                "userId": hall.AccountInfo.UserID,
                                                "gameId": GLOBAL_OBJ.GAMEID,
                                                "tasks":[
                                                    {
                                                        "action":"pop_general_box",
                                                        "params":{
                                                            "content":"即将返回大厅，请合理安排游戏时间",
                                                            "buttons":[
                                                                {
                                                                    "content":"确定",
                                                                    "tasks":[
                                                                        {
                                                                            "action":"jump_to_second_hall",
                                                                            "params":{
                                                                                "playMode":MODEL_TABLEINFO.getPlayMode()
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
                                    }
                                    callback();
                                }else{
                                    //GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());
                                    GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                                }
                            }
                            break;

                        case "doTableManage"://管理工具踢出
                            //GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());
                            GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                            break;

                        case "tableCallErr"://牌桌出现错误
                            //GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());
                            GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                            break;

                        case "coinTableFinish"://金币桌牌桌结束，用户离桌，重新组桌
                            break;

                        case "normalReadyTimeOut"://金币场未准备超时踢出.
                            // ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                            //     text:"因操作超时，牌桌已被解散",
                            //     duration:3
                            // });

                            //结算界面断线重连没有收到结算消息,重连回来卡死在开始界面内,这里强制退出
                            if (mypanel.mahjs.length === 0)
                            {
                                GLOBAL_OBJ.LOGD(this._TAG, "onRecvLeave mypanel.mahjs.length === 0;");
                                GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
                            }
                            break;

                        default:
                            break;
                    }
                }else{
                    var panel       = view.getPanelByLocalSeatId( sid );
                    if(view.menu){
                        var tableState  = view.menu.getMenuState();
                        GLOBAL_OBJ.LOGD("other_user_leave_tableMenu_state :" + tableState);
                        panel.doLeaveSitTrigger(reson, sid, tableState);
                    }
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvLeave end;");
            },

            onRecvDeal:function () {
                /*
                cmd: init_tiles
                a.发第一手牌：本家初始化13张牌，其他玩家初始化13张0号牌
                服务器只对本家下发一次init_tiles协议，需要客户端帮其他玩家初始化13张牌

                b.断线重连第一手牌：本家初始化n张牌，其他玩家初始化n张牌
                tableinfo里standup_tiles会带上玩家的现有牌数，如果其他玩家没亮牌，则全是0.
                */

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvDeal start;");

                GLOBAL_OBJ.table.modules.static.HAVELIANG = [];

                view.setWaitingNodeVisible(false);//隐藏掉等待界面控件

                var fake  = MODEL_DEAL.getFakeMsg();
                var panel = null;
                if (true == fake.direct) {
                    var activiteId = MODEL_DEAL.getActiveLocalSeatId();
                    panel = view.getPanelByLocalSeatId( activiteId );
                    // panel.sayReady("LOCK"); /*禁止出牌，可以选择查看*/
                    panel.sayGo();
                    panel.showMahjNode();
                    var mjTiles = MODEL_DEAL.getTiles();//初始化手牌数据
                    if(mjTiles == null || (mjTiles && mjTiles.length < 1)){
                        ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                            text:"由于网络原因导致初始化手牌失败，请重新登录 ",
                            duration:2
                        });
                    }

                    panel.doDealing(
                        mjTiles,
                        function(){
                            panel.sayGo();/* 禁止出牌，可以选择查看*/
                        },
                        FUNCTION_DISCARD00 
                    );
                }else{
                    var showTips    = view.getTipsNode();
                    showTips.setVisible(false);//开局有可能就有牌桌文字提示，所以发牌时先隐藏，播放完特效在可见

                    //给自己创建手牌
                    panel = view.getPanelByLocalSeatId( GLOBAL_T.MYSEAT );
                    panel.doLock();
                    if (GLOBAL_OBJ.inStart){
                        // 正在走开局流程，不显示操作面板。
                        panel['unseenNode'].setVisible(false);//隐藏自己手牌，播放完发牌动画在显示出来
                    }

                    var mjTiles = MODEL_DEAL.getTiles();//初始化手牌数据
                    if(mjTiles == null || (mjTiles && mjTiles.length < 1)){
                        ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                            text:"由于网络原因导致初始化手牌失败，请重新登录 ",
                            duration:2
                        });
                    }
                    panel.doDealing(
                        mjTiles,
                        function(){
                            panel.sayGo();/* 禁止出牌，可以选择查看*/
                        },
                        FUNCTION_DISCARD00
                    );
                    panel.showMahjNode();
                    panel.sayGo();

                    // panel['unseenNode'].setVisible(false);
                    GLOBAL_OBJ.LOGD("zhelishirangzijishoupaikejian_1216:");
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvDeal end;");
            },

            /**
             * 创建其它玩家手牌，因为其它玩家手牌重要度不高，可以在播放完发牌动画后再进行创建，这样可以把性能消耗推迟，使发牌动画流畅播放。
             */
            initOtherUserMahjs:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "initOtherUserMahjs start;");

                var panel;
                //给其他玩家发13张牌
                var panels = view.getPanelsExceptLocalSeatId( GLOBAL_T.MYSEAT );
                for(var i in panels){
                    panel = panels[i];
                    panel['unseenNode'].setVisible(false);//隐藏其他玩家手牌，播放完发牌动画在显示出来
                    panel.doDealing([0,0,0,0,0,0,0,0,0,0,0,0,0], function(){}, FUNCTION_DISCARD00 );
                    panel.showMahjNode();
                }

                GLOBAL_OBJ.LOGD(this._TAG, "initOtherUserMahjs end;");
            },

            onShutTrustee:function()
            {
                GLOBAL_OBJ.LOGD(this._TAG, "onShutTrustee start;");
                PROXY_TRUSTEE.shut();
                GLOBAL_OBJ.LOGD(this._TAG, "onShutTrustee end;");
            },
            
            // 查胡预览
            onCheckHu:function(_model,sid) {
                GLOBAL_OBJ.LOGD(this._TAG, "onCheckHu ");
                // 查胡
                var huData = _model.getHuAction();
                var _isTing = _model.isReadyHand();

                if (sid === GLOBAL_T.MYSEAT && _isTing == 0) {
                    var panel   = view.getPanelByLocalSeatId(sid);
                    var tingState = panel.getLocalTingState();
                    if (!tingState) {
                        panel.doDisCardPreview(huData);     // 查胡 添加出牌箭头
                    }
                }
            },

            onRecvDraw:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_Draw start");

                this.doWindUpdate( MODEL_DRAW );
                this.doShutShowTips(); // 隐藏tips提示
                var sid = MODEL_DRAW.getActiveLocalSeatId();
                var panel   = view.getPanelByLocalSeatId(sid);
                var discard = view.getDiscardPanel();

                discard.doClean(); // 清理 弃牌区 弃牌 记录

                //当前玩家手牌检查
                var fake = MODEL_DRAW.getFakeMsg();

                var tiles = MODEL_DRAW.getTiles();
                if (tiles.length > 0) {
                    var errors  = panel.doTilesCheck(tiles);
                    for(var i = 0; i < errors.length; ++i){
                        discard.doRecv(sid, errors[i], true);
                    }
                }
                
                AUDIO.audio( GLOBAL_OBJ.RES.UI_SENDTILE_MP3 );

                panel.doDrawing( MODEL_DRAW.getTile(), fake.direct, function(){
                    // 可以出牌，禁止选择查看
                    panel.sayGo();
                }, FUNCTION_DISCARD00 );

                panel.sayGo();

                var absenceColor = MODEL_ABSENCE_END.getMyAbsenceColor();
                if (MODEL_DRAW.getActiveLocalSeatId() == GLOBAL_T.MYSEAT && absenceColor != null) {
                    panel.doMarkAbsenceTiles(absenceColor);
                }

                if (sid === GLOBAL_T.MYSEAT) {
                    view.tipNodeBtn.setVisible(false);  // 隐藏灯牌提示按钮
                }

                this.onCheckHu(MODEL_DRAW,sid); // 查胡预览

                // 检验是否有“吃碰杠听胡”等操作
                this.doMethods(MODEL_DRAW, MODEL_DRAW.getMethods());
                if (GLOBAL_OBJ.inStart){
                    // 正在走开局流程，不显示操作面板。
                    PROXY_METHODS.hide();
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_Draw end;");
            },
            

            onRecvDiscard:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_Discard start;");

                var that     = this;
                var fake     = MODEL_DISCARD.getFakeMsg();
                var sid      = MODEL_DISCARD.getActiveLocalSeatId(); //打牌人的本地sid
                var panel    = view.getPanelByLocalSeatId( sid );
                var discard  = view.getDiscardPanel();
                var myPanel  = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);

                if(sid == GLOBAL_T.MYSEAT){
                    this.doShutShowTips(); // 出牌就取消牌桌提示tips
                    view.onLayerEnable();
                    // 出牌后，取消麻将听状态
                    myPanel.doCancelTingPreview();
                }

                if ( true == fake.direct ) {
                    //来自断线重连，恢复弃牌区
                    var mah = GLOBAL_OBJ.table.modules.Mahjong.produce( MODEL_DISCARD.getTile(), sid);
                    discard.doRecv(sid, mah, true);

                }else{
                    /*
                    玩家“打出一张牌”的操作不受服务器控制，本家打出一张牌时，弃牌直接打到弃牌区，且同时请求服务器
                    告知弃牌操作。
                    这个时候存在两种情况，服务器收到玩家的弃牌请求或者没有收到玩家的弃牌请求（服务器托管代替出一张牌）
                    */
                    if (discard.getDrop( sid ) != null){
                        GLOBAL_OBJ.LOGD(this._TAG, "onRecvDiscard  discard.getDrop( sid ) != null");
                        /*
                        弃牌区有弃牌时，进行校验，是否花色一致 （本家）*/
                        var dropTile = discard.getDrop( sid ).getTile();
                        if (true == discard.doDiscardCheck( MODEL_DISCARD.getTile(), sid )){
                            /*
                            校验未通过（玩家出的牌服务器没有收到，所以服务器托管出的牌和玩家出的牌花色不一致，所以需要纠正）
                            弃牌直接纠正花色，然后从玩家手中的牌中找一张弃牌的花色替换为之前弃牌区错误的弃牌花色即可。*/
                            panel.doDiscardCheck(dropTile, MODEL_DISCARD.getTile());
                        }

                    }else{
                        GLOBAL_OBJ.LOGD(this._TAG, "onRecvDiscard  discard.getDrop( sid ) == null");
                        /*
                        弃牌区没有弃牌（协议驱动弃牌，根据花色找寻手牌中第一个相同花色的牌）；默认从牌首出一张牌 （其他玩家）
                        本家应该处于托管状态
                        */
                        //检验是否有“吃碰杠听胡”等操作
                        panel.doDiscard(MODEL_DISCARD.getKey(), MODEL_DISCARD.getTile(), function(_mahj, _seatId){
                            /*
                            @此时执行吃碰杠面板是在打牌操作完毕之后进行的，
                            如果托管时，服务器可能立即就会下发摸牌协议，如果摸牌协议里有吃碰杠信息，那么等play异步执行
                            完毕后该处吃碰杠的判断也会是true，所以会导致吃碰杠面板会弹出2次*/
                            if(that.doMethods(MODEL_DISCARD, MODEL_DISCARD.getMethods(), true)){
                                //有“吃碰杠听胡”等操作时，门风要切换哦
                                that.doWindUpdate(MODEL_DISCARD, true);
                            }
                            else{
                                if (MODEL_DISCARD.getHasAction()){
                                    //有人关注这张牌，风门不在闪，重置倒计时
                                    // GLOBAL_OBJ.LOGD("gaga","有人关注这张牌，风门不在闪，重置倒计时 :" + MODEL_DISCARD.getTimeOut());
                                    view.getWind().showAction(MODEL_DISCARD.getTimeOut());
                                }
                            }
                            //弃牌区收牌
                            FUNCTION_DISCARD00(_mahj, _seatId, false , MODEL_DISCARD);
                        });
                    }
                }

                // 冲锋鸡
                if (MODEL_DISCARD.isChongFengJi()) {
                    GLOBAL_OBJ.LOGD(this._TAG, "isChongFengJi 冲锋鸡");
                    panel.createEffectJi(1);    // 1冲锋鸡  2责任鸡
                }
                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_Discard end;");
            },

            onRecvChow:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvChow start;");

                /*
                cmd: chi
                吃牌操作，有可能来自断线重连的模拟协议，此时是没有actionId的 */
                var fake    = MODEL_CHOW.getFakeMsg(); //是否是模拟消息（from 断线重连）
                var panel   = view.getPanelByLocalSeatId(MODEL_CHOW.getActiveLocalSeatId());
                var passiveLocalSeatId = MODEL_CHOW.getPassiveLocalSeatId();
                var activeLocalSeatId  = MODEL_CHOW.getActiveLocalSeatId();
                var discard = view.getDiscardPanel();
                var drop    = discard.doMethods( passiveLocalSeatId );

                //恢复牌桌不操控指向
                if (!fake.direct) {
                    this.doWindUpdate(MODEL_CHOW);
                }

                //吃碰杠检测
                if (null == drop && !fake.direct) {
                    var passPanel = view.getPanelByLocalSeatId(passiveLocalSeatId);
                    // GLOBAL_OBJ.LOGD("onRecvChow_passPanel_canout:",passPanel.checkCanOut());
                    if(passPanel.checkCanOut()){//如果被吃的玩家手里还能出牌，说明手里多牌，这个时候就到被碰玩家手里去捞吃牌
                        drop = passPanel.doMethodsCheck( MODEL_CHOW.getTile() );
                    }else{
                        //被碰玩家手里牌已经打出，且弃牌区无弃牌，只能自己创建一张牌。
                        drop = GLOBAL_OBJ.table.modules.Mahjong.produce( MODEL_CHOW.getTile() );
                    }
                }

                //容错处理，有可能刚才断线了，可
                if (drop == null){
                    drop = GLOBAL_OBJ.table.modules.Mahjong.produce( MODEL_CHOW.getTile());
                }

                if (true != fake.direct) { 
                    AUDIO.audio(
                        AUDIO_RES.audioMethods(
                            MODEL_USER.getSex(
                                MODEL_TABLEINFO.getPlayer(
                                    MODEL_CHOW.getActiveLocalSeatId()
                                ) 
                            ), 
                            "chow"
                        )
                    );
                }
                // panel.sayReady("UNLOCK"); /*可以出牌，禁止选择查看*/
                GLOBAL_OBJ.LOGD(this._TAG,"下行吃牌，玩家板面转换中");
                var _chow = null;
                if(fake.direct){
                    GLOBAL_OBJ.LOGD(this._TAG,"吃牌 断线重连，回复完整");
                    _chow = MODEL_CHOW.getChowed(3);
                }else{
                    GLOBAL_OBJ.LOGD(this._TAG,"正常吃 其他玩家打的牌");
                    _chow = MODEL_CHOW.getChowed(2);
                }
                panel.doMethods(
                    GLOBAL_T.METHODS.CHOW,
                    // MODEL_CHOW.getActiveLocalSeatId(),
                    _chow,
                    true == fake.direct ? null : drop,
                    function(){ 
                        panel.sayGo();/*可以出牌，禁止选择查看*/ 
                    },
                    fake.direct,
                    passiveLocalSeatId,
                    activeLocalSeatId);

                panel.sayGo();

                // 检验是否有“吃碰杠听胡”等操作
                this.doMethods( MODEL_CHOW, MODEL_CHOW.getMethods() );

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvChow end;");
            },

            onRecvPong:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvPong start;");
                /*
                cmd: peng
                碰牌操作，有可能来自断线重连的模拟协议，此时是没有actionId的 */
                var fake    = MODEL_PONG.getFakeMsg(); //是否是模拟消息（from 断线重连）
                var passiveLocalSeatId = MODEL_PONG.getPassiveLocalSeatId();
                var activeLocalSeatId  = MODEL_PONG.getActiveLocalSeatId();
                var panel   = view.getPanelByLocalSeatId( MODEL_PONG.getActiveLocalSeatId() );
                var discard = view.getDiscardPanel();
                var drop    = discard.doMethods( passiveLocalSeatId );

                //恢复牌桌不操控指向
                if (!fake.direct) {
                    this.doWindUpdate(MODEL_PONG);
                }
                //吃碰杠检测(direct没有getPassiveLocalSeatId)
                if (null == drop && !fake.direct) {
                    var passPanel = view.getPanelByLocalSeatId(passiveLocalSeatId );
                    // GLOBAL_OBJ.LOGD("onRecvPong_passPanel_canout:",passPanel.checkCanOut());
                    if(passPanel.checkCanOut()){//如果被碰的玩家手里还能出牌，说明手里多牌，这个时候就到被碰玩家手里去捞碰牌
                        drop = passPanel.doMethodsCheck( MODEL_PONG.getTile() );
                    }else{
                        //被碰玩家手里牌已经打出，且弃牌区无弃牌，只能自己创建一张牌。
                        drop = GLOBAL_OBJ.table.modules.Mahjong.produce( MODEL_PONG.getTile() );
                    }
                }

                //容错处理，有可能刚才断线了
                if (drop == null){
                    drop = GLOBAL_OBJ.table.modules.Mahjong.produce( MODEL_PONG.getTile() );
                }
                    
                if (true != fake.direct) {
                    AUDIO.audio(
                        AUDIO_RES.audioMethods(
                            MODEL_USER.getSex(
                                MODEL_TABLEINFO.getPlayer(
                                    MODEL_PONG.getActiveLocalSeatId()
                                ) 
                            ), 
                            "pong"
                        )
                    );
                }
                // panel.sayReady("UNLOCK"); /*可以出牌，禁止选择查看*/

                //责任鸡
                if (MODEL_PONG.isZeRenJi()){
                    var zeRenFrom =  MODEL_PONG.zeRenFrom();
                    GLOBAL_OBJ.LOGD(this._TAG, "MODEL_PONG.isZeRenJi zeRenFrom = " + zeRenFrom);
                    if (zeRenFrom >= 0){
                        var opposite_panel   = view.getPanelByLocalSeatId( zeRenFrom );
                        GLOBAL_OBJ.LOGD(this._TAG, "MODEL_PONG.isZeRenJi 责任鸡");
                        opposite_panel.createEffectJi(2);//1冲锋鸡  2责任鸡
                    }
                }
                panel.doMethods(
                    GLOBAL_T.METHODS.PONG,
                    // MODEL_PONG.getActiveLocalSeatId(),
                    MODEL_PONG.getPonged( true == fake.direct ? 3 : 2 ),
                    true == fake.direct ? null : drop,
                    function(){
                        panel.sayGo();/*可以出牌，禁止选择查看*/ 
                    },
                    fake.direct,
                    passiveLocalSeatId,
                    activeLocalSeatId );

                panel.sayGo();
                

                // 检验是否有“吃碰杠听胡”等操作
                this.doMethods( MODEL_PONG, MODEL_PONG.getMethods() );
                this.doShutShowTips();//隐藏tips提示

                this.onCheckHu(MODEL_PONG,MODEL_PONG.getActiveLocalSeatId()); // 查胡预览

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvPong end;");
            },

            onRecvKong:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvKong start;");

                /*
                cmd: kong
                杠牌操作，有可能来自断线重连的模拟协议，此时是没有actionId的 */
                var that = this;
                var activeLocalSeatId = MODEL_KONG.getActiveLocalSeatId();
                var fake    = MODEL_KONG.getFakeMsg(); //是否是模拟消息（from 断线重连）
                var panel   = view.getPanelByLocalSeatId( activeLocalSeatId );
                var discard = view.getDiscardPanel();
                var passLocalSeatId = MODEL_KONG.getPassiveLocalSeatId();
                var drop    = discard.doMethods( passLocalSeatId );//该方法执行后会清理掉drop，再次访问无效

                //恢复牌桌不操控指向
                if (!fake.direct) {
                    this.doWindUpdate(MODEL_KONG);
                    if (activeLocalSeatId == GLOBAL_T.MYSEAT){
                        //如果杠牌的是自己，取消等杠状态
                        GLOBAL_OBJ.table.global.tableMethodState = 0;
                    }
                }

                //吃碰杠检测
                if (null == drop && activeLocalSeatId != passLocalSeatId && !fake.direct) {
                    var passPanel = view.getPanelByLocalSeatId(passLocalSeatId);
                    // GLOBAL_OBJ.LOGD("onRecvKong_passPanel_canout:",passPanel.checkCanOut());
                    if(passPanel.checkCanOut()){//如果被碰的玩家手里还能出牌，说明手里多牌，这个时候就到被碰玩家手里去捞碰牌
                        drop = passPanel.doMethodsCheck( MODEL_KONG.getTile() );
                    }else{
                        //被碰玩家手里牌已经打出，且弃牌区无弃牌，只能自己创建一张牌。
                        drop = GLOBAL_OBJ.table.modules.Mahjong.produce( MODEL_KONG.getTile() );
                    }
                }

                if (true != fake.direct) {
                    AUDIO.audio(
                        AUDIO_RES.audioMethods(
                            MODEL_USER.getSex(
                                MODEL_TABLEINFO.getPlayer(
                                    MODEL_KONG.getActiveLocalSeatId()
                                ) 
                            ), 
                            MODEL_KONG.getStyle() == GLOBAL_T.METHODS.EXPOSED_KONG ? "exposed_kong" : "concealed_kong"
                        )
                    );
                }

                var passiveLocalSeatId = MODEL_KONG.getPassiveLocalSeatId();

                var _mode=0;
                var _drop=null;
                if (true == fake.direct){
                    _mode=4;
                    _drop=null;
                }else{
                    if(MODEL_KONG.getStyle()==GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG){
                        // 暗杠可以直接去取得手牌
                        _mode=4;
                        _drop=null;
                    }else if(MODEL_KONG.getStyle()==GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG){
                        // 杠牌是自己的，就是 send tile 的
                        if(MODEL_KONG.getActiveLocalSeatId() == MODEL_KONG.getPassiveLocalSeatId()){
                            _mode=4;
                            _drop=null;
                        }else{
                            // 杠牌是别人的，就是 play 的
                            _mode=3;
                            _drop=drop;
                        }
                    }else {
                        hall.assert.true(false,"onRecvKong 本地转换的杠类型错误");
                    }
                }

                var _kongInfo=MODEL_KONG.getKonged(_mode , MODEL_KONG.getStyle() , _drop);
                // GLOBAL_OBJ.LOGD(this._TAG," MODEL_KONG.getKonged() : " + JSON.stringify(_kongInfo));
                // 责任鸡
                if (MODEL_KONG.isZeRenJi()){
                    var zeRenFrom =  MODEL_KONG.zeRenFrom();
                    if (zeRenFrom >= 0){
                        var opposite_panel   = view.getPanelByLocalSeatId( zeRenFrom );
                        GLOBAL_OBJ.LOGD(this._TAG, "MODEL_KONG.isZeRenJi 责任鸡");
                        opposite_panel.createEffectJi(2);//1冲锋鸡  2责任鸡
                    }
                }
                panel.doMethods(
                    MODEL_KONG.getStyle(), // 明杠&暗杠
                    _kongInfo.pattern,
                    _drop,
                    null,
                    fake.direct,
                    passiveLocalSeatId,
                    activeLocalSeatId
                );

                panel.sayGo();

                // 检验是否有“吃碰杠听胡”等操作
                this.doMethods( MODEL_KONG, MODEL_KONG.getMethods() );
                this.doShutShowTips(); // 隐藏tips提示

                //this.onCheckHu(MODEL_KONG,activeLocalSeatId); // 查胡预览

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvKong end;");
            },

            onRecvAskAbsence:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Ask_Absence__start_");

                var timeout  = MODEL_ASK_ABSENCE.getTimeOut();
                var windView = view.getWind();

                var myPanel  = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                myPanel.doLock();
                var colorSort = myPanel.getMyPanelMahjSort();

                var colorData = MODEL_ASK_ABSENCE.getColorData();
                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Ask_Absence__   colorData = " + colorData);

                if (0 == view.getAbsenceNode().getChildrenCount()) {
                    // 加载定缺界面
                    PROXY_ABSENCE.boot(
                        view.getAbsenceNode(),
                        {color_data : colorData, type : "begin", tableScene : view, color_sort : colorSort},
                        GLOBAL_OBJ.table.windows.consts.C_TABLE_ABSENCE);

                    PROXY_METHODS.shut();
                }

                // 更新风门倒计时
                windView.update(GLOBAL_T.MYSEAT, timeout);
                windView.wind_jishi_node.setVisible(true);
                windView.effectNode.setVisible(true);

                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Ask_Absence__end_");
            },

            onRecvAbsenceOwn:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Absence_Own__start_");

                var fake       = MODEL_ABSENCE_OWN.getIsConnect();
                var colorData  = MODEL_ABSENCE_OWN.getMySelfColorData();
                var activeId   = MODEL_ABSENCE_OWN.getActiveLocalSeatId();

                GLOBAL_OBJ.LOGD(this._TAG, "__onRecv_Absence_Own_color = "+colorData);

                if (activeId == GLOBAL_T.MYSEAT) {
                    if (fake) {
                        if (0 == view.getAbsenceNode().getChildrenCount()) {
                            var myPanel = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                            myPanel.doLock();

                            // 恢复定缺界面
                            PROXY_ABSENCE.boot(
                                view.getAbsenceNode(),
                                {color_data : colorData, tableScene : view},
                                GLOBAL_OBJ.table.windows.consts.C_TABLE_ABSENCE);
                        }
                    }

                    PROXY_ABSENCE.playMySelfDingQueAni(colorData, fake);
                }

                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Absence_Own__end_");
            },

            onRecvAbsenceEnd:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Absence_End__start_");
                var that      = this;
                var fake      =      MODEL_ABSENCE_END.getIsConnect();
                var colorData =      MODEL_ABSENCE_END.getColorDataEnd();
                var myAbsenceColor = MODEL_ABSENCE_END.getMyAbsenceColor();
                var banker    =      MODEL_ABSENCE_END.getAbsenceBanker();
                var timeout   =      MODEL_ABSENCE_END.getTimeOut();
                var actionId  =      MODEL_ABSENCE_END.getActionId();

                var myPanel   =      view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                var closeCallFunc, lsid, lsidType;
                if (fake) {
                    for (var i = 0; i < colorData.length; i++) {
                        lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                        lsidType = colorData[i];
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_SHOW_ABSENCE_FIXD,
                            {seatId : lsid, dqType : lsidType});
                    }
                    if (actionId) {
                        this.doMethods(MODEL_ABSENCE_END, MODEL_ABSENCE_END.getMethods());
                    }
                }
                else {
                    if (banker && timeout) {
                        var locbanker = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(banker);
                        var windView = view.getWind();
                        // 风门倒计时
                        windView.update(locbanker, timeout, true);
                    }

                    closeCallFunc = function () {
                        PROXY_ABSENCE.shut();
                        if (actionId) {
                            // 检验是否有"杠听胡"等操作
                            that.doMethods(MODEL_ABSENCE_END, MODEL_ABSENCE_END.getMethods());
                        }
                    };

                    PROXY_ABSENCE.updateAbsenceEnd(colorData, closeCallFunc);
                }
                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Absence_End myAbsenceColor = " + myAbsenceColor);
                //myAbsenceColor = 0 (万)
                if (myAbsenceColor != null) {
                    var mahjTiles = MODEL_ABSENCE_END.getStandUpTiles();
                    var mahjDraw  = MODEL_ABSENCE_END.getDrawTile();
                    myPanel.doMarkAbsenceTiles(myAbsenceColor, mahjTiles, mahjDraw);
                    myPanel.doUnlock();
                }

                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_Absence_End__end_");
            },

            // 听牌
            onRecvAskTing:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "on_RecvAskTing......start.....");

                if (this.isTingOperate === false) {
                    return;
                }

                PROXY_METHODS.shut();
                this.doMethods(MODEL_ASK_TING, MODEL_ASK_TING.getMethods());

                GLOBAL_OBJ.LOGD(this._TAG, "on_RecvAskTing......end.....");
            },

            // 更新听牌状态
            onRecvTingState:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_TingState......start....");

                if (this.isTingOperate === false) {
                    return;
                }

                var panel, lsid, serverState, localState;
                var players = MODEL_TABLEINFO.getSeatCount();
                for (var i = 0; i < players; i++) {
                    lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                    serverState = MODEL_TING_STATE.getTingStateByLocalSeatId(lsid);
                    panel = view.getPanelByLocalSeatId(lsid);
                    localState = panel.getLocalTingState();
                    if (serverState > 0 && !localState) {
                        panel.doTing(serverState);
                        AUDIO_RES.audioMethods(MODEL_USER.getSex(MODEL_TABLEINFO.getPlayer(lsid)), "ting");
                    }
                }

                GLOBAL_OBJ.LOGD(this._TAG, "_onRecv_TingState......end....");
            },

            // 听牌流程结束消息，也可以刷新玩家上听状态
            onRecvTingEnd:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "__onRecv_Ting_End_start__");

                if (this.isTingOperate === false) {
                    return;
                }
                this.isTingOperate = false;

                var panel, lsid, serverState, localState;
                var players = MODEL_TABLEINFO.getSeatCount();
                for (var i = 0; i < players; i++) {
                    lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                    serverState = MODEL_TING_END.getTingStateByLocalSeatId(lsid);
                    panel = view.getPanelByLocalSeatId(lsid);
                    localState = panel.getLocalTingState();
                    if (serverState > 0 && !localState) {
                        panel.doTing(serverState);
                        AUDIO_RES.audioMethods(MODEL_USER.getSex(MODEL_TABLEINFO.getPlayer(lsid)), "ting");
                    }
                }
            },

            // 独立冲锋鸡
            onRecvChongFeng:function(){
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvChongFeng ......start....");

                var _seatId = MODEL_CHONG_FENG.getLocalSeatId();
                var panel = view.getPanelByLocalSeatId(_seatId);

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvChongFeng  冲锋鸡");
                panel.createEffectJi(1);//1冲锋鸡  2责任鸡

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvChongFeng ......end....");
            },

            // 托管&解除托管-其他人
            onRecvTrusteeOther:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvTrustee start;");

                // 托管中 (听牌了 不允许显示托管按钮)
                var activitySeatId  = MODEL_TRUSTEE.getActiveLocalSeatId();
                var trusteeState    = MODEL_TRUSTEE.getTrusteeStateBySeatId( activitySeatId );
                if (activitySeatId == GLOBAL_T.MYSEAT){
                    if (0 == view.getTrusteeNode().getChildrenCount() && true == trusteeState) {
                        AUDIO.audio(GLOBAL_OBJ.RES.UI_TUOGUAN_MP3);
                        PROXY_TRUSTEE.boot( view.getTrusteeNode() );
                        //如果存在，操作按钮面板，关之
                        PROXY_METHODS.shut();
                    }else{
                        PROXY_TRUSTEE.shut();
                    }
                }else{
                    GLOBAL_OBJ.LOGD("onRecvTrustee_trusteeState:", trusteeState + "   seatId:" + activitySeatId);
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_TRUSTEE_ISSHOW,
                        {seatId:activitySeatId, isTrustee:trusteeState});
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvTrustee end;");
            },

            // 托管&解除托管
            onRecvTrustee:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvTrustee start;");

                // 托管中 (听牌了 不允许显示托管按钮)
                if (true == MODEL_TRUSTEE.getTrustee( GLOBAL_T.MYSEAT )){
                    if (0 == view.getTrusteeNode().getChildrenCount()) {
                        AUDIO.audio(GLOBAL_OBJ.RES.UI_TUOGUAN_MP3);
                        PROXY_TRUSTEE.boot( view.getTrusteeNode() );
                        //如果存在，操作按钮面板，关之
                        PROXY_METHODS.shut();
                    }
                }else{
                    // AUDIO.audio(GLOBAL_OBJ.RES.TUOGUAN_CANCEL_MP3);//有音爆
                    PROXY_TRUSTEE.shut();
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvTrustee end;");
            },

            onRecvCharging:function () {//其他人正在充值中

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvCharging start;");

                var chargingSeatId = MODEL_CHARGING.getChargingLocalId();
                if(chargingSeatId != GLOBAL_T.MYSEAT){//确保不是自己在充值
                    var czz = GLOBAL_OBJ.RES.XZ_ZM_CHARGE_CCBI;
                    var panel = view.getPanelByLocalSeatId(chargingSeatId);
                    GLOBAL_OBJ.bkernel.utils.Animation.play(
                        panel.panel_chongzhizhong,
                        czz,
                        cc.p(0,0),
                        function() {},
                        function() {},
                        true, 1.0, "chongzhi");
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvCharging end;");
            },

            onRecvAskCharge:function () { // 弹出充值界面

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvAskCharge start;");

                var ask_charge_SeatId        = MODEL_ASK_CHARGE.getAskChargeLocalId();
                var ask_charge_server_seatId = MODEL_ASK_CHARGE.getAskChargeServerId();
                var ask_charge_roomid        = MODEL_ASK_CHARGE.getAskChargeRoomId();
                var ask_charge_tableid       = MODEL_ASK_CHARGE.getAskChargeTableId();
                if(ask_charge_SeatId == GLOBAL_T.MYSEAT){//确保是自己在充值中

                    var _dis             = MODEL_ASK_CHARGE.getAskChargeDis();
                    var _timeout         = MODEL_ASK_CHARGE.getTimeout();
                    PROXY_CHARGE.shut();
                    PROXY_CHARGE.boot(
                        view.chongzhiNode,
                        {
                            model:MODEL_ASK_CHARGE,
                            dis:_dis,
                            timeout:_timeout,
                            sid:ask_charge_server_seatId,
                            roomid:ask_charge_roomid,
                            tableid:ask_charge_tableid
                        }
                    );
                }
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvAskCharge end;");
            },

            //充值结果广播
            onRecvCharged:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvCharged start;");

                var chargedResult = MODEL_CHARGED.getChargedResult();// 0:充值成功，继续游戏； -2:充值失败
                var chargedSeatId = MODEL_CHARGED.gethargedLocalId();//获取充值玩家本地座位号
                var chargedDis    = MODEL_CHARGED.getChargedDis();//描述

                if(chargedSeatId == GLOBAL_T.MYSEAT){//自己充值结果
                    GLOBAL_OBJ.LOGD("自己充值成功啦！！！  sid=", chargedResult);
                    PROXY_CHARGE.shut();
                }else{
                    GLOBAL_OBJ.LOGD("本地座位" + chargedSeatId + "号，充值结果返回啦！！！   sid=" + chargedResult);
                    var panel = view.getPanelByLocalSeatId(chargedSeatId);
                    panel.panel_chongzhizhong.removeAllChildren();//去掉动画

                    if(chargedResult == 0){

                    }else if(chargedResult == -2){//没有充值，认输了，延迟2秒播放动画，并把认输家手牌扣掉
                        var _parent = panel.getPanelHuNode();
                        _parent.scheduleOnce(function() {
                            GLOBAL_OBJ.bkernel.utils.Animation.play(_parent,
                                GLOBAL_OBJ.RES.XZ_ZM_TX_SHU_RS_CCBI,
                                cc.p(0, 0),
                                function(){},
                                function(){
                                    panel.doShowRenShu();
                                },
                                false );
                        },2.0);
                    }
                }

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvCharged end;");
            },

            /*
             刷新好友场圈数
             */
            onRecvUpdateRoundCount:function () {

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvUpdateRoundCount start;");

                var curCount = MODEL_UPDATE_ROUNDCOUNT.getCurCount();
                var tolCount = MODEL_UPDATE_ROUNDCOUNT.getTotalCount();
                MODEL_TABLEINFO.setCustomTablePlayTimes(curCount);
                MODEL_TABLEINFO.setCustomTableMaxPlayTimes(tolCount);

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvUpdateRoundCount end;");
            },

            /**
             * win/lose 消息的回调 所有玩家输赢数据，番型数据
             * 1、胡牌上下播雷击特效
             * 2、若是点炮，还有对应点炮类型的特效
             * 3、胡的人还有对应的胡法特效
             * 4、胡的牌，播砸牌动画，放到玩家手牌区
             * 5、处理round_result消息
             * 6、推倒手牌（区分赢家和输家）
             * 7、番型特效
             * 8、结算／流局
             * */
            onRecvWinLose:function() {
                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_WinLose start;");

                var that = this;
                if (GLOBAL_OBJ.inStart) {
                    // 天胡必胡
                    view['effectPanel'].scheduleOnce(function () {
                        that.onRecvWinLose();
                    }, 0.3, "patch");
                    return;
                }

                if (view.getBudgetNode().getChildrenCount() > 0) {
                    return;
                }
                var lsid          = MODEL_BUDGETS.getCurrentLocalSeatId();
                var mode          = MODEL_BUDGETS.getWinMode( lsid );
                var panel         = view.getPanelByLocalSeatId( lsid );
                var fake          = MODEL_BUDGETS.getIsReconnect(lsid);
                var winTiles      = MODEL_BUDGETS.getWinTiles(lsid);      //因为血流胡多张，所以这里变成数组了
                var multiWinTiles = MODEL_BUDGETS.getMultiWinTiles(lsid); //一炮多响的牌处理
                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_WinLose lsid = " + lsid);
                if(fake == true) {
                    // 断线重连，则不播和牌特效，只恢复胡牌状态
                    panel.playHuAnimation(winTiles, multiWinTiles);
                    return;
                }

                var isLiuJu = MODEL_BUDGETS.getGameFlow(lsid);
                if (isLiuJu == false) {
                    // 输的人播闪电雷击特效  0赢 -1输 -2点炮
                    if (mode == -1 || mode == -2 ) {
                        this.playLightingAni(lsid);
                    }

                    // 赢的人门前播胡法，输的人若点炮，门前播点炮特效
                    panel.playZimoOrDianPaoAni(mode, lsid);

                    // 胡牌播砸牌动画
                    if (mode >= 0) {
                        this.playZaPaiAni(lsid);
                    }
                }

                // win/lose消息计数
                this.countWinLoseMessage();

                GLOBAL_OBJ.LOGD(this._TAG, "onRecv_WinLose end;");
            },

            // 播胡牌闪电雷击特效
            playLightingAni:function (loseId) {
                var discard  = view.getDiscardPanel();
                var dropMahj = discard.getDrop(loseId);
                GLOBAL_OBJ.LOGD(this._TAG, "playLightingAni loseId = " + loseId);
                if (dropMahj){
                    GLOBAL_OBJ.LOGD(this._TAG, "playLightingAni dropMahj;");
                    // 收到新的弃牌，要把原来没有放入弃牌区的大牌，放入对应的弃牌区
                    discard.doClean();
                    var hupai_1  = GLOBAL_OBJ.RES.MJ_ZM_TX_HUPAI1_CCBI;
                    var hupai_2  = GLOBAL_OBJ.RES.MJ_ZM_TX_HUPAI2_CCBI;

                    var dropMjPos  = dropMahj.getRootNode().getPosition();
                    AUDIO.audio( GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_SHANDIAN_MP3 );
                    GLOBAL_OBJ.tableEffectPlayer.play(
                        dropMahj.getRootNode().getParent(),
                        hupai_1,
                        dropMjPos,
                        function(_animate) {
                            _animate.getRootNode().setLocalZOrder(99);
                        },
                        function() {},
                        false
                    );

                    GLOBAL_OBJ.tableEffectPlayer.play(
                        dropMahj.getRootNode().getParent(),
                        hupai_2,
                        dropMjPos,
                        function(_animate) {
                            _animate.getRootNode().setLocalZOrder(-2);
                        },
                        function() {
                            discard.doRemoveSeatDrop(loseId);
                        },
                        false
                    );
                }
            },

            // 胡牌砸牌
            playZaPaiAni:function (winSeatId) {
                var winTiles = MODEL_BUDGETS.getWinTiles(winSeatId);
                var huPanel = view.getPanelByLocalSeatId(winSeatId);
                var multiWinTiles = MODEL_BUDGETS.getMultiWinTiles(winSeatId); //一炮多响的牌处理
                if(winTiles.length == 0){
                    ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                        text:"胡牌的 winTiles 为空 " + winTiles,
                        duration:5
                    });
                }
                var winTileIndex = winTiles.length - 1;
                var winTile = winTiles[winTileIndex];
                var tileImg = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_"+winTile+"_PNG";
                var parent = huPanel.getPanelHuSeenNode();
                var posDatas = huPanel.doGetHuPaiOffXY(winTiles.length);//获得和牌砸牌特效位置偏移量
                huPanel.doBudgetUpDrawMahj();//如果是自摸，则删除抓牌

                AUDIO.audio(GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_HUPAI_MP3);
                GLOBAL_OBJ.tableEffectPlayer.play(
                    parent,
                    GLOBAL_OBJ.RES.XZ_ZM_TX_HUPAI_CCBI,
                    cc.p(posDatas.offX, posDatas.offY),
                    function (_animate) {
                        _animate.getRootNode().setLocalZOrder(posDatas.zorder);
                        GLOBAL_FUNCS.textureChange(_animate.huMahjTile, GLOBAL_OBJ.RES[tileImg]); // 改变动画中牌花色
                        switch (winSeatId){//改变动画中牌底
                            case GLOBAL_T.SEATS.N0:
                            case GLOBAL_T.SEATS.N2:
                                GLOBAL_FUNCS.textureChange(_animate.huMahj, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_03_PNG);
                                var size_mahj = _animate.huMahj.getContentSize();
                                _animate.huMahjTile.setScaleX(1);
                                _animate.huMahjTile.setRotation(0);
                                _animate.huMahjTile.setPosition(cc.p(size_mahj.width*0.5, size_mahj.height*0.609));
                                break;
                            case GLOBAL_T.SEATS.N1:
                                GLOBAL_FUNCS.textureChange(_animate.huMahj, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_06_PNG);
                                var size_mahj = _animate.huMahj.getContentSize();
                                _animate.huMahjTile.setScaleX(0.88);
                                _animate.huMahjTile.setRotation(-90);
                                _animate.huMahjTile.setPosition(cc.p(size_mahj.width*0.5, size_mahj.height*0.609));
                                break;
                            case GLOBAL_T.SEATS.N3:
                                //GLOBAL_FUNCS.textureChange(_animate.huMahj, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_06_PNG);
                                GLOBAL_FUNCS.textureChange(_animate.huMahj, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_06_PNG);
                                var size_mahj = _animate.huMahj.getContentSize();
                                _animate.huMahjTile.setScaleX(0.88);
                                _animate.huMahjTile.setRotation(90);
                                _animate.huMahjTile.setPosition(cc.p(size_mahj.width*0.5, size_mahj.height*0.609));
                                break;
                            default:
                                break;
                        }
                    },
                    function (_animate) {
                        huPanel.playHuAnimation(winTiles, multiWinTiles);
                    },
                    false, 1.0, 'sx'
                );
            },

            /**
             * round_result 消息的回调 所有玩家手牌数据，马牌数据，结算数据
             * */
            onRecvRoundResult:function () {
                var that = this;
                if (GLOBAL_OBJ.inStart)
                {
                    // 这么做是因为机器人有可能在开局动画没播完就点炮了,造成手牌推倒时，初始化手牌的消息正好才来，出现白板
                    view['effectPanel'].scheduleOnce(function () {
                        that.onRecvRoundResult();
                    }, 0.3, "patch");
                    return;
                }
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvRoundResult start;");
                view.hideTaskPanel();
                // 重置桌面牌局
                var discard = view.getDiscardPanel();
                //要把最后一张没有放入弃牌区的大牌，放入对应的弃牌区
                discard.doClean();
                var myPanel = view.getPanelByLocalSeatId( GLOBAL_T.MYSEAT );
                discard.setArrowVisible(false);  // 隐藏棋牌指针
                this.doShutShowTips();           // 隐藏tips提示
                view.onLayerEnable();
                view.tipNodeBtn.setVisible(false);  // 隐藏灯牌提示按钮
                PROXY_METHODS.shut();            // 如果存在，操作按钮面板，关之
                PROXY_TRUSTEE.shut();            // 如果存在，托管面板，关之

                myPanel.setMahjsTag();//恢复麻将原始状态
                myPanel.setOwnLCButtonVisible(false);
                myPanel.shutTingProxy();

                view.menu.setDetailState(true);
                view.wind.stopWindAnimation(); //结算后停止风门动画

                receive_round_result = true;

                this.showDownTiles();

                GLOBAL_OBJ.LOGD(this._TAG, "onRecvRoundResult end;");
            },

            /**
             * 处理win/lose 消息和round_result消息，因为win/lose会接收四次，而round_result只接收一次
             * 所以此处的处理是两种消息都收到才处理
             * */
            countWinLoseMessage:function () {
                receive_budgets_count += 1;
                var playerNum = MODEL_TABLEINFO.getSeatCount();
                GLOBAL_OBJ.LOGD(this._TAG,"countWinLoseMessage receive_budgets_count = " + receive_budgets_count + " playerNum = " + playerNum);

                if (receive_budgets_count < playerNum) {
                    return;
                }
                this.onRecvRoundResult();
            },

            // 将手牌反转
            showDownTiles:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "showDownTiles function begin");
                receive_budgets_count = 0;
                receive_round_result = false;

                var that = this;
                // 赢的人先推倒
                var players = MODEL_TABLEINFO.getSeatCount();
                view['effectPanel'].scheduleOnce(function () {
                    for(var i = 0; i < players; i++){
                        var winId      = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                        var winMode    = MODEL_BUDGETS.getWinMode(winId);
                        var winPanel   = view.getPanelByLocalSeatId(winId);
                        var standTiles = MODEL_BUDGETS.getStandUpTiles(winId);
                        if (winMode >= 0) {
                            // 赢的人在推倒牌后，延时1.5秒播番型特效，回调函数就是播放番型特效
                            winPanel.doBudgetLiang(standTiles, true); // that.playPatternAnimations(第三个参数.播放最大牌型)
                        }
                    }
                }, 1);

                // 输的人后推倒
                view['effectPanel'].scheduleOnce(function () {
                    for (var  j = 0; j < players; j++) {
                        var loseId     = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(j);
                        var winMode    = MODEL_BUDGETS.getWinMode(loseId);
                        var losePanel  = view.getPanelByLocalSeatId(loseId);
                        var standTiles = MODEL_BUDGETS.getStandUpTiles(loseId);
                        if (winMode < 0) {
                            losePanel.doBudgetLiang(standTiles, true);
                        }
                    }
                }, 2.5);
                var mypanel  = view.getPanelByLocalSeatId( GLOBAL_T.MYSEAT );
                // 牌局结束,手牌归于落下状态,并不可点击
                for(var j = 0 ; j < mypanel.mahjs.length; ++j){
                    // mypanel.mahjs[j].doDown(true);
                    mypanel.mahjs[j].disableTouch();
                }
                GLOBAL_OBJ.LOGD(this._TAG,"showDownTiles mypanel.mahjs.length:" + mypanel.mahjs.length);
                // 开始结算
                var isLiuJu = MODEL_BUDGETS.getGameFlow(GLOBAL_T.MYSEAT);
                GLOBAL_OBJ.LOGD(this._TAG,"showDownTiles isLiuJu:" + isLiuJu);

                view.effectPanel.scheduleOnce(function () {
                    if(isLiuJu){
                        // 流局
                        GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGETS_LIUJU, {'scene': view, 'closeCallBackFun':that.showBudgetsWindow }, view.getGameFlowNode());
                    }else{
                        // 结算
                        that.showBudgetGD();
                    }
                }, 3.5);
                GLOBAL_OBJ.LOGD(this._TAG, "showDownTiles function end");
            },

            /**
             * 播番型特效
             * */
            playPatternAnimations:function (_seatId) {
                var winMode = MODEL_BUDGETS.getWinMode(_seatId);
                var panel = view.getPanelByLocalSeatId(_seatId);
                var animationMode = MODEL_BUDGETS.dealWithWinModeInPatterns(_seatId);
                var sound = animationMode.sound;
                var ccb   = animationMode.ccb;
                GLOBAL_OBJ.LOGD(this._TAG, "play_Pattern_Animations seatid = "+_seatId+", ccb =  "+ccb+", sound = "+sound);

                var pw = panel.getWinNode().convertToWorldSpace(cc.p(0, 0));
                var pl = view.effectPanel.convertToNodeSpace(pw);
                var txScale = 0.7;
                if(_seatId == GLOBAL_T.MYSEAT){//自己播放的特效缩放为0.9
                    txScale = 0.9;
                }else if(_seatId == GLOBAL_T.SEATS.N1 || _seatId == GLOBAL_T.SEATS.N3){
                    pl.y = pl.y + 20;
                }else if(_seatId == GLOBAL_T.SEATS.N2){
                    pl.x = pl.x - 28;
                }

                var fanXingTx = function () {
                    GLOBAL_OBJ.bkernel.utils.Animation.play(
                        view.effectPanel,
                        ccb,
                        pl,
                        function(_animate){
                            AUDIO.audio(
                                AUDIO_RES.audioMethods(
                                    MODEL_USER.getSex(MODEL_TABLEINFO.getPlayer(_seatId)),
                                    sound));
                        },
                        //动画结束后的动作
                        function(_animate) {},
                        false, txScale
                    );
                }

                if(winMode == 3){//如果是抢杠胡，先播放抢杠胡，再播放番型动画
                }else{
                    fanXingTx();
                }
            },

            onLockPanel:function () {
                var panel = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);
                panel.doLock();
            },

            //翻牌鸡
            drawJi:function(_tileId){
                GLOBAL_OBJ.LOGD(this._TAG, "drawJi ;");
                var that = this;
                var fanpaiji = cc.Node.create();
                var winSize  = cc.Director.getInstance().getWinSize();
                var pCenter = cc.p(winSize.width/2, winSize.height/2);
                fanpaiji.setPosition(pCenter);
                fanpaiji.setAnchorPoint(0,0);
                fanpaiji.setContentSize(90, 97);
                view.getRootNode().addChild(fanpaiji);
                var tileId = _tileId;
                var _callFunc = function () {
                    that.showBudgetGY();
                    fanpaiji.removeFromParent();
                    fanpaiji = null;
                }
                var fanpaiji_show = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.FanPaiJi({'tile': tileId, 'callFunc':_callFunc });
                fanpaiji_show.getRootNode().setPosition(cc.p(0,0));
                fanpaiji_show.getRootNode().setAnchorPoint(cc.p(0.5,0.5));
                fanpaiji.addChild(fanpaiji_show.getRootNode());
            },
            
            showBudgetGY:function(){
                GLOBAL_OBJ.LOGD(this._TAG, "showBudgetGY ;");
                ty.Timer.cancelTimer(this, this.showBudgetGD);
                //结算音效,弹出结算界面
                AUDIO.audio( GLOBAL_OBJ.RES.UI_UIWIN_MP3 );
                this.showBudgetsWindow();
            },
            
            showBudgetGD:function()
            {
                GLOBAL_OBJ.LOGD(this._TAG, "showBudgetGD ;");
                var that = this;
                var tileId = MODEL_BUDGETS.getFanTile(GLOBAL_T.MYSEAT);
                //翻牌鸡
                if (tileId > 0){
                    that.drawJi(tileId);
                }else {
                    that.showBudgetGY();
                }
            },

            showBudgetsWindow:function () {
                GLOBAL_OBJ.LOGD(this._TAG, "showBudgetsWindow 弹出结算窗体;");

                if (MODEL_TABLEINFO.getTableType() != GLOBAL_OBJ.TableType.Match){
                    GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGETS_GYMJ, {scene: view}, view.getBudgetNode());
                }
                else{
                    //显示比赛的结算面板
                    var matchBudgetPanel = new GLOBAL_OBJ.businesses.scenes.Match.Budgets();
                    view.getRootNode().addChild(matchBudgetPanel.getRootNode());
                    var curDes = MODEL_MATCH.getCurDes();
                    if (!curDes || curDes.type == GLOBAL_OBJ.MatchType.stage_match){
                        view.getRootNode().scheduleOnce(function(){
                            matchBudgetPanel.getRootNode().setVisible(false);
                        }, 1);
                    }
                }
            },

            onRecvChat:(function() {
                var that = this;
                var animate  = null;

                /* 聊天推荐信息*/
                var CHAT_TEXT = [
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1020,
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1021,
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1022,
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1023,
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1024,
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1025,
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1026,
                    GLOBAL_OBJ.STRING.MJ_MJ_CONST_STRING_1027
                ];

                cc.SpriteFrameCache.getInstance().addSpriteFrames(jsb.fileUtils.fullPathForFilename( hall.searchPach+GLOBAL_OBJ.GAMENAME+"/img/mahj_emo_001.plist") );
                return function(){
                    GLOBAL_OBJ.LOGD(this._TAG, "onRecvChat start;");
                    var seatId = MODEL_CHAT.getActiveLocalSeatId();
                    var from   = view.getPanelByLocalSeatId( seatId ).getPortraitNode();
                    var emojs  = [
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION0_1_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION1_1_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION2_1_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION3_1_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION4_1_CCBI,
                    ];
                    var moveRes = [
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION0_0_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION1_0_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION2_0_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION3_0_CCBI,
                        GLOBAL_OBJ.RES.DDZ_TABLE_INTERACTIVE_EMOTION4_0_CCBI,
                    ];
                    switch(MODEL_CHAT.getType()){
                        case 0://文字表情 
                            var index   = MODEL_CHAT.getChatRecordsCount()-1;
                            var content = MODEL_CHAT.getChatRecordsContentByIndex(index);
                            var bubble  = new GLOBAL_OBJ.table.windows.Menu.Chat.Bubble(content);
                            bubble.init( (0 == seatId || 3== seatId )?GLOBAL_OBJ.RES.TABLE_CHAT_BUBBLE_01_CCBI:GLOBAL_OBJ.RES.TABLE_CHAT_BUBBLE_02_CCBI);
                            view.getRootNode().addChild(bubble.getRootNode());
                            bubble.setString(content);
                            bubble.getRootNode().setPosition( view.getRootNode().convertToWorldSpace(from.getPosition()) );
                            var chatIndex = -1;
                            for (var i = 0; i < CHAT_TEXT.length; ++i)
                            {
                                if (content == CHAT_TEXT[i])
                                {
                                    chatIndex =  i;
                                }
                            }

                            //音效
                            AUDIO.audio(
                                AUDIO_RES.audioChat(
                                    MODEL_USER.getSex(
                                        MODEL_TABLEINFO.getPlayer( seatId )
                                    ),
                                    chatIndex
                                )
                            );

                            break;
                        case 1://emoji表情(已经改为spine动画了，spine不能remove，只能setVisible，如果发现可以移除的接口，请改正)

                            var emoId = MODEL_CHAT.getEmoId();
                            if ( !spineAni ) {//这里用个全局局部变量来保存spine对象是有原因的，因为每次播放完spine动画想要remove都报错，也没有找到原因
                                              //所以就干脆不移除，如果有就直接播放，但是这里又遇到另外一个问题，就是不杀死进程掉线重连，spine对象js层还存在
                                              //但是C++层却删除了，所以这里通过spineAni来控制，每次掉线重联都重新赋值为null
                                spineAni = new GLOBAL_OBJ.table.windows.PlayerChat.playEmoAnimationController(from);
                                // var emoCallBack = function () {};
                                spineAni.playEmo(emoId);
                            }else{
                                if(!spineAni.isVisibles()){
                                    spineAni.setPlayController(from);
                                    spineAni.playEmo(emoId);
                                }
                            }
                            break;

                        case 2://互动表情 (鸡蛋，炸弹等特效)
                            var to      = view.getPanelByLocalSeatId( MODEL_CHAT.getPassiveLocalSeatId() ).getPortraitNode();
                            var srcPos  = from.getParent().convertToWorldSpace(from.getPosition());
                            var destPos = to.getParent().convertToWorldSpace(to.getPosition());

                            var spr     = cc.Sprite.create();
                            if (spr) {

                                GLOBAL_OBJ.bkernel.utils.Animation.play( spr,
                                    moveRes[ MODEL_CHAT.getEmojiId() ], cc.p(0,0),
                                    function(_animate){},
                                    function(_animate){}, false );

                                view.getRootNode().addChild( spr );
                                spr.setPosition( srcPos );

                                spr.runAction(cc.Sequence.create(
                                    cc.MoveTo.create(0.25, destPos),
                                    cc.CallFunc.create(function(){ spr.setVisible(false); }),
                                    cc.CallFunc.create((function(_spr){
                                        return function(){
                                            _spr.removeFromParent();
                                           if (animate) {
                                               animate.getRootNode().removeFromParent();
                                               animate = null;
                                           }
                                           // GLOBAL_OBJ.LOGD(MODEL_CHAT.getEmojiId() + "=AASDSDFSDFS=", emojs[ MODEL_CHAT.getEmojiId() ]);
                                           animate = GLOBAL_OBJ.bkernel.utils.Animation.play( to,
                                                emojs[ MODEL_CHAT.getEmojiId() ], cc.p(0,0),
                                                function(_animate){
                                                    AUDIO.audio( GLOBAL_OBJ.RES["UI_ITR_EMO"+MODEL_CHAT.getEmojiId()+"_MP3"] );
                                                },
                                                function(_animate){
                                                    animate = null;
                                                }, false );
                                        };

                                    })(spr))
                                ));
                            }
                            break;
                    }

                    GLOBAL_OBJ.LOGD(this._TAG, "onRecvChat end;");
                };
            })(),

            onRecvVote:function(){
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvVote start;");
                if (0 == view.getVoteNode().getChildrenCount()) {
                    PROXY_VOTE.boot(view.getVoteNode());
                }else{
                    if (1 == MODEL_VOTE.checkIfNeedClose()) {
                        GLOBAL_OBJ.LOGD(this._TAG, "onRecvVote_close");
                        view.getVoteNode().runAction(cc.Sequence.create(
                            cc.DelayTime.create(MODEL_VOTE.getVoteCloseDelayTime() - 1),
                            cc.CallFunc.create(function(){
                                PROXY_VOTE.shut();
                                if (MODEL_BUDGETS_FINAL.isTerminated() == 1) {
                                    if (0 == view.getBigBudgetNode().getChildrenCount()) {
                                        view.getBudgetNode().removeAllChildren();//小结算Node移除所有child
                                        //大结算
                                        var panel   = view.getPanelByLocalSeatId( GLOBAL_T.MYSEAT );
                                        panel.setMahjsTag();//恢复麻将原始状态
                                        GLOBAL_OBJ.bkernel.windows.Factory.produce(
                                            GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGET_FINAL, { scene: view}, view.getBigBudgetNode());
                                    }
                                }
                            })
                        ));
                    }
                }
                GLOBAL_OBJ.LOGD(this._TAG, "onRecvVote end;");
            },

            /*
                门风刷新
                门风的切换标记哪个方位的玩家可以出牌
            */
            doWindUpdate:function( _model, _notCleanup ){
                GLOBAL_OBJ.LOGD(this._TAG, "doWindUpdate start;");
                var seatId      = _model.getWindLocalSeatId();

                var __f_timeout = function(){
                    PROXY_METHODS.shut();//关闭吃碰杠面板
                    // 关闭听牌预览面板
                    view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT).doCancelTingPreview();
                };

                if (!_notCleanup) {
                    __f_timeout();
                }

                /*
                @门风指向非本家时，先禁止本家出牌操作*/
                if (GLOBAL_T.MYSEAT != seatId) {
                    view.getPanelByLocalSeatId( GLOBAL_T.MYSEAT ).sayGo();
                }

                GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(this);//清理超时
                //GLOBAL_OBJ.bkernel.utils.GlobalTimer.set(_model.getTimeout(), __f_timeout, this);

                // 切换门风
                view.getWind().update(seatId, _model.getTimeout());
                GLOBAL_OBJ.LOGD(this._TAG, "doWindUpdate end;");
            },

            /**
             * 本家可以执行的吃碰杠听操作的操作
             * @param _model 操作的MODEL
             * @param _data 操作项列表
             * @param _isFromPlay 是否从出牌协议来的
             * @returns {boolean}
             */
            doMethods:function(_model, _data, _isFromPlay) {
                GLOBAL_OBJ.LOGD(this._TAG, "doMethods start;");
                var isFromPlay = _isFromPlay || GLOBAL_OBJ.inStart;
                GLOBAL_OBJ.LOGD("查看是否在开局流程中。。。" + isFromPlay);

                if (!_model.hasOwnProperty('getActiveLocalSeatId')){
                    return;
                }
                else if (!isFromPlay && _model.getActiveLocalSeatId() != 0) { // 其他人吃碰杠操作
                    return;
                }

                var dataList = _data;

                var found = false;
                
                //报听状态下不显示过,
                if (MODEL_TING_STATE.getTingStateByLocalSeatId() > 0) {
                    GLOBAL_OBJ.LOGD(this._TAG,"doMethods 不显示过 1。。。");
                    found = true;
                }
                //有胡必胡时不显示过
                if ((MODEL_DISCARD == _model) && (_model.isNoPass() === 1)) {
                    GLOBAL_OBJ.LOGD(this._TAG,"doMethods 不显示过 2。。。");
                    found = true;
                }
                //抢杠胡不显示过
                if (MODEL_GRAB_GANG_HU.getGrabHuTile() > 0) {
                    GLOBAL_OBJ.LOGD(this._TAG,"doMethods 不显示过 3。。。");
                    found = true;
                }

                // Debug 模式下添加AI和过
                if (GLOBAL_OBJ.bkernel.Functions.isDebug()) {
                    dataList.splice(0, 0, {
                        type: GLOBAL_T.METHODS.AI,
                        tiles: null
                    });
                }

                if (dataList.length <= 0){
                    return false;
                }

                if (!found) {
                    dataList.splice(0, 0, {
                        type: GLOBAL_T.METHODS.PASS,
                        tiles: null
                    });
                }

                // 显示操作按钮
                PROXY_METHODS.update( dataList, _model, isFromPlay);
                return true;
            },

            // 展示选听牌界面
            doTingPreview:function (_model) {
                GLOBAL_OBJ.LOGD(this._TAG, "___do__Ting__Preview__start___");
                // view.onLayerEnable();
                var tingData = _model.getTingAction();
                var type = 2;
                var yingTing;
                var myPanel = view.getPanelByLocalSeatId(GLOBAL_T.MYSEAT);

                if (typeof(_model.getTingType) === 'function') {
                    type = _model.getTingType();
                }

                if (type == 1) {
                    yingTing = _model.getTingWinTiles();
                    myPanel.setTingResultData(yingTing);
                    // 硬听
                    C2S.requestTableAskTing(_model, type, null);
                }
                else if (type == 2) {
                    myPanel.doTingPreview(tingData, "ting");
                }

                GLOBAL_OBJ.LOGD(this._TAG, "___do__Ting__Preview__end___");
            },

        };
    };

    /*
    @牌桌模块*/
    GLOBAL_OBJ.table.modules.Table = {
        _TAG:"table.modules.Table",
        map:{},

        boot:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
            var that      = this;
            var ___f_scenes_manager___ = (function(){
                var index = -1;
                return [
                    function(){
                        index = 0;
                        //自建桌，从大厅直接切到麻将房间，需要释放大厅的资源（。。。。for safe）
                        hall.ToDoTask.clearTasks();
                        hall.PluginInterface.getCurrentSceneController().destroy(false);
                    },
                    (function(){
                        return function(){
                            GLOBAL_OBJ.LOGD(that._TAG," ... 加入桌子 ... ");
                            GLOBAL_OBJ.businesses.utils.Scene.jumpToTable(true);
                        };
                    })()
                ];
            })();
            
            /*  通知注册*/
            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.table.Events.UPDATE_GAME_BEGIN,
                function(){
                    GLOBAL_OBJ.LOGD(that._TAG,"准备开始游戏");
                    //model 层数据全清理
                    ___f_models_clean();
                    //缓存消息清理
                    that.unhook(GLOBAL_OBJ.table.modules.static.NAMES.TABLE);
                }, this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.table.Events.UPDATE_TABLE_LOCATION,
                ___f_scenes_manager___[0], this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.table.Events.UPDATE_BEFORE_ENTER_ROOM,
                function(){
                    GLOBAL_OBJ.LOGD(that._TAG,"准备上桌");
                    that.unhook(GLOBAL_OBJ.table.modules.static.NAMES.TABLE);
                }, this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.table.Events.UPDATE_ENTER_ROOM,
                ___f_scenes_manager___[1], this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHECK_IN_TABLE,
                function(){
                    var type  = MODEL_TABLEINFO.getTableType();
                    var mode  = MODEL_TABLEINFO.getPlayMode();
                    if ( hall.AccountInfo.userID == MODEL_IN_TABLE_CHECK.getUserId() ){
                        if (0 == MODEL_IN_TABLE_CHECK.getTableId()) {
                            //离开牌桌了
                            that.unhook(GLOBAL_OBJ.table.modules.static.NAMES.TABLE);
                            GLOBAL_OBJ.LOGD(that._TAG," 离开牌桌 jumpBack");
                            GLOBAL_OBJ.businesses.utils.Scene.jumpBack(type, mode);
                        }else{
                            ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                                text:"别着急，玩完这局再走吧~",
                                duration:2
                            });
                        }
                    }
                }, this);
        },

        shut:function(){
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            for(var name in this.map){
                GLOBAL_OBJ.bkernel.network.MsgCache.shut( name );
                this.unhook(name);
            }
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        /*
        @module根据view（Tuyoo里的controller）通过controller工厂生成controller（MVC里的controller）*/
        hook:function( _name, _view ){
            this.map[_name] = ____f_controller_producer( _name, _view ).boot();
        },

        /*
        @module销毁controller（MVC）*/
        unhook:function( _name ){
            var C = this.map[_name];
            if (C) {
                C.shut();
                this.map[_name] = null;
            }
        },

        /*
        @访问*/
        visit:function( _name ){
            return this.map[_name];
        },

        test:function(){
            MODEL_TABLEINFO.test();
        }
    };
})();
