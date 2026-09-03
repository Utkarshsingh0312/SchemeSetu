import os
from PIL import Image, ImageDraw, ImageFont

public_dir = r'C:\Users\Lenovo\.gemini\antigravity\scratch\schemesetu\frontend\public'
os.makedirs(public_dir, exist_ok=True)

def generate_logo(size):
    scale = 4
    canvas_size = size * scale
    img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    padding = canvas_size * 0.04
    cx, cy = canvas_size / 2, canvas_size / 2
    r = (canvas_size - 2 * padding) / 2
    
    # 1. Fill background circle (#FBF8F1)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#FBF8F1', outline='#16213C', width=int(canvas_size * 0.04))
    
    # 2. Inner accent ring (#B7975A)
    r_inner = r - int(canvas_size * 0.03)
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=None, outline='#B7975A', width=int(canvas_size * 0.02))
    
    # 3. Draw Serif 'S'
    font_size = int(canvas_size * 0.52)
    font = None
    font_paths = [
        'C:/Windows/Fonts/georgiab.ttf',
        'C:/Windows/Fonts/georgia.ttf',
        'C:/Windows/Fonts/timesbd.ttf',
        'C:/Windows/Fonts/times.ttf'
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, font_size)
                break
            except Exception:
                pass
    if not font:
        font = ImageFont.load_default()
        
    text = 'S'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    tx = cx - tw / 2 - bbox[0]
    ty = cy - th / 2 - bbox[1] - (canvas_size * 0.02)
    
    draw.text((tx, ty), text, fill='#16213C', font=font)
    
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img

sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'favicon-48x48.png': 48,
    'apple-touch-icon.png': 180,
    'icon-192.png': 192,
    'icon-512.png': 512,
}

for name, sz in sizes.items():
    im = generate_logo(sz)
    path = os.path.join(public_dir, name)
    im.save(path, format='PNG')
    print(f'Generated {name} ({sz}x{sz})')

ico_path = os.path.join(public_dir, 'favicon.ico')
img_512 = generate_logo(512)
img_512.save(
    ico_path,
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)
print('Generated favicon.ico')

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <circle cx="256" cy="256" r="240" fill="#FBF8F1" stroke="#16213C" stroke-width="16"/>
  <circle cx="256" cy="256" r="224" fill="none" stroke="#B7975A" stroke-width="8"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#16213C" font-family="'Fraunces', 'Georgia', serif" font-weight="bold" font-size="270">S</text>
</svg>"""

svg_path = os.path.join(public_dir, 'favicon.svg')
with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)
print('Generated favicon.svg')
