/************************************************************************
 *  mahjong_floating_nodes_pool.js
    悬浮node池
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-07
 *  特殊说明:
	
 	使用方法:
 	1.添加一个区域绘制
    var layer = ty.nodeUtils.baseRectTouchLayer.create(true);
    ty.nodeUtils.notificationRootNode.add("brt",layer);
    layer.update(cc.rect(20,20,100,400));
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var LISTS = [];
	var NODES = [];
	// cc.eventManager.___addListener = function() {
	// 	var result = cc.eventManager.addListener.apply(cc.eventManager,arguments);//变长传参数
	// 	LISTS.push(result);
	// 	NODES.push(arguments[1]);

	// 	var controller    = arguments[2]		
	// 	return result;
	// };

	var aaaa = 0;

	var DIRECTOR          = cc.Director.getInstance();
	var FloatingNodesPool = cc.Scene.extend({
	    ctor:function() { 
	    	this._super();
	    	this.pool  = {};
	    	this.stack = [];
	        // cc.associateWithNative( this, cc.Scene );
	    },

	    init:function() {
	    	if (!this._super()) return false;

	    	var size     = DIRECTOR.getWinSize();
	    	this.setContentSize(size);
    		var node     = DIRECTOR.getNotificationNode();
    		if (node) {
    			node.onExit();
    			node.cleanup();
    		};
    		
			var that 		   = this;
			this.touchListener = cc.EventListener.create({
	            event: cc.EventListener.TOUCH_ONE_BY_ONE,
	            swallowTouches: true,
	            onTouchBegan: function (touch, event) {
	                return that.onTouchBegan(touch, event);
	            },
	            onTouchMoved: function (touch, event) {
	                that.onTouchMoved(touch, event);
	            },
	            onTouchEnded: function (touch, event) {
	                that.onTouchEnded(touch, event);
	            }
	        });

        	cc.eventManager.addListener(this.touchListener, this);

        	this.onEnter();
        	DIRECTOR.setNotificationNode(this);
        	this.onEnterTransitionDidFinish();
        	// this.touchListener.setAssociatedNode();
        	// cc.eventManager.addEventListenerWithFixedPriority(this.touchListener, -1);
	    	// this.onEnter();
	    	return true
	    },

	    // onEnter:function(){
	    // 	for(var name in this.pool){
	   	// 		this.pool[name].onEnterTransitionDidFinish();
	   	// 	};
	    // },

	   	onTouchBegan:function(_touch, _event){


			//获取GL坐标
			// var touch = _touch;
			// var point = this.convertToNodeSpace(touch.getLocation());
			// for(var name in this.pool){
		 //   		var rect  = this.pool[name].getBoundingBox();
			// 	if (cc.rectContainsPoint(rect, point)) {
			// 		return true;
			// 	};
	  //  		};


			return true; 
		},

		onTouchMoved:function(_touch, _event){

		},

		onTouchEnded:function(_touch, _event){

		},

	    /*
	    添加node到director的notificationNode
	    */

	    add:function( _name, _controller, _zOrder ) {
	    	var node = this.pool[_name]?this.pool[_name].view.ccbRootNode:null;
	    	if (node) {
	    		// node.touchListener.setEnabled(false);
	    		this.removeChild(node);
	    	};

	    	node     = _controller.view.ccbRootNode;

	    	this.stack.push(_controller.touchListener);
			this.stack[0].setEnabled(false);
	    	for(var i = 0; i<this.stack.length;++i){
	    		this.stack[i].setEnabled(false);
	    	};
	    	this.stack[this.stack.length-1].setEnabled(true);

	    	this.pool[_name] = _controller;	    	
	    	
	    	node.onEnter();

			// var layer = cc.LayerColor.create(cc.color(255, 0, 0, 128));
			// layer.setContentSize(cc.size(1136,640));
			// layer.touchListener = cc.EventListener.create({
	  //           event: cc.EventListener.TOUCH_ONE_BY_ONE,
	  //           swallowTouches: true,
	  //           onTouchBegan: function (touch, event) {
	  //               return true;
	  //           },
	  //           onTouchMoved: function (touch, event) {
	                
	  //           },
	  //           onTouchEnded: function (touch, event) {
	  //           }
	  //       });
			// cc.eventManager.addListener(layer.touchListener, layer);
			// hall.SceneManager.getCurrentController().getRootNode().addChild(layer);

	    	this.addChild(node,99999);
	    	// DIRECTOR.setNotificationNode(_node);
	    	// _node.onEnterTransitionDidFinish();

	    	// for(var i in LISTS){
	    	// 	LISTS[i].setEnabled(false);
	    	// }

	    },

	    /*
	    从director的notificationNode移除node
	    */
	    remove:function( _name ) {

	    	this.stack.splice(this.stack.length-1,1);
	    	if (this.stack[this.stack.length-1]) {
	    		this.stack[this.stack.length-1].setEnabled(true);
	    	};

	    	var node = this.pool[_name].view.ccbRootNode;
	    	if (node) {
	    		node.onExit();
	    		this.removeChild(node);
	    		node.onCleanup();
	    	};
	    	
	    	this.pool[_name] = null;



	    	for(var i in LISTS){
	    		// LISTS[i].setEnabled(true);
	    	}
	    },

	    /*
	    从director的notificationNode移除所有node
	    */
	   	removeAll:function() {
	   		for(var name in this.pool){
	   			this.removeChild(this.pool[name]);
	   		};
	    	this.pool = {};
	    }
	});

	FloatingNodesPool.create = function(){
		var pool = new FloatingNodesPool();
		if(pool && pool.init()){
			return pool;
		};
		return null;
	};
	GLOBAL_OBJ.bkernel.utils.FloatingNodesPool = FloatingNodesPool.create();
})();
