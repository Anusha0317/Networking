const API = "http://127.0.0.1:5000";

// ================= ADD PARCEL =================
async function addParcel() {

  let id = document.getElementById("pid").value;
  let name = document.getElementById("name").value;

  if (id === "" || name === "") {
    alert("Please enter all details");
    return;
  }

  try {
    await fetch(API + "/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        parcel_id: id,
        name: name,
        status: "New"
      })
    });

    alert("Parcel added successfully");

    // Clear inputs
    document.getElementById("pid").value = "";
    document.getElementById("name").value = "";

    loadParcels();

  } catch (error) {
    alert("Error adding parcel");
  }
}


// ================= LOAD PARCELS =================
async function loadParcels() {

  try {
    let res = await fetch(API + "/parcels");
    let data = await res.json();

    let text = "";

    for (let i = 0; i < data.length; i++) {

      let statusClass = "";

      if (data[i].status === "Delivered") {
        statusClass = "delivered";
      } else if (data[i].status === "In Transit") {
        statusClass = "transit";
      } else {
        statusClass = "new";
      }

      text += data[i].parcel_id + " - " +
              data[i].name + " - " +
              "<span class='" + statusClass + "'>" +
              data[i].status +
              "</span><br>";
    }

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
    await fetch(API + "/update/" + id, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ status: status })
    });

    alert("Status updated successfully");

    document.getElementById("updateId").value = "";

    loadParcels();

  } catch (error) {
    alert("Error updating status");
  }
}


// ================= DELETE PARCEL =================
async function deleteParcel() {

  let id = document.getElementById("deleteId").value;

  if (id === "") {
    alert("Enter Parcel ID");
    return;
  }

  // Confirmation
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
    alert("Server error while deleting");
  }
}


// ================= NAVIGATION =================
function goToParcels() {
  window.location.href = "parcels.html";
}


// ================= AUTO LOAD =================
loadParcels();
