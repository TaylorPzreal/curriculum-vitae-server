# Redis Config

## Step 1: Download & Installition

```bash
$ wget http://download.redis.io/releases/redis-3.2.9.tar.gz
$ tar xzf redis-3.2.9.tar.gz
$ cd redis-3.2.9
$ make
```

## Step 2: Configuration

```bash
cp redis.conf redis.conf.bk
vim redis.conf # 添加密码（requirepass yourpassword），保存退出

#启动redis：
./src/redis-server ./redis.conf
# 后台永久启动： （Linux）
setsid ./src/redis-server

# 查看启动状态
./src/redis-cli #有ip和端口号就是成功了

# 使用密码查看／操作
auth yourpassword

# 登录的时候添加密码：
./src/redis-cli -p 6379 -a yourpassword
```