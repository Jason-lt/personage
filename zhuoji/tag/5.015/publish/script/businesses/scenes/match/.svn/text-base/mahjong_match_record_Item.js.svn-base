/*************************************************************
 *  mahjong_match_record_Item.js
 *  mahjong
 	战绩条目
 *
 *  Created by xujing on 17-11-10
 *  特殊说明：

    使用方法:
 */
(function(){

	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.scenes.Match.RecordItem = cc.Node.extend({
		ctor:function () {
			this._super();

			var txtColor = cc.color(128,60,57);

			this._txtDate = cc.LabelTTF.create("","ArialMT",26,cc.size(0,0),cc.TEXT_ALIGNMENT_LEFT,cc.VERTICAL_TEXT_ALIGNMENT_TOP);
			this.addChild(this._txtDate);
			this._txtDate.setAnchorPoint(0,0);
			this._txtDate.setPosition(0,0);
			this._txtDate.setColor(txtColor);

			this._txtDesc = cc.LabelTTF.create("","ArialMT",26,cc.size(350,0),cc.TEXT_ALIGNMENT_LEFT,cc.VERTICAL_TEXT_ALIGNMENT_TOP);
			this.addChild(this._txtDesc);
			this._txtDesc.setAnchorPoint(0,0);
			this._txtDesc.setPosition(157,0);
			// this._txtDesc.setDimensions(320,0);
			this._txtDesc.setColor(txtColor);

		},
		/**
		 * 设置数据
		 * @param info {"time":1462503538,"desc":"第3名,获得5000金币"}
		 */
		setData:function (info) {

			var date = new Date(info.time * 1000);
			var year = date.getFullYear();//取得年
			var month = date.getMonth()+1;    //取得月,js从0开始取,所以+1
			var date1 = date.getDate(); //取得天
			var str_month = month;

			if (month < 10) {
				str_month = '0' + month;
			}
			var str_date = date1;
			if (date1 < 10) {
				str_date = '0' + date1;
			}
			str_date = year + "-" + str_month + '-' + str_date;

			this._txtDate.setString(str_date);
			this._txtDesc.setString(info.desc);

			this.adjustLabelSize();
		},

		adjustLabelSize:function () {
			var labelText = this._txtDesc;
			var sw = this._txtDesc.x + 350;
			var sh = this._txtDate.height;

			if (this._txtDesc.height > this._txtDate.height){
				sh = this._txtDesc.height;
			}

			if (this._txtDesc.height > this._txtDate.height){
				this._txtDate.setPositionY(this._txtDesc.height - this._txtDate.height);
			}

			this.setContentSize(sw, sh);
		},

		onCleanup:function () {
			this._txtDate = null;
			this._txtDesc = null;
		}
	});

})();