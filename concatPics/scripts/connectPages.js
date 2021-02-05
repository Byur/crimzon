const fs = require('fs');
const readline = require('readline');
// 创建一个generator来实现一个单向的流程以及状态机
function*gen(){
    // 首度确认
    function start(ans){
        return ans==="Y"?{success:true,value:true}:{success:true,value:false}
    }


    const getPath = function (ans) {
        /**
         * @description 验证路径的合理性（是否是目录）
         * @param {String} path
         */
        const validatePath = function (path) {
            try {
                const dir = fs.readdirSync(path)
                // console.log("dir",dir)
                if (dir) {
                    return {success:true,value:path}
                }
            } catch(err){
                // console.log()
                return {success:false,value:"你提供的地址不合理,请重新输入："}
            }
        }
        return validatePath(ans)
        
    }

    const changeSettingFlag = yield start
    console.log("changeSettingFlag",changeSettingFlag)
    const settings = {
        volumeSize: 10,
        dirName: "新建分卷"
    }
    if (changeSettingFlag){
        // 改变预设
        const volumeSize = yield function(volumeSize){
            console.log("param volumeSize", volumeSize)
            return Number(volumeSize)>0?{success:true,value:volumeSize}:{success:false,value:"你输入的数字不合理，请重新输入："}
        }
        console.log("volumeSize should be undefinded:",volumeSize)
        settings.volumeSize = Number(volumeSize)||settings.volumeSize
        const dirName = yield function(dirName){
            return dirName.trim()?{success:true,value:dirName}:{success:false,value:"你输入的目录名不合理，请重新输入："}
        }
        settings.dirName = dirName.trim()||settings.dirName
    }
    // 接收路径
    const pathInfo = {
        input: "",
        output: ""
    }
    const inputPath = yield getPath
    pathInfo.input = inputPath;
    const outputPath = yield getPath
    pathInfo.output = outputPath;
    const conf = {
        pathInfo,
        settings
    }
    console.log("conf",conf)
    yield conf
}

// 获取questtion的返回
/**
 * 
 * @param {String} question 
 * @param {Function} handler 
 */
function getQuestionResult(question,resolve){
    console.log("resolve",resolve)
    return new Promise((res)=>{
        console.log("res",res)
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(question, async (ans)=>{
            const handleResult = resolve(ans)
            if (handleResult.success){
                rl.close()
                res(handleResult.value)
            } else {
                rl.close()
                const rejecthandle = await getQuestionResult(handleResult.value,resolve)
                console.log("rejecthandle",rejecthandle)
                res(rejecthandle)
            }
        })
    })
}

// run it 
async function workflow(generator){
    const func0 = generator.next().value
    console.log("func0",func0)
    const changeSettingFlag = await getQuestionResult("当前预设置如下：\n输出的分卷名：“新建分卷”;\n容量：10话/卷；\n希望调整预设吗？(Y/N) ",func0)
    console.log("changeSettingFlag outside",changeSettingFlag)
    let getvolumeSize,getdirName
    if (changeSettingFlag){
        const func1 = generator.next(changeSettingFlag).value
        getvolumeSize = await getQuestionResult("你期望的卷容量(话/卷)是： ",func1)
        const func2 = generator.next(getvolumeSize).value
        getdirName = await getQuestionResult("你期望的分卷名是：",func2)
    }
    const func3 = generator.next(getdirName).value
    const inputPath = await getQuestionResult("你选择的源路径是：",func3)
    console.log("inputPath",inputPath)
    const func4 = generator.next(inputPath).value
    const outputPath = await getQuestionResult("你期望的输出路径是：",func4)
    const conf = generator.next(outputPath).value

    // 当前计数
    let currentCount = 0;
    // 当前分卷
    let currentVolume = 0;
    async function getChildDir(path,updateFolderName="") {
        const childs = fs.opendirSync(path)
        let chunkNum = 0

        let newFolderPath = updateFolderName
        for await (const dirent of childs) {
            if (dirent.isDirectory()) {
                // 填充满一个池后新建一个池
                if (currentVolume%conf.settings.volumeSize===0) {
                    // console.log("新一卷",conf.settings,conf.pathInfo)
                    chunkNum+=1;
                    newFolderPath = conf.pathInfo.output+"/"+conf.settings.dirName+"卷"+String(chunkNum)
                    fs.mkdirSync(newFolderPath)
                }
                currentVolume+=1
                const nextLevelPath = path+"/"+dirent.name
                getChildDir(nextLevelPath,newFolderPath)
            } else if (dirent.isFile()){
                currentCount += 1
                const extName = dirent.name.split(".").reverse()[0]
                const targetFilePath = path+"/"+dirent.name
                const newFileName = newFolderPath+"/"+currentCount+"."+extName
                fs.copyFileSync(targetFilePath,newFileName)
            }
        }
    }
    getChildDir(conf.pathInfo.input)
}

const g = gen()
workflow(g)

