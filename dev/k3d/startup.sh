#!/bin/bash

# Start k3d cluster with specific configurations
set -e
if k3d cluster list | grep -q shipoff-dev; then
  echo "k3d cluster 'shipoff-dev' already exists. Deleting it.."
  k3d cluster delete shipoff-dev
  echo ""
  echo "Starting fresh cluster 'shipoff-dev'.."
fi

DIR="$(cd "$(dirname "$0")" && pwd)"

k3d cluster create shipoff-dev --servers 1 --agents 0
kubectl create namespace user-static-apps
kubectl create namespace user-dynamic-apps

#Create the registry secret if the repo is private
kubectl create secret docker-registry shipoff-registry-secret  --docker-server=https://index.docker.io/v1/ --docker-username=shipoff   --docker-password="$TOKEN"   --docker-email=your-email@example.com   -n user-static-apps 

kubectl create secret docker-registry shipoff-registry-secret   --docker-server=https://index.docker.io/v1/ --docker-username=shipoff   --docker-password="$TOKEN"   --docker-email=your-email@example.com   -n user-dynamic-apps

#add service account
kubectl apply -f $DIR/fluent-bit/sa.yaml

#add config
kubectl apply -f $DIR/fluent-bit/config.yaml

#start DaemonSet
kubectl apply -f $DIR/fluent-bit/ds.yaml

kubectl get pods  -l app=fluent-bit 

