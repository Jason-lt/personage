/*************************************************************
 *  mahjong_table_hu_tips_cell.js
    mahjong_table_hu_tips_cell
 *  mahjong
 	麻将牌桌胡牌 提示面板 格子
 *
 *  Created by lcr on 17-06-05
 *  特殊说明：

    使用方法:

 */
(function(){
	var GLOBAL_OBJ			= guiyang;
	var GLOBAL_T = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
    var MODEL_TABLEINFO		= GLOBAL_OBJ.table.models.TableInfo;

    GLOBAL_OBJ.table.windows.TingPreview.Tip_Cell = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:"table.windows.TingPreview.Tip_Cell",

		ctor:function(){
			this._super();
			this.mahj = null;
			this.init(GLOBAL_OBJ.RES.TABLE_HU_TIPS_CHILD_CCBI);
		},

		onLoad: function() {
			this._super();

		},

		onCleanup:function() {
			this._super();
		},

		update:function( _data ){

			var data 		= _data;
			var tile 		= data["tile"];

			var tiesColor   = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_" + tile + "_PNG";//花色
			GLOBAL_FUNCS.textureChange(this.huhuase, GLOBAL_OBJ.RES[tiesColor]);

			if(data["scoring"]){
				this.pointLabel.setString(data["scoring"]);
			}else{
				this.pointLabel.setString("");
			}

			if(data["lastCnt"]){
				this.numLabel.setString(data["lastCnt"]);
				if(data["lastCnt"] == 0){
					this.maskSp.setVisible(true);
				}else{
					this.maskSp.setVisible(false);
				}
			}else{
				this.numLabel.setString("0");
				this.maskSp.setVisible(true);
			}
		}
	});
	//end
})();
