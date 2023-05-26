from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy import LargeBinary
import io
import uvicorn

from generate_avatar import generate_avatar

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to allow requests from any origin
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

Base = declarative_base()

class Avatar(Base):
   __tablename__ = "images"

   id = Column(Integer, primary_key=True)
   prompt = Column(String)
   image_data = Column(LargeBinary)

engine = create_engine("sqlite:///image.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()
Base.metadata.create_all(bind=engine)

@app.get("/{prompt}")
def get_image(prompt: str, headers={"Origin": "http://localhost:4200"}):
    image = session.query(Avatar).filter(Avatar.prompt == prompt).first()

    if not image:
        image_data = save_image(prompt, generate_avatar(456, prompt))
    else:
        image_data = image.image_data
    
    # response.headers["Content-Length"] = str(len(encoded_image))
    return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")


def save_image(prompt, image):
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_byte_arr = img_byte_arr.getvalue()
    new_image = Avatar(prompt=prompt, image_data=img_byte_arr)
    session.add(new_image)
    session.commit()
    return new_image.image_data


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)