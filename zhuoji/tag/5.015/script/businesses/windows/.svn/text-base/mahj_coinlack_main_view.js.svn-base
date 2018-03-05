/**
 * mahj_coinlack_main_view.js
 * Created by tuyoo on 2017/7/11.
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    
    GLOBAL_OBJ.businesses.windows.CoinLackMainView = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
        _TAG:"CoinLackMainView",
        POP_DOWNLOAD_ICON_RES : 'POP_DOWNLOAD_ICON_RES',
        ctor: function(pars) {
            this._super();
            // TODO
            this.m_params = pars;
            this.m_hasSubAction = false;
            this.init(GLOBAL_OBJ.RES.MAHJ_COINLACK_MAIN_CCBI);
        },

        onLoad: function() {
            this._super();
            // TODO
            // GLOBAL_OBJ.LOGD(this._TAG, "getWindowParam:::"+JSON.stringify(params));

            // 顶部提示
            this._initTopTipRichText(this.m_params);
            // 底部提示
            this._initBottomTipRichText(this.m_params);
            this.ccb_SpriteCoin.setVisible(false);

            this['txtTitle'].setString(this.m_params['title'] || this.m_params['sub_action_text'] || '提示');

            ty.AsyncImgDownload.addAsyncImgDownloadObserver(
                this.POP_DOWNLOAD_ICON_RES,
                this, this._onDownloadIcon);

            this.onShowAnimFinish();
        },

        onDestroy: function() {

            ty.AsyncImgDownload.removeAsyncImgDownloadObserver(
                this.POP_DOWNLOAD_ICON_RES,
                this, this._onDownloadIcon);

            // 没有sub-action才执行下一个action
            // if (!this.m_hasSubAction) {
            //     hall.ToDoTask.runNextTask();
            // }

            // TODO
            this._super();
        },

        //显示动画完成的回调
        onShowAnimFinish:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"onShowAnimFinish");
            // 下载图标
            this.iconUrl = "";
            if (this.m_params.iconUrl) {
                this.iconUrl = this.m_params.iconUrl;
                this._downloadIcon(this.m_params.iconUrl);
            }
            else if (this.m_params.sub_action && this.m_params.sub_action.params && this.m_params.sub_action.params.picurl){
                this.iconUrl = this.m_params.sub_action.params.picurl;
            }

            if (this.iconUrl){
                this._downloadIcon(this.iconUrl);
                // this.ccb_SpriteCoin.setVisible(false);
            }
            else{
                this.ccb_SpriteCoin.setVisible(true);
            }
        },

        // 顶部提示富文本
        _initTopTipRichText: function(params) {
            var desc = params.desc || params.des || '';

            if (desc.indexOf("text") > -1){
                var arr = JSON.parse(desc);
                desc = "";

                var subAr,obj;
                for (var i in arr){
                    obj = arr[i][0];
                    desc += obj['text'];
                }
            }

            desc = desc.replace('胜负乃兵家常事，大侠请重新来过。',''); //修复转运礼包文字描述过长的BUG

            this['txtDesc'].setString(desc);
        },

        _initBottomTipRichText: function(params) {
            var detail = "";
            if (params.detail){
                detail = params.detail;
            }
            else if(params.sub_action && params.sub_action.params && params.sub_action.params.name){
                detail = params.sub_action.params.name;
            }
            var note = params.price + '元 = ' + detail;
            this['txtNote'].setString(note);
        },

        _downloadIcon: function(url) {
            ty.AsyncImgDownload.downloadImgAsync(
                this.POP_DOWNLOAD_ICON_RES
                , url
                , hall.webPicCache
                , {'url':url}
            );
        },

        _alignParentToCenter: function(child) {
            var parent = child.getParent();
            hall.assert.true(parent, "_alignParentToCenter child not add to parent");
            child.setAnchorPoint(cc.p(0.5,0.5));
            var size = parent.getContentSize();
            child.setPosition(size.width/2, size.height/2);
        },

        // 下载回调

        _onDownloadIcon: function(retObj, param) {
            if (this._checkDonwloadResult(retObj) && retObj.path) {
                if (param.url == this.iconUrl) {
                    this._setSpriteFrameByPath(this.ccb_SpriteCoin, retObj.path);
                    this.ccb_SpriteCoin.setVisible(true);
                }
            }
        },

        // 下载的结果判断
        _checkDonwloadResult:function(retObj){
            return (retObj.statusCode == 200 && retObj.openErr != 1 && retObj.writeErr != 1);
        },

        // 给精灵换纹理图片
        _setSpriteFrameByPath:function(sprite, path) {
            var spr = cc.Sprite.create(path);
            if(!spr)
            {
                GLOBAL_OBJ.LOGE(this._TAG,'setSpriteFrameByPath fail,spr is null!');
                return;
            }
            var size = spr.getContentSize();
            var rect = cc.rect(0, 0, size.width, size.height);
            var frame = cc.SpriteFrame.create(path, rect);
            if (!frame) {
                GLOBAL_OBJ.LOGE(this._TAG, "create frame from pic path ERR!!!!!!!!");
                return;
            }
            sprite.setSpriteFrame(frame);
        },

        // 重写

        _runCloseActionIfCan: function(subAction) {
            // GLOBAL_OBJ.LOGD("_runCloseActionIfCan", JSON.stringify(subAction));
            if (subAction) {
                this.m_hasSubAction = true;
                GLOBAL_OBJ.bkernel.utils.ToDoTasks.runOneTask(subAction);
            }
        },

        onBackKeyClicked: function() {
            var params = this.m_params;
            this._runCloseActionIfCan(params.sub_action_close);
            this.windowClose();
        },

        onBtnCloseClicked: function() {
            var params = this.m_params;
            this._runCloseActionIfCan(params.sub_action_close);
            this.windowClose();
        },

        onBtnMaskClicked: function() {
            var params = this.m_params;
            this._runCloseActionIfCan(params.sub_action_close);
            this.windowClose();
            return true;
        },

        // CCB Callbacks
        onButtonClick: function() {
            var params = this.m_params;
            this._runCloseActionIfCan(params.sub_action);
            this.windowClose();
        },

        onButtonCancel:function () {
            this.onBtnCloseClicked();
        },

        destroy:function () {
            this._super();
            this.m_params = null;
            this.m_hasSubAction = false;
        }

    });
//end
})();