# Use a imagem oficial do Node.js LTS como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production && npm cache clean --force

# Copia o código fonte da aplicação
COPY . .

# Cria um usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Define as permissões do diretório
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expõe a porta da aplicação (ajuste conforme necessário)
EXPOSE 3000

# Define variáveis de ambiente padrão
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]