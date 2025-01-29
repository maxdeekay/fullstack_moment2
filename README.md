<h1>REST API skapat för moment 2 i kursen Fullstack-utveckling (DT193G)</h1>
Detta repository innehåller ett enklare REST API för att sköta lagring och hantering av filmer som användaren sett.
Databasen som används är PostgreSQL och hostas på <a href="https://supabase.com/">https://supabase.com/</a>.

APIet finns publicerat på följande länk: <a href="https://moment2-fulllstack.onrender.com/">https://moment2-fulllstack.onrender.com/</a>.

<h2>Användning</h2>
Nedan följer hur man kan använda sig av APIet:
<br>
<br>
<table>
  <tr>
    <th>Metod</th>
    <th>Ändpunkt</th>
    <th>Beskrivning</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/movies</td>
    <td>Hämta alla filmer</td>
  </tr>  
  <tr>
    <td>GET</td>
    <td>/movies/id</td>
    <td>Hämta film med specifikt ID</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/movies</td>
    <td>Lägga till ny film</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/movies/id</td>
    <td>Uppdatera film med specifikt id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/movies/id</td>
    <td>Ta bort film med specifikt ID</td>
  </tr>
</table>

Filmer tas emot och skickas som JSON-data i följande format:
```json
{
  "name": string,
  "year": int,
  "seen": boolean
}
```
