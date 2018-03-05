/*************************************************************
 *  mahjong_tips_base_controller.js
    mahjong_tips_base_controller
 *  mahjong
 	tip气泡controller基类
 *
 *  Created by nick.kai.lee on 16-02-26
 *  特殊说明：

    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	var TIPS      								   = GLOBAL_OBJ.businesses.modules.Tips;
	var MODEL     								   = GLOBAL_OBJ.businesses.modules.Tips.Model;
	GLOBAL_OBJ.businesses.modules.Tips.BaseController = GLOBAL_OBJ.businesses.base.ResizableLabelBubbleController.extend({
		_TAG:'GLOBAL_OBJ.businesses.modules.Tips.BaseController',
		ctor:function(_id){
			this.tipId = _id;// tip类型id
			this._super();
		},

		onLoad:function(){
			this._super();
			
			this.view.ccbRootNode.setVisible(false);
		},

		onEnterTransitionDidFinish:function(){
			this._super();

			var that         = this;
			var ___f_foreach = function(){
				var id       = that.tipId;
				if (MODEL.count(id)>0) {
					that.view.ccbRootNode.runAction(
						cc.Sequence.create(
							cc.CallFunc.create(function(){
								that.view.ccbRootNode.setVisible(true);
								that.setString(MODEL.getContent(id)||"");
							}),
							cc.DelayTime.create(MODEL.getDuration(id)),
							cc.CallFunc.create(function(){
								MODEL.shift(id);
								___f_foreach();
							})
						)
					);
				}else{
					/*
					@释放的行为不能在onenter里做，否则程序挂了，因为标记了node还是running状态就进行释放了，如果在
					onenter里执行，那么必须用异步来进行释放，或者放在onEnterTransitionDidFinish进行*/
					// that.view.ccbRootNode.runAction(
					// 	cc.Sequence.create(
					// 		cc.DelayTime.create(0.1),
					// 		cc.CallFunc.create(function(){
					// 			that.close();//展示完毕，销毁自己
					// 		})
					// 	)
					// );
					that.close();//展示完毕，销毁自己
				};
			};

			___f_foreach();
		},

		setString:function(_content){
			this._super(_content);
		},

		onCleanup:function() {
			MODEL.shift(this.tipId);
			this._super();
		},

		open:function(_parent){
			_parent.addChild(this.view.ccbRootNode);
		},

		close:function(){
			this.view.ccbRootNode.removeFromParent();
		},
	});
})();