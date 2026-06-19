# Build stage
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
# Copy the gradle wrapper and build files
COPY build.gradle settings.gradle* gradle/ ./
COPY gradlew ./
# Make wrapper executable
RUN chmod +x ./gradlew
# Copy source code
COPY src ./src
# Build the application
RUN ./gradlew clean build -x test

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy the built jar from the build stage (Gradle puts it in build/libs)
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the default port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
