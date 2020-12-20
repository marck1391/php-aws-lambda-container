#!/bin/sh

docker tag ${IMAGE}:latest ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/${IMAGE}:latest
docker push ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/${IMAGE}:latest