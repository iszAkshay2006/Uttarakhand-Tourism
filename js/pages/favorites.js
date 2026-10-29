
const STORAGE_KEY = "uttarakhandSavedPlaces";

const places = [
  {
    name: "Nainital",
    category: "Lake",
    district: "Nainital",
    description: "A beautiful lake town surrounded by green hills.",
    link: "nainital.html"
  },
  {
    name: "Mussoorie",
    category: "Hill Station",
    district: "Dehradun",
    description: "A scenic hill station with mountain views and waterfalls.",
    link: "mussoorie.html"
  },
  {
    name: "Rishikesh",
    category: "Nature",
    district: "Dehradun",
    description: "A spiritual town beside the Ganga, known for yoga and adventure.",
    link: "rishikesh.html"
  },
  {
    name: "Auli",
    category: "Hill Station",
    district: "Chamoli",
    description: "A Himalayan destination known for mountain views and skiing.",
    link: "auli.html"
  },
  {
    name: "Valley of Flowers",
    category: "Nature",
    district: "Chamoli",
    description: "A Himalayan national park famous for seasonal alpine flowers.",
    link: "valley-of-flowers.html"
  },
  {
    name: "Chopta",
    category: "Trekking",
    district: "Rudraprayag",
    description: "A scenic base for Himalayan trekking and alpine meadows.",
    link: "chopta.html"
  },
  {
    name: "Lansdowne",
    category: "Hill Station",
    district: "Pauri Garhwal",
    description: "A quiet hill town surrounded by pine and oak forests.",
    link: "lansdowne.html"
  },
  {
    name: "Chakrata",
    category: "Nature",
    district: "Dehradun",
    description: "A peaceful mountain destination with forests and waterfalls.",
    link: "chakrata.html"
  },
  {
    name: "Pithoragarh",
    category: "Hill Station",
    district: "Pithoragarh",
    description: "A Kumaon hill town with Himalayan views.",
    link: "pithoragarh.html"
  },
  {
    name: "Munsiyari",
    category: "Trekking",
    district: "Pithoragarh",
    description: "A mountain destination known for Panchachuli views.",
    link: "munsiyari.html"
  },
  {
    name: "Bhimtal",
    category: "Lake",
    district: "Nainital",
    description: "A lakeside destination for boating and peaceful nature breaks.",
    link: "bhimtal.html"
  },
  {
    name: "Jageshwar Dham",
    category: "Temple",
    district: "Almora",
    description: "An ancient temple complex surrounded by deodar forests.",
    link: "jageshwar.html"
  },
  {
    name: "Patal Bhuvaneshwar",
    category: "Temple",
    district: "Pithoragarh",
    description: "A revered cave shrine with naturally formed rock structures.",
    link: "patal-bhuvaneshwar.html"
  },
  {
    name: "Abbott Mount",
    category: "Heritage",
    district: "Champawat",
    description: "A quiet hill destination with heritage buildings and forest scenery.",
    link: "abbott-mount.html"
  },
  {
    name: "Hemkund Sahib",
    category: "Temple",
    district: "Chamoli",
    description: "A high-altitude Sikh pilgrimage site beside a glacial lake.",
    link: "hemkund-sahib.html"
  },
  {
    name: "Kausani",
    category: "Hill Station",
    district: "Bageshwar",
    description: "A Kumaon hill station with wide Himalayan panoramas.",
    link: "kausani.html"
  },
  {
    name: "Sattal",
    category: "Lake",
    district: "Nainital",
    description: "Interconnected lakes surrounded by forest and birdlife.",
    link: "sattal.html"
  },
  {
    name: "Naukuchiatal",
    category: "Lake",
    district: "Nainital",
    description: "A peaceful lake destination popular for boating.",
    link: "naukuchiatal.html"
  },
  {
    name: "Dodital",
    category: "Trekking",
    district: "Uttarkashi",
    description: "A Himalayan lake reached by trekking through forests.",
    link: "dodital.html"
  },
  {
    name: "Dayara Bugyal",
    category: "Trekking",
    district: "Uttarkashi",
    description: "A high-altitude meadow with expansive mountain views.",
    link: "dayara-bugyal.html"
  },
  {
    name: "Kedarkantha",
    category: "Trekking",
    district: "Uttarkashi",
    description: "A popular Himalayan trek known for seasonal snow and summit views.",
    link: "kedarkantha.html"
  },
  {
    name: "Har Ki Dun",
    category: "Trekking",
    district: "Uttarkashi",
    description: "A valley trek through mountain villages and alpine landscapes.",
    link: "har-ki-dun.html"
  },
  {
    name: "Tiger Falls",
    category: "Waterfall",
    district: "Dehradun",
    description: "A scenic waterfall near Chakrata.",
    link: "tiger-falls.html"
  },
  {
    name: "Vasudhara Falls",
    category: "Waterfall",
    district: "Chamoli",
    description: "A dramatic waterfall near Badrinath, reached by a mountain route.",
    link: "vasudhara-falls.html"
  },
  {
    name: "Jim Corbett National Park",
    category: "Wildlife",
    district: "Nainital and Pauri Garhwal region",
    description: "A protected landscape known for forests and wildlife.",
    link: "jim-corbett.html"
  },
  {
    name: "Rajaji National Park",
    category: "Wildlife",
    district: "Dehradun, Haridwar and Pauri Garhwal region",
    description: "A protected forest landscape with elephants and diverse wildlife.",
    link: "rajaji-national-park.html"
  },
  {
    name: "Katarmal Sun Temple",
    category: "Temple",
    district: "Almora",
    description: "A historic sun temple known for traditional stone architecture.",
    link: "katarmal-sun-temple.html"
  },
  {
    name: "Baijnath Temple",
    category: "Temple",
    district: "Bageshwar",
    description: "A historic temple complex beside the Gomti River.",
    link: "baijnath-temple.html"
  },
  {
    name: "Kartik Swami Temple",
    category: "Temple",
    district: "Rudraprayag",
    description: "A hilltop shrine reached by a scenic mountain walk.",
    link: "kartik-swami.html"
  },
  {
    name: "Narendra Nagar Palace",
    category: "Heritage",
    district: "Tehri Garhwal",
    description: "A heritage palace site overlooking the Ganga valley region.",
    link: "narendra-nagar-palace.html"
  }
];

const favoritesGrid = document.getElementById("favoritesGrid");
const favoritesCount = document.getElementById("favoritesCount");
const favoritesEmpty = document.getElementById("favoritesEmpty");

function getSavedPlaces() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderFavorites() {
  if (!favoritesGrid) return;

  const savedNames = getSavedPlaces();
  const savedDestinations = places.filter(place =>
    savedNames.includes(place.name)
  );

  if (favoritesCount) {
    favoritesCount.textContent =
      `${savedDestinations.length} saved ${savedDestinations.length === 1 ? "place" : "places"}`;
  }

  if (favoritesEmpty) {
    favoritesEmpty.hidden = savedDestinations.length > 0;
  }

  favoritesGrid.innerHTML = savedDestinations.map(place => `
    <article class="destination-card">
      <div class="destination-content">
        <p class="location">📍 ${escapeHTML(place.district)}</p>
        <h3>${escapeHTML(place.name)}</h3>
        <p>${escapeHTML(place.description)}</p>
        <span class="tag">${escapeHTML(place.category)}</span>

        <div class="destination-actions">
          <a class="button" href="${escapeHTML(place.link)}">
            Explore Details →
          </a>
          <button
            type="button"
            class="remove-favorite"
            data-name="${escapeHTML(place.name)}"
          >
            ♥ Remove
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

if (favoritesGrid) {
  favoritesGrid.addEventListener("click", event => {
    const button = event.target.closest(".remove-favorite");
    if (!button) return;

    const updated = getSavedPlaces().filter(
      name => name !== button.dataset.name
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    renderFavorites();
  });
}

window.addEventListener("storage", renderFavorites);
renderFavorites();
