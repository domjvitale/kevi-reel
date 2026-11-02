# Programmazione reel KEVI su Meta Business Suite

Account: kevi_coaching. Meta Business Suite: asset_id=1348956621641998, business_id=2917493788616857.
Browser: built-in browser dell'app Claude sul Mac di Domenico (già loggato). Limite Meta: un reel programmato deve uscire tra 20 minuti e 29 giorni dalla creazione.

## Ogni esecuzione
1. Leggi calendario.json. Apri https://business.facebook.com/latest/posts/scheduled_posts?asset_id=1348956621641998&business_id=2917493788616857 e confronta con le caption: aggiorna status (scheduled) di quelli già presenti, niente duplicati.
2. Per ogni voce status=todo con data entro 28 giorni da oggi, in ordine:
   - Apri https://business.facebook.com/latest/reels_composer/?asset_id=1348956621641998&business_id=2917493788616857
   - javascript_tool: definisci window.__getVideo (iframe nascosto https://raw.githack.com/domjvitale/kevi-reel/main/relay.html, postMessage {id,url} con url raw.githubusercontent.com/domjvitale/kevi-reel/main/<file>, risposta {id,ok,blob}); window.__ep = await __getVideo(file); patch di HTMLInputElement.prototype.click che, per input type=file, mette window.__ep in this.files (DataTransfer) e lancia input+change invece di aprire la finestra. (La CSP di Facebook blocca fetch diretti, l'iframe relay sì.)
   - Click sul textbox "Describe your reel", type della caption esatta.
   - Click "Add Video" (iniezione), attendi upload 100%.
   - Next, Next, opzione "Schedule". Data: click sul campo data, digita M/D/YYYY nel textbox mm/dd/yyyy e clicca il giorno nel calendario. Ora: click sul segmento ore, ArrowUp/Down fino a 06, ArrowRight, minuti fino a 30, PM. Verifica con zoom.
   - Click "Schedule". Attendi che la pagina torni alla lista programmati (10-20 s) e che il reel compaia (ricarica) PRIMA di aprire il prossimo editor.
3. Mai "Share now". Se qualcosa fallisce, salta e segnala.
4. Aggiorna calendario.json (status) con commit e push.
