/*****************************************
 *  mahjong_c2s_ex.js
    比赛C2S扩展
 *  mahjong
 *
 *  Created by xujing 2017-11-10
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;

    /**
     * 请求报名比赛
     * @param _roomId 房间ID
     * @param feeIndex 报名费索引
     * @param matchId 比赛ID
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchSignin = function(_roomId, feeIndex, matchId){

        // GLOBAL_OBJ.businesses.scenes.Match.Model.setFeeIndex(_roomId, matchId, feeIndex);

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.ROOM,
            "params": {
                "action": "signin",
                "roomId":_roomId,
                "signinParams":{
                    "feeIndex": feeIndex, // 报名费索引，比赛配置中的索引
                    "matchId": matchId // 比赛ID，不同于roomId，见比赛配置
                }
            }
        });
    };

    /**
     * 请求比赛详情
     * @param _roomId 房间ID
     * @param matchId 比赛ID
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchDes = function(_roomId, matchId){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.ROOM,
            "params": {
                "action": "match_des",
                "roomId":_roomId,
                "matchId": matchId // 比赛ID，不同于roomId，见比赛配置
            }
        });
    };


    /**
     * 请求定时赛详情
     * @param _roomId 房间ID
     */
    GLOBAL_OBJ.businesses.network.C2S.requestTimeMatchDes = function(_roomId){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH,
            "params": {
                "action": "desc",
                "roomId":_roomId
            }
        });
    };



    /**
     * 退赛
     * @param _roomId 房间号
     * @param _matchId 比赛ID
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchSignout = function(_roomId, _matchId){

        // {
        //     "cmd": "room",
        //         "params": {
        //             "gameId": 701,
        //             "matchId": 701221,
        //             "userId": 10788,
        //             "action": "match_giveup",
        //             "roomId": 7012201000
        //     }
        // }

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.ROOM,
            "params": {
                "action" : "match_giveup",
                "roomId" : _roomId,
                "matchId" : _matchId
            }
        });
    };


    /*===================== 以下是定时赛协议 ============================*/

    /**
     * 退赛（定时赛）
     * @param _roomId 房间号
     */
    GLOBAL_OBJ.businesses.network.C2S.requestTimeMatchSignout = function(_roomId){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH,
            "params": {
                "action":"signout",
                "roomId":_roomId
            }
        });
    };

    /**
     * 报名（定时赛）
     * @param _roomId 房间号
     * @param feeIndex 报名费索引
     */
    GLOBAL_OBJ.businesses.network.C2S.requestTimeMatchSignin = function(_roomId, feeIndex){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH,
            "params": {
                "action" : "signin",
                "roomId" : _roomId,
                "fee": feeIndex, // 报名费索引，比赛配置中的索引
                "signinParams": {
                }
            }
        });
    };

    /**
     * 进入等待（定时赛）
     * @param _roomId 房间号
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchEnter = function(_roomId){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH,
            "params": {
                "action" : "enter",
                "roomId" : _roomId
            }
        });
    };

    /**
     * 离开等待面板（定时赛）
     * @param _roomId 房间号
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchLeave = function(_roomId){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH,
            "params": {
                "action" : "leave",
                "roomId" : _roomId
            }
        });
    };

    /**
     * 获取排行榜（定时赛）
     * @param _roomId 房间号
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchRank = function(_roomId){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH,
            "params": {
                "action" : "rank",
                "roomId" : _roomId
            }
        });
    };

    /**
     * 获取排行榜（定时赛）
     * @param _roomId 房间号
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate = function(_roomId){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH,
            "params": {
                "action" : "update",
                "roomId" : _roomId
            }
        });
    };


    /**
     * 获取比赛报名状态列表（定时赛）
     */
    GLOBAL_OBJ.businesses.network.C2S.requestMatchSigns = function(){

        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.GAME,
            "params": {
                "action" : "signs"
            }
        });
    };
})();