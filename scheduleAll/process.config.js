  module.exports = {
    apps: [
        {
            // 生产环境
            name: "poll",
            script: "./entry.js",
            cwd: './', 
            watch: false, // 默认关闭watch 可替换为 ['src']
            ignore_watch: ['node_modules', 'logs', 'export'],
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: './logs/out.log', // 日志输出
            error_file: './logs/error.log', // 错误日志
            max_memory_restart: '1G', // 超过多大内存自动重启，仅防止内存泄露有意义，需要根据自己的业务设置
            exec_mode: 'cluster', // 开启多线程模式，用于负载均衡
            instances: '1', // 启用多少个实例，可用于负载均衡
            autorestart: true, // 程序崩溃后自动重启
            merge_logs: true, 
            env: {// 项目环境变量
                "NODE_ENV": "poll",
                "PORT": 3000
            }
        }
    ]
}