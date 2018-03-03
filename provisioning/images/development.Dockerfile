ARG BASE_IMAGE='node:8-alpine'
FROM ${BASE_IMAGE}
LABEL maintainer="dev@joeir.net" \
  description="annams development shell"
WORKDIR /app
USER root
RUN apk add --update --upgrade --no-cache bash curl vim jq git docker openssh python py-pip make \
  && pip install docker-compose \
  && rm -rf ~/.cache/pip/* \
  && printf -- '\
  printf -- "hostname       : $(hostname)\n"; \
  printf -- "local ip       : $(ifconfig | grep inet | grep -v 127.0.0.1 | tr -s " " | cut -f 3 -d " " | cut -f 2 -d ":")\n"; \
  printf -- "whoami         : $(whoami)\n"; \
  printf -- "PATH           : ${PATH}\n"; \
  printf -- "git            : $(git --version | cut -f 3 -d " ")\n"; \
  printf -- "node           : $(node -v)\n"; \
  printf -- "npm            : $(npm -v)\n"; \
  printf -- "yarn           : $(yarn -v)\n"; \
  printf -- "python         : $(python -V  &>tmp && cat tmp | cut -f 2 -d " " && rm tmp)\n"; \
  printf -- "docker         : $(docker -v | cut -f 3 -d " " | cut -f 1 -d ",")\n"; \
  printf -- "docker-compose : $(docker-compose -v | cut -f 3 -d " " | cut -f 1 -d ",")\n"; \
  ' >> /usr/local/bin/envinfo \
  && chmod +x /usr/local/bin/envinfo \
  && printf -- '\
  printf -- "------------------------\n"; \
  printf -- "ANNAMS DEVELOPMENT SHELL\n"; \
  printf -- "------------------------\n"; \
  printf -- "setting up useful aliases... "; \
  alias ll="ls -lA"; \
  alias ga="git add"; \
  alias gcb="printf %s \"\$(git branch | grep \"*\" | cut -f 2 -d \" \")\""; \
  alias gcm="git commit -m"; \
  alias gcmae="git commit --allow-empty -m"; \
  alias gco="git checkout"; \
  alias gcob="gco -b"; \
  alias gf="git fetch"; \
  alias gi="git init"; \
  alias gl="git log"; \
  alias gln="git log -n"; \
  alias gplrecb="git pull --rebase origin \$(gcb)"; \
  alias gplcb="git pull origin \$(gcb)"; \
  alias gpscb="git push origin \$(gcb)"; \
  alias gr="git rebase"; \
  alias gri="git rebase -i HEAD~"; \
  alias gs="git status"; \
  printf -- "done.\n"; \
  printf -- "* run \"envinfo\" to retrieve environment information.\n";\n \
  PS1="\e[32m\e[1mannams\e[0m\e[32m:\w \$ \e[0m"; \
  ' >> ~/.profile
VOLUME [ "/app", "/var/run/docker.sock", "/root/.ssh", "/root/.gitconfig" ]
ENTRYPOINT [ "/bin/bash", "-l" ]
