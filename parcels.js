const API = "http://52.51.161.199:5000";

async function loadParcels() {
    try {
        let res = await fetch(API + "/parcels");
        let data = await res.json();

        let table = document.getElementById("parcelTable");
        table.innerHTML = "";

        data.forEach(p => {
            let row = `
                <tr>
                    <td>${p.parcel_id}</td>
                    <td>${p.name}</td>
                    <td>${p.customer_name}</td>
                    <td>${p.email}</td>
                    <td>${p.address}</td>
                    <td>${p.date}</td>
                    <td>${p.status}</td>
                </tr>
            `;
            table.innerHTML += row;
        });

    } catch (error) {
        console.log("Error loading parcels");
    }
}

window.onload = loadParcels;
