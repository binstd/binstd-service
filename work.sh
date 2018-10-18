git clone -b v2 https://github.com/binstd/binstd-service
cd binstd-service/
docker build -t binstd-service .

sudo docker run -d -p 80:3000 binstd-service

