/*************************************************************
 *  mahjong_match_budgets.js
 *  mahjong
    比赛结算面板（简单）
 *
 *  Created by xujing on 17-11-14
 *  特殊说明：

    使用方法:
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS                             = GLOBAL_OBJ.businesses.functions;

	GLOBAL_OBJ.businesses.scenes.Match.Budgets = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.RoomList.Budgets",
		ctor: function() {
			this._super();
            this.init(GLOBAL_OBJ.RES.GYMJ_MATCH_BUDGETS_CCBI);
		},

		onLoad: function() {
			this._super();

			//头像上添加分数变化
			var jaFont   = 'games/guiyang/img/font/xzmj_fnt_xjiesuanja.fnt';
			var jianFont = 'games/guiyang/img/font/xzmj_fnt_xjiesuanfu.fnt';

			var scoreNode;
			var fontPath;
			var numTag;
			var score;
			var scoreLabel;

			for (var i = 0; i < 4; i++){
				scoreNode = this['scoreNode_' + i];
				score = GLOBAL_OBJ.table.models.Budget.getrealScore(i);
				if (score >= 0){
					fontPath = jaFont;
					numTag = "+";
				}
				else {
					fontPath = jianFont;
					numTag = "";
				}

				// var cell = new GLOBAL_OBJ.businesses.scenes.Match.BudgetsCell(i);
				// scoreNode.addChild(cell.getRootNode());

				scoreLabel = cc.LabelBMFont.create(numTag + GLOBAL_FUNCS.formatGold(score), fontPath, -1, cc.TEXT_ALIGNMENT_CENTER);
				scoreLabel.setAnchorPoint(0.5,0.5);
				scoreNode.addChild(scoreLabel);
			}
		},

		onCleanup:function() {
			this._super();
		}


	});

})();