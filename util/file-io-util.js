const fs=require('fs');
module.exports={
    readFileSync:function(filename){
        var content=fs.readFileSync(filename,'utf8');
        return content.toString();
    },
    
    readFile2Array:function(filename){
        var content=readFileSync(filename);
        lines=content.split('\n');
        return lines;
    },

    createEmptyFile:function(filename){
        fs.openSync(filename,'w');
    },

    isFileExists:function(filename){
        return fs.existsSync(filename);
    },

    getAllFilesInFolder:function(folder){
        var files=[]
        fs.readdirSync(folder).forEach(function(file){
            files.push(file);
        })
            return files;
    },

    createFolderIfNotExists: function(folder){
        if (!this.isFileExists(folder)){
            fs.mkdirSync(folder);
            console.log('directory created');
        }else{
            console.log('directory not created');
        }
    },

    deleteFiles: function(file){
        fs.unlink(file,function(error){
            if(error){
                console.log(error);
            }
           console.log('file deleted '+file); 
        });
    },

    deleteAllfilesInFolder: function(folder){
        var filepath;
        files=this.getAllFilesInFolder(folder);
        files.forEach(function(file){
            console.log(file);
            filepath=imports.path.join(folder,file);
            fs.unlinkSync(filepath);
        });
    },

    deleteAllFilesNFolder: function(folder){
        this.deleteAllfilesInFolder(folder);
        fs.readdirSync(folder);
    }
}
