/*****************************************
 *  mahjong_match_help_list_cell.js
    比赛详情奖励列表cell
 *  mahjong
 *
 *  Created by zengxx on 16-03-31

 */

(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.scenes.MatchListCenter.HelpListCell = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:'businesses.scenes.MatchListCenter.HelpListCell',

		ctor:function(_index,_config){
			this._super();
			this.mIndex  = _index;
			this.mConfig = _config;
			this.init(GLOBAL_OBJ.RES.MATCHHELPLISTCELL_CCBI);
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
		},

		onEnter:function(){
			this._super();
		},

		onCleanup:function(){
			this._super();
		},

		update:function(_index, _config){
			this.mIndex  = _index;
			this.mConfig = _config;

			var type = this.mConfig.help.list[this.mIndex].type=="title"?"title":"content";
			this.playAnim(type);
			this.contentLabel.setString(this.mConfig.help.list[this.mIndex].content);
			
			// 动态调整cell大小
			var size    = this.contentLabel.getContentSize();
			var newSize = cc.size(size.width,(type=="title"?size.height:size.height+10));
			this.view.ccbRootNode.setContentSize(newSize);
			this._bgNode.setContentSize(newSize);
			this._bgNode.setPosition(cc.p(newSize.width/2,newSize.height/2));
			this.contentLabel.setPosition(cc.p(0,newSize.height));
		}
	});
})();