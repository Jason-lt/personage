/*************************************************************
 *  mahjong_base_controller.js
    mahjong_base_controller
 	麻将controller基类
 *
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：
	1.析构的方法默认都采用 removeFromParent(),然后自动会通知到JS层的destroy方法
	2.不安全的方法，JS资源释放均必须放在onCleanup里释放，C++对象释放后，先调用onCleanup再执行其他的方法，如果某些异步操作回调了JS方法，且
	回调里访问了ccb里的C++对象，那肯定就异常了，因为C++对象已经被释放
	3.引入JS层的引用计数机制，JS层的onCleanup方法将不再受C++层cleanup回调控制。
	2dx的脚本回调onCleanup只要在对象从父节点移除后就会回调，不会管引用计数是否是0，此时对象有可能没有被释放。
	JS层引用计数参考 mahjong_base_friend_reference.js
    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;

	/*
	简易JS对象ID系统，从1开始自增，
	自增前判断是否有空位，有空位就插入
	*/
	var TINY_JS_OBJECT_ID_SYSTEM = {
		_TAG: "TINY_JS_OBJECT_ID_SYSTEM",
		id  : [],
		get:function(){
			var id = this.id;
			for(var i in id){
				if (id[i] == false) {
					this.set(i);
					return i;
				}
			}
			this.set(id.length);
			return id.length;
		},

		set:function(_id){
			var id  = this.id;
			id[_id] = true;
		},

		clean:function(_id){
			var id  = this.id;
			id[_id] = false;
			return null;	
		}
	};

	GLOBAL_OBJ.bkernel.base.ID_TOKEN_Controller = TINY_JS_OBJECT_ID_SYSTEM;
	
	GLOBAL_OBJ.bkernel.base.BaseController = hall.BaseController.extend({
		_TAG: 'bkernel.base.BaseController',
		ctor:function () {
			this._super();
			this._ID_TOKEN  = TINY_JS_OBJECT_ID_SYSTEM.get();
			this._TOUCH_MAP = {};//触摸map
			/*
			@事件代理
			*/
			ty.extend.eventProxyExtend(this);
			ty.extend.schedulerExtend(this);
		},

		init:function(_ccbi){
			/*
			这样设置，实属无奈，不知道为什么框架要改变ccbi的搜索路径
			*/
			var origin = cc.BuilderReader._resourcePath;
			cc.BuilderReader.setResourcePath("games/"+ GLOBAL_OBJ.GAMENAME +"/img/");
			this._super(_ccbi);
			cc.BuilderReader.setResourcePath(origin);
		},
 
		/*
		@重写load函数*/ 
		load:function(_ccbi){
			if (! _ccbi)
				return;

		    if (ty.LOCAL_JS_DEBUG && ty.LOCAL_JS_DEBUG.enabled) {
		    	var ccbi = _ccbi.replace("games/" + GLOBAL_OBJ.GAMENAME + "/ccbi/", "");
				var file = ty.LOCAL_JS_DEBUG.gymjPath + "/publish/ccbi/" + ccbi; //ADDNEW
				cc.BuilderReader.loadWithController(file, this, this);
		    }else{
		        cc.BuilderReader.loadWithController(_ccbi, this, this);
		    }
		},

		onLoad:function () {
			// 继承
			this._super();

			var that 			  = this;

            this.FRIEND_REFERENCE = GLOBAL_OBJ.bkernel.base.Friends.Reference(this).boot();

			//拦截框架父类的(如果场景回大厅，大厅会手动调用此函数。。。。)
			this.view.ccbRootNode.onCleanup = function(){
				if (0 == that.getReferenceCount()) {
					that.onCleanup();
					that.view.ccbRootNode.onCleanup = function(){}; //防止二次调用
				}
			};

			/*
	        @onCleanup扩展执行次数限制函数
	        手动release会调用，2dx自动释放也会调用
	        */
			GLOBAL_OBJ.bkernel.extend.Node.bind_limited_function_ext(this, "onCleanup", this.onCleanup, null, 1);

			/*
			@对有动作执行的场景有异步通知*/
			this.view.ccbRootNode.setonEnterTransitionDidFinishCallback(function(){
				that.onEnterTransitionDidFinish();
			});

			this.view.ccbRootNode.setOnEnterCallback(function(){
				that.onEnter();
			});
			
			this.view.ccbRootNode.setOnExitCallback(function(){
				that.onExit();
			});

			cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function(keycode, event) {
                    if (keycode == cc.KEY.back) {
                        that.onKeyBackClicked();
                    }
                }
            }, this.view.ccbRootNode);
		},

		/*
		多语言切换
		*/
		// initLocalizationArea:function(){
		// 	this._super();
		// },

		/*
		@禁止手动调用！
		*/
		destroy:function(){
			this.FRIEND_REFERENCE.shut();
			//后销毁父
			this._super();
		},



		onEnter:function(){},
		onExit:function(){},
		onEnterTransitionDidFinish:function(){},
		
		/*
		不安全的方法，JS资源释放均必须放在onCleanup里释放，C++对象释放后，
		先调用onCleanup再执行其他的方法，如果某些异步操作回调了JS方法，且
		回调里访问了ccb里的C++对象，那肯定就异常了，因为C++对象已经被释放
		*/
		onDestroy:function(){},

		/*
		@JS层的析构回调
		*/
		onCleanup:function() {
			GLOBAL_OBJ.LOGD(this._TAG, "JS对象销毁，引用计数："+this.FRIEND_REFERENCE.getReferenceCount());
			this._TOUCH_MAP = null;
			this.dispatchEvent({name:"BASE_CLEANUP"});//析构
			TINY_JS_OBJECT_ID_SYSTEM.clean(this._ID_TOKEN);
			this.removeAllEventListeners();
			this.unscheduleAll();
			this.destroy();
		},

		getObjectIdentifier:function(){
			return this._ID_TOKEN;
		},

		//物理返回键
		onKeyBackClicked: function () {
			if (!hall.windowManager._onBackKeyClicked()) {
				this.onKeyBackAfterWindowClicked();
			}
		},

		//基类空实现
		onKeyBackAfterWindowClicked: function () {
		},

		/*
		重写动画播放函数
		*/
		playAnim:function (_animName, _callFunc) {
			var name = _animName;
			var that = this;
			var func = _callFunc;
			if ('function' != typeof(func)) { func = function(){}; };
			GLOBAL_OBJ.LOGD(this._TAG, "PlayAnim:"+name);
			this._super( name );

			//动画完毕自销毁
			this.registerSequenceEndCallback( name, this, function(){
				func(that);
			});
		},

		/*
		@获得引用计数*/
		getReferenceCount:function(){
			return this.FRIEND_REFERENCE.getReferenceCount();
		},

		/*
		@以下两个接口，继承自大厅规则。。。。如果不实现，无法使用大厅里的todotask弹出的商城*/
		onAddChildController:function(aChildController){
			this.getRootNode().addChild(aChildController.getRootNode());
		},

		removeInstance:function(aChildController){
			//清除所有添加上的属性和引用

			if(aChildController._windowRootNode){
				ty.Timer.cancelTimer(aChildController._windowRootNode, aChildController._windowRootNode.onTimeout);
			}

			var i = 0;
			if (aChildController.allOutletNames){
				var key;
				for(i = 0;i < aChildController.allOutletNames.length;i++){
					key = aChildController.allOutletNames[i];
					aChildController[key] = null;
					GLOBAL_OBJ.LOGD(aChildController._TAG, '删除属性：' + key);
					delete  aChildController[key];
				}

				aChildController.allOutletNames.length = 0;
				aChildController.allOutletNames = null;

				delete aChildController.allOutletNames;
			}

			if (aChildController.callBackNodes){

				//删除反向引用

				var callBackNode;
				for(i = 0;i < aChildController.callBackNodes.length;i++){

					callBackNode = aChildController.callBackNodes[i];

					if(callBackNode instanceof cc.ControlButton)
					{
						callBackNode.removeTargetWithActionForControlEvents(aChildController, callBackNode.callBackFun, callBackNode.callBackEvt);

						callBackNode.callBackFun = null;
						callBackNode.callBackEvt = null;

						delete callBackNode.callBackFun;
						delete callBackNode.callBackEvt;
					}
					else
					{
						callBackNode.setCallback(null, null);
					}
				}

				aChildController.callBackNodes.length = 0;
				aChildController.callBackNodes = null;

				delete aChildController.callBackNodes;
			}

			if (aChildController.view != null && aChildController.view.ccbRootNode != null){
				aChildController.view.ccbRootNode.animationManager = null;
				aChildController.view.ccbRootNode.controller = null;

				aChildController.view.ccbRootNode.setonEnterTransitionDidFinishCallback(null);
				aChildController.view.ccbRootNode.setOnEnterCallback(null);
				aChildController.view.ccbRootNode.setOnExitCallback(null);
			}

			aChildController.instanceRemoved = true;
		},

		onRemoveChildController:function(aChildController, disableAutoAddRootNode){
			this.removeInstance(aChildController);
			this._super(aChildController);
			aChildController.getRootNode().removeFromParent();
		}
	});

})();