/*****************************************
 *  mahjong_tips_model.js
    tip系统model
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
    GLOBAL_OBJ.businesses.modules.Tips.Model = (function(){
        var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
        var CONSTS       = GLOBAL_OBJ.businesses.modules.Tips.Consts;
        /*
         @数据缓存*/
        var CACHE        = {
            Content : {
            },
        };
        CACHE.Content[CONSTS.TIPS_0000] = {
            local:{content:"",duration:0},
            remote:[]
        };//幸运转盘美女
        CACHE.Content[CONSTS.TIPS_0001] = {
            local:{content:"",duration:0},
            remote:[]
        };//拜雀神财神
        return {
            _TAG:"businesses.modules.Tips.Model",
            parse:function(_data){
                var data   = _data;
                var action = data["action"] || "";

                switch(action){
                    case "get_lucky_raffle_tips":
                        this.parseCommon(CONSTS.TIPS_0000,data);
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIPS_0000,{});
                        break;
                    case "get_table_raffle_tips":
                        this.parseCommon(CONSTS.TIPS_0001,data);
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIPS_0001,{});
                        break;
                    default:
                        break;
                };
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空
             */
            activate:function(){
            },

            /*
             外部获取数据接口
             */

            /*
             @根据具体注册id读取对应的内容,删除数组第一个元素*/
            shift:function(_id){
                var contents = CACHE.Content[_id]||[];
                return contents.remote.shift();
            },

            /*
             @根据具体注册id读取对应的内容*/
            getContent:function(_id){
                var contents = CACHE.Content[_id]||{};
                if (null == contents.remote[0]) {
                    return contents.local.content;
                }else{
                    var data = contents.remote[0]||{};
                    return data.content;
                };
            },

            /*
             @根据具体注册id读取对应的内容展示的时间间隔*/
            getDuration:function(_id){
                var contents = CACHE.Content[_id]||{};
                if (null == contents.remote[0]) {
                    return contents.local.duration;
                }else{
                    var data = contents.remote[0]||{};
                    return data.duration;
                };
            },

            /*
             @根据具体注册id读取对应的内容数组的长度*/
            count:function(_id){
                var contents = CACHE.Content[_id]||[];
                return contents.remote.length;
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
                var contents = CACHE.Content[_id]||{};
                var tips    = data.tips||[];
                for(var i in tips){
                    contents.remote.push(tips[i])
                };
            },
        };
    })();
})();
