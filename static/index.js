const urlBase = 'http://localhost:8080/';
const createBtn = document.getElementById('btn-create');

createBtn.onclick = async () => {
  const playlistPath = 'playlist/'
  const playlistId = document.getElementById('playlist-id').value
  const url = urlBase + playlistPath + playlistId;
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
