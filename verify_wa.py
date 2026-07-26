import os

base = r"C:\Users\vaira\Downloads\Learn X Community\LearnXCommunity"
files = [
    "index.html", "System_Design.html", "SQL_Databases.html", "Projects_Aptitude.html",
    "Programming_Language.html", "Interview_Preparation.html", "Git_GitHub_Linux.html",
    "Development.html", "Data_Structures_Algorithms.html", "Core_CS.html", "AI_ML_GenAI.html",
]
for f in files:
    t = open(os.path.join(base, f), "rb").read().decode("utf-8", "replace")
    opens = t.count('id="fctaWa"')
    closes_a = t.count("</a>")
    wa_link = "chat.whatsapp.com" in t
    ok = opens >= 1 and wa_link
    print("%-32s fctaWa=%d  </a>=%d  wa_link=%s  %s" % (f, opens, closes_a, wa_link, "OK" if ok else "CHECK"))
