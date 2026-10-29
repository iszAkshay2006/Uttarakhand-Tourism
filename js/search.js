```javascript
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const clearButton = document.getElementById("clearSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const popularButtons = document.querySelectorAll("[data-query]");

  // Update these href values if your actual page filenames differ.
  const searchItems = [
    {
      title: "Mussoorie",
      category: "destination",
      label: "Hill Station",
      icon: "🏔️",
      description: "Explore mountain views, waterfalls, walking trails and the charm of the Queen of the Hills.",
      href: "mussoorie.html",
      keywords: "mountains hill station sightseeing nature"
    },
    {
      title: "Nainital",
      category: "destination",
      label: "Lake Destination",
      icon: "🏞️",
      description: "Discover lakeside views, scenic walks and popular attractions around Nainital.",
      href: "nainital.html",
      keywords: "lake boating hill station family"
    },
    {
      title: "Auli",
      category: "destination",
      label: "Mountain Escape",
      icon: "❄️",
      description: "Find snow-season inspiration, mountain scenery and high-altitude viewpoints.",
      href: "auli.html",
      keywords: "snow skiing mountains winter"
    },
    {
      title: "Rishikesh",
      category: "spiritual",
      label: "Spiritual & Adventure",
      icon: "🧘",
      description: "Explore the Ganga riverfront, yoga, spiritual sites and adventure activities.",
      href: "rishikesh.html",
      keywords: "ganga yoga rafting adventure river"
    },
    {
      title: "Haridwar",
      category: "spiritual",
      label: "Pilgrimage",
      icon: "🪔",
      description: "Learn about Haridwar's sacred riverfront, temples and Ganga Aarti.",
      href: "haridwar.html",
      keywords: "temple pilgrimage ganga aarti spiritual"
    },
    {
      title: "Kedarnath",
      category: "spiritual",
      label: "Pilgrimage",
      icon: "🙏",
      description: "Plan ahead for the Kedarnath pilgrimage and check official travel updates before departure.",
      href: "kedarnath.html",
      keywords: "temple yatra pilgrimage trek"
    },
    {
      title: "Uttarakhand Lakes",
      category: "nature",
      label: "Nature & Lakes",
      icon: "🌊",
      description: "Discover lakes and peaceful nature escapes, from Naini Lake to Bhimtal and Deoria Tal.",
      href: "lakes.html",
      keywords: "lake water nature bhimtal sattal deoria tal"
    },
    {
      title: "Chopta",
      category: "nature",
      label: "Nature & Trekking",
      icon: "🌲",
      description: "Explore forest trails, mountain meadows and trekking inspiration around Chopta.",
      href: "chopta.html",
      keywords: "trekking forest meadow mountains tungnath"
    },
    {
      title: "Valley of Flowers",
      category: "nature",
      label: "Nature Trail",
      icon: "🌸",
      description: "Explore information about alpine flowers, trekking and seasonal access.",
      href: "valley-of-flowers.html",
      keywords: "flowers trek national park nature"
    },
    {
      title: "Trip Planner",
      category: "guide",
      label: "Travel Guide",
      icon: "🗺️",
      description: "Organise destinations, travel days and activities before your Uttarakhand trip.",
      href: "trip-planner.html",
      keywords: "itinerary plan route days holiday"
    },
    {
      title: "Hotels & Homestays",
      category: "guide",
      label: "Stay Guide",
      icon: "🛏️",
      description: "Explore accommodation options and compare suitable stays for your journey.",
      href: "hotels-homestays.html",
      keywords: "hotel room resort accommodation booking homestay"
    },
    {
      title: "Travel Updates",
      category: "guide",
      label: "Travel Information",
      icon: "ℹ️",
      description: "Find official sources for weather, road conditions, safety and travel advisories.",
      href: "travel-updates.html",
      keywords: "weather road safety alert advisory conditions"
    },
    {
      title: "Hill Stations",
      category: "nature",
      label: "Nature Guide",
      icon: "⛰️",
      description: "Browse mountain towns and hill destinations across Uttarakhand.",
      href: "hill-stations.html",
      keywords: "mountain hills mussoorie nainital lansdowne almora"
    }
  ];

  let activeFilter = "all";
  let currentQuery = "";

  function normalise(value) {
    return value.toLowerCase().trim();
  }

  function getResults() {
    const query = normalise(currentQuery);

    return searchItems.filter(item => {
      const matchesFilter =
        activeFilter === "all" || item.category === activeFilter;

      const searchableText = normalise([
        item.title,
        item.label,
        item.description,
        item.keywords
      ].join(" "));

      const matchesQuery =
        !query || searchableText.includes(query);

      return matchesFilter && matchesQuery;
    });
  }

  function renderResults() {
    const results = getResults();

    resultsContainer.innerHTML = results.map(item => `
      <article class="search-card">
        <span class="card-icon" aria-hidden="true">${item.icon}</span>
        <span class="card-category">${item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a href="${item.href}">Explore more <span aria-hidden="true">↗</span></a>
      </article>
    `).join("");

    resultsCount.textContent = currentQuery
      ? `${results.length} result${results.length === 1 ? "" : "s"} for “${currentQuery}”`
      : `${results.length} places and guides to explore`;

    emptyState.hidden = results.length > 0;
    resultsContainer.hidden = results.length === 0;
  }

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    currentQuery = searchInput.value;
    renderResults();
  });

  searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value;
    renderResults();
  });

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      filterButtons.forEach(filter => {
        const isActive = filter === button;
        filter.classList.toggle("active", isActive);
        filter.setAttribute("aria-pressed", String(isActive));
      });

      renderResults();
    });
  });

  popularButtons.forEach(button => {
    button.addEventListener("click", () => {
      searchInput.value = button.dataset.query;
      currentQuery = button.dataset.query;
      renderResults();
      searchInput.focus();
    });
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    currentQuery = "";
    activeFilter = "all";

    filterButtons.forEach(button => {
      const isActive = button.dataset.filter === "all";
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    renderResults();
    searchInput.focus();
  });

  renderResults();
});
```