# fileserver-docker

静态资源服务容器

## 启动

指定静态资源目录和端口映射

```bash
docker run -d -p 8080:8080 --name fileserver-docker -v /home/statics:/app/statics
```
