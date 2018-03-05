#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
# 
# 检查背景音乐和音效文件是否有问题
# 参数1 - 音效的资源文件
# 参数2 - 工程的res目录
# eg
# python tools/resource/checkSound.py /Users/mac/app/code/hall-js/tag/hall_v3.50/script/hall_effect_res.js /Users/mac/app/code/Framework2/branches/1.03/res/

import sys, os, re 
import Image 
import codecs

# 检查CCB文件文件类型
def isMusic(file):
    return file.endswith('.mp3')

def checkEffect(effectPath, resPath):
    effectFile = open(effectPath, 'r')
    effectLines = effectFile.readlines()

    for line in effectLines:
        # print line
        lineArr = line.split('\'');
        # print len(lineArr)
        if 3 == len(lineArr):
            # print lineArr[0]
            # print lineArr[1] # music
            # print lineArr[2]
            fileToCheck = resPath + '/' + lineArr[1]
            # print fileToCheck
            if os.path.exists(fileToCheck) == False:
                print 'check ' + fileToCheck
                print lineArr[0] + ' - ' + lineArr[1] + ' not exists, please check!!!'
            # else:
                # print 'check ' + fileToCheck + ' SUCC'

if __name__ == '__main__':
    effectPath = sys.argv[1]
    if os.path.exists(effectPath) == False:
        print 'effectPath:' + effectPath + ' not exists, please check!!!'
        sys.exit()

    resPath = sys.argv[2]
    if os.path.exists(resPath) == False:
        print 'resPath:' + resPath + ' not exists, please check!!!'
        sys.exit()

    checkEffect(effectPath, resPath)