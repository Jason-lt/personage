/*************************************************************
 *  mahjong_table_funtions.js
    mahjong_table_funtions
 *  mahjong
 	麻将牌桌全局函数
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：

    使用方法:

 */
(function() {
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T 				= GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS 			= GLOBAL_OBJ.businesses.functions;

	GLOBAL_OBJ.table.scenes.Table.Functions = {
		_TAG:"table.scenes.Table.Functions",
		/*
		@麻将牌初始化, 返回麻将牌对象数组
		params _tiles:牌面数组
		params _class:麻将牌类
		params _parents:牌槽数组
		params _seatId:客户端座位号0～3
		params _isSeen:是否亮牌 bool
		params _callFunc:回调*/
		init_tiles: function(_tiles, _class, _parents, _seatId, _isSeen, _callFunc) {
			var mahjs = [];
			var size;
			var callFunc = _callFunc || function() {};

			//一次性清理，麻将牌可以复用
			var i;
			for(i in _parents){
				if(_parents[i])	{
					_parents[i].removeAllChildren();
				}
			}
			// cc.log("init_tiles data" + _tiles.length);
			for (i = 0; i < _tiles.length; ++i) {
				mahjs[i] = GLOBAL_OBJ.table.modules.Mahjong.produce(_tiles[i],_seatId);

				if (_seatId == GLOBAL_OBJ.table.global.MYSEAT || !_isSeen) {
					mahjs[i].doStandTransform(_seatId, _isSeen);
				}else{
					mahjs[i].doLayTransform(_seatId, _isSeen);
				}
				size     = _parents[i].getContentSize();
				mahjs[i].getRootNode().setPosition(cc.p(size.width*0.5,size.height*0.5));
				_parents[i].addChild(mahjs[i].getRootNode());
				callFunc(mahjs[i], _seatId);
			}
			return mahjs;
		},

		dahu_recovery_tiles:function(_model, _localSeatId, _modeSeatId, _slotsArray, _methodSlotsArray, _seenable,_isresult){
			/*
			 刷新 本家手牌信息 */
			var model       	 = _model;
			var localSeatId 	 = _localSeatId;
			var slotsArray  	 = _slotsArray;
			var methodSlotsArray = _methodSlotsArray;
			//手牌
			var tiles = [];
			var i;
			var cpg;
			for(i = 0 ; i < model.getTilesCount( localSeatId ); ++i){
				tiles.push( model.getTileByIndex(localSeatId, i) );
			}

			tiles.sort(function(a, b) {
                return a < b;
			});

			var mahjs = GLOBAL_OBJ.table.scenes.Table.Functions.init_tiles(tiles, null, _slotsArray, _modeSeatId, _seenable, function(_mahj) {
				_mahj.doStandTransform(_modeSeatId, _seenable);
			});


			if (_isresult) {
				for (var i = 0; i < mahjs.length; ++i){
					//麻将结算显示麻将牌底图没有绿边 替换底图
					mahjs[i].setTextureByName( mahjs[i].faceSpr00, GLOBAL_OBJ.RES.GDMJ_KAIMA_MJP06_PNG);
					//麻将牌底图改变,花色高度提高一点. 原始高度-9
					mahjs[i].setPatternSprPosY(0);
					//this.patternSpr.setPositionY(this.mahj_tile_own_stand_pos.y);
					var MODEL_ABSENCE_END         = GLOBAL_OBJ.table.models.Absence_End;
					var localseatIdDQType = MODEL_ABSENCE_END.getAbsenceColorToSeatId(localSeatId);
					if (localseatIdDQType >= 0) {
						mahjs[i].doMarkAbsenceMahj(localseatIdDQType,mahjs[i]);
					}
				}
			}
			
			//要先进行释放，不能占着茅坑不拉shit，否者麻将对象还是会先创建新的
			for(i in methodSlotsArray){
				methodSlotsArray[i].removeAllChildren();
			}

			var totalNum = 0;
			//吃牌
			var index    = 0;
			var chows    = model.getChowed(localSeatId);
			for(i in chows){
				if (!methodSlotsArray[index]) { break; }
				cpg  = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce( GLOBAL_T.METHODS.CHOW );
				cpg.setTiles(_modeSeatId, chows[i], _seenable);
				GLOBAL_FUNCS.changeParent( cpg.getRootNode(), methodSlotsArray[index++] );
				totalNum = totalNum + 1;
			}

			//碰牌
			var pongs    = model.getPonged(localSeatId);
			for(i in pongs){
				if (!methodSlotsArray[index]) { break; }
				cpg  = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce( GLOBAL_T.METHODS.PONG );
				cpg.setTiles(_modeSeatId, pongs[i], _seenable);
				GLOBAL_FUNCS.changeParent( cpg.getRootNode(), methodSlotsArray[index++] );
				totalNum = totalNum + 1;
			}

			//杠牌
			var kongs    = model.getKonged(localSeatId);
			GLOBAL_OBJ.LOGD(this._TAG,"dahu_recovery_tiles kongs = " + JSON.stringify(kongs));
			for (i in kongs)
			{
				if (!methodSlotsArray[index]) { break; }
				cpg  = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce( kongs[i].style );
				cpg.setTiles(_modeSeatId, kongs[i].pattern, _seenable);
				GLOBAL_FUNCS.changeParent(cpg.getRootNode(), methodSlotsArray[index++]);
				totalNum = totalNum + 1;
				GLOBAL_OBJ.LOGD(this._TAG,"dahu_recovery_tiles kongs[i].style = " + kongs[i].style);
				if (_isresult && kongs[i].style == 2) {
					this.addKongedFromPos(localSeatId,kongs[i].pattern[1],model,methodSlotsArray[index-1]);
				}
			}

			return totalNum;
		},

		addKongedFromPos:function(localSeatId,tile,model,methodSlot){
			//结算时显示明杠来自于谁
			var str = model.getKongedFromPos(localSeatId,tile);
			if(str && str != ""){
				GLOBAL_OBJ.LOGD(this._TAG,"addKongedFromPos str = " + str);
				var diTu  = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.GYMJ_BUDGET_DITU_PNG);
				diTu.setAnchorPoint(cc.p(0.5,0));
				var size = methodSlot.getContentSize();
				GLOBAL_OBJ.LOGD(this._TAG,"addKongedFromPos size = " + JSON.stringify(size));
				diTu.setPosition(cc.p(size.width/2,0));
				var _strLabelttf = cc.LabelTTF.create("", "Arial", 20);
				_strLabelttf.setString(str);
				_strLabelttf.setAnchorPoint(cc.p(0.5, 0.5));
				_strLabelttf.setColor(cc.color(255,255,0));
				_strLabelttf.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
				var diTusize = diTu.getContentSize();
				//_strLabelttf.setDimensions(cc.size(size.width*0.95,0));
				_strLabelttf.setPosition(cc.p(diTusize.width/2,diTusize.height/2));
				diTu.addChild(_strLabelttf);
				diTu.setScale(1.6); //结算麻将显示的麻将牌都是缩放过的,这里父节点是吃碰杠插槽,反向放大
				methodSlot.addChild(diTu,6);
			}
		},


		/*
		@ 结算界面 回复手牌
		目前麻将牌是复用的，所以恢复现场前集体清理掉现有的手牌
		params _model: 从model里读取数据，要保证api接口统一
		params _localSeatId: 恢复哪个玩家的手牌
		params _modeSeatId: 麻将牌的形态参考那个位置的玩家
		params _slotsArray: 手牌父节点数组0～13
		params _methodSlotsArray: 吃碰杠父节点数组0～3
		params _seenable: 是否亮牌*/
		recovery_tiles:function(_model, _localSeatId, _modeSeatId, _slotsArray, _methodSlotsArray, _seenable){
			/*
            刷新 本家手牌信息 */
            var model       	 = _model;
            var localSeatId 	 = _localSeatId;
            var slotsArray  	 = _slotsArray;
            var methodSlotsArray = _methodSlotsArray;
			//手牌
			var tiles = [];
			for(var i = 0 ; i < model.getTilesCount( localSeatId ); ++i){
				tiles.push( model.getTileByIndex(localSeatId, i) );
			};

			// if (2==_localSeatId) {
			// 	tiles.sort(function(a,b){ return a>b; });
			// };

			var mahjs = GLOBAL_OBJ.table.scenes.Table.Functions.init_tiles(tiles, null, _slotsArray, _modeSeatId, _seenable, function(_mahj) {
				_mahj.doLayTransform(_modeSeatId, _seenable);
			});

			//胡牌
			var tile     = model.getWinTile(localSeatId);
			if (tile) {
				var mahj = GLOBAL_OBJ.table.modules.Mahjong.produce( tile );
				mahj.doLayTransform(_modeSeatId, _seenable);
				GLOBAL_FUNCS.changeParent( mahj.getRootNode(), slotsArray[14] );
			};

			//要先进行释放，不能占着茅坑不拉shit，否者麻将对象还是会先创建新的
			for(var i in methodSlotsArray){
				methodSlotsArray[i].removeAllChildren();
			};

			//吃牌
			var index    = 0;
			var chows    = model.getChowed(localSeatId);
			for(var i in chows){
				if (!methodSlotsArray[index]) { break; };
				var cpg  = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce( GLOBAL_T.METHODS.CHOW );
				cpg.setTiles(_modeSeatId, chows[i], _seenable);
				GLOBAL_FUNCS.changeParent( cpg.getRootNode(), methodSlotsArray[index++] );
			};

			//碰牌
			var pongs    = model.getPonged(localSeatId);
			for(var i in pongs){
				if (!methodSlotsArray[index]) { break; };
				var cpg  = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce( GLOBAL_T.METHODS.PONG );
				cpg.setTiles(_modeSeatId, pongs[i], _seenable);
				GLOBAL_FUNCS.changeParent( cpg.getRootNode(), methodSlotsArray[index++] );
			};

			//杠牌
			var kongs    = model.getKonged(localSeatId);
			for (var i in kongs)
			{
				if (!methodSlotsArray[index]) { break; };
				var cpg  = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce( kongs[i].style );
				cpg.setTiles(_modeSeatId, kongs[i].pattern, _seenable);
				GLOBAL_FUNCS.changeParent(cpg.getRootNode(), methodSlotsArray[index++]);
			};

			return mahjs;
		},

		bezier_points : function(srcPos, dstPos, _seatId){
	        var delta = cc.pSub(dstPos, srcPos);
	        var controlPoints = [
	            cc.p(srcPos.x, srcPos.y),
	            cc.p(srcPos.x + delta.x * 0.5 , srcPos.y + delta.y * 0.5),
	            cc.p(dstPos.x, dstPos.y)
	        ];

	        var absDelta = cc.p(Math.abs(delta.x) * 0.5, Math.abs(delta.y) * 0.5);
	        var incVar   = absDelta.x > absDelta.y ? 'y' : 'x';
	        switch(_seatId){
	            case GLOBAL_T.SEATS.N0:
	                controlPoints[0][incVar] += absDelta[incVar];
	                controlPoints[1][incVar] += absDelta[incVar];
	                break;
	            case GLOBAL_T.SEATS.N1:
	                controlPoints[0][incVar] -= absDelta[incVar];
	                controlPoints[1][incVar] -= absDelta[incVar];
	                break;
	            case GLOBAL_T.SEATS.N2:
	                controlPoints[0][incVar] -= absDelta[incVar];
	                controlPoints[1][incVar] -= absDelta[incVar];
	                break;
	            case GLOBAL_T.SEATS.N3:
	                controlPoints[0][incVar] += absDelta[incVar];
	                controlPoints[1][incVar] += absDelta[incVar];
	                break;
	        };
	        return controlPoints;
    	},
	};
	//end
})();
