#!/bin/zsh
if [[ -f config.toml || -f config.yaml ]]; then
	echo "Projeto Hugo detectado. Gerando site..."
	hugo
else
	echo "Projeto Hugo NÃO detectado. Pulando etapa 'hugo'."
fi
git add -A
echo "Digite a mensagem do commit:"
read MSG
git commit -m "$MSG"
git pull
git push
