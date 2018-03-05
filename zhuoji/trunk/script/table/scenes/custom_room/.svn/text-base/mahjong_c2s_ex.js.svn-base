/*****************************************
 *  mahjong_c2s_ex.js
    自建桌 C2S扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-06-22
 *  特殊说明：

    使用说明:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    /*
    @请求准备 自建桌*/
    GLOBAL_OBJ.table.network.C2S.requestReady = function(_roomId, _tableId, _seatId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"ready",
                "seatId":_seatId,
                "tableId":_tableId,
                "roomId":_roomId
            }
        });
    };

    /*
    @ 自建桌 等待界面邀请
     */
    GLOBAL_OBJ.table.network.C2S.requestInvite = function(_roomId, _tableId, _seatId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"table_call",
            "params":{
                "action":"create_friend_invite",
                "seatId":_seatId,
                "tableId":_tableId,
                "roomId":_roomId
            }
        });
    };

        /*
    @ 自建桌 发起退出投票 （开始1局后）
    */
    GLOBAL_OBJ.table.network.C2S.requestVoteQuit = function(_roomId, _tableId, _seatId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"table_call",
            "params":{
                "action" :"create_table_dissolution",
                "roomId" :_roomId,
                "tableId":_tableId,
                "seatId" :_seatId,
            }
        });
    };

    GLOBAL_OBJ.table.network.C2S.standUp  = function(_roomId, _tableId, _seatId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "table",
            "params": {
                "action":"stand_up",
                "roomId" :_roomId,
                "tableId":_tableId,
                "seatId" :_seatId
            }
        });
    };

    GLOBAL_OBJ.table.network.C2S.requestVote  = function(_roomId, _tableId, _seatId, _vote){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"user_leave_vote",
                "roomId" :_roomId,
                "tableId":_tableId,
                "seatId" :_seatId,
                "vote":_vote,
            }
        });
    };

    /*
    @请求退出 自建桌 （没开始）*/
    GLOBAL_OBJ.table.network.C2S.requestQuit  = function(_roomId, _tableId, _seatId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"create_table_user_leave",
                "roomId":_roomId,
                "tableId":_tableId,
                "seatId":_seatId
            }
        });
    };

    GLOBAL_OBJ.table.network.C2S.requestNextRound = function(_roomId, _tableId, _seatId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"table_call",
            "params":{
                "action" :"next_round",
                "roomId" :_roomId,
                "tableId":_tableId,
                "seatId" :_seatId,
            }
        });
    };
    
})();