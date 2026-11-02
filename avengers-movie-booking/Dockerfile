FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY --from=build --chown=10001:0 /workspace/target/avengers-movie-booking-1.0.0.jar /app/app.jar

ENV PORT=8080
EXPOSE 8080
USER 10001

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
