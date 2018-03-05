
/*************************************************************
 *  mahjong_table_mahjong_mahj_arrow.js
 *  弃牌区，黄色小箭头
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.scenes.Table.Mahjong.Arrow = cc.Class.extend({

		_TAG:"table.scenes.Table.Mahjong.Arrow",

		ctor: function() {
			this.rootNode = cc.BuilderReader.loadWithController(GLOBAL_OBJ.RES.TABLE_TILE_ARROW_CCBI, this, this);
			var self = this;
			this.rootNode.onCleanup = function () {
				self.rootNode.onCleanup = null;
				self.onCleanup();
			};
			this._playing = true;

			this.onLoad();
		},

		onLoad:function () {
			this.viewNodes = [this['faceSpr00'],this['faceSpr01']];
			this.viewNodesActions = [];

			var backSeq = cc.Sequence.create(cc.MoveTo.create(0.5, 17, 46), cc.MoveTo.create(0.5, 17, 33));
			var backRep = backSeq.repeatForever();

			this.viewNodesActions.push(backRep);

			var frontFadeSeq = cc.Sequence.create(cc.FadeTo.create(0.5, 100), cc.FadeTo.create(0.5, 0));
			var frontMoveSeq = cc.Sequence.create(cc.MoveTo.create(0.5, 17, 46), cc.MoveTo.create(0.5, 17, 33));

			var frontSpawn = cc.Spawn.create(frontMoveSeq,cc.ScaleTo.create(1, 1.3),frontFadeSeq).repeatForever();

			this.viewNodesActions.push(frontSpawn);

			backRep.retain();
			frontSpawn.retain();
		},

		play:function () {

			if (this._playing){
				return;
			}
			this._playing = true;
			this.rootNode.setVisible(true);

			this['partNode'].resetSystem();

			var viewNode, viewNodeAction;
			for (var i = 0; i < this.viewNodes.length; i++){
				viewNode = this.viewNodes[i];
				viewNodeAction = this.viewNodesActions[i];

				viewNode.runAction(viewNodeAction);
			}
		},

		stop:function () {

			if (!this._playing){
				return;
			}
			this._playing = false;

			this.rootNode.setVisible(false);
			this['partNode'].stopSystem();

			if (!this.viewNodes){
				return;
			}

			var viewNode;
			for (var i = 0; i < this.viewNodes.length; i++){
				viewNode = this.viewNodes[i];
				viewNode.stopAllActions();
			}
		},

		getRootNode:function () {
			return this.rootNode;
		},

		onCleanup:function() {

			var viewNode;
			for (var i = 0; i < this.viewNodes.length; i++){
				viewNode = this.viewNodes[i];
				viewNode.stopAllActions();
			}

			this.viewNodes.length = 0;
			this.viewNodes = null;

			var action;
			for (var j = 0; j < this.viewNodesActions.length; j++){
				action = this.viewNodesActions[j];
				action.release();
			}

			this.viewNodesActions.length = 0;
			this.viewNodesActions = null;

			this.rootNode = null;
		}
	});
	//end
})();

