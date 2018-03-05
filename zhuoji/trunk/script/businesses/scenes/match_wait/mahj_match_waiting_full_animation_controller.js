/**
 * 晋级动画面板
 */
(function () {
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingFullAnimationController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.MatchWait.MatchWaitingFullAnimationController",

		ctor:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG, " ctor new");
			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_FULL_ANIMATION_CCBI);
		},

		onLoad:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," onLoad");

			// var spineBoy = new sp.SkeletonAnimation(GLOBAL_OBJ.RES.SPINE_NT_DIPLOMA_CAR_DENGDAI_JSON, GLOBAL_OBJ.RES.SPINE_NT_DIPLOMA_CAR_DENGDAI_ATLAS);
			// spineBoy.setPosition(cc.p(0, 0));
			// this['ccb_nongmin_pos'].addChild(spineBoy);
			// spineBoy.setAnimation(0, 'animation', true);

			var waitGirl = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.MAHJ_MATCH_RIZE_WAIT_GIRL_PNG);
			waitGirl.setAnchorPoint(0, 0);
			waitGirl.setPosition(cc.p(0, 0));
			this['ccb_nongmin_pos'].addChild(waitGirl);
		},

		onCleanup:function () {
			GLOBAL_OBJ.LOGD(this._TAG," in onCleanup");
		},

		riseAction:function () {
			GLOBAL_OBJ.LOGD(this._TAG, " riseAction 晋级");
			GLOBAL_OBJ.bkernel.utils.Animation.play(
				this['ccb_jinji_pos'],
				GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_BS_JINJI_CCBI,
				cc.p(0,0),
				function(_animate){},
				function(_animate){},
				true
			);
		}
	});
})();