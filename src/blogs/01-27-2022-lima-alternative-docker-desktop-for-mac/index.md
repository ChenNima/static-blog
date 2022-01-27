---
path: "/lima-alternative-docker-desktop-for-mac"
date: 2022-1-27T11:12:03+08:00
title: "Lima: Docker Desktop for Mac的平替？"
type: "blog"
---
在2021年8月31日，Docker官方发布了一条[博客](https://www.docker.com/blog/updating-product-subscriptions/)表明了Docker desktop即将进入订阅收费制模式，并给了一段缓冲期至到2022年1月31日。这也意味着从2022年2月1日开始，所有将Docker用于商业目的，公司规模大于250人或者年收大于一千万美元的公司必须缴纳订阅费用了。虽然个人，非盈利组织和教育机构并不会被收费，但除了Docker desktop之外，还有没有一个适用于Mac平台的容器解决方案以便于日常的开发工作呢？

得益于Linux内核对于Namespace与Cgroup的支持，容器技术在这几年飞速发展，不仅仅构建了云原生帝国，更使程序员们在本地开发时能方便地启动服务。而如果你开发用的电脑是运行MacOS，那么想在本地环境使用Docker，要么使用虚拟机，要么就只能用官方的Docker desktop for mac了。本质上Docker desktop for mac也是将docker启动在了一层虚拟机中，并在命令行提供了几乎与Linux一致的使用体验，甚至也加入了单机Kubernetes的支持。

那么一款合格的Docker desktop for Mac的"平替"，至少要满足以下的需求:
- 在原生Mac系统中提供与Docker命令相兼容的的CLI工具
- 在Mac系统中开启一个虚拟机，并在内部运行容器
- 支持docker-compose

而Kubernetes相关的功能一来不是每个人都用得到，二来诸如[Kind](https://kind.sigs.k8s.io/)以及[K3S](https://k3s.io/)等解决方案也足够优秀，并不需要容器解决方案来支持。这些解决方案中既有大名鼎鼎的[Podman](https://podman.io/)，也有专为MacOS而生的[Lima](https://github.com/lima-vm/lima)&[nerdctl](https://github.com/containerd/nerdctl)，今天我们一起来了解一下这个后起之秀Lima。

# 1.安装与启动Lima
在MacOS下安装Lima相当简单:
```
brew install lima
```
Lima本质上是一个基于[QEMU](https://www.qemu.org/)的Linux虚拟机解决方案，所以我们需要先启动Lima虚拟机。这里需要注意的是默认镜像启动时需要安装一些依赖，如果你在国内可能有一些包下载缓慢或者无法下载，建议挂上代理(Lima默认配置下会把命令行中配置好的代理直接forward至虚拟机中)或者更换镜像/使用Lima配置中的`provision`项添加国内源
```bash
export http_proxy=<your proxy url>
export https_proxy=<your proxy url>
export no_proxy="localhost"
limactl start default
```
第一次启动虚拟机会让你选择是否要用默认的配置来启动虚拟机，可以选择(1)使用默认配置，也可以选择(2)修改配置。Lima所使用的的配置是一个yaml格式的文件，内容包含了镜像，资源限制，挂载方法等等。默认下，Lima会以只读形式将整个用户的`$HOME`目录挂载到虚拟机中，在启动容器的时候如果想挂载主机文件，也只间接从虚拟机挂载的。这就意味着默认配置下Lima内部启动的容器对宿主机的文件系统只有只读权限。为了使容器可以读写宿主机文件，需要修改Lima的配置`mounts`下`~`这一项的`writable`为true:
```yaml
mounts:
- location: "~"
  # CAUTION: `writable` SHOULD be false for the home directory.
  # Setting `writable` to true is possible, but untested and dangerous.
  # Default: false
  writable: true
```
也可以在mounts下添加其他想挂载的宿主机目录。

在虚拟机启动过程中如果想看log，可以从这里找到:
```bash
tail -f ~/.lima/default/serial.log
```
在虚拟机启动完毕之后，可以直接使用`nerdctl`运行一个容器:
```
lima nerdctl run --rm -it hello-world
```
一切正常的话你会看到输出:
```
docker.io/library/hello-world:latest:                                             resolved       |++++++++++++++++++++++++++++++++++++++|
index-sha256:975f4b14f326b05db86e16de00144f9c12257553bba9484fed41f9b6f2257800:    done           |++++++++++++++++++++++++++++++++++++++|
manifest-sha256:f54a58bc1aac5ea1a25d796ae155dc228b3f0e11d046ae276b39c4bf2f13d8c4: done           |++++++++++++++++++++++++++++++++++++++|
config-sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412:   done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:2db29710123e3e53a794f2694094b9b4338aa9ee5c40b930cb8063a1be392c54:    done           |++++++++++++++++++++++++++++++++++++++|
elapsed: 17.1s                                                                    total:  4.4 Ki (266.0 B/s)

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

# 2.替换Docker desktop
虽然直接将`docker`和`docker-compose` alias成对应的Lima命令就可以了，但我们经常会在`makefile`或者`package.json`这些文件中直接编写调用docker命令的脚本，而alias一般只在交互式命令行起作用，也就意味着想完全替换docker的命令需要另辟蹊径了。

首先我们在Lima的文件夹下创建一个`bin`文件夹用来存放脚本
```bash
mkdir ~/.lima/bin
```
然后在这个文件夹中创建两个文件
```shell
#!/usr/bin/env bash
# ~/.lima/bin/docker
lima nerdctl $@
```
```shell
#!/usr/bin/env bash
# ~/.lima/bin/docker-compose
lima nerdctl compose $@
```
将这两个文件配置为可执行
```bash
chmod +x ~/.lima/bin/docker ~/.lima/bin/docker-compose
```
最后，在你的`~/.bashrc`或者`~/.zshrc`中把这个文件夹加入PATH
```bash
export PATH=$HOME/.lima/bin:$PATH
```
重新加载命令行，就可以直接使用docker命令了
```
docker run --rm -it hello-world
```

# 3.lima nerdctl是如何工作的？
`lima nerdctl`是一个组合命令，前半段`lima`代表虚拟机层面的操作，其实`lima`是完整命令`limactl shell default`的简写，这段命令的含义是`在虚拟机"default"中执行命令`。同样的你也可以执行除了`nerdctl`之外的命令:
```
➜  ~ limactl shell default uname -a
Linux lima-default 5.13.0-27-generic #29-Ubuntu SMP Wed Jan 12 17:36:47 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux
```
而直接执行`lima`可以直接进入到虚拟机中与当前相同的目录。
```
➜  ~ pwd
/Users/felix
➜  ~ lima
felix@lima-default:/Users/felix$ pwd
/Users/felix
```
上文提到了默认情况下Lima会把整个`$HOME`挂在到虚拟机中，这个机制目前是使用[reverse sshfs](https://github.com/lima-vm/sshocker/blob/v0.2.0/pkg/reversesshfs/reversesshfs.go)实现的，未来可能会切换至[9p](https://wiki.qemu.org/Documentation/9p)或者[samba](https://www.samba.org/)协议。

既然可以自由进入linux虚拟机，那么我们也可以摆脱MacOS的限制，在虚拟机内对这个基于`containerd`的`nerdctl`一探究竟。

在虚拟机中运行`nerdctl info`观察输出结果:
```
Client:
 Namespace:     default
 Debug Mode:    false

Server:
 Server Version: v1.5.9
 Storage Driver: fuse-overlayfs
 Logging Driver: json-file
 Cgroup Driver: systemd
 Cgroup Version: 2
 Plugins:
  Log: json-file
  Storage: native overlayfs fuse-overlayfs stargz
 Security Options:
  apparmor
  seccomp
   Profile: default
  cgroupns
  rootless
 Kernel Version: 5.13.0-27-generic
 Operating System: Ubuntu 21.10
 OSType: linux
 Architecture: x86_64
 CPUs: 4
 Total Memory: 3.828GiB
 Name: lima-default
 ID: 53d27d11-7cdf-4094-83d8-223afa776445
```
我们得以得到几个信息：
- 默认的储存引擎是[fuse-overlayfs](https://github.com/containers/fuse-overlayfs)
- Cgroup的默认版本是V2
- 启用了Cgroup namespace

那么我们就来看看他针对某一个container的Cgroup配置是怎么样的吧:
首先使用`ps aux`找到虚拟机中容器的pid，然后在`/proc/${pid}`目录下找到Cgroup配置的位置:
```
felix@lima-default$ cat /proc/10921/cgroup
0::/user.slice/user-501.slice/user@501.service/user.slice/nerdctl-92a880a7b55ea13a751ea30b7fceff8bd66dd74516d092b40246538662d18762.scope
```
加上Cgroup目录默认的前缀`/sys/fs/cgroup`我们就能得到这个容器Cgroup配置的地址，进入文件夹后就能看到所有的配置了。
```
felix@lima-default:/sys/fs/cgroup/user.slice/user-501.slice/user@501.service/user.slice/nerdctl-92a880a7b55ea13a751ea30b7fceff8bd66dd74516d092b40246538662d18762.scope$ ls

cgroup.controllers  cgroup.max.descendants  cgroup.threads  cpu.stat        cpu.weight.nice        cpuset.mems            io.stat         memory.events.local  memory.min        memory.stat          memory.swap.max
cgroup.events       cgroup.procs            cgroup.type     cpu.uclamp.max  cpuset.cpus            cpuset.mems.effective  io.weight       memory.high          memory.numa_stat  memory.swap.current  pids.current
cgroup.freeze       cgroup.stat             cpu.max         cpu.uclamp.min  cpuset.cpus.effective  io.max                 memory.current  memory.low           memory.oom.group  memory.swap.events   pids.events
cgroup.max.depth    cgroup.subtree_control  cpu.pressure    cpu.weight      cpuset.cpus.partition  io.pressure            memory.events   memory.max           memory.pressure   memory.swap.high     pids.max
```
可以看到整个Cgroup地址的规律是`/sys/fs/cgroup/user.slice/user-{uid}.slice/user@{uid}.service/user.slice/nerdctl-${containerHash}.scope`

同样的，探索Lima虚拟中的iptables规则也非常简单
```bash
felix@lima-default:/Users/felix$ sudo iptables -t nat -nv -L PREROUTING
# Warning: iptables-legacy tables present, use iptables-legacy to see them
Chain PREROUTING (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DNAT       udp  --  *      *       0.0.0.0/0            192.168.5.3          udp dpt:53 to:192.168.5.2:62883
    0     0 DNAT       tcp  --  *      *       0.0.0.0/0            192.168.5.3          tcp dpt:53 to:192.168.5.2:57612
```

# 4.还是更喜欢Docker？
现在我们知道了，`lima`仅仅提供了虚拟机的解决方案，那么我们是不是可以抛弃`nerdctl`，直接在虚拟机里用的docker呢？实际上Lima官方就有对[docker](https://github.com/lima-vm/lima/blob/master/examples/docker.yaml)和[podman](https://github.com/lima-vm/lima/blob/master/examples/podman.yaml)的支持，以docker为例子，下载对应的docker.yaml后，使用这个配置启动虚拟机即可:
```
limactl start docker.yaml
```
这样，除了`default`之外还会多出一个叫`docker`的虚拟机，所有对这个虚拟机的命令都需要用完整命令`limactl shell docker`.

```
limactl shell docker docker run --rm -it hello-world
```
命令中第一个`docker`是虚拟机的名字而第二个`docker`是docker命令。

# 5.More Than Docker

Lima + nerdctl这种模块分离各司其职的设计着实让人眼前一亮，相较于Docker desktop来说灵活性大大地提升了。尤其是对使用MacOS又不想开Linux虚拟机的人来说，Lima轻量级的虚拟机加方便易用的配置和命令能有效地帮助我们摆脱MacOS的桎梏，直接探索Linux和容器技术。另一方面nerdctl作为`containerd`的"亲儿子"，不仅提供了与docker兼容的api，更有[AppArmor](https://apparmor.net/)等Docker并不原生支持的功能。

自从[OCI](https://opencontainers.org/)标准诞生，并被Kubernetes等实事上的行业标准接纳后，不断涌现出了非常多优秀的实现，而各个云平台也纷纷退出了诸如[Firecracker](https://firecracker-microvm.github.io/)等自研的容器运行时。安全容器与虚拟机容器(e.g. [Kata Containers](https://katacontainers.io/))的概念也逐渐萌生，着实让人为Docker的商业化道路捏一把汗。

### 参考链接
1. https://github.com/lima-vm/lima
2. https://github.com/containerd/nerdctl
3. https://dockerbook.tw/docs/alternatives/lima
