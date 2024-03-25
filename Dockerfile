FROM quay.io/keycloak/keycloak:24.0.1

# Definir variáveis ​​de ambiente
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

# Expor a porta necessária
EXPOSE 8080

# Adicionar volume para sincronizar com a pasta de temas
VOLUME /mnt/6E6CF9236CF8E6AD/www/keycloak_themes:/opt/jboss/keycloak/themes

# Comando de inicialização
CMD ["start-dev"]
