/*************************************************************
 *  mahjong_table_battery.js
    mahjong_table_battery
 *  mahjong
 	麻将牌桌 电量 信息
 *
 *  Created by nick.kai.lee on 16-11-26
 *  特殊说明：
 	
    使用方法:

 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;
	
	var GLOBAL_T 			           = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS                   = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO                = GLOBAL_OBJ.table.models.TableInfo;
	GLOBAL_OBJ.table.scenes.Table.Battery = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.Table.Battery",
		ctor: function() {
			this._super();
			this.init(GLOBAL_OBJ.RES.TABLE_BATTERY_CCBI);
		},

		onLoad: function() {
			this._super();
			var that = this;
			var wifi_net_func = function (net) {
				if (net == false)
				{
					that.netNode.setVisible(false);
					that.wifiNode.setVisible(false);
				}
				else if (net[0] == 1)
				{
					that.netNode.setVisible(false);
					that.wifiNode.setVisible(true);
					switch(net[1])
					{
						case 1:
							that.wifi_1.setColor(GLOBAL_OBJ.Const.C_RED);
							that.wifi_2.setColor(GLOBAL_OBJ.Const.C_GRAY);
							that.wifi_3.setColor(GLOBAL_OBJ.Const.C_GRAY);
							break;
						case 2:
							that.wifi_1.setColor(GLOBAL_OBJ.Const.C_YELLO);
							that.wifi_2.setColor(GLOBAL_OBJ.Const.C_YELLO);
							that.wifi_3.setColor(GLOBAL_OBJ.Const.C_GRAY);
							break;
						case 3:
							that.wifi_1.setColor(GLOBAL_OBJ.Const.C_GREEN);
							that.wifi_2.setColor(GLOBAL_OBJ.Const.C_GREEN);
							that.wifi_3.setColor(GLOBAL_OBJ.Const.C_GREEN);
							break;
					}
				}
				else if (net[0] == 0)
				{
					that.netNode.setVisible(true);
					that.wifiNode.setVisible(false);
					switch(net[1])
					{
						case 0:
							that.net_1.setColor(GLOBAL_OBJ.Const.C_RED);
							that.net_2.setColor(GLOBAL_OBJ.Const.C_GRAY);
							that.net_3.setColor(GLOBAL_OBJ.Const.C_GRAY);
							break;
						case 1:
							that.net_1.setColor(GLOBAL_OBJ.Const.C_RED);
							that.net_2.setColor(GLOBAL_OBJ.Const.C_GRAY);
							that.net_3.setColor(GLOBAL_OBJ.Const.C_GRAY);
							break;
						case 2:
							that.net_1.setColor(GLOBAL_OBJ.Const.C_YELLO);
							that.net_2.setColor(GLOBAL_OBJ.Const.C_YELLO);
							that.net_3.setColor(GLOBAL_OBJ.Const.C_GRAY);
							break;
						case 3:
							that.net_1.setColor(GLOBAL_OBJ.Const.C_GREEN);
							that.net_2.setColor(GLOBAL_OBJ.Const.C_GREEN);
							that.net_3.setColor(GLOBAL_OBJ.Const.C_GREEN);
							break;
						case 4:
							that.net_1.setColor(GLOBAL_OBJ.Const.C_GREEN);
							that.net_2.setColor(GLOBAL_OBJ.Const.C_GREEN);
							that.net_3.setColor(GLOBAL_OBJ.Const.C_GREEN);
							break;
					}
				}
			};

			var tickCount = -1;
			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.bkernel.Events.TICK,   function(_params){

				tickCount++;
				if (tickCount % 60 != 0) {
					return;
				}

				// GLOBAL_OBJ.LOGD(that._TAG,"tickCount :" + tickCount);

                var realConfig = JSON.parse(ty.SystemInfo.getRealTimeDynamicInfo());
				var net = GLOBAL_OBJ.Util.netWorkType(realConfig);
                var level      = parseInt(realConfig.batteryLevel);
                level          = level < 1 ? 1 : level;
                that.valueLabel.setString(level+"%");
                that.batterySpr.setScaleX(level*0.01);
                that.batterySpr.setColor(level < 20 ? cc.color(255,0,0) : cc.color(255,255,255));
                
                var _timeStr = (new Date( _params.time*1000 )).toLocaleTimeString();
				var _timeStrArr = _timeStr.split(":");
				_timeStr = _timeStrArr[0] + ":" + _timeStrArr[1];
				// GLOBAL_OBJ.LOGD("Simon: 时间", _timeStr);
                that.txtTime.setString( _timeStr );

				that.jifenbg.setVisible(true);
				that.timeNode.setVisible(true);
				that.batteryNode.setVisible(true);

				wifi_net_func(net);

				// tickCount++;
				if (tickCount > 60){
					tickCount %= 60;
				}
            }, this);
            that.roomLabel.setString( "房间:"+ MODEL_TABLEINFO.getCustomTableId() );

            //IOS 提审隐藏电池和时间
            // var user_type = hall.PluginInterface.getUserType();
            // GLOBAL_OBJ.LOGD("查看 用户类型 ", user_type);
            // that.batteryBg.setVisible(user_type);
            // that.batterySpr.setVisible(user_type);
            // that.txtTime.setVisible(user_type);

			//金币场逻辑判断
			if (MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Normal || MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Match){
				this.roomLabel.setVisible(false);
			}
		},

		initData:function()
		{
			var size = cc.director.getWinSize();
			var rootNode = this.getRootNode();
			rootNode.parent.x = size.width*0.98;
			rootNode.parent.y = size.height*0.99;
		},

		onCleanup:function() {
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		}
	});
	//end
})();

