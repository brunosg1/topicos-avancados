# Multi-stage build para API Spring Boot
FROM maven:3-openjdk-17 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo pom.xml primeiro (para cache de dependências)
COPY pom.xml .

# Baixa as dependências (fica em cache se o pom.xml não mudar)
RUN mvn dependency:go-offline -B

# Copia o código fonte
COPY src ./src

# Constrói a API
RUN mvn clean package -DskipTests -B

# Stage de produção
FROM eclipse-temurin:17-jre-jammy

# Instala dependências necessárias
RUN apt-get update && apt-get install -y \
    curl \
    netcat-openbsd \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Define timezone
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Cria usuário não-root para segurança
RUN groupadd -r springboot && useradd -r -g springboot springboot

# Define o diretório de trabalho
WORKDIR /app

# Copia o JAR construído do stage anterior
COPY --from=build /app/target/*.jar api.jar

# Cria diretórios necessários
RUN mkdir -p /app/logs /app/uploads && chown -R springboot:springboot /app

# Muda para usuário não-root
USER springboot

# Expõe a porta da API
EXPOSE 8080

# Health check para a API
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimization flags
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseContainerSupport -Djava.security.egd=file:/dev/./urandom"

# Comando para executar a API
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar api.jar"]