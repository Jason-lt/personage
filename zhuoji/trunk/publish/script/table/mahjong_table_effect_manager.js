/**
 * 牌桌特效管理器，要牌桌播放的特效，要在进入牌桌之前进行初始化，并缓存到这里，播放的时候，直接取，不要再进行加载初始化
 * 以提高效率
 *
 * 如果特效中有粒子，在要配置中，配置好粒子节点数量，如："partCount:6"，在ccb中编辑粒子节点，名称为"part0,part1......partN"以此类推
 * 缓存特效在创建时，会根据配置从CCB里取粒子节点进行操作。
 * Created by xujing on 2017/7/26.
 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    
    GLOBAL_OBJ.table.EffectManager = cc.Class.extend({
        _TAG: 'GLOBAL_OBJ.table.EffectManager',
        effectList:[],
        ctor:function () {
            this.cacheEffectIds = [
                {'id':GLOBAL_OBJ.RES.TABLE_DEALING_CCBI,        'count':1},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_TX_KAIJU4_CCBI,      'count':1},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_TX_PPD_CCBI,         'count':1, partCount:1},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_TX_SHAIZI_CCBI,      'count':1},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_GANG_CCBI,   'count':1},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_P_CCBI,      'count':1},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_CHI_CCBI,    'count':1},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_TX_HUPAI_CCBI,       'count':3, partCount:2},
                {'id':GLOBAL_OBJ.RES.MJ_ZM_TX_HUPAI1_CCBI,      'count':1, partCount:1},
                {'id':GLOBAL_OBJ.RES.MJ_ZM_TX_HUPAI2_CCBI,      'count':1},
                {'id':GLOBAL_OBJ.RES.MJ_ZM_TX_LIUJU_CCBI,       'count':1},

                // 左右摸牌
                {'id':GLOBAL_OBJ.RES.MAHJ_DEALING_CCBI,         'count':1},

                {'id':GLOBAL_OBJ.RES.MJ_ZM_PIAOZHUANG01_CCBI,   'count':2},
                {'id':GLOBAL_OBJ.RES.MJ_ZM_PIAOZHUANG_CCBI,     'count':1, partCount:5},

                {'id':GLOBAL_OBJ.RES.JBJIESUAN_CCBI,            'count':3, partCount:1},

                {'id':GLOBAL_OBJ.RES.XZ_ZM_DQ3_CCBI,            'count':3},
                {'id':GLOBAL_OBJ.RES.XZ_ZM_DQ4_CCBI,            'count':3},
                
                {'id':GLOBAL_OBJ.RES.MAHJ_MATCH_TABLE_SHOW_CCBI,'count':1},
                {'id':GLOBAL_OBJ.RES.MAHJ_MATCH_TABLE_SHOW_ARENA_CCBI, 'count':1}
            ];
        },

        /**
         * 初始化特效缓存
         */
        initEffects:function () {
            var effectCfg, i;
            var partCount;
            for (i in this.cacheEffectIds){
                effectCfg = this.cacheEffectIds[i];
                for (var j = 0; j < effectCfg['count']; j++){
                    if (effectCfg.hasOwnProperty('partCount')){
                        partCount = effectCfg['partCount'];
                    }
                    else{
                        partCount = 0;
                    }
                    this.addEffect(effectCfg['id'], partCount);
                }
            }
        },

        /**
         * 移除所有缓存特效
         */
        removeAllEffects:function () {
            var tableEffect, i;
            for (i in this.effectList){
                GLOBAL_OBJ.LOGD(this._TAG, "remove_effect = " + i);
                tableEffect = this.effectList[i];
                tableEffect.removeFromParent();
            }
        },


        /**
         * 添加特效缓存
         * @param effectId 特效ID
         * @param partCount 粒子节点数量
         */
        addEffect:function (effectId, partCount) {
            var tableEffect = new GLOBAL_OBJ.table.TableEffect(effectId, partCount);
            tableEffect.rootNode.stopAllActions();
            this.effectList.push(tableEffect);
        },

        /**
         * 从显示面板上删除缓存特效
         * @param tableEffect 特效对象
         */
        removeEffect:function (tableEffect) {
            if (tableEffect)
            {
                tableEffect.removeFromParent();
            }
        },


        /**
         * 获取特效
         * @param effectId 特效ID
         * @returns {*} 特效对象
         */
        getEffectById:function (effectId) {

            GLOBAL_OBJ.LOGD(this._TAG, "getEffectById : " + effectId);
            var effect;
            for (var i in this.effectList){
                effect = this.effectList[i];
                if (effect.getId() == effectId && !effect.getRootNode().parent){
                    return effect;
                }
            }

            return null;
        },

        /**
         * 播放特效
         * @param _parent 要放到的父节点
         * @param effectId 特效ID
         * @param _ccp 坐标点
         * @param _preCallFunc 播放之前要进行的回调
         * @param _afterCallFunc 播放完成之后要进行的回调
         * @param _canStay 播放完成后，保留在父结点上，不移除
         * @param _scale 播放时的放大倍数
         * @param _timeLineName 时间线名
         * @returns {*} 特效对象本身
         */
        play:function (_parent, effectId, _ccp, _preCallFunc, _afterCallFunc, _canStay, _scale ,_timeLineName) {
            var effect = this.getEffectById(effectId);

            if (!effect){
                return;
            }

            GLOBAL_OBJ.LOGD(this._TAG, "play effectId: " + effectId + " ; start play");

            var parent  = _parent.view ? _parent.view.ccbRootNode : _parent;

            var timeLineName = _timeLineName || "play";

            var arootNode = effect.getRootNode();
            if (arootNode) {
                if (_scale) {
                    arootNode.setScale(_scale);
                }

                if (effectId == GLOBAL_OBJ.RES.XZ_ZM_TX_KAIJU4_CCBI){
                    //开局特效要进行适配
                    var vsize = cc.director.getWinSize();
                    // var bgSize = arootNode.getContentSize();
                    var bgSize = cc.size(1136, 640);
                    var scal = Math.max(vsize.width/bgSize.width, vsize.height/bgSize.height);
                    effect['viewNode'].setScale(scal);
                    // effect['viewNode'].setPosition(vsize.width/2, vsize.height/2);
                }

                parent.addChild(arootNode);
                arootNode.release();

                effect.playAnim( timeLineName, _ccp, _afterCallFunc, _canStay );
                if (_preCallFunc) {
                    _preCallFunc(effect);
                }
            }
            return effect;
        },

        /**
         * 销毁
         */
        destroy:function () {

            var effect;
            for (var i in this.effectList){
                effect = this.effectList[i];
                effect.destroy();
            }

            this.effectList.length = 0;
            this.effectList = null;

            this.cacheEffectIds.length = 0;
            this.cacheEffectIds = null;
        }
    });

    /**
     * 牌桌特效类
     */
    GLOBAL_OBJ.table.TableEffect = cc.Class.extend({
        _TAG: 'GLOBAL_OBJ.table.TableEffect',

        /**
         * 添加特效缓存
         * @param effectId 特效ID
         * @param partCount 粒子节点数量
         */
        ctor: function(effectId, partCount) {
            this._effectId = effectId;
            this._partCount = partCount;
            this.rootNode = cc.BuilderReader.loadWithController(this._effectId, this, this);
            this.rootNode.retain();

            var self = this;
            this._destoryed = false;
            this.rootNode.onCleanup = function () {
                if (self._destoryed){
                    GLOBAL_OBJ.LOGD(self._TAG, "Effect ID: " + self._effectId + " ; be destoryed");
                    self.rootNode.onCleanup = null;
                }
                else{
                    GLOBAL_OBJ.LOGD(self._TAG, "Effect ID: " + self._effectId + " ; be cleanup");
                    self._playCompleteCallBackFun = null;
                    self._canStay = false;
                    self.stopParticles();
                    self.rootNode.retain();
                    self.rootNode.stopAllActions();
                }
            };

            this._playCompleteCallBackFun = null;
            this._canStay = false;
            this._animName = "";

            //动画完毕自销毁
            this.rootNode.animationManager.setCompletedAnimationCallback(this, function(){
                if (self._playCompleteCallBackFun != null){
                    self._playCompleteCallBackFun(self);
                    self._playCompleteCallBackFun = null;
                }
                if (!self._canStay){
                    self.removeFromParent();
                }
                GLOBAL_OBJ.LOGD(self._TAG, "Effect ID: " + self._effectId + " ; timeLine：" + self._animName + " play complete");
            });
        },

        /**
         * 获取特效ID
         * @returns {*} 特效ID
         */
        getId:function () {
            return this._effectId;
        },

        /**
         * 播放特效
         * @param _animName 时间线名
         * @param _point 坐标点
         * @param _callFunc 播放完成后的回调
         * @param _canStay 播放完成后，保留在父结点上，不移除
         */
        playAnim:function (_animName, _point, _callFunc, _canStay) {

            this._animName = _animName;
            this._playCompleteCallBackFun  = _callFunc || function(){};
            this._canStay = _canStay;

            var size  = cc.director.getWinSize();
            var point = _point || cc.p(size.width * 0.5, size.height * 0.5);

            var thisRootNode = this.getRootNode();
            thisRootNode.setPosition(point);

            GLOBAL_OBJ.LOGD(this._TAG, "Effect ID: " + this._effectId + " ; timeLine：" + this._animName + " start play");
            this.rootNode.animationManager.runAnimationsForSequenceNamedTweenDuration(this._animName, 0);

            this.resetParticles();
        },

        getRootNode:function () {
            return this.rootNode;
        },

        resetParticles:function () {
            if (this._partCount > 0){
                var particle;
                //重置粒子
                for (var i = 0; i < this._partCount; i++){
                    particle = this['part' + i];
                    if (particle){
                        particle.resetSystem();
                    }
                }
            }
        },

        stopParticles:function () {
            if (this._partCount > 0){
                var particle;
                //重置粒子
                for (var i = 0; i < this._partCount; i++){
                    particle = this['part' + i];
                    if (particle){
                        particle.stopSystem();
                    }
                }
            }
        },

        removeFromParent:function () {
            GLOBAL_OBJ.LOGD(this._TAG, "removeFromParent Effect ID: " + this._effectId + " ; __nativeObj :" + this.rootNode.__nativeObj);

            this.stopParticles();
            this.rootNode.retain();
            this.rootNode.removeFromParent(false);
            this.rootNode.stopAllActions();
        },

        destroy:function () {
            GLOBAL_OBJ.LOGD(this._TAG, "Effect ID: " + this._effectId + " ; destroy; __nativeObj :" + this.rootNode.__nativeObj);
            if (this.rootNode.__nativeObj){
                this._destoryed = true;
                if (this.rootNode.parent){
                    this.rootNode.removeFromParent();
                }
                else{
                    this.rootNode.release();
                }
            }
            else{
                GLOBAL_OBJ.LOGD(this._TAG, "Effect ID: " + this._effectId + " ; Has been destroyed，Do not have to be destroyed again; look for reasons for illegal destroyed. ");
            }
        }
    });
//end
})();