---
path: "/cuda-gpu-setup-for-paddle-on-windows-wsl"
date: 2022-6-13T11:12:03+08:00
title: "Windows环境下利用WSL搭建GPU训练/推理PaddlePaddle神经网络环境"
type: "blog"
---

# TL;DR

[PaddlePaddle](https://github.com/PaddlePaddle/Paddle)是百度出品的深度学习框架。基于PaddlePaddle百度还推出了[PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)，[PaddleNLP](https://github.com/PaddlePaddle/PaddleNLP)，[PaddleHub](https://github.com/PaddlePaddle/PaddleHub)等实用的工具。作为深度学习框架，`PaddlePaddle`自然也在多个平台支持基于GPU的模型训练和推理，其中也包括Windows平台。如果你想使用Windows系统训练神经网络模型，而又想获得Linux的开发体验的话，Windows Subsystem for Linux (`WSL`)显然是一个不错的选择。如今英伟达的官方显卡驱动官方支持了在WSL系统内部调用CUDA，本文介绍了如何从零开始搭建基于WSL和`PaddlePaddle`的GPU深度学习环境。

本文环境: `System: Windows 10, version 21H2`, `GPU: GTX 3070`, `nVidia driver: 516.01`

# 1. 安装WSL
在安装WSL之前需要注意的是，如果想在WSL内使用CUDA，需要确保Windows版本是`Windows 11`或者至少`Windows 10, version 21H2`。具体的要求可以参考[官方文档](https://docs.microsoft.com/en-us/windows/ai/directml/gpu-cuda-in-wsl)。而显卡驱动方面则是要安装包含WSL CUDA驱动的[官方驱动](https://www.nvidia.com/download/index.aspx)

打开管理员权限的PowerShell输入一下命令即可安装WSL，目前默认安装的版本是`Ubuntu 20.04 LTS`。需要注意的是目前为了在WSL里使用CUDA,需要安装基于`glibc`的Linux发行，默认的Ubuntu是满足要求的。
```bash
wsl --install
```

安装完毕后使用`wsl --status`命令可获取当前WSL的安装信息，需要确保安装的版本是WSL2，如果仍是WSL1.X，可使用`wsl --set-default-version 2`命令将默认版本切换至WSL2后重新安装。
```bash
> wsl --status
# 默认分发：Ubuntu
# 默认版本：2
```

WSL安装完毕后进入Linux子系统，此时因为宿主机已经安装了WSL显卡驱动，在wsl内部输入`nvidia-smi`已经可以获取GPU信息
```bash
> nvidia-smi
# +-----------------------------------------------------------------------------+
# | NVIDIA-SMI 515.43.04    Driver Version: 516.01       CUDA Version: 11.7     |
# |-------------------------------+----------------------+----------------------+
# | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
# | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
# |                               |                      |               MIG M. |
# |===============================+======================+======================|
# |   0  NVIDIA GeForce ...  On   | 00000000:08:00.0  On |                  N/A |
# |  0%   47C    P8    11W / 198W |   1672MiB /  8192MiB |      2%      Default |
# |                               |                      |                  N/A |
# +-------------------------------+----------------------+----------------------+
                                                                               
# +-----------------------------------------------------------------------------+
# | Processes:                                                                  |
# |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
# |        ID   ID                                                   Usage      |
# |=============================================================================|
# |  No running processes found                                                 |
# +-----------------------------------------------------------------------------+
```

# 2. 安装CUDA Toolkit

[CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit)是利用CUDA进行GPU加速的开发环境, 而`CUDA`(ComputeUnified Device Architecture)是一种由NVIDIA推出的通用并行计算架构，该架构使GPU能够解决复杂的计算问题。根据[官方文档](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#getting-started-with-cuda-on-wsl)，Windows下安装的GPU驱动程序已经集成了默认的CUDA Toolkit，但为了避免宿主机驱动更改对WSL环境产生影响，最好在WSL内部独立安装一套CUDA Toolkit。

首先需要删除老的GPG key
```bash
sudo apt-key del 7fa2af80
```
然后使用命令安装，由于本机的GPU是安培架构的，以下示例是基于CUDA 11.7版本的。`PaddlePaddle`对非安培架构推荐安装CUDA 10.2，其他版本安装地址可以[这里](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=WSL-Ubuntu&target_version=2.0)查询。
```bash
# 下载并安装apt-pinning文件，
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-wsl-ubuntu.pin
sudo mv cuda-wsl-ubuntu.pin /etc/apt/preferences.d/cuda-repository-pin-600
# 下载并安装CUDA Toolkit wsl版本地安装包，需要将版本替换为你希望安装的CUDA版本
wget https://developer.download.nvidia.com/compute/cuda/11.7.0/local_installers/cuda-repo-wsl-ubuntu-11-7-local_11.7.0-1_amd64.deb
sudo dpkg -i cuda-repo-wsl-ubuntu-11-7-local_11.7.0-1_amd64.deb
```

安装完deb包后如果出现如下提示，那么请按照提示安装GPG key
```
The public CUDA GPG key does not appear to be installed.
To install the key, run this command:
sudo cp /var/cuda-repo-wsl-ubuntu-11-7-local/cuda-B81839D3-keyring.gpg /usr/share/keyrings/
```

最后使用`apt-get`安装CUDA Toolkit
```bash
sudo apt-get update
sudo apt-get -y install cuda
```

# 3. 安装cuDNN

[cuDNN](https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html)(NVIDIA® CUDA® Deep Neural Network library)是用于深度神经网络的GPU加速库。除了`PaddlePaddle`外，几乎各大深度学习框架如`Tensorflow`，`PyTorch`均支持`cuDNN`。

在安装`cuDNN`之前，需要先安装`zlib`用于压缩/解压
```bash
sudo apt-get install zlib1g
```

而`cuDNN`本身的安装文件需要去[官网](https://developer.nvidia.com/cudnn)手动下载，因为英伟达要求在下载cuDNN之前先注册账号，并给下载链接签发一个绑定账号的token😓在下载页面我们选择`Local Installer for Linux x86_64 (Tar)`

假设我们下载的压缩文件叫`cudnn-linux-x86_64-8.4.1.50_cuda11.6-archive.tar.xz`，下载完成后先解压
```bash
tar -xvf cudnn-linux-x86_64-8.4.1.50_cuda11.6-archive.tar.xz
```
然后将对应的文件拷贝到`/usr/local/cuda`下
```bash
sudo cp cudnn-*-archive/include/cudnn*.h /usr/local/cuda/include 
sudo cp -P cudnn-*-archive/lib/libcudnn* /usr/local/cuda/lib64 
sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*
```
至此`cuDNN`已经安装成功了。

# 4. 利用Conda安装Python

`Conda`是Python的版本和环境管理工具，有些像NodeJS的`NVM`和Ruby的`RVM`。Conda分为Miniconda和Anaconda，前者仅包含基础内容，而后者包含了一些常用的包在内。以Anaconda为例，在[官网](https://www.anaconda.com/products/distribution)可以找到下载链接，实际是一段脚本，可以下载执行安装
```bash
curl -o- https://repo.anaconda.com/archive/Anaconda3-2022.05-Linux-x86_64.sh | bash
```
安装完后重新打开WSL终端就可以获得Python环境(目前默认是3.9)，也可以创建新的Conda环境以及在不同版本的Python间切换。介绍Conda使用的文章有很多，这里不在赘述，可以参考[conda的安装与使用](https://www.jianshu.com/p/edaa744ea47d)

# 5. 安装PaddlePaddle环境

PaddlePaddle有CPU版和GPU版，我们这次自然是要安装GPU版本。从[官网](https://www.paddlepaddle.org.cn/install/quick?docurl=/documentation/docs/zh/install/pip/linux-pip.html)可以获取使用`pip`或者`conda`安装不同版本的指令。以目前CUDA 11.7版为例，虽然PaddlePaddle当前最高支持CUDA 11.2，但CUDA 11.7对其仍然兼容，所以我们利用pip安装基于CUDA 11.2的`paddlepaddle-gpu`包即可。
```bash
pip install paddlepaddle-gpu==2.3.0.post112 -f https://www.paddlepaddle.org.cn/whl/linux/mkl/avx/stable.html
```
为了验证安装，我们在WSL输入`python`进入交互式Python环境，输入`import paddle` ，回车后再输入`paddle.utils.run_check()`。如果打印信息显示
```python
Python 3.9.12 (main, Apr  5 2022, 06:56:58) 
[GCC 7.5.0] :: Anaconda, Inc. on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import paddle
>>> paddle.utils.run_check()
Running verify PaddlePaddle program ... 
W0614 17:12:36.941226  2519 gpu_context.cc:278] Please NOTE: device: 0, GPU Compute Capability: 8.6, Driver API Version: 11.7, Runtime API Version: 11.2
W0614 17:12:36.967586  2519 gpu_context.cc:306] device: 0, cuDNN Version: 8.4.
PaddlePaddle works well on 1 GPU.
PaddlePaddle works well on 1 GPUs.
PaddlePaddle is installed successfully! Let's start deep learning with PaddlePaddle now.
>>> 
```
那么代表PaddlePaddle GPU环境已经准备就绪，可以在显卡上进行深度学习的工作了。但如果出现某些文件缺失，比如这里提示`libcuda.so`找不到
```
The third-party dynamic library (libcuda.so) that Paddle depends on is not configured correctly. (error code is libcuda.so: cannot open shared object file: No such file or directory)
```
那很有可能是某些依赖文件通过WSL注入Linux环境后，没有被加入动态/共享库的路径中。

首先在`/usr`路径下寻找该文件
```bash
> sudo sudo find /usr/ -name 'libcuda.so'
# /usr/lib/wsl/lib/libcuda.so
```
可以看到这个依赖其实已经在`/usr/lib/wsl/lib/libcuda.so`这个路径下了，只是PaddlePaddle无法从`LD_LIBRARY_PATH`中找到它。那只需要把`/usr/lib/wsl/lib`这个路径加入到`LD_LIBRARY_PATH`即可。
```bash
export LD_LIBRARY_PATH=/usr/lib/wsl/lib:$LD_LIBRARY_PATH
```

# 5. 使用PaddleOCR验证GPU环境
[PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)是百度的开源OCR工具库，我们现在可以使用GPU跑一个PaddleOCR的端对端OCR推理来验证一下环境是否搭建成功。

首先将PaddleOCR拉到本地并进入项目目录
```bash
git clone git@github.com:PaddlePaddle/PaddleOCR.git

cd PaddleOCR
```

PaddleOCR中有包括目标检测，文字识别，关键信息提取等诸多工具。我们这次使用最直观的端到端OCR，即输入图片，输出文字的模型。相关的说明文档在这个位置`doc/doc_ch/algorithm_e2e_pgnet.md`

首先需要下载与训练好的模型：
```bash
mkdir inference && cd inference
# 下载英文端到端模型并解压
wget https://paddleocr.bj.bcebos.com/dygraph_v2.0/pgnet/e2e_server_pgnetA_infer.tar && tar xf e2e_server_pgnetA_infer.tar
```
解压后的文件目录结构为：
```bash
├── e2e_server_pgnetA_infer
│   ├── inference.pdiparams
│   ├── inference.pdiparams.info
│   └── inference.pdmodel
```

其中比较关键的两个文件为`inference.pdmodel`以及`inference.pdiparams`，前者储存了整个神经网络模型的结构，而后者储存了各层训练完后的权重参数。如果你想可视化地浏览整个文件，可以使用[Netron](https://netron.app/)这个工具打开这两个文件，整个模型的结构就一览无余了。
![Netron](./netron.png)

下载完模型后，回到PaddleOCR的根目录，就可以使用官方提供的工具对测试数据进行批量识别了:
```bash
> python3 tools/infer/predict_e2e.py --e2e_algorithm="PGNet" --image_dir="./doc/imgs_en/" --e2e_model_dir="./inference/e2e_server_pgnetA_infer/" --e2e_pgnet_valid_set="totaltext"
# [2022/06/16 16:24:31] ppocr INFO: Predict time of ./doc/imgs_en/254.jpg: 5.411184072494507
# [2022/06/16 16:24:31] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_254.jpg
# [2022/06/16 16:24:31] ppocr INFO: Predict time of ./doc/imgs_en/img623.jpg: 0.08095073699951172
# [2022/06/16 16:24:31] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_img623.jpg
# [2022/06/16 16:24:31] ppocr INFO: Predict time of ./doc/imgs_en/img_10.jpg: 0.09116768836975098
# [2022/06/16 16:24:31] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_img_10.jpg
# [2022/06/16 16:24:31] ppocr INFO: Predict time of ./doc/imgs_en/img_11.jpg: 0.07429361343383789
# [2022/06/16 16:24:31] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_img_11.jpg
# [2022/06/16 16:24:32] ppocr INFO: Predict time of ./doc/imgs_en/img_12.jpg: 0.10506463050842285
# [2022/06/16 16:24:32] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_img_12.jpg
# [2022/06/16 16:24:32] ppocr INFO: Predict time of ./doc/imgs_en/img_195.jpg: 0.0799555778503418
# [2022/06/16 16:24:32] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_img_195.jpg
# [2022/06/16 16:24:32] ppocr INFO: Predict time of ./doc/imgs_en/model_prod_flow_en.png: 0.07767033576965332
# [2022/06/16 16:24:32] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_model_prod_flow_en.png
# [2022/06/16 16:24:32] ppocr INFO: Predict time of ./doc/imgs_en/wandb_metrics.png: 0.14113736152648926
# [2022/06/16 16:24:32] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_wandb_metrics.png
# [2022/06/16 16:24:32] ppocr INFO: Predict time of ./doc/imgs_en/wandb_models.png: 0.15174198150634766
# [2022/06/16 16:24:32] ppocr INFO: The visualized image saved in ./inference_results/e2e_res_wandb_models.png
# [2022/06/16 16:24:32] ppocr INFO: Avg Time: 0.10024774074554443
```

在识别的过程中，在另一个终端使用`nvidia-smi`，就能看到一个python任务正在占用GPU：
```bash
> nvidia-smi
# Thu Jun 16 16:24:30 2022       
# +-----------------------------------------------------------------------------+
# | NVIDIA-SMI 515.43.04    Driver Version: 516.01       CUDA Version: 11.7     |
# |-------------------------------+----------------------+----------------------+
# | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
# | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
# |                               |                      |               MIG M. |
# |===============================+======================+======================|
# |   0  NVIDIA GeForce ...  On   | 00000000:08:00.0  On |                  N/A |
# |  0%   48C    P8    16W / 198W |   3412MiB /  8192MiB |     21%      Default |
# |                               |                      |                  N/A |
# +-------------------------------+----------------------+----------------------+
                                                                               
# +-----------------------------------------------------------------------------+
# | Processes:                                                                  |
# |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
# |        ID   ID                                                   Usage      |
# |=============================================================================|
# |    0   N/A  N/A      9129      C   /python3.9                      N/A      |
```

打开保存结果的目录`inference_results`就能看到识别的结果了
![ocr_res](./e2e_res_img_12.jpg)

# 6. It's all setup, happy deep learning!

最后别忘记安装VScode的[WSL remote插件](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)了, happy deep learning!

### 参考链接
1. https://docs.microsoft.com/en-us/windows/ai/directml/gpu-cuda-in-wsl
2. https://docs.nvidia.com/cuda/wsl-user-guide/index.html#getting-started-with-cuda-on-wsl
3. https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html
4. https://www.paddlepaddle.org.cn/install/quick?docurl=/documentation/docs/zh/install/pip/linux-pip.html
5. https://www.jianshu.com/p/edaa744ea47d
6. https://zhuanlan.zhihu.com/p/463235082
7. https://zhuanlan.zhihu.com/p/83971195
