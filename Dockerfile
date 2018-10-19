# 将官方 node:carbon 运行时用作父镜像
FROM node:carbon

# 收到添加pm2的方式,注意看结尾的CMD
# 也可以查看文档: http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
RUN npm install pm2 -g

# 设置环境变量
ENV NODE_ENV=production

# 将工作目录设置为 /app
WORKDIR /app

# 将当前目录内容复制到位于 /app  中的容器中
ADD . /app

# RUN git push https://github.com/binstd/binstd-service
# 如果你需要构建生产环境下的代码，请使用：
# RUN npm install --only=production
RUN npm install

# 使端口 3000 可供此容器外的环境使用
EXPOSE 3000

# 在容器启动时运行 app.py
# CMD ["python", "app.py"]
# CMD [ "npm", "prd" ]
CMD ["pm2-runtime", "app.js"]


