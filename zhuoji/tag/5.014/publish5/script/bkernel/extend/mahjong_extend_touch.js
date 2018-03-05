/*******************************************************
 *  mahjong_extend_node.js
    node扩展功能
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-09
 *  特殊说明：
    一些跟“node”有关的扩展函数
    使用说明:
 */

(function () {
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.bkernel.extend.Touch = {
        _TAG:"bkernel.extend.Touch",

        bind_floating_touch_ext:function(_controller){
            /*
             NODE扩展 - 扩展方法跟踪功能
             TODO:
             给一个NODE的方法绑定一个跟踪方法
             params:
             node，需要跟踪的函数名，跟踪函数, 解除绑定后回调（null）
             */
            var controller            = _controller;
            var view                  = controller.view.ccbRootNode;
            var animationManager      = view.animationManager;
            var documentCallbackNames = animationManager.getDocumentCallbackNames();
            var documentCallbackNodes = animationManager.getDocumentCallbackNodes();

            var map                   = {};

            /*
             @ccb里的CCMenu或者CCControlButton的控制
             */
            for (var i = 0; i < documentCallbackNodes.length; ++i){
                var callbackName   = documentCallbackNames[i];
                var callbackNode   = documentCallbackNodes[i];
                map[callbackName]  = callbackNode.isEnabled();//备份下lock前的状态
                GLOBAL_OBJ.bkernel.extend.Node.bind_tracking_ext(callbackNode,"setEnabled",(function(_name){
                    return function(_btn){
                        cc.log("备份，按钮 "+_name+" 是否支持触摸："+_btn.isEnabled());
                        map[_name] = _btn.isEnabled();
                    };
                })(callbackName),null);
            }

            controller.setFloatingTouchEnabled   = function(_ret){
                for (var i = 0; i < documentCallbackNodes.length; ++i){
                    var callbackName  = documentCallbackNames[i];
                    var callbackNode  = documentCallbackNodes[i];
                    callbackNode.__proto__.setEnabled(_ret==true?map[callbackName]:false);
                }
            };
        },

        /*
         简单touch扩展
         TODO:
         给一个node扩展touch功能
         params:
         _touchNode: 需要扩展touch的node
         _swallowTouch：是否吞噬touch
         _touchBegan：回调
         _touchMoved：回调
         _touchEnded：回调
         _touchCanceled：回调
         */
        bind_simple_touch:function( _touchNode, _swallowTouch, _touchBegan, _touchMoved, _touchEnded, _touchCanceled){

            var touchNode     = _touchNode;
            var swallowTouch  = _swallowTouch||false;
            var touchBegan    = _touchBegan || function(){ return true; };
            var touchMoved    = _touchMoved || function(){};
            var touchEnded    = _touchEnded || function(){};
            var touchCanceled = _touchCanceled || function(){ return false; };
            var listener, manager;
            var that          = this;
            /*
             触摸响应
             @api：
             setEnabled
             setSwallowTouches
             */
            listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: swallowTouch,
                onTouchBegan: function (touch, event) {
                    //获取GL坐标
                    // cc.log("onTouchBegan")
                    var point = manager.getEdgeNode().convertToNodeSpace(touch.getLocation());
                    var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefSelf(manager.getEdgeNode());
                    var ret   = false;//如果外部重写了，则用外部，否则内部

                    // 往上遍历父节点，有不可见的节点则不响应touch
                    var tempNode = touchNode;
                    do{
                        if (tempNode.isVisible() == false){
                            ret  = this.onTouchCanceled(listener, touch, event);
                            return false;
                        }
                        tempNode = tempNode.getParent();
                    }while(tempNode);

                    if (cc.rectContainsPoint(rect, point)) {
                        ret   = touchBegan(listener, touch, event);//如果外部重写了，则用外部，否则内部
                    }else{
                        // this.onTouchCanceled(touch, event);
                        ret   = false;
                    }

                    if (typeof(ret)!='boolean') {
                        GLOBAL_OBJ.LOGD(that._TAG, "回调函数返回值类型错误! 不是“boolean”，type："+typeof(ret));
                        ret = false;
                    }
                    return ret;
                },
                onTouchMoved: function (touch, event) {
                    // cc.log("onTouchMoved")
                    touchMoved(listener, touch, event);
                },
                onTouchEnded: function (touch, event) {
                    // cc.log("onTouchEnded")
                    var point = manager.getEdgeNode().convertToNodeSpace(touch.getLocation());
                    var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefSelf(manager.getEdgeNode());
                    // if (cc.rectContainsPoint(rect, point)) {
                    //     touchEnded(listener, touch, event);
                    // }else{
                    //     touchCanceled(listener, touch, event);
                    // };
                    touchEnded(listener, touch, event, cc.rectContainsPoint(rect, point));
                },
                onTouchCanceled: function (touch, event) {
                    // cc.log("onTouchCanceled")
                    return touchCanceled(listener, touch, event);
                }
            });
            cc.eventManager.addListener(listener, _touchNode);

            /*
             @返回一个管理类，包含若干管理方法*/
            manager = GLOBAL_OBJ.bkernel.extend.Functions.commonTouchMangerFactory(listener);
            GLOBAL_OBJ.bkernel.extend.Functions.propertyExt(manager,(function(_node){
                var edgeNode = _node;
                return {
                    setEdgeNode:function(_node){
                        edgeNode = _node;
                    },

                    getEdgeNode:function(){
                        return edgeNode;
                    }
                };
            })(_touchNode) );

            /*
             @返回一个管理类，包含若干管理方法*/
            return manager;
        },

        /*
         边界 touch 扩展
         TODO:
         以_edgeNode为边界，越界和不越界回调
         params:
         _touchNode: 需要扩展touch的node
         _swallowTouch：是否吞噬touch
         _blockFunc：越界回调
         _unblockFunc：不越界回调
         _touchBegan：回调(默认不传)
         _touchMoved：回调(默认不传)
         */
        bind_edge_touch:function( _edgeNode, _swallowTouch, _blockFunc, _unblockFunc, _touchBegan, _touchMoved ){
            var touchBegan    = _touchBegan || function(){ return true; };
            var touchMoved    = _touchMoved || function(){};

            var blockFunc     = _blockFunc || function(){};
            var unblockFunc   = _unblockFunc || function(){};
            return this.bind_simple_touch( _edgeNode, _swallowTouch, touchBegan, touchMoved, unblockFunc, blockFunc );
        },


        /*
         滑动时禁止touch 扩展
         TODO:
         以_edgeNode为边界，出界时禁止响应touch；当scroll的时候禁止响应touch；只有touch范围在_touchNode内时可以响应
         params:
         _touchNode: 响应touch范围的参考node
         _edgeNode:  响应touch的node
         _swallowTouch：是否吞噬touch
         _touchBegan：回调(默认不传)
         _touchMoved：回调(默认不传)
         _touchEnded：touch回调
         _touchCanceled：回调(默认不传)
         */
        bind_block_scrolling_touch:function( _touchNode, _edgeNode, _swallowTouch, _touchBegan, _touchMoved, _touchEnded, _touchCanceled ){

            var touchBegan    = _touchBegan || function(){ return true; };
            var touchMoved    = _touchMoved || function(){};
            var touchEnded    = _touchEnded || function(){};
            var touchCanceled = _touchCanceled || function(){ return false; };

            /*
             @滑动处理，主要用于tableview*/
            var SCROLLING = {
                _isScrolling:false,
                setScrolling:function(_ret){
                    this._isScrolling = _ret;
                },

                getScrolling:function(){
                    return this._isScrolling;
                }
            };
            var prePoint = cc.p(0,0);
            return this.bind_edge_touch( _edgeNode, _swallowTouch, touchCanceled, function( listener, touch, event ){
                //ended
                if (false == SCROLLING.getScrolling()) {
                    touchEnded(  listener, touch, event  );
                }else{
                    touchCanceled(  listener, touch, event  );
                }
                SCROLLING.setScrolling(false);

            }, function( listener, touch, event ){
                //began
                SCROLLING.setScrolling(false);
                do{
                    prePoint  = _touchNode.convertToNodeSpace(touch.getLocation());
                    var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefSelf(_touchNode);
                    if (false == cc.rectContainsPoint(rect, prePoint)) {
                        ret   = false;
                    }else{
                        ret   = touchBegan( listener, touch, event );
                    }
                }while(0);

                return ret;
            }, function( listener, touch, event ){
                //moved
                var point = _edgeNode.convertToNodeSpace(touch.getLocation());
                var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefSelf(_touchNode);
                var size  = cc.size(rect.width,rect.height);
                var x     = Math.abs(prePoint.x - point.x);
                var y     = Math.abs(prePoint.y - point.y);
                if (x>=size.width*0.2||y>=size.height*0.2) {
                    SCROLLING.setScrolling(true);
                    touchMoved(  listener, touch, event );
                }
            } );

        }

    };
})();