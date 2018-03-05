/*****************************************
 *  mahjong_c2s_ex.js
    比赛 C2S扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-09-05
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    // 请求比赛列表信息
    GLOBAL_OBJ.businesses.network.C2S.requestMatchCenterInfo = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.USER,
            "params":{
                "action":"match_room_list"
            }
        });
    };

    // 请求单场比赛数据，这个只下发会改变的数据
    GLOBAL_OBJ.businesses.network.C2S.requestMatchCenterSingleInfo = function(_roomId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.USER,
            "params":{
                "action"  :'majiang_match_info',
                "room_id" :_roomId
            }
        });
    };

    // 请求比赛奖励
    GLOBAL_OBJ.businesses.network.C2S.requestMatchCenterRewardInfo = function(_roomId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.USER,
            "params": {
                "action" :"match_reward_list",
                "room_id":_roomId
            }
        });
    };

    // 请求报名新比赛 3
    GLOBAL_OBJ.businesses.network.C2S.requestMatchCenterSignIn = function(_roomId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_SIGN_IN,
            "params": {
                "roomId":_roomId
            }
        });
    };

    // 取消报名新比赛 3
    GLOBAL_OBJ.businesses.network.C2S.requestMatchCenterCancelSignedIn = function(_roomId, _matchInstId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_SIGN_OUT,
            "params": {
                "roomId"     :_roomId,
                "matchInstId":_matchInstId
            }
        });
    };

    // 请求比赛更新在线人数数据update
    GLOBAL_OBJ.businesses.network.C2S.requestMatchCenterUpdate = function(_roomId, _matchInstId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_UPDATE,
            "params": {
                "roomId"     :_roomId,
                "matchInstId":_matchInstId
            }
        });
    };
})();