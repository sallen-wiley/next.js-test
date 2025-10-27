#!/usr/bin/env python3
import os
import re
import shutil


import sys

# Se passado argumento, usa como pasta alvo; senão, usa pasta onde o script está

if len(sys.argv) > 1:
    target_folder = os.path.abspath(sys.argv[1])
else:
    target_folder = os.getcwd()

script_name = os.path.basename(__file__)

for filename in os.listdir(target_folder):
    file_path = os.path.join(target_folder, filename)
    if os.path.isfile(file_path) and filename != script_name:
        # Remove tudo " (*)" do nome
        new_filename = re.sub(r'\s*\(.*?\)', '', filename)

        # Regex para pegar o nome-base (antes do número, "Book" ou "Part")
        # Exemplo: "NOME 001", "NOME Book 01", "NOME Part 01", "NOME 001.ext"
        match = re.match(r'^(.+?)(?:\s*(?:Book\s*|Part\s*)?\d+)?\.[^.]+$', new_filename)
        if match:
            base_name = match.group(1).strip()

            # Cria a pasta se não existe e não é arquivo
            folder_path = os.path.join(target_folder, base_name)
            if os.path.exists(folder_path) and not os.path.isdir(folder_path):
                print(f"Não posso criar pasta '{folder_path}': já existe arquivo com esse nome. Pulando '{filename}'.")
                continue
            os.makedirs(folder_path, exist_ok=True)

            # Renomear arquivo se necessário
            new_file_path = os.path.join(target_folder, new_filename)
            if filename != new_filename:
                os.rename(file_path, new_file_path)
                print(f"Renomeado: '{filename}' → '{new_filename}'")

            # Move para pasta correspondente
            dest_path = os.path.join(folder_path, new_filename)
            if not os.path.exists(dest_path):
                shutil.move(new_file_path, dest_path)
                print(f"Movido: '{new_filename}' → '{dest_path}'")
            else:
                print(f"O arquivo '{dest_path}' já existe. Pulando.")
        else:
            print(f"Arquivo '{filename}' não bate com o padrão esperado.")
