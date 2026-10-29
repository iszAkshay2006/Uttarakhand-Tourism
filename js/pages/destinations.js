
/* ==========================================
   UTTARAKHAND EXPLORER
   Firestore + Search + Save Places
========================================== */

import { auth, db } from "../firebase/firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

/* ---------- All 30 destinations ---------- */

const destinations = [
  {
    name: "Nainital",
    category: "Lake",
    district: "Nainital",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTb66XbjlGbSJnGJtfkCyYSzvWiftmtxrK5aOkVFjG4Q&s=10",
    description: "A beautiful lake town surrounded by green hills and Himalayan scenery.",
    attractions: "Naini Lake, Naina Devi Temple, Snow View Point",
    bestTime: "March–June, September–November",
    link: "nainital.html"
  },
  {
    name: "Mussoorie",
    category: "Hill Station",
    district: "Dehradun",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7OANupnfKVzcPRmuy0WRR7e7QbK7jLMtq8ukejxFzCw&s=10",
    description: "A popular hill station known for mountain views, waterfalls and pleasant weather.",
    attractions: "Kempty Falls, Gun Hill, Mall Road",
    bestTime: "March–June, September–November",
    link: "mussoorie.html"
  },
  {
    name: "Rishikesh",
    category: "Nature",
    district: "Dehradun",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo52MQgKk5Qey3krpfV8oWWsNhR-sLwXpLYeGr4skL4A&s=10",
    description: "A spiritual town beside the Ganga, known for yoga and adventure activities.",
    attractions: "Ram Jhula, Lakshman Jhula area, Triveni Ghat",
    bestTime: "February–April, September–November",
    link: "rishikesh.html"
  },
  {
    name: "Auli",
    category: "Hill Station",
    district: "Chamoli",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjkTERz2jVR7_c4QdFsGxpT4N80QuzKe_AC9GdjuKhzg&s=10",
    description: "A Himalayan destination famous for snow views, skiing and mountain panoramas.",
    attractions: "Auli slopes, ropeway area, Gorson Bugyal trail",
    bestTime: "December–March for snow; summer for views",
    link: "auli.html"
  },
  {
    name: "Valley of Flowers",
    category: "Nature",
    district: "Chamoli",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQpFja6SBDCofDkPqT-raiwqpC5l3N42eBKJaJelye-A&s=10",
    description: "A UNESCO-listed Himalayan national park known for seasonal alpine flowers.",
    attractions: "Flower-filled meadows, mountain trails, Pushpawati valley",
    bestTime: "Usually July–September; confirm park opening",
    link: "valley-of-flowers.html"
  },
  {
    name: "Chopta",
    category: "Trekking",
    district: "Rudraprayag",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTathRw-VkvweZwIzWQIRACMnOJYB--hzWNuAa84_ytFQ&s=10",
    description: "A scenic base for alpine meadows, forest walks and Himalayan trekking.",
    attractions: "Tungnath trail, Chandrashila trek, meadows",
    bestTime: "April–June, September–November",
    link: "chopta.html"
  },
  {
    name: "Lansdowne",
    category: "Hill Station",
    district: "Pauri Garhwal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ99ZT2Gg6yg4z0zADsu9T3Y6o-RQV7k4zQH_6xg4YGnw&s=10",
    description: "A quiet hill town surrounded by pine and oak forests.",
    attractions: "Tip-in-Top, Bhulla Tal, St. Mary's Church",
    bestTime: "March–June, September–November",
    link: "lansdowne.html"
  },
  {
    name: "Chakrata",
    category: "Nature",
    district: "Dehradun",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5uHqWfd_UMFHzgp2GTw54_3OBL4_7FxJx7jOHvu5xpA&s=10",
    description: "A peaceful mountain region with forests, viewpoints and waterfalls.",
    attractions: "Tiger Falls, Deoban, Chilmiri Neck",
    bestTime: "March–June, September–November",
    link: "chakrata.html"
  },
  {
    name: "Pithoragarh",
    category: "Hill Station",
    district: "Pithoragarh",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq9A1-pRQk0I62WNaLNJAE_zJMMfMx1vH6f0_KYz_3aw&s=10",
    description: "A Kumaon hill town with mountain views and historic surroundings.",
    attractions: "Pithoragarh Fort, local markets, nearby mountain viewpoints",
    bestTime: "March–June, September–November",
    link: "pithoragarh.html"
  },
  {
    name: "Munsiyari",
    category: "Trekking",
    district: "Pithoragarh",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQofA6-JxijSyQoPqjiWLfRSyTSWwCe_u2ZFprEJ0J6Q&s=10",
    description: "A mountain base known for views of the Panchachuli peaks and trekking routes.",
    attractions: "Panchachuli viewpoints, Khaliya Top, local villages",
    bestTime: "April–June, September–November",
    link: "munsiyari.html"
  },
  {
    name: "Bhimtal",
    category: "Lake",
    district: "Nainital",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjdt8dwxjAG5x1T7xFP0T-oA13lhdTk-MRR2HAGIy6tA&s=10",
    description: "A lakeside destination offering boating and a relaxed mountain atmosphere.",
    attractions: "Bhimtal Lake, aquarium island area, lakeside walks",
    bestTime: "March–June, September–November",
    link: "bhimtal.html"
  },
  {
    name: "Jageshwar Dham",
    category: "Temple",
    district: "Almora",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNRhaAf6Vwj5kVBuSSLwVjdsdoSVC1fyrwoWGsiYGi6g&s=10",
    description: "An important temple complex set among deodar forests in Kumaon.",
    attractions: "Ancient temples, deodar forest, Archaeological Museum",
    bestTime: "March–June, September–November",
    link: "jageshwar.html"
  },
  {
    name: "Patal Bhuvaneshwar",
    category: "Temple",
    district: "Pithoragarh",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBRsnmLuWbkvJ9kZp4Ce9dw43v5_2vohIy9rK8s-YKlQ&s=10",
    description: "A revered limestone cave shrine with naturally formed rock structures.",
    attractions: "Cave temple, surrounding villages, Kumaon landscapes",
    bestTime: "March–June, September–November",
    link: "patal-bhuvaneshwar.html"
  },
  {
    name: "Abbott Mount",
    category: "Heritage",
    district: "Champawat",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg88AhV1FPtw91DDd0ytR15amKtUPe_smA_B0B0LRmLw&s",
    description: "A quiet hill destination with forest scenery and old colonial-era buildings.",
    attractions: "Heritage cottages, forest walks, mountain viewpoints",
    bestTime: "March–June, September–November",
    link: "abbott-mount.html"
  },
  {
    name: "Hemkund Sahib",
    category: "Temple",
    district: "Chamoli",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjS0sXDh5rYgsnVRrWqRtS737Gpgb95WIhmr-n1Q8P1Q&s=10",
    description: "A high-altitude Sikh pilgrimage site beside a glacial lake.",
    attractions: "Gurudwara, Hemkund Lake, Himalayan scenery",
    bestTime: "During the official seasonal opening only",
    link: "hemkund-sahib.html"
  },
  {
    name: "Kausani",
    category: "Hill Station",
    district: "Bageshwar",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfWwJTZ0uveROT6n3vDy9lq-ntWVh5suzCTbqlbbhK5Q&s=10",
    description: "A Kumaon hill station known for wide Himalayan panoramas and peaceful surroundings.",
    attractions: "Himalayan viewpoints, Anasakti Ashram, tea gardens",
    bestTime: "March–June, September–November",
    link: "kausani.html"
  },
  {
    name: "Sattal",
    category: "Lake",
    district: "Nainital",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR88i73nA3U3nSzrLF4CqaMNFtq49giCzHndMHKcMVYCA&s=10",
    description: "A cluster of interconnected lakes surrounded by forest and birdlife.",
    attractions: "Lake walks, birdwatching, forest trails",
    bestTime: "March–June, September–November",
    link: "sattal.html"
  },
  {
    name: "Naukuchiatal",
    category: "Lake",
    district: "Nainital",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYOnHiRTJwsaWzoYOzdy2oOqfWbgxr6QM5XmB1KVbTDA&s=10",
    description: "A peaceful lake destination popular for boating and nature breaks.",
    attractions: "Naukuchiatal Lake, lakeside walks, birdwatching",
    bestTime: "March–June, September–November",
    link: "naukuchiatal.html"
  },
  {
    name: "Dodital",
    category: "Trekking",
    district: "Uttarkashi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATcDYr8ji_EDvReSkTPyzFOW9AqJx0AzqX_SvVfEnWA&s=10",
    description: "A Himalayan lake reached by a trek through forests and mountain villages.",
    attractions: "Dodital Lake, forest trails, Darwa Pass route",
    bestTime: "Spring and autumn; check trail conditions",
    link: "dodital.html"
  },
  {
    name: "Dayara Bugyal",
    category: "Trekking",
    district: "Uttarkashi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSocOSkff2z7rDvmwieeT-vSOEwppQFxgGhQzwg3sPa0A&s=10",
    description: "A high-altitude meadow offering expansive mountain views and seasonal trekking.",
    attractions: "Alpine meadows, mountain panoramas, trekking trails",
    bestTime: "Spring, summer and autumn; winter for snow if accessible",
    link: "dayara-bugyal.html"
  },
  {
    name: "Kedarkantha",
    category: "Trekking",
    district: "Uttarkashi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfXD0wZkm2D3T8zjKO4Tactg5gby1zfwNw9rtDV02n_Q&s=10",
    description: "A popular Himalayan trekking route known for winter snow and summit views.",
    attractions: "Juda Ka Talab, forest camps, summit viewpoint",
    bestTime: "Season-dependent; check snow and trail conditions",
    link: "kedarkantha.html"
  },
  {
    name: "Har Ki Dun",
    category: "Trekking",
    district: "Uttarkashi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThfAuEYH3WRB1mMLmyEbP5iPtV31SjdTP6nriJhr6Jsw&s=10",
    description: "A valley trek through traditional mountain villages and alpine landscapes.",
    attractions: "Har Ki Dun valley, village trails, mountain scenery",
    bestTime: "Spring and autumn; confirm local trail access",
    link: "har-ki-dun.html"
  },
  {
    name: "Tiger Falls",
    category: "Waterfall",
    district: "Dehradun",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz9fOjiCfPUIYudQNfPSDjVueqgPBhfRY6Glw4PHpKPg&s=10",
    description: "A scenic waterfall near Chakrata reached by a walk through natural surroundings.",
    attractions: "Waterfall viewpoint, forest walk, nearby Chakrata",
    bestTime: "Check seasonal water flow and local access",
    link: "tiger-falls.html"
  },
  {
    name: "Vasudhara Falls",
    category: "Waterfall",
    district: "Chamoli",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejmLvHLJ2r5NkEWb3up5rKMHj-FJQw0Z8yCDI0Jvjvw&s=10",
    description: "A dramatic waterfall reached by a high-altitude route near Badrinath.",
    attractions: "Vasudhara Falls, Himalayan trail, valley views",
    bestTime: "Seasonal access; check weather and trail conditions",
    link: "vasudhara-falls.html"
  },
  {
    name: "Jim Corbett National Park",
    category: "Wildlife",
    district: "Nainital and Pauri Garhwal region",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6XjDUrmx7fZyyhdKH30MOLto_bvt9esIeHH1youoAqQ&s=10",
    description: "A protected landscape known for forests, wildlife and authorised safari experiences.",
    attractions: "Permitted safari zones, nature interpretation, birdwatching",
    bestTime: "Depends on zone and official opening schedule",
    link: "jim-corbett.html"
  },
  {
    name: "Rajaji National Park",
    category: "Wildlife",
    district: "Dehradun, Haridwar and Pauri Garhwal region",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5FFGbj3HvBfTCgsN4g9SlKpIoCaHWyhNz_oMxtBN5OA&s=10",
    description: "A large protected forest landscape with elephants and diverse wildlife.",
    attractions: "Authorised safari zones, forest landscapes, birdwatching",
    bestTime: "Check official safari season and entry availability",
    link: "rajaji-national-park.html"
  },
  {
    name: "Katarmal Sun Temple",
    category: "Temple",
    district: "Almora",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe9yeMxLgVUv9CVJxFoBTVzL_hROC94ORmwMdQe_4fnw&s=10",
    description: "A historic sun temple known for its traditional stone architecture.",
    attractions: "Temple complex, stone carvings, surrounding countryside",
    bestTime: "March–June, September–November",
    link: "katarmal-sun-temple.html"
  },
  {
    name: "Baijnath Temple",
    category: "Temple",
    district: "Bageshwar",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSplpe3MKRUQWxlcT7rjl58MCT61olFsCCJ6sHQo7_wmA&s=10",
    description: "A historic temple complex beside the Gomti River in the Kumaon region.",
    attractions: "Stone temples, Gomti River, nearby heritage sites",
    bestTime: "March–June, September–November",
    link: "baijnath-temple.html"
  },
  {
    name: "Kartik Swami Temple",
    category: "Temple",
    district: "Rudraprayag",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS22tEuL3TXHSpzQVPH0JakUocQLONAbLVzpfbQXbjn0A&s=10",
    description: "A hilltop shrine reached by a scenic walk with mountain views.",
    attractions: "Temple trail, Himalayan viewpoints, surrounding villages",
    bestTime: "March–June, September–November",
    link: "kartik-swami.html"
  },
  {
    name: "Narendra Nagar Palace",
    category: "Heritage",
    district: "Tehri Garhwal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReXPoXkvE6ySHF_X_nRBZeYDKWpCJrdFwBXNw3BfcTgw&s=10",
    description: "A heritage palace site overlooking the Ganga valley region.",
    attractions: "Palace architecture, valley viewpoints, nearby heritage areas",
    bestTime: "March–June, September–November",
    link: "narendra-nagar-palace.html"
  }
];

/* ---------- Page elements ---------- */

const destinationGrid = document.getElementById("destinationGrid");
const destinationSearch = document.getElementById("destinationSearch");
const destinationCategory = document.getElementById("destinationCategory");
const savedCount = document.getElementById("savedCount");
const showSavedButton = document.getElementById("showSaved");
const destinationEmpty = document.getElementById("destinationEmpty");

let currentUser = null;
let savedPlaces = new Set();
let showOnlySaved = false;
let savingPlaces = new Set();
let unsubscribeSavedPlaces = null;

/* ---------- Helpers ---------- */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function getPlaceId(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ---------- Render destination cards ---------- */

function createDestinationCard(place, index) {
  const saved = savedPlaces.has(place.name);
  const busy = savingPlaces.has(place.name);

  return `
    <article
      class="destination-card"
      data-name="${escapeHTML(place.name)}"
      data-category="${escapeHTML(place.category)}"
      data-district="${escapeHTML(place.district)}"
    >
      <img
        class="destination-image"
        src="${escapeHTML(place.image)}"
        alt="${escapeHTML(place.name)} landscape"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/900x600/18372b/ffffff?text=Uttarakhand+Destination';"
      >

      <div class="destination-content">
        <p class="location">📍 ${escapeHTML(place.district)}</p>

        <h3>${String(index + 1).padStart(2, "0")}. ${escapeHTML(place.name)}</h3>

        <p>${escapeHTML(place.description)}</p>

        <div class="destination-details">
          <p><strong>Top Attractions:</strong> ${escapeHTML(place.attractions)}</p>
          <p><strong>Best Time:</strong> ${escapeHTML(place.bestTime)}</p>
          <span class="tag">${escapeHTML(place.category)}</span>
        </div>

        <div class="destination-actions">
          <a class="button" href="${escapeHTML(place.link)}">Explore Details →</a>

          <button
            type="button"
            class="save-place ${saved ? "is-saved" : ""}"
            data-name="${escapeHTML(place.name)}"
            aria-pressed="${saved}"
            ${busy ? "disabled" : ""}
          >${busy ? "Saving..." : saved ? "♥ Saved" : "♡ Save Place"}</button>
        </div>
      </div>
    </article>
  `;
}

function renderDestinations() {
  if (!destinationGrid) {
    console.error('Destination grid element "#destinationGrid" was not found.');
    return;
  }

  destinationGrid.innerHTML = destinations
    .map((place, index) => createDestinationCard(place, index))
    .join("");

  updateSaveButtons();
  filterDestinations();
}

/* ---------- Update saved buttons and count ---------- */

function updateSaveButtons() {
  document.querySelectorAll(".save-place").forEach(button => {
    const name = button.dataset.name;
    const isSaved = savedPlaces.has(name);
    const busy = savingPlaces.has(name);

    button.classList.toggle("is-saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));
    button.disabled = busy;
    button.textContent = busy
      ? "Saving..."
      : isSaved
        ? "♥ Saved"
        : "♡ Save Place";
  });

  if (savedCount) {
    const count = savedPlaces.size;
    savedCount.textContent =
      `${count} ${count === 1 ? "place" : "places"} saved`;
  }

  if (showSavedButton) {
    showSavedButton.textContent = showOnlySaved
      ? "♥ Show All Places"
      : "♡ Show Saved Places";

    showSavedButton.setAttribute("aria-pressed", String(showOnlySaved));
  }
}

/* ---------- Firestore listener ---------- */

function listenToSavedPlaces(user) {
  if (unsubscribeSavedPlaces) {
    unsubscribeSavedPlaces();
    unsubscribeSavedPlaces = null;
  }

  savedPlaces = new Set();
  updateSaveButtons();
  filterDestinations();

  if (!user) return;

  const savedRef = collection(db, "users", user.uid, "savedPlaces");

  unsubscribeSavedPlaces = onSnapshot(
    savedRef,
    snapshot => {
      savedPlaces = new Set(
        snapshot.docs
          .map(item => item.data().name)
          .filter(name => typeof name === "string")
      );

      updateSaveButtons();
      filterDestinations();
    },
    error => {
      console.error("Firestore saved places error:", error);
      alert("Saved places load nahi ho paaye. Firebase rules aur Console error check karein.");
    }
  );
}

/* ---------- Save or remove a place ---------- */

async function toggleSavedPlace(name) {
  if (!currentUser) {
    alert("Saved places save karne ke liye pehle login karein.");
    window.location.href = "login.html";
    return;
  }

  if (savingPlaces.has(name)) return;

  const place = destinations.find(item => item.name === name);
  if (!place) return;

  savingPlaces.add(name);
  updateSaveButtons();

  const placeRef = doc(
    db,
    "users",
    currentUser.uid,
    "savedPlaces",
    getPlaceId(name)
  );

  try {
    if (savedPlaces.has(name)) {
      await deleteDoc(placeRef);
    } else {
      await setDoc(placeRef, {
        name: place.name,
        category: place.category,
        district: place.district,
        description: place.description,
        image: place.image,
        attractions: place.attractions,
        bestTime: place.bestTime,
        link: place.link,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Could not update saved place:", error);

    alert(
      error.code === "permission-denied"
        ? "Permission denied. Firestore security rules check karein."
        : "Place save nahi hua. Internet connection aur Firebase configuration check karein."
    );
  } finally {
    savingPlaces.delete(name);
    updateSaveButtons();
  }
}

/* ---------- Save button click ---------- */

if (destinationGrid) {
  destinationGrid.addEventListener("click", event => {
    const button = event.target.closest(".save-place");
    if (!button) return;

    toggleSavedPlace(button.dataset.name);
  });
}

/* ---------- Search and category filter ---------- */

function filterDestinations() {
  if (!destinationGrid) return;

  const query = destinationSearch
    ? destinationSearch.value.trim().toLowerCase()
    : "";

  const category = destinationCategory
    ? destinationCategory.value.trim().toLowerCase()
    : "all";

  let visibleCount = 0;

  destinationGrid.querySelectorAll(".destination-card").forEach(card => {
    const name = (card.dataset.name || "").toLowerCase();
    const district = (card.dataset.district || "").toLowerCase();
    const text = card.textContent.toLowerCase();
    const cardCategory = (card.dataset.category || "").toLowerCase();

    const matchesSearch =
      !query ||
      name.includes(query) ||
      district.includes(query) ||
      text.includes(query);

    const matchesCategory =
      category === "all" || cardCategory === category;

    const matchesSaved =
      !showOnlySaved || savedPlaces.has(card.dataset.name);

    const visible =
      matchesSearch && matchesCategory && matchesSaved;

    card.hidden = !visible;

    if (visible) visibleCount++;
  });

  if (destinationEmpty) {
    destinationEmpty.hidden = visibleCount > 0;
  }
}

if (destinationSearch) {
  destinationSearch.addEventListener("input", filterDestinations);
}

if (destinationCategory) {
  destinationCategory.addEventListener("change", filterDestinations);
}

if (showSavedButton) {
  showSavedButton.addEventListener("click", () => {
    showOnlySaved = !showOnlySaved;
    updateSaveButtons();
    filterDestinations();
  });
}

/* ---------- Firebase authentication ---------- */

onAuthStateChanged(auth, user => {
  currentUser = user;
  listenToSavedPlaces(user);
});

/* ---------- Start page ---------- */

renderDestinations();
