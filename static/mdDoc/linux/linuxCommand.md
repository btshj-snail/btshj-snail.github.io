## <span id="command">命令</span>

1. cp 拷贝
 
    cp /home/snail/xx.md /media/snail/uu/xx.md
    //拷贝文件/home/snail/xx.md 到 /media/snail/uu/xx.md
    
2. 卸载挂载的U盘

    umount /media/snail/uu
    
3. 挂起/卸载网络

    sudo ifconfig eth0 down
    sudo ifconfig eth0 up
    
4. 临时设置网络代理

    export http-proxy=http://10.10.10.10:9999
    export https-proxy=http://10.10.10.10:9999

5. 取消网络代理

    unset http-proxy
    unset https-proxy
    
6. 网络相关配置文件

    /etc/network/interfaces
    
    如果网络名指定了相关配置。则network-manager就不会对该网络进行相关配置
    
7. 开启/关闭 network-manager

    sudo start network-manager
    sudo stop network-manager
