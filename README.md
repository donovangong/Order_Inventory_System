# Order Inventory System

[![CI/CD](https://github.com/donovangong/Order_Inventory_System/actions/workflows/M_HQ_Control.yml/badge.svg)](https://github.com/donovangong/Order_Inventory_System/actions/workflows/M_HQ_Control.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=donovangong_ca22&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=donovangong_ca22)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Kubernetes](https://img.shields.io/badge/kubernetes-k3s%20deployed-326ce5)
![Helm](https://img.shields.io/badge/helm-chart-0f1689)
A cloud-native order and inventory platform built with a microservice architecture, designed for product stock management, order processing, automated deployment, and observability.

## Contributors
- Chenghan Gong
- Ajinkya Sawale

## Overview
The system includes a static frontend, a product service, an order service, and PostgreSQL for persistent storage. It is containerized with Docker and deployed to k3s using Helm.

## Features
- Product inventory and stock management
- Customer order creation and history tracking
- Kubernetes-based deployment with Helm
- Autoscaling with KEDA
- Monitoring with Prometheus and Grafana
- CI/CD with GitHub Actions
- Code quality analysis with SonarCloud

## Deployment
The application runs on k3s and is deployed through the Helm chart under `resources/helm/ca2`.

## Pipeline
The pipeline builds images, deploys a test environment, runs functional/API/integration tests, performs dependency and quality checks, provisions monitoring, and completes the final deployment.
