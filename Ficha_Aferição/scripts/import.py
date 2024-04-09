import json
import requests

def load_json_data(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data
    except Exception as e:
        print(f"Erro ao ler o arquivo JSON: {e}")
        return None

def send_data_to_api(data):
    try:
        for item in data:
            response = requests.post('http://localhost:3000/pessoas', json=item)
        
            if response.status_code == 201:
                print(f"Registro criado com sucesso: {item}")
            else:
                print(f"Erro ao criar registro: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Erro ao enviar dados para a API: {e}")

def main():
    datasets = ['dataset-extra1.json', 'dataset-extra2.json', 'dataset-extra3.json']

    for dataset in datasets:
        print(f"Carregando e enviando dados do arquivo {dataset} para a API...")
        json_data = load_json_data("data/" + dataset)
        if json_data:
            send_data_to_api(json_data)

if __name__ == "__main__":
    main()
