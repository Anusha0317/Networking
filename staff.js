const API = "http://127.0.0.1:5000";

// ADD PARCEL
async function addParcel() {

  let id = document.getElementById("pid").value;
  let name = document.getElementById("name").value;

  if (id === "" || name === "") {
    alert("Please enter all details");
    return;
  }

  await fetch(API + "/add", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ parcel_id: id, name: name, status: "New" })
  });

  alert("Parcel added successfully");

  loadParcels();
}


// LOAD PARCELS
async function loadParcels() {

  let res = await fetch(API + "/parcels");
  let data = await res.json();

  let text = "";

  for (let i = 0; i < data.length; i++) {

    text += data[i].parcel_id + " - " +
            data[i].name + " - " +
            data[i].status + "<br>";
  }

  document.getElementById("list").innerHTML = text;
}


// UPDATE STATUS
async function updateParcel() {

  let id = document.getElementById("updateId").value;
  let status = document.getElementById("updateStatus").value;

  await fetch(API + "/update/" + id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ status: status })
  });

  alert("Status updated successfully");

  loadParcels();
}

// DELETE PARCEL
async function deleteParcel() {

  let id = document.getElementById("deleteId").value;

  if (id === "") {
    alert("Enter Parcel ID");
    return;
  }

  await fetch("http://127.0.0.1:5000/delete/" + id, {
    method: "DELETE"
  });

  alert("Parcel deleted successfully");

  loadParcels();
}

// AUTO LOAD
loadParcels();
