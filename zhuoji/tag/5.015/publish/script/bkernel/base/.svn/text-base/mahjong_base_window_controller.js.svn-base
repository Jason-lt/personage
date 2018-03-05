/*************************************************************
 *  mahjong_base_window_controller.js
    mahjong_base_window_controller
 	麻将window controller基类
 *
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：
	1._bgNode必须有，参考各弹窗的ccb
    使用方法:

 */

(function(){
	var GLOBAL_OBJ = guiyang;
	/*
	弹窗管理器
	*/
	var MJ_WINDOW_MANAGER = {
		_TAG: 'MJ_WINDOW_MANAGER',
		windows:[],

		push:function(_window){
			if (_window != null){
				GLOBAL_OBJ.LOGD(this._TAG, "push "+_window._TAG);
				this.windows.push(_window);
			}
		},

		pop:function(_window){
            for (var i = this.windows.length - 1; i >= 0; i --) {
                var _curWindow = this.windows[i];
                if (_window.getObjectIdentifier() == _curWindow.getObjectIdentifier()){
                    GLOBAL_OBJ.LOGD(this._TAG, "pop "+this.windows[i]._TAG);
                    return this.windows.splice(i, 1)[0];
                }
            }
		},

		indexOf:function(_index){
			return this.windows[_index] || null;
		},

		count:function(){
			return this.windows.length;
        },

        hasWindowKeyBack:function() {
            for (var i = this.windows.length - 1; i >= 0; i --) {

                var _curWindow = this.windows[i];
                if (_curWindow.isKeyBackListenEnabled()){
                    _curWindow.onKeyBackClicked();
                    _curWindow.windowClose();
                    return true;
                }
            }
            return false;
        }
	};

	GLOBAL_OBJ.bkernel.base.BaseWindowController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG: 'GLOBAL_OBJ.bkernel.base.BaseWindowController',
		ctor:function(){
			this._super();
			//@打开&关闭弹窗动画函数
			this.TWINS = GLOBAL_OBJ.bkernel.windows.Animations.none();
		},

		onLoad:function(){
			// 继承
			this._super();

			/*
			触摸响应
			@api：
			setEnabled
			setSwallowTouches
			*/
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
        	cc.eventManager.addListener(this.touchListener, this.view.ccbRootNode);
		},

		onEnterTransitionDidFinish:function(){
			this._super();
			var that = this;
			// this.TWINS[0](this._bgNode,function(){ that.onEase(); });//弹出动画
		},

		onCleanup:function(){
			// this.touchListener.setEnabled(false);
			this._super();
			MJ_WINDOW_MANAGER.pop(this);

			this.TWINS = null;
			cc.eventManager.removeListener(this.touchListener);
			this.touchListener = null;
		},

		/*
		窗口完全弹出后（windowShow）回调 api
		可以放一些网络请求，防止卡UI
		供子类继承
		*/
		onEase:function(){
		},

		/*
		窗口弹出
		*/
		windowShow:function(_parent,_animateTwins){
			GLOBAL_OBJ.LOGD(this._TAG," windowShow");
			var parent  = _parent;
			var that    = this;
			this.TWINS  = _animateTwins||GLOBAL_OBJ.bkernel.windows.Animations.none();
			// if (parent) {
			parent.addChild(this.view.ccbRootNode);
				// this.view.ccbRootNode.removeFromParent();
			// }else{
				// GLOBAL_OBJ.bkernel.utils.FloatingNodesPool.add(this._ID_TOKEN,this);
			// };
			// this.view.ccbRootNode.setPositionY(-200)
			MJ_WINDOW_MANAGER.push(this);

			this.TWINS[0](
				this._bgNode,
				function(){ 
					that.onEase(); 
				}
			);//弹出动画
		},

		/*
		窗口关闭
		*/
		windowClose:function(){
			var that     = this;
			if (that.view.ccbRootNode && this.TWINS) {
				this.TWINS[1](this._bgNode,function(){//关闭动画
					// if (!GLOBAL_OBJ.bkernel.utils.FloatingNodesPool.remove(that._ID_TOKEN)) {
					GLOBAL_OBJ.LOGD(that._TAG, "start windowClose");
						that.view.ccbRootNode.removeFromParent();
						that.view.ccbRootNode = null;
					GLOBAL_OBJ.LOGD(that._TAG, "end windowClose");
					// };	
				});
			}
		},

		/*
		touch 事件
		*/
		setSwallowTouches:function(_ret){
			//是否吞噬touch
			this.touchListener.setSwallowTouches(_ret);
		},

		setTouchEnabled:function(_ret) {
			//是否允许touch
			this.touchListener.setEnabled(_ret);
		},

		onTouchBegan:function(_touch, _event){
			return true;
		},

		onTouchMoved:function(_touch, _event){

		},

		onTouchEnded:function(_touch, _event){

		},

		/*
		物理返回键相关
		*/
		onKeyBackClicked:function(){
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG, "this.isKeyBackListenEnabled() " + this.isKeyBackListenEnabled())
			if (this.isKeyBackListenEnabled() == false || this.isKeyBackListenEnabled() == null){
				return ;
			}

			var _curWindow = MJ_WINDOW_MANAGER.indexOf(MJ_WINDOW_MANAGER.count()-1);
			if (_curWindow != null && _curWindow.getObjectIdentifier() == this.getObjectIdentifier()){
	           	GLOBAL_OBJ.LOGD(this._TAG, "_curWindow.getObjectIdentifier() " + _curWindow.getObjectIdentifier() + " : " + this.getObjectIdentifier());
				this.windowClose();
			}
		},

		// 是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可
		isKeyBackListenEnabled:function(){
			return true;
		}
	});

    GLOBAL_OBJ.bkernel.base.BaseWindowController.MJ_WINDOW_MANAGER = MJ_WINDOW_MANAGER;
})();
