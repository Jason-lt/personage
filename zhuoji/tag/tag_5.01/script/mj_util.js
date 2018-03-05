(function(){
    var GLOBAL_OBJ = guiyang;
    var TAG = 'mj_util';

    /**
     * Author  wyf
     * Date    14-3-5
     * Desc    工具函数
     */
    GLOBAL_OBJ.Util = GLOBAL_OBJ.Util || {};


    /**
     * 判断元素是否在数组中
     *
     */
    GLOBAL_OBJ.Util.isMemberOf = function(element, array)
    {
        for(var i = 0; i < array.length; ++i)
        {
            if (array[i] === element)
            {
                return true;
            }
        }
        return false;
    };

    /**
     * 生成货币字符串
     * @param v
     * @param isSign
     * @returns {string}
     */
    GLOBAL_OBJ.Util.genCurrencyString = function(v, isSign)
    {
        //如果为0
        if(v == 0){
            return "0";
        }

        // 负数
        var neg = v < 0;

        //如果不为0
        v = v || 0;
        var s = Math.abs(v).toString();
        var len = s.length;
        if(len < 1)
        {
            return '';
        }
        var mod = len % 3;
        var result = s.substr(0, mod);
        for(var i = 0, num = Math.floor(len / 3); i < num; ++i)
        {
            if(0 != i || mod > 0)
            {
                result += ',';
            }
            result += s.substr(mod + i * 3, 3);
        }

        //如果有符号
        if(isSign){

            var reStr = neg ? '-' : '+';
            reStr += result;

            return reStr;

        }
        return result;
    };

    /**
     * 生成金币字符串
     * @param v
     * @returns {string}
     */
    GLOBAL_OBJ.Util.genChipString = function(v)
    {
        var s = GLOBAL_OBJ.Util.genCurrencyString(v, false);
        if(!s)
        {
            return '';
        }
        return '$' + s;
    };

    /**
     * 获取帐号名称
     * @returns {*}
     */
    GLOBAL_OBJ.Util.getAccountName = function()
    {
        if(!GLOBAL_OBJ.model.gAccount.hasInit())
        {
            return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1000;
        }
        if(GLOBAL_OBJ.model.gAccount.isOfficial())
        {
            return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1001;
        }
        return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1002;
    };

    /**
     * 创建SpriteFrame，spriteSheetFile可以不传
     * @param spriteFile
     * @param spriteSheetFile
     * @param isAbsolutePath
     * @returns {*}
     */
    GLOBAL_OBJ.Util.createSpriteFrameWithFile = function(spriteFile, spriteSheetFile, isAbsolutePath)
    {
        if(!spriteFile)
        {
            cc.log('Null spriteFile.');
            return null;
        }
        var frameCache = cc.SpriteFrameCache.getInstance();
        var path = GLOBAL_OBJ.GlobalVars.getImgRootPath() + '/';

        var spriteFrame = null;
        if(spriteSheetFile && !isAbsolutePath)
        {
            spriteFrame = frameCache.getSpriteFrame(spriteFile);
            if(!spriteFrame)
            {
                frameCache.addSpriteFrames(path + spriteSheetFile + '.plist');
                spriteFrame = frameCache.getSpriteFrame(spriteFile);
            }
        }
        else
        {
            GLOBAL_OBJ.LOGI(TAG, "TextureCache mode");
            var bounds = null;

            var fullPath = isAbsolutePath ? spriteFile : path + spriteFile;
            var texture = cc.TextureCache.getInstance().addImage(fullPath);
            if(!texture)
            {
                GLOBAL_OBJ.LOGE(TAG, 'Load image ' + fullPath + ' failed!');
                return null;
            }

            if(texture instanceof cc.Texture2D)
            {
                bounds = cc.rect(0, 0, texture.getContentSize().width, texture.getContentSize().height);
            }
            else
            {
                bounds = cc.rect(0, 0, texture.width, texture.height);
            }
            spriteFrame = cc.SpriteFrame.createWithTexture(texture, bounds);
        }

        // 创建失败
        if(!spriteFrame)
        {
            if(typeof(spriteFile) == 'string')
            {
                GLOBAL_OBJ.LOGE(TAG, 'Create sprite frame ' + path + spriteFile + ' failed!');
            }
            else
            {
                GLOBAL_OBJ.LOGE(TAG, 'Create sprite frame [' + spriteFile + ', ' + path + spriteSheetFile + '] failed!');
            }
            return null;
        }

        return spriteFrame;
    };

    /**
     * 根据文件名创建精灵，spriteSheetFile可以不传
     * @param spriteFile
     * @param spriteSheetFile
     * @param isAbsolutePath
     * @returns {*}
     */
    GLOBAL_OBJ.Util.createSpriteWithFile = function(spriteFile, spriteSheetFile, isAbsolutePath)
    {
        var spriteFrame = GLOBAL_OBJ.Util.createSpriteFrameWithFile(spriteFile, spriteSheetFile, isAbsolutePath);
        if(!spriteFrame) return null;

        return cc.Sprite.createWithSpriteFrame(spriteFrame);
    };

    /**
     * 根据文件名创建Scale9Sprite，spriteSheetFile、capInsets可以不传
     * @param spriteFile
     * @param spriteSheetFile
     * @param capInsets
     * @returns {*}
     */
    GLOBAL_OBJ.Util.createScale9SpriteWithFile = function(spriteFile, spriteSheetFile, capInsets)
    {
        var spriteFrame = GLOBAL_OBJ.Util.createSpriteFrameWithFile(spriteFile, spriteSheetFile, false);
        if(!spriteFrame) return null;

        if(capInsets)
        {
            return cc.Scale9Sprite.createWithSpriteFrame(spriteFrame, capInsets);
        }
        else
        {
            return cc.Scale9Sprite.createWithSpriteFrame(spriteFrame);
        }
    };

    /**
     * 使用背景创建EditBox
     * @param sp9Background
     * @returns {*}
     */
    GLOBAL_OBJ.Util.createEditBoxWithBackground = function(sp9Background)
    {
        if(!sp9Background || !(sp9Background instanceof cc.Scale9Sprite))
        {
            GLOBAL_OBJ.LOGE(TAG, 'createEditBoxWithBackground sp9Background must be a Scale9Sprite!');
            return null;
        }
        var parent = sp9Background.getParent();
        if(!parent)
        {
            GLOBAL_OBJ.LOGE(TAG, 'createEditBoxWithBackground sp9Background must has parent!');
            return null;
        }

        // 保存位置信息
        var p = sp9Background.getPosition();
        var isIgnoreAnchorPointForPosition = sp9Background.isIgnoreAnchorPointForPosition();
        var ar = sp9Background.getAnchorPoint();
        // cocos 3.5需要还原sp9的默认位置和锚点
        sp9Background.setPosition({x:0, y:0});
        sp9Background.setAnchorPoint({x:0.5, y:0.5});
        // 移除
        sp9Background.retain();
        sp9Background.removeFromParent();

        // 创建
        var editBox = cc.EditBox.create(sp9Background.getContentSize(), sp9Background);
        sp9Background.release();
        if(!editBox)
        {
            return null;
        }
        parent.addChild(editBox);

        // 设置位置信息
        editBox.ignoreAnchorPointForPosition(isIgnoreAnchorPointForPosition);
        editBox.setAnchorPoint(ar);
        editBox.setPosition(p);

        return editBox;
    };

    /**
     * 创建WEB VIEW
     * @param locationNode
     * @param delegate
     * @returns {*}
     */
    //TODO 大厅3.76已废弃ty._webview，使用时注意
    GLOBAL_OBJ.Util.createWebView = function(locationNode, delegate)
    {
        if(!locationNode) return null;

        // 创建web view
        var webView = new ty._webview();
        webView.init();
        webView.setDelegate(delegate);

        // 位置
        var p = locationNode.convertToWorldSpace(cc.p(0, 0));
        var size = locationNode.getContentSize();
        webView.setFrame(p.x, p.y, size.width, size.height);
        return webView;
    };

    /**
     * 生成页面初始化回调参数
     * @returns {{user: {gameId: *, clientId: *, authInfo: *}}}
     */
    GLOBAL_OBJ.Util.buildPageInitParams = function()
    {
        var user =
        {
            gameId      : GLOBAL_OBJ.GAMEID,
            clientId    : GLOBAL_OBJ.GlobalVars.getClientId(),
            authInfo    : GLOBAL_OBJ.model.gAccount.getAuthInfo()
        };
        return {user:user};
    };

    /**
     * 设置字节点的触摸优先级（递归）
     * @param node
     * @param priority
     */
    GLOBAL_OBJ.Util.setChildrenTouchPriority = function(node, priority)
    {
        if(!node) return;

        var children = node.getChildren();
        if(!children) return;

        for(var i = 0, len = children.length; i < len; ++i)
        {
            var child = children[i];
            if(child.isTouchEnabled && child.isTouchEnabled())
            {
                GLOBAL_OBJ.LOGD('GLOBAL_OBJ.Util.setChildrenTouchPriority ', 'GLOBAL_OBJ.Util.setChildrenTouchPriority isTouchEnabled');
                if(child instanceof cc.ScrollView)
                {
                     child.setLocalZOrder(priority + 1);
                }
                else
                {
                     child.setLocalZOrder(priority);
                }
            }

            // 子节点
            GLOBAL_OBJ.Util.setChildrenTouchPriority(child, priority);
        }
    };

    /**
     * 获取网络
     */
    GLOBAL_OBJ.Util.netWorkType = function(objInfo)
    {
        var netConnect = objInfo['isNetworkConnected'];
        if (netConnect)
        {
            var mobile = objInfo['isMobileConnected'];
            var wifi   = objInfo['isWIFIConnected'];
            var level  = objInfo['wifiSignalStrength'];
            if (wifi)
            {
                return [1, level];
            }
            else
            {
                return [0, mobile];
            }
        }
        else
        {
            return false;
        }
    };
    /**
     * 播放数字动画
     * @param label
     * @param srcNum
     * @param dstNum
     * @param delay
     * @param duration
     * @param formatStringFunc
     * @param scale
     */
    GLOBAL_OBJ.Util.playNumberAnimation = function(label, srcNum, dstNum, delay, duration, formatStringFunc, scale,_zoom)
    {
        var curNum = srcNum;
        var speed = Math.abs(dstNum - srcNum) / duration;
        var funcRefreshNum = function(dt)
        {
            curNum += speed * dt;

            // 达到目标值了
            if(curNum >= dstNum)
            {
                curNum = dstNum;
                this.unschedule(funcRefreshNum);

                // 缩小
                this.runAction(cc.ScaleTo.create(0.2, scale, scale))
            }

            // 刷新显示
            var intNum = Math.floor(curNum);
            if(formatStringFunc)
            {
                var s = formatStringFunc(intNum);
                this.setString(s);
            }
            else
            {
                this.setString(intNum);
            }
        };

        var runActions = function(node)
        {
            var act1 = null, act2 = null, zoom = _zoom || 1.2;
            if(delay > 0.01)
            {
                act1 = cc.DelayTime.create(delay);
                act2 = cc.ScaleTo.create(0.2, zoom, zoom);
                node.runAction(cc.Sequence.create(act1, act2));
                node.schedule(funcRefreshNum, 0, cc.REPEAT_FOREVER, 0.2 + delay);
            }
            else
            {
                // 放大
                node.runAction(cc.ScaleTo.create(0.2, zoom, zoom));
                node.schedule(funcRefreshNum, 0, cc.REPEAT_FOREVER, 0.2);
            }
        };
        runActions(label);
    };

    /**
     * 显示错误提示框
     * @param name
     * @param detail
     */
    GLOBAL_OBJ.Util.showNotSupportMsgBox = function(name, detail)
    {
        var s = GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1003 + detail + '\n' +
                GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1004;

        var params = {
            txt                 : s,
            duration            : 1
        };
        GLOBAL_OBJ.SceneManager.showMsgTips('MsgBox', params, false, null);
    };

    /**
     * 设置节点透明度
     * @param node
     * @param opacity
     */
    GLOBAL_OBJ.Util.setNodeOpacity = function(node, opacity)
    {
        if(!node) return;

        if(node.setOpacity)
        {
            node.setOpacity(opacity);
        }

        // 子节点
        var children = node.getChildren();
        if(!children) return;

        for(var i = 0, len = children.length; i < len; ++i)
        {
            GLOBAL_OBJ.Util.setNodeOpacity(children[i], opacity);
        }
    };

    /**
     * 控制姓名长度
     * @param name         字符串
     * @param Ilength      最大长度控制
     * @param cutlength    剪切长度
     * @param insertStr    剪切处补字符串
     * by xiewei welfu@vip.qq.com welfu@vip.qq.com
     */
    GLOBAL_OBJ.Util.trimName = function(name,Ilength,cutlength,insertStr)
    {
        if(!name)
        {
            return 'NULL';
        }
        name = name.toString();

        var tmp=0; //中文字符数记录
        var len=0; //单字符处理
        var okLen=0; //实际字符串长度

        Ilength *=2;//转为单字符长度，便于中英混杂。

        for(var i=0;i<name.length;i++){

            if(name.charCodeAt(i)>255){
                tmp+=2;
            }else{
                len+=1;}

            okLen+=1;

            //解决中英文混杂长度控制
            if(tmp+len>Ilength)
            {
                okLen = tmp/2+len;

                return (name.substring(0,okLen-cutlength)+insertStr);

            }
        }

        return (name.substring(0,okLen));
    };

    /**
     * 某个节点是否可见
     * @param node
     * @returns {boolean}
     */
    GLOBAL_OBJ.Util.isNodeVisible = function(node)
    {
        if(!node) return false;
        if(!node.isVisible()) return false;

        // 向上遍历
        var parent = node.getParent();
        while(parent)
        {
            if(!parent.isVisible())
            {
                return false;
            }
            parent = parent.getParent();
        }
        return true;
    };

    /**
     * 检测某个点是否在NODE中
     * @param ptWorld
     * @param node
     * @returns {*}
     */
    GLOBAL_OBJ.Util.isPointInNode = function(ptWorld, node)
    {
        if(!node)
        {
            GLOBAL_OBJ.LOGD('GLOBAL_OBJ.Util.isPointInNode','node is null return false');
            return false;
        }
        if (!GLOBAL_OBJ.Util.isNodeVisible(node))
        {
            GLOBAL_OBJ.LOGD('GLOBAL_OBJ.Util.isPointInNode','node isNodeVisible false return false');
            return false;
        }

        var parent = node.getParent();
        if (!parent)
        {
            GLOBAL_OBJ.LOGD('GLOBAL_OBJ.Util.isPointInNode','parent is null return false');
            return false;
        }

        var p = parent.convertToNodeSpace(ptWorld);
        var rc = node.getBoundingBox();
        return cc.rectContainsPoint(rc, p);
    };

    /**
     * tileId是否有效
     * @param tileId
     * @returns {boolean}
     */
    GLOBAL_OBJ.Util.isValidTileId = function(tileId)
    {
        return tileId !== undefined && tileId !== null && tileId > 0;
    };

    /**
     * 判断是否是字符串
     * @param s
     * @returns {boolean}
     */
    GLOBAL_OBJ.Util.isString = function(s) {
        return (typeof s === 'string') && s.constructor === String;
    };

    /**
     * 从字符串中解析番数
     * @param s
     * @returns {*}
     */
    GLOBAL_OBJ.Util.parseDegree = function(s)
    {
        if(!GLOBAL_OBJ.Util.isString(s))
        {
            return 0;
        }
        var index = s.indexOf(GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1005);
        //判断是否为倍
        if(index < 0)
        {
            index = s.indexOf(GLOBAL_OBJ.STRING.MJ_MJC_TABLE_RESULT_OTHER_STRING_1003);
        }
        if(index < 0)
        {
            GLOBAL_OBJ.LOGE(TAG, 'parseDegree error!');
            return 0;
        }
        var strDegree = s.substr(0, index);
        return parseInt(strDegree);
    };

    /**
     * 创建滚动层
     * @param locationNode
     * @returns {cc.ScrollView}
     */
    GLOBAL_OBJ.Util.createScrollLayer = function(locationNode)
    {
        if(!locationNode)
        {
            return null;
        }

        var viewSize = locationNode.getContentSize();

        // 创建滚动层
        var scrollLayer = new cc.ScrollView();
        scrollLayer.initWithViewSize(viewSize);
        scrollLayer.ignoreAnchorPointForPosition(false);
        scrollLayer.setAnchorPoint(GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_LEFT_BOTTOM]);
        scrollLayer.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        // scrollLayer.setTouchPriority(GLOBAL_GLOBAL_OBJ.TouchPriority.Scroll);
        locationNode.addChild(scrollLayer);

        return scrollLayer;
    };

    /**
     * 格式化数字（万、亿）
     * @param num
     * @returns {string}
     */
    GLOBAL_OBJ.Util.formatNumAddingWY = function(num){
        var sign = "";
        if (num < 0)
        {
            num = Math.abs(num);
            sign = "-";
        }

        var str = ""+num;
        if(num > 9999 && num < 100000000){
            //万

            var temp = num/10000;
            if(Math.floor(temp)===temp){

                str = temp+ GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1006;
            }else{

                str = temp.toFixed(2) + GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1006;
            }

        }
        // else if(num > 99999 && num < 100000000){
        //     //十万,百万，千万
        //     num = num/10000;
        //     str = parseInt(num) + GLOBAL_GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1006;
        // }

        str = sign + str;
        return str;
    };

    /**
     * 节点淡入淡出
     * @param node
     * @param isFadeIn
     * @param duration
     * @param delayTime
     * @param onEndFunc
     * @param onEndTarget
     */
    GLOBAL_OBJ.Util.runNodeFadeInOutAction = function(node, isFadeIn, duration, delayTime, onEndFunc, onEndTarget)
    {
        if(!node) return;

        var actions = [];

        // 延迟
        if(delayTime > 0.01)
        {
            actions.push(cc.DelayTime.create(delayTime));
        }

        // 淡出
        if(node.setOpacity)
        {
            var actFade = null;
            if(isFadeIn)
            {
                actFade = cc.EaseSineIn.create(cc.FadeIn.create(duration));
            }
            else
            {
                actFade = cc.EaseSineOut.create(cc.FadeOut.create(duration));
            }
            actions.push(actFade);
        }
        else
        {
            actions.push(cc.DelayTime.create(duration));
        }

        // 结束回调
        if(onEndFunc)
        {
            actions.push(cc.CallFunc.create(onEndFunc, onEndTarget));
        }

        // 没有动作需要执行
        if(actions.length < 1 || (actions.length == 1 && delayTime > 0.01))
        {
            return;
        }

        // 执行
        var act = cc.Sequence.create.apply(cc.Sequence, actions);
        node.runAction(act);

        // 子节点
        var children = node.getChildren();
        if(!children) return;

        for(var i = 0, len = children.length; i < len; ++i)
        {
            GLOBAL_OBJ.Util.runNodeFadeInOutAction(children[i], isFadeIn, duration, delayTime, null, null);
        }
    };

    /**
     * 播放提示动画
     * @param node
     */
    GLOBAL_OBJ.Util.runNodeHintAction = function(node)
    {
        if(!node) return;
        node.stopAllActions();

        var act1 = cc.ScaleTo.create(0.2, 1.2, 1.2);
        var act2 = cc.EaseElasticOut.create(cc.ScaleTo.create(0.7, 1, 1), 0.2);
        var act3 = cc.DelayTime.create(1);
        var act = cc.Sequence.create(act1, act2, act3);
        node.runAction(cc.RepeatForever.create(act));
    };

    /**
     * 某个节点闪烁
     * @param node
     * @param fadeInTime
     * @param showTime
     * @param fadeOutTime
     * @param minOpacity
     */
    GLOBAL_OBJ.Util.flashNode = function(node, fadeInTime, showTime, fadeOutTime, minOpacity)
    {
        if(!node.setOpacity) return;

        minOpacity = minOpacity || 0;
        node.setOpacity(minOpacity);

        var actions = [];
        if(fadeInTime > 0.01)
        {
            actions.push(cc.EaseSineIn.create(cc.FadeTo.create(fadeInTime, 255)));
        }
        if(showTime > 0.01)
        {
            actions.push(cc.DelayTime.create(showTime));
        }
        if(fadeOutTime > 0.01)
        {
            actions.push(cc.EaseSineOut.create(cc.FadeTo.create(fadeOutTime, minOpacity)));
        }
        var actRepeat = cc.RepeatForever.create(cc.Sequence.create.apply(cc.Sequence, actions));
        node.runAction(actRepeat);
    };


    /**
     * 剪切宽字符串
     * @param s
     * @param maxCharNum
     * @returns {string}
     */
    GLOBAL_OBJ.Util.clipWString = function(s, maxCharNum)
    {
        if(!s)
        {
            return '';
        }
        s = s.toString();

        var count = 0;
        for(var i = 0, len = s.length; i < len; ++i)
        {
            if(s.charCodeAt(i) > 0xFF)
            {
                count += 2;
            }
            else
            {
                count += 1;
            }

            if(count > maxCharNum)
            {
                return i > 0 ? s.substring(0, i) : '';
            }
        }
        return s;
    };

    /**
     * 获取排名名称
     * @param rankIndex
     */
    GLOBAL_OBJ.Util.getRankIndexName = function(rankIndex)
    {
        if(rankIndex < 1)
        {
            return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1009;
        }
        switch(rankIndex)
        {
            case 1: return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1010;
            case 2: return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1011;
            case 3: return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1012;
            case 4: return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1013;
            default: return GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1014 + rankIndex + GLOBAL_OBJ.STRING.MJ_MJ_UTIL_STRING_1015;
        }
    };

    /**
     * 截取屏幕
     */
    GLOBAL_OBJ.Util.saveScreenShot = function()
    {
        var size = cc.Director.getInstance().getWinSize();
        var currentDate = new Date();
        var fileName = "麻将截图_"+currentDate.getFullYear()+"_"+(currentDate.getMonth()+1)+"_"
                +currentDate.getDate()+"_"+currentDate.getHours()+"/"+currentDate.getMinutes()+"/"+currentDate.getSeconds()+".png";
        var texture = cc.RenderTexture.create(size.width, size.height,cc.IMAGE_FORMAT_PNG);
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.Director.getInstance().getRunningScene().visit();
        texture.end();
        var writeAblePath = jsb.fileUtils.getWritablePath();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);
        var pic =   writeAblePath + fileName;
        // 判断文件确实存在
        if( ty.FileManager.checkFileExist(pic) ){
            GLOBAL_OBJ.LOGI(TAG, '截图图片路径：' + pic);
            return true;
        } else {
            GLOBAL_OBJ.LOGI(TAG, '截图失败');
            return false;
        }
    };

    /**
     * 格式化时间字符串
     * @param strFormat (h:m:s)
     * @param seconds
     * @returns {*}
     */
    GLOBAL_OBJ.Util.formatTimeString = function(strFormat, seconds)
    {
        var _seconds = seconds;
        if(!strFormat)
        {
            GLOBAL_OBJ.LOGE(TAG, 'Null format! - formatTimeString');
            return '';
        }
        _seconds = Math.ceil(_seconds);
        var s = _seconds % 60;
        var m = Math.floor(_seconds / 60) % 60;
        var h = Math.floor(_seconds / 3600);

        var str = strFormat.replace('s', s < 10 ? '0' + s : s);
        str = str.replace('m', m < 10 ? '0' + m : m);
        str = str.replace('h', h < 10 ? '0' + h : h);

        return str;
    };

    /**
     * 根据时间戳格式化时间字符串
     * @param strFormat (yy-mm-dd h:m:s)
     * @param seconds
     * @returns {*}
     */
    GLOBAL_OBJ.Util.formatTimeForTimeStamp = function(strFormat, timestamp){
        var dt = new Date(timestamp*1000);

        var yy = dt.getFullYear();
        var mm = dt.getMonth()+1;
        var dd = dt.getDate();
        var h  = dt.getHours();
        var m  = dt.getMinutes();
        var s  = dt.getSeconds();

        var str = strFormat.replace('yy', yy < 10 ? '0' + yy : yy);
        str = str.replace('mm', mm < 10 ? '0' + mm : mm);
        str = str.replace('dd', dd < 10 ? '0' + dd : dd);
        str = str.replace('h', h < 10 ? '0' + h : h);
        str = str.replace('m', m < 10 ? '0' + m : m);
        str = str.replace('s', s < 10 ? '0' + s : s);

        return str;
    };

    /**
     * 刷新性别图标
     * @param icon
     * @param sex
     * @returns {boolean}
     */
    GLOBAL_OBJ.Util.refreshSexIcon = function(icon, sex)
    {
        if(!icon)
        {
            return false;
        }

        var iconName = sex == GLOBAL_OBJ.Sex.Boy ? 'boy_icon.png' : 'girl_icon.png';
        var frame = GLOBAL_OBJ.Util.createSpriteFrameWithFile(iconName, 'common', false);
        if(!frame)
        {
            return false;
        }
        icon.setSpriteFrame(frame);

        return true;
    };



    /**
     *比较两个时间差值的绝对值的方法 返回两个时间相差的日时分秒
     *@param  beginDate 比较的时间 非空
     *@param endDate 比较的时间 ,可以为空,标示和当前时间比较，default=new Date()
     *@retrun JSON数据形式存储：D、H、M、S、error(天，小时，分钟，秒,正数还是负数的标记abs，以及是否出现错误error)
     *beginDate 始终要小于 endDate（程序控制）
     */
    GLOBAL_OBJ.Util.getDateCha = function(beginDate, endDate)
    {
        var res = {
            D : 0,
            H : 0,
            M : 0,
            S : 0,
            abs : true,
            error : false
        };
        //属性形式验证：第一次参数必须是Date类型，第二个参数可以为空，默认为new Date()
        if (typeof (endDate) == "undefined" || null == endDate || "" == endDate) {
            endDate = new Date();
        }
        if (!(beginDate instanceof (Date)) || !(endDate instanceof (Date))) {
            res.error = true;//"非法时间字符串";
            return res;
        }

        //比较大小，保证差值一定是正数。
        if (beginDate > endDate) {
            var tempDate = beginDate;
            beginDate = endDate;
            endDate = tempDate;
            res.abs = false;//表示beginDate大于endDate
        }
        var chaTime = (endDate.getTime() - beginDate.getTime());

        var Day_Param = 1000 * 60 * 60 * 24;//一天等于毫秒数
        var Hour_Param = 1000 * 60 * 60;//一小时等于毫秒数
        res.D = Math.floor(chaTime / (Day_Param));//

        chaTime = chaTime - res.D * Day_Param;//减去天的毫秒数。再求小时个数
        res.H = Math.floor(chaTime / (Hour_Param));
        chaTime = chaTime - res.H * Hour_Param;//减去小时的毫秒数。再求分钟个数
        res.M = Math.floor(chaTime / (1000 * 60));
        res.S = (chaTime - res.M * 1000 * 60) / 1000;//减去分钟的毫秒数。再求秒的个数
        //alert(res.S);

        res.toString = function() {
            return this.D;// + "日" + this.H + "小时" + this.M + "分钟";
        };
        return res;
    };

    /**
     * Location是否有效
     * @param arr
     * @returns {boolean}
     */
    GLOBAL_OBJ.Util.isValidLocation = function(arr)
    {
        if(!arr)
        {
            return false;
        }
        return arr[0] == GLOBAL_OBJ.GAMEID && arr[1] != '0' && arr[2] != '0';
    };

    /**
     * 计算节点屏幕rect
     * @param _node
     * @param _scale
     * @returns {boolean}
     */
    GLOBAL_OBJ.Util.getNodeBoundingRect = function(_node,_scale){
        var scale   = _scale || 1;
        var point   = _node.getParent().convertToWorldSpace(_node.getPosition())
        var size    = _node.getContentSize();
        size.width  = size.width*scale;
        size.height = size.height*scale
        var bound = cc.rect(
            point.x-size.width*_node.getAnchorPoint().x,
            point.y-size.height*_node.getAnchorPoint().y,
            size.width,size.height);
        return bound;
    };

    /**
     * 节点组
     * 将一定量的节点的某一个特性的方法形成一种toggle开关的效果.
     * _prototype:原型方法
     * _params:原型方法的参数数组(1:开,0关)
     * _nodes:节点数组
     * 使用方法:
     * var groups = _PA_GLOBAL_FUNCS.nodeGroup("setColor",
            [WHITE,YELLOW],[emojiIcon,defaultTxtIcon,chatIcon,broadcastIcon]);
     * groups.setColor(0); 除了emojiIcon是YELLOW,其他4个都是WHITE
     * groups.setColor(1); 除了defaultTxtIcon是YELLOW,其他4个都是WHITE
    */
    GLOBAL_OBJ.Util.nodeGroup = function(_prototype,_params,_nodes){
        var group = {};
        group[_prototype] = function(){
            for(var i = _nodes.length-1 ; i >= 0; --i){
                if (_nodes[i]) { _nodes[i][_prototype](_params[0]); };
            };
            var target = _nodes[arguments[0]];
            if (target) { target[_prototype](_params[1]); };
        };
        return group;
    };

    /**
     *
     * @param img 要更改的图片
     * @param srcPro 源进度
     * @param dstPro 终进度
     * @param delay 延时
     * @param duration
     */
    GLOBAL_OBJ.Util.playProgressAni = function (img, srcPro, dstPro, delay, duration) {
        var height = img.getContentSize().height;
        var curPro = srcPro;
        var speed = Math.abs(dstPro - srcPro) / duration;
        var funcRefreshPro = function (dt) {
            curPro += speed * dt;
            // 达到目标值了
            if (curPro >= dstPro)
            {
                curPro = dstPro;
                this.unschedule(funcRefreshPro);
            }

            // 刷新显示
            var intPro = Math.floor(curPro);
            this.setContentSize(cc.size(intPro, height));
        };

        var runActions = function (node) {
            var act = null;
            if (delay > 0.01)
            {
                act = cc.DelayTime.create(delay);
                node.runAction(act);
                node.schedule(funcRefreshPro, 0, cc.REPEAT_FOREVER, 0.2);
            }
            else
            {
                node.schedule(funcRefreshPro, 0, cc.REPEAT_FOREVER, 0.2);
            }
        };
        runActions(img);
    };

})();
