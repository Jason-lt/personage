(function(){
    var GLOBAL_OBJ = guiyang;
    /*
     * 简单封装音乐音效设置
     *  */
    GLOBAL_OBJ.UserDefault = cc.Class.extend({
        ctor:function() {
           this.setting ={
               openMusic:0,	// 背景音乐
               openEffect:1 // 音效
           };
        },

        /**
         * 设置背景音乐状态
         * @param {[type]} _mode [description]
         */
        setMusicStatus:function(_mode){
            if (_mode == 0){
                hall.AudioHelper.stopMusic();
            }
            else{
                GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_TABLEMUSIC_MP3, true);
            }
            hall.AudioHelper.setMusicVolume(_mode);
            hall.LocalStorage.setItem(hall.SETTING_MUSIC_KEY, _mode+ "");
        },

        /**
         * 获取背景音乐状态
         * @return {[type]} [description]
         */
        getMusicStatus:function(){
            return hall.GlobalFuncs.ReadNumFromLocalStorage(hall.SETTING_MUSIC_KEY, 1);
        },

        /**
         * 设置音效状态
         * @param {[type]} _mode [description]
         */
        setEffectStatus:function(_mode){
            hall.AudioHelper.setEffectsVolume(_mode);
            hall.LocalStorage.setItem(hall.SETTING_EFFECT_KEY, _mode+"");
        },

        /**
         * 获取音效状态
         * @return {[type]} [description]
         */
        getEffectStatus:function(){
            return hall.GlobalFuncs.ReadNumFromLocalStorage(hall.SETTING_EFFECT_KEY, 1);
        }
    });

    GLOBAL_OBJ._userdefault = null;
    GLOBAL_OBJ.UserDefault.shareUserDefault = function(){
        if (GLOBAL_OBJ._userdefault ==null) {
            GLOBAL_OBJ._userdefault = new GLOBAL_OBJ.UserDefault();
        }
        return GLOBAL_OBJ._userdefault;
    };
})();