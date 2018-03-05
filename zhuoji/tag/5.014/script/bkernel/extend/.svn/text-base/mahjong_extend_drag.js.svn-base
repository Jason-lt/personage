/************************************************************************
 *  mahjong_extend_drag.js
 *  节点拖拽功能扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-06-01
 *  特殊说明：
	给一个controller扩展一个拖拽touch的功能
	
 	使用方法:
    GLOBAL_OBJ.bkernel.extend.Drag.bind_drag_ext(controller,view,function(){},function(){},function(){});
 */


(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.bkernel.extend.Drag  = {
		/*
		@drag基础扩展
		params _object: controller对象
		params _view: touch范围的节点
		params _swallow: 是否吞噬touch
		params _beginCallFunc: touch begin回调
		params _moveCallFunc: touch move回调
		params _endCallFunc: touch end 回调
		*/
		bind_drag_ext:function( _object, _view, _swallow, _beginCallFunc, _moveCallFunc, _endCallFunc ){
			if (_object) {
				var object = _object;
				var view   = _view;
				var bc     = _beginCallFunc || function(){};
				var mc     = _moveCallFunc || function(){ return true; };
				var ec     = _endCallFunc || function(){};
				var listener, manager;
				// var layer  = cc.LayerColor.create(cc.color(127,0,0,0));
				// layer.setContentSize(view.getContentSize());
				// view.addChild(layer);

            	listener   = cc.EventListener.create({
	                event: cc.EventListener.TOUCH_ONE_BY_ONE,
	                swallowTouches: _swallow,
	                onTouchBegan: function (touch, event) {
	                    //获取GL坐标
						var v     = object.view.ccbRootNode;
						var point = touch.getLocation();
						var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefWorld(view);
						
	                    // 往上遍历父节点，有不可见的节点则不响应touch
	                    var tempNode = v;
	                    do{
	                        if (tempNode.isVisible() == false){
	                            return false;
	                        };
	                        tempNode = tempNode.getParent();
	                    }while(tempNode);

						if (cc.rectContainsPoint(rect, point)&&v.isVisible()&&manager.isTouchEnabled()) {
							//swallow touch
							bc(object, touch, event);
						    return true; 
						};
			 			return false;
	                },
	                onTouchMoved: function (touch, event) {
	                	var v       = object.view.ccbRootNode;
						var current = touch.getLocation()
						var prev    = touch.getPreviousLocation()
						var now     = v.getPosition()
						if (manager.isDragEnabled()&&mc(object, touch, event)) {
							v.setPosition(cc.p(now.x+(current.x-prev.x),now.y+(current.y-prev.y)));
						};
	                },
	                onTouchEnded: function (touch, event) {
	                	ec(object, touch, event);
	                }
	            });
            	cc.eventManager.addListener(listener, _view);

            	manager = GLOBAL_OBJ.bkernel.extend.Functions.commonTouchMangerFactory(listener);
            	GLOBAL_OBJ.bkernel.extend.Functions.propertyExt(manager,(function(_listener){
	            	dragEnabled = true;
	            	return {
		            	setDragEnabled:function(_ret){
	                        dragEnabled = _ret;
	                    },

	                    isDragEnabled:function(){
	                        return _listener&&dragEnabled;
	                    },
		            };
	            })(listener) );
	            return manager;
			};
		},
	};//end
})();
