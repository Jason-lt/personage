/*******************************************************
 *  mahjong_extend_node.js
    node扩展功能
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-03
 *  特殊说明：
    一些跟“node”有关的扩展函数
    使用说明:
 */

(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.extend.Controller = {
		_TAG:"bkernel.extend.Controller",
        grouper:{},
        groupList:{},
        /*
        节点组
        将一定量的节点的某一个特性的方法形成一种toggle开关的效果.
        _prototype:原型方法
        _params:原型方法的参数数组(1:开,0关)
        _nodes:节点数组
        使用方法:
        var groups = _PA_GLOBAL_FUNCS.nodeGroup("setColor",
                [WHITE,YELLOW],[emojiIcon,defaultTxtIcon,chatIcon,broadcastIcon]);
        groups.setColor(0); 除了emojiIcon是YELLOW,其他4个都是WHITE
        groups.setColor(1); 除了defaultTxtIcon是YELLOW,其他4个都是WHITE
        groups.___f_Lock_group(true);//锁住功能
        */
        bind_group_ext:function(_controller,_prototype,_params){
            /*
            controller扩展 - 扩展group功能
            TODO:
            给一个controller扩展group功能
            params:
            _controller，group函数名，参数(一个数组，两个值)
            */
            var that               = this;
            this.group             = this.group || {};
            hall.assert.true("group"!=_prototype, "bind_group_ext: parameter _prototype error!");

            //缓存controller
            this.group[_controller.getObjectIdentifier()] = _controller;

            this[_prototype]       = this[_prototype] || function(){
                var controller     = arguments[0];
                var id             = controller.getObjectIdentifier();
                var target         = that.group[id];
                for (var i in that.group) {
                    if (that.group[i]!=null&&that.group[i].getObjectIdentifier()!=id) { 
                        that.group[i][_prototype](_params[0]); 
                    };
                };
                
                if (target) { target[_prototype](_params[1]); };
            };

            /*
            @扩展一个解除的方法,一定要显示的释放
            */
            _controller.unbind_group_ext = function(_ctrl){
                var id         = _ctrl.getObjectIdentifier();
                that.group[id] = null;
            };

            return this.group;
        },


	};
})();