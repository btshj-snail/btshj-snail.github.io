# git 操作


## git api

1. 查看tag标签的备注信息

    //master-v2.0.1 是tag的名称
    
    git show master-v2.0.1  
    
2. 删除本地分支

    //web 是分支名
    git branch -D web
    
3. 删除远程分支

    //web 是分支名。注意origin后面有空格
    git push origin :web