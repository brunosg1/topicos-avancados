Isso expõe seu app React/Vite em http://localhost:3000.

🛠 Passos para rodar:
Certifique-se de que package.json, nginx.conf, e docker-compose.yml estejam na mesma pasta.

Execute:

bash
Copiar
Editar
docker-compose up --build
Acesse em http://localhost:3000.

🚀 Próximos ajustes (opcionais):
Injeção de variáveis de ambiente no runtime com Docker envsubst

Servir sobre HTTPS com certificados TLS

Configurar multi-stage para development com hot-reload

Adicionar container de backend (Node ou Spring Boot) e rodar tudo junto