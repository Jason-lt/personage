#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
# 
# 开发中经常有误删的图片，或者rename的plist忘了修改对应的ccb，或者ccb里用到了其他皮肤的图片
# 这类问题通常在运行时暴漏[ 资源有问题，崩掉 ]
# 本脚本是用来检查CCB中的图片资源是否正确
# 
# 流程：
#   1.扫描图片plist导出目录，简历当前所有导出图片的dict
#   2.扫ccb，校验图片的plist与name，二者有一个对不上，报错
# 
# 参数
# 参数1 - 资源导出路径，比如XXX/publish
# 参数2 - CCB工程路径
# 参数3 - 结果文件

import sys, os, re 
import codecs

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

# 检查PLIST文件类型
def isPLIST(file):
    return file.endswith('.plist')

# 检查是否是图片
def isPic(path):
    if path == None:
        return False
    return path.endswith('.png') or path.endswith('.jpg')

# 检查CCB文件文件类型
def isCCB(file):
    return file.endswith('.ccb')

# 判断是否是图片目录
def isImgPath(path):
    return path.find('img') != -1

def searchAllPicsInPlist(plistPath):
    allPics = []
    tree = ET.ElementTree(file=plistPath)
    root = tree.getroot()
    # print root.tag, root.attrib, '\n'
    for dicts in root:
        if dicts.tag == 'dict':
            # print dicts.tag, dicts.attrib
            findFrames=False
            for keys in dicts:
                # print keys.text
                if keys.text == 'frames':
                    findFrames=True
                elif keys.text == 'metadata':
                    findFrames=False
                    # print 'findFrames...'

                if findFrames == True and keys.tag == 'dict':
                    for pics in keys:
                        if pics.tag == 'key':
                            # print pics.text
                            allPics.append(pics.text)

    return allPics

def getAllPicsUsingInCCB(ccbPath):
    # print ccbPath
    allPics = []
    tree = ET.ElementTree(file=ccbPath)
    for elem in tree.iter(tag='array'):
        # print elem.tag, elem.text, elem.attrib
        strings = elem.findall('string')
        if len(strings) == 2:
            # print 'find pic'
            if isPic(strings[0].text):
                plist =  strings[1].text
                pic = strings[0].text
            else:
                plist =  strings[0].text
                pic = strings[1].text

            if plist == None:
                plist = 'nopack'

            # print plist
            # print pic
            picNode = {}
            picNode['plist'] = plist
            picNode['pic'] = pic
            allPics.append(picNode)

    return allPics

# 构建图片字典
def searchAllPics(plistPath):
    allPics = {}
    allPics['nopack'] = []
    imgPaths=[]
    imgPaths.append(plistPath + '/common/img')
    imgPaths.append(plistPath + '/hall/img')
    
    for imgPath in imgPaths:
        for root, dirs , plists in os.walk(imgPath):
            if root.find('nopack') > -1:
                for nopack in plists:
                    abPath = root + '/' + nopack
                    value = abPath[len(plistPath)+1:]
                    # print value
                    allPics['nopack'].append(value)
                # print allPics

            for plist in plists:
                if isPLIST(plist) and isImgPath(root):
                    abPath = root + '/' + plist
                    # print abPath
                    # print root + '/' + plist
                    key = abPath[len(plistPath)+1:]
                    # print key
                    allPics[key] = searchAllPicsInPlist(abPath)

    # print allPics
    return allPics

def check(plistPath, ccbPath, resultPath):
    allPics = searchAllPics(plistPath)
    resultFile = open(resultPath, 'w')

    for root, dirs, ccbs in os.walk(ccbPath):
        for ccb in ccbs:
            # print ccb
            if isCCB(ccb):
                # print ccb
                allCCBPics = getAllPicsUsingInCCB(root + '/' + ccb)
                for ccbPic in allCCBPics:
                    plist = ccbPic['plist']
                    pic = ccbPic['pic']
                    # print 'plist:', plist
                    # print 'pic:', pic

                    if plist in allPics:
                        # print 'found plist file, check detail pic'
                        # print pic
                        # print allPics[plist]
                        if pic == None:
                            continue
                        if not isPic(pic):
                            continue

                        if pic not in allPics[plist]:
                            # print 'found pic:', pic
                            # print ' '
                        # else:
                            print('CCB:%-40s PLIST:%-40s [E]PIC:%-40s'%(ccb, plist, pic))
                            resultFile.write('CCB:%-40s PLIST:%-40s [E]PIC:%-40s\n'%(ccb, plist, pic))
                            # print 'Not found pic:', pic
                    else:
                        print('CCB:%-40s [E]PLIST:%-40s PIC:%-40s'%(ccb, plist, pic))
                        resultFile.write('CCB:%-40s [E]PLIST:%-40s PIC:%-40s\n'%(ccb, plist, pic))
                        # print 'plist:', plist
                        # print 'pic:', pic
                        # print 'plist file:' + plist + ' not exists, please check!!!'

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print '需要带图片导出路径 和 CCB工程路径 和 结果文件'
        sys.exit()

    plistPath = sys.argv[1]
    if os.path.exists(plistPath) == False:
        print 'plistPath:' + plistPath + ' not exists, please check!!!'
        sys.exit()

    ccbPath = sys.argv[2]
    if os.path.exists(ccbPath) == False:
        print 'ccbPath:' + ccbPath + ' not exists, please check!!!'
        sys.exit()

    resultPath = sys.argv[3]
    check(plistPath, ccbPath, resultPath)