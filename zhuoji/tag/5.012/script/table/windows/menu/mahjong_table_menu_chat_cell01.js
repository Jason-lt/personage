/*************************************************************
 *  mahjong_poyang_budgets_cell00.js
    mahjong_poyang_budgets_cell00
 *  mahjong
 	麻将牌 鄱阳麻将结算 界面01 格子
 *
 *  Created by nick.kai.lee on 16-09-29
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var GLOBAL_T = GLOBAL_OBJ.table.global;

	var IMAGES = [
		GLOBAL_OBJ.RES.CHAT_EMO_1_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_2_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_3_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_4_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_5_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_6_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_7_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_8_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_9_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_10_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_11_PNG,
		GLOBAL_OBJ.RES.CHAT_EMO_12_PNG,
	];

	GLOBAL_OBJ.table.windows.Menu.Chat.Cell01 = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:'table.windows.Menu.Chat.Cell01',
		ctor:function(_index, _config){
			this._super();
			this.config = _config;
			this.index  = _index;
			this.init(GLOBAL_OBJ.RES.TABLE_CHAT_EMO_CELL_CCBI);
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
			this.index  = _index;
			this.config = _config;
			var index;

			for(var i = 1 ; i < 5 ; ++i){
				index = this.index * 4 + i - 1;
				GLOBAL_FUNCS.textureChange(this["spr_" + i], IMAGES[index]);
			}
		},

		onEno:function (idx) {
			this.config.data.callFunc(this.index * 4 + idx);
		},

		onEmo1:function(){
			this.onEno(0);
		},

		onEmo2:function(){
			this.onEno(1);
		},

		onEmo3:function(){
			this.onEno(2);
		},

		onEmo4:function(){
			this.onEno(3);
		}
	});
})();