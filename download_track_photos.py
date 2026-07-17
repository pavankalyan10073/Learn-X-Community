import os, urllib.request
from PIL import Image, ImageDraw

OUT = r"C:\Users\vaira\Downloads\Learn X Community\LearnXCommunity\images\tracks"
os.makedirs(OUT, exist_ok=True)
W, H = 1200, 800

# track -> (unsplash photo id, bottom gradient color for theme cohesion)
MAP = {
    "programming":   ("photo-1542831371-29b0f74f9713", (30, 91, 255)),   # code on screen
    "dsa":           ("photo-1507003211169-0a1dd7228f2d", (245, 84, 11)), # person thinking at laptop
    "core-cs":       ("photo-1522202176988-66273c2fd55f", (14, 165, 233)),# students collaborating
    "development":    ("photo-1498050108023-c5249f4df085", (139, 92, 246)),# dev workspace
    "system-design":  ("photo-1551434678-e076c223a692", (20, 184, 166)),  # team coding whiteboard
    "git":           ("photo-1555066931-4365d14bab8c", (245, 84, 11)),    # code/terminal
    "sql":           ("photo-1544383835-bda2bc66a55d", (99, 102, 241)),   # data analytics
    "ai":            ("photo-1677442136019-21780ecad995", (255, 106, 26)),# AI/neural
    "projects":      ("photo-1522071820081-009f0129c71c", (16, 185, 129)),# team project
    "interview":     ("photo-1573496359142-b8d87734a5a2", (255, 106, 26)),# interview/professional
}

def fetch(pid):
    url = "https://images.unsplash.com/%s?w=1200&q=80&auto=format&fit=crop" % pid
    return urllib.request.urlopen(url, timeout=30).read()

UA = {"User-Agent": "Mozilla/5.0"}

for name, (pid, col) in MAP.items():
    try:
        req = urllib.request.Request("https://images.unsplash.com/%s?w=1200&q=80&auto=format&fit=crop" % pid, headers=UA)
        data = urllib.request.urlopen(req, timeout=30).read()
        im = Image.open(__import__("io").BytesIO(data)).convert("RGB")
        # cover-fit to 1200x800
        iw, ih = im.size
        scale = max(W / iw, H / ih)
        im = im.resize((int(iw * scale), int(ih * scale)), Image.LANCZOS)
        left = (im.width - W) // 2
        top = (im.height - H) // 2
        im = im.crop((left, top, left + W, top + H))
        # subtle bottom gradient scrim for text legibility, tinted with theme color
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(ov)
        for y in range(H):
            a = int(150 * (y / H) ** 2) if y > H * 0.45 else 0
            if a > 0:
                d.line([(0, y), (W, y)], fill=(col[0], col[1], col[2], a))
        im = Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB")
        im.save(os.path.join(OUT, name + ".png"), "PNG", quality=88)
        print("saved", name, im.size)
    except Exception as e:
        print("ERROR", name, repr(e)[:160])

print("DONE")
