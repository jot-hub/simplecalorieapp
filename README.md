`server` is a Nodejs `express` app that handles the following:
1. (Dummy) auth flows
2. Serve UI assets
3. Serve `/api` requests

`simple-calorie-app` is an angular app with basic screens to list, create and delete the calorie entries that the user enters into the app. The list is restricted to the entries that the user has entered.

`server` supports the following APIs:

1. Set the daily limit for a user:

```
curl -d '{"dailyLimit": 100}' http://localhost:3000/api/preferences/  --header 'Content-Type: application/json' --header 'Authorization: Bearer '"$TOKEN"''
```

2. Get all entries for the user:

```
curl --header 'Authorization: Bearer '"$TOKEN"'' http://localhost:3000/api/entries | jq
```

3. Create a new entry for the user:

```
curl --header 'Authorization: Bearer '"$TOKEN"'' --header 'Content-Type: application/json' -d '{"date": "2022-02-27", "details": [{"name": "bananas", "timeOfDay": "09:00", "calories": 150}]}' http://localhost:3000/api/entries
```

4. Create a detail entry for the given date:

```
curl --header 'Authorization: Bearer '"$TOKEN"'' --header 'Content-Type: application/json' -d '{"name": "bananas", "timeOfDay": "09:00", "calories": 150}' http://localhost:3000/api/entries/2022-02-27/details
```

5. Delete a specific detailed entry

```
curl -X DELETE --header 'Authorization: Bearer '"$TOKEN"'' http://localhost:3000/api/entries/2022-02-27/details/621e89e3eeb628471dc74127
```

6. Delete all entries for a date

```
curl -X DELETE --header 'Authorization: Bearer '"$TOKEN"'' http://localhost:3000/api/entries/2022-02-27
```

Working with the `simple-calorie-app` looks like the following:


