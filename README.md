# curriculum-vitae-server
![持续集成测试](https://travis-ci.org/TaylorPzreal/curriculum-vitae-server.svg?branch=master)
    [![Coverage Status](https://coveralls.io/repos/github/TaylorPzreal/curriculum-vitae-server/badge.svg)](https://coveralls.io/github/TaylorPzreal/curriculum-vitae-server)
    [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## 技术栈
- Language: NodeJS
- Framework: Express
- Database: MySQL
- Test: Mocha & Should & istanbul
- Crawler: Superagent & Cheerio
- HTTPS Certification: Self auto generaged || Let's Encrypt
- Travis & Coveralls
- Redis Session
- supertest make test
- Github OAuth2.0 Access
- Nginx 启动web服务器，反向代理PM2启动的应用服务器

## 说明
- app文件夹存放前端项目
- 其它所有文件存放后端API接口服务

## 学习之路
- 安装MySQL

    - MySQL Download Url: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
    - MySQL GUI Workbench [https://dev.mysql.com/downloads/workbench/](https://dev.mysql.com/downloads/workbench/)
    - Install & Configuration [MAC安装MySQL](https://taylorpzreal.blogspot.com/2017/07/macmysql.html)
    - Linux 下面安装完可直接使用相关命令
    ```bash
    # 常用命令(Linux Ubuntu & Mint)
    mysql -u root -p #连接mysql
    service mysql start # 启动
    service mysql stop # 终止
    service mysql restart # 重启
    service mysql status || servicectl status mysql.service #查看状态
    systemctl is-enabled mysql.service # 开机自启动MySQL （安装完之后默认是开机启动的）
    ```
    - 开发和生产环境数据库同步 [查看原文](https://taylorpzreal.blogspot.com/2017/07/how-to-migrate-mysql-database-between.html)
    ```sh
    mysqldump -u root -p --opt [database name] > [database name].sql

    scp [database name].sql [username]@[servername]:path/to/database/

    mysql -u root -p newdatabase < /path/to/newdatabase.sql
    ```
- Install Nginx
    - [官网Installition](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)
    - Linux Ubuntu16.04 
    ```bash
    sudo apt update
    sudo apt install nginx
    ```
    - MAC brew install nginx
    - 常用命令

    ```bash
    nginx -t # test
    nginx -s reload # 重启nginx
    nginx -c nginx-config-path # 启动Nginx
    
    #终止Nginx
    ps -ef | grep nginx

    # 从容停止Nginx
    kill -QUIT 主进程号
    # 快速停止
    kill -term 主进程号
    # 强制停止
    kill -9 主进程号
    ```
    - Nginx Configuration [nginx.conf](./docs/nginx.conf) for CORS & Proxy Nodejs Server
- [Install Redis](./docs/redis.md)
- PM2 Process Manager [keymetrics](https://keymetrics.io/)
    - 注册一个帐号，用github注册即可
    - 命令行里面输入： ***pm2 interact start*** 
    - 其它命令 pm2 interact status pm2 interact stop