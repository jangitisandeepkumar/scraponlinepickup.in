// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCA-v0X9OzsToVlNHYBd1WRrOi01CWotVY",
  authDomain: "login-51a65.firebaseapp.com",
  projectId: "login-51a65",
  storageBucket: "login-51a65.appspot.com",
  messagingSenderId: "1051725155986",
  appId: "1:1051725155986:web:31ab5d15f993e9eee0e04b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const pickupTableBody = document.getElementById("pickupTableBody");

// Listen for changes in pickupRequests collection
db.collection("pickupRequests").onSnapshot(snapshot => {
  pickupTableBody.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.name || "-"}</td>
      <td>${data.phone || "-"}</td>
      <td>${data.location || "-"}</td>
      <td>${(data.selectedMaterials || []).join(", ")}</td>
      <td>${data.weight || "0"} kg</td>
      <td>${data.preferredDate || "-"}</td>
      <td>${data.preferredTime || "-"}</td>
      <td>
        <select data-id="${doc.id}">
          <option value="Pending" ${data.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="Successful" ${data.status === "Successful" ? "selected" : ""}>Successful</option>
          <option value="Rejected" ${data.status === "Rejected" ? "selected" : ""}>Rejected</option>
        </select>
      </td>
    `;

    pickupTableBody.appendChild(row);

    // Update status on change
    row.querySelector("select").addEventListener("change", (e) => {
      const newStatus = e.target.value;
      const docId = e.target.getAttribute("data-id");

      db.collection("pickupRequests").doc(docId).update({
        status: newStatus
      }).then(() => {
        alert("Status updated successfully.");
      }).catch(err => {
        console.error("Error updating status:", err);
        alert("Failed to update status.");
      });
    });
  });
});
