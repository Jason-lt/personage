/*******************************************************
 *  mahjong_extend_button.js
    button扩展功能
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-03
 *  特殊说明：
    一些跟“button”有关的扩展函数
    使用说明:
 */

(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.extend.Button = {
		_TAG:"bkernel.extend.Button",
		bind_timeout_ext:function(_btn,_timeout,_callback,_timeoutCallback,_undoCallback){
            /*
            按钮扩展 - 超时按钮
            TODO:
            给一个按钮设定上超时回调
            params:
            按钮node，超时时间，正常点击，超时回调，解除超时回调
            */
            var btn  = _btn;
            var that = this;
            var time = _timeout || 0;
            var cb   = _callback||function(){};//必须有返回值哦，默认返回true，才是正确执行
            var tocb = _timeoutCallback||function(){};
            var udcb = _undoCallback||function(){};
            GLOBAL_OBJ.LOGD(this._TAG, "按钮"+btn+"绑定bind_timeout_ext扩展");
            btn.addTargetWithActionForControlEvents(this, function(){
                if(cb()){
                    btn.setEnabled(false);
                    GLOBAL_OBJ.bkernel.utils.GlobalTimer.set(time,function(){
                        tocb();
                        btn.unbind_timeout_ext(true);//超时了也要解除超时限制
                    },btn);   
                };
            },cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

            /*
            @扩展一个解除的方法
            */
            btn.unbind_timeout_ext  = function(_ret){
                btn.setEnabled(_ret==null?true:_ret);//解锁未必按钮就能用
                GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(btn);
                udcb();
            };

            //保证释放
            btn.onCleanup = function(){
                btn.unbind_timeout_ext(false);
                btn = null;
            };

            GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(btn);//安全释放
		},

        bind_function_ext:function(_btn,_name,_callback,_unbindCallback){
            /*
            按钮扩展 - 绑定一个函数
            TODO:
            给一个按钮绑定一个函数
            params:
            按钮node，函数名，函数, 解除绑定后回调（null）
            */
            var btn  = _btn;
            var that = this;
            var name = _name;
            var cb   = _callback||function(){};
            var ubcb = _unbindCallback||function(){};

            btn[name] = cb;
            /*
            @扩展一个解除的方法
            */
            btn.unbind_function_ext = function(){
                btn.name = function(){ 
                    GLOBAL_OBJ.LOGD(this._TAG, "按钮的扩展方法已经解除绑定："+name); 
                };
                ubcb();
            };
        },
	};
})();