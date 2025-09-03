# 运行阶段
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package.json ./
COPY ./lib ./lib
COPY ./statics ./statics

# 安装依赖项
RUN npm install

EXPOSE 3080

CMD ["npm", "run","serve"]
