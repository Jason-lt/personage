/*************************************************************
 *  mahjong_gymj_budgets_user_lose_cell.js
 *  Created by liaotao
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ         = guiyang;
	var GLOBAL_T           = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS       = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO    = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_USER         = GLOBAL_OBJ.businesses.modules.User.Model;
	var MODEL_ROUND_RESULT = GLOBAL_OBJ.table.models.roundresult;
	var MODEL_BUDGETS      = GLOBAL_OBJ.table.models.Budget;


    var ___img___ = function(img_id){
        // 1:转弯豆、2:明豆、3:闷豆、4:冲锋 5:责任鸡、6:普通鸡、7:翻牌鸡
        var str = "";
        switch(img_id){
            case 1:
                str = GLOBAL_OBJ.RES.GYMJ_BUDGET_ZHUAN_PNG;
                break;
            case 2:
                str = GLOBAL_OBJ.RES.GYMJ_BUDGET_MING_PNG;
                break;
            case 3:
                str = GLOBAL_OBJ.RES.GYMJ_BUDGET_MEN_PNG;
                break;
            case 4:
                str = GLOBAL_OBJ.RES.GYMJ_BUDGET_CHONG_PNG;
                break;
            case 5:
                str = GLOBAL_OBJ.RES.GYMJ_BUDGET_ZE_PNG;
                break;
        }
        return str;
    };

    GLOBAL_OBJ.table.windows.gymj.result.Budgets.UserLoseCell = cc.Class.extend({
		_TAG:"table.windows.gdmj.result.Budgets.UserLoseCell",
		ctor: function(_seatId) {
			this.seatId = _seatId;
			this.init(GLOBAL_OBJ.RES.GYMJ_BUDGET_USER_LOSE_CELL_CCBI);
		},

		init:function(_ccbi){
			this.rootNode = cc.BuilderReader.loadWithController(_ccbi, this, this);
            this.onLoad();
		},

        getRootNode:function () {
		    return this.rootNode;
        },

		onLoad: function() {
			//this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
            var winSize = cc.view.getFrameSize();
            this.is4_3 = winSize.height/winSize.width == 0.75;
			this.updateXZ();
		},

		updateXZ:function(){
            // if (this.is4_3) {
            //     var size   = cc.Director.getInstance().getWinSize();
            //     var _scale = GLOBAL_OBJ.businesses.global.SCREEN_SIZE.h/size.height;
            //     GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_user_cell.js","updateXZ _scale = " + _scale);
            //     this.getRootNode().setScaleY(_scale);
            // }
            var seatId 	   = this.seatId;
            var isPoChan   = MODEL_BUDGETS.getcurScore(seatId) == 0;
            var winmode = MODEL_BUDGETS.getWinMode(seatId);
            var isWin = winmode > -1;
            var isBanker = MODEL_BUDGETS.getIsBanker(seatId)

            var uid = MODEL_BUDGETS.getUserId(seatId);

            var userName = MODEL_USER.getName(uid);
            if (userName.length > 6){
                userName = userName.substr(0,6) + "..";
            }
            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_window.js",seatId + "  budget_uid = " + uid + "uName=" + userName);

            this['nameLabel'].setString(userName); // 玩家名字
            this['imgPochan'].setVisible(isPoChan);
            this['img_banker'].setVisible(isBanker);
            //GLOBAL_T.MYSEAT
            if (seatId == GLOBAL_T.MYSEAT){
                this['player_own'].setVisible(true);
                this['player_location'].setVisible(false);
            }else{
                this['player_own'].setVisible(false);
                this['player_location'].setVisible(true);
                var str = "";
                switch(seatId){
                    case GLOBAL_T.SEATS.N0:
                        str = ""
                        break;
                    case GLOBAL_T.SEATS.N1:
                        str = "下家"
                        break;
                    case GLOBAL_T.SEATS.N2:
                        str = "对家"
                        break;
                    case GLOBAL_T.SEATS.N3:
                        str = "上家"
                        break;
                    default:
                        str = "";
                }
                this['player_location'].setString(str);
            }

            //叫嘴情况
            var jiaoZui = MODEL_BUDGETS.getIsJiaoZui(seatId)
            var isJiaoZui = false
            this['jiaozui_node'].setVisible(true);
            if (jiaoZui == 1){
                this['jiazui_ttf'].setVisible(true);
                this['weijiazui_ttf'].setVisible(false);
                isJiaoZui = true;
            }else if (jiaoZui == 0){
                this['jiazui_ttf'].setVisible(false);
                this['weijiazui_ttf'].setVisible(true);
            }else{
                this['jiaozui_node'].setVisible(false);
            }
            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_window.js","  jiaoZui = " + jiaoZui );

            var interval = 20;
            var init_pos = 0;
            var pos_x = this['img_banker'].getPositionX();
            if (isBanker){
                pos_x = this['isBanker_pos'].getPositionX();
            }
            if (this['jiaozui_node'].isVisible()) {
                pos_x = this['isJiaoZui_pos'].getPositionX();
            }

            var that = this;
            var ___douAndJi___ = function(){
                //翻牌机麻将缩小比例 0.38
                var douAndJi = MODEL_BUDGETS.getAllDouAndJi(seatId);
                GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_window.js","  douAndJi = " + JSON.stringify(douAndJi) + "  seatId = " + seatId);
                that['fan_shu_node'].setPositionX(pos_x + init_pos + interval);
                for (var i = 0; i < 6; ++i){
                    that['fan_xing_' + i].removeAllChildren();
                    that['fan_shu_' + i].setVisible(false);
                }
                if (douAndJi.length > 0){
                    that['fan_shu_node'].setVisible(true);
                    for (var i = 0; i < douAndJi.length; ++i){
                        that['fan_xing_' + i].setVisible(true);
                        that['fan_shu_' + i].setVisible(true);
                        var fan_str = "" + douAndJi[i][1];
                        if (douAndJi[i][1] >= 0) {
                            fan_str = "+" + douAndJi[i][1];
                        }
                        if (douAndJi[i][0] < 6){
                            if (___img___(douAndJi[i][0]) != "") {
                                var _fanXing  = cc.Sprite.createWithSpriteFrameName(___img___(douAndJi[i][0]));
                                _fanXing.setAnchorPoint(cc.p(0.5,0.5));
                                _fanXing.setPosition(cc.p(0,0));
                                that['fan_xing_' + i].addChild(_fanXing);
                            }
                            that['fan_shu_' + i].setString(fan_str);
                        }else if (douAndJi[i][0] == 6){//普通鸡
                            var _mahjBg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.GDMJ_KAIMA_MJP06_PNG);
                            _mahjBg.setAnchorPoint(cc.p(0.5,0.5));
                            _mahjBg.setPosition(cc.p(0,0));

                            var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_"+21+"_PNG";
                            var _mahjTile = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES[res]);
                            _mahjTile.setAnchorPoint(cc.p(0.5,0.5));
                            //_mahjTile.setPosition(cc.p(0,0));
                            _mahjBg.addChild(_mahjTile);
                            _mahjBg.setScale(0.38);
                            that['fan_xing_' + i].addChild(_mahjBg);
                            that['fan_shu_' + i].setString(fan_str);
                            var f_size = _mahjBg.getContentSize();
                            _mahjTile.setPosition(cc.p(f_size.width/2, f_size.height/2));
                            // that.pu_Tile = cc.Sprite.create();//花色
                            // var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_"+21+"_PNG";
                            // GLOBAL_FUNCS.textureChange(that.pu_Tile, GLOBAL_OBJ.RES[res]);
                            //
                            // that['fan_xing_' + i].addChild(that.pu_Tile);

                        }else if (douAndJi[i][0] == 7){//翻牌鸡
                            var _mahjBg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.GDMJ_KAIMA_MJP06_PNG);
                            _mahjBg.setAnchorPoint(cc.p(0.5,0.5));
                            _mahjBg.setPosition(cc.p(0,0));

                            var addFanTile = MODEL_BUDGETS.getaddFanTile(seatId);
                            var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_" + addFanTile + "_PNG";
                            var _mahjTile = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES[res]);
                            _mahjTile.setAnchorPoint(cc.p(0.5,0.5));
                            var f_size = _mahjBg.getContentSize();
                            _mahjTile.setPosition(cc.p(f_size.width/2, f_size.height/2));
                            _mahjBg.addChild(_mahjTile);
                            _mahjBg.setScale(0.38);
                            that['fan_xing_' + i].addChild(_mahjBg);
                            that['fan_shu_' + i].setString(fan_str);
                        }else if (douAndJi[i][0] == 8){//金鸡
                            var _mahjBg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.GDMJ_KAIMA_MJP06_PNG);
                            _mahjBg.setAnchorPoint(cc.p(0.5,0.5));
                            _mahjBg.setPosition(cc.p(0,0));

                            var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_"+21+"_PNG";
                            var _mahjTile = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES[res]);
                            _mahjTile.setAnchorPoint(cc.p(0.5,0.5));
                            //_mahjTile.setPosition(cc.p(0,0));
                            _mahjBg.addChild(_mahjTile);
                            _mahjBg.setScale(0.38);
                            that['fan_xing_' + i].addChild(_mahjBg);
                            that['fan_shu_' + i].setString(fan_str);
                            var f_size = _mahjBg.getContentSize();
                            _mahjTile.setPosition(cc.p(f_size.width/2, f_size.height/2));
                        }
                    }
                }
                else {
                    that['fan_shu_node'].setVisible(false);
                }
            }

            //胡牌牌型间隔 61 位置在builder中
            if (isWin){
                GLOBAL_FUNCS.textureChange(this['bg_sprite'],GLOBAL_OBJ.RES.NOPACK_GYMJ_BUDGET_BG_Y_XIAO_PNG );


            }else{
                GLOBAL_FUNCS.textureChange(this['bg_sprite'],GLOBAL_OBJ.RES.NOPACK_GYMJ_BUDGET_BG_G_PNG );
                // this['hu_xing_node'].setVisible(false);
                // this['fan_shu_node'].setVisible(true);
                // ___douAndJi___();
            }
            for (var i = 0; i < 5; ++i){
                this['hu_xing_' + i].setVisible(false);
            }
            var fanXing = MODEL_BUDGETS.getAllFanXingScore(seatId)
            this['hu_xing_node'].setPositionX(pos_x);
            if (fanXing.length > 0){
                this['hu_xing_node'].setVisible(true);
                for (var i = 0; i < fanXing.length; ++i){
                    //if ("string" == typeof (fanXing[i])){
                    this['hu_xing_' + i].setVisible(true);
                    this['hu_xing_' + i].setPositionX(init_pos);
                    this['hu_xing_' + i].setString(fanXing[i]);
                    init_pos = init_pos + this['hu_xing_' + i].getContentSize().width + 20;
                    //}
                }
            }else {
                this['hu_xing_node'].setVisible(false);
            }
            ___douAndJi___();

            //刷新 手牌模块
            this.unseenSlots   = [
                this.unseenSlot_1,  this.unseenSlot_2,  this.unseenSlot_3,  this.unseenSlot_4,
                this.unseenSlot_5,  this.unseenSlot_6,  this.unseenSlot_7,  this.unseenSlot_8,
                this.unseenSlot_9,  this.unseenSlot_10, this.unseenSlot_11, this.unseenSlot_12,
                this.unseenSlot_13, this.unseenSlot_14, this.unseenSlot_15
            ];

            //吃碰杠节点组
            this.methodSlots   = [
                this.cpgNode_1,  this.cpgNode_2,  this.cpgNode_3,  this.cpgNode_4
            ];
            /*
             大胡界面数据
             刷新 本家手牌信息 */
            var totalnum = GLOBAL_OBJ.table.scenes.Table.Functions.dahu_recovery_tiles(MODEL_BUDGETS,
                seatId, GLOBAL_T.SEATS.N2, this.unseenSlots, this.methodSlots, true,true);
            // // 金币、积分图标
            // var icontexture = this.isCreate ? GLOBAL_OBJ.RES.TABLE_FLOW_FEN_PNG : GLOBAL_OBJ.RES.GD_BUDGET_COIN_PNG;
            // GLOBAL_OBJ.LOGD(this._TAG, "check_budget_icon = " + icontexture);
            // GLOBAL_FUNCS.textureChange(this['img_icon'], icontexture);

            var winScoreLabel = this['winScoreLabel_0'];
            var loseScoreLabel = this['loseScoreLabel_0'];
            var score = MODEL_BUDGETS.getrealScore(seatId);
            winScoreLabel.setVisible(score >= 0);
            loseScoreLabel.setVisible(score < 0);


            //MODEL_BUDGETS.getKonged(seatId,tile);

            if (score >= 0)
            {
                if (score > 0){
                    //winScoreLabel.setString(score);
                    winScoreLabel.scheduleOnce(function(){
                        GLOBAL_OBJ.Util.playNumberAnimation(winScoreLabel, 0, score, 0, 1, function (_str) {
                            var txt = GLOBAL_FUNCS.formatGold(_str);
                            txt = "+" + txt;
                            return txt;
                        }, 0.7,0.9);

                        var labParent = winScoreLabel.getParent();
                        var effectPos = winScoreLabel.getPosition();
                        labParent.runAction(cc.Sequence.create(
                            cc.DelayTime.create(2.1),
                            cc.CallFunc.create(function () {
                                GLOBAL_OBJ.tableEffectPlayer.play(
                                    labParent,
                                    GLOBAL_OBJ.RES.JBJIESUAN_CCBI,
                                    effectPos,
                                    function(_animate){},
                                    function(_animate){},
                                    false);
                            })
                        ));
                    },1);

                }
                else{
                    if (isPoChan){
                        winScoreLabel.setVisible(false);
                        loseScoreLabel.setVisible(true);
                        loseScoreLabel.setString("0");
                    }
                    else{
                        winScoreLabel.setVisible(true);
                        loseScoreLabel.setVisible(false);
                        winScoreLabel.setString("0");
                    }
                }
            }
            else
            {
                loseScoreLabel.setString( score );
            }

            //胡的那张牌
            var winTile = MODEL_BUDGETS.getWinTile(seatId);
            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_window.js","  winTile = " + winTile );
            if (winTile > 0){
                GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_window.js","  winTile>0 = " + winTile );
                var mahj = GLOBAL_OBJ.table.modules.Mahjong.produce(winTile,seatId);

                if (seatId == GLOBAL_OBJ.table.global.MYSEAT) {
                    mahj.doStandTransform(seatId, true);
                }else{
                    mahj.doLayTransform(seatId, true);
                }
                size     = this.unseenSlot_14.getContentSize();
                mahj.getRootNode().setPosition(cc.p(size.width*0.5,size.height*0.5));
                this.unseenSlot_14.addChild(mahj.getRootNode());
                mahj.doStandTransform(GLOBAL_T.SEATS.N2, true);
                mahj.setTextureByName( mahj.faceSpr00, GLOBAL_OBJ.RES.GDMJ_KAIMA_MJP06_PNG)
            }

            // 添加头像
            var portraitNode = this["portraitNode"];
            if (portraitNode.getChildrenCount() == 0 && uid > 0) {
                GLOBAL_OBJ.businesses.modules.User.Portrait.produce(uid, GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, portraitNode);

                portraitNode.setScale(1.15);
            }

		},
        
	});

})();