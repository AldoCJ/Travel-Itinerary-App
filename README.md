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

3. Place .env file in server directory (the file I put on discord) 


4. Test react app and make sure you can see the list of products (must run server and client in 2 separate terminals)
```
cd server
node index.js
cd ../client
npm start
```
