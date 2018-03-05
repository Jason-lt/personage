/*******************************************************
 *  mahjong_wndow_factory.js
    麻将弹窗动画
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-04
 *  特殊说明：

    使用说明:
    easeIn : 0,
    easeOut : 1,
    easeInOut : 2,
    easeExponentialIn : 3,
    easeExponentialOut : 4,
    easeExponentialInOut : 5,
    easeSineIn : 6,
    easeSineOut : 7,
    easeSineInOut : 8,
    easeElasticIn : 9,
    easeElasticOut : 10,
    easeElasticInOut : 11,
    easeBounceIn : 12,
    easeBounceOut : 13,
    easeBounceInOut : 14,
    easeBackIn : 15,
    easeBackOut : 16,
    easeBackInOut : 17,

    easeBezierAction : 18,
    easeQuadraticActionIn : 19,
    easeQuadraticActionOut : 20,
    easeQuadraticActionInOut : 21,
    easeQuarticActionIn : 22,
    easeQuarticActionOut : 23,
    easeQuarticActionInOut : 24,
    easeQuinticActionIn : 25,
    easeQuinticActionOut : 26,
    easeQuinticActionInOut : 27,
    easeCircleActionIn : 28,
    easeCircleActionOut : 29,
    easeCircleActionInOut : 30,
    easeCubicActionIn : 31,
    easeCubicActionOut : 32,
    easeCubicActionInOut : 33
 */

(function(){
    var GLOBAL_OBJ = guiyang;
    var REGS                           = {};//注册窗体列表
	GLOBAL_OBJ.bkernel.windows.Animations = {
		_TAG:"bkernel.windows.Animations",

        none:function(){
            return [
            function(_node,_callback){
                var callback = _callback || function(){}; 
                callback();
            },
            function(_node,_callback){ 
                var callback = _callback || function(){}; 
                callback(); 
            }];
        },

		scale:function(){
            return [
                function(_node,_callback){//open
                    var node     = _node;
                    var callback = _callback || function(){};
                    node.runAction(cc.Sequence.create(cc.ScaleTo.create(0,0.98),
                            cc.EaseExponentialOut.create(cc.ScaleTo.create(0.3,1)),
                            cc.CallFunc.create(callback)));
                },
                function(_node,_callback){//close
                    var node     = _node;
                    var callback = _callback || function(){};
                    node.runAction(cc.Sequence.create(
                            cc.EaseExponentialIn.create(cc.ScaleTo.create(0.2,0.98)),
                            cc.ScaleTo.create(0,0),
                            cc.CallFunc.create(callback)));
                }
            ];
		},
	};

})();