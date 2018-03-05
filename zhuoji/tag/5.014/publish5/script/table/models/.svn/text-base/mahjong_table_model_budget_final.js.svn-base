/*****************************************
 *  mahjong_table_model_budget_final.js
    牌桌结算相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-11-24
 *
    协议说明：
    对应 cmd：gaming_leave_display_budget

    使用说明:

 */

guiyang.table.models.FinalBudget  = (function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                  = {};
    var PROTOTYPE              = GLOBAL_OBJ.table.models.Prototype;

    PROTOTYPE.setPrivateProperty(CACHE, "terminate",  0, "是否是中途退出游戏");
    PROTOTYPE.setPrivateProperty(CACHE, "time",  0, "结算时间戳");
    PROTOTYPE.setPrivateProperty(CACHE, "voteHost", -1, "解散人");

    /* @私有属性 */
    for(var i = 0 ; i < 4 ; ++i){
        PROTOTYPE.setPrivateProperty(CACHE, i,  {}, i+"#座位（本地座位号）玩家");

        PROTOTYPE.setPrivateProperty(CACHE[i], "userId",  0, "结算玩家uid");
        PROTOTYPE.setPrivateProperty(CACHE[i], "activeSeatId",  -1, "结算玩家服务器座位号");

        /*  地方麻将区间 */
        PROTOTYPE.setPrivateProperty(CACHE[i], "region", {}, "地方麻将的数据");
    };

    /* @共享属性 */

    /* @数据通知*/
    var ___f_notificate   = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };

        var data        = _data;
        CACHE.terminate = data.terminate;
        /*  鄱阳区间 */
        var detail = data.detail || [];
        for(var i = 0 ; i < detail.length; ++i){
            var localSeatId          = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( detail[i].sid );
            /*  国标区间 */
            CACHE[localSeatId].userId             = GLOBAL_OBJ.table.models.TableInfo.getPlayer( localSeatId );
            CACHE[localSeatId].activeSeatId       = detail[i].sid;

            CACHE[localSeatId].region = {};

            // CACHE[localSeatId].region.delta_score = detail[i].delta_score;
            CACHE[localSeatId].region.total_delta_score = detail[i].total_delta_score;
            CACHE[localSeatId].region.statistics  = detail[i].statistics || [];
            CACHE[localSeatId].region.title  = detail[i].head_mark;
        };
        CACHE.time = data.create_table_extend_info.time;
        CACHE.voteHost = data.create_table_extend_info.voteHost;
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOTE_BUDGET, data);
        };
        return _slient
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.FinalBudget",

                /*
        公有数据+接口
        TODO:
        外部调用
        */
        /* 协议解析*/
        parse:function(_data, _slient){
            var data = _data;
            if (!data){
                return;
            };
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            return false;
        },

        /*
        胡牌玩家userid
        */
        getUserId:function(_localSeatId){
            return CACHE[_localSeatId].userId;
        },

        /*
        获得胡牌玩家的 本地座位号*/
        getActiveLocalSeatId:function(_localSeatId){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE[_localSeatId].activeSeatId );
        },

        isTerminated:function(){
            return CACHE.terminate;
        },

        getCustomTableVoteHost:function(){
            return CACHE.voteHost; 
        },

        /*  鄱阳区间 */
        getRegionTime:function(_localSeatId){
            return CACHE.time || 0;
        },

        getRegionTotalPoint:function(_localSeatId){
            var poYang = CACHE[_localSeatId].region;
            return poYang.total_delta_score || 0;
        },

        getRegionPlayerTitle:function(_localSeatId){
            var poYang = CACHE[_localSeatId].region;
            return poYang.title || 0;
        },

        getRegionStatistics:function(_localSeatId){
            var poYang = CACHE[_localSeatId].region;
            return poYang.statistics || [];
        },
        getTotalDeltaScore : function(_localSeatId){
            var poYang = CACHE[_localSeatId].region;
            return poYang.total_delta_score || 0;
        },
        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            var cmds = {};
            switch(_index){
                case 0:
                cmds = {"cmd":"gaming_leave_display_budget","result":{ "terminate":0,"roomId":78131001,"detail":[{"sid":1,"total_delta_score":-2,"statistics":[{"desc":"自摸","value":0},{"desc":"点炮","value":1},{"desc":"明杠","value":0},{"desc":"明四归","value":10},{"desc":"暗四归","value":10},{"desc":"大三元","value":0},{"desc":"小三元","value":0},{"desc":"暗杠","value":0}],"head_mark":"dianpao_most"},{"sid":0,"total_delta_score":2,"statistics":[{"desc":"自摸","value":0},{"desc":"点炮","value":0},{"desc":"明杠","value":0},{"desc":"暗杠","value":0},{"desc":"最大番数","value":2}],"head_mark":""}],"gameId":7}};
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();
