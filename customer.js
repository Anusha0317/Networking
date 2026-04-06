const API = "http://52.51.161.199:5000";

// TRACK
async function trackParcel() {

  let id = document.getElementById("trackId").value;

  let res = await fetch(API + "/track/" + id);
  let data = await res.json();

  if (data.status) {
    document.getElementById("result").innerText =
      "Status: " + data.status;
  } else {
    document.getElementById("result").innerText =
      "Parcel not found";
  }
}
