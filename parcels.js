const API = "http://52.51.161.199:5000";

async function loadTable() {

  let res = await fetch(API + "/parcels");
  let data = await res.json();

  let table = document.querySelector("#parcelTable tbody");

  table.innerHTML = "";

  for (let i = 0; i < data.length; i++) {

    let row = `
      <tr>
        <td>${data[i].parcel_id}</td>
        <td>${data[i].name}</td>
        <td>${data[i].status}</td>
      </tr>
    `;

    table.innerHTML += row;
  }
}

loadTable();
