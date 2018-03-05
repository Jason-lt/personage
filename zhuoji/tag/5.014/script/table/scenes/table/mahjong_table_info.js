/*************************************************************
 *  mahjong_table_info.js
 *  mahjong
 *	麻将牌桌 信息
 *  Created by nick.kai.lee on 16-09-03
 *  特殊说明：

    使用方法:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

	var MODEL_TABLEINFO   = GLOBAL_OBJ.table.models.TableInfo;
    
	GLOBAL_OBJ.table.scenes.Table.Info = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.Table.Info",
		ctor: function() {
			this._super();
			this.init(GLOBAL_OBJ.RES.TABLE_INFO_CCBI);
		},

		onLoad: function() {
			this._super();

			var that=this;

            var winSize = cc.view.getFrameSize();
            if (winSize.width/winSize.height == 2){
                this.fanghaoLabel.setPositionY(120);
                this.bgFjh.setPositionY(120);
            }

            var is4_3 = winSize.height/winSize.width == 0.75;
            if (is4_3){
                this.fanghaoLabel.setPositionY(150);
                this.bgFjh.setPositionY(150);
            }

			//监听玩法
            GLOBAL_OBJ.bkernel.utils.Notification.listen(
                GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_DESC_LIST,
                function(){
                    //重置背景文字
                    var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
                    if(isCreate){
                        var roomId = MODEL_TABLEINFO.getCustomTableId();
                        this.fanghaoLabel.setString("房号:" + roomId.toString());
                    }

                    var optionInfo =  MODEL_TABLEINFO.getOptionInfo();
                    var service_fee =  MODEL_TABLEINFO.getServerFee();
                    GLOBAL_OBJ.LOGD(this._TAG, "table_info信息   service_fee = " + service_fee);
                    if(optionInfo && optionInfo[0]){
                        this.wanfaLabel.setString( optionInfo[0].toString() );
                    }
                    if(optionInfo && optionInfo[1]){
                        // 底分; + 服务费
                        var difen = optionInfo[1].toString();
                        var servece = "";
                        if (service_fee > 0) {
                            servece = "服务费:" + service_fee;
                        }
                        var str = difen + " " +  servece;
                        this.fanghaoLabel.setString( str.toString() );
                        var f_size = this.fanghaoLabel.getContentSize();
                        var b_size = this.bgFjh.getContentSize();
                        var b_leng = 108;
                        if (f_size.width > b_leng*0.9) {
                            this.bgFjh.setContentSize(f_size.width*1.1,b_size.height);
                        }else {
                            this.bgFjh.setContentSize(b_leng,b_size.height);
                        }
                        // this.fanghaoLabel.setString( optionInfo[1].toString() );

                    }
                    if(optionInfo && optionInfo[2]){
                        this.wanfaLabel_2.setString( optionInfo[2].toString() );
                    }
                    
					//触发一次就移除监听
                    GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(that);
                }
            ,
            this);
		},

		onCleanup:function() {
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		}
	});
	//end
})();

