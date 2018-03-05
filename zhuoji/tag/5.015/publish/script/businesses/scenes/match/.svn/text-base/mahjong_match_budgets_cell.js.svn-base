/*************************************************************
 *  mahjong_match_result_cell.js
 *  mahjong
    比赛结算奖励格子
 *
 *  Created by xujing on 17-11-14
 *  特殊说明：

    使用方法:
 */

(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.scenes.Match.BudgetsCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.RoomList.BudgetsCell",
		ctor: function(_seatId) {
			this._super();
			this.seatId = _seatId;
            this.init(GLOBAL_OBJ.RES.GYMJ_MATCH_BUDGETS_CELL_CCBI);
		},

		onLoad: function() {
			this._super();
			var MODEL_BUDGETS      = GLOBAL_OBJ.table.models.Budget;
			var doufen = MODEL_BUDGETS.getDouScore(this.seatId);
			var jifen = MODEL_BUDGETS.getJiScore(this.seatId);
			var hufen = MODEL_BUDGETS.getWinScore(this.seatId);

			this['jifen_lab'].setString("鸡分:" + this.getScore(doufen));
			this['doufen_lab'].setString("豆分:" + this.getScore(jifen));
			this['hufen_lab'].setString("胡分:" + this.getScore(hufen));
		},

		getScore:function(_score){
			var score = _score;
			if (_score > 0){
				score = "+" + _score;
			}
			return score;
		},
		
		onCleanup:function() {
			this._super();
			this.seatId = null;
		}

	});

})();