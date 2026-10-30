#!/usr/bin/env node
/* Assemblage v2 : images une seule fois via objet ASSETS + hydratation, CSS vars directs. */
const fs = require("fs");
const path = require("path");

const SRC = "/home/z/my-project/site-src";
const OPT = path.join(SRC, "opt");
let t = fs.readFileSync(path.join(SRC, "index.work.html"), "utf8");
const orig = t;

const MAP = {
  ICO_LG: ["lg_64.jpg", "image/jpeg"],
  LG_MED_260: ["lg_med_260.jpg", "image/jpeg"],
  LG_MED_150: ["lg_med_150.jpg", "image/jpeg"],
  LG_INTERIOR: ["lg_interior.jpg", "image/jpeg"],
  TA_LOGO_460: ["ta_logo_460.png", "image/png"],
  TA_LOGO_150: ["ta_logo_150.png", "image/png"],
  TA_LOGO_64: ["ta_logo_64.png", "image/png"],
  LG_HERO_HEADSPA: ["lg_hero_headspa.jpg", "image/jpeg"],
  LG_HERO_GENTLEMAN: ["lg_hero_gentleman.jpg", "image/jpeg"],
  LG_HERO_BRAIDS: ["lg_hero_braids.jpg", "image/jpeg"],
  LG_HERO_PEDICURE: ["lg_hero_pedicure.jpg", "image/jpeg"],
  LG_HERO_MASSAGE: ["lg_hero_massage.jpg", "image/jpeg"],
  LG_HERO_HAMMAM: ["lg_hero_hammam.jpg", "image/jpeg"],
  LG_SVC_COIFFURE: ["lg_svc_coiffure.jpg", "image/jpeg"],
  LG_SVC_BARBER: ["lg_svc_barber.jpg", "image/jpeg"],
  LG_SVC_VISAGE: ["lg_svc_visage.jpg", "image/jpeg"],
  LG_SVC_ONGLERIE: ["lg_svc_onglerie.jpg", "image/jpeg"],
  LG_SVC_HEADSPA: ["lg_svc_headspa.jpg", "image/jpeg"],
  LG_SVC_MASSAGE: ["lg_svc_massage.jpg", "image/jpeg"],
  LG_SVC_DAMP: ["lg_svc_damp.jpg", "image/jpeg"],
  LG_SVC_YOGA: ["lg_svc_yoga.jpg", "image/jpeg"],
  LG_SVC_MAKEUP: ["lg_svc_makeup.jpg", "image/jpeg"],
  LG_SVC_EPILATION: ["lg_svc_epilation.jpg", "image/jpeg"],
  LG_PK_COUPLE: ["lg_pk_couple.jpg", "image/jpeg"],
  LG_PK_ROYAL: ["lg_pk_royal.jpg", "image/jpeg"],
  LG_PK_GENTLEMAN: ["lg_pk_gentleman.jpg", "image/jpeg"],
  LG_PK_ROMANTIC: ["lg_pk_romantic.jpg", "image/jpeg"],
  LG_PK_PARADISE: ["lg_pk_paradise.jpg", "image/jpeg"],
  LG_G_HAMMAM2: ["g_hammam2.jpg", "image/jpeg"],
  LG_G_HAMMAM3: ["g_hammam3.jpg", "image/jpeg"],
  LG_G_VISAGE2: ["g_visage2.jpg", "image/jpeg"],
  LG_G_PEDI2: ["g_pedi2.jpg", "image/jpeg"],
  PR_PINK: ["pr_pink.jpg", "image/jpeg"],
  PR_OUD: ["pr_oud.jpg", "image/jpeg"],
  PR_COLOGNE: ["pr_cologne.jpg", "image/jpeg"],
  PR_WATCH_B: ["pr_watch_b.jpg", "image/jpeg"],
  PR_WATCH_S: ["pr_watch_s.jpg", "image/jpeg"],
  PR_WATCH_G: ["pr_watch_g.jpg", "image/jpeg"],
  PR_SHOES: ["pr_shoes.jpg", "image/jpeg"],
  PR_WALLET: ["pr_wallet.jpg", "image/jpeg"],
  PR_SERUM: ["pr_serum.jpg", "image/jpeg"],
  PR_CREAM: ["pr_cream.jpg", "image/jpeg"],
  PR_SUN: ["pr_sun.jpg", "image/jpeg"],
  PR_CANDLE: ["pr_candle.jpg", "image/jpeg"],
  PR_BUKHOOR: ["pr_bukhoor.jpg", "image/jpeg"],
  PR_ROSE: ["pr_rose.jpg", "image/jpeg"],
  PR_SHOP: ["pr_shop.jpg", "image/jpeg"],
  TA_FOAM: ["ta_foam.jpg", "image/jpeg"],
  TA_INTERIOR: ["ta_interior.jpg", "image/jpeg"],
  TA_MOTO: ["ta_moto.jpg", "image/jpeg"],
  TA_DETAIL2: ["ta_detail2.jpg", "image/jpeg"],
  TA_LINGE: ["ta_linge.jpg", "image/jpeg"],
};

const key = tok => tok.toLowerCase();
const URIS = {};
const missing = [];
for (const [tok, [file, mime]] of Object.entries(MAP)) {
  const p = path.join(OPT, file);
  if (!fs.existsSync(p)) { missing.push(tok); continue; }
  URIS[tok] = `data:${mime};base64,${fs.readFileSync(p).toString("base64")}`;
}
if (missing.length) { console.error("MANQUANTS:", missing.join(",")); process.exit(1); }

/* 1) <img src="{{TOK}}"> → <img data-asset="key"> */
t = t.replace(/src="\{\{([A-Z0-9_]+)\}\}"/g, (m, tok) => {
  if (!URIS[tok]) { throw new Error("token inconnu " + tok); }
  return `data-asset="${key(tok)}" alt-loaded="1"`;
});

/* 1bis) favicon : href="{{ICO_LG}}" → uri direct */
t = t.replace(/href="\{\{([A-Z0-9_]+)\}\}"/g, (m, tok) => `href="${URIS[tok]}"`);

/* 2) styles inline background-image:url('{{TOK}}') [ ,gradient ] → data-bg / data-bgextra */
t = t.replace(/style="background-image:url\('\{\{([A-Z0-9_]+)\}\}'\),linear-gradient\(([^"]+)\)"/g,
  (m, tok, grad) => `data-bg="${key(tok)}" data-bgextra="linear-gradient(${grad})"`);
t = t.replace(/style="background-image:url\('\{\{([A-Z0-9_]+)\}\}'\)"/g,
  (m, tok) => `data-bg="${key(tok)}"`);

/* 3) CSS var url({{TOK}}) (sans quotes) → uri direct */
t = t.replace(/url\(\{\{([A-Z0-9_]+)\}\}\)/g, (m, tok) => "url(" + URIS[tok] + ")");

/* 3bis) ré-injection des 3 visuels Taaru d'origine (hero / tapis / detailing) */
const taOrig = {
  hero: "data:image/jpeg;base64," + fs.readFileSync("/home/z/my-project/taaru-assets/hero.b64", "utf8").trim(),
  tapis: "data:image/jpeg;base64," + fs.readFileSync(`${OPT}/ta_tapis_v2.jpg`).toString("base64"),
  detailing: "data:image/jpeg;base64," + fs.readFileSync("/home/z/my-project/taaru-assets/detailing.b64", "utf8").trim(),
};
const taOrigList = [taOrig.hero, taOrig.tapis, taOrig.detailing];
let b64i = 0;
t = t.replace(/url\(data:B64\)/g, () => "url(" + taOrigList[b64i++] + ")");
if (b64i !== 3) { console.error("data:B64 injectés:", b64i, "(attendu 3)"); process.exit(1); }

/* 4) tableaux JS : i:"{{TOK}}" / img:"{{TOK}}" → clés */
t = t.replace(/i:"\{\{([A-Z0-9_]+)\}\}"/g, (m, tok) => `i:"${key(tok)}"`);
t = t.replace(/img:"\{\{([A-Z0-9_]+)\}\}"/g, (m, tok) => `img:"${key(tok)}"`);

/* 5) résolution ASSETS dans les render JS */
t = t.replace("'<img src=\"' + p.i + '\"", "'<img src=\"' + (ASSETS[p.i] || p.i) + '\"");
t = t.replace("img.src = p.i;", "img.src = ASSETS[p.i] || p.i;");
t = t.replace("'<img src=\"' + g.img + '\"", "'<img src=\"' + (ASSETS[g.img] || g.img) + '\"");

/* 6) script ASSETS + hydratation, juste avant le script principal */
const assetsEntries = Object.entries(URIS).map(([k, u]) => `"${key(k)}":"${u}"`).join(",");
const assetScript = `<script>
/* ASSETS — chaque image embarquée une seule fois (fichier 100% autonome) */
const ASSETS={${assetsEntries}};
(function(){
  function hydrate(){
    document.querySelectorAll("[data-asset]").forEach(function(el){
      var u = ASSETS[el.getAttribute("data-asset")];
      if (u){ el.src = u; }
    });
    document.querySelectorAll("[data-bg]").forEach(function(el){
      var u = ASSETS[el.getAttribute("data-bg")];
      if (u){
        var extra = el.getAttribute("data-bgextra");
        el.style.backgroundImage = "url(" + u + ")" + (extra ? "," + extra : "");
      }
    });
  }
  if (document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", hydrate); }
  else { hydrate(); }
})();
</script>
<script>
/* ═══════════════════════════════════════════════════════════════
   LADIES & GENTLEMEN × TAARU AUTO — Moteur "Deux Univers"`;
t = t.replace(`<script>
/* ═══════════════════════════════════════════════════════════════
   LADIES & GENTLEMEN × TAARU AUTO — Moteur "Deux Univers"`, assetScript);

/* 7) contrôles */
const leftover = t.match(/\{\{[A-Z0-9_]+\}\}/g);
if (leftover) { console.error("TOKENS RESTANTS:", [...new Set(leftover)].join(",")); process.exit(1); }
if (t === orig) { console.error("AUCUN CHANGEMENT"); process.exit(1); }
const b64left = (t.match(/data:B64/g) || []).length;
console.log("marqueurs data:B64 restants (attendu 0):", b64left);

fs.writeFileSync("/home/z/my-project/public/index.html", t);
fs.writeFileSync("/home/z/my-project/taaru-assets/INDEX-FINAL-NETLIFY.html", t);
console.log("ÉCRIT public/index.html :", (t.length / 1024 / 1024).toFixed(2), "MB");
