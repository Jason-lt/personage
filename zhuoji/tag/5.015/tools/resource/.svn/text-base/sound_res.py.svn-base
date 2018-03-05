#! /usr/bin/python   
# -*- coding: UTF-8 -*-  

import sys, os ,json

noNeedFolderName = [".svn","prop-base","props","text-base","tmp","effect","music","ui"]


def createSoundCfg(baseFolderPath):

    soundCfg = {}

    if os.path.isdir(baseFolderPath):

        print "当前音效目录为：" + baseFolderPath

        for root, dirs, files in os.walk(baseFolderPath):
            for dir in dirs:
                if (noNeedFolderName.count(dir) == 0 and dir != "man" and dir != "woman"):
                    soundCfg[dir] = searchAudioFiles(baseFolderPath, dir)

        # print "============ 全部配置" + json.dumps(soundCfg)

    return soundCfg


# 具体玩法里的 folderName 玩法名
def searchAudioFiles(baseFolderPath,folderName):

    folderPath = os.path.join(baseFolderPath,folderName)

    playModeMap = {}
    if os.path.isdir(folderPath):

        print "当前玩法目录为：" + folderName

        for root, dirs, files in os.walk(folderPath):
            for dir in dirs:
                if noNeedFolderName.count(dir) == 0:
                    playModeMap[dir] = createFileMap(folderPath,dir)

        print "playModeMap:" + json.dumps(playModeMap)

    return playModeMap

def createFileMap(baseFolderPath,folderName):

    folderPath = os.path.join(baseFolderPath,folderName)
    sexMap = {}
    if os.path.isdir(folderPath):

            # print "处理目录：" + folderName

            for root, dirs, files in os.walk(folderPath):
                for fileName in files:
                    if isMp3(fileName):
                        print "处理文件：" + fileName
                        fileKey = getFileKey(fileName)
                        # print "FileKey：" + fileKey

                        fileList = sexMap.get(fileKey)
                        if (not fileList):
                            fileList = []
                            sexMap[fileKey] = fileList

                        fileList.append(fileName);

        
    # print json.dumps(sexMap)
    return sexMap


def getFileKey(fileName):
    sp = 1
    ep = fileName.rfind('_')
    if (ep == -1):
        ep = fileName.rfind('.')
    fileKey = fileName[sp:ep]
    return fileKey

    
def isMp3(file):
    return file.endswith('.mp3')



if __name__ == '__main__':


    cfg = createSoundCfg(sys.argv[1])


    outputFile = open(sys.argv[2],'w')


    outputFile.write('''//音效配置，此文件由 tools/resource/sound_res.py 自动生成，禁止手动修改 许敬 于 2017-6-14
guiyang.RES.SOUND = ''' + json.dumps(cfg) + ''';''')

    outputFile.close()

    print "========= 音效配置表处理完成 =========" 
