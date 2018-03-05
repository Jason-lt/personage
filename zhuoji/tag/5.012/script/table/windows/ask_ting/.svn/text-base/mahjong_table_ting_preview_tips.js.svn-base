/*************************************************************
 *  mahjong_table_ting_preview_tips.js
 *	麻将牌桌听牌 提示面板
 *  Created by simon on 17-12-13
 */

(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.TingPreview.Tips = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.TingPreview.Tips",
		ctor: function() {
			this._super();
			this.FIXWIDTH = 116;
			this.FIHEIGHT = 33;
			this.data   = { data:[] };
			this.init(GLOBAL_OBJ.RES.TABLE_HU_TIPS_CCBI)
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
            this.view.ccbRootNode.setVisible(false);
		},

		onClose:function () {
            this.view.ccbRootNode.setVisible(false);
        },

		onCleanup:function() {
			this._super();
		},

		onEase:function() {
			this._super();
		},

		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function() {
			return false;
		},

		/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event) {
            return false;
        },
        
		/*
		@更新数据，动态改变panel size*/
		update:function(_data, _huAll) {
			this.viewNode.removeAllChildren();

			var allTileCount = GLOBAL_OBJ.table.models.TableInfo.getIsNoFeng() ? 27 : 34;
			var count   = _data ? _data.length : 0;
			var refSize = cc.size(148,92);
			var huAll = count >= allTileCount ? 1 : 0; // 是否胡任意牌m
			var lineNum;     // 行数
			var colNum = 4;  // 列数
			if(count < colNum) {
				colNum = count;
			}
			lineNum = Math.ceil(count / colNum);
			if (huAll == 1) {
				//当前可以胡任意牌
				lineNum = colNum = 1;
			}

			var fixHeight = refSize.height * lineNum + this.FIHEIGHT + 28; // 九宫格高度
			var fixWidth  = colNum * refSize.width + this.FIXWIDTH + 20;   // 九宫格宽度
			var fixSize   = cc.size(fixWidth,fixHeight);

			this.view.ccbRootNode.setContentSize(fixSize);
			this._bgNode.setContentSize(fixSize);
			this.bgSpr.setContentSize(fixSize);

			this.viewNode.setContentSize(cc.size(fixWidth,refSize.height));
			this.viewNode.setPosition(cc.p(0, 0));

			var totalMjNum = 0;
			var i;
			var offWidth = this.FIXWIDTH;
			var offHeight = this.FIHEIGHT;

			if (huAll == 0) {
				var num = 0;
				for(i = 0; i < lineNum; i++) {
					for(var j = 0; j < colNum; j++) {
						var mahjData = new GLOBAL_OBJ.table.windows.TingPreview.Tip_Cell();
						this.viewNode.addChild(mahjData.getRootNode());
						mahjData.getRootNode().setPosition(cc.p( refSize.width * j + offWidth, (i * refSize.height) + offHeight));
						mahjData.update(_data[num]);
						totalMjNum += _data[num]["lastCnt"];
						num = num + 1;
						if(num == count) {
							break;
						}
					}
				}
			}
			else{
				//计算牌数量
				for (i = 0; i < count; i++) {
					totalMjNum += _data[i]["lastCnt"];
				}

				//添加任意牌显示
				var renyiPai = new GLOBAL_OBJ.table.windows.TingPreview.Tip_Cell_RenYi(totalMjNum);
				this.viewNode.addChild(renyiPai.getRootNode());
				renyiPai.getRootNode().setPosition(offWidth, offHeight);
			}

			this.total_mjNum.setString(totalMjNum + "张");
			this.total_mjNum.setPosition(92, fixHeight - 82);
			this.view.ccbRootNode.setVisible(count > 0);
		}
	});
	//end
})();