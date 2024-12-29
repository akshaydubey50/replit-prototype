import fs from "fs";

interface File {
    type: 'file' | 'dir',
    name: string
}

export const fetchDir = (dir: string, baseDir: string): Promise<File[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("files:::::::::::",files)
                // will get content data inside folder;;; it can be another folder as well as file
                resolve(files?.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file?.name, path: `${baseDir}/${file.name}` })));
            }
        })
    })
}

export const fetchFileContent = (file: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                reject(error);
            }
            else {
                // Will get select file data
                resolve(data)
            }
        })
    })
}
export const saveFile = (file:string,content:string):Promise<void> => {
    return new Promise ((resolve,reject)=>{
        fs.writeFile(file,content,"utf8",(err)=>{
            if(err){
                return reject(err)
            }
            else{
                resolve();
            }
        })
    })
 }