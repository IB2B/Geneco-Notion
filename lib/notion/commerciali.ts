import "server-only";

// Static maps: form schema name → Notion identifiers.
// Generated 2026-05-31 from the "Consulente" database (52462bde-...).
// Two separate IDs per commercial:
//   - consulenteId: page ID in the Consulente DB (used by `Commerciale di riferimento` relation)
//   - userId: Notion workspace user ID (used by `Account Commerciale` people field that
//             the per-commercial filtered views actually check)
//
// Re-generate after the Consulente DB changes:
//   node scripts/discovery/sync-commerciali.mjs
const CONSULENTE_PAGE_ID: Record<string, string> = {
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
  "Malagutti Gabriele": "e5e2b8d4-7353-4288-97eb-9839795b6965",
  "Gabriele Malagutti": "e5e2b8d4-7353-4288-97eb-9839795b6965",
  "Cornolti Fabrizio": "10c76cd0-4b67-804a-8ba4-ec998f20f0c1",
};

const NOTION_USER_ID: Record<string, string> = {
  "Petteni Diego": "29ad872b-594c-8122-a436-0002ede1fda9",
  "Bazzo Davide": "34ad872b-594c-81ca-9fac-0002fe5bdf6d",
  "Colombo Barbara": "350d872b-594c-8172-8d98-0002803de299",
  "Contini Andrea": "34ad872b-594c-815d-a81d-000254195131",
  "Dedè Ruggero": "34ad872b-594c-81ec-9931-00026d3052d0",
  "Dell'Oro Giancarlo": "34ad872b-594c-814d-8965-00026e5b5475",
  "Emar srl": "350d872b-594c-819a-ad21-0002d38a89ff",
  "Gervasoni Michele": "34ad872b-594c-81e6-ae55-0002f25d8bf9",
  "Latella Fabio": "34ad872b-594c-81d9-b294-0002f8c2fec6",
  "Lezzi Christian": "350d872b-594c-8169-8e57-00025518b577",
  "Magnani Massimo": "350d872b-594c-816a-b27f-0002b4dc0aaf",
  "Morabito Karim": "350d872b-594c-81fe-b3c1-0002f6187ce7",
  "Ramponi Marco": "34ad872b-594c-8109-a60e-00023a1768c8",
  "Ravaioli Claudio": "34ad872b-594c-81b3-82a8-0002ff619f32",
  "Olivieri Rodolfo": "28cd872b-594c-8144-a42d-00028346982c",
  "Vivaldo Giorgia": "214d872b-594c-81e6-bd0a-0002ccda9594",
  "Launova Andrea": "1fcd872b-594c-81c4-ad27-0002e3d1cf68",
  "Colla Stefano": "1ead872b-594c-8119-b371-0002d4ee225f",
  "Carraro Ferruccio": "1ead872b-594c-81ec-b08c-00027aacbf2c",
  "Covato Manuel": "b92d32f5-0be2-46a2-b7c1-01be87adaeee",
  "Cifarelli Tonino": "4eadad75-5d8f-47f7-bcf2-98e10fc985f7",
  "Crestanello Andrea": "bbec292e-7465-4c80-a94d-ece08f74b73a",
  "Del Sordo Corrado": "c8dd340b-00a5-4be3-a71d-c3f5c00563e8",
  "Frigerio Giordano": "7f690c0e-c2ea-4d29-896c-669500a38240",
  "Delle Donne Sagar": "126d872b-594c-81f1-a168-000277f914df",
  "Oggianu Mario (mirko leone)": "a7cfbde7-17a4-4696-9c80-090f4b7e26f5",
  "Piscitelli Domenico": "6b884ab7-1f83-44fc-b951-d33c37113fb1",
  "Rosso Diego": "70b0bc87-6e1a-43d3-941d-59eb3ebf9b7f",
  "Sguaitzer Nicola": "0a86037a-8b0d-40a5-b832-57a4c1d613fa",
  "Tuzza Erik": "d2aa6f56-698d-4605-9c5f-838f7e5e56df",
  "Gregori Cristina": "4d649207-b095-4717-ab16-bdb861fd9135",
  "Zani Giovanni": "f76ee686-e1f4-47ff-981e-031802cfc493",
  "Lucini Maurizio": "8cf881a9-6ad0-4713-b01e-a2a11c3adcc7",
  "Direzionale": "80b6433c-1da4-45f2-96ad-9734057f0bef",
  "Tuffanelli Daniele": "29ebe804-ba3b-4382-9913-b0ea54a0f8e5",
  "Daniele Tuffanelli": "29ebe804-ba3b-4382-9913-b0ea54a0f8e5",
  "Cannizzaro Alessio": "d85f59c2-fe1d-4ab1-81fd-b62c0939acda",
  "Gadda Felice": "ea9846fa-d7f9-42a0-9637-558b1a3f30ac",
  "Papeo Stefano": "10dd872b-594c-81c3-8a5b-0002a34985db",
  "Risi Pieritalo": "2fed872b-594c-8124-9e11-0002dde0de70",
  "Colombo Luca": "307d872b-594c-813a-b263-000274b96017",
  "Moles Chiara": "299d872b-594c-8179-862d-0002b39d0536",
  "Spatafora Martina": "cbcfe57e-7868-4088-bc8c-a7f2ed160bf4",
  "Malagutti Gabriele": "455c4256-aae8-48f2-813d-e484c2ce4006",
  "Gabriele Malagutti": "455c4256-aae8-48f2-813d-e484c2ce4006",
  "Cornolti Fabrizio": "10bd872b-594c-814f-ae3c-0002da746b34",
};

// Form-dropdown names that have no Consulente DB record — relation stays empty,
// adapter falls back to writing the name into the notes field.
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

// Consulente records that exist but have no Notion user account linked in their `Account` field.
// For these names the relation populates but `Account Commerciale` stays empty —
// the per-commercial filtered view will not show those leads until the staff member's
// Notion user is linked in their Consulente record.
export const CONSULENTI_WITHOUT_USER_ACCOUNT: ReadonlyArray<string> = [
  "Mormandi Leonardo",
  "Rebosio Mauro",
  "Rossi Marco",
  "Podetti Luca",
  "Pinato Fabio",
  "Noè Alberto",
  "Kreslikova Zuzana",
  "Menescalchi Maurizio Massimo",
  "Luise Diego",
];

export function lookupCommercialeId(name: string | undefined | null): string | null {
  if (!name) return null;
  return CONSULENTE_PAGE_ID[name] ?? null;
}

export function lookupCommercialeUserId(name: string | undefined | null): string | null {
  if (!name) return null;
  return NOTION_USER_ID[name] ?? null;
}
