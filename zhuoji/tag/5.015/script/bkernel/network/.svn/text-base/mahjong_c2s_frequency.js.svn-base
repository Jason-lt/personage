/*******************************************************
 *  mahjong_c2s_frequency.js
    C2S时间频率控制器
 *  mahjong
 *
 *  Created by zengxinxin on 15-11-30
 *  特殊说明：

    1.网络协议由cmd+result构成，而具体协议除了cmd外，在result字段中还有action字段
    2.所以协议分类为：
        a. cmd
        b. cmd+id
        c. cmd+action
        d. cmd+action+id
    3.绑定示例举例：

    时间阈值设定
    var CONFIG = {
        "a-CMD":600,
        "b-CMD":600,
        "c-CMD":{"c1-Action":300,"c2-Action":400},
        "d-CMD":{"d1-Action":300,"d2-Action":400},
    };
    
    协议时间阈值记录
    var RECORD = {
        "a-CMD":0,
        "b-CMD":{},
        "c-CMD":{"c1-Action":0,"c2-Action":0},
        "d-CMD":{"d1-Action":{},"d2-Action":{}},
    };
    
    协议时间阈值记录&读取是否有针对唯一字段存储，如id
    var PARAMETERS = {        
        "a-CMD":null,
        "b-CMD":"id",
        "c-CMD":{"c1-Action":null,"c2-Action":null},
        "d-CMD":{"d1-Action":"id1","d2-Action":"id1"},
    };

    使用说明:
*/

(function(){
    var GLOBAL_OBJ = guiyang;
    /*
    配置请求频率
    */
    var CONFIG = {};

    /*
    @精确到id的时间记录
    比如请求玩家信息，每个玩家都有一个请求时间记录
    */
    var RECORD = {};
    

    /*
    id字段所对应协议里的字段
    */
    var PARAMETERS = {};

    GLOBAL_OBJ.bkernel.network.C2SFrequency = {
        _TAG:"bkernel.network.C2SFrequency",
        boot:function(){
            var that       = this;

            /*
            @挂接接收服务端CMD数据*/
            GLOBAL_OBJ.bkernel.network.S2C.hook(this._TAG,function(_cmd,_result){
                var data   = {cmd:_cmd,result:_result};
                if (_result != null){
                    that.update(data);
                };
            },this);

            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
        },

        shut:function(){
            GLOBAL_OBJ.bkernel.network.S2C.unhook(this._TAG);
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        /*
        清理
        */
        clean:function(){
        },

        /*
        @更新请求时间频率
        */
        update:function(_json){
            var json   = _json;
            var cmd    = json.cmd;
            var params = json.result;
            var action = params.action;
            
            if(null==CONFIG[cmd]){
                GLOBAL_OBJ.LOGD(this._TAG,"收到最新请求Response，该协议没有绑定CMD:"+cmd+" ACTION:"+action);
                if (cmd == "todo_tasks"){
                    GLOBAL_OBJ.bkernel.utils.ToDoTasks.parse(params.tasks);
                }
                return true;
            }//没有绑定的协议
            /*
            @有action的协议，则action目录读key，没有action就是根目录读key*/
            var key    = (action&&CONFIG[cmd][action]) ? CONFIG[cmd][action].key : CONFIG[cmd].key;//id字段的（没注册的协议id就是null）
            var id     = key?params[key]:null;
            var time   = (action&&CONFIG[cmd][action]) ? CONFIG[cmd][action].time : CONFIG[cmd].time;//没注册的协议，time就是null
            time       = GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime() + time;
            action ? ( id ? RECORD[cmd][action][id] = time : RECORD[cmd][action] = time) : ( id ? RECORD[cmd][id] = time : RECORD[cmd] = time );
            GLOBAL_OBJ.LOGD(this._TAG,"收到最新请求Response，更新请求时间阈：CMD:"+cmd+" ACTION:"+action+" ID:"+key+"["+id+"] TIME:"+time);
        },

        /*
        @重置请求时间频率
        _key可以没有
        reset({cmd:cmd,action:action,time:0},"key")
        */
        reset:function(_param,_key){
            var cmd    = _param.cmd;
            var action = _param.action;
            var key    = _key;
            var time   = _param.time || GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime();
            do{
                if(!CONFIG[cmd]||!RECORD[cmd]||!RECORD[cmd][action]){ 
                    GLOBAL_OBJ.LOGD(this._TAG,"重置的协议没有绑定：CMD:"+cmd+" ACTION:"+action+" ID:"+id);
                    break;
                };

                action ? ( key ? RECORD[cmd][action][key] = time : RECORD[cmd][action] = time) : ( key ? RECORD[cmd][key] = time: RECORD[cmd] = time);
                GLOBAL_OBJ.LOGD(this._TAG,"重置请求时间阈：CMD:"+cmd+" ACTION:"+action+" ID:"+key);
            }while(0);
        },

        /*
        @检查请求时间频率
        true  可以再次请求
        false 还不可以请求
        */
        check:function(_json){
            var cmd    = _json.cmd;
            var params = _json.params;
            var action = params.action;
            var now    = GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime();
            if(null==CONFIG[cmd]){ return true; };//没有绑定的协议
            
            var key    = (action&&CONFIG[cmd][action]) ? CONFIG[cmd][action].key : CONFIG[cmd].key;//id字段的（没注册的协议id就是null）
            var id     = key?params[key]:null;
            var time   = (action&&CONFIG[cmd][action]) ? (id ? RECORD[cmd][action][id] : RECORD[cmd][action]) : (id ? RECORD[cmd][id] : RECORD[cmd] );
            // GLOBAL_OBJ.LOGD(this._TAG,"请求时间CHECK：CMD:"+cmd+" ACTION:"+action+" ID:"+id+" TIME:"+time+" REST TIME:"+(time-now));
            // if (time) { GLOBAL_OBJ.LOGD(this._TAG,"请求时间REST TIME:"+(time-now)); };
            return !(time!=null&&now<time);
        },
    };

    /*
    @重写的控制函数，返回config配置*/
    GLOBAL_OBJ.bkernel.network.C2SFrequency.REGS = function(_callFunc){
        var f          = _callFunc || function(){ return {}; };
        var config     = f();

        for (var cmd in config){
            CONFIG[cmd] = CONFIG[cmd] || {};
            for (var action in config[cmd]){
                CONFIG[cmd][action] = config[cmd][action];
            }
        }
        
        for(var cmd in CONFIG){
            RECORD[cmd] = RECORD[cmd] || {};
            for(var action in CONFIG[cmd]){
                RECORD[cmd][action] = CONFIG[cmd][action].key?{}:0;
            };
        };
    };
})();