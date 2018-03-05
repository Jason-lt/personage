/*****************************************
 *  mahjong_c2s_ex.js
    房间列表 C2S扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-07
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*
    请求房间列表信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestRoomList = function(_playMode){
        var plugInVersion = GLOBAL_OBJ.businesses.functions.getMahjPlugInVersion();
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "room_list",
            "params": {
                "version":parseFloat(plugInVersion),
                "play_mode":_playMode
            }
        });
    };

    /*
    请求VIP房间列表信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestVipRoomList = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "hall",
            "params": {
                "action":"vipTableList",
                "version":"1.0"
            }
        });
    };

    /*
    请求VIP房间列表更新信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestVipRoomListUpdate = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "hall",
            "params": {
                "action":"vipTableListUpdate",
                "version":"1.0"
            }
        });
    };

    /**
     * 请求房间列表实时在线人数
     * @param _playMode
     */
    GLOBAL_OBJ.businesses.network.C2S.requestRoomOnline = function(_playMode){
        var plugInVersion = GLOBAL_OBJ.businesses.functions.getMahjPlugInVersion();
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": GLOBAL_OBJ.businesses.network.EventType.GAME,
            "params": {
                "action" : "room_online",
                "play_mode":_playMode
            }
        });
    };

})();