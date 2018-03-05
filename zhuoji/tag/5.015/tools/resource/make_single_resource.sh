#!/bin/sh
#------------------------------------------------------------------------
# 生成项目内的resource.sh
# 各个项目维护这个文件即可,路径通过相对路径配置,个人不需要做单独配配置
#-----------------------------------------------------------------------
basepath=$(cd `dirname $0`; pwd)
echo $basepath
#生成common_resource.js
# python $basepath/resource.py common $basepath/../../script/common_resource.js $basepath/../../skins/common/img_src
#生成hall_resource.js
python $basepath/resource.py hall $basepath/../../script/hall_resource.js $basepath/../../skins/single_tmp/hall/img_src $basepath/../../skins/single_tmp/hall/ccbproj/hall/ccb