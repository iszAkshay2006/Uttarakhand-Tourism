// ========================================
// UTTARAKHAND DESTINATIONS + SAVE PLACES
// ========================================

const destinations = [
    {
        name: "Nainital",
        district: "Nainital District",
        category: "Lake",
        description: "A beautiful Kumaon hill station centred around Naini Lake, with viewpoints, temples and lakeside walks.",
        page: "nainital.html",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Mussoorie",
        district: "Dehradun District",
        category: "Hill Station",
        description: "A popular hill station known for mountain views, Landour, scenic walks and Kempty Falls.",
        page: "mussoorie.html",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Rishikesh",
        district: "Dehradun Region",
        category: "Temple",
        description: "Discover yoga centres, Ganga riverfronts, suspension bridges and seasonal adventure activities.",
        page: "rishikesh.html",
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Auli",
        district: "Chamoli District",
        category: "Hill Station",
        description: "A Himalayan destination known for mountain views, winter snow and skiing when conditions permit.",
        page: "auli.html",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Valley of Flowers",
        district: "Chamoli District",
        category: "Nature",
        description: "A protected Himalayan national park celebrated for seasonal alpine flowers and biodiversity.",
        page: "valley-of-flowers.html",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Chopta",
        district: "Rudraprayag Region",
        category: "Trekking",
        description: "A scenic mountain area with green meadows, forest trails and access to the Tungnath trek.",
        page: "chopta.html",
        image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Lansdowne",
        district: "Pauri Garhwal",
        category: "Hill Station",
        description: "A peaceful hill destination featuring pine forests, viewpoints and historic cantonment surroundings.",
        page: "lansdowne.html",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Chakrata",
        district: "Dehradun District",
        category: "Nature",
        description: "A quiet mountain retreat with forest scenery, viewpoints and access to Tiger Falls.",
        page: "chakrata.html",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Pithoragarh",
        district: "Pithoragarh District",
        category: "Hill Station",
        description: "Explore Kumaon mountain scenery, historic sites and views towards the eastern Himalayas.",
        page: "pithoragarh.html",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Munsiyari",
        district: "Pithoragarh District",
        category: "Trekking",
        description: "A mountain destination known for dramatic Himalayan views and trekking routes.",
        page: "munsiyari.html",
        image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Bhimtal",
        district: "Nainital District",
        category: "Lake",
        description: "A Kumaon lake destination with peaceful waterfront views and nearby nature spots.",
        page: "bhimtal.html",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Jageshwar Dham",
        district: "Almora District",
        category: "Temple",
        description: "An important group of ancient Shiva temples set among deodar forests.",
        page: "jageshwar.html",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Patal Bhuvaneshwar",
        district: "Pithoragarh District",
        category: "Nature",
        description: "Explore a renowned limestone cave associated with Hindu religious traditions.",
        page: "patal-bhuvaneshwar.html",
        image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Abbott Mount",
        district: "Champawat District",
        category: "Hill Station",
        description: "A small, quiet hill retreat known for forest surroundings and mountain scenery.",
        page: "abbott-mount.html",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Hemkund Sahib",
        district: "Chamoli District",
        category: "Temple",
        description: "A revered Sikh pilgrimage site near a high-altitude glacial lake. Seasonal access depends on official conditions.",
        page: "hemkund-sahib.html",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Kausani",
        district: "Bageshwar District",
        category: "Hill Station",
        description: "A Kumaon hill destination known for wide Himalayan panoramas and peaceful countryside.",
        page: "kausani.html",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Sattal",
        district: "Nainital District",
        category: "Lake",
        description: "A group of interconnected lakes surrounded by forests and popular with nature lovers.",
        page: "sattal.html",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Naukuchiatal",
        district: "Nainital District",
        category: "Lake",
        description: "A peaceful lake destination surrounded by green hills and outdoor recreation spots.",
        page: "naukuchiatal.html",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Dodital",
        district: "Uttarkashi District",
        category: "Trekking",
        description: "A scenic highland lake reached by trekking through forested mountain terrain.",
        page: "dodital.html",
        image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Dayara Bugyal",
        district: "Uttarkashi District",
        category: "Trekking",
        description: "An alpine meadow known for expansive mountain views and seasonal trekking.",
        page: "dayara-bugyal.html",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Kedarkantha",
        district: "Uttarkashi Region",
        category: "Trekking",
        description: "A popular trekking peak known for forest trails, campsites and winter scenery.",
        page: "kedarkantha.html",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Har Ki Dun",
        district: "Uttarkashi District",
        category: "Trekking",
        description: "A Himalayan valley trek featuring traditional villages, forests and mountain landscapes.",
        page: "har-ki-dun.html",
        image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Tiger Falls",
        district: "Chakrata Region",
        category: "Waterfall",
        description: "A well-known waterfall reached by a route through the forested hills near Chakrata.",
        page: "tiger-falls.html",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Vasudhara Falls",
        district: "Chamoli District",
        category: "Waterfall",
        description: "A dramatic waterfall reached by a mountain walk from the Badrinath–Mana area.",
        page: "vasudhara-falls.html",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Jim Corbett National Park",
        district: "Nainital Region",
        category: "Wildlife",
        description: "A protected landscape known for forests, wildlife habitats and regulated safari experiences.",
        page: "jim-corbett.html",
        image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Rajaji National Park",
        district: "Dehradun–Haridwar Region",
        category: "Wildlife",
        description: "A forest landscape known for elephants, wildlife habitats and authorised nature experiences.",
        page: "rajaji-national-park.html",
        image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Katarmal Sun Temple",
        district: "Almora District",
        category: "Heritage",
        description: "A historic Sun temple complex showcasing the region's architectural and cultural heritage.",
        page: "katarmal-sun-temple.html",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Baijnath Temple",
        district: "Bageshwar District",
        category: "Temple",
        description: "A historic temple complex near the Gomti River, associated with Shiva worship.",
        page: "baijnath-temple.html",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Kartik Swami Temple",
        district: "Rudraprayag District",
        category: "Temple",
        description: "A hilltop temple reached by a trek and known for its panoramic Himalayan views.",
        page: "kartik-swami.html",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Narendra Nagar Palace",
        district: "Tehri Garhwal District",
        category: "Heritage",
        description: "A historic palace destination associated with the former Tehri royal family and hilltop views.",
        page: "narendra-nagar-palace.html",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80"
    }
];

const grid = document.getElementById("destinationGrid");
const savedCount = document.getElementById("savedCount");
const showSavedButton = document.getElementById("showSaved");
const searchInput = document.getElementById("destinationSearch");
const categorySelect = document.getElementById("destinationCategory");
const emptyMessage = document.getElementById("destinationEmpty");

const STORAGE_KEY = "uttarakhandSavedPlaces";

let showSavedOnly = false;

// Read saved destinations safely.
function getSavedPlaces() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

// Store saved destinations.
function storeSavedPlaces(places) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
        return true;
    } catch (error) {
        console.error("Could not save destinations:", error);
        alert("Your browser could not save this list. Check browser storage settings.");
        return false;
    }
}

// Update saved count and button states.
function updateSavedUI() {
    const saved = getSavedPlaces();

    savedCount.textContent =
        `${saved.length} ${saved.length === 1 ? "place" : "places"} saved`;

    showSavedButton.textContent = showSavedOnly
        ? "♥ Show All Places"
        : "♡ Show Saved Places";

    showSavedButton.setAttribute("aria-pressed", String(showSavedOnly));

    grid.querySelectorAll(".save-place").forEach((button) => {
        const isSaved = saved.includes(button.dataset.name);

        button.classList.toggle("is-saved", isSaved);
        button.textContent = isSaved ? "♥ Saved" : "♡ Save Place";
        button.setAttribute("aria-pressed", String(isSaved));
    });
}

// Create a destination card.
function createDestinationCard(place) {
    const article = document.createElement("article");
    article.className = "destination-card";
    article.dataset.name = place.name;
    article.dataset.category = place.category;

    const image = document.createElement("img");
    image.src = place.image;
    image.alt = `${place.name}, Uttarakhand`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
        image.alt = `${place.name} image unavailable`;
    }, { once: true });

    const content = document.createElement("div");
    content.className = "destination-content";

    const location = document.createElement("span");
    location.className = "location";
    location.textContent = place.district;

    const title = document.createElement("h3");
    title.textContent = place.name;

    const description = document.createElement("p");
    description.textContent = place.description;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = place.category;

    const actions = document.createElement("div");
    actions.className = "destination-actions";

    const exploreLink = document.createElement("a");
    exploreLink.href = place.page;
    exploreLink.textContent = "Explore Details →";
    exploreLink.setAttribute("aria-label", `Explore ${place.name}`);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "save-place";
    saveButton.dataset.name = place.name;
    saveButton.textContent = "♡ Save Place";
    saveButton.setAttribute("aria-label", `Save ${place.name}`);
    saveButton.setAttribute("aria-pressed", "false");

    saveButton.addEventListener("click", () => {
        const saved = getSavedPlaces();
        const alreadySaved = saved.includes(place.name);

        const updated = alreadySaved
            ? saved.filter((name) => name !== place.name)
            : [...saved, place.name];

        if (storeSavedPlaces(updated)) {
            updateSavedUI();
            applyFilters();
        }
    });

    actions.append(exploreLink, saveButton);
    content.append(location, title, description, tag, actions);
    article.append(image, content);

    return article;
}

// Render all 30 cards.
function renderDestinations() {
    const fragment = document.createDocumentFragment();

    destinations.forEach((place) => {
        fragment.appendChild(createDestinationCard(place));
    });

    grid.replaceChildren(fragment);
    updateSavedUI();
    applyFilters();
}

// Search, category and saved-only filters.
function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const saved = getSavedPlaces();
    let visibleCount = 0;

    grid.querySelectorAll(".destination-card").forEach((card) => {
        const name = card.dataset.name.toLowerCase();
        const place = destinations.find((item) => item.name === card.dataset.name);

        const matchesSearch =
            name.includes(query) ||
            place.district.toLowerCase().includes(query) ||
            place.description.toLowerCase().includes(query);

        const matchesCategory =
            category === "all" || place.category === category;

        const matchesSaved =
            !showSavedOnly || saved.includes(place.name);

        const visible = matchesSearch && matchesCategory && matchesSaved;

        card.hidden = !visible;

        if (visible) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);

showSavedButton.addEventListener("click", () => {
    showSavedOnly = !showSavedOnly;
    updateSavedUI();
    applyFilters();
});

// Start the page.
renderDestinations();
