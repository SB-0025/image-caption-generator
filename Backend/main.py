from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import torch
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Load processor, model, and tokenizer once (fast)
processor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate-caption")
async def generate_caption(file: UploadFile = File(...)):
    try:
        # STEP 7: UploadFile -> bytes
        img_bytes = await file.read()

        # Bytes -> PIL Image
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        # STEP 8: PIL -> tensor
        inputs = processor(images=img, return_tensors="pt")
        pixel_values = inputs["pixel_values"]

        # STEP 9-10: Tensor -> Caption
        with torch.no_grad():
            output_ids = model.generate(pixel_values, max_length=20)
        
        caption = tokenizer.decode(output_ids[0], skip_special_tokens=True)

        return {"caption": caption}

    except Exception as e:
        return {"error": str(e)}


