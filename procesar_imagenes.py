import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Error: La librería Pillow no está instalada.")
    print("Por favor, instálala ejecutando: pip install Pillow")
    sys.exit(1)

def optimizar_imagen(ruta_origen, ruta_destino, ancho_maximo=1200, calidad=85):
    try:
        with Image.open(ruta_origen) as img:
            # Convertir a RGB por si tiene canal Alpha (transparencia) o es paleta
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Redimensionar si es más grande que el ancho_maximo, manteniendo proporción
            if img.width > ancho_maximo:
                ratio = ancho_maximo / float(img.width)
                alto_nuevo = int((float(img.height) * float(ratio)))
                img = img.resize((ancho_maximo, alto_nuevo), Image.Resampling.LANCZOS)
            
            # Guardar como WebP
            img.save(ruta_destino, "webp", quality=calidad, optimize=True)
            print(f"✅ Guardada: {ruta_destino}")
            
    except Exception as e:
        print(f"❌ Error al procesar {ruta_origen}: {e}")

def main():
    directorio_origen = "./imagenes_seleccionadas"
    directorio_destino = "./assets/img/gallery"
    
    # Crear directorios si no existen
    os.makedirs(directorio_origen, exist_ok=True)
    os.makedirs(directorio_destino, exist_ok=True)
    
    # Lista de nombres deseados basados en el orden/contenido analizado
    # (Para automatizar renombrado tendrías que mapear manualmente o 
    # simplemente el script convertirá lo que haya con su nombre actual a .webp)
    print("Iniciando optimización de imágenes...")
    print(f"Coloca tus fotos originales (jpg, png) en la carpeta: {directorio_origen}")
    
    archivos = [f for f in os.listdir(directorio_origen) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    if not archivos:
        print(f"No se encontraron imágenes en '{directorio_origen}'.")
        print(f"1. Por favor, copia las imágenes originales en esa carpeta.")
        print(f"2. Ejecuta este script de nuevo: python procesar_imagenes.py")
        return

    for archivo in archivos:
        ruta_origen = os.path.join(directorio_origen, archivo)
        nombre_sin_ext = os.path.splitext(archivo)[0]
        # Normalizar el nombre (pasar a minúsculas y cambiar espacios por guiones)
        nombre_normalizado = nombre_sin_ext.lower().replace(" ", "-").replace("_", "-")
        ruta_destino = os.path.join(directorio_destino, f"{nombre_normalizado}.webp")
        
        optimizar_imagen(ruta_origen, ruta_destino)
        
    print("\n¡Proceso finalizado! Revisa la carpeta assets/img/gallery")

if __name__ == "__main__":
    main()
