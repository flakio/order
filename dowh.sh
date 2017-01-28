docker-compose -p orderservice -f ./build/docker-compose.yml down

# cleanup the network if there are not containers using it
if [ "$(docker network inspect flakio --format "{{range .Containers}}T{{end}}")" == "" ]; then
docker network rm flakio
fi
