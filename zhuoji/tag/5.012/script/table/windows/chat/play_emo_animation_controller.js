//
//  play_emo_animation_controller.js
//  ddz
//
//  Created by guangy on 14-05-13.

// 为了避免与牌桌上的代码动画冲突，将动画抽出来独立load ccbi
(function () {
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.table.windows.PlayerChat.playEmoAnimationController = cc.Class.extend({

		ctor : function(playController) {
			var self = this;
			// var emoAnimal = cc.BuilderReader.loadWithController(ddz.RES.DDZ_TABLE_EMO_ANIMATION_CCBI, this, this);
			var emoAnimal = new sp.SkeletonAnimation(GLOBAL_OBJ.RES.SPINE_NT_DDZ_EXPRESSION_JSON, GLOBAL_OBJ.RES.SPINE_NT_DDZ_EXPRESSION_ATLAS);
			this._playController = playController;
			this._playController.addChild(emoAnimal);
			emoAnimal.setPosition(cc.p(-42, -40));
			this._emoAnimal = emoAnimal;

			// 所有动作名称
			this._animationNames = [
				'daqxiao', 'zhaoshou', 'qr',
				'nu', 'ku', 'sx',
				'bz', 'zan', 'tiaoxin',
				'se', 'sha', 'jiong', 'qd'
			];

			// 设置动作回调
			emoAnimal.setStartListener(function(trackIndex){
				// cc.log("EmoAnimation: %d start.", trackIndex);
				emoAnimal.setVisible(true);
			});
			emoAnimal.setEndListener(function(traceIndex){
				// cc.log("EmoAnimation: %d end.", traceIndex);
			});
			emoAnimal.setCompleteListener(function(traceIndex, loopCount){
				// cc.log("EmoAnimation: %d complete: %d", traceIndex, loopCount);
				self._emoAnimal.setVisible(false);
				if (emoAnimal.callBack) {
					emoAnimal.callBack();
				}
			});
			emoAnimal.setEventListener(function(traceIndex, event){
				// cc.log('EmoAnimation: ' + traceIndex + " event: %s, %d, %f, %s",event.data.name, event.intValue, event.floatValue, event.stringValue);
			});

			emoAnimal.setVisible(false);
		},

		setPlayController : function(playController) {
			var GLOBAL_FUNCS      = GLOBAL_OBJ.businesses.functions;
			this._playController  = playController;
			// var size			  = this._playController.getContentSize();
			GLOBAL_FUNCS.changeParent(this._emoAnimal, this._playController, cc.p(-45,-40) );
		},

		playEmo : function(index, callBack) {
			// cc.log('playEmo name: ' + this._animationNames[index-1]);

			// this._emoAnimal.animationManager.runAnimationsForSequenceNamedTweenDuration("emo" + index, 0);
			this._emoAnimal.callBack = callBack;
			this._emoAnimal.runningAnimationName = this._animationNames[index-1];
			this._emoAnimal.initWithFile(GLOBAL_OBJ.RES.SPINE_NT_DDZ_EXPRESSION_JSON, GLOBAL_OBJ.RES.SPINE_NT_DDZ_EXPRESSION_ATLAS, 1);
			// cc.log(index + "=_animationNames=" + this._animationNames[index-1]);
			this._emoAnimal.setAnimation(0, this._animationNames[index-1], false);
			this._emoAnimal.setVisible(true);
		},

		isVisibles:function () {
			var isV = false;
			if(this._emoAnimal){
				isV = this._emoAnimal.isVisible();
			}
			return isV;
		}
	});
})();

