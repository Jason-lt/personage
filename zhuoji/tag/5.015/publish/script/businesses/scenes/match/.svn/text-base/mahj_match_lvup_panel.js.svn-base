/**
 * mahj_match_waiting_panel.js
 * 比赛赛前等待面板
 * Created by xujing on 17-11-13
 */
(function(){

	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS                             = GLOBAL_OBJ.businesses.functions;

	GLOBAL_OBJ.businesses.scenes.Match.LvUpPanel = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG :'businesses.scenes.Match.LvUpPanel',

		ctor:function (pars) {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in ctor new");
			this._pars = pars;

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

			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_LVUP_CCBI);
		},


		onLoad:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," _load");

			var vsize = cc.director.getWinSize();

			var bgSize = this['bg'].getContentSize();
			var scal = Math.max(vsize.width/bgSize.width, vsize.height/bgSize.height);
			this['bg'].setScale(scal);

			//创建进度条
			var curMatchRoomDes = GLOBAL_OBJ.businesses.scenes.Match.Model.getMatchRoomDes(this._pars.roomId, this._pars.matchId);

			if (curMatchRoomDes.type == GLOBAL_OBJ.MatchType.arena_match){
				this['node_quick'].setVisible(false);
				this['node_arena'].setVisible(true);
				this['txtRankAll'].setString(this._pars.rankName);
			}
			else{
				this['node_quick'].setVisible(true);
				this['node_arena'].setVisible(false);
				var tableRank = this._pars.tableRank;
				GLOBAL_FUNCS.textureChange(this['txtTableRank'], GLOBAL_OBJ.RES['MAHJ_MATCH_LVUP_NUM_' + tableRank + '_PNG']);
			}

			var proFlag;
			var proNode;
			var curStageIndex = this._pars.stageIndex;
			var curDataIndex = curStageIndex - 1;

			var stages = curMatchRoomDes.stages;
			var startNum = 0;

			var endNum = 0;
			if (!stages) {	// 断线重连保护
				return;
			}
			if (stages.length > 4){
				if (curDataIndex > 2){
					endNum = curDataIndex + 2;
					endNum = Math.min(stages.length-1, endNum);
					startNum = endNum - 4
				}
				endNum = startNum + 5;
			}
			else{
				startNum = 0;
				endNum = stages.length;
			}
			var stage;
			var icount = 0;
			var bgImg;
			var bgImgNext;
			GLOBAL_OBJ.LOGD(this._TAG," onLoad stages = " + JSON.stringify(stages));
			GLOBAL_OBJ.LOGD(this._TAG," onLoad startNum = " + startNum);
			GLOBAL_OBJ.LOGD(this._TAG," onLoad endNum = " + endNum);
			for (var i = startNum; i < endNum; i++){
				if (i > stages.length - 1) break;
				GLOBAL_OBJ.LOGD(this._TAG," onLoad i = " + i);
				stage = stages[i];
				proFlag = new GLOBAL_OBJ.businesses.scenes.Match.RankFlag();
				proFlag.setNum(stage.totalUserCount);

				proNode = proFlag.getRootNode();
				proNode.x = icount * proNode.width;

				if (curStageIndex >= stage.index){

					if (icount > 0){

						var arrNode = cc.Node.create();
						arrNode.setContentSize(63, this['nodeProgress'].height);
						arrNode.setLocalZOrder(-1);

						bgImg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.MAHJ_MATCH_RANK_NEXT_PNG);
						bgImg.setAnchorPoint(0, 0.5);
						arrNode.addChild(bgImg);
						bgImg.x = 0;
						bgImg.y = arrNode.height/2 + 1;

						bgImgNext = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.MAHJ_MATCH_RANK_NEXT_PNG);
						bgImgNext.setAnchorPoint(0, 0.5);
						arrNode.addChild(bgImgNext);

						bgImgNext.x = bgImg.x + 30;
						bgImgNext.y = arrNode.height/2 + 1;

						if (curStageIndex == stage.index){
							arrNode.x = proNode.x - 81;
							arrNode.runAction(cc.moveBy(0.4, 42 ,0));
						}
						else{
							arrNode.x = proNode.x - 40;
						}

						this['nodeProgress'].addChild(arrNode);
					}
					else if (icount == 0){
						bgImg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.MAHJ_MATCH_RANK_NEXT_PNG);
						bgImg.setAnchorPoint(1, 0.5);
						this['nodeProgress'].addChild(bgImg);
						bgImg.setLocalZOrder(-1);
						bgImg.x = proNode.x + 21;
						bgImg.y = this['nodeProgress'].height/2 + 1;
					}

					proFlag.setState(curStageIndex == stage.index ? 1 : 0);
				}
				else{
					proFlag.setState(2);
				}
				icount++;

				this['nodeProgress'].addChild(proNode);
			}

			this['nodeProgress'].width = proNode.x + proNode.width - 13;
			this['proBg'].width = this['nodeProgress'].width;
			this['proBg'].x = -58;
			this['proBg'].setLocalZOrder(-2);
		},

		onCleanup:function () {
			GLOBAL_OBJ.LOGD(this._TAG," destroy");
			this._pars = null;
		}

	});

})();