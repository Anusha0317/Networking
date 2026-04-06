const API = "http://52.51.161.199:5000";

// ================= ADD PARCEL =================
async function addParcel() {

  let id = document.getElementById("pid").value;
  let name = document.getElementById("name").value;

  if (id === "" || name === "") {
    alert("Please enter all details");
    return;
  }

  try {
    let res = await fetch(API + "/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        parcel_id: id,
        name: name,
        status: "New"
      })
    });

    if (res.ok) {
      alert("Parcel added successfully");

      document.getElementById("pid").value = "";
      document.getElementById("name").value = "";

      loadParcels();
    } else {
      alert("Error adding parcel");
    }

  } catch (error) {
    alert("Server not reachable");
  }
}


// ================= LOAD PARCELS =================
async function loadParcels() {

  try {
    let res = await fetch(API + "/parcels");
    let data = await res.json();

    let text = "";

    // 🔢 STATS
    let total = data.length;
    let delivered = 0;
    let transit = 0;
    let out = 0;

    for (let i = 0; i < data.length; i++) {

      let statusClass = "";

      if (data[i].status === "Delivered") {
        statusClass = "status-delivered";
        delivered++;
      } 
      else if (data[i].status === "In Transit") {
        statusClass = "status-transit";
        transit++;
      } 
      else if (data[i].status === "Out for Delivery") {
        statusClass = "status-out";
        out++;
      } 
      else {
        statusClass = "status-new";
      }

      text += data[i].parcel_id + " - " +
              data[i].name + " - " +
              "<span class='" + statusClass + "'>" +
              data[i].status +
              "</span><br>";
    }

    // 📊 UPDATE STATS UI
    document.getElementById("totalCount").innerText = total;
    document.getElementById("deliveredCount").innerText = delivered;
    document.getElementById("transitCount").innerText = transit;
    document.getElementById("outCount").innerText = out;

    document.getElementById("list").innerHTML = text;

  } catch (error) {
    console.log("Error loading parcels");
  }
}


// ================= UPDATE STATUS =================
async function updateParcel() {

  let id = document.getElementById("updateId").value;
  let status = document.getElementById("updateStatus").value;

  if (id === "") {
    alert("Enter Parcel ID");
    return;
  }

  try {
    let res = await fetch(API + "/update/" + id, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ status: status })
    });

    if (res.ok) {
      alert("Status updated successfully");

      document.getElementById("updateId").value = "";

      loadParcels();
    } else {
      alert("Error updating status");
    }

  } catch (error) {
    alert("Server not reachable");
  }
}


// ================= DELETE PARCEL =================
async function deleteParcel() {

  let id = document.getElementById("deleteId").value;

  if (id === "") {
    alert("Enter Parcel ID");
    return;
  }

  if (!confirm("Are you sure you want to delete this parcel?")) {
    return;
  }

  try {
    let res = await fetch(API + "/delete/" + id, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Parcel deleted successfully");
    } else {
      alert("Error deleting parcel");
    }

    document.getElementById("deleteId").value = "";

    loadParcels();

  } catch (error) {
    alert("Server not reachable");
  }
}


// ================= NAVIGATION =================
function goToParcels() {
  window.location.href = "parcels.html";
}


// ================= AUTO LOAD =================
window.onload = loadParcels;
