/*****************************************
 *  mahjong_global.js
    麻将全局变量
 *  mahjong
 *  业务层
 *  Created by nick.kai.lee on 15-12-29
 *  特殊说明：

    使用说明:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.table.global = {};


    GLOBAL_OBJ.table.global.MYSEAT = 0;
    GLOBAL_OBJ.table.global.tableMethodState = 0;

    GLOBAL_OBJ.table.global.CHATRECORDS = 10;//保留10条聊天记录

    /*
    座位号：下，右，上，左，弃牌区(非座位号，只是用来做tag)*/
	GLOBAL_OBJ.table.global.SEATS  = {
        N0:0,
        N1:1,
        N2:2,
        N3:3,
        N4:4
    };

    /*
    风：东，南，西，北*/
    GLOBAL_OBJ.table.global.WINDS  = {
        EAST:0,
        SOUTH:1,
        WEST:2,
        NORTH:3
    };

    /*
    @玩的方法：碰，吃，明杠，暗杠，胡，听，抢听，过，取消，吃（抢听），碰（抢听）
    PS：
    “过”针对吃碰杠
    “取消”针对听牌*/
    GLOBAL_OBJ.table.global.METHODS = {
        CHOW:0,
        PONG:1,
        EXPOSED_KONG:2,
        CONCEALED_KONG:3,
        WIN:4,
        PASS:5,    // 过
        CANCEL:6,
        GRAB_CHOW:7,
        GRAB_PONG:8,
        GRAB_KONG:9,
        TING:10,
        GRAB_HU_KONG:11,
        BACK:12,    // 返回
        AI:13
    };

    /*
     玩法分类*/
    GLOBAL_OBJ.table.global.PLAYMODE = {
        ZhuoJi      : 'zhuoji',
        ErDingGuai  : 'erdingguai',
        SanDingGuai : 'sandingguai',
    };
    
})();