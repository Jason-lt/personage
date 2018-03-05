/*************************************************************
 *  mahjong_create_room_rules_cell_hall.js
    mahjong_create_room_rules_cell_hall
 *  mahjong
pk modify:大厅自建桌 玩法介绍 cell
 *
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS					           = GLOBAL_OBJ.businesses.functions;
	var STATIC                                     = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
	var MODEL 								       = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesCellHall = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.RulesCellHall",
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;//第几页
			this.mahjs = null;
			this.mahjNode = null;

			this.init(GLOBAL_OBJ.RES.CREATE_ROOM_RULES_CELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var size          = this.view.ccbRootNode.getContentSize();
			this._desLabelttf = cc.LabelTTF.create("", "Arial", 30);
            this._desLabelttf.setAnchorPoint(cc.p(0, 0.5));
            this._desLabelttf.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this._desLabelttf.setDimensions(cc.size(size.width*0.9,0));
            this.view.ccbRootNode.addChild(this._desLabelttf);
		},

		onCleanup:function() {
			this.cleanMahjongs();
			this._super();
		},

		cleanMahjongs:function(){
			if (this.mahjs){
				var mahj;
				for (var i = 0;i < this.mahjs.length;i++){
					mahj = this.mahjs[i];
					mahj.getRootNode().removeFromParent();
				}
				this.mahjs.length = 0;
				this.mahjs = null;
			}

			if (this.mahjNode){
				this.mahjNode.removeAllChildren();
				this.mahjNode.removeFromParent();
				this.mahjNode = null;
			}
		},


		/*
		界面刷新
		*/
		update:function(_index, _config){

			var rootNode = this.getRootNode();
			var rootNodeSize = rootNode.getContentSize();

			var data = this.config.data.data;
			var content = data[_index].content;
			var contentSize;

			this.cleanMahjongs();

			if (typeof(content) == 'object'){

				this._desLabelttf.setVisible(false);

				//创建要显示的牌

				this.mahjNode = cc.Sprite.create();
				GLOBAL_FUNCS.addToParent(this.mahjNode,rootNode);
				this.mahjNode.setContentSize(cc.size(rootNodeSize.width, 116));
				this.mahjNode.setScale(0.5);

				this.mahjNode.setAnchorPoint(cc.p(0,0));
				this.mahjNode.setPosition(cc.p(0,0));

				var mahj;
				var tileId;
				var mahjNode;
				var px = 63;

				this.mahjs = [];

				for (var i = 0;i < content.length;i++){
					tileId = content[i];
					if (tileId > 0){
						mahj = GLOBAL_OBJ.table.modules.Mahjong.produce(tileId);
						this.mahjs.push(mahj);

						mahj.doLayTransform(0,true);

						mahjNode = mahj.getRootNode();
						GLOBAL_FUNCS.addToParent(mahjNode,this.mahjNode);

						mahjNode.setPositionX(px);
						mahjNode.setPositionY(73);

						px += mahj.mainNode.getContentSize().width;
					}
					else{
						px += 20;
					}
				}

				rootNode.setContentSize(cc.size(rootNodeSize.width, 73));
			}
			else{
				this._desLabelttf.setVisible(true);
				this._desLabelttf.setFontName("Arial");
				//pk modify: 暂时设置字体大小和颜色
				this._desLabelttf.setFontSize(24);//data[_index].size
				this._desLabelttf.setString(data[_index].content);
				this._desLabelttf.setColor(cc.color(255,255,255));//data[_index].color

				contentSize = this._desLabelttf.getContentSize();
				rootNode.setContentSize(cc.size(rootNodeSize.width, contentSize.height+10));

				this._desLabelttf.setPosition( cc.p( 10, (contentSize.height+10)*0.5) );
			}
		}
	});
	//end
})();

