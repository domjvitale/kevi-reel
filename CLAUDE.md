# KEVI Coaching — Trial reel automatici su Instagram

Leggi tutto questo file prima di iniziare. Lavora in autonomia: Domenico sta per andare a dormire.

## Contesto
- **Account Instagram:** @kevi_coaching. È un account professionale, collegato a Meta Business Suite: asset_id=1348956621641998, business_id=2917493788616857.
- **La serie:** 78 reel educativi in motion graphics (allenamento, nutrizione, integrazione, doping, falsi miti), 30-45 secondi, voce di Domenico. In questo repo ci sono EP01-EP39. EP40-78 sono in produzione e verranno aggiunti qui più avanti.
- **Repo:** `domjvitale/kevi-reel` (pubblico).
  - Video 9:16 a qualità piena (`KEVI_EPnn_<slug>_9x16.mp4`), raggiungibili via `https://raw.githubusercontent.com/domjvitale/kevi-reel/main/<file>`.
  - `calendario.json`: `[{date, time, ep, file, caption, status}]`.
    - `published` = già pubblicato (EP01).
    - `scheduled` = già programmato come reel NORMALE su Meta Business Suite (EP11, 34, 20, 02, 12, 29, 21, fino al 27/11). **Non toccarli.**
    - `todo` = da pubblicare. **Usa solo questi.**
  - `PLAYBOOK.md` e `relay.html` sono del vecchio metodo via browser su Meta Business Suite. Non servono per questo lavoro.
- **Le caption** in `calendario.json` sono definitive: usale esattamente come sono.

## Obiettivo
Ogni giorno pubblicare **1 reel come TRIAL REEL** (reel di prova, visto solo da chi non segue l'account), prendendo il primo `todo` in ordine di calendario. Tutto automatico e senza Mac acceso: GitHub Actions.

Meta Business Suite e instagram.com da browser **non** hanno l'opzione trial (verificato). Restano solo l'app mobile o la **Instagram Graph API** con `trial_params`. Usa l'API.

## Cosa fare

### FASE 1 — subito, mentre Domenico è sveglio (max 10 minuti)
Usa il browser (Claude in Chrome o Playwright con il profilo Chrome di Domenico) e chiedigli SOLO:
- login Meta/Instagram + 2FA;
- accettazione dei termini developers.facebook.com;
- la schermata "Consenti" per kevi_coaching.

Poi:
1. Crea un'app Meta (tipo Business) con il prodotto **Instagram API con Instagram Login**. Aggiungi kevi_coaching come account Instagram.
2. Ottieni un **token long-lived** con i permessi `instagram_business_basic` e `instagram_business_content_publish`, e ricava **IG_USER_ID**.
3. Salva i valori come GitHub Secrets del repo con `gh secret set IG_TOKEN` e `gh secret set IG_USER_ID`, mai in chiaro nel codice o in chat.
4. Scrivi a Domenico "puoi dormire".

### FASE 2 — da solo, senza chiedere niente
1. **Script Node senza dipendenze** (fetch nativo), ad esempio `scripts/publish-trial.mjs`:
   - prende il primo elemento con `status: "todo"`;
   - `POST https://graph.instagram.com/v{ultima}/{IG_USER_ID}/media` con `media_type=REELS`, `video_url`, `caption`, `trial_params={"graduation_strategy":"MANUAL"}`;
   - interroga il container finché `status_code=FINISHED`, con timeout e retry;
   - `POST /{IG_USER_ID}/media_publish` con `creation_id`;
   - aggiorna l'elemento: `status:"trial"`, `media_id`, `published_at`; poi commit e push di `calendario.json`.
2. **Workflow GitHub Actions** `.github/workflows/trial-reel.yml`:
   - `cron: '29 17 * * *'` (18:29 ora italiana in inverno) + `workflow_dispatch`;
   - `permissions: contents: write`.
3. **Rinnovo del token:** workflow mensile che chiama il refresh del token long-lived e aggiorna il secret. Il `GITHUB_TOKEN` non può scrivere secrets: crea un PAT fine-grained o un'alternativa e documentala.
4. **Test:** lancia una volta con `workflow_dispatch` su 1 reel e verifica via API che il media esista e sia trial. Poi lascia attivo il cron.
5. Disattiva l'attività programmata Claude chiamata **"KEVI reel Instagram — programmazione settimanale"**: programmava reel normali su Meta Business Suite e ora va in conflitto. Se non puoi farlo, scrivilo in NOTE.md.
6. Se un passo fallisce: riprova, cerca un'alternativa, e se proprio non va scrivi in **NOTE.md** cosa manca e cosa deve fare Domenico domattina.

## Limiti da sapere (non provare ad aggirarli)
- **Condivisione sul profilo:** l'API non permette di passare un trial reel a "condiviso con tutti". `graduation_strategy: MANUAL` significa che lo si condivide dall'app (Reel → Visualizza insight → Condividi con tutti). Domenico lo farà a mano, uno al giorno.
- **Ritmo:** un trial al giorno, non tutti insieme.
- **Account:** non toccare i reel già pubblicati o programmati su Meta Business Suite.

## Stile
Risposte brevi. Niente refactoring o funzioni extra non richieste.
