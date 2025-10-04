import cv2
import json
import os

#esto esta en hardcoding, tenemos que ver bien que onda
PACIENTE_ID = 2
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # carpeta donde está este script
PUBLIC_DIR = os.path.join(BASE_DIR, "..", "public")    # ../public
JSON_PATH = os.path.join(PUBLIC_DIR, "data", "pacientes.json")
OUTPUT_FOLDER = os.path.join(PUBLIC_DIR, "videos")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

#esto lee el json pero mas adelante lo sacamos
with open(JSON_PATH, "r", encoding="utf-8") as f:
    pacientes = json.load(f)

# --- Buscar paciente ---
paciente = next((p for p in pacientes if p["id"] == PACIENTE_ID), None)
if not paciente:
    print(f"No se encontró paciente con id={PACIENTE_ID}")
    exit()

# iamgenes y fechas de las consultas
imagenes = []
fechas = []

for tratamiento in paciente.get("tratamientos", []):
    for consulta in tratamiento.get("consultas", []):
        img_rel_path = consulta["imagen"].lstrip("/") 
        img_path = os.path.join(PUBLIC_DIR, img_rel_path.replace("/", os.sep))
        if os.path.exists(img_path):
            imagenes.append(img_path)
            fechas.append(consulta["fecha"])
        else:
            print(f"⚠ Imagen no encontrada: {img_path}")

if not imagenes:
    print("No se encontraron imágenes válidas.")
    exit()

# configuraion default, no se si hay que tocar algo aca, vi que todos hacen lo mismo
first_frame = cv2.imread(imagenes[0])
height, width, _ = first_frame.shape
fps = 1
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
video_path = os.path.join(OUTPUT_FOLDER, f"paciente_{PACIENTE_ID}.mp4")
out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))

#ENUMERARLAS
font = cv2.FONT_HERSHEY_SIMPLEX
for i, img_path in enumerate(imagenes):
    frame = cv2.imread(img_path)
    if frame is None:
        print(f"No se pudo leer {img_path}")
        continue
    # Redimensionar al tamaño de la primera foto   ESTO SI O SI TIENE QUE ESTAR, SI NO, VA A MOSTRAR SOLO LA PRIMERA IMAGEN EN CASO DE QUE NO SEAN DE IGUAL TAMAÑO!!!!!!!!!
    frame = cv2.resize(frame, (width, height))
    # Poner la fecha abajo a la izquierda en amarillo
    cv2.putText(frame, f"Fecha: {fechas[i]}", (20, height - 20), font, 0.8, (0, 255, 255), 2, cv2.LINE_AA)
    out.write(frame)

