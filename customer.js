const API = "http://52.51.161.199:5000";

// ================= TRACK PARCEL =================
async function trackParcel() {
    let id = document.getElementById("trackId").value;

    if (id === "") {
        alert("Enter Parcel ID");
        return;
    }

    try {
        let res = await fetch(API + "/track/" + id);
        let data = await res.json();

        if (res.ok) {
            document.getElementById("result").innerText =
                "Status: " + data.status;
        } else {
            document.getElementById("result").innerText =
                data.error;
        }

    } catch (error) {
        alert("Server not reachable");
    }
}
