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

    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.base.BaseCellController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG: 'GLOBAL_OBJ.bkernel.base.BaseCellController',
		ctor:function () {
			// 继承
			this._super();
		},

		init:function (_ccb) {
			this._super(_ccb);
		},

		onLoad:function () {
			this._super();
			/*
			@tableview有问题，remove cell时会调用脚本的cleanup操作*/
			// this.view.ccbRootNode.onCleanup = function(_a){
			// };

			/*
			@ 释放格子*/	
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.bkernel.Events.CELL,function(){

			},this);
		},

		// onCleanup:function() {
		// 	GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		// },
	});
})();
