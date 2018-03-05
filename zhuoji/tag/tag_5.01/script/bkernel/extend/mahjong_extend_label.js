/*******************************************************
 *  mahjong_extend_label.js
    Label扩展功能
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-06
 *  特殊说明：
    一些跟“Label”有关的扩展函数
    使用说明:
 */

(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.extend.Label = {
		_TAG:"bkernel.extend.Label",
		bind_scale_ext:function(_label,_actionNode){
            /*
            Label扩展 - 变大变小
            TODO:
            给一个Label的setString函数绑定上 变大变小的功能
            params:
            _label:_node
            _actionNode:做动画的节点
            返回值：
            原始函数
            */
            var label  = _label;
            var that   = this;
            var backup = label.setString;
            if (label.setString) {
                label.setString = function(){
                    var arg = arguments;
                    var c   = label.getString();
                    backup.apply(label,arg);//变长传参数
                    if (arg[0]==c||c=="") { return; };
                    var seq = cc.Sequence.create(
                        cc.EaseSineIn.create(  cc.ScaleTo.create(0.5, 2) ),
                        cc.EaseSineOut.create( cc.ScaleTo.create(0.5, 1) ),
                        cc.DelayTime.create(0.3), 
                        cc.CallFunc.create(function(){
                        }));
                    _actionNode.runAction(seq);
                };
            };

            /*
            @扩展一个解除的方法
            */
            label.unbind_scale_ext  = function(_ret){
                label.setString     = backup;
            };

            return function(){
                backup.apply(label,arguments);//变长传参数
            };
		},
	};
})();