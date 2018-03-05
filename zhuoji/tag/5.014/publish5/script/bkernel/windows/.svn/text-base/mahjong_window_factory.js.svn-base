/*******************************************************
 *  mahjong_wndow_factory.js
    麻将弹窗工厂
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：
    1.“窗体类”如果是通用基类，那么通过通用基类的setContent方法来设置“窗体内容类”。
    2.produce方法获取的是窗体类，如果窗体类是通用基类，通过getContent来获取“窗体内容类”
    
    使用说明:
    1.首先在boot函数里注册窗体
    2. 
    var wnd     = GLOBAL_OBJ.windows.Factory.produce(GLOBAL_OBJ.windows.consts.C_GODRAFFLE,{params},parent);
    var content = wnd.getContent();
 */

(function(){
    var GLOBAL_OBJ = guiyang;
    var REGS                        = {};//注册窗体列表
	GLOBAL_OBJ.bkernel.windows.Factory = {
		_TAG:"bkernel.windows.Factory",
		boot:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
		},

		shut:function(){
            REGS = {};
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
		},

        /*
         窗体生成器
        参数：
        _name:   REGS里注册的窗体名字（KEY）
        _params: 是否有参数
        _parent：父节点
        */
		produce:function(_name,_params,_parent){
            var object      = REGS[_name];
			if (object) {
				var wnd     = new object.main_class(_params);
                GLOBAL_OBJ.LOGD(this._TAG,"produce object.main_class:"+typeof(object.main_class));
                if (object.main_ccbi) {
                    wnd.init(object.main_ccbi);  
                };
                var content = null;
				if (object.content_class) {
					content = new object.content_class(_params);
                      if (content) {
                         if (object.content_ccbi) {
                            content.init(object.content_ccbi);
                         };
                         wnd.setContent( content );  //获取content使用getContent
                      };
				};
                GLOBAL_OBJ.LOGD(this._TAG,"启动弹窗："+object.tag);
				wnd.windowShow(_parent,GLOBAL_OBJ.bkernel.windows.Animations[object.animateName]());//自动弹窗都加载在屏幕node上
				return wnd;
			};
		},
	};

    /*
    businesses层调用这个函数
    */
    GLOBAL_OBJ.bkernel.windows.Factory.REGS = function( _callFunc ){
        /*
        TODO:businesses层注册所有窗体
        */
        var R = _callFunc || function(){ 
            GLOBAL_OBJ.LOGD(GLOBAL_OBJ.bkernel.windows.Factory,"BUSINESSES层没有窗体被注册！！！");
            return {}; 
        };
        
        var temp = R();   // 各个模块自己的弹窗
        for (var key in temp){
            REGS[key] = temp[key];
        };
    };

    /*
    @注册窗口模板 api 
    _class,_ccbi：窗体类，窗体类ccbi
    _content_class,_content_ccbi：窗体类如果是通用基类，则含有窗体内容类（默认为null，null）
    _tag: 中文标注（仅仅是注释，无实际用途）
    */
    GLOBAL_OBJ.bkernel.windows.Factory.REGS_TEMPLATE = function(_class,_ccbi,_content_class,_content_ccbi,_animateName,_tag){
        return {
            main_class   :_class,
            main_ccbi    :_ccbi,
            content_class:_content_class,
            content_ccbi :_content_ccbi,
            animateName  :_animateName,
            tag          :_tag,
        };
    };
})();