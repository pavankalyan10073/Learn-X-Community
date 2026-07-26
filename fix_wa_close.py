import os

base = r"C:\Users\vaira\Downloads\Learn X Community\LearnXCommunity"
files = [
    "index.html", "System_Design.html", "SQL_Databases.html", "Projects_Aptitude.html",
    "Programming_Language.html", "Interview_Preparation.html", "Git_GitHub_Linux.html",
    "Development.html", "Data_Structures_Algorithms.html", "Core_CS.html", "AI_ML_GenAI.html",
]
open_tag = '<button class="fcta-btn" id="fctaJoin">'
close_wa_crlf = "</button>\r\n" + open_tag
close_wa_lf = "</button>\n" + open_tag
new_crlf = "</a>\r\n" + open_tag
new_lf = "</a>\n" + open_tag

for f in files:
    p = os.path.join(base, f)
    data = open(p, "rb").read().decode("utf-8", "replace")
    data = data.replace(close_wa_crlf, new_crlf).replace(close_wa_lf, new_lf)
    open(p, "wb").write(data.encode("utf-8", "replace"))
    print("fixed", f)
print("DONE")
