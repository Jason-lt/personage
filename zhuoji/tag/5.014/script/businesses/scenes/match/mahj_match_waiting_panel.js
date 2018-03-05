/**
 * mahj_match_waiting_panel.js
 * 比赛赛前等待面板
 * Created by xujing on 17-11-13
 */
(function(){

	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS                             = GLOBAL_OBJ.businesses.functions;

	GLOBAL_OBJ.businesses.scenes.Match.WaitingPanel = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG :'businesses.scenes.Match.WaitingPanel',

		ctor:function (pars) {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in ctor new");

			// "result":{
			// 	"gameId":701,
			// 	"isLevelUp":false,
			// 	"stageIndex":1,
			// 	"matchId":701221,
			// 	"userId":11248,
			// 	"rank":85,
			// 	"rankName":"86/128",
			// 	"action":"wait",
			// 	"roomId":7012201000，
			// 	"cardCount": 1,  //比赛要打几副牌
			// 	"tableRank": 1   //如果晋级了，在本桌上的名次
			// }

			this._pars = pars;
			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_CCBI);
			GLOBAL_OBJ.isWaitMatchStart = true;
		},

		onLoad:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," _load");

			var vsize = cc.director.getWinSize();

			var bgSize = this['bg'].getContentSize();
			var scal = Math.max(vsize.width/bgSize.width, vsize.height/bgSize.height);
			this['bg'].setScale(scal);

			if (!this._pars){
				this['nodeProgress'].setVisible(false);
				return;
			}

			//创建进度条
			var curMatchRoomDes = GLOBAL_OBJ.businesses.scenes.Match.Model.getMatchRoomDes(this._pars.roomId, this._pars.matchId);

			var proFlag;
			var proNode;

			var stages = curMatchRoomDes.stages;
			var endNum = Math.min(stages.length ,5);
			var stage;
			for (var i = 0; i < endNum; i++){
				stage = stages[i];
				proFlag = new GLOBAL_OBJ.businesses.scenes.Match.RankFlag();
				proFlag.setNum(stage.totalUserCount);
				proFlag.setState(0);

				proNode = proFlag.getRootNode();
				proNode.x = i * proNode.width;

				this['nodeProgress'].addChild(proNode);
			}

			this['nodeProgress'].width = proNode.x + proNode.width - 13;
			this['proBg'].width = this['nodeProgress'].width - 60;
		},

		onCleanup:function () {
			GLOBAL_OBJ.LOGD(this._TAG," destroy");
			this._pars = null;
			GLOBAL_OBJ.isWaitMatchStart = false;
		}

	});

})();