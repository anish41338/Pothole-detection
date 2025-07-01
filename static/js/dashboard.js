let userLocation = null;
let map;
let heatmap;
let points = [];
let currentView = "grid";

// Load user location
window.onload = () => {
  try {
    points = images.map(img => new google.maps.LatLng(img.latitude, img.longitude));
    console.log("Heatmap points initialized:", points.length);
  } catch (err) {
    console.error("Error initializing heatmap points", err);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        console.log("User location detected:", userLocation);
      },
      () => alert("Location access denied.")
    );
  }

  // Attach view switch events
  document.getElementById("gridBtn")?.addEventListener("click", showGrid);
  document.getElementById("mapBtn")?.addEventListener("click", showMap);
  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    sortCards(e.target.value);
  });
};

// Initialize Google Map
function initMap() {
  if (!points || points.length === 0) return;
  const mapCenter = points[0];

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: mapCenter,
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: points,
    map: map,
    radius: 30,
  });
}

// Show Map View
function showMap() {
  document.querySelector(".card-container").style.display = "none";
  document.getElementById("map").style.display = "block";
  currentView = "map";
  if (!map) initMap();
}

// Show Grid View
function showGrid() {
  document.querySelector(".card-container").style.display = "grid";
  document.getElementById("map").style.display = "none";
  currentView = "grid";
}

// Sort Cards
function sortCards(order) {
  const container = document.querySelector(".card-container");
  const cards = Array.from(container.querySelectorAll(".card"));

  cards.sort((a, b) => {
    const countA = parseInt(a.dataset.count);
    const countB = parseInt(b.dataset.count);
    const idA = parseInt(a.dataset.id);
    const idB = parseInt(b.dataset.id);
    const latA = parseFloat(a.dataset.lat);
    const lngA = parseFloat(a.dataset.lng);
    const latB = parseFloat(b.dataset.lat);
    const lngB = parseFloat(b.dataset.lng);

    if (order === "count_asc") return countA - countB;
    if (order === "count_desc") return countB - countA;
    if (order === "latest") return idB - idA;

    if ((order === "nearest" || order === "farthest") && userLocation) {
      const distA = distance(userLocation.lat, userLocation.lng, latA, lngA);
      const distB = distance(userLocation.lat, userLocation.lng, latB, lngB);
      return order === "nearest" ? distA - distB : distB - distA;
    }

    return 0;
  });

  container.innerHTML = "";
  cards.forEach(card => container.appendChild(card));
}

// Distance Helper (Haversine)
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
const toRad = deg => deg * (Math.PI / 180);


document.querySelectorAll(".card").forEach(card => {
  const img = card.querySelector("img");

  if (img) {
    img.addEventListener("click", () => {
      const imageUrl = img.src;

      fetch("/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image_url: imageUrl })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          alert("Gemini Analysis:\n\n" + data.result);
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        alert("Something went wrong: " + err);
      });
    });
  }
});


