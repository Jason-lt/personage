/*************************************************************
 *  mahjong_create_room_record_cell.js
    mahjong_create_room_record_cell
 *  mahjong
 	自建桌 牌局回放 cell
 *
 *  Created by zengxx on 16-08-01
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
    var TAG = 'businesses.scenes.CustomRoom.TableRecordCell';

	GLOBAL_OBJ.businesses.scenes.CustomRoom.TableRecordCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.TableRecordCell",
		
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;//第几页
            this.players = [];

			this.init(GLOBAL_OBJ.RES.CREATE_ROOM_TABLE_RECORD_CELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
            
            //pk modify:回放按钮,暂时隐藏
            this.playBackBtnNode.setVisible(false);
			// 回放
			var that = this;
			var ___f_click    = (function(){
                var interrupt = false;
                return [ function(){
                    if (!interrupt) {
                    	that.config.data.callFunc(that.index);
                    	GLOBAL_OBJ.GlobalVars.setIsTableRecord(true);
                    }
                },
                function(){
                    interrupt = true;
                },
                function(){
                    interrupt = false;
                } ];
            })();

            GLOBAL_OBJ.bkernel.extend.Node.bind_scale_button_ext(this.playBackBtnNode, ___f_click[0], 
            	true, this.config.container, ___f_click[1], ___f_click[2]);

            // var users_info = this.config.data.data.users_info;
            // this.changeUserNodePos(users_info);
		},

        onCleanup:function() {
            this.removeAllPlayers();
            this.players = [];
            this._super();
        },

        removeAllPlayers:function () {

            var player;
            for (var i = 0; i < this.players.length; i++){
                player = this.players[i];
                player.getRootNode().removeFromParent();
            }

            this.players.length = 0;
        },

		/*
		界面刷新
		*/
		update:function(_index, _config){
			this.index  = _index;
			this.config = _config;

			// 局数
			this['titleLabel'].setString("第"+(_index+1)+"局");

			// 积分信息
			var users_info = _config.data.data.users_info;
			
			// 用户信息
            var player;
            for (var i = 0; i < users_info.length; i++){
                player = new GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordPlayerCell(users_info[i], false);

                GLOBAL_OBJ.LOGI(TAG, "当前数据索引 ID :" + i);
                var node = player.getRootNode();
                this.players.push(player);
                this["userNode" + i].addChild(node);
            }
		},

		changeUserNodePos:function(_userInfo)
        {
            var size = _userInfo.length;
            if (size == 4)
            {
                return;
            }
            else if (size == 3)
            {
                var posx = 0;
                for (var i = 0; i < size; i++)
                {
                    posx = this['userNode'+i].getPositionX();
                    this['userNode'+i].setPositionX(posx + 85);
                };
            }
            else if (size == 2)
            {
                var posx = 0;
                for (var i = 0; i < size; i++)
                {
                    posx = this['userNode'+i].getPositionX();
                    this['userNode'+i].setPositionX(posx + 150);
                };

            }
            else
            {
                return;
            }
        },

	});
	//end
})();

