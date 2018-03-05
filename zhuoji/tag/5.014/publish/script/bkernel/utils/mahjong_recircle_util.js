/*****************************************
 *  mahjong_recircle_util.js
    麻将 麻将循环利用对象扩展
 *  mahjong

 *  Created by nick.kai.lee on 16-08-05
 *  特殊说明：
    1. 节点必须从父节点先移除，才会返回到回收池中！！，否则每次都将创建新对象
    使用说明:
    var recircle = GLOBAL_OBJ.bkernel.utils.Recircle.produce("xxx", function(){ return 创建新对象; }, function(_target, _paramsArray){复用对象},);
    recircle.shut();

    2. 谨慎使用addEventListener 事件代理，如果要使用，复用前要移除事件代理，否则缓存住的回调函数很危险！！！！
 */

(function(){
    var GLOBAL_OBJ = guiyang;
    var TAG = 'recircle_util';

    /*
    @循环对象管理器生成器（工厂）*/
    var ____f_recircle_producer = function( _name ){
        var name          = _name;
        var POOLS         = {
            virgin:[],
            used:[],
            unused:[],
        };
        var CALLFUNCTIONS = {
            onUse:function(){/*创建新对象*/},
            onReuse:function(_target){/*复用对象*/},
            onUpdate:function(_target){/*used对象更新*/}
        };
        return {
            _TAG:"____f_recircle_producer",
            boot:function(_useFunc, _reuseFunc, _updateFunc){
                GLOBAL_OBJ.LOGD(this._TAG, name+" MODULE LOAD");
                CALLFUNCTIONS.onUse    = _useFunc || function(_paramsArrayA){};
                CALLFUNCTIONS.onReuse  = _reuseFunc || function(_target, _paramsArrayA){};
                CALLFUNCTIONS.onUpdate = _updateFunc || function(_target, _paramsArrayB){};
                return this;
            },

            shut:function(){
                GLOBAL_OBJ.LOGD(this._TAG, name+" MODULE UNLOAD");

                GLOBAL_OBJ.LOGD(this._TAG, name+"初始池中对象数量："+POOLS.virgin.length);
                GLOBAL_OBJ.LOGD(this._TAG, name+"忙碌池中对象数量："+POOLS.used.length);
                GLOBAL_OBJ.LOGD(this._TAG, name+"空闲池中对象数量："+POOLS.unused.length);
                
                for(var i in POOLS.unused){
                    if (POOLS.unused[i]) {
                        POOLS.unused[i].getRootNode().release();
                    };
                };
                POOLS.unused = [];

                for(var i in POOLS.used){
                    if (POOLS.used[i]) {
                        POOLS.used[i].getRootNode().release();
                    };
                    
                };
                POOLS.used = [];

                for(var i in POOLS.virgin){
                    if (POOLS.virgin[i]) {
                        POOLS.virgin[i].getRootNode().release();    
                    };
                };
                POOLS.virgin = [];
            },

            /*
            生产一个循环对象
            */
            produce:function(){
                var that    = this;
                var target  = null;

                /*
                @POOLS.unused&POOLS.used纠正
                因为tableview中cell节点,有父节点也会通知脚本层的onCleanup
                此bug只有修正c++层才可以处理。
                */
                POOLS.unused = POOLS.unused.filter(function(_mahjs){
                        if (_mahjs.getRootNode().getParent()) {
                            POOLS.used.push(_mahjs);
                            return false;
                        }
                        return true;
                    });

                POOLS.used   = POOLS.used.filter(function(_mahjs){
                        if (!_mahjs.getRootNode().getParent()) {
                            POOLS.unused.push(_mahjs);
                            return false;
                        }
                        return true;
                    });




                var createNew = function(args){
                    target   = CALLFUNCTIONS.onUse( args ); //新创建一个对象
                    var view = target.getRootNode();
                    view.retain();
                    POOLS.virgin.push( target );

                    /*
                     麻将牌只有添加到父节点或者从父节点移除（未必销毁）时才能在POOLS.used和POOLS.unused之间切换。
                     初次创建的对象都添加到POOLS.virgin池中，如果在生命周期内都没被添加过父节点，已防内存泄漏。
                     */
                    // 麻将添加父节点时
                    GLOBAL_OBJ.bkernel.extend.Node.bind_prototype_function(view, "onEnter",  function(){
                        POOLS.virgin = POOLS.virgin.filter(function(_mahjs){
                            return _mahjs.getObjectIdentifier() != target.getObjectIdentifier();
                        });
                        POOLS.unused = POOLS.unused.filter(function(_mahjs){
                            return _mahjs.getObjectIdentifier() != target.getObjectIdentifier();
                        });
                        POOLS.used   = POOLS.used.filter(function(_mahjs){
                            return _mahjs.getObjectIdentifier() != target.getObjectIdentifier();
                        });
                        POOLS.used.push( target );

                        // GLOBAL_OBJ.LOGD(that._TAG, "Bussy 初始麻将池中麻将数量："+POOLS.virgin.length);
                        // GLOBAL_OBJ.LOGD(that._TAG, "Bussy 忙碌麻将池中麻将数量："+POOLS.used.length);
                        // GLOBAL_OBJ.LOGD(that._TAG, "Bussy 空闲麻将池中麻将数量："+POOLS.unused.length);
                    });

                    // 麻将被销毁时 （留意tableview上的麻将牌，有父节点的时候也会通知onCleanup，所以需要纠正）
                    GLOBAL_OBJ.bkernel.extend.Node.bind_prototype_function(view, "onCleanup",  function(){
                        POOLS.virgin = POOLS.virgin.filter(function(_mahjs){
                            return _mahjs.getObjectIdentifier() != target.getObjectIdentifier();
                        });

                        POOLS.unused = POOLS.unused.filter(function(_mahjs){
                            return _mahjs.getObjectIdentifier() != target.getObjectIdentifier();
                        });

                        POOLS.unused.push( target );
                        POOLS.used = POOLS.used.filter(function(_mahjs){
                            return _mahjs.getObjectIdentifier() != target.getObjectIdentifier();
                        });

                        // GLOBAL_OBJ.LOGD(that._TAG, "Idle 初始麻将池中麻将数量："+POOLS.virgin.length);
                        // GLOBAL_OBJ.LOGD(that._TAG, "Idle 忙碌麻将池中麻将数量："+POOLS.used.length);
                        // GLOBAL_OBJ.LOGD(that._TAG, "Idle 空闲麻将池中麻将数量："+POOLS.unused.length);
                    });

                    return target;
                };

                if (POOLS.unused.length > 0) {

                    if (arguments.length > 1 && arguments[1] == 0){
                        var ti = -1;
                        for (var mi = 0; mi < POOLS.unused.length; mi++){
                            if (POOLS.unused[mi]._TAG == "table.scenes.Table.Mahjong.Mahj.Own"){
                                ti = mi;
                                break;
                            }
                        }

                        if (ti > -1){
                            GLOBAL_OBJ.LOGI(TAG, "重复利用了一个，本家麻将，花色：" + arguments[0]);
                            target = POOLS.unused.splice(ti,1)[0];
                            GLOBAL_OBJ.LOGI(TAG, "本家麻将，_TAG：" + target._TAG);
                            CALLFUNCTIONS.onReuse( target, arguments );//循环利用
                        }
                        else{
                            target = createNew(arguments);
                        }
                    }
                    else{
                        GLOBAL_OBJ.LOGI(TAG, "重复利用了一个，普通麻将，花色：" + arguments[0]);
                        target   = POOLS.unused.shift(); //删除并返回数组第一个元素
                        CALLFUNCTIONS.onReuse( target, arguments );//循环利用
                    }

                }else{
                    target = createNew(arguments);
                }

                if (target.getRootNode().getParent() != null){
                    POOLS.used.push(target);
                    if (arguments.length > 1){
                        return this.produce(arguments[0],arguments[1]);
                    }
                    else{
                        return this.produce(arguments[0]);
                    }
                }
                else{
                    return target;
                }
            },

            /*
            更新used对象*/
            update:function(){
                for(var i in POOLS.used){
                    CALLFUNCTIONS.onUpdate( POOLS.used[i], arguments );
                };
            },
        };
    };

    /*
    @复用对象模块*/
    GLOBAL_OBJ.bkernel.utils.Recircle = {
        _TAG:"table.utils.Recircle",
        /*
        @生产一张复用对象 */
        produce:function( _name, _useFunc, _reuseFunc, _updateFunc ){
            return ____f_recircle_producer( _name ).boot(_useFunc, _reuseFunc, _updateFunc);
        },

        test:function(){

        },
    };
})();