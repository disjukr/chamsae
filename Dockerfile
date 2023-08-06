FROM denoland/deno:1.35.3
EXPOSE 8001
WORKDIR /app
USER deno

COPY deno.jsonc .
COPY gameserver .
RUN deno cache gameserver/main.ts

CMD ["task", "gameserver"]
