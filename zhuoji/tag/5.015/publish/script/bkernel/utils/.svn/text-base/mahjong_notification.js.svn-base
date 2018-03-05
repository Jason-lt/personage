/*****************************************
 *  mahjong_notification.js
    通知中心
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-29
 *  特殊说明：
    为了使用ignoreAll方法不得已而为之，争取让框架添加进去
    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.bkernel.utils.Notification = (function(){
        var TAG = 'bkernel.utils.Notification';
        var events = {};

        return {
            listen:function(eName, handler, scope){
                if(typeof(handler) == 'undefined') return;
                if (eName == 'SHOW_METHOD_BTN'){
                    GLOBAL_OBJ.LOGD(TAG, 'SHOW_METHOD_BTN');
                }
                events[eName] = events[eName] || [];
                events[eName].push({
                    scope: scope || this,
                    handler: handler
                });
                return handler; //返回回调函数的handler
            },
            ignore:function(eName, handler, scope){
                scope = scope || this;
                if (eName == 'SHOW_METHOD_BTN'){
                    GLOBAL_OBJ.LOGD(TAG, 'SHOW_METHOD_BTN');
                }
                var fns = events[eName];

                if(!fns) 
                    return;

                events[eName] = fns.filter(function(fn){
                    if(typeof(fn) != 'undefined')
                    {
                        return fn.scope!=scope || fn.handler!=handler;  
                    }
                });
            },
            ignoreAll:function(_scope){
                if (!_scope) {
                    var errMsg = 'take care , NotificationCenter function ignoreAll needs a parameter!';
                    GLOBAL_OBJ.LOGD(TAG, errMsg);
                    throw new Error(errMsg);
                    //return; 此代码不可达
                }
                for(var eName in events){
                    var fns = events[eName];
                    if(!fns) continue;
                    
                    events[eName] = fns.filter(function(fn){
                        var ret = fn.scope!=_scope;
                        if (!ret) {//log 释放的事件
                            GLOBAL_OBJ.LOGD(_scope._TAG+" 释放 "+eName);
                        }
                        return ret
                    });
                }
            },
            trigger:function(eventName,params){
                var fns = events[eventName],i,fn;

                if (eventName == 'SHOW_METHOD_BTN'){
                    GLOBAL_OBJ.LOGD(TAG, 'SHOW_METHOD_BTN');
                }
                
                if(!fns) {
                  return;
                }
                // cc.log('12222222222');

                // for (var i = 0; i < params.length; i++) {
                //    cc.log("arg"+i+"  = "+ params[i]);
                // }
                
                var ___additional = { name : eventName }; // 附加参数add by likai
                for(i=0;fn=fns[i];i++){
                    // fn.handler.apply(fns.scope, params||[]);
                    // 用call直接把各个参数回调出去
                    if(typeof(fn) != 'undefined'){
                        fn.handler.call(fn.scope, params, ___additional);
                    }
                }
            },

            // 获取当前事件有多少个观察者
            count:function( eventName) {
                events[eventName] = events[eventName] || [];
                return events[eventName].length;
            }
        };
    })();
})();
