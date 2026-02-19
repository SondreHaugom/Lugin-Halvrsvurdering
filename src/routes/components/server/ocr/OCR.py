import os
from mistralai import Mistral
import dotenv
import tkinter as tk
from tkinter import filedialog

root = tk.Tk()
root.withdraw()

file_path = filedialog.askopenfilename(
    title="Velg en fil",
    filetypes=[
        ("Bildefiler", "*.png *.jpg *.jpeg *.gif *.bmp"),
        ("PDF filer", "*.pdf"),
        ("Alle filer", "*.*")
    ]

)
if file_path:
    with open(file_path, 'rb') as file:
        file_content = file.read()
dotenv.load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")

client = Mistral(api_key=api_key)

def ocr_function():
    try:
        user_input = file_content

        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            input=user_input,
            document={
                "type": "file",
                "filename": os.path.basename(file_path),
                "content": file_content
            }

        )