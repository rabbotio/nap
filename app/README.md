# Apollo Example
## Develop
### With node
```bash
# Will build and serve
npm run nap
```
### With Docker
```bash
# Building your image
docker build -t rabbotio/nap .

# Verify existing
docker images

# To remove existing.
docker rm -f $(docker ps -a -q --filter ancestor=rabbotio/nap)

# Run the image
docker run -p 3000:3000 -p 5858:5858 -d rabbotio/nap

# Open browser (Stop other localhost services first)
open http://localhost:3000/
```

## Passport
You'll need `Redis` to keep user sessions().
```shell
# We'll use redis container.
docker run --name redis -d -p 6379:6379 redis
```
Then you've to config `Redis` endpoint at `.env`
```shell
# For localhost standalone dev
REDIS_STORE_URI=redis://localhost:6379
```
### To login with Facebook
- http://localhost:3000/auth/facebook/
