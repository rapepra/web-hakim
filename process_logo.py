from PIL import Image
import sys

def remove_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is close to white/off-white (R, G, B > 200)
        if item[0] > 180 and item[1] > 180 and item[2] > 180:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            # Keep original, or make it pure black for a sharper logo
            # For brutalism, let's make it dark charcoal
            new_data.append((30, 30, 30, 255))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_background("/Users/raul/.gemini/antigravity-ide/brain/3c894b64-b32d-4d1b-b1e5-981a924201c8/elegant3_logo_brutalist_1_1784033503350.png", "assets/img/logo-clean.png")
