# 1. Aşama: Build (Projeyi derleme)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Testleri atlayarak projeyi paketle (jar dosyasını oluştur)
RUN mvn clean package -DskipTests

# 2. Aşama: Çalıştırma (Sadece gerekli olan JRE'yi alarak boyutu küçültme)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# İlk aşamadaki jar dosyasını buraya kopyala
COPY --from=build /app/target/BlogBackend-0.0.1-SNAPSHOT.jar app.jar
# Medya dosyaları (resimler) için uploads klasörünü oluştur
RUN mkdir uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]