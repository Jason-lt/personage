/*******************************************************
 *  mahjong_msg_cache.js
    缓存服务器数据
 *  mahjong
 *
 *  Modified by zengxx on 16-06-07
 *  特殊说明：

    使用说明:
    1.注册需要缓存的通知
    GLOBAL_OBJ.bkernel.network.MsgCache.REGS("table", function(){
        return [
            GLOBAL_OBJ.table.Events.XXX,
        ];
    });

    2.服务器来了数据，此时，正常通知还没建立监听

    3.正常通知监听建立，并且hook住msgcache
    var f = function(){} //正常通知回调函数
    GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.XXX, f, object1); //----1
    GLOBAL_OBJ.bkernel.network.MsgCache.hook( "table", GLOBAL_OBJ.table.Events.XXX, function(_data){
                return function(_event){
                    if( true == GLOBAL_OBJ.table.models.Discard.parse(_data, true) ){
                        f(); //----2
                    };
                };
            } );
    
    4.激活缓存消息，此时此刻如果有缓存消息，将激活2号位的f函数，并且删除名为table的对象的所有缓存，不再监听；否则不作为
    GLOBAL_OBJ.bkernel.network.MsgCache.run( "table", true );

 */

(function(){
    var GLOBAL_OBJ = guiyang;
    var CACHE = "CACHE";

    GLOBAL_OBJ.bkernel.network.MsgCache = {
        _TAG: 'GLOBAL_OBJ.bkernel.network.MsgCache',
        
        boot: function() {
            this.list  = {};
            GLOBAL_OBJ.LOGD(this._TAG, "启动通知缓存功能")
        },

        /*
        缓存消息回调函数挂接*/
        hook: function(_name, _event, _func){
            GLOBAL_OBJ.LOGD(this._TAG, _name+" 挂接需要缓存的通知:"+_event);
            var name    = _name;
            var object  = this.list[name] || {};
            if (!object.object) { return; }

            for(var i = 0; i < object.list.length; ++i){
                if (_event == object.list[i].event) {
                    object.list[i].callFunc = _func;
                }
            }
        },

        /*
        关闭指定缓存消息功能
        先执行clean，清理掉缓存的通知回调操作，然后注销掉指定对象的监听功能然后干掉
        */
        shut: function(_name) {
            GLOBAL_OBJ.LOGD(this._TAG, _name+" 卸载已缓存的通知");

            var name   = _name;
            var object = this.list[name] || {};
            if (object.object) {
                this.clean(name);
                GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(object.object);
                this.list[name] = {};
            }
        },

        /*
        关闭所有缓存消息功能*/
        shutAll: function() {
            GLOBAL_OBJ.LOGD(this._TAG, "卸载所有已缓存的通知");

            for(var name in this.list){
                this.shut(name);
            }
        },

        /*
        清理掉指定的缓存通知回调函数
        但是指定的对象依然在监听通知，除非执行shut或者shutAll操作
        */
        clean: function(_name){
            GLOBAL_OBJ.LOGD(this._TAG, _name+" 清空已缓存的通知回调函数")
            var object = this.list[_name] || {};
            if (!object.object) { return; };
            object.list = [];
        },

        /*
        执行指定缓存通知回调*/
        run: function(_name, _shutup){
            var name   = _name;
            var object = this.list[name] || {};
            if (object.object) {
                //按接收顺序 触发 缓存消息
                for(var i = 0; i < object.list.length; ++i){
                    if ( "function" == typeof(object.list[i].callFunc)) {
                        object.list[i].callFunc( object.list[i].msg );    
                    };
                };

                //缓存通知执行过后就要清理掉
                if (true == _shutup) {
                    this.shut(name);
                }else{
                    this.clean(name);
                };
            };
        },
    };

    /*
    @重写的控制函数，返回event配置*/
    GLOBAL_OBJ.bkernel.network.MsgCache.REGS = function(_name, _callFunc){
        /*
        @ 需要缓存的协议事件*/
        var that   = this;
        var name   = _name;

        
        var events = {};
        var f      = _callFunc || function(){ return []; };

        var caches = f()||[];//需要缓存的通知数组
        for (var i = 0; i < caches.length; ++i){
            events[caches[i]] = [];
        };

        this.list[name] = {
            object:{},
            list:[],
        };

        var object = this.list[name];

        for(var e in events){
            // GLOBAL_OBJ.LOGD(this._TAG, name+" 监听需要缓存的通知:"+e);
            GLOBAL_OBJ.bkernel.utils.Notification.listen( e, (function(_e){
                return function(_data){
                    // GLOBAL_OBJ.LOGD(that._TAG, name+" 收到需要缓存的:"+_e+"    "+JSON.stringify(_data));
                    object.list.push({
                        event:_e,
                        msg:_data,
                        callFunc:null
                    });
                };
            })(e), object.object );
        };
    };

    /*
    @测试用例*/
    GLOBAL_OBJ.bkernel.network.MsgCache.test = function(){
        var name1 = "A";
        var name2 = "B";
        var object1 = {};
        var object2 = {};
        GLOBAL_OBJ.bkernel.network.MsgCache.boot(name1);
        GLOBAL_OBJ.bkernel.network.MsgCache.boot(name2);

        /*
        @注册通知缓存*/
        GLOBAL_OBJ.bkernel.network.MsgCache.REGS(name1,function(){
            // 需要缓存的数据
            var caches = [
                GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD
            ];
            return caches;
        });

        GLOBAL_OBJ.bkernel.network.MsgCache.REGS(name2,function(){
            // 需要缓存的数据
            var caches = [
                GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD
            ];
            return caches;
        });

        //发送通知
        GLOBAL_OBJ.table.models.Discard.test();
        GLOBAL_OBJ.table.models.Discard.test();

        //挂接通知缓存
        var f1 = function(){
            cc.log(name1+"收到通知");
        };
        var f2 = function(){
            cc.log(name2+"收到通知");
        };
        GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD, f1, object1);
        GLOBAL_OBJ.bkernel.network.MsgCache.hook( name1, GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD, function(_data){
                    return function(_event){
                        //将缓存的协议再次交由model层处理，model抛出通知，由注册通知的回调函数_callFunc处理
                        GLOBAL_OBJ.LOGD(GLOBAL_OBJ.bkernel.network.MsgCache, name1+" 执行缓存消息:"+GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD);
                        GLOBAL_OBJ.table.models.Discard.parse(_data, true);
                        f1();
                    };
                } );
        
        GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD, f2, object2);
        GLOBAL_OBJ.bkernel.network.MsgCache.hook( name2, GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD, function(_data){
                return function(_event){
                    //将缓存的协议再次交由model层处理，model抛出通知，由注册通知的回调函数_callFunc处理
                    GLOBAL_OBJ.LOGD(GLOBAL_OBJ.bkernel.network.MsgCache, name2+" 执行缓存消息:"+GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD);
                    GLOBAL_OBJ.table.models.Discard.parse(_data, true);
                    f2();
                };
            } );

        //执行通知缓存
        GLOBAL_OBJ.bkernel.network.MsgCache.run(name1,true);

        GLOBAL_OBJ.table.models.Discard.test();
        GLOBAL_OBJ.bkernel.network.MsgCache.run(name1);
        GLOBAL_OBJ.bkernel.network.MsgCache.shut(name1);

        GLOBAL_OBJ.bkernel.network.MsgCache.run(name2);
        GLOBAL_OBJ.bkernel.network.MsgCache.shut(name2);

        GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(object1);
        GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(object2);
    };
})();