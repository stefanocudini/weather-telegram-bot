#!/bin/bash

docker rm weather-bot; docker rmi weather-bot:latest; docker-compose up --build
