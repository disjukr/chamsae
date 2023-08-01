FROM denoland/deno:1.35.3
EXPOSE 8000
WORKDIR /app
USER deno

ADD . .
RUN deno cache pingpong.ts

CMD ["run", "-A", "--unstable", "pingpong.ts"]
