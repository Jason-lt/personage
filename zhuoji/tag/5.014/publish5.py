# -*- coding:utf-8 -*-

import os, sys, shutil, commands, uuid

GLOBALS = type('_', (object,), {})()
GLOBALS.BLACKLIST = set()
GLOBALS.BLACKLIST.add('.DS_Store')


def work(gameSkin):
    GLOBALS.gameSkin = gameSkin
    gamePath = os.path.dirname(__file__)

    suger.removeLurkers(gamePath, GLOBALS.BLACKLIST)

    GLOBALS.gamePath = gamePath
    GLOBALS.publishPath = os.path.join(gamePath, 'publish5')
    if os.path.isdir(GLOBALS.publishPath):
        shutil.rmtree(GLOBALS.publishPath)
    os.makedirs(GLOBALS.publishPath)

    def simplecopy(directoryName):
        if os.path.isdir(os.path.join(gamePath, directoryName)):
            print '拷贝 ' + directoryName + '到发布目录 ======================= '
            shutil.copytree(os.path.join(gamePath, directoryName), os.path.join(GLOBALS.publishPath, directoryName))

    simplecopy('config')
    simplecopy('script')

    _makeskin()

    for d in suger.listdir(gamePath):
        if os.path.isfile(os.path.join(gamePath, d)):
            if PluginSpecial.rootDirFileNeedPublish(d):
                shutil.copy2(os.path.join(gamePath, d), os.path.join(GLOBALS.publishPath, d))

    postprocessers = {
        'config': PluginSpecial._dirPostProcess_config,
        'script': PluginSpecial._dirPostProcess_script,
        'ccbi': PluginSpecial._dirPostProcess_ccbi,
        'img': PluginSpecial._dirPostProcess_img,
        'sound': PluginSpecial._dirPostProcess_sound
    }
    PluginSpecial._dirPostProcess_root(GLOBALS.publishPath)
    for subdir in suger.listdir(GLOBALS.publishPath):
        fullpath = os.path.join(GLOBALS.publishPath, subdir)
        if os.path.isdir(fullpath) and subdir in postprocessers:
            postprocessers[subdir](fullpath)


def _makeskin():
    print '生成皮肤 ===================================='
    if GLOBALS.gameSkin == 'common':
        _doExportSkin(os.path.join(GLOBALS.gamePath, 'skins', GLOBALS.gameSkin))
    else:
        _mergeAndExportSkin()


def _mergeAndExportSkin():
    skinPath = os.path.join(GLOBALS.gamePath, 'skins', GLOBALS.gameSkin)
    tmpPath = os.path.join(GLOBALS.gamePath, 'skins', uuid.uuid1())
    try:
        assert os.path.isdir(skinPath)
        mergeShellScript = os.path.join(skinPath, 'mergeskin.sh')
        if os.path.isfile(mergeShellScript):
            suger.callShellCommand(mergeShellScript)
            _doExportSkin(skinPath)
        else:
            if os.path.isdir(tmpPath):
                shutil.rmtree(tmpPath)
            shutil.copytree(os.path.join(GLOBALS.gamePath, 'skins', 'common'), tmpPath)
            shcmd = 'cp -rf %s/* %s' % (skinPath, tmpPath)
            suger.callShellCommand(shcmd)
            _doExportSkin(tmpPath)
    except Exception, e:
        raise e
    finally:
        if os.path.isdir(tmpPath):
            shutil.rmtree(tmpPath)


def _doExportSkin(workspacePath):

    print '导出资源 ===================================='

    ccbiPath = os.path.join(workspacePath, 'ccbi')
    if os.path.isdir(ccbiPath):
        shutil.rmtree(ccbiPath)
    os.makedirs(ccbiPath)
    imgPath = os.path.join(workspacePath, 'img')
    if os.path.isdir(imgPath):
        shutil.rmtree(imgPath)
    os.makedirs(imgPath)

    _makeccbi(workspacePath)
    _makenopack(workspacePath)
    _maketps(workspacePath)
    PluginSpecial._makespecial(workspacePath)

    for sub in suger.listdir(workspacePath):
        if sub in ['img_src', 'mahjong_common.ccbproj', 'ccb']:
            continue
        fullpath = os.path.join(workspacePath, sub)
        print '--------------->>>>> 拷贝' + sub + ' 到发布目录'
        shutil.copytree(fullpath, os.path.join(GLOBALS.publishPath, sub))

    shutil.rmtree(imgPath)  #删除临时目录
    shutil.rmtree(ccbiPath) #删除临时目录

    print '发布所有资源完成。。。。。'


def _makeccbi(workspacePath):
    ccbiToolPath = os.path.join(os.path.dirname(__file__), 'skins', 'tools', 'ccbpublish')
    suger.chmod777(ccbiToolPath)

    print '生成ccbi ===================================='
    allccb = suger.searchAllFiles(os.path.join(workspacePath, 'ccb'),
                                  lambda x: os.path.splitext(x)[1] == '.ccb')
    for ccb in allccb:
        ccbi = suger.getNameWithoutExtension(ccb) + '.ccbi'
        ccbi = os.path.join(workspacePath, 'ccbi', ccbi)
        print '正在生成 ccbi：' + ccbi
        shcmd = '%s -e ccbi -o %s -v %s' % (ccbiToolPath, ccbi, ccb)

        suger.callShellCommand(shcmd)


def _maketps(workspacePath):

    print '合成 tps ===================================='
    alltps = suger.searchAllFiles(os.path.join(workspacePath, 'img_src', 'tps'),
                                  lambda x: os.path.splitext(x)[1] == '.tps')
    for tps in alltps:
        png = os.path.join(workspacePath, 'img', suger.getNameWithoutExtension(tps) + '.png')
        plist = os.path.join(workspacePath, 'img', suger.getNameWithoutExtension(tps) + '.plist')
        shcmd = 'TexturePacker %s --sheet %s --data  %s' % (tps, png, plist)
        print '正在合成 tps：' + png
        suger.callShellCommand(shcmd, ignoreError=True)


def _makenopack(workspacePath):

    print '拷贝nopack资源 ===================================='
    if os.path.isdir(os.path.join(workspacePath, 'img_src', 'font')):
        shutil.copytree(os.path.join(workspacePath, 'img_src', 'font'),
                        os.path.join(workspacePath, 'img', 'font'))
    if os.path.isdir(os.path.join(workspacePath, 'img_src', 'nopack')):
        shutil.copytree(os.path.join(workspacePath, 'img_src', 'nopack'),
                        os.path.join(workspacePath, 'img', 'nopack'))


class PluginSpecial(object):
    @staticmethod
    def rootDirFileNeedPublish(filename):
        return os.path.splitext(filename)[1] == '.json'

    @staticmethod
    def _makespecial(workspacePath):
        pass

    @staticmethod
    def _dirPostProcess_root(publishedRootPath):
        pass

    @staticmethod
    def _dirPostProcess_config(publishedConfigPath):
        pass

    @staticmethod
    def _dirPostProcess_script(publishedScriptPath):
        pass

    @staticmethod
    def _dirPostProcess_ccbi(publishedCcbiPath):
        pass

    @staticmethod
    def _dirPostProcess_img(publishedImgPath):
        pass

    @staticmethod
    def _dirPostProcess_sound(publishedSoundPath):
        pass


class suger(object):
    @staticmethod
    def callShellCommand(shcmd, ignoreError=False):
        result = commands.getstatusoutput(shcmd)
        if result[0] != 0:
            if ignoreError:
                return False, result[1]
            else:
                raise Exception(shcmd + ' failed! ' + result[1])
        else:
            return True, result[1]

    @staticmethod
    def chmod777(filepath):
        assert os.path.isabs(filepath) and os.path.isfile(filepath)
        shcmd = 'chmod 777 %s' % filepath
        ok, msg = suger.callShellCommand(shcmd)
        if not ok:
            raise Exception('[chmod777] failed! ' + msg)

    @staticmethod
    def listdir(path):
        return filter(lambda x: not x.startswith('.'), os.listdir(path))

    @staticmethod
    def searchAllFiles(fromAbsDir, filefilter):
        assert os.path.isabs(fromAbsDir)
        ret = []
        for dirpath, dirnames, filenames in os.walk(fromAbsDir):
            for fn in filenames:
                if filefilter(fn):
                    ret.append(os.path.join(dirpath, fn))
        return ret

    @staticmethod
    def getNameWithoutExtension(filePath):
        return os.path.splitext(os.path.basename(filePath))[0]

    @staticmethod
    def removeLurkers(dirPath, lurkerNameSet):
        for k in os.listdir(dirPath):
            fp = os.path.join(dirPath, k)
            if os.path.isfile(fp):
                if k in lurkerNameSet:
                    os.remove(fp)
            elif os.path.isdir(fp):
                if k in lurkerNameSet:
                    shutil.rmtree(fp)
                else:
                    suger.removeLurkers(fp, lurkerNameSet)


if __name__ == '__main__':
    work(sys.argv[1])
