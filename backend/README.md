# NeuroBank
This is the backend for NeuroBank. The backend is made with Java 21, Apache Maven, Docker Compose, and PostgreSQL 18 (through Docker).

## Prerequisites
Make sure these are all installed:
- Java 21 JDK
- Apache Maven
- Docker
- Docker Compose

## Environment Variables
Rename the `.env.example` file to `.env`. You may use the supplied defaults as is or adjust as needed.

## Start the backend
Follow the steps laid out in order.

### Spin up PostgreSQL
The PostgreSQL Docker image must be started and running before the Spring application is started up.

Make sure that the Docker Compose configuration correctly picked up the environment variables from `.env` file:
```
docker compose config
```

If everything looks good, start the PostgreSQL container:
```
docker compose up -d
```

Verify that it is up and running:
```
docker compose ps
```

### Run the Spring Application
From the project root:

Rebuild the application and make sure that all tests pass:
```
./mvnw clean verify
```

If that succeeds, start up the application:
```
./mvnw spring-boot:run
```

The application will start on the configured port (see `server.port`  in `src/main/resources/application.properties`). By default, it's `8085`.
```
http://localhost:8085
```

## Stop the Database
Stop the PostgreSQL Docker container when not needed:
```
docker compose down
```

To remove the persisted data in the database:
```
docker compose down -v
```