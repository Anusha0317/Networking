const API = "http://127.0.0.1:5000";

// ADD PARCEL
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parcel_id: id,
        name: name,
        status: "New"
      })
    });

    let data = await res.json();

    alert(data.message || "Parcel added successfully");

    document.getElementById("pid").value = "";
    document.getElementById("name").value = "";

    loadParcels();

  } catch (error) {
    console.log(error);
    alert("Error adding parcel");
  }
}


// LOAD PARCELS
async function loadParcels() {

  try {
    let res = await fetch(API + "/parcels");
    let data = await res.json();

    let text = "";

    for (let i = 0; i < data.length; i++) {

      let statusColor = "black";

      if (data[i].status === "Delivered") statusColor = "green";
      else if (data[i].status === "In Transit") statusColor = "orange";

      text += `<span style="color:${statusColor}">
                ${data[i].parcel_id} - ${data[i].name} - ${data[i].status}
               </span><br>`;
    }

    document.getElementById("list").innerHTML = text;

  } catch (error) {
    console.log(error);
    alert("Error loading parcels");
  }
}


// UPDATE PARCEL
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status })
    });

    let data = await res.json();

    alert(data.message || "Status updated successfully");

    loadParcels();

  } catch (error) {
    console.log(error);
    alert("Error updating parcel");
  }
}


// DELETE PARCEL
async function deleteParcel() {

  let id = document.getElementById("deleteId").value;

  if (id === "") {
    alert("Enter Parcel ID");
    return;
  }

  // CONFIRM BEFORE DELETE
  if (!confirm("Are you sure you want to delete this parcel?")) {
    return;
  }

  try {
    let res = await fetch(API + "/delete/" + id, {
      method: "DELETE"
    });

    let data = await res.json();

    if (res.ok) {
      alert(data.message || "Parcel deleted successfully");
    } else {
      alert("Delete failed");
    }

    document.getElementById("deleteId").value = "";

    loadParcels();

  } catch (error) {
    console.log(error);
    alert("Error deleting parcel");
  }
}


// AUTO LOAD
loadParcels();
