#!/usr/bin/env python3
# Recompression agressive → WebP (chargement quasi instantané, même en 3G Sénégal)
# - opt/*.jpg|png  → opt-webp/<stem>.webp  (dimensions plafonnées par famille)
# - taaru hero/detailing b64 → webp b64-ready binaries
import os, base64, io
from PIL import Image, ImageEnhance

SRC = "/home/z/my-project/site-src"
OPT = os.path.join(SRC, "opt")
OUT = os.path.join(SRC, "opt-webp")
TAU = "/home/z/my-project/taaru-assets"
os.makedirs(OUT, exist_ok=True)

# familles → (max_dim, qualité)
def fam(stem):
    if stem.startswith(("lg_hero_",)):                         return (1080, 68)  # slider plein écran
    if stem.startswith(("sl_", "ps_")):                        return (1000, 68)  # posters/cards galerie
    if stem.startswith(("lg_flyer_",)):                        return (940, 72)   # flyers vus en modal
    if stem.startswith(("ta_logo", "lg_64", "lg_med")):        return (9999, 86)  # logos nets
    if stem.startswith(("prd_", "gal_", "g_", "p1_")):         return (640, 64)   # grille cartes
    if stem.startswith(("ta_",)):                              return (920, 68)   # taaru visuels
    return (820, 66)

total_in, total_out = 0, 0
files = sorted(f for f in os.listdir(OPT) if f.lower().endswith((".jpg", ".jpeg", ".png")))
report = []
for f in files:
    stem = f.rsplit(".", 1)[0].lower()
    src = os.path.join(OPT, f)
    dst = os.path.join(OUT, stem + ".webp")
    try:
        im = Image.open(src)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        if im.mode == "RGBA" and stem.startswith("lg_"):  # logos LG sont jpg → rgb
            im = im.convert("RGB")
        md, q = fam(stem)
        w, h = im.size
        if max(w, h) > md:
            r = md / max(w, h)
            im = im.resize((max(1, int(w * r)), max(1, int(h * r))), Image.LANCZOS)
        kw = dict(quality=q, method=6)
        if im.mode == "RGBA":
            pass  # webp garde l'alpha
        else:
            kw["optimize"] = True
        im.save(dst, "WEBP", **kw)
        i, o = os.path.getsize(src), os.path.getsize(dst)
        total_in += i; total_out += o
        report.append((f, i // 1024, o // 1024))
    except Exception as e:
        print("ERR", f, e)

# Taaru hero + detailing (base64 jpeg d'origine → webp)
for name, maxdim, q in [("hero", 1400, 72), ("detailing", 1000, 70)]:
    b64p = os.path.join(TAU, name + ".b64")
    raw = base64.b64decode(open(b64p).read().strip())
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = im.size
    if max(w, h) > maxdim:
        r = maxdim / max(w, h)
        im = im.resize((int(w * r), int(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=q, method=6)
    open(os.path.join(TAU, name + ".webp"), "wb").write(buf.getvalue())
    total_in += len(raw); total_out += buf.getbuffer().nbytes
    report.append((name + ".b64", len(raw) // 1024, buf.getbuffer().nbytes // 1024))

# tapis v2 est dans opt/ déjà couvert ci-dessus (ta_tapis_v2)
for f, i, o in report:
    if i > 90: print(f"  {f:44s} {i:5d} KB → {o:5d} KB  ({100-100*o/max(i,1):.0f}% −)")
print(f"\nTOTAL: {total_in/1024/1024:.2f} MB → {total_out/1024/1024:.2f} MB  ({100-100*total_out/total_in:.0f}% de réduction)")
