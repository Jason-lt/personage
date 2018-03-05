/*************************************************************
 *  mahjong_sichuan_xuezhan_budgets_xzdhcell.js
 *  mahjong
 	麻将牌 血流麻将大胡结算和牌cell
 *
 *  Created by lcr on 17-07-13
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS 			= GLOBAL_OBJ.businesses.functions;
	var GLOBAL_T 				= GLOBAL_OBJ.table.global;
	var MODEL_ROUND_RESULT 		= GLOBAL_OBJ.table.models.roundresult;
	var MODEL_TASK_WINSTREAK 	= GLOBAL_OBJ.table.models.winstreaktask;

	GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.XZDHCell = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:'table.windows.SiChuan.XueZhan.Budgets.XZDHCell',
		ctor:function(_index, _config){
			this._super();
			var _ccbName=GLOBAL_OBJ.RES.SICHUAN_XUEZHAN_BUDGETS_XZDHCELL_CCBI;
        	this.init(_ccbName);
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

		update:function(_index, _config){
			var tile;
			if(_config && _config == "share"){
				tile = MODEL_TASK_WINSTREAK.getWinTile(GLOBAL_T.MYSEAT);
			}else{
				tile = MODEL_ROUND_RESULT.getWinTile(GLOBAL_T.MYSEAT);
			}
			if(tile && tile.length < 1){
				return;
			}
			var k_index = 0;
			var keyName = null;

			for(var key in tile){
				if(k_index == _index){
					keyName = key;
					break;
				}
				k_index = k_index + 1;
			}
			var tiesColor   = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_" + keyName+"_PNG";//花色
			GLOBAL_FUNCS.textureChange(this.hupaimjnode_tile, GLOBAL_OBJ.RES[tiesColor]);
		},
	});
})();