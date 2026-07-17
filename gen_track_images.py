import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 800
OUT = r"C:\Users\vaira\Downloads\Learn X Community\LearnXCommunity\images\tracks"
os.makedirs(OUT, exist_ok=True)
FONT = r"C:\Windows\Fonts"

def font(name, size):
    try: return ImageFont.truetype(os.path.join(FONT, name), size)
    except Exception: return ImageFont.load_default()

F_TITLE = font("segoeuib.ttf", 92)
F_SUB   = font("segoeui.ttf", 40)
F_MONO  = font("consolab.ttf", 46)
F_TAG   = font("segoeuib.ttf", 34)

def hx(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))

def vgrad(d, c1, c2):
    for y in range(H):
        t = y/H
        d.line([(0,y),(W,y)], fill=tuple(int(c1[i]+(c2[i]-c1[i])*t) for i in range(3)))

def glow(img, cx, cy, r, col, blur=70, a=90):
    ov = Image.new("RGBA", img.size, (0,0,0,0)); od = ImageDraw.Draw(ov)
    od.ellipse([cx-r,cy-r,cx+r,cy+r], fill=col+(a,)); ov = ov.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(ov)

def draw_person_laptop(d, base_x, base_y, col):
    # laptop
    d.rounded_rectangle([base_x-150, base_y-120, base_x+150, base_y-10], radius=14, fill=(25,28,38), outline=(255,255,255,40), width=4)
    d.rounded_rectangle([base_x-130, base_y-110, base_x+130, base_y-30], radius=8, fill=col+(220,))
    # screen glow text
    d.text((base_x-110, base_y-100), "/> code", font=F_MONO, fill=(255,255,255,230))
    d.rounded_rectangle([base_x-170, base_y-10, base_x+170, base_y+28], radius=10, fill=(40,44,56), outline=(255,255,255,30), width=3)
    # person (head + shoulders)
    hx0, hy0 = base_x+10, base_y-230
    d.ellipse([hx0-46, hy0-46, hx0+46, hy0+46], fill=(240,224,205))           # head
    d.ellipse([hx0-46, hy0-10, hx0+46, hy0+30], fill=(60,70,90))              # hair/neck
    d.rounded_rectangle([hx0-90, hy0+30, hx0+90, hy0+200], radius=60, fill=(col))  # torso
    d.rounded_rectangle([hx0-90, hy0+30, hx0+90, hy0+200], radius=60, outline=(255,255,255,60), width=3)

def badge(d, x, y, text, col):
    w = 60 + len(text)*20
    d.rounded_rectangle([x, y, x+w, y+64], radius=32, fill=col+(200,), outline=(255,255,255,80), width=2)
    d.text((x+28, y+8), text, font=F_TAG, fill=(255,255,255,255))

def make(name, c1, c2, title, subtitle, col, scene_fn):
    img = Image.new("RGBA",(W,H),(0,0,0,255)); d = ImageDraw.Draw(img)
    vgrad(d, hx(c1), hx(c2))
    glow(img, 950, 180, 280, col, 90, 90)
    glow(img, 200, 650, 240, col, 90, 70)
    scene_fn(d, col)
    # darken lower band for text legibility
    band = Image.new("RGBA",(W,H),(8,10,20,0)); bd = ImageDraw.Draw(band)
    bd.rectangle([0, H-210, W, H], fill=(8,10,20,150)); img = Image.alpha_composite(img, band)
    d = ImageDraw.Draw(img)
    d.text((70, H-185), title, font=F_TITLE, fill=(255,255,255,255))
    d.text((74, H-80), subtitle, font=F_SUB, fill=(235,240,255,230))
    img.convert("RGB").save(os.path.join(OUT, name), "PNG")
    print("saved", name)

# 01 Programming
def s1(d, col):
    draw_person_laptop(d, 320, 560, (30,91,255))
    badge(d, 760, 180, "C++", (30,91,255)); badge(d, 880, 260, "Java", (124,92,255)); badge(d, 760, 340, "Python", (245,84,11))
make("programming.png","#0b1f4d","#1E5BFF","PROGRAMMING","C++  •  Java  •  Python",(30,91,255),s1)

# 02 DSA
def s2(d, col):
    draw_person_laptop(d, 320, 560, (245,84,11))
    nodes=[(820,200),(1000,260),(900,420),(760,360),(980,500)]
    for i,a in enumerate(nodes):
        for b in nodes[i+1:]:
            if (i+ sum(a))%2==0: d.line([a,b],fill=(255,200,160,140),width=4)
    for (x,y) in nodes: d.ellipse([x-22,y-22,x+22,y+22],fill=(255,255,255,235),outline=(255,140,60),width=5)
    d.text((760,560),"Arrays → DP",font=F_SUB,fill=(255,225,200,255))
make("dsa.png","#3a1500","#F2540B","DATA STRUCTURES","Arrays to Dynamic Programming",(245,84,11),s2)

# 03 Core CS
def s3(d, col):
    draw_person_laptop(d, 320, 560, (14,165,233))
    items=[("OS",(20,184,166)),("DBMS",(56,189,248)),("CN",(99,102,241)),("OOP",(245,84,11))]
    for i,(t,c) in enumerate(items):
        y=180+i*95
        d.rounded_rectangle([780,y,1080,y+72],radius=14,fill=c+(220,),outline=(255,255,255,70),width=3)
        d.text((800,y+12),t,font=F_TAG,fill=(255,255,255,255))
make("core-cs.png","#062436","#0EA5E9","CORE COMPUTER SCIENCE","DBMS • OS • CN • OOP",(14,165,233),s3)

# 04 Development
def s4(d, col):
    draw_person_laptop(d, 320, 560, (139,92,246))
    d.rounded_rectangle([770,200,1080,330],radius=16,fill=(255,255,255,18),outline=(255,255,255,90),width=4)
    d.text((790,225),"<FRONTEND/>",font=F_MONO,fill=(220,210,255,255))
    d.text((790,285),"<BACKEND/>",font=F_MONO,fill=(200,255,230,255))
make("development.png","#1a1040","#8B5CF6","DEVELOPMENT","Frontend + Backend",(139,92,246),s4)

# 05 System Design
def s5(d, col):
    draw_person_laptop(d, 320, 560, (20,184,166))
    c=[(820,220),(1000,300),(820,400),(1000,480),(910,150)]
    for (x,y) in c: d.ellipse([x-26,y-26,x+26,y+26],fill=(255,255,255,235),outline=(20,184,166),width=6)
    for i in range(1,len(c)): d.line([c[0],c[i]],fill=(180,255,240,150),width=4)
    d.text((780,560),"LLD + HLD",font=F_SUB,fill=(205,255,245,255))
make("system-design.png","#05332f","#14B8A6","SYSTEM DESIGN","LLD + HLD",(20,184,166),s5)

# 06 Git / GitHub / Linux
def s6(d, col):
    draw_person_laptop(d, 320, 560, (245,84,11))
    d.text((770,200),"$ git commit",font=F_MONO,fill=(255,230,210,255))
    d.text((770,270),"$ git push",font=F_MONO,fill=(255,230,210,255))
    d.text((770,340),"$ ls -la",font=F_MONO,fill=(255,230,210,255))
    badge(d, 770, 430, "VERSION CONTROL", (245,84,11))
make("git.png","#2a1000","#F2540B","GIT • GITHUB • LINUX","Version control & CLI",(245,84,11),s6)

# 07 SQL & Databases
def s7(d, col):
    draw_person_laptop(d, 320, 560, (99,102,241))
    cx=920
    for i in range(3):
        y=180+i*140
        d.ellipse([cx-120,y,cx+120,y+72],fill=(255,255,255,235))
        d.rectangle([cx-120,y,cx+120,y+55],fill=(255,255,255,235))
        d.ellipse([cx-120,y+55,cx+120,y+127],fill=(99,102,241,255))
    d.text((770,560),"Queries → Modeling",font=F_SUB,fill=(230,230,255,255))
make("sql.png","#16103a","#6366F1","SQL & DATABASES","Queries to modeling",(99,102,241),s7)

# 08 AI / ML / GenAI
def s8(d, col):
    draw_person_laptop(d, 320, 560, (255,106,26))
    layers=[[(980,200),(980,340),(980,480)],[(840,260),(840,410)],[(700,330)]]
    for L in layers:
        for (x,y) in L: d.ellipse([x-22,y-22,x+22,y+22],fill=(255,255,255,235))
    for i in range(len(layers)-1):
        for a in layers[i]:
            for b in layers[i+1]: d.line([a,b],fill=(255,180,120,110),width=3)
    badge(d, 700, 560, "AGENTIC AI", (255,106,26))
make("ai.png","#2a0f00","#FF6A1A","AI / ML / GENAI","Agentic AI",(255,106,26),s8)

# 09 Projects & Aptitude
def s9(d, col):
    draw_person_laptop(d, 320, 560, (16,185,129))
    checks=["Build real projects","Practice aptitude","Ship & showcase"]
    for i,t in enumerate(checks):
        y=190+i*100
        d.rounded_rectangle([780,y,830,y+50],radius=10,fill=(16,185,129,255),outline=(255,255,255,120),width=3)
        d.line([792,y+25,812,y+45],fill=(255,255,255,255),width=6); d.line([812,y+45,826,y+12],fill=(255,255,255,255),width=6)
        d.text((850,y+4),t,font=F_SUB,fill=(225,255,240,255))
make("projects.png","#062a20","#10B981","PROJECTS & APTITUDE","Build & practice",(16,185,129),s9)

# 10 Interview Prep
def s10(d, col):
    draw_person_laptop(d, 320, 560, (255,106,26))
    d.rounded_rectangle([780,200,1080,330],radius=20,fill=(255,255,255,18),outline=(255,255,255,90),width=4)
    d.text((800,225),"Resume",font=F_SUB,fill=(255,230,210,255))
    d.text((800,285),"LinkedIn",font=F_SUB,fill=(255,230,210,255))
    badge(d, 780, 380, "MOCK INTERVIEWS", (255,106,26))
make("interview.png","#2a1000","#FF6A1A","INTERVIEW PREP","Resume • LinkedIn",(255,106,26),s10)

print("ALL DONE")
