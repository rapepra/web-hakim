import os
import glob

html_files = glob.glob("*.html")

old_header_logo = """      <a href="index.html" class="logo" aria-label="Reforma Elegant3 – Inicio">
        <span class="logo-icon" aria-hidden="true">🔨</span>
        <span class="logo-text">Reforma <strong>Elegant3</strong></span>
      </a>"""

new_header_logo = """      <a href="index.html" class="logo" aria-label="Reforma Elegant3 – Inicio">
        <img src="assets/img/logo-horizontal.svg" alt="Reforma Elegant3 Logo" style="height: 55px;">
      </a>"""

old_footer_logo = """        <a href="index.html" class="logo footer-logo"><span class="logo-icon">🔨</span><span class="logo-text">Reforma <strong>Elegant3</strong></span></a>"""
old_footer_logo_alt = """        <a href="index.html" class="logo footer-logo" aria-label="Reforma Elegant3">
          <span class="logo-icon" aria-hidden="true">🔨</span>
          <span class="logo-text">Reforma <strong>Elegant3</strong></span>
        </a>"""

new_footer_logo = """        <a href="index.html" class="logo footer-logo">
          <img src="assets/img/logo-horizontal.svg" alt="Reforma Elegant3 Logo" style="height: 55px; filter: invert(1);">
        </a>"""

for file_path in html_files:
    if file_path == "index.html":
        continue # Already updated
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace(old_header_logo, new_header_logo)
    content = content.replace(old_footer_logo, new_footer_logo)
    content = content.replace(old_footer_logo_alt, new_footer_logo)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Updated all HTML files.")
