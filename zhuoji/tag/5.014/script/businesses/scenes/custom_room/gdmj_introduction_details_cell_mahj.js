/*************************************************************
 *  mahjong_create_gameplay_introduction_details_cell_mahj.js
 *  mahjong
 	麻将牌 玩法规则介绍中展示的麻将牌
 *
 *  Created by lcr on 17-01-03
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ 				= guiyang;

	GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetailsCellMahj = cc.Class.extend({
		_TAG:'GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetailsCellMahj',
		ctor:function( _tile ){

			this.rootNode = cc.Node.create();
			this.rootNode.setContentSize(78, 112);
			this.rootNode.setAnchorPoint(0, 0);

			var imgBg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_03_PNG);
			imgBg.setAnchorPoint(0.5, 0.5);
			imgBg.setPosition(39, 56);
			this.rootNode.addChild(imgBg);

			var tileKey = 'GUIYANG_'+ _tile +'_PNG';
            var imgFace = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES[tileKey]);
			imgFace.setAnchorPoint(0.5, 0.5);
			imgFace.setPosition(39, 73);
			this.rootNode.addChild(imgFace);
		},

		onCleanup:function(){
		},

	});
})();