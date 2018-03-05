/*************************************************************
 *  mahjong_table_flow_cell.js
 *  mahjong_table_flow_cell
 *	四川麻将对局流水 格子
 *
 *  Created by simon on 17-06-20
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;
    var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;

	GLOBAL_OBJ.table.windows.Flow.Cell = GLOBAL_OBJ.bkernel.base.BaseCellController.extend(
	{
		_TAG:'table.windows.Flow.Cell',
		ctor:function(_index, _config){
			this._super();
			this.config = _config;
			this.index  = _index;
			this.init(GLOBAL_OBJ.RES.TABLE_FLOW_CELL_CCBI);
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

		update:function(_index, _config)
		{
			this.index  = _index;
			this.config = _config;

			var data = _config.data;
			// cc.log("table_flow_cell_index = ", this.index, " data = ", JSON.stringify(data));
			var cellData = data[_index];
			for (var i = 0; i < 4; i++)
			{
				var str = cellData[i];
				if (i == 2)
				{
					str = GLOBAL_FUNCS.formatGold(cellData[i]);
				}
				this['lab'+i].setString(str);
			}

			var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			var icon = "";
            if (isCreate)
            {
            	icon = GLOBAL_OBJ.RES.TABLE_FLOW_FEN_PNG;
            }
            else
            {
            	icon = GLOBAL_OBJ.RES.COIN_SMALL_PNG;
            }
			GLOBAL_FUNCS.textureChange(this.iconSpr, icon);
		},
	});
})();