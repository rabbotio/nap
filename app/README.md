# Apollo Example
## Develop
```bash
# Building your image
docker build -t rabbotio/nap-app .

# Verify existing
docker images

# Run the image
docker run -p 3000:3000 -p 5858:5858 -p 80:80 -v  -d rabbotio/nap-app

# Open browser (Stop other localhost services first)
open http://localhost:3000/
```
