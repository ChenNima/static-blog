---
path: "/resume"
date: 2019-09-10T10:23:40+08:00
title: "个人简历"
type: "resume"
lang: "zh"
---

# 个人信息
 - **陈逸斐**/男
 - 本科/2014年毕业/华东理工大学 环境工程
 -  研究生/2017年毕业/华东理工大学 计算机科学与技术
 - 博客：https://chennima.github.io/blog
 - Github：https://github.com/ChenNima
 -  手机：18918561263
 -  邮箱：fennu637@sina.com

# 工作经历

## SAP Labs China （ 2016年10月 ~  ）
Web应用(前后端)开发以及DevOps。

SAP Jam Collaboration(以下简称Jam)是一个基于`Ruby on Rails`后台/`React`，`BackboneJS`为前端的团队协作工具
### Senior DevOps/SAP Jam Collaboration （ 2020年3月 ~  ）
带领团队推动架构演进，包括引入`Consul`与原有的`HAproxy`配合实现动态服务注册/发现和`Service Mesh`；引入`Fluentd`与`Prometheus`改造原有的日志系统与监控系统。在传统数据中心缺乏Kubernetes基础设施支持的情况下实现了与Kubernetes较为接近的微服务架构。

与跨国团队合作，实现多个时区不间断地共同支持DevOps工作
### DevOps/SAP Jam Collaboration （ 2019年3月 ~ 2020年3月 ）
加入DevOps团队后主要负责将项目迁移至`Kubernetes`，并部署在AWS。主要工作包括编写`Terraform`用以管理集群基础设施；将应用的各个微服务拆分为独立的`Helm` Charts并分别部署；使用`ArgoCD`实现`GitOps`流程；部署`Istio` Service Mesh并实现金丝雀部署，流量监控等功能。
#### Project Flota
Project Flota是在本人在DevOps工作中提出并主导的项目，其目的是将庞杂的单一Ruby on Rails服务拆分为数个微服务以降低代码耦合度，提高服务性能和可维护性。微服务模块主要使用`Golang/Gin`进行开发，相互通过`HTTP/gRPC`沟通。

### Web Developer/SAP Jam Collaboration （ 2017年10月 ~ 2019年3月 ）
包括前端以及后端（`Ruby/NodeJS`）开发。Jam是一个汇聚`React`，`BackboneJS`以及`Rails ERB`模板渲染等前端技术的复杂应用，打包工具也使用了`Webpack`/`Gulp`/`Rails assets pipeline`等。除了前期的工作为编写组件外，后期主要负责组织代码架构，代码审查，模块切分和解耦，解决疑难问题等。编写了抽象层将`BackboneJS`和`React`有机地结合在一起，实现了新老代码的分隔，不影响老代码的情况下基本实现了新功能向`React`/`Typescript`/`Styled-Component`迁移的工作。

编写基于NodeJS的微服务，包括实现React组件的`服务端渲染`服务以及基于`Puppeteer`的`SEO`预渲染服务。

### Frontend Developer/SAP Jam Community （ 2016年10月 ~  2017年10月 ）
SAP Jam Community是一款基于`EmberJS`/`Vue`和`Ruby on rails`的社交平台。在这段工作中主要担任前端开发，除了编写`EmberJS`组件外，还使用`Vue`为项目编写了前后端分离的管理工具。

## CareerBuilder China （ 2016年4月 ~  2016年10月 ）

### Intern Web developer

编写基于`AngularJS`/`Ruby on Rails`/`NodeJS`的web服务

# 技能

### 熟悉
- Web开发: Javascript `Typescript`/HTML/CSS `Styled-Component`/Webpack
- DevOps: Docker/Kubernetes/Terraform/iptables/Consul/HAproxy
- Web框架: React/Vue

### 了解
- Web开发: NodeJS/Ruby on Rails/GraphQL/Golang/SEO/Mysql
- DevOps: Jenkins `Groovy`/Service Mesh/AWS
- Kubernetes相关: Istio/EFK/Helm/ArgoCD