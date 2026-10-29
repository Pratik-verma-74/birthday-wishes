import os
import math
import random
import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_luxury_qr_card():
    # 1. Generate QR Code with Error Correction H (30% recovery)
    url = "https://birthday-wishes-eta-nine.vercel.app/"
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=11,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # QR with deep purple/navy modules on white background for high scannability & luxury
    qr_img = qr.make_image(fill_color="#18072b", back_color="white").convert("RGBA")
    qr_w, qr_h = qr_img.size

    # Embed Center Badge in QR Code (Birthday Cake)
    badge_size = int(qr_w * 0.22)
    badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
    badge_draw = ImageDraw.Draw(badge)
    
    # White circle base with gold border
    badge_draw.ellipse([2, 2, badge_size - 2, badge_size - 2], fill="#ffffff", outline="#f9d423", width=4)
    badge_draw.ellipse([7, 7, badge_size - 7, badge_size - 7], outline="#ff2a85", width=2)
    
    # Draw cute cake icon or heart in center badge
    # Let's draw a nice cake glyph or heart
    cake_draw = ImageDraw.Draw(badge)
    # Cake tiers
    cx = badge_size // 2
    cy = badge_size // 2
    # Tier bottom
    cake_draw.rectangle([cx - 22, cy + 2, cx + 22, cy + 20], fill="#ff2a85")
    # Tier top
    cake_draw.rectangle([cx - 15, cy - 14, cx + 15, cy + 2], fill="#9b51e0")
    # Candle
    cake_draw.rectangle([cx - 2, cy - 26, cx + 2, cy - 14], fill="#f9d423")
    # Flame
    cake_draw.ellipse([cx - 5, cy - 36, cx + 5, cy - 26], fill="#ff758c")
    cake_draw.ellipse([cx - 3, cy - 34, cx + 3, cy - 28], fill="#ffffff")

    # Paste badge onto center of QR
    badge_pos = ((qr_w - badge_size) // 2, (qr_h - badge_size) // 2)
    qr_img.paste(badge, badge_pos, mask=badge)
    qr_img.save("tanya_qr_code_clean.png", "PNG")

    # 2. CREATE LUXURY POSTER CARD (1080 x 1480 px)
    card_w, card_h = 1080, 1480
    card = Image.new("RGBA", (card_w, card_h), (13, 5, 29, 255))
    draw = ImageDraw.Draw(card)

    # Cosmic Gradient Background
    for y in range(card_h):
        # Vertical gradient from deep violet to midnight to dark violet
        ratio = y / card_h
        r = int(14 + 18 * math.sin(ratio * math.pi))
        g = int(6 + 8 * math.sin(ratio * math.pi))
        b = int(32 + 36 * math.sin(ratio * math.pi))
        draw.line([(0, y), (card_w, y)], fill=(r, g, b, 255))

    # Add Sparkling Stars & Golden Fairy Dust
    random.seed(42)
    for _ in range(160):
        sx = random.randint(30, card_w - 30)
        sy = random.randint(30, card_h - 30)
        s_size = random.choice([1, 2, 2, 3])
        s_color = random.choice([
            (255, 215, 0, 180),
            (255, 255, 255, 200),
            (255, 182, 193, 160),
            (249, 212, 35, 220)
        ])
        draw.ellipse([sx, sy, sx + s_size, sy + s_size], fill=s_color)

    # Elegant Double Gold Border
    margin = 35
    draw.rounded_rectangle(
        [margin, margin, card_w - margin, card_h - margin],
        radius=30,
        outline="#f9d423",
        width=3
    )
    draw.rounded_rectangle(
        [margin + 8, margin + 8, card_w - margin - 8, card_h - margin - 8],
        radius=24,
        outline=(247, 168, 184, 100),
        width=1
    )

    # Load Fonts
    font_dir = "C:/Windows/Fonts/"
    try:
        font_serif_large = ImageFont.truetype(font_dir + "georgiab.ttf", 56)
        font_serif_title = ImageFont.truetype(font_dir + "georgiab.ttf", 64)
        font_sub = ImageFont.truetype(font_dir + "segoeui.ttf", 26)
        font_tag = ImageFont.truetype(font_dir + "segoeuib.ttf", 22)
        font_inst = ImageFont.truetype(font_dir + "segoeuib.ttf", 28)
        font_inst_sub = ImageFont.truetype(font_dir + "segoeui.ttf", 22)
        font_footer = ImageFont.truetype(font_dir + "georgiai.ttf", 26)
        font_sig = ImageFont.truetype(font_dir + "georgiab.ttf", 38)
    except:
        font_serif_large = ImageFont.load_default()
        font_serif_title = font_serif_large
        font_sub = font_serif_large
        font_tag = font_serif_large
        font_inst = font_serif_large
        font_inst_sub = font_serif_large
        font_footer = font_serif_large
        font_sig = font_serif_large

    # Helper function to center text
    def draw_centered_text(text, y, font, color):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        x = (card_w - text_w) // 2
        draw.text((x, y), text, font=font, fill=color)
        return y + (bbox[3] - bbox[1])

    # 1. Header Tag
    curr_y = 90
    draw_centered_text("✨  A VERY SPECIAL SURPRISE  ✨", curr_y, font_tag, "#f7a8b8")

    # 2. Main Title: Happy Birthday Tanya!
    curr_y += 50
    # Soft glow effect for title
    title_text = "Happy Birthday Tanya!"
    bbox = draw.textbbox((0, 0), title_text, font=font_serif_title)
    tx = (card_w - (bbox[2] - bbox[0])) // 2
    # Shadow
    draw.text((tx + 2, curr_y + 2), title_text, font=font_serif_title, fill=(255, 42, 133, 120))
    draw.text((tx, curr_y), title_text, font=font_serif_title, fill="#ffd700")

    # 3. Subtitle: 4 Golden Years
    curr_y += 85
    draw_centered_text("Celebrating 4 Golden Years of Friendship 💫", curr_y, font_sub, "#f3e8ff")

    # 4. QR Code Card Container
    curr_y += 65
    box_padding = 24
    box_w = qr_w + (box_padding * 2)
    box_h = qr_h + (box_padding * 2)
    box_x = (card_w - box_w) // 2
    box_y = curr_y

    # Outer Glow behind QR card
    for g in range(8, 0, -2):
        draw.rounded_rectangle(
            [box_x - g, box_y - g, box_x + box_w + g, box_y + box_h + g],
            radius=28,
            outline=(249, 212, 35, 30)
        )

    # Pure White Card
    draw.rounded_rectangle(
        [box_x, box_y, box_x + box_w, box_y + box_h],
        radius=24,
        fill="#ffffff",
        outline="#f9d423",
        width=4
    )

    # Paste QR Code inside white card
    card.paste(qr_img, (box_x + box_padding, box_y + box_padding), mask=qr_img)

    # 5. Instructions below QR
    curr_y = box_y + box_h + 45
    draw_centered_text("📸 Scan with Phone Camera or Google Lens", curr_y, font_inst, "#ffd700")

    curr_y += 42
    draw_centered_text("Point your camera to unlock Tanya's 3D Birthday Experience ✨", curr_y, font_inst_sub, "#e0d4f0")

    # 6. Decorative Ribbon Line
    curr_y += 55
    cx = card_w // 2
    draw.line([cx - 160, curr_y, cx - 40, curr_y], fill="#f9d423", width=2)
    draw.text((cx - 14, curr_y - 12), "💖", fill="#ff2a85", font=font_sub)
    draw.line([cx + 40, curr_y, cx + 160, curr_y], fill="#f9d423", width=2)

    # 7. Signature & From
    curr_y += 35
    draw_centered_text("Crafted with all my heart & 4 years of pure friendship", curr_y, font_footer, "#c8b4dc")

    curr_y += 45
    draw_centered_text("— With Love, Pratik ❤️", curr_y, font_sig, "#ff758c")

    # Save outputs
    card.save("tanya_birthday_surprise_qr_card.png", "PNG", quality=100)
    print("Luxury QR Poster Card generated successfully!")

if __name__ == "__main__":
    create_luxury_qr_card()
