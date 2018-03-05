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
	GLOBAL_OBJ.businesses.scenes.Match.AwardItem = cc.Node.extend({
		ctor:function () {
			this._super();

			//这个Cell总宽560

			var txtColor = cc.color(128,60,57);

			//左边默认为160
			this._txtNum = cc.LabelTTF.create("","ArialMT",26,cc.size(560,0),cc.TEXT_ALIGNMENT_LEFT,cc.VERTICAL_TEXT_ALIGNMENT_TOP);
			this.addChild(this._txtNum);
			this._txtNum.setAnchorPoint(0,0);
			this._txtNum.setPosition(0,0);
			this._txtNum.setColor(txtColor);

			//中间10

			//右连为420
			this._txtDesc = cc.LabelTTF.create("","ArialMT",26,cc.size(390,0),cc.TEXT_ALIGNMENT_LEFT,cc.VERTICAL_TEXT_ALIGNMENT_TOP);
			this.addChild(this._txtDesc);
			this._txtDesc.setAnchorPoint(0,0);
			this._txtDesc.setPosition(170,0);
			// this._txtDesc.setDimensions(320,0);
			this._txtDesc.setColor(txtColor);

		},
		/**
		 * 设置数据
		 * @param info {"time":1462503538,"desc":"第3名,获得5000金币"}
		 */
		setData:function (info) {

			// {
			// 	"start":1,
			// 	"end":1,
			// 	"desc":"100元微信红包"
			// }

			var numStr = "";
			if (info.hasOwnProperty('start')){
				if (info.start == info.end){
					numStr = "第 "+ info.start + " 名";
				}
				else{
					numStr = "第 "+ info.start + "-" + info.end + " 名";
				}
			}
			else{
				numStr = info.desc;
				info.desc = "";
			}

			this._txtNum.setString(numStr);
			this._txtDesc.setString(info.desc);

			this.adjustLabelSize();
		},

		adjustLabelSize:function () {
			var labelText = this._txtDesc;
			var sw = this._txtDesc.x + 390;
			var sh = this._txtNum.height;

			if (this._txtDesc.height > this._txtNum.height){
				sh = this._txtDesc.height;
			}

			if (this._txtDesc.height > this._txtNum.height){
				this._txtNum.setPositionY(this._txtDesc.height - this._txtNum.height);
			}

			this.setContentSize(sw, sh);
		},

		onCleanup:function () {
			this._txtDate = null;
			this._txtDesc = null;
		}
	});

})();