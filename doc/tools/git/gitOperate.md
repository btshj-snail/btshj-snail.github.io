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
    
4. 撤销本地修改

**一定要注意checkout后面的--，否则就变成“切换到另外一个分支的命令了”**

这里有两种情况：

- 一种是文件自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态。

- 一种是文件已添加到暂存区后，又作了修改，现在撤销修改就回到添加到暂存区后的状态。

    git checkout -- reade.txt
 
5. 撤销缓存区的修改

git reset 命令既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用 HEAD时 ，表示最新的版本。

    git reset HEAD readme.txt

6. 修改远程仓库地址

git remote set-url origin [url]

    git remote set-url origin http://wwww.ee.git

7. 删除和增加远程仓库地址

git remote rm origin 

git remote add origin  [url]
    