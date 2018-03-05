/*****************************************
 *  mahjong_match_info_reward_list_cell.js
    比赛详情奖励列表cell
 *  mahjong
 *
 *  Created by zengxx on 16-03-28

 */

(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL = GLOBAL_OBJ.businesses.scenes.MatchListCenter.Model;

	GLOBAL_OBJ.businesses.scenes.MatchListCenter.InfoRewardListCell = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:'businesses.scenes.MatchListCenter.InfoRewardListCell',

		ctor:function(_index,_config){
			this._super();
			this.mIndex  = _index;
			this.mConfig = _config;
			this.init(GLOBAL_OBJ.RES.MATCHINFOREWARDLISTCELL_CCBI);
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

			// 排名
			if (MODEL.getStartByRoomIdAndIndex(this.mConfig.roomId, this.mIndex) == MODEL.getEndByRoomIdAndIndex(this.mConfig.roomId, this.mIndex)){
				this.rankLabel.setString("第"+MODEL.getStartByRoomIdAndIndex(this.mConfig.roomId, this.mIndex)+"名 : ");
			}else{
				this.rankLabel.setString("第"+MODEL.getStartByRoomIdAndIndex(this.mConfig.roomId, this.mIndex)+"-"+MODEL.getEndByRoomIdAndIndex(this.mConfig.roomId, this.mIndex)+"名 : ");
			}

			this.rewardLabel.setString(MODEL.getDescByRoomIdAndIndex(this.mConfig.roomId, this.mIndex));
		}
	});
})();