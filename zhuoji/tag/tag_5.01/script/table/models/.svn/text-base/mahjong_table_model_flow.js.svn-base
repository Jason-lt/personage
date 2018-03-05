/*****************************************
 *  mahjong_table_model_flow.js
    牌桌相关model
 *  mahjong
 *
 *  Created by simon on 17-06-19
 *  
    协议说明：
    四川血战玩法的 牌局流水
 */

guiyang.table.models.Flow = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE             = {};
    var PROTOTYPE         = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "gameId",     -1, "gameId");
    PROTOTYPE.setPrivateProperty(CACHE, "roomId",     -1, "roomId");
    PROTOTYPE.setPrivateProperty(CACHE, "tableId",    -1, "tableId");
    PROTOTYPE.setPrivateProperty(CACHE, "seatId",     -1, "seatId");
    PROTOTYPE.setPrivateProperty(CACHE, "userId",     -1, "userId");
    PROTOTYPE.setPrivateProperty(CACHE, "totalScore",  0, "totalScore");
    PROTOTYPE.setPrivateProperty(CACHE, "maxFanDesc",  "", "maxFanDesc");
    PROTOTYPE.setPrivateProperty(CACHE, "detailDescList", [], "detailDescList");


    /* @共享属性 */
    //PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );
    
    /* @数据通知*/
    var ___f_notificate   = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }

        var data         = _data;
        CACHE.gameId     = data.gameId;
        CACHE.roomId     = data.roomId;
        CACHE.tableId    = data.tableId;
        CACHE.seatId     = data.seatId;
        CACHE.userId     = data.userId;
        CACHE.totalScore = data.totalScore;
        CACHE.maxFanDesc = data.maxFanDesc;
        CACHE.detailDescList = data.detailDescList;

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        // GLOBAL_OBJ.LOGD("table_flow_data:", JSON.stringify(data));

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_FLOW, data);
        }
        return _slient
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Flow",

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

        getTotalScore:function()
        {
            return CACHE.totalScore[0];
        },

        getMaxFanDesc:function()
        {
            return CACHE.maxFanDesc;
        },

        getDetailDescList:function(_seatId)
        {
            var data = CACHE.detailDescList[_seatId] || [];
            for (var i = 0; i < data.length; i++)
            {
                if (data[i][0] == "")
                {
                    data.splice(i, 1);
                    i -= 1;
                }
            }
            return data;
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
                cmds = {
                    "cmd": "detailInfo",
                    "result":{
                        "gameId": 701,
                        "roomId": 7309011001,
                        "tableId": 73090110010200,
                        "seatId": 0,
                        "tiles": [0,0,0], //用户换来的三张
                        "huanRule": 1 // 1:顺时针 2:逆时针 3:对换
                    }
                }
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();