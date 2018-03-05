/*************************************************************
 *  mahjong_table_task_cell.js
 *  mahjong_table_task_cell
 *	金币场任务列表 格子
 *
 *  Created by lcr on 17-08-09
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.TableTask.Cell = GLOBAL_OBJ.bkernel.base.BaseCellController.extend(
	{
		_TAG:'table.windows.TableTask.Cell',
		ctor:function(_index, _config){
			this._super();
			this.config = _config;
			this.index  = _index;
			this.init(GLOBAL_OBJ.RES.TABLE_TASK_CELL_CCBI);
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
			// GLOBAL_OBJ.LOGD("table_task_cell_index = ", this.index +" data = " + JSON.stringify(data));
			var cellData = data[_index];
			this.table_task_txt.setString(cellData.toString());
		},
	});
})();