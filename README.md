# curriculum-vitae-server
![持续集成测试](https://travis-ci.org/TaylorPzreal/curriculum-vitae-server.svg?branch=master)
    [![Coverage Status](https://coveralls.io/repos/github/TaylorPzreal/curriculum-vitae-server/badge.svg)](https://coveralls.io/github/TaylorPzreal/curriculum-vitae-server)
    [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
    [![Known Vulnerabilities](https://snyk.io/test/github/taylorpzreal/curriculum-vitae-server/badge.svg)](https://snyk.io/test/github/taylorpzreal/curriculum-vitae-server)

## 一、技术栈
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

## 二、使用说明


## 三、实践之路
### 1. Install MySQL

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
### 2. Install Nginx

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
- ***whereis nginx.conf*** 可进行查找文件路径
### 3. Install Redis [Redis Installition](./docs/redis.md)

### 4. PM2 Process Manager [keymetrics](https://keymetrics.io/)
    - 注册一个帐号，用github注册即可
    - 命令行里面输入： ***pm2 interact start*** 
    - 其它命令 pm2 interact status pm2 interact stop

## 四、待补充文档
### 1. 测试（Unit Testing & E2E Testing）

### 2. 爬虫（Superagent & cheerio）

### 3. API文档: Swagger

### 4. 免费配置HTTPS [Let's Encrypt](https://letsencrypt.org/)
ubuntu 16.04 nginx 配置[https://certbot.eff.org/#ubuntuxenial-nginx](https://certbot.eff.org/#ubuntuxenial-nginx)

> 按着下面的步骤，会自动配置好Nginx的nginx.conf的文件，自己做一下修改即可
```bash
$ sudo apt-get update
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-nginx 
$ sudo certbot --nginx
```
> 配置完成后只有三个月的使用期限，更多配置等我后期继续阅读官方文档进行配置。