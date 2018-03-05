/*************************************************************
 *  mahjong_table_custom_final_cell.js
    mahjong_table_custom_final_cell
 *  mahjong
 	自建桌 最终结算 cell
 *
 *  Created by nick.kai.lee on 16-06-29
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL_BUDGETS_FINAL = GLOBAL_OBJ.table.models.FinalBudget;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_USER = GLOBAL_OBJ.businesses.modules.User.Model;
	var GLOBAL_T = GLOBAL_OBJ.table.global;
	
	GLOBAL_OBJ.table.scenes.Custom.Final.Cell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.Custom.Final.Cell",
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;//第几页

			this.init(GLOBAL_OBJ.RES.CUSTOM_FINAL_BUDGET_CELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var seatId = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(this.index);
        	if (this.portraitNode.getChildrenCount() == 0) {
				GLOBAL_OBJ.businesses.modules.User.Portrait.produce( MODEL_BUDGETS_FINAL.getUserId(seatId),
                	GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, this.portraitNode);
			}

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.scenes.Custom.VISIT_ITEM,this.onVisitAllItem,this);

        	// 赢／输 积分节点组
        	this.score_group = GLOBAL_FUNCS.nodeGroup("setVisible", [false, true], [this['winScoreNode'], this['loseScoreNode']]);

			// var control = GLOBAL_OBJ.table.windows.WuHan.Budgets.WHCell01;
            //
			this.data = {};
			var size       = this['finalViewNode'].getContentSize();
			// this.patternNTV = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
			// 	viewSize   :cc.size(size.width,size.height),
			// 	direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
			// 	fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
			// 	cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
			// 	// cellSize   :cc.size(size.width, size.height),
			// 	controller :control,
			// 	container  :this['finalViewNode'],
			// 	data       :this.data
			// });
			this.patternNTV = new GLOBAL_OBJ.VBox(size);
			this['finalViewNode'].addChild(this.patternNTV);
		},

		onCleanup:function() {
			this.patternNTV = null;
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		onVisitAllItem:function () {
			if (this.patternNTV){
				var items = this.patternNTV.items.concat();
				var ol = items.length;
				if (ol > 6){
					//只取前6个
					items.length = 6;
				}

				var item , pt;
				for (var i = 0; i < items.length; i++){
					item = items[i];
					pt = cc.p(0,this['finalViewNode'].height - item.height * (i + 1));
					GLOBAL_FUNCS.changeParent(item, this['finalViewNode'],pt);
				}

				this.patternNTV.setVisible(false);
			}
		},

		/*
		界面刷新
		*/
		update:function(_index, _config){
			var data = _config.data.data[_index];

			var seatId = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(this.index);
			var userId = MODEL_BUDGETS_FINAL.getUserId(seatId);
			var name   = MODEL_USER.getName(userId);
			var score  = MODEL_BUDGETS_FINAL.getTotalDeltaScore(seatId);
			// 背景图
			// GLOBAL_FUNCS.textureChange(this.bgSpr, score >= 0 ? GLOBAL_OBJ.RES.ZMWF_ZJS_FLOOR_WIN01_PNG : GLOBAL_OBJ.RES.ZMWF_ZJS_FLOOR_LOSE01_PNG);
			var setcolor = score >= 0;
			if(setcolor){
				this.bgSpr_win.setVisible(true);
				this.bgSpr_win_top_line.setVisible(true);
				this.bgSpr_win_down_line.setVisible(true);
				this.bgSpr_lose.setVisible(false);
				this.bgSpr_lose_top_line.setVisible(false);
				this.bgSpr_lose_down_line.setVisible(false);
			}else{
				this.bgSpr_win.setVisible(false);
				this.bgSpr_win_top_line.setVisible(false);
				this.bgSpr_win_down_line.setVisible(false);
				this.bgSpr_lose.setVisible(true);
				this.bgSpr_lose_top_line.setVisible(true);
				this.bgSpr_lose_down_line.setVisible(true);
			}

			name = GLOBAL_FUNCS.formatUserName(name, 9, 6);

			this['nameLabel'].setString(name);
			this['idLabel'].setString("ID:" + userId);
			this['nameLabel'].setColor(score >= 0 ? cc.color(124,59,1):cc.color(255,255,255));
			this['idLabel'].setColor(score >= 0 ? cc.color(124,59,1):cc.color(255,255,255));

			var i = 0 ;

			var max   = null, point = null, biggest = null;
			for(i = 0 ; i < MODEL_TABLEINFO.getSeatCount(); ++i){
				point = MODEL_BUDGETS_FINAL.getTotalDeltaScore( GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i) );
				max   = max == null ? point : max;
				biggest   = biggest == null ? GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i) : biggest;
				if (max < point) {
					max = point;
					biggest = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
				}
			}
			this['championNode'].setVisible(biggest == seatId && max > 0);

			//判断是否是房主
			this['fangzhu'].setVisible(userId == MODEL_TABLEINFO.getCustomTableHostUid());

            // 判断是不是解散人
            var index = MODEL_BUDGETS_FINAL.getCustomTableVoteHost();
            if (index >= 0)
            {
            	var vote_seatId = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(index);
				var vote_userId = MODEL_BUDGETS_FINAL.getUserId(vote_seatId);

				this['voteSpr'].setVisible(userId == vote_userId);
            }

			// 输赢积分
			this['score_group'].setVisible(score >= 0 ? 0 : 1);
			this['winScoreLabel'].setString(score > 0 ? "+" + score : score);
			this['loseScoreLabel'].setString(score > 0 ? "+" + score : score);

			// 详情
			var statistics = MODEL_BUDGETS_FINAL.getRegionStatistics(seatId);
			// GLOBAL_OBJ.LOGD("final_budget_statistics=", JSON.stringify(statistics));


			var patt = this.sortFinalPattern(statistics);
			this.data.pattList = patt;
			this.data.finalBudget = score >= 0;//用这个字段来标记是大结算
			// this.patternNTV.reloadData(patt.length);

			this.patternNTV.removeAllItem();

			var item;
			for (i = 0; i < patt.length; i++){
				item = new GLOBAL_OBJ.table.windows.WuHan.Budgets.WHCell01(i, this.data);
				this.patternNTV.addItem(item.getRootNode());
			}

			this.patternNTV.setTouchEnabled(patt.length > 6);

			var maxdp = null, pointdp = null, biggestdp = null, lsid = null, statisticsdp = null;
			for(i = 0 ; i < MODEL_TABLEINFO.getSeatCount(); ++i){
				lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);

				if (lsid !== biggest) {
                    statisticsdp = MODEL_BUDGETS_FINAL.getRegionStatistics(lsid);
                    pointdp = this.getDianPaoMost( statisticsdp );
                    maxdp   = maxdp == null ? pointdp : maxdp;
                    biggestdp = biggestdp == null ? lsid : biggestdp;
                    if (maxdp < pointdp) {
                        maxdp = pointdp;
                        biggestdp = lsid;
                    }
				}
			}

			if(biggestdp == seatId && maxdp!= 0){
				this['headMarkSpr'].setVisible(true);
				// GLOBAL_FUNCS.textureChange(this.headMarkSpr, GLOBAL_OBJ.RES.ZMWF_ZJS_MARK_ZJPS_PNG);
			}

			var detailNode;
			for (i = 0; i < 6; ++i){
				detailNode = this['detailNode'+i];
				detailNode.setVisible(false);
			}
		},

		sortFinalPattern:function ( patterns ) {
			var pattern = patterns;
			var patt = [];
			for(var i = 0; i < pattern.length; i++){
				var pat = [];
				pat[0] = pattern[i]["desc"];
				pat[1] = pattern[i]["value"];
				patt.push(pat);
			}
			return patt;
		},

		getDianPaoMost:function (patterns) {
			// GLOBAL_OBJ.LOGD("getDianPaoMost:",JSON.stringify(patterns));
			var pattern = patterns;
			var desc;
			var mostValue;
			for(var i = 0; i < pattern.length; i++){
				desc = pattern[i]["desc"];
				if(desc == "点炮"){
					mostValue = pattern[i]["value"];
				}
			}
			return mostValue;
		}

	});

})();