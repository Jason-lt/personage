/*************************************************************
 *  mahjong_table_seat.js
    mahjong_table_seat
 *  mahjong
 	牌桌中和座位号相关的操作
 *
 *  Created by zengxx on 16-06-02
 *  特殊说明：

    使用方法:
 */

(function (){
    var GLOBAL_OBJ = guiyang;
    
	var MAP = {   // 服务器相对自己的位置到本地seat_id的映射
        "0":[],           // 处理还没有初始化的情况
        "2":[0, 2],       // 二人桌
        "3":[0, 1, 3],    // 三人桌
        "4":[0, 1, 2, 3]  // 四人桌
	};

    var U2S = {  // userid到本地seat_id的映射

    };

    var NAMES = ["本家", "下家", "对家", "上家"];

    var NUM = 4;   // 玩家人数
	var ME  = 0;  // 自己的服务器seat_id

	// 每次进入牌桌初始化
    GLOBAL_OBJ.table.utils.Seat.init = function (_param) {
        var players = _param.players || [];
    	NUM = _param.num || players.length;
    	ME  = typeof(_param.seatId)=='undefined'?-1:_param.seatId;

        // 初始化U2S
        U2S = {};
        for (var i = 0; i < players.length; ++i){
            if (typeof(players[i].userId)!='undefined' && typeof(players[i].seatId)!='undefined'){
                U2S[players[i].userId] = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(players[i].seatId);
            }
        }
    };

    GLOBAL_OBJ.table.utils.Seat.getME = function () {
        return ME;
    };
    
    // 根据服务器seat_id获取对应的本地seat_id
    GLOBAL_OBJ.table.utils.Seat.toLocalSeatId = function (_seatId) {
        if (MAP[NUM]){
            return MAP[NUM][(_seatId - ME + NUM) % NUM];
        }
        return -1;
    };

    // 根据本地座位号获取服务器seat_id
    GLOBAL_OBJ.table.utils.Seat.toServerSeatId = function(_localSeatId){
        var localSeatId = _localSeatId || 0; // 默认是自己
        for (var i = 0; i < NUM; ++i){
            if (MAP[NUM][i] == localSeatId){
                return (i + ME) % NUM;
            }
        }
        return -1;
    };

    // 根据玩家id获取对应的本地seat_id
    GLOBAL_OBJ.table.utils.Seat.getLocalSeatIdByUserId = function (_userId) {
        return U2S[_userId]==null?-1:U2S[_userId];
    };

    // 根据本地座位号返回名称  上家  下家  对家
    GLOBAL_OBJ.table.utils.Seat.getNameByLocalSeatId = function(_localSeatId){
        return NAMES[_localSeatId] || "";
    };

    // 某个座位上是否有人
    GLOBAL_OBJ.table.utils.Seat.hasPlayerInSeatId = function(_localSeatId){
        for (var i = 0; i < MAP[NUM].length; ++i){
            if (MAP[NUM][i] == _localSeatId){
                return true;
            }
        }
        return false;
    };
})();