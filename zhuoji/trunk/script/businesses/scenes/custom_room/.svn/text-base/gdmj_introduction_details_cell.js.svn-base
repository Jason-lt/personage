/*************************************************************
 *  mahjong_create_gameplay_introduction_details_cell.js
 	mahjong_create_gameplay_introduction_details_cell
 *  mahjong
    玩法介绍 cell
 *
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS					           = GLOBAL_OBJ.businesses.functions;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetailsCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.gameplayIntrDetailsCell",
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;
			this.mahjNode = null;
			this.init(GLOBAL_OBJ.RES.GDMJ_INTRODUCTION_DETAILS_CELL_CCBI);
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

			var rootNode 		= this.getRootNode();
			var rootNodeSize 	= rootNode.getContentSize();
			var data 			= this.config.data.data;
			var content 		= data[_index].content;
			var contentSize;

			this.cleanMahjongs();

			if (typeof(content) == 'object'){
				this._desLabelttf.setVisible(false);
				//创建要显示的牌
				this.mahjNode = cc.Sprite.create();
				GLOBAL_FUNCS.addToParent(this.mahjNode,rootNode);
				this.mahjNode.setContentSize(cc.size(rootNodeSize.width, 116));
				this.mahjNode.setScale(0.48);

				this.mahjNode.setAnchorPoint(cc.p(0,0));
				this.mahjNode.setPosition(cc.p(0,0));

				var mahj;
				var tileId;
				var mjNode;
				var px = 40;

				for (var i = 0;i < content.length;i++){
					tileId = content[i];
					if (typeof(tileId) == 'object'){
						for(var jj = 0; jj < tileId.length; jj++){
							var tileIdChild = tileId[jj];
							if (tileIdChild > 0){
								mahj = new GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetailsCellMahj(tileIdChild);
								mjNode = mahj.rootNode;
								GLOBAL_FUNCS.addToParent(mjNode, this.mahjNode);
                                mjNode.setPositionX(px);
                                mjNode.setPositionY(15+jj*21);
							}
						}
						px += 78;
					}
					else if (tileId > 0){
						mahj = new GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetailsCellMahj(tileId);
                        mjNode = mahj.rootNode;
						GLOBAL_FUNCS.addToParent(mjNode, this.mahjNode);
                        mjNode.setPositionX(px);
                        mjNode.setPositionY(15);
						px += 78;
					}
					else{
						px += 8;
					}
				}

				rootNode.setContentSize(cc.size(rootNodeSize.width, 73));
			}
			else{
				if(data[_index].content){
					var font_name 		= data[_index].font;
					var font_size 		= data[_index].size;
					var font_color		= data[_index].color;
					var fcolor          = cc.color(font_color.rr, font_color.gg, font_color.bb);
					this._desLabelttf.setVisible(true);
					this._desLabelttf.setFontName(font_name);
					//pk modify: 暂时设置字体大小和颜色
					this._desLabelttf.setFontSize(font_size);
					this._desLabelttf.setString(data[_index].content);
					this._desLabelttf.setColor(fcolor);//cc.color(136,63,17)
				}

				contentSize = this._desLabelttf.getContentSize();
				rootNode.setContentSize(cc.size(rootNodeSize.width, contentSize.height+10));
				this._desLabelttf.setPosition( cc.p( 10, (contentSize.height+10)*0.5) );
			}
		}
	});
	//end
})();

