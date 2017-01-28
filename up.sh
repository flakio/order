docker network create flakio 

docker run -d --env MYSQL_ROOT_PASSWORD=my-secret-pw --net flakio --net-alias orderdb --name orderdb mysql

docker run -it --net flakio --name orderservice -p 9000:80 --env MYSQL_ENDPOINT=mysql://root:my-secret-pw@orderdb -v `pwd`/src:/app -w /app node:6.3 bash
