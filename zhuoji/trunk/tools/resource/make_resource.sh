#!/bin/sh
#------------------------------------------------------------------------
# 生成项目内的resource.sh
# 各个项目维护这个文件即可,路径通过相对路径配置,个人不需要做单独配配置
#-----------------------------------------------------------------------
basepath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $basepath
SKIN=mj_rural
if [[ $# -eq 1 ]]; then
	#statements
	SKIN=$1
fi

#生成mahjong_resource.js
python $basepath/resource.py guiyang $basepath/../../script/businesses/mahjong_resource.js $basepath/../../skins/$SKIN/img_src $basepath/../../skins/$SKIN/ccb $basepath/../../skins/$SKIN/lang $basepath/../../skins/$SKIN/sound
python $basepath/sound_res.py $basepath/../../skins/$SKIN/sound $basepath/../../script/businesses/mahjong_sound_res.js
