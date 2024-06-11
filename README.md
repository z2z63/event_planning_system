![wakatime](https://wakatime.com/badge/user/eb532fc7-fa02-42d4-9a30-60b555075854/project/183a8824-dd12-4c71-9cfc-011a62864de2.svg)
![Next.js 14](https://img.shields.io/badge/Next.js-14-blue?logo=next.js)
![GitHub top language](https://img.shields.io/github/languages/top/z2z63/event_planning_system?logo=typescript)
![Website Deploy](https://deploy-badge.vercel.app/?url=https://event-planning-system.vercel.app/&name=vercel&logo=vercel)
![workflow](https://github.com/z2z63/event_planning_system/actions/workflows/build-docker-image.yaml/badge.svg)
![Docker Image Size](https://img.shields.io/docker/image-size/z2z63/event_planning_system?logo=docker)
![Docker Pulls](https://img.shields.io/docker/pulls/z2z63/event_planning_system?logo=docker)

# 在线演示

已使用vercel部署本项目 [event-planning-system.vercel.app](https://event-planning-system.vercel.app/)  
同时也使用了我的个人域名做CNAME：[vercel.virtualfuture.top](https://vercel.virtualfuture.top/)
# 如何运行

1. 安装node22
2. `npm install`安装依赖
3. 参考[.env.template](.env.template)的注释，填写密钥等信息后，重命名为`.env`
4.
   - 开发模式
```shell
npm run dev
```
   - 生产模式
```shell
npm run build
npm run start
```

启动服务后，前往<http://localhost:3000/>即可访问

# 如何部署

## 使用docker

参考[.env.template](.env.template)的注释，填写密钥等信息后，重命名为`.env`  
在项目根目录执行

```shell
docker compose up
```

---
如果无法启动，或启动后无法登录，按照以下顺序依次排查

1. 更新event_planning_system镜像
   ```shell
   docker pull z2z63/event_planning_system
   ```
2. 删除postgres的卷，强制执行sql初始化脚本
   ```shell
   docker volume list
   docker volume rm event_planning_system_postgres-data
   ```
3. 重启docker compose
   ```shell
   docker compose down && docker compose up
   ```