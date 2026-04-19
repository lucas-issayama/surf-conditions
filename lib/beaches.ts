export type Beach = {
  id: string;
  name: string;
  town: string;
  lat: number;
  lon: number;
  // Orientation générale de la plage en degrés (direction face au large)
  // 0 = nord, 90 = est, 180 = sud, 270 = ouest
  facing: number;
  description: string;
  image?: string;
};

// Image de secours — image consistante par plage via Picsum.
// Remplacez en passant une URL `image` dans la fiche correspondante.
export function beachImage(beach: Beach): string {
  if (beach.image) return beach.image;
  return `https://picsum.photos/seed/surf-${beach.id}/900/500`;
}

export const BEACHES: Beach[] = [
  {
    id: "trestraou",
    name: "Plage de Trestraou",
    town: "Perros-Guirec",
    lat: 48.8167,
    lon: -3.45,
    facing: 340,
    description: "Spot de référence de la Côte de Granit Rose, exposé aux houles de NNO.",
  },
  {
    id: "tresmeur",
    name: "Plage de Tresmeur",
    town: "Trébeurden",
    lat: 48.7694,
    lon: -3.5806,
    facing: 320,
    description: "Baie abritée, idéale pour débuter quand la houle est formée.",
  },
  {
    id: "tregastel",
    name: "Plage de Coz-Pors",
    town: "Trégastel",
    lat: 48.825,
    lon: -3.5167,
    facing: 350,
    description: "Rochers roses et vagues courtes, fonctionne sur houle franche.",
  },
  {
    id: "bonaparte",
    name: "Plage Bonaparte",
    town: "Plouha",
    lat: 48.6844,
    lon: -2.9633,
    facing: 320,
    description: "Plage de falaises, chargée d'histoire, houle rarement très propre.",
  },
  {
    id: "binic",
    name: "Plage de la Banche",
    town: "Binic",
    lat: 48.6017,
    lon: -2.8253,
    facing: 50,
    description: "Très abritée, fonctionne surtout avec de grosses dépressions.",
  },
  {
    id: "rosaires",
    name: "Plage des Rosaires",
    town: "Plérin",
    lat: 48.5428,
    lon: -2.7817,
    facing: 10,
    description: "Fond de baie de Saint-Brieuc, petites vagues la plupart du temps.",
  },
  {
    id: "pleneuf",
    name: "Plage du Val-André",
    town: "Pléneuf-Val-André",
    lat: 48.5933,
    lon: -2.5467,
    facing: 340,
    description: "Longue plage ouverte, beachbreak sympa sur houle de NO.",
  },
  {
    id: "sablesdor",
    name: "Plage des Sables-d'Or",
    town: "Fréhel",
    lat: 48.6436,
    lon: -2.4339,
    facing: 340,
    description: "Sable fin et beachbreak, bonne option dès qu'il y a un peu de houle.",
  },
  {
    id: "caroual",
    name: "Plage de Caroual",
    town: "Erquy",
    lat: 48.6222,
    lon: -2.4717,
    facing: 320,
    description: "Plage familiale, fonctionne avec une houle bien orientée NO.",
  },
  {
    id: "saintpabu",
    name: "Plage de Saint-Pabu",
    town: "Erquy",
    lat: 48.6336,
    lon: -2.4408,
    facing: 340,
    description: "Long beachbreak de sable, un des spots les plus constants du coin.",
  },
  {
    id: "penguen",
    name: "Plage de Pen Guen",
    town: "Saint-Cast-le-Guildo",
    lat: 48.6244,
    lon: -2.2639,
    facing: 160,
    description: "Orientée plein sud, protégée de la houle dominante de Manche.",
  },
];
