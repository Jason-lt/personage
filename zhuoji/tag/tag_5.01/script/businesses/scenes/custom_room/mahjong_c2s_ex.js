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
    var GLOBAL_OBJ = guiyang;
        /*
    请求游戏开始 快速开始 只需要传递playmode*/
    GLOBAL_OBJ.businesses.network.C2S.requestGameStart = function(_playMode, _roomId, _tableId, _where){
        GLOBAL_OBJ.LOGD(this._TAG, "quick_start requestGameStart");
        var plugInVersion = GLOBAL_OBJ.businesses.functions.getMahjPlugInVersion();
        var msg = {
            "cmd": "quick_start",
            "params": {
                "version":plugInVersion,
                "play_mode":_playMode,
                "roomId":_roomId,
                "tableId":_tableId,
                "protocolVer":1
            }
        };
        if (_where){
            msg.params.where = _where
        }
        GLOBAL_OBJ.bkernel.network.C2S.send(msg);
    };

    GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin = function(_playMode, _roomId, _where) {
        GLOBAL_OBJ.LOGD(this._TAG, "quick_start requestGameStartCoin");
        var plugInVersion = GLOBAL_OBJ.businesses.functions.getMahjPlugInVersion();
        var msg = {
            "cmd": "quick_start",
            "params": {
                "version":plugInVersion,
                "play_mode":_playMode,
                "roomId":_roomId,
                "protocolVer":1
            }
        };

        if (_where){
            msg.params.where = _where
        }

        GLOBAL_OBJ.bkernel.network.C2S.send(msg);
    };

    GLOBAL_OBJ.businesses.network.C2S.requestGameStartOnlyPlayMode = function(_playMode, _where) {
        GLOBAL_OBJ.LOGD(this._TAG, "quick_start requestGameStartOnlyPlayMode");
        var plugInVersion = GLOBAL_OBJ.businesses.functions.getMahjPlugInVersion();
        var msg = {
            "cmd": "quick_start",
            "params": {
                "version":plugInVersion,
                "play_mode":_playMode,
                "protocolVer":1
            }
        };

        if (_where){
            msg.params.where = _where
        }

        GLOBAL_OBJ.bkernel.network.C2S.send(msg);
    };

    /*
     @请求 自建桌 信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestCustomRoomInfo  = function( _playModes ){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "game",
            "params": {
                "action":"create_table_info",
                "playModes": _playModes
            }
        });
    };


    //@请求创建 自建桌
    GLOBAL_OBJ.businesses.network.C2S.requestCreateCustomRoom = function(_playMode, _itemParams , _todotaskParams){
        //最开始 通过 ToDoTask 传递过来的参数，层层传递到这里
        //如果 ToDoTask 里面的没有hasRobot ，那么这里就是false
        var _hasRobot = _todotaskParams.hasRobot || 0;
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "game",
            "params": {
                "action":"create_table",
                "play_mode": _playMode,
                "itemParams":_itemParams,
                "hasRobot":_hasRobot
            }
        });
    };

    /*
    @请求创建 自建桌*/
    GLOBAL_OBJ.businesses.network.C2S.requestJoinCustomRoom = function(_code){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "game",
            "params": {
                "action":"join_create_table",
                "createTableNo": _code
            }
        });
    };

    /*
    @请求准备 自建桌*/
    GLOBAL_OBJ.businesses.network.C2S.requestReadyCustomRoom = function(_roomId, _tableId, _seatId){
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
    @请求创建 自建桌*/
    GLOBAL_OBJ.businesses.network.C2S.requestCustomRoomQuit  = function(_roomId, _tableId, _seatId){
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

    
    /*
    @请求创建 自建桌*/
    GLOBAL_OBJ.businesses.network.C2S.requestCustomRoomQuitVote  = function(_roomId, _tableId, _seatId, _vote){
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

    GLOBAL_OBJ.businesses.network.C2S.requestTableChat          = function(_roomId, _tableId, _seatId, _content){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "table_chat",
            "params": {
                "roomId" :_roomId,
                "tableId":_tableId,
                "seatId" :_seatId,
                "isFace" :0,
                "msg":{"seatId":_seatId,"type":0,"content":_content}
            }
        });
    };

    /*
    @ 自建桌  开始下一局
    */
    GLOBAL_OBJ.businesses.network.C2S.requestNextRoundCustomRoom = function(_roomId, _tableId, _seatId){
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

    /*
    @ 自建桌 发起退出投票
    */
    GLOBAL_OBJ.businesses.network.C2S.requestDissolutionCustomRoom = function(_roomId, _tableId, _seatId){
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

    //pk modify:分页请求战绩数据
    GLOBAL_OBJ.businesses.network.C2S.requestCustomRoomRecord = function(params){
        var startRecordIndex = params.startRecordIndex;
        var endRecordIndex = params.endRecordIndex;
        //pk modify:todo 获取到当前玩法列表
        var playModes    = [];//GLOBAL_OBJ.GlobalVars.getCreatePlayModes() || [];
 
        var _param = {
            "action":"create_table_record",
            "startRecordIndex":startRecordIndex||0,
            "endRecordIndex":endRecordIndex || 0,
        }
        if(!params.allRecord){
            //获取所有玩法的话不需要传playModes字段
            //_param.playModes =  playModes
        }
 
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"game",
            "params":_param
        });
    };

    /*
    @ 自建做 邀请有礼  完整信息
    */
    GLOBAL_OBJ.businesses.network.C2S.requestInviteInfo = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"game",
            "params":{
                "action":"query_invite_info"
            }
        });
    };

    /*
    @ 自建做 邀请有礼  绑定我的推荐人
    */
    GLOBAL_OBJ.businesses.network.C2S.requestBindInviteCode = function(_code){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"game",
            "params":{
                "action":"bind_invite_code",
                "inviteCode":_code
            }
        });
    };

    /*
    @ 自建做 邀请有礼  绑定我的推荐人 奖励领取
    */
    GLOBAL_OBJ.businesses.network.C2S.requestGetBindReward = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"game",
            "params":{
                "action":"get_bind_reward"
            }
        });
    };

    /*
    @ 自建做 邀请有礼  推荐别人 奖励领取
    */
    GLOBAL_OBJ.businesses.network.C2S.requestGetInviteReward = function(_uuid){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"game",
            "params":{
                "action":"get_invite_reward",
                "inviteeId":_uuid
            }
        });
    };

    /*
    @ 自建桌 邀请有礼模块请求分享
     */
    GLOBAL_OBJ.businesses.network.C2S.requestFangKaFriendInvite = function(_type){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"user",
            "params":{
                "action":"free_fangka_friend_invite",
                "subType":_type
            }
        });
    };
})();