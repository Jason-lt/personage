/*************************************************************
 *  mahjong_wuhan_budgets_cell01.js
 *  mahjong
 	麻将牌 武汉麻将小结算 界面01 格子,倍数详细数据展示 x2
 *
 *  Created by lcr on 17-05-15
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.WuHan.Budgets.WHCell01 = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:'GLOBAL_OBJ.table.windows.WuHan.Budgets.WHCell01',
		ctor:function(_index, itemData){
			this._super();
			this.index  = _index;
			this._data = itemData;
			this.init(GLOBAL_OBJ.RES.WUHAN_BUDGETS_WHCELL01_CCBI);

			this.update();
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
		},

		onCleanup:function(){
			this._super();
		},

		update:function(){

			var pattern 	= this._data.pattList[this.index];
			var lastDaHu	= this._data.lastDaHu;
			var dahuNum		= this._data.dahuNum;
			var dahuScore	= this._data.dahuScore;
			this.fanxingname.setString(pattern[0]);

			if(pattern[0].toString() == "清一色" || pattern[0].toString() == "风一色" || pattern[0].toString() == "将一色" || pattern[0].toString() == "全求人" ||pattern[0].toString() == "碰碰胡"){
				if( lastDaHu && lastDaHu == pattern[0].toString() ){

					var heightmj = this.getRootNode().getContentSize().height/ 2.0;
					this.fanshunum.setString("x" + dahuScore.toString());
					this.fanshunum.setPositionY(heightmj + (dahuNum - 1)*heightmj);

				}else{
					this.fanshunum.setString("")
				}
			}else {
				if(this._data.finalBudget == true){
					this.fanshunum.setString("" + pattern[1].toString());
				}else if(this._data.finalBudget == false){
					this.fanshunum.setString("" + pattern[1].toString());
				}else{
					this.fanshunum.setString("x" + pattern[1].toString());
				}
			}
			if(this._data.isWiner){
				this.fanxingname.setColor(cc.color(104,44,3));
				this.fanshunum.setColor(cc.color(104,44,3));
			} else if(this._data.finalBudget){
				this.fanxingname.setColor(cc.color(124,59,1));
				this.fanshunum.setColor(cc.color(124,59,1));
			} else{
				this.fanxingname.setColor(cc.color(255,255,255));
				this.fanshunum.setColor(cc.color(255,255,255));
			}
		}
	});
})();