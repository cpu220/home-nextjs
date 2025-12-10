# Next.js 项目 Docker 部署指南

本指南提供了将个人作品集网站部署到 Docker 容器的详细步骤，帮助维护人员理解项目对 Docker 的使用。

## 目录

- [Docker 构建脚本说明](#docker-构建脚本说明)
- [构建 Docker 镜像](#构建-docker-镜像)
- [Docker 镜像检查与验证](#docker-镜像检查与验证)
- [部署步骤](#部署步骤)
- [最佳实践与注意事项](#最佳实践与注意事项)
- [常见问题](#常见问题)

## Docker 构建脚本说明

项目提供了两套构建脚本：

### 1. 简化版脚本（scripts/simple 目录）

适合日常使用和快速部署，专注于基本功能，支持标签控制：

#### 脚本列表与功能

1. **index.sh** - 总控脚本
   - 按顺序执行构建和部署流程
   - 自动传递参数给构建脚本
   - 检查构建和部署结果

2. **build.sh** - 镜像构建脚本
   - 使用 Dockerfile-simple 构建镜像
   - 支持标签类型控制（latest 或时间戳版本标签）
   - 自动保存构建结果到 image_info.txt 文件

3. **deploy.sh** - 镜像部署脚本
   - 读取镜像信息文件，获取构建结果
   - 标记镜像为腾讯云仓库格式
   - 根据标签类型决定是否推送版本化标签

#### 脚本参数说明

- `--versioned` 或 `-v` - 使用时间戳版本化标签
  - 格式为 vYYYYMMDD-HHMMSS（例如：v20231210-183000）
  - 同时保留 latest 标签作为兼容性
  - 适合生产环境版本控制和回滚

### 2. 高级构建脚本（根目录）

适用于特殊场景，解决架构兼容性和网络问题：

1. **build-local-image.sh** - 本地快速构建脚本
   - 自动检测系统架构
   - 使用标准 docker build 命令
   - 适合开发环境或网络受限情况

2. **build-multiplatform-image.sh** - 多平台构建脚本
   - 支持多平台构建（linux/amd64、linux/arm64等）
   - 提供国内镜像源选择
   - 支持多种构建模式和自动重试机制

## 构建 Docker 镜像

### 使用简化版脚本（推荐）

```bash
# 使用总控脚本一键完成构建和部署
./scripts/simple/index.sh

# 或单独使用构建脚本
./scripts/simple/build.sh
```

标签模式选择：
```bash
# 开发环境：使用默认 latest 标签
./scripts/simple/build.sh

# 生产环境：使用时间戳版本标签
./scripts/simple/build.sh --versioned
```

### 使用高级脚本

对于特殊场景：

```bash
# 本地快速构建
./build-local-image.sh

# 多平台构建
./build-multiplatform-image.sh
```

## Docker 镜像检查与验证

### 检查镜像信息

```bash
# 列出本地所有镜像
docker images | grep home-nextjs

# 查看镜像详细信息
docker inspect home-nextjs:latest

# 如果使用简化脚本，还可以查看
echo "===== 镜像信息 ====="
cat scripts/simple/image_info.txt
```

### 本地验证容器

部署前可以在本地测试：

```bash
# 运行测试容器
docker run -p 3001:3001 --name home-nextjs-test home-nextjs:latest

# 测试完成后清理
# docker stop home-nextjs-test && docker rm home-nextjs-test
```

在浏览器中访问 http://localhost:3001 验证应用是否正常运行。

## 部署步骤

### 1. 本地部署

使用本地构建的镜像直接运行：

```bash
docker run -d \
  -p 3001:3001 \
  --name home-nextjs \
  --restart unless-stopped \
  home-nextjs:latest
```

### 2. 腾讯云部署流程

#### 使用简化脚本部署（推荐）

```bash
# 一键构建并部署
./scripts/simple/index.sh --versioned  # 推荐生产环境使用版本化标签
```

#### 手动部署到腾讯云

1. **推送镜像到腾讯云仓库**：
   ```bash
   # 登录腾讯云镜像仓库
   docker login ccr.ccs.tencentyun.com
   
   # 标记并推送镜像
   docker tag home-nextjs ccr.ccs.tencentyun.com/[命名空间]/home-nextjs:latest
   docker push ccr.ccs.tencentyun.com/[命名空间]/home-nextjs:latest
   ```

2. **在腾讯云服务器上拉取并运行**：
   ```bash
   docker pull ccr.ccs.tencentyun.com/[命名空间]/home-nextjs:latest
   docker run -d -p 3001:3001 --name home-nextjs --restart=always \
     ccr.ccs.tencentyun.com/[命名空间]/home-nextjs:latest
   ```

3. **配置安全组规则**：
   - 允许访问应用端口（通常是3001）

4. **配置反向代理（可选）**：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 最佳实践与注意事项

### 生产环境配置

1. **使用版本化标签**：
   ```bash
   ./scripts/simple/index.sh --versioned
   ```
   这样便于回滚和版本控制。

2. **设置资源限制**：
   ```bash
   docker run -d -p 3001:3001 --memory=512m --cpus=0.5 \
     --name home-nextjs --restart=always home-nextjs:latest
   ```

3. **配置健康检查**：
   ```bash
   docker run -d -p 3001:3001 \
     --health-cmd "curl -f http://localhost:3001 || exit 1" \
     --health-interval=30s home-nextjs:latest
   ```

### 日常维护

1. **更新容器**：
   ```bash
   # 停止并删除现有容器
   docker stop home-nextjs && docker rm home-nextjs
   
   # 拉取最新镜像并重启
   docker pull ccr.ccs.tencentyun.com/[命名空间]/home-nextjs:latest
   docker run -d -p 3001:3001 --name home-nextjs --restart=always \
     ccr.ccs.tencentyun.com/[命名空间]/home-nextjs:latest
   ```

2. **查看日志**：
   ```bash
   docker logs home-nextjs  # 查看日志
   docker logs -f home-nextjs  # 实时查看日志
   ```

3. **进入容器**：
   ```bash
   docker exec -it home-nextjs /bin/sh
   ```

### 重要注意事项

1. **权限问题**：确保脚本有执行权限
   ```bash
   chmod +x scripts/simple/*.sh
   ```

2. **腾讯云登录**：部署前确保已登录腾讯云镜像仓库
   ```bash
   docker login ccr.ccs.tencentyun.com
   ```

3. **端口映射**：确保使用正确的端口映射

4. **错误处理**：部署失败时检查：
   - Docker 是否已启动
   - 腾讯云仓库访问权限
   - 网络连接状态

## 常见问题

### Q: 遇到网络超时问题怎么办？

**A**: 
1. 使用 `build-local-image.sh` 脚本
2. 检查网络连接
3. 考虑设置 Docker 镜像加速器

### Q: 如何选择合适的构建脚本？

**A**: 
- 日常开发和部署：使用 `scripts/simple` 目录下的脚本
- 多平台部署或特殊网络环境：使用根目录的高级脚本

### Q: 版本化标签有什么好处？

**A**: 
- 可以追踪每个部署的版本
- 方便回滚到特定版本
- 避免 latest 标签可能带来的缓存问题
- 适合生产环境的版本控制