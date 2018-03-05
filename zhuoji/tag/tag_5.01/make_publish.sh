#!/bin/bash

#获取当前路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo dir=$DIR


# copy config
rm -rf $DIR/publish/config
cp -rf ${DIR}/config ${DIR}/publish

# 拷贝
# rm -rf ${DIR}/publish/particle
# rm -rf ${DIR}/publish/sound

# echo "------------------------------------------------------------------------------------------"
# echo "Copy res..."
# echo "------------------------------------------------------------------------------------------"
# cp -rf ${DIR_PROJ}/../prj_common/publish/majiang ${DIR_PLUGIN}/
# cp -rf ${DIR_PROJ}/publish/majiang ${DIR_PLUGIN}/

# echo "------------------------------------------------------------------------------------------"
# echo "Copy res completed."
# echo "------------------------------------------------------------------------------------------"

# Copy js
echo "------------------------------------------------------------------------------------------"
echo "Copy js..."
# copy
rm -rf $DIR/publish/script
cp -rf ${DIR}/script $DIR/publish
echo "Copy js completed."
echo "------------------------------------------------------------------------------------------"
