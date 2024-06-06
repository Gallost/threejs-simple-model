# Simple ThreeJS Model View

## How to run
Local development build
```
> npx vite              # access at localhost:5173 
```

Production build and deploy w/ docker
```
> npx build vite        # produces a dist/ folder
> docker-compose up -d  # runs an nginx server using dist/
```