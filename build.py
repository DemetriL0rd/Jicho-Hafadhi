# Builds index.html from the files in src/.
# Run:  python3 build.py
from pathlib import Path
here = Path(__file__).parent
src = here / "src"
page = (src / "page.html").read_text(encoding="utf-8")
js = "\n".join((src / f).read_text(encoding="utf-8") for f in ["core.js", "salary.js", "wordbank.js", "rules.js"])
body = page.replace("/*CORE*/", js)
wrapper = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
  'body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n</head>\n<body>\n')
(here / "index.html").write_text(wrapper + body + "\n</body>\n</html>\n", encoding="utf-8")
print("Built index.html")
