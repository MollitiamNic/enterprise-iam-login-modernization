from fastapi import FastAPI, Depends, HTTPException

app = FastAPI()

def check_fake_token(token: str = None):
    if token != "super_secret_password":
        raise HTTPException(status_code=401, detail="Get out! Invalid token. ")
    return "User is safe"

@app.get("/api/public")
def public_endpoint():
    return {"message": "Anyone can see this!"}

@app.get("/api/secure")
def secure_endpoint(security_check = Depends(check_fake_token)):
    return {"message": "You made it past the bouncer"}