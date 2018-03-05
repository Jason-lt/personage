/*****************************************
 *  mahjong_table_model_task_showtasktips.js
    (循环任务)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-07-25
 *  
    协议说明：
        牌桌任务描述协议
    {

        "cmd": "showTaskTips",
        "result":{
            "gameId": 701,
            "roomId": 7309011001,
            "tableId": 73090110010200,
            "loopTaskInfo": "",  //周期描述消息
            "winStreakInfo": "" ,//连胜描述信息
            "loopWinTimesInfo":'' ,//赢几局的描述信息
        }
    }

    使用说明:

 */

guiyang.table.models.showtasktips = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                 = {};
    var PROTOTYPE             = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "gameId", 0, "gameId");
    PROTOTYPE.setPrivateProperty(CACHE, "roomId", 0, "roomId是bigRoomId，不是当前玩牌的具体roomId");
    PROTOTYPE.setPrivateProperty(CACHE, "tableId", 0, "tableId");
    PROTOTYPE.setPrivateProperty(CACHE, "loopTaskInfo", "", "周期描述消息");
    PROTOTYPE.setPrivateProperty(CACHE, "winStreakInfo", "", "连胜描述信息");
    PROTOTYPE.setPrivateProperty(CACHE, "loopWinTimesInfo", "", "赢几局的描述信息");
    PROTOTYPE.setPrivateProperty(CACHE, "winStreakAllDesc", "", "所有连胜任务");

    /* @共享属性 */
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data                    = _data;
        CACHE.loopTaskInfo          = data.loopTaskInfo;
        CACHE.winStreakInfo         = data.winStreakInfo;
        CACHE.loopWinTimesInfo      = data.loopWinTimesInfo;
        CACHE.winStreakAllDesc      = data.winStreakAllDesc;

        // GLOBAL_OBJ.LOGD("showtasktips's data is :", JSON.stringify(data));
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SHOWTASKTIPS, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.showtasktips",
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

        //周期描述消息
        getLoopTaskInfo:function(){
            return CACHE.loopTaskInfo || "";
        },

        //连胜描述信息
        getWinStreakInfo:function(){
            return CACHE.winStreakInfo || "";
        },

        //赢几局的描述信息
        getLoopWinTimesInfo:function(){
            return CACHE.loopWinTimesInfo || "";
        },

        //所有连胜的描述信息
        getStreakAllDescInfo:function(){
            return CACHE.winStreakAllDesc;
        },

    });
})();