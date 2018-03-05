/*************************************************************
 *  mahjong_table_hu_tips_cell_renyi.js
    mahjong_table_hu_tips_cell
 *  mahjong
 	任意牌显示
 *
 *  Created by lcr on 17-06-05
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ			= guiyang;

	GLOBAL_OBJ.table.windows.TingPreview.Tip_Cell_RenYi = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:"table.windows.TingPreview.Tip_Cell_RenYi",

		ctor:function(count){
			this._super();
			this.mahj = null;
			this._count = count;
			this.init(GLOBAL_OBJ.RES.TABLE_HU_TIPS_CHILD_RENYI_CCBI);
		},

		onLoad: function() {
			this._super();
			this['txtNum'].setString(this._count+"");
		},

		onCleanup:function() {
			this._super();
		}
	});

})();