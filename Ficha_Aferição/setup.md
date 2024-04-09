# mongodb
docker pull mongo:latest
docker run -d --network host --name mongo-fa mongo # diferente em macOS
docker cp data/dataset.json mongo-fa:/tmp # assume que o dataset já se encontra normalizado
docker exec -it mongo-fa bash
mongoimport -d fa-database -c pessoas tmp/dataset.json --jsonArray
docker exec -it mongo-fa mongosh # só para testar a database
show dbs
use fa-database
db.pessoas.find() # listar todas as entradas da coleção pessoas

# express
npx express-generator Ficha_Aferição
cd Ficha_Aferição
npm install
npm audit fix --force # pode ser preciso duas a três vezes
echo "node_modules" > .gitignore
npm i mongoose --save

# seed other datasets
python scripts/import.py
