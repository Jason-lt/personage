/**
 * 精灵按钮
 * Created by 许敬 on 2017/6/23.
 */
(function () {
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.SpriteBtn = cc.Class.extend({
        _TAG:'SpriteBtn',

        ctor:function (imgPath, bgPath , parentNode ,flag_p) {

            this.imgPath = imgPath;
            this.bgPath = bgPath;
            this.targetParent = parentNode;
            this.flag = flag_p;
            this._inTouch = false;

            this.btnNode = cc.Node.create();

            if (this.bgPath){
                this.bgImg = cc.Sprite.createWithSpriteFrameName(this.bgPath);
                this.btnNode.addChild(this.bgImg);

                this.bgImg.setVisible(false);
            }

            this.btnImg = cc.Sprite.createWithSpriteFrameName(this.imgPath);
            this.btnNode.addChild(this.btnImg);

            parentNode.addChild(this.btnNode);

            var bgImgS = this.bgImg;
            var that = this;

            this.touchListener = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(this.btnImg, true,
                function (listener, touch, event) {
                    if (bgImgS){
                        bgImgS.setVisible(true);
                    }
                    // that.btnImg.setColor(cc.color(0,255,54));
                    that._inTouch = true;
                    return true;
                },
                function (listener, touch, event) {
                    var point = that.btnImg.convertToNodeSpace(touch.getLocation());
                    var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefSelf(that.btnImg);
                    that._inTouch = cc.rectContainsPoint(rect, point);

                    if (bgImgS){
                        bgImgS.setVisible(that._inTouch);
                    }

                    // if (that._inTouch){
                    //     that.btnImg.setColor(cc.color(0,255,54));
                    // }
                    // else{
                    //     that.btnImg.setColor(cc.color(255,255,255));
                    // }
                },
                function (listener, touch, event, inRect) {
                    if (bgImgS){
                        bgImgS.setVisible(false);
                    }

                    // that.btnImg.setColor(cc.color(255,255,255));

                    if (!that._inTouch){
                        return;
                    }
                    ty.NotificationCenter.trigger(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.SPRITE_BTN_TOUCH , that.flag);
                },
                null,this);
        },

        destroy:function () {

            if (this.touchListener && this.touchListener.__nativeObj){
                cc.eventManager.removeListener(this.touchListener);
            }


            // this.btnNode.removeAllChildren();
            // this.btnNode.removeFromParent();

            this.bgImg = null;
            this.btnImg = null;
            this.btnNode = null;

            this.avatarSprite = null;

            this.targetParent = null;
        }
    });
})();
