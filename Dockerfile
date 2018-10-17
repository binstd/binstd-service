FROM node:carbon

# 创建 app 目录
WORKDIR /app

RUN npm install
# 如果你需要构建生产环境下的代码，请使用：
# RUN npm install --only=production

