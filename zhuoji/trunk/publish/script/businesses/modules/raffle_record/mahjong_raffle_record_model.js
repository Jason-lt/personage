/*****************************************
 *  mahjong_raffle_record_model.js
    抽奖记录系统model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-02-22
 *  特殊说明：
    1.数据存储不直接暴露出去
    2.要什么功能提供什么接口函数，外部view不参与数据处理，完全放权给model
    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.modules.RaffleRecord.Model = (function(){
        var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
        var CONSTS       = GLOBAL_OBJ.businesses.modules.RaffleRecord.Consts;
        /*
         @数据缓存*/
        var CACHE        = {
            Content : {
            },
            LastContent:null,//最后一条数据
        };
        CACHE.Content[CONSTS.RAFFLERECORD_0000] = [];//幸运转盘
        CACHE.Content[CONSTS.RAFFLERECORD_0001] = [];//拜雀神

        var RECORDS      = {};
        return {
            _TAG:"businesses.modules.RaffleRecord.Model",
            parse:function(_data){
                var data   = _data;
                var action = data["action"] || "";

                switch(action){
                    case "get_lucky_raffle_records":
                        if(true == this.parseCommon(CONSTS.RAFFLERECORD_0000,data)){
                            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_RAFFLERECORD_0000,{});
                        };
                        break;
                    case "get_table_raffle_records":
                        if(true == this.parseCommon(CONSTS.RAFFLERECORD_0001,data)){
                            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_RAFFLERECORD_0001,{});
                        };
                        break;
                    default:
                        break;
                };
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空
             */
            activate:function(_id){
                switch(_id){
                    case CONSTS.RAFFLERECORD_0000:
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_RAFFLERECORD_0000,{});
                        break;
                    case CONSTS.RAFFLERECORD_0001:
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_RAFFLERECORD_0001,{});
                        break;
                };
            },

            /*
             外部获取数据接口
             */

            /*
             @根据具体注册id读取对应的内容,删除数组第一个元素*/
            shift:function(_id){
                var contents = CACHE.Content[_id]||[];
                if (contents.length==1) {
                    CACHE.LastContent = contents[0];//缓存住最后一条
                };
                return contents.shift() || CACHE.LastContent;
            },

            /*
             @根据id获取数组第一条记录的播放时间*/
            getDuration:function(_id){
                var contents = CACHE.Content[_id]||[];
                if (contents.length>0) {
                    return contents[0].duration||1;
                }else{
                    return 1;
                };
            },

            /*
             @根据id获取数组第一条记录的中奖时间*/
            getTime:function(_id){
                var contents = CACHE.Content[_id]||[];
                var content  = contents[0]||CACHE.LastContent;
                if (null!=content) {
                    var d = new Date(content.timestamp*1000)
                    return "["+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"]";
                }else{
                    return null;
                };
            },

            getRewards:function(_id){
                var contents    = CACHE.Content[_id]||[];
                var content     = contents[0]||CACHE.LastContent;
                if (null!=content) {
                    var rewards = content.rewards;
                    return rewards[0].name+"x"+rewards[0].amount;
                }else{
                    return null;
                };
            },

            /*
             @根据id获取数组第一条记录的中奖者名字*/
            getName:function(_id){
                var contents = CACHE.Content[_id]||[];
                var content  = contents[0]||CACHE.LastContent;
                if (null!=content) {
                    return content.nickname;
                }else{
                    return null;
                };
            },

            /*
             @根据具体注册id读取对应的内容数组的长度*/
            count:function(_id){
                var contents = CACHE.Content[_id]||[];
                return contents.length;
            },

            /*
             以下接口都是私有接口
             TODO:
             实现数据的组装&通知的抛出
             */
            parseCommon:function(_id,_data){
                var data = _data;
                if (!data){
                    return ;
                };
                var ret      = false;
                var contents = CACHE.Content[_id]||[];
                var records  = data.records||[];
                for(var i in records){
                    var key  = records[i].userId+records[i].timestamp;
                    //只有没有播放过的记录才允许播放
                    if (null == RECORDS[key]) {
                        contents.push(records[i]);
                        RECORDS[key] = true;
                        ret          = true;
                    };
                };
                if (ret) {

                };
                return ret;
            },
        };
    })();
})();

