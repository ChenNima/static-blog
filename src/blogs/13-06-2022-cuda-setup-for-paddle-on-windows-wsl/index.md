---
path: "/cuda-setup-for-paddle-on-windows-wsl"
date: 2022-6-13T11:12:03+08:00
title: "Windows环境下利用WSL搭建PaddlePaddle GUP CUDA环境"
type: "blog"
---

https://docs.nvidia.com/cuda/wsl-user-guide/index.html#getting-started-with-cuda-on-wsl

sudo apt-key del 7fa2af80

wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-wsl-ubuntu.pin
sudo mv cuda-wsl-ubuntu.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/11.7.0/local_installers/cuda-repo-wsl-ubuntu-11-7-local_11.7.0-1_amd64.deb
sudo dpkg -i cuda-repo-wsl-ubuntu-11-7-local_11.7.0-1_amd64.deb

```
The public CUDA GPG key does not appear to be installed.
To install the key, run this command:
sudo cp /var/cuda-repo-wsl-ubuntu-11-7-local/cuda-B81839D3-keyring.gpg /usr/share/keyrings/
```

sudo apt-get update
sudo apt-get -y install cuda

https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html

sudo apt-get install zlib1g

https://developer.download.nvidia.cn/compute/cudnn/secure/8.4.1/local_installers/11.6/cudnn-linux-x86_64-8.4.1.50_cuda11.6-archive.tar.xz?vGW4fiwQ3L0PDIt4dKLgC849rrggvVQMbtoggEuh-j5e7Uj-otwcDX18Qs-SEUbwqM0ZPvX8zEzF_o4Gxp5Q9Y6U4c-sESuaftwk9HeEdquiU9GJWgQF7xgE3aHiYdn8SuiHysFeK50qBIOpNoIAheB51-57xTb6Zs_zputxzCe69A9XT4mUtypbf7RVTmuo2ROwNKr20XOpu_Y2HfOMyrCkdA&t=eyJscyI6InJlZiIsImxzZCI6IlJFRi1kb2NzLm52aWRpYS5jb21cLyJ9

tar -xvf cudnn-linux-x86_64-8.4.1.50_cuda11.6-archive.tar.xz


$ sudo cp cudnn-*-archive/include/cudnn*.h /usr/local/cuda/include 
$ sudo cp -P cudnn-*-archive/lib/libcudnn* /usr/local/cuda/lib64 
$ sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*


https://www.anaconda.com/products/distribution
wget https://repo.anaconda.com/archive/Anaconda3-2022.05-Linux-x86_64.sh

sh Anaconda3-2022.05-Linux-x86_64.sh


https://www.paddlepaddle.org.cn/install/quick?docurl=/documentation/docs/zh/install/pip/linux-pip.html
pip install paddlepaddle-gpu==2.3.0.post112 -f https://www.paddlepaddle.org.cn/whl/linux/mkl/avx/stable.html


The third-party dynamic library (libcuda.so) that Paddle depends on is not configured correctly. (error code is libcuda.so: cannot open shared object file: No such file or directory)

sudo sudo find /usr/ -name 'libcuda.so'

/usr/lib/wsl/lib/libcuda.so

export LD_LIBRARY_PATH=/usr/lib/wsl/lib:LD_LIBRARY_PATH