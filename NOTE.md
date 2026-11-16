# Trial reel — stato (16/11/2026)

## Fatto
- Account sviluppatore Meta (email contatto kevistudiosbari@gmail.com).
- App Meta **KEVI Trial Reels** (ID 29091063537251725), caso d'uso Instagram con Facebook Login, permessi `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management` concessi.
- Secret GitHub `IG_USER_ID` = ID di kevi_coaching (17841430728034029).
- `scripts/publish-trial.mjs` + `.github/workflows/trial-reel.yml` (18:29 ogni giorno, 3 reel, `graduation_strategy=SS_PERFORMANCE` → Instagram li rende pubblici da solo se vanno bene).

## Bloccato
Meta ha messo l'account in **restrizione temporanea** ("Ti è temporaneamente impedito di eseguire questa azione") dopo tante modifiche in poco tempo.
kevi_coaching **non è collegato a nessuna Pagina Facebook**, quindi l'API non lo vede ancora.
Finché manca il secret `IG_TOKEN` il workflow fallisce subito senza pubblicare niente.

## Cosa fare (fra 24-48 ore, quando la restrizione scade)
1. App Instagram → kevi_coaching → Modifica profilo → Facebook → Collega → Domenico Vitale → crea/scegli la Pagina → Collega.
2. Dire a Claude "fatto": rigenera il token (Graph API Explorer → Generate Access Token, clic tuo), lo rende permanente (token Pagina), salva `IG_TOKEN`, lancia 1 reel di test.
3. Poi disattivare l'attività Claude "KEVI reel Instagram — programmazione settimanale" (programma reel normali: va in conflitto).
