const urlBase = 'http://localhost:8080/playlist/';
const createBtn = document.getElementById('btn-create');
console.log('js working');


createBtn.onclick = async () => {
  const playlistId = document.getElementById('playlist-id').value
  const url = urlBase + playlistId;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}