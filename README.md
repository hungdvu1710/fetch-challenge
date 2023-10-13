# fetch-challenge

### Challenge Submission from Hung Vu. 
Run the app using the following command:

```
docker compose up --build
```

The app will be hosted on port 3000. \
Thus, the 2 API endpoints can be tested at: 

```
http://localhost:3000/receipts/process
```
and
```
http://localhost:3000/receipts/{id}/points
```

I use Express to complete this challenge. The structure is simple, `server.js` is the main server file of the app. I used only 1 Router file `routes/receipts.js` for the **receipts_router**, which handles the logic of both required API endpoints.\
Since it's not specified in the scope of this challenge, I assumed that input validation is unnecessary. However, I still implemented simple input validation. Further explanation of the code can be found in the comments from `routes/receipts.js`.