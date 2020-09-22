---
path: "/resume-en"
date: 2019-09-10T10:23:40+08:00
title: "Personal Resume"
type: "resume"
lang: "en"
---

# Personal Information
 - **Felix Chen**/Male
 - Bachelor/Graduated at 2014/East China University of Science and Technology/Environment Engineering
 - Master/Graduated at 2017/East China University of Science and Technology/Computer Science and Technology
 - Blog：https://chennima.github.io/blog
 - Github：https://github.com/ChenNima
 - Phone：18918561263
 - E-mail：fennu637@sina.com

# Working Experience

## SAP Labs China （ 2016.10 ~  ）
Web development(Frontend/backend) and DevOps

SAP Jam Collaboration(a.k.a Jam) is a collaboration tool based on `Ruby on Rails` as backend and `React`，`BackboneJS` as frontend.
### Senior DevOps/SAP Jam Collaboration （ 2020.3 ~  ）
Lead the DevOps team evolving the architecture. Including introducing `Consul` which works with `HAproxy` we have to implement dynamic service registration/discovering and `Service Mesh`; introducing `Fluentd` and `Prometheus` for refactoring original logging system and monitoring system. Implemented micro service architecture similar with Kubernetes in legacy data centers which do not have the infrastructure for Kubernetes.

Work with intrernational teams. Achieved around-the-clock support of DevOps topics across multiple timezone.
### DevOps/SAP Jam Collaboration （ 2019.3 ~ 2020.3 ）
My major job is migrating the whole project to `Kubernetes` and deploy on AWS after joining the DevOps Team. What I have done including programming `Terraform` for managing infrastructure; Splitting and decoupling micro services into individual `Helm` Charts and deploying them separately; Utilizing `ArgoCD` for implementing `GitOps` workflow; Deploying `Istio` service mesh and implementing canary deployment, traffic monitoring and etc.
#### Project Flota
Project Flota is submitted and leaded by me during my DevOps work. The purpose of the project is decoupling the massive monolithic Ruby on Rails service into several micro-services to improve the performance and maintainability. The micro-services are based on `Golang/Gin` and communicate with each other via `HTTP/gRPC`.

### Web Developer/SAP Jam Collaboration （ 2017.10 ~ 2019.3 ）
Both frontend and backend(`Ruby/NodeJS`) development. Jam is a complicated application using `React`，`BackboneJS` and `Rails ERB` template rendering as frontend solution, and `Webpack`/`Gulp`/`Rails assets pipeline` as bundling tool. At early stage, my job was creating frontend components. But my major job is organizing code architecture, code reviewing, code slitting/decoupling and solving hard problems. I created an abstract layer for combine `BackboneJS` and `React` components organically, implemented division of new and old code. Migrate new features' development to using `React`/`Typescript`/`Styled-Component` tech-stack while not affect old code and feature.

Implement micro-services based on `NodeJS`, including `server-side-rendering` service for React components and pre-rendering service for `SEO`.
### Frontend Developer/SAP Jam Community （ 2016.10 ~  2017.10 ）
SAP Jam Community is a social platform based on `EmberJS`/`Vue` and `Ruby on rails`. During this period of job, my major job was frontend developing. Other then creating `EmberJS` component, I also wrote a front-back-end-separated management tool using `Vue`.
## CareerBuilder China （ 2016.4 ~  2016.10 ）

### Intern Web developer
Implement web service based on AngularJS`AngularJS`/`Ruby on Rails`/`NodeJS`

# Skill

### Familiar with
- Web developing: Javascript `Typescript`/HTML/CSS `Styled-Component`/Webpack
- DevOps: Docker/Kubernetes/Terraform/iptables/Consul/HAproxy
- Web framework: React/Vue

### Know about
- Web: NodeJS/Ruby on Rails/GraphQL/Golang/SEO/Mysql
- DevOps: Jenkins `Groovy`/Service Mesh/AWS/Git Ops
- K8S related: Istio/EFK/Helm/ArgoCD