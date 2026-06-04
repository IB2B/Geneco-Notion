import "server-only";

// Static map: form schema name → Notion "Consulente" DB page ID.
// Generated 2026-05-31 from DB 52462bde-349d-4fa4-ab6e-496d587455a6.
// Names not present in Consulente DB are intentionally omitted; lookup() returns null
// and the adapter falls back to writing the name into the notes field.
//
// To regenerate after the Consulente DB changes:
//   node scripts/discovery/sync-commerciali.mjs
const COMMERCIALE_TO_PAGE_ID: Record<string, string> = {
  "Petteni Diego": "29a76cd0-4b67-81fb-9798-fa210c7376a9",
  "Bazzo Davide": "31b76cd0-4b67-81c7-8475-de024df3d8d5",
  "Colombo Barbara": "31b76cd0-4b67-81b7-abb9-df80bec97b07",
  "Contini Andrea": "31b76cd0-4b67-8195-b888-f88412ef02e4",
  "Dedè Ruggero": "31b76cd0-4b67-8187-b57f-e91ab8eb6da7",
  "Dell'Oro Giancarlo": "31b76cd0-4b67-819c-9875-de77136dee87",
  "Emar srl": "31b76cd0-4b67-8160-b4b0-d7c33d7f257f",
  "Gervasoni Michele": "31b76cd0-4b67-81b7-b3df-dfa8353be52c",
  "Latella Fabio": "31b76cd0-4b67-8151-97f9-db984becb932",
  "Lezzi Christian": "31b76cd0-4b67-8120-a0b9-cdaf32c5b6a1",
  "Magnani Massimo": "31b76cd0-4b67-818d-84ed-f5b3814af29b",
  "Morabito Karim": "31b76cd0-4b67-819c-9ec8-e8a8891dc709",
  "Noè Alberto": "31b76cd0-4b67-8133-b4e3-f0d7f7a99c11",
  "Pinato Fabio": "31b76cd0-4b67-815d-a549-f97024eef81e",
  "Podetti Luca": "31b76cd0-4b67-8102-973b-d664b5263e2f",
  "Ramponi Marco": "31b76cd0-4b67-81ae-9234-c6d8cb670d4f",
  "Ravaioli Claudio": "31b76cd0-4b67-8164-843e-fc0b2b03739e",
  "Rossi Marco": "31b76cd0-4b67-8181-8746-fc4df421a1e0",
  "Olivieri Rodolfo": "28576cd0-4b67-818a-9c94-e3d17560079c",
  "Kreslikova Zuzana": "23876cd0-4b67-8162-9cf5-d0f1fb4b8a8d",
  "Vivaldo Giorgia": "20f76cd0-4b67-816c-b4a5-d6136d8735a7",
  "Launova Andrea": "1fc76cd0-4b67-81c5-8056-f39c3e523055",
  "Colla Stefano": "1ea76cd0-4b67-8181-b773-fe29962b7351",
  "Carraro Ferruccio": "1ea76cd0-4b67-81ef-bc4c-f6bb94ad23f9",
  "Menescalchi Maurizio Massimo": "1ea76cd0-4b67-8120-bb18-f1f71453db73",
  "Luise Diego": "1ea76cd0-4b67-81b3-9a70-ec5bdaa981b8",
  "Covato Manuel": "c2865cc6-accc-4d03-996d-bcee868afa22",
  "Cifarelli Tonino": "e832a842-cb7f-48db-9e65-82b85e50f054",
  "Crestanello Andrea": "786c8344-2177-497c-9383-631bb56313ab",
  "Del Sordo Corrado": "1ba82c71-f3fb-4b2a-b821-ce22862de125",
  "Frigerio Giordano": "fe567510-f603-4c4e-844c-4a54955c3a8f",
  "Delle Donne Sagar": "12676cd0-4b67-81f6-84e8-db41954a86ba",
  "Oggianu Mario (mirko leone)": "077b845e-5596-4ed4-86d4-0526b5e1dd82",
  "Piscitelli Domenico": "d0bd471f-38fa-40c8-aa24-555c68e04f59",
  "Rebosio Mauro": "34c76cd0-4b67-80f6-a3c1-e0878605d054",
  "Rosso Diego": "c3a1325c-9242-4246-aafd-6ff0e8c5f44b",
  "Sguaitzer Nicola": "8ad8eaf2-02a7-454b-b939-8c97cbd80846",
  "Tuzza Erik": "b785d342-b296-45e0-865f-39bc6ea6c070",
  "Gregori Cristina": "a72611dc-92d4-4bd6-94d5-17846cd05459",
  "Zani Giovanni": "c3c2af5c-d5ad-4c94-8dd4-c341452c2a83",
  "Lucini Maurizio": "525122b0-520a-4e58-ba4e-a0b18da4340e",
  "Direzionale": "1f976cd0-4b67-80fa-b7c7-d22e0b32e6f8",
  "Tuffanelli Daniele": "10376cd0-4b67-802a-b06d-dc65e4ba197f",
  "Daniele Tuffanelli": "10376cd0-4b67-802a-b06d-dc65e4ba197f",
  "Cannizzaro Alessio": "056924d8-3388-4242-a08a-e92ea5fe086b",
  "Gadda Felice": "3389619e-0019-45d0-b615-2b9b1039bb37",
  "Papeo Stefano": "10d76cd0-4b67-811f-bea8-d1d12be686e1",
  "Risi Pieritalo": "2fc76cd0-4b67-8146-bf90-c689529b0d3f",
  "Colombo Luca": "30676cd0-4b67-81d2-8a86-d0abb30bc0b7",
  "Moles Chiara": "35e76cd0-4b67-808e-a1e3-c27f8206909b",
  "Spatafora Martina": "35f76cd0-4b67-8032-9e08-c88639b8dc1f",
  "Mormandi Leonardo": "36476cd0-4b67-80fc-8705-d7ca8c9d15b4",
  "Christian La Porta": "32676cd0-4b67-8055-94d3-dc5056764517",
  "Malagutti Gabriele": "e5e2b8d4-7353-4288-97eb-9839795b6965",
  "Gabriele Malagutti": "e5e2b8d4-7353-4288-97eb-9839795b6965",
  "Cornolti Fabrizio": "10c76cd0-4b67-804a-8ba4-ec998f20f0c1",
};

// Names that appear in form dropdowns but have no matching record in Consulente DB.
// When the user picks one of these, the relation stays empty and the name is written
// into the notes field. Document here so future runs of the sync script know which
// entries are intentional gaps vs newly missing.
export const UNMAPPED_COMMERCIALI: ReadonlyArray<string> = [
  "Buscemi Marco",
  "Penno Ivo",
  "Zurma Daniele",
  "Carpanelli Alberto",
  "Encore di Nolfi Massimo",
  "Raeli Davide",
  "Diliddo Fabio",
  "Luigi Littamè",
  "Iemma Riccardo Umberto",
  "Merlini Giuseppe",
  "Reverberi Luca",
  "Perregrini Pamela",
  "Rosso Niccolò",
];

export function lookupCommercialeId(name: string | undefined | null): string | null {
  if (!name) return null;
  return COMMERCIALE_TO_PAGE_ID[name] ?? null;
}
