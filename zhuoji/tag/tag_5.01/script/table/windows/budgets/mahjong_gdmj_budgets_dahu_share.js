(function(){
    var GLOBAL_OBJ = guiyang;
    /**
     * 大胡分享类
     */
    var GLOBAL_T             = GLOBAL_OBJ.table.global;
    var GLOBAL_FUNCS         = GLOBAL_OBJ.businesses.functions;
    var MODEL_ROUND_RESULT   = GLOBAL_OBJ.table.models.roundresult;
    var MODEL_BUDGETS        = GLOBAL_OBJ.table.models.Budget;
    var MODEL_USER           = GLOBAL_OBJ.businesses.modules.User.Model;
    var MODEL_TABLEINFO      = GLOBAL_OBJ.table.models.TableInfo;

    GLOBAL_OBJ.table.windows.gdmj.jipinghu.Budgets.DaHuShare = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
        _TAG: 'table.windows.gdmj.jipinghu.Budgets.DaHuShare',
        ctor: function( _params ) {
            this._super();
            this.params = _params;
            this.init(GLOBAL_OBJ.RES.GDMJ_BUDGETS_DAHU_SHARE_CCBI);
        },

        init:function(_ccbi){
            this._super(_ccbi);
        },

        onLoad: function() {
            var that = this;
            this._super();
            GLOBAL_OBJ.LOGD(this._TAG, "dahu_share_load_begin");

            this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
            var seatId    = GLOBAL_T.MYSEAT;

            var winMode   = MODEL_BUDGETS.getWinMode(seatId);
            var hufaCCB_1 = MODEL_BUDGETS.getPatternCCBByWinMode(winMode);
            GLOBAL_OBJ.LOGD("check_dahu_share_hufa_ccb1 = "+hufaCCB_1+", winmode = "+winMode);
            var hufaCCB_2 = "";
            if (winMode == 14)
            {
                hufaCCB_2 = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_GSKH_CCBI;
            }

            var fanxingCCB = MODEL_BUDGETS.dealWithWinModeInPatterns(seatId);
            var fanxingPos = cc.p(0,0);
            var hufaPos_1  = cc.p(0,0);
            var hufaPos_2  = cc.p(0,0);
            if(hufaCCB_2){//如果有两个胡法显示
                fanxingPos  = cc.p(0,-60);
                hufaPos_1   = cc.p(0,60);
                hufaPos_2   = cc.p(0,-70);
            }

            GLOBAL_OBJ.bkernel.utils.Animation.play(
                that.dahu_share_fanxing,
                fanxingCCB.ccb,
                fanxingPos,
                function (_animate) {},
                function (_animate) {},
                true, 1.0, "dahu");

            if(hufaCCB_1){
                var dahuAni = "dahu";
                GLOBAL_OBJ.bkernel.utils.Animation.play(
                    that.dahu_share_hufa1,
                    hufaCCB_1,
                    hufaPos_1,
                    function (_animate) {},
                    function (_animate) {},
                    true, 1.0, dahuAni);
            }

            if(hufaCCB_2){
                var dahuAni = "dahu";
                GLOBAL_OBJ.bkernel.utils.Animation.play(
                    that.dahu_share_hufa2,
                    hufaCCB_2,
                    hufaPos_2,
                    function (_animate) {},
                    function (_animate) {},
                    true, 1.0, dahuAni);
            }

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
            var totalnum = GLOBAL_OBJ.table.scenes.Table.Functions.dahu_recovery_tiles(MODEL_ROUND_RESULT,
                seatId, seatId, this.unseenSlots, this.methodSlots, true);
            var dhcpgPos = this.dahu_cpg_node.getPosition();
            var offX 	 = 24 * totalnum;
            dhcpgPos.x   = dhcpgPos.x + offX;
            this.dahu_cpg_node.setPosition(dhcpgPos);

            // var tile     = MODEL_ROUND_RESULT.getWinTile(seatId);
            var tile     = [MODEL_ROUND_RESULT.getBigWinTile(seatId)];
            GLOBAL_OBJ.LOGD(this._TAG, "OnlywinTile:" + JSON.stringify(tile));
            var k_index = 0;
            for(var key in tile){
                k_index = k_index + 1;
            }
            var size2 = this["sharehu_" + 0].getBoundingBox();
            this.share_dahu_node.setVisible(true);
            for(var i = 0; i < 5; i++){
                if(i < k_index){
                    var huMj = new GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.XZDHCell();
                    huMj.update(i);
                    this["sharehu_" + i].addChild(huMj.getRootNode());
                    this["sharehu_" + i].setVisible(true);
                    huMj.getRootNode().setPosition(cc.p(size2.width/2.0, size2.height/2.0));
                }
            }
            this.initBottom();
            GLOBAL_OBJ.LOGD(this._TAG, "dahu_share_load_end");
        },

        onCleanup:function() {
            this._super();
        },

        initBottom:function () {
            var seatId = GLOBAL_T.MYSEAT;

            //玩家名字
            var uid      = MODEL_ROUND_RESULT.getUserIdByLocalId(seatId);
            var userName = MODEL_USER.getName(uid);
            this.dahu_share_username.setString(userName);

            //头像
            if (this.dahu_share_tou.getChildrenCount() == 0) {
                GLOBAL_FUNCS.changeParent(this.params.head.getRootNode(), this.dahu_share_tou, cc.p(0, 0));
                this.dahu_share_tou.setScale(1.3);
            }

            //创建女孩
            this.womanAnimal = new sp.SkeletonAnimation(GLOBAL_OBJ.RES.SPINE_FIGURES_JSON, GLOBAL_OBJ.RES.SPINE_FIGURES_ATLAS);
            this.dahu_woman_node.addChild(this.womanAnimal);
            this.womanAnimal.setAnimation(0, "animation", true);
            this.womanAnimal.setPosition(cc.p(0,0));

            //输赢分、倍
            var score 		= MODEL_ROUND_RESULT.getTotalScoreByLocalId(seatId);
            var scroeText 	= GLOBAL_FUNCS.formatGold(score);
            this.dahu_share_cibei_ying.setVisible(score >= 0);
            this.dahu_share_cibei_shu.setVisible(score < 0);
            var labFnt = score >= 0 ? this.dahu_share_cibei_ying : this.dahu_share_cibei_shu;
            this.dahu_share_cibei_ying.setString( score >= 0 ? "+" + scroeText : scroeText );
            this.dahu_share_cibei_shu.setString(score >= 0 ? "+" + scroeText : scroeText );

            this.dahu_share_cibei.setString("倍");

            //var huFanShu = MODEL_ROUND_RESULT.getTotalFanByLocalId(seatId);
            //this.dahu_share_cibei_fnt.setString(huFanShu.toString());//胡多少倍
            this.jifen.setVisible(this.isCreate);
            this.jinbi.setVisible(!this.isCreate);
            var imgIcon = this.isCreate ? this.jifen : this.jinbi;

            var width_1 = this['dahu_share_cibei_fnt'].getContentSize().width;
            var posx_1 =  this['dahu_share_cibei_fnt'].getPositionX();
            this['dahu_share_cibei'].setPositionX(posx_1 + width_1*0.6 + 2);
            var width_2 = this['dahu_share_cibei'].getContentSize().width;
            var posx_2 =  this['dahu_share_cibei'].getPositionX();
            imgIcon.setPositionX(posx_2 + width_2 + 2);
            var width_3 = imgIcon.getContentSize().width;
            var posx_3 = imgIcon.getPositionX();
            labFnt.setPositionX(posx_3 + width_3 + 2);
        },
    });

})();