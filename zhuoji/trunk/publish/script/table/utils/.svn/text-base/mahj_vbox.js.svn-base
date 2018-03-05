/**
 * mahj_vbox.js
 * Created by 许敬 on 2017/7/7.
 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.VBox = cc.ScrollView.extend({
    /**
     * 初始化一个VBox
     * @param size 视口大小
     * @param vs 行与行之前的间隔，默认值0
     */
    ctor:function (size, vs) {
        this._super();
        this.itemVs = vs || 0; //行与行之前的间隔
        this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.setViewSize(size);
        this.items = [];
    },
    addItem:function (item, zidx) {
        if (zidx){
            this.addChild(item,zidx);
        }
        else{
            this.addChild(item);
        }

        item.x = 0;
        item.y = 0;

        item.setAnchorPoint(0,0);

        var itemInList;
        var allHeight = 0;
        var addHeight = item.height + this.itemVs;
        for(var i = 0; i < this.items.length;i++){
            itemInList = this.items[i];
            allHeight += itemInList.height + this.itemVs;
            itemInList.y += addHeight;
        }

        allHeight += item.height;

        var contentSize = this.getContentSize();
        this.setContentSize(contentSize.width, allHeight);

        this.items.push(item);

        this.toTop();
    },
    /**
     * 滚动到顶部
     */
    toTop:function(){
        this.setContentOffset(cc.p(0, this.getViewSize().height - this.getContentSize().height));
    },
    /**
     * 滚动到底部
     */
    toBottom:function(){
        this.setContentOffset(cc.p(0, 0));
    },
    /**
     * 删除所有元素
     */
    removeAllItem:function () {
        var item;
        for(var i = 0; i < this.items.length;i++){
            item = this.items[i];
            if (item.hasOwnProperty('destory')){
                item.destroy();
            }
            item.removeFromParent();
        }

        this.items.length = 0;
    },
    /**
     * 重绘所有元素
     */
    visitItems:function () {
        var item;
        for(var i = 0; i < this.items.length;i++){
            item = this.items[i];
            item.visit();
        }
    },
    destory:function () {
        this.removeAllItem();
        this.items = null;

        this.removeFromParent();
    }
});
})();