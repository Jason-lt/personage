/*****************************************
 *  GLOBAL_OBJ_game_world.js
 *  Created by zengxx on 16-06-07
 */

(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    
	GLOBAL_OBJ.table.GameWorld = {
		_TAG:"table.GameWorld",
		boot:function() {
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
            /*
            实现窗体工厂的注册函数
            */
            GLOBAL_OBJ.bkernel.windows.Factory.REGS(function(){
                GLOBAL_OBJ.LOGD(GLOBAL_OBJ.table.GameWorld._TAG,"Table层开始注册窗体");
                var regs          = {};
                var ___f_template = GLOBAL_OBJ.bkernel.windows.Factory.REGS_TEMPLATE || function(){};

                regs[GLOBAL_OBJ.table.windows.consts.C_TING_PREVIEW_WINDOW] = ___f_template(
                    GLOBAL_OBJ.table.windows.TingPreview.Window, GLOBAL_OBJ.RES.TABLE_TING_PREVIEW_WINDOW_CCBI,null,null,"none","听牌预览窗体");
                
                regs[GLOBAL_OBJ.table.windows.consts.C_TING_WINDOW] = ___f_template(
                    GLOBAL_OBJ.table.windows.Ting.TingWindow, GLOBAL_OBJ.RES.TABLE_TING_WINDOW_CCBI,null,null,"none","上听牌窗体");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_TRUSTEE] = ___f_template(
                    GLOBAL_OBJ.table.windows.Trustee.Window, GLOBAL_OBJ.RES.TABLE_TRUSTEE_WINDOW_CCBI,null,null,"none","托管窗体");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_METHODS] = ___f_template(
                    GLOBAL_OBJ.table.windows.Methods.Window, GLOBAL_OBJ.RES.TABLE_METHODS_PANEL_CCBI,null,null,"none","吃碰杠面板窗体");

                regs[GLOBAL_OBJ.table.windows.consts.C_PORTRAIT_TABLE_COMMON] = ___f_template(
                    GLOBAL_OBJ.table.windows.Portrait.Common, GLOBAL_OBJ.RES.PORTRAITTABLECOMMON_CCBI, null, null, "none", "国标桌头像");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_USER_CARD] = ___f_template(
                    GLOBAL_OBJ.table.windows.UserCard.Window, GLOBAL_OBJ.RES.USERCARD_CCBI, null, null, "none", "牌桌名片");
                
                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_ABSENCE] = ___f_template(
                    GLOBAL_OBJ.table.windows.Absence.Window, GLOBAL_OBJ.RES.TABLE_ABSENCE_WINDOW_CCBI, null, null, "none", "定缺窗体");

                //贵阳捉鸡麻将结算
                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGETS_GYMJ] = ___f_template(
                    GLOBAL_OBJ.table.windows.gymj.Budgets, GLOBAL_OBJ.RES.GDMJ_BUDGET_WINDOW_CCBI,null,null,"none","贵阳捉鸡麻将结算界面");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGETS_LIUJU]     = ___f_template(
                    GLOBAL_OBJ.table.windows.LiuJu.Budgets, GLOBAL_OBJ.RES.TABLE_LIUJU_WINDOW_CCBI,null,null,"none","流局界面");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGET_FINAL] = ___f_template(
                    GLOBAL_OBJ.table.scenes.Custom.Final, GLOBAL_OBJ.RES.CUSTOM_FINAL_BUDGET_CCBI,null,null,"none","牌桌最终结算");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_VOTE] = ___f_template(
                    GLOBAL_OBJ.table.scenes.Custom.Vote, GLOBAL_OBJ.RES.CUSTOM_VOTE_QUIT_CCBI,null,null,"none","牌桌投票离开");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU] = ___f_template(
                    GLOBAL_OBJ.table.windows.Menu.Window, GLOBAL_OBJ.RES.TABLE_MENU_CCBI,null,null,"none","牌桌菜单");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_SETTING] = ___f_template(
                    GLOBAL_OBJ.table.windows.Menu.Setting, GLOBAL_OBJ.RES.TABLE_SETTING_CCBI,null,null,"none","牌桌菜单-设置");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_CHAT] = ___f_template(
                    GLOBAL_OBJ.table.windows.Menu.Chat, GLOBAL_OBJ.RES.TABLE_CHAT_CCBI,null,null,"none","牌桌菜单-聊天");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_LEAVE_TIP] = ___f_template(
                    GLOBAL_OBJ.table.windows.Menu.LeaveTip, GLOBAL_OBJ.RES.TABLE_MENU_LEAVE_TIP_WINDOW_CCBI,null,null,"none","金币场配了循环任务需要给提示确认是否离开");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_OFFLINE] = ___f_template(
                    GLOBAL_OBJ.table.windows.Offline.Window, GLOBAL_OBJ.RES.TABLE_SOCKET_CLOSED_CCBI, null, null, "none", "自建桌离线");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_ADD_TABLE_TIPS] = ___f_template(
                    GLOBAL_OBJ.table.windows.TableTips.Window, GLOBAL_OBJ.RES.TABLE_TIPS_WINDOW_CCBI, null, null, "none", "提示打牌tips");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_ASK_CHARGE] = ___f_template(
                    GLOBAL_OBJ.table.windows.AskCharge.Window, GLOBAL_OBJ.RES.TABLE_ASK_CHARGE_WINDOW_CCBI,null,null,"none","充值界面");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_FLOW] = ___f_template(
                    GLOBAL_OBJ.table.windows.Flow.Window, GLOBAL_OBJ.RES.TABLE_FLOW_WND_CCBI,null,null,"none","对局流水界面");

                regs[GLOBAL_OBJ.table.windows.consts.C_TABLE_TASK] = ___f_template(
                    GLOBAL_OBJ.table.windows.TableTask.Window, GLOBAL_OBJ.RES.TABLE_TASK_CCBI,null,null,"none","金币场任务列表界面");
                
                /*
                必须有返回值
                */
                return regs;
            });

            /*
            @协议数据缓存（断线重连）*/
            GLOBAL_OBJ.bkernel.network.MsgCache.REGS("table", function(){
                // 需要缓存的数据
                var caches = [
                    // table_info
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TABLE_INFO,
                    // init_tiles
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_DEAL,
                    // sit
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_SIT,

                    // 定缺
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ASK_ABSENCE,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ABSENCE_OWN,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ABSENCE_END,

                    // send_tile
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_DRAW,
                    // play
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD,
                    // chi
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHOW,
                    // peng
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_PONG,
                    // gang
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_KONG,
                    // 托管
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TRUSTEE,
                    // leave
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_LEAVE,
                    // win / lose
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_BUDGET,
                    // user_leave_vote
					GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOTE_BUDGET,

                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_COUNT_DOWN,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_NOTIFY_TIMEOUT,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHARGING,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ASK_CHARGE,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHARGD,

                    // 听牌
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_BEGIN,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_END,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ASK_TING,
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_STATE,

                    // 独立吃冲锋鸡
                    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHONG_FENG,

                ];
                return caches;
            });
        },

        shut:function() {
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        /*
        处理CMD*/

        parseInTableCheck:function(_result){
            // GLOBAL_OBJ.LOGD("parseInTableCheck_game_result=", JSON.stringify(_result));
            switch (_result.action){
                case "winStreakTask"://连胜任务
                    GLOBAL_OBJ.table.models.winstreaktask.parse(_result);
                    break;

                case "loopActiveTask"://循环任务（玩几局）
                    GLOBAL_OBJ.table.models.loopacvivetask.parse(_result);
                    break;

                case "loopWinTimesTask"://循环任务（赢几局）
                    GLOBAL_OBJ.table.models.loopwintimestask.parse(_result);
                    break;

                default:
                    GLOBAL_OBJ.table.models.InTableCheck.parse(_result);

                    GLOBAL_OBJ.table.Test.UploadGameMsg.Model.parse(_result);
                    break;
            }
        },

        /*
          牌桌等待区信息
         */
        parseTableLocation:function(_result){
            GLOBAL_OBJ.businesses.modules.User.Model.parseFromTableLocation(_result);
            GLOBAL_OBJ.table.models.Location.parse(_result);
        },

        parseSit:function(_result){
            GLOBAL_OBJ.businesses.modules.User.Model.parseFromTableSit(_result);
            GLOBAL_OBJ.table.models.Sit.parse(_result);
        },

        parseCustom:function(_result){
            GLOBAL_OBJ.table.models.Custom.parse(_result);
        },

        /*
          牌桌等待区信息
         */
        parseTableEvent:function(_result){
            GLOBAL_OBJ.businesses.modules.User.Model.parseFromTableEvent(_result);
            GLOBAL_OBJ.table.models.TableEvent.parse(_result);
        },

        parseTableScore:function(_result){
            GLOBAL_OBJ.table.models.Score.parse(_result);
            GLOBAL_OBJ.businesses.modules.User.Model.parseFromTableScore(_result);
        },

        /*
          牌桌信息
         */
        parseTableInfo:function(_result){
            GLOBAL_OBJ.businesses.modules.User.Model.parseFromTableInfo(_result);
            GLOBAL_OBJ.table.models.TableInfo.parse(_result);

            //自建桌
            GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.parseFromTableInfo(_result);
        },

        /*
          贵宾厅等待区倒计时
         */
        parseVipWatingCountDown:function(_result){
            GLOBAL_OBJ.table.models.CountDown.parse(_result);
        },

        /*
          贵宾厅等待区准备
         */
        parseVipWatingReady:function(_result){
            GLOBAL_OBJ.table.models.Ready.parse(_result);
        },

        /*
          初始化手牌
         */
        parseTableDeal:function(_result){
            GLOBAL_OBJ.table.models.Deal.parse(_result);
        },

        /*
          摸牌
         */
        parseTableDraw:function(_result){
            GLOBAL_OBJ.table.models.Draw.parse(_result);
        },

        /*  出牌 */
        parseTableDiscard:function(_result){
            GLOBAL_OBJ.table.models.Discard.parse(_result);
        },

        /*
          吃牌
         */
        parseTableChow:function(_result){
            GLOBAL_OBJ.table.models.Chow.parse(_result);
        },

        /*
          碰牌
         */
        parseTablePong:function(_result){
            GLOBAL_OBJ.table.models.Pong.parse(_result);
        },

        /*
          杠牌
         */
        parseTableKong:function(_result){
            GLOBAL_OBJ.table.models.Kong.parse(_result);
        },

        /*
          抢杠
         */
        parseTableGraHubKong:function(_result){
            GLOBAL_OBJ.table.models.GrabHuKong.parse(_result);
        },

        /*
          结算
         */
        parseTableBudget:function(_result){
            GLOBAL_OBJ.table.models.Budget.parse(_result);
        },

        /*
          客户端自定义协议，用来刷新action_id
        */
        parseTableCustomActionId:function(_result){
            GLOBAL_OBJ.table.models.ActionId.parse(_result);
        },


        /*
          客户端自定义协议，用来刷新action_id
        */
        parseTableChat:function(_result){
            GLOBAL_OBJ.table.models.Chat.parse(_result);
        },

        parseTableSetTrusteeOther:function(_result){
            // GLOBAL_OBJ.table.models.TrusteeOther.parse(_result);
        },
        /*
          本家托管
        */
        parseTableSetTrustee:function(_result){
            GLOBAL_OBJ.table.models.Trustee.parseFromSetTrustee(_result);
        },

        /*
          本家取消托管
        */
        parseTableRemoveTrustee:function(_result){
            GLOBAL_OBJ.table.models.Trustee.parseFromRemoveTrustee(_result);
        },

        parseTableLeave:function(_result){
            GLOBAL_OBJ.table.models.Leave.parse(_result);
        },

        parseCustomVote:function(_result){
            GLOBAL_OBJ.table.models.Vote.parse(_result);
        },

        parseCustomVoteBudget:function(_result){
			GLOBAL_OBJ.table.models.FinalBudget.parse(_result);
        },

        // 玩家离线
        parseTableOnline:function(_result){
            GLOBAL_OBJ.table.models.Online.parse(_result);
        },

        parseTableCall:function(_result)
        {
            switch (_result.action)
            {
                case "crapshoot" :
                    var points = _result.points || [];
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_CRAPSHOOT, points);
                    break;
                case "charging":
                    GLOBAL_OBJ.table.models.charging.parse(_result);
                    break;
                case "ask_charge":
                    GLOBAL_OBJ.table.models.ask_charge.parse(_result);
                    break;
                case "charged":
                    GLOBAL_OBJ.table.models.charged.parse(_result);
                    break;
                case "updateRoundCount"://更新好友场圈数
                    GLOBAL_OBJ.table.models.updateroundcount.parse(_result);
                    break;
                case "ready"://这个是针对金币场的，用来刷新玩家状态的，玩家开始进入牌桌是sit状态，之后通过这个消息刷新，是否要显示游戏开始按钮
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_READY_BUTTON, {});
                    break;
                // 听牌协议
                case "first_begin":  // 天听流程开始
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_BEGIN, {});
                    break;
                case "first_end":    // 天听流程结束
                    GLOBAL_OBJ.table.models.Ting_End.parse(_result);
                    break;
                case "ask_ting":
                    GLOBAL_OBJ.table.models.Ask_Ting.parse(_result);
                    break;
                case "ting_state":
                    GLOBAL_OBJ.table.models.Ting_State.parse(_result);
                    break;
                case "updateTingResult":
                    GLOBAL_OBJ.table.models.Ting_Result.parse(_result);
                    break;
                case "chong_feng":
                    GLOBAL_OBJ.table.models.Chong_Feng.parse(_result);
                    break;
                default:
                    break;
            }
        },

        parseTableShowTaskTips:function(_result)
        {
            GLOBAL_OBJ.table.models.showtasktips.parse(_result);
        },

        //抢杠胡
        parseTableGrabGangHu:function(_result)
        {
            GLOBAL_OBJ.table.models.grabganghu.parse(_result);
        },

        //抢杠胡结果广播
        parseTableNotifyGrabGangHu:function(_result)
        {
            GLOBAL_OBJ.table.models.notifygrabganghu.parse(_result);
        },

        //牌桌提示
        parseTableShowtips:function(_result)
        {
            GLOBAL_OBJ.table.models.showtips.parse(_result);
        },

        //牌局结束最终数据
        parseTableRoundResult:function (_result) {
            GLOBAL_OBJ.table.models.roundresult.parse(_result);
        },

        parseTableFlow:function(_result)
        {
            GLOBAL_OBJ.table.models.Flow.parse(_result);
        },

        // 玩家超时托管
        parseTableNotifyTimeOut:function(_result)
        {
            GLOBAL_OBJ.table.models.notifytimeout.parse(_result);
        },

        parseGenZhuang:function (_result)
        {
            GLOBAL_OBJ.table.models.FollowBanker.parse(_result);
        },

        // 推荐定缺
        parseTableAskAbsence:function (_result) {
            GLOBAL_OBJ.table.models.Absence.parse(_result);
        },

        parseTableAbsenceOwn:function (_result) {
            GLOBAL_OBJ.table.models.Absence_Own.parse(_result);
        },

        parseTableAbsenceEnd:function (_result) {
            GLOBAL_OBJ.table.models.Absence_End.parse(_result);
        },

	};
})();
