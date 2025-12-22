# auth-server-service

### Innehållsförteckning
- [auth-server-service](#auth-server-service)
    - [Innehållsförteckning](#innehållsförteckning)
  - [Beskrivning](#beskrivning)
  - [Installation och körning](#installation-och-körning)
    - [Köra tester](#köra-tester)


## Beskrivning
auth-server-service är en server-applikation som exponerar auth REST APier för att integrera inlogning +registrering av använder i olika applikationer och är kopplad till ett moln baserad mongodb.

## Badges för att visa bygg och kodhälsa status:

[![Node.js CI Refactoring branch](https://github.com/SparkRunners/auth-server-service/actions/workflows/node-CI.js.yml/badge.svg)](https://github.com/SparkRunners/auth-server-service/actions/workflows/node-CI.js.yml)

## Installation och körning
1. För att få appen att fungera behövde vi klona repot:
```bash
 git clone https://github.com/SparkRunners/auth-server-service.git
```
2. Gå in i mappen:
```bash
 cd auth-server-service
```
3. För att få appen att fungera behövde vi köra:
```bash
 npm install
```
4. Gå till webbläsraen och testa genom att öppna dokumentaions sida.
```bash
 localhost:PORTNUMMER/auth-api-docs/v1 
```

### Köra tester
Innan vi kör tester ska vi skapa en .env fil med alla variabler som behövs sedan kör:
```bash
 npm test
```
