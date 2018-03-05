/*****************************************
 *  mahjong_animation.js
    麻将 独立ccb的动画播放器
 *  mahjong
 *  
 *  Created by nick.kai.lee on 16-01-05
 *  特殊说明：
	一些特定的不专属某些功能 或者 几乎没什么业务逻辑的动画通过该模块进行播放和管理
    使用说明:
    GLOBAL_OBJ.bkernel.utils.Animation.play( parent, GLOBAL_OBJ.RES.XXXCCBI, null, function(_animate){动画播放前回调}, function(_animate){动画播放完毕回调}, false );
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	var Animation = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG: 'Animation',
		ctor: function() {
			this._super();
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			var that = this;
			this._super();
		},

		/*
		重写动画播放函数
		*/
		playAnim:function (_animName, _point, _callFunc, _notCleanup) {

			var name  = _animName;
			var that  = this;
			var size  = cc.director.getWinSize();
			var func  = _callFunc || function(){};
			var point = _point || cc.p(size.width * 0.5, size.height * 0.5);

			var thisRootNode = this.getRootNode();
			thisRootNode.setPosition(point);
			
			this._super( name, function(){
				if (!_notCleanup) {
					thisRootNode.removeFromParent();
				}
				func(that);
			});

			// //动画完毕自销毁
			// this.registerSequenceEndCallback( name, this, function(){
			// 	if (!_notCleanup) {
			// 		that.view.ccbRootNode.removeFromParent();
			// 	};
			// 	func(that);
			// });
		},
	});
	
	/*
	动画默认有一个播放的动画：play
	参数：
    _parent：父节点（可以是COCOS2DX对象，也可以是JS里的controller）
    _ccb：ccb资源
    _ccp：坐标，默认传null，屏幕居中
    _preCallFunc：动画播放前回调，动画对象作为参数返回
    _afterCallFunc：动画播放后回调，动画对象作为参数返回
    _notCleanup：播放完毕后是否清理掉动画，bool
	*/
	GLOBAL_OBJ.bkernel.utils.Animation      = {};
	GLOBAL_OBJ.bkernel.utils.Animation.play = function( _parent, _ccb, _ccp, _preCallFunc, _afterCallFunc, _notCleanup, _scale ,_timeLineName ){
        GLOBAL_OBJ.LOGD("播放特效文件 = ", _ccb);
		var animate = new Animation();
		var parent  = _parent.view ? _parent.view.ccbRootNode : _parent;
		animate.init(_ccb);

		var timeLineName = _timeLineName || "play";

		var arootNode = animate.getRootNode();
		if (animate && arootNode) {
			if (_scale) {
				animate.view.ccbRootNode.setScale(_scale);
			}

			parent.addChild(arootNode);
			animate.playAnim( timeLineName, _ccp, _afterCallFunc, _notCleanup );
			if (_preCallFunc) {
				_preCallFunc(animate);
			}
		}
		return animate;
	};

})();

