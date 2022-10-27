FROM maven:3.6.3-jdk-11-slim AS builder
WORKDIR /workspace
COPY ./ .
RUN mvn clean package spring-boot:repackage
CMD ["mvn", "-version"]

FROM maven:3.6.3-jdk-11-slim AS deploy
WORKDIR /workspace
COPY --from=builder /workspace/target/*.jar ./app.jar
CMD ["java","-Dserver.port=9999","-jar", "/workspace/app.jar"]
