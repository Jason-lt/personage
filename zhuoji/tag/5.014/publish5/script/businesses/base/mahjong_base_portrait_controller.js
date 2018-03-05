/*************************************************************
 *  mahjong_base_portrait_controller.js
    mahjong_base_portrait_controller
 *  mahjong
 	麻将 头像基类
 *
 *  Created by nick.kai.lee on 16-07-14
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.base.Portrait = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.base.Portrait",
		ctor: function(_params) {
			this._super();

			this.params  = _params;
			this.path    = null; // 头像图片路径

			this.setUserId(_params.uid);
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
		},

		onCleanup:function() {
			this._super();
		},


		onEase:function(){
			this._super();
			// GLOBAL_OBJ.businesses.modules.User.Model.activate(this.uid);//激活一次 USER 通知，用来刷新uid的玩家头像
		},

		onEnter:function(){
			GLOBAL_OBJ.businesses.modules.User.Model.activate(this.uid);//激活一次 USER 通知，用来刷新uid的玩家头像
		},
		
		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

		/*
		@touch响应，基类重载*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return false;
		},

		/*
		@更新数据
		params _uid: userId，不为null时，刷新用户信息
		params _path: 传递头像图片 路径
		*/
		update:function(_uid, _path){
			if (_uid){
				this.setUserId(_uid);

				if ( _path && _path != this.path) {
					var sp    = cc.Sprite.create(_path);
					var size  = this.portraitNode.getContentSize();

					this.portraitNode.removeAllChildren();
					//牌桌上的头像不加遮罩，因为遮罩，会大幅增加GL Callls
					GLOBAL_OBJ.bkernel.Functions.roundRect(sp, 0.1);

					var scl = size.height / sp.height;
					sp.setScale(scl);
					sp.setAnchorPoint(cc.p(0,0));
					this.portraitNode.addChild(sp);

					// 	var clipper = cc.ClippingNode.create();
					// 	clipper.setStencil(this.portraitBg);
					// 	clipper.setAlphaThreshold(0.5);
					// 	clipper.addChild(sp);
					//
					// 	this.portraitNode.addChild(clipper);
					this.path = _path != null? _path: this.path;
				}
			}

            return this;
		},

		/*
		设置和获取玩家uid*/
		setUserId:function(_uid){
			var ret  = (null != _uid && this.uid == _uid);
			this.uid = _uid  != null? _uid: this.uid;
			return ret;
		},

		getUserId:function(){
			return this.uid;
		},

		doClean:function(){
			this.path = null;
			this.portraitNode.removeAllChildren();
		}
	});
	//end
})();

