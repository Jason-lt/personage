/*****************************************
 *  mahjong_table_absence_proxy.js
 *  定缺界面代理
 *  Created by simon 17-12-20
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.table.proxy.Absence = {
		produce:function(){
			var obj 		= null;
			var dat        	= null;
			var mod        	= null;
			return {
				_TAG:"table.proxy.Absence",

				boot:function( _parent, _data, _mode ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理");
					dat				= _data;
					mod				= _mode || GLOBAL_OBJ.table.windows.consts.C_TABLE_ABSENCE;
					obj      		= GLOBAL_OBJ.bkernel.windows.Factory.produce(mod, dat, _parent);
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj  	= null;
						dat 	= null;
						mod     = null;
					}
				},

				updateAbsenceEnd:function( _colordataend, _callFunc ){
					if ( null != obj && _colordataend != null ) {
						obj.updateFixedMissingEnds( _colordataend, _callFunc );
					}
				},

				playMySelfDingQueAni:function( _color, _fake ){
					if ( null != obj ) {
						obj.playMySelfDingQueAni(_color, _fake );
					}
				},

			};

		},

	};

})();