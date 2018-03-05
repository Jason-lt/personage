/*****************************************
 *  mahjong_c2s_ex.js
    比赛(新)C2S扩展
 *  mahjong
 *
 *  Created by zengxx on 16-03-28
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    // 请求报名比赛
    GLOBAL_OBJ.businesses.network.C2S.requestMatchSignin = function(_roomId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_SIGN_IN,
            "params": {
                "roomId":_roomId
            }
        });
    };

    // 请求报名下一场比赛
    GLOBAL_OBJ.businesses.network.C2S.requestNextMatch = function(_roomId, _matchInstId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.USER,
            "params":{
                "action"     :"majiang_m_signin_next",
                "room_id"    :_roomId,
                "matchInstId":_matchInstId
            }
        });
    };

    // 请求取消比赛
    GLOBAL_OBJ.businesses.network.C2S.requestMatchSignout = function(_roomId, _matchInstId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_SIGN_OUT,
            "params": {
                "roomId"     :_roomId,
                "matchInstId":_matchInstId
            }
        });
    };

    // 请求比赛列表
    GLOBAL_OBJ.businesses.network.C2S.requestMatchRoomList = function(_roomId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.USER,
            "params":{
                "action":"match_room_list"
            }
        });
    };

    // 请求单场比赛数据，这个只下发会改变的数据
    GLOBAL_OBJ.businesses.network.C2S.requestMatchInfo = function(_roomId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.USER,
            "params":{
                "action"  :'majiang_match_info',
                "room_id" :_roomId
            }
        });
    };

    // 请求比赛奖励
    GLOBAL_OBJ.businesses.network.C2S.requestMatchRewardList = function(_roomId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.USER,
            "params": {
                "action" :"match_reward_list",
                "room_id":_roomId
            }
        });
    };

    // 请求比赛更新数据update
    GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate = function(_roomId, _matchInstId){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_UPDATE,
            "params": {
                "roomId"     :_roomId,
                "matchInstId":_matchInstId
            }
        });
    };

    // 请求比赛状态,这里_matchId老比赛是match_id,新比赛是matchInstId
    GLOBAL_OBJ.businesses.network.C2S.requestMatchState = function(_roomId, _matchId, _matchType){
        var type = _matchType || GLOBAL_OBJ.businesses.scenes.MatchListCenter.static.MATCHTYPE.OLD;
        switch(type){
            case GLOBAL_OBJ.businesses.scenes.MatchListCenter.static.MATCHTYPE.OLD:
                GLOBAL_OBJ.bkernel.network.C2S.send({
                    "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_STATE,
                    "params":{
                        "roomId"  :_roomId,
                        "match_id":_matchId
                    }
                });
                break;
            case GLOBAL_OBJ.businesses.scenes.MatchListCenter.static.MATCHTYPE.MTT:
                GLOBAL_OBJ.bkernel.network.C2S.send({
                    "cmd": GLOBAL_OBJ.businesses.network.EventType.MATCH_STATE,
                    "params":{
                        "roomId"     :_roomId,
                        "matchInstId":_matchId
                    }
                });
                break;
            default:
                return;
        }
    };
})();