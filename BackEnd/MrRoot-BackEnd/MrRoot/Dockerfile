# Use lightweight Java 21 image
FROM eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy jar file
COPY target/MrRoot-0.0.1-SNAPSHOT.jar app.jar

# Expose backend port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
