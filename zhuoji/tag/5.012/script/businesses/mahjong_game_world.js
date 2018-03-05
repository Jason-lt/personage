/*****************************************
 *  mahjong_game_world.js
    GameWorld
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-29
 *  特殊说明：

    使用说明:

 */
(function(){
	var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.businesses.GameWorld = {
		_TAG:"businesses.GameWorld",
		boot:function() {
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");

            /*
            实现窗体工厂的注册函数
            */
            GLOBAL_OBJ.bkernel.windows.Factory.REGS(function(){
                GLOBAL_OBJ.LOGD(GLOBAL_OBJ.businesses.GameWorld._TAG,"业务层开始注册窗体");
                var regs          = {};
                var ___f_template = GLOBAL_OBJ.bkernel.windows.Factory.REGS_TEMPLATE || function(){};

                regs[GLOBAL_OBJ.businesses.windows.consts.C_GENERAL_COMMON] = ___f_template(
                    GLOBAL_OBJ.businesses.windows.GeneralBoxes.Common,
                    GLOBAL_OBJ.RES.GENERAL_COMMON_WND_CCBI, null, null, "scale", "通用弹窗");

                regs[GLOBAL_OBJ.businesses.windows.consts.C_GENERAL_WECHAT_SHARE] = ___f_template(
                    GLOBAL_OBJ.businesses.windows.GeneralBoxes.WeChatShare,
                    GLOBAL_OBJ.RES.GENERAL_COMMON_WND_CCBI, null, null, "scale", "微信分享");

                regs[GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_HALL] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.CreateWindowNew,
                    GLOBAL_OBJ.RES.CREATE_ROOM_WND_HALL_CCBI, null, null, "none", "大厅创建自建桌");

                regs[GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_RECORD_HALL] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordWindow,
                    GLOBAL_OBJ.RES.CREATE_ROOM_RECORD_WND_HALL_CCBI, null, null, "none", "大厅自建桌我的战绩弹窗");
                
                regs[GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.TableRecordWindow,
                    GLOBAL_OBJ.RES.CREATE_ROOM_RECORD_WND_CCBI, null, null, "none", "自建桌牌局回放列表");

                regs[GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_01] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.TableRecordWindow,
                    GLOBAL_OBJ.RES.CREATE_ROOM_RECORD_WND_01_CCBI, null, null, "none", "牌桌玩法弹窗");

                regs[GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_MANAGE] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.TableRecordManageWindow,
                    GLOBAL_OBJ.RES.CREATE_ROOM_TABLE_RECORD_MANAGE_WND_CCBI, null, null, "none", "自建桌牌局回放控制器窗口");

                // regs[GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_RULES] = ___f_template(
                //     GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesWindow,
                //     GLOBAL_OBJ.RES.CREATE_ROOM_RULES_WND_CCBI, null, null, "none", "自建桌玩法介绍弹窗");

                regs[GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW] = ___f_template(
                    GLOBAL_OBJ.businesses.windows.Portraits.Basic, GLOBAL_OBJ.RES.PORTRAITBASIC_CCBI,null,null,"none","头像基础窗体");

                regs[GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_LOADING] = ___f_template(
                    GLOBAL_OBJ.businesses.modules.TableRecord.LoadingWindow, GLOBAL_OBJ.RES.CREATE_ROOM_TABLE_RECORD_LOADING_WND_CCBI,null,null,"none","下载回放数据loading");

                //pk modify:大厅自建桌玩法介绍弹窗
                regs[GLOBAL_OBJ.businesses.windows.consts.CREATE_ROOM_RULES_WND_HALL] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesWindowHall,
                    GLOBAL_OBJ.RES.CREATE_ROOM_RULES_WND_HALL_CCBI, null, null, "none", "大厅自建桌玩法介绍弹窗");

                //玩法介绍弹窗
                regs[GLOBAL_OBJ.businesses.windows.consts.GDMJ_INTRODUCTION_WND] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntroduction,
                    GLOBAL_OBJ.RES.GDMJ_INTRODUCTION_CCBI, null, null, "none", "玩法介绍弹窗");
                    
                regs[GLOBAL_OBJ.businesses.windows.consts.CREATE_ROOM_YJFK_WND] = ___f_template(
                    GLOBAL_OBJ.businesses.scenes.CustomRoom.SuggestionWindowHall,
                    GLOBAL_OBJ.RES.CREATE_ROOM_YJFK_WND_CCBI, null, null, "none", "大厅意见反馈弹窗");

                regs[GLOBAL_OBJ.businesses.windows.consts.POP_ORDER_INFO_WIN] = ___f_template(
                    GLOBAL_OBJ.businesses.windows.CoinLackMainView,
                    GLOBAL_OBJ.RES.MAHJ_COINLACK_MAIN_CCBI, null, null, "none", "金币购买");
                /*
                必须有返回值
                */
                return regs;
            });

            /*
            @请求频率控制*/
            GLOBAL_OBJ.bkernel.network.C2SFrequency.REGS(function(){
                var config                                        = {};
                config[GLOBAL_OBJ.businesses.network.EventType.USER] = {
                    table_raffle:{time:600,key:"roomId"},
                    table_raffle_simple:{time:600,key:"roomId"},
                    lucky_raffle:{time:600},
                    match_reward_info:{time:7200,key:"room_id"},
                    match_room_list:{time:3600},
                    majiang_match_back_to_list:{time:5},
                    mj_timestamp:{time:60},
                };

                config[GLOBAL_OBJ.businesses.network.EventType.HALL] = {
                    vipTableListUpdate:{time:5},
                };

                config[GLOBAL_OBJ.businesses.network.EventType.GAME] = {
                    create_table_record:{time:600},
                    query_invite_info:{time:180},
                    in_table_check:{time:5, key:"target"},
                };

                config[ GLOBAL_OBJ.businesses.network.EventType.MATCH_UPDATE] = { time:30, key:"roomId" };

                return config;
            });
        },

        shut:function() {
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        /*
        @       处理CMD       */
        /*
        处理USER模块
        */
        parseUSER:function(_result){
            // 同步服务器时间戳
            GLOBAL_OBJ.businesses.modules.TimeSync.Model.parse(_result);
            GLOBAL_OBJ.businesses.scenes.Match.Models.List.parse(_result);
        },

        /*
         处理friend_call模块
         */
        parseFriendCall:function(_result){
        },

        /*
         处理mahjong_todotask模块
         */
        parseTodotasks:function(_result){
            //GLOBAL_OBJ.LOGD(this._TAG,"parseTodotasks  _result:"+JSON.stringify(_result));
            GLOBAL_OBJ.bkernel.utils.ToDoTasks.parse(_result.tasks);
        },

        /*
         处理task_system模块
         */
        parseTaskSystem:function(_result){
        },

        /*
         处理match_rank_list模块
         */
        parseMatchRankList:function(_result){
        },

        /*
         自己胡牌或者已经有第三个人胡牌了
         */
        parseTableOver:function(_result){
            // GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.TABLE_OVER,{});
        },
        
        /*
         刷新比赛数据
         */
        parseMatchUpdate:function(_result){
        
        },
        /*
         刷新比赛房间数据
         */
        parseMatchRoomList:function(_result){
            GLOBAL_OBJ.businesses.scenes.Match.Models.List.parse(_result);
        },

        /*
         刷新比赛状态
         */
        parseMatchState:function(_result){
        },

        /*
         各个比赛报名状态
         */
        parseMatchSigns:function(_result){
        },

        /*
          刷新数据，和m_update类似
         */
        parseMatchNote:function(_result){
        },

        /*
          自建桌信息
         */
        parseCreateRoom:function(_result){
            GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.parse(_result);
        },

        /*
          房间列表
         */
        parseRoomList:function(_result){
            GLOBAL_OBJ.businesses.scenes.RoomList.Model.parse(_result)
        },

        /*
          发牌退出自建桌投票
        */
        parseCreateTableDissolution:function(_result){
            GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.parseFromCreateTableDissolution(_result);
        },

        /*
          退出自建桌投票结果
        */
        parseUserLeaveVote:function(_result){
            GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.parseFromUserLeaveVote(_result);
        },

        /*
          贵宾桌
        */
        parseVipRoomList:function(_result){
        },

        /*
          自建桌 邀请有礼
        */
        parseInviteInfo:function(_result){
        },

        /*
          语音走table_chat
        */
        parseTableChat:function(_result){
            GLOBAL_OBJ.businesses.windows.VoiceTalking.Model.parse(_result);
        },
    };
})();
