import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const pickupRef = collection(db, "pickupRequests");

async function fetchData() {
  const querySnapshot = await getDocs(pickupRef);

  const materialCount = {};
  const dailyCount = {};
  const userCount = {};
  const monthlyCount = {};

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const material = data.materialType || "Unknown";
    const date = data.date || "Unknown";
    const email = data.email || "Anonymous";

    // Material Chart
    materialCount[material] = (materialCount[material] || 0) + 1;

    // Daily Chart
    dailyCount[date] = (dailyCount[date] || 0) + 1;

    // User Chart
    userCount[email] = (userCount[email] || 0) + 1;

    // Monthly Chart
    const month = date?.slice(0, 7); // "YYYY-MM"
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });

  renderPieChart(Object.keys(materialCount), Object.values(materialCount));
  renderLineChart(Object.keys(dailyCount), Object.values(dailyCount));
  renderBarChart(Object.keys(userCount), Object.values(userCount));
  renderMonthlyChart(Object.keys(monthlyCount), Object.values(monthlyCount));
}

// Pie Chart - Material Type
function renderPieChart(labels, data) {
  new Chart(document.getElementById("materialChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Pickups",
        data,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#00A36C", "#DC7633"
        ]
      }]
    }
  });
}

// Line Chart - Per Day
function renderLineChart(labels, data) {
  new Chart(document.getElementById("dailyChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Pickups per Day",
        data,
        fill: false,
        borderColor: "#007bff",
        tension: 0.3
      }]
    }
  });
}

// Bar Chart - Per User
function renderBarChart(labels, data) {
  new Chart(document.getElementById("userChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Pickups per User",
        data,
        backgroundColor: "#17a2b8"
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'User Email' } },
        y: { title: { display: true, text: 'Pickup Count' } }
      }
    }
  });
}

// Line Chart - Monthly Trends
function renderMonthlyChart(labels, data) {
  new Chart(document.getElementById("monthlyChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Monthly Pickups",
        data,
        borderColor: "#28a745",
        fill: false,
        tension: 0.4
      }]
    }
  });
}

fetchData();
