/*************************************************************
 *  mahjong_tip_bubble.js
    mahjong_tip_bubble
 *  mahjong
 	tip气泡
 *
 *  Created by zengxx on 16-02-18
 *  特殊说明：

    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	var TIP = GLOBAL_OBJ.businesses.base.ResizableLabelBubbleController.extend({
		_TAG:'businesses.utils.TipBubble',
	});

	GLOBAL_OBJ.businesses.utils.TipBubble.create = function(_parent, _txt, _ccb){
		if (_txt == null || _txt == ""){
			return ;
		};
		var ccb = _ccb || GLOBAL_OBJ.RES.TIPBUBBLE_CCBI;
		var tip = new TIP();
		tip.init(ccb);
		tip.setString(_txt);
		_parent.addChild(tip.view.ccbRootNode);
		return tip;
	};
})();