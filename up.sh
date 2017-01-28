docker version --format '{{.Client.Version}}'

if ! docker network ls | grep -q flakio; then
docker network create flakio
fi

docker-compose -p orderservice -f ./docker-compose.yml up -d

# attach to the applicaiton instance
docker attach flaio_app_1
