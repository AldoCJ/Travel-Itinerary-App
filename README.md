# Running code on your own machine 

https://medium.com/@ritapalves/get-started-with-the-pern-stack-an-introduction-and-implementation-guide-e33c55d09994

1. Install the required prerequisites from the article above 
2. Clone repo 
```
git clone https://github.com/AldoCJ/Travel-Itinerary-App.git
cd Travel-Itinerary-App
```

2. Install dependencies (server + client)
 ```
cd server
npm install
cd ../client
npm install
```

3. Start postgres docker image 
```
docker run --name my-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret123 \
  -e POSTGRES_DB=admin \
  -p 5432:5432 \
  -d postgres
```

4. Place .env file in server directory (the file I put on discord) 

5. Create this init.sql file in the root directory of the project
```
--- Create a table for the database
CREATE TABLE public.products
(
    product_id SERIAL NOT NULL,
    name character varying(50) NOT NULL,
    price real NOT NULL,
    description text NOT NULL,
    PRIMARY KEY (product_id)
);

-- Seed data for products table
INSERT INTO public.products (product_id, name, price, description) VALUES (1,  'Product 1', 9.00, 'Product 1 description.');
INSERT INTO public.products (product_id, name, price, description) VALUES (2,  'Product 2', 7.19, 'Product 2 description.');
INSERT INTO public.products (product_id, name, price, description) VALUES (3, 'Product 3', 9.29, 'Product 3 description.');
INSERT INTO public.products (product_id, name, price, description) VALUES (4,  'Product 4', 6.45, 'Product 4 description.');
```

6. Then while still in the root, run the following 2 commands: 
```
docker cp ./init.sql my-postgres:/tmp/init.sql

docker exec -ti my-postgres /bin/bash -c "psql -U admin -d admin -f /tmp/init.sql" 
```

7. Test react app and make sure you can see the list of products (must run server and client in 2 separate terminals)
```
cd server
node index.js
cd ../client
npm start
```
