/*******************************************************
 *  mahjong_extend_node.js
    node扩展功能
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-03
 *  特殊说明：
    一些跟“node”有关的扩展函数
    使用说明:
 */

(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.extend.Node = {
		_TAG:"bkernel.extend.Node",
		test:function(){
            /*
            TODO:
            */
		},

        bind_prototype_function:function(_node, _prototype, _callback){
            /*
            NODE扩展 - 扩展原型方法
            TODO:
            给一个NODE的原型方法扩展功能
            params _node:  扩展节点
            params _prototype: 原型方法名（字符串）
            params _callback: 扩展后的功能方法
            */
            var node       = _node || {};
            var proto      = _prototype;
            var backup     = node[proto];
            var callFunc   = _callback || function(){};
            if (node&&node[proto]) {
                node[proto] = function(){
                    callFunc.apply(node, arguments);
                    backup.apply(node, arguments);//变长传参数
                };
            };
        },

        bind_tracking_ext:function(_node,_name,_callback,_unbindCallback){
            /*
            NODE扩展 - 扩展方法跟踪功能
            TODO:
            给一个NODE的方法绑定一个跟踪方法
            params:
            node，需要跟踪的函数名，跟踪函数, 解除绑定后回调（null）
            */
            var node = _node;
            var that = this;
            var name = _name;
            var cb   = _callback||function(){};
            var ubcb = _unbindCallback||function(){};

            var backup = node[name];
            if (backup) {
                node[name] = function(){
                    var arg  = arguments;
                    backup.apply(node,arg);//变长传参数
                    cb(node,arg);
                };

                // node.__proto__[name]
                // node[name+"_origin"] = function(){
                //     var arg = arguments;
                //     backup.apply(btn,arg);//变长传参数
                // };
            };

            /*
            @扩展一个解除的方法
            */
            node.unbind_tracking_ext = function(){
                ubcb();
            };
        },

        bind_edge_block_touch_ext:function(_edgeNode, _viewNode, _blockFunc, _unblockFunc){
            /*
            NODE扩展 - 扩展边界屏蔽触摸功能
            TODO:
            给一个NODE的方法绑定一个跟踪方法
            params:
            _edgeNode: cell里必须有一个edgeNode，和cell一样的大小
            _viewNode：tableview的父节点
            _blockFunc: 屏蔽操作
            _unblockFunc：不屏蔽操作
            */
            var edgeNode = _edgeNode;
            var viewNode = _viewNode;
            var block    = cc.Layer.create();//cc.color(127,0,0,100)
            var listener;
            edgeNode.addChild(block);
            block.setContentSize(edgeNode.getContentSize());    
            
            /*
            @返回一个管理类，包含若干管理方法*/
            var back     = {
                setTouchEnabled:function(_ret){
                    if(null!=listener){
                        listener.setEnabled(_ret);
                    };
                },

                isTouchEnabled:function(){
                    return listener&&listener.isEnabled();
                },

                setSwallowTouches:function(_ret){
                    if(null!=listener){
                        listener.setSwallowTouches(_ret);
                    };
                },

                /*
                @扩展一个解除的方法*/
                unbind_edge_block_touch_ext:function(){
                    if (block&&block.getParent()) { block.removeFromParent(); };
                },
            };

            /*
            触摸响应
            @api：
            setEnabled
            setSwallowTouches
            */
            var blockFunc   = _blockFunc   || function(){};
            var unblockFunc = _unblockFunc || function(){};
            var size        = viewNode.getContentSize();
            var rect        = cc.rect(0,0,size.width,size.height);
                listener    = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    //获取GL坐标
                    var point = viewNode.convertToNodeSpace(touch.getLocation());
                    var ret   = true;
                    do{
                        if (!cc.rectContainsPoint(rect, point)) {
                            ret = true;
                            break;
                        };
                    }while(0);

                    return ret;
                },
                onTouchMoved: function (touch, event) {
                },
                onTouchEnded: function (touch, event) {
                    var point = viewNode.convertToNodeSpace(touch.getLocation());
                    if (!cc.rectContainsPoint(rect, point)) {
                        blockFunc( back );
                    }else{
                        unblockFunc( back );    
                    }; 
                },
                onTouchCanceled: function (touch, event) {
                }


            });
            cc.eventManager.addListener(listener, block);

            /*
            @返回一个管理类，包含若干管理方法*/
            return back;
        },

        bind_limited_function_ext:function(_object,_name,_callback1,_callback2,_times){
            /*
            按钮扩展 - 绑定一个限执行次数函数
            TODO:
            给一个按钮绑定一个函数
            params:
            _object，函数名，次数限制内执行函数，次数限制外执行函数, 执行次数
            返回值：
            true,还在次数限制内，false，超出阈值了
            */
            var node = _object;
            var name = _name;
            var max  = _times||1;
            var cb1   = _callback1||function(){};
            var cb2  = _callback2||function(){ cc.log("函数执行次数已经到"); return false; };//清理掉函数
            node[name]   = (function(){
                var time = 0;
                return function(){
                    ++time;
                    if (time>max){
                        // cb2(node,time);
                        cb2.call(node, node, time);
                        return false;
                    };
                    // node.callee(cb1(node,time);
                    cb1.call(node, node, time);
                    return true;
                };
            })();

            // /*
            // @扩展一个解除的方法
            // */
            // node.unbind_limited_function_ext = function(){
            //     node[name] = function(){ cc.log("函数执行次数已经到"); return false; };//清理掉函数
            // };
        },

        bind_scale_button_ext:function(_node, _callback, _supportTableview, _viewNode, _blockFunc, _unblockFunc){
            /*
            按钮扩展 - 绑定一个tableview node，使之成为按钮
            TODO:
            给一个按钮绑定一个函数
            params:
            _node，函数，是否支持tableview, tableview的父节点，边界外阻塞回调，不阻塞回调
            返回值：
            true,还在次数限制内，false，超出阈值了
            */
            var node    = _node;
            
            var cb      = _callback||function(){};
            var size    = node.getContentSize();

            //@tableview支持
            var viewNode    = _viewNode;
            var blockFunc   = _blockFunc   || function(){};
            var unblockFunc = _unblockFunc || function(){};
            var support     = _supportTableview!=null?_supportTableview:false;
            /*
            触摸响应
            @api：
            setEnabled
            setSwallowTouches
            */
            var that     = this;
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: support==true?false:true,//tableview上的button才不能吞噬，否者不能scroll了
                onTouchBegan: function (touch, event) {
                    return node.onTouchBegan(touch, event);
                },
                onTouchMoved: function (touch, event) {
                    node.onTouchMoved(touch, event);
                },
                onTouchEnded: function (touch, event) {
                    node.onTouchEnded(touch, event);
                }
            });
            cc.eventManager.addListener(listener, node);

            /*
            @滑动处理，主要用于tableview*/
            var SCROLLING     = {
                _isScrolling:false,
                setScrolling:function(_ret){
                    this._isScrolling = _ret;
                },

                getScrolling:function(){
                    return this._isScrolling;
                },
            };

            var prePoint      = cc.p(0,0);
            node.onTouchBegan = function(_touch, _event){
                var touch     = _touch;
                //获取GL坐标
                // var rect      = node.getBoundingBox();
                var rect      = cc.rect(0,0,size.width,size.height);
                var ret       = false;
                prePoint      = node.convertToNodeSpace(touch.getLocation());
                SCROLLING.setScrolling(false);

                // 往上遍历父节点，有不可见的节点则不响应touch
                var tempNode = node;
                do{
                    if (tempNode.isVisible() == false){
                        return false;
                    }
                    tempNode = tempNode.getParent();
                }while(tempNode);

                do{ 
                    //tableview才处理
                    if (support == true) {
                        var vpoint = viewNode.convertToNodeSpace(touch.getLocation());
                        var vsize  = viewNode.getContentSize();
                        var vrect  = cc.rect(0,0,vsize.width,vsize.height);
                        if (false == cc.rectContainsPoint(vrect, vpoint)) {
                            blockFunc();
                            ret   = false;
                            break;
                        }else{
                            unblockFunc();   
                        };
                    };
                    if (true==cc.rectContainsPoint(rect, prePoint)) {
                        node.setScale(1.05);
                        ret = true;
                        break;    
                    };
                }while(0);

                return ret;
            };

            node.onTouchMoved = function(_touch, _event){
                var point = node.convertToNodeSpace(_touch.getLocation());
                var x     = Math.abs(prePoint.x - point.x);
                var y     = Math.abs(prePoint.y - point.y);
                // cc.log("sdfjlkjskldfjklsdjklfklsdfx:"+prePoint.x+"-"+point.x);
                // cc.log("sdfjlkjskldfjklsdjklfklsdfy:"+prePoint.y+"-"+point.y);
                // cc.log("sdfjlkjskldfjklsdjklfklsdf:"+x+"-"+y+"-"+size.width*0.4+"-"+size.height*0.4)
                if ((x>=size.width*0.2||y>=size.height*0.2)&&support==true) {
                    node.setScale(1.0);
                    SCROLLING.setScrolling(true);
                };
            };

            node.onTouchEnded = function(_touch, _event){
                node.setScale(1.0);
                if (SCROLLING.getScrolling()==false) {
                    cb();
                };
                SCROLLING.setScrolling(false);
            };


            /*
            controller没有这2个函数,扩展2个函数
            */
            node.setTouchEnabled = function( _isEnabled ){
                if(null!=listener){
                    listener.setEnabled(_isEnabled);
                }
            };

            node.isTouchEnabled  = function(){
                return listener && listener.isEnabled();
            };

            /*
            @扩展一个解除的方法
            */
            node.unbind_button_ext = function(){
                cc.eventManager.removeListener(listener);
            };

            return listener;
        },


        bind_sequence_action_ext:function(_object){
            /*
            节点扩展 - 给一个节点绑定一个叫runSeqAction的方法（runAction也可以）
            如果节点正在执行动画，那么该方法会保存节点在执行过程中继续想要执行的动画，直到前一个动画执行完毕后依次执行保存的动画
            用处：一般来说，执行动画前会执行stopAllAction()来安全执行，但是一些不希望丢弃的动作，我们就可以用这个扩展依次执行
            PS：！！！！！动画的回调函数中，切记不要放一些不确定生命周期的对象，以免空指针
            TODO:
            
            params:
            _object，C++节点对象
            */
            var node       = _object || {};
            var proto      = "runAction";
            var backup     = node[proto];
            var actions    = [];

            if (node&&node[proto]) {
                node[proto] = function(){
                    if (node.getNumberOfRunningActions()==0) {
                        var a = cc.Sequence.create(
                            arguments[0],
                            cc.CallFunc.create(function(){
                                if (actions.length>0) {
                                    //必须异步一次，这个时候动画数量依旧是0
                                    node.async(function(){
                                        var act = actions.shift();//删除并返回数组第一个元素
                                        node[proto].apply( node, [act] );
                                        act.release();
                                    },0.1);
                                };
                            })
                         );
                        backup.apply(node, [a] );//变长传参数    
                    }else{
                        arguments[0].retain();
                        actions.push( arguments[0] );
                    };
                };
                node["runSeqAction"] = node[proto];
                /*
                如果节点销毁了，需要将没执行的action全部释放，以免内存泄漏*/
                node.onCleanup = function(){
                    for(var i in actions){
                        actions[i].release();
                    };
                    node.unscheduleAll()
                };

                /*
                @事件代理
                */
                ty.extend.schedulerExtend(node);
            };
        },
	};
})();