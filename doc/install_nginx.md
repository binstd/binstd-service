#docker中的安装

nginx中安装docker
拉取ngixn:
docker pull nginx

log_format proxyformat "$remote_addr $request_time $http_x_readtime [$time_local] \"$request_method http://$host$request_uri\" $status $body_bytes_sent \"$http_referer\" \"$upstream_addr\" \"$http_user_agent\" \"$upstream_response_time\" \"$request_time\"";


 server {
      listen 80;
      server_name api.binstd.com;
    
      location / {
        proxy_pass http://172.17.0.1:3000;
        proxy_set_header Host $http_host;                    
        proxy_set_header X-Real-IP $remote_addr;                    
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
      }
  }  


  server {
        listen 443;
        server_name api.binstd.com; #填写绑定证书的域名
        ssl on;
        ssl_certificate 1_api.binstd.com_bundle.crt;
        ssl_certificate_key 2_api.binstd.com.key
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
        ssl_prefer_server_ciphers on;
         location / {
            proxy_pass http://172.17.0.1:3000;
            proxy_set_header Host $http_host;                    
            proxy_set_header X-Real-IP $remote_addr;                    
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
      }
}
server {
    listen 80;
    server_name api.binstd.com;
    rewrite ^(.*)$ https://${server_name}$1 permanent; 
}


1_api.binstd.com_bundle.crt
2_api.binstd.com.key


<!-- server {
    listen 80;
    server_name  xxl.trc-demo.com;
    rewrite ^(.*)$ https://${server_name}$1 permanent; 
 
} -->

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:3000;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
