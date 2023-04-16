# PortaleArgo API

`portaleargo-api` è un modulo Node.js che fornisce un'interfaccia per interagire con il registro elettronico Argo.

## Installazione

Per installare il pacchetto, eseguire il comando:

```sh
npm install portaleargo-api
```

**Nota: Node.js v18 è raccomandato. Non garantiamo stabilità per le versioni inferiori.**

**Nota: Al momento non abbiamo ancora pubblicato il progetto su npm. Se volete già provarlo potete installarlo tramite `npm i dtrombett/portaleargo-api`**

## Utilizzo

Per utilizzare il pacchetto, importare la classe `Client` e istanziarla passando i seguenti parametri:

- `schoolCode`: il codice della scuola. Se non fornito, verrà utilizzato il valore della variabile d'ambiente `CODICE_SCUOLA`.
- `username`: il nome utente per accedere al registro elettronico. Se non fornito, verrà utilizzato il valore della variabile d'ambiente `NOME_UTENTE`.
- `password`: la password per accedere al registro elettronico. Se non fornito, verrà utilizzato il valore della variabile d'ambiente `PASSWORD`.

Esempio di utilizzo:

```js
import { Client } from "portaleargo-api";

const client = new Client({
	schoolCode: "SS13325",
	username: "dtrombett",
	password: "password123",
});

// Effettua il login
await client.login();
// `client.dashboard` contiene la maggior parte dei dati di cui hai bisogno
console.log(client.dashboard.voti);
// Per altri dati potrebbe essere necessaria una nuova richiesta
const dettagliProfilo = await client.getDettagliProfilo();

console.log(dettagliProfilo.genitore.email);
```

## TypeScript

La libreria è scritta interamente in TypeScript, quindi contiene supporti per i tipi.

Alcuni tipi di campi restituiti dall'API contengono `any` in quanto nei nostri test contenevano dati incompleti o mancanti perciò non possiamo stabilire con certezza quale sia il loro tipo.
Se notate che nel vostro profilo tali dati sono invece presenti vi invitiamo gentilmente ad aprire un issue o una pull request.

## Come contribuire

A seguito dei nostri test, abbiamo aggiunto il supporto per tutti gli endpoint che siamo riusciti a trovare.
Se pensi di aver trovato un altro endpoint, o alcuni dati visibili nell'app non sono presenti tramite alcun metodo, sentiti libero di aprire un issue su GitHub.

Puoi aprire un issue anche se pensi di aver trovato un bug nella libreria o hai qualsiasi dubbio, domanda o suggerimento.
