/**
 * mahjong_match_page_tag.js
 *
 *
 *  Created by xujing on 17-11-10
 *  特殊说明：

 使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
	
	GLOBAL_OBJ.businesses.scenes.Match.pageTagItem = cc.Class.extend({
		ctor: function(tagId) {

			this.pageSelected = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.PAGE_PT_1_PNG);
			this.pageSelected.setAnchorPoint(cc.p(0, 0));

			this.pageTag = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.PAGE_PT_2_PNG);
			this.pageTag.setAnchorPoint(cc.p(0, 0));

			this.pageTag.addChild(this.pageSelected);
			this.pageSelected.setVisible(false);
			this.tagId = tagId;
		},

		node: function() {
			return this.pageTag;
		},

		setSelected: function(id) {
			if (id != this.tagId) {
				this.pageSelected.setVisible(false);
				return;
			}
			this.pageSelected.setVisible(true);
		},

		size: function() {
			return this.pageTag.getContentSize();
		},

		setPosition: function(pos) {
			this.pageTag.setPosition(pos);
		},
		destory: function() {
			this.pageSelected = null;
			this.pageTag = null;
		}
	});

	GLOBAL_OBJ.businesses.scenes.Match.pageTag = cc.Class.extend({

		ctor: function(cnt) {
			this.node = cc.Node.create();
			this.items = [];
			this._createNode(cnt);
		},

		destory: function() {

			var item;
			for (var i=0; i < this.items.length; i++) {
				item = this.items[i];
				item.destroy();
			}

			this.items.length = 0;
			this.items = null;

			this.node = null;
		},

		// 生成节点
		_createNode: function(cnt) {
			var itemSize;
			var xInter = 12;
			var totalW = 0;
			for (var i=0; i<cnt; i++) {
				var itemNode = new GLOBAL_OBJ.businesses.scenes.Match.pageTagItem(i);
				itemSize = itemNode.size();
				this.node.addChild(itemNode.node());

				var xPos = i * itemSize.width + i * xInter;
				itemNode.setPosition(cc.p(xPos, 0));

				totalW += itemSize.width;
				this.items.push(itemNode);
			}
			totalW += (cnt - 1) * xInter;
			this.node.setContentSize(cc.size(totalW, itemSize.height));
			this.node.setAnchorPoint(cc.p(0.5, 0.5));
		},

		getNode: function() {
			return this.node;
		},

		setPosition: function(pos) {
			this.node.setPosition(pos);
		},

		setSelected: function(selectedId) {
			for (var i=0; i<this.items.length; i++) {
				this.items[i].setSelected(selectedId);
			}
		}

	});
	//end
})();