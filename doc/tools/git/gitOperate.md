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
    
4. 撤销修改

**一定要注意checkout后面的--，否则就变成“切换到另外一个分支的命令了”**

这里有两种情况：

- 一种是文件自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态。

- 一种是文件已添加到暂存区后，又作了修改，现在撤销修改就回到添加到暂存区后的状态。

    git checkout -- reade.txt

 
5. 撤销暂存区的修改

git reset 命令既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用 HEAD时 ，表示最新的版本。

    git reset HEAD readme.txt

在Git中，用HEAD表示当前版本，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100。

    git reset --hard 3628164

返回到指定的commitId版本。

***撤销修改总结***

- 场景1：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令git checkout -- file。

- 场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令git reset HEAD file，就回到了场景1，第二步按场景1操作。

- 场景3：已经提交了不合适的修改到版本库时，想要撤销本次提交，参考版本回退一节，不过前提是没有推送到远程库。

6. 修改远程仓库地址

git remote set-url origin [url]

    git remote set-url origin http://wwww.ee.git

7. 删除和增加远程仓库地址

git remote rm origin 

git remote add origin  [url]

8. 设置用户名和邮箱

git config --global user.name "Your name"
git config --global user.email "email@example.com"

注意git config命令的--global参数，用了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址。

9. 查看修改内容

git diff readme.md

10. 显示日志

git log 

如果嫌输出信息太多，看得眼花缭乱的，可以试试加上--pretty=oneline参数


11. 显示操作git的每次命令

git reflog

12. 推送远程仓库

git push -u origin master

由于远程库是空的，我们第一次推送master分支时，加上了-u参数，Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。

13. 保存工作区

通畅在开发的过程中，会临时修改已知bug，但是正在开发的分支又不想提交到仓库中，此时可以将工作区的内容进行“存储”,等以后恢复现场后继续工作：

git stash

想恢复现场继续工作的两种方式：
- (1) git stash apply 用git stash apply恢复，但是恢复后，stash内容并不删除，你需要用git stash drop来删除；
- (2) git stash pop 恢复的同时把stash内容也删了.

 git stash list  查看工作区存储列表

 14. 设置本地分支和远程分支关系

    git branch --set-upstream dev origin/dev

15. 查看远程分支

    git remote show origin 

16. 去除显示已删除分支

    git remote prune origin








    