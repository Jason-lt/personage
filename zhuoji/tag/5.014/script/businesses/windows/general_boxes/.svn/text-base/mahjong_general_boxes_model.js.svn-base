/*****************************************
 *  mahjong_general_boxes_model.js
    通用弹窗model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-21
 *  特殊说明：
    1.数据存储不直接暴露出去
    2.要什么功能提供什么接口函数，外部view不参与数据处理，完全放权给model
    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model = (function(){
        /*
         @数据缓存*/
        var CACHE      = {
            Tasks:{},
            Content:""
        };

        /*
         @映射，根据id获取下标*/
        var MAP        = {};

        return {
            _TAG:"businesses.windows.GeneralBoxes.Model",
            parse:function(_action,_data){
                /*
                 @_data是协议中的result [{"cmd":"user","result":{}}]
                 */
                this.parseDetail(_action,_data);
            },

            /*@ public interface*/
            /*
             激活model，发送一次数据
             返回值：false数据为空
             */
            activate:function(){
                // GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_GENERAL_BOXES, {});
            },

            /*
             @获取task*/
            getTask:function(_action){
                return CACHE.Tasks[_action];
            },

            /*
             @清理缓存task*/
            clean:function(_action){
                CACHE.Tasks[_action] = null;
            },

            /*
             以下接口都是私有接口 private interface
             TODO:
             实现数据的组装&通知的抛出
             */

            /*
             @解析详细信息
             */
            parseDetail:function(_action,_data){
                var data    = _data;
                var action  = _action;
                if (!data) { return; };
                CACHE.Tasks[action] = data;
                // GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_GENERAL_BOXES,{});
            },

        };
    })();
})();

