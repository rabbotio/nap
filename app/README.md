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
docker build -t rabbotio/nap-app . 

# Verify existing
docker images

# To remove existing.
docker rm -f $(docker ps -a -q --filter ancestor=rabbotio/nap-app)

# Run the image
docker run -p 3000:3000 -p 5858:5858 -d rabbotio/nap-app

# Open browser (Stop other localhost services first)
open http://localhost:3000/
```
