const urlBase = 'http://localhost:8080/';
const loginBtn = document.getElementById('btn-login');
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

// loginBtn.onclick = async () => {
//   const url = urlBase + 'login';
//   try {
//     const response = await fetch(url);
//     // if (!response.ok) {
//     //   throw new Error(`Response status: ${response.status}`);
//     // }

//     // const json = await response.json();
//     // console.log(json);
//   } catch (error) {
//     console.error(error.message);
//   }
// }



// const urlParams = new URLSearchParams(window.location.search);
// let code = urlParams.get('code');

// const getToken = async code => {
//   let codeVerifier = localStorage.getItem('code_verifier');

//   const payload = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: new URLSearchParams({
//       client_id: clientId,
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: redirectUri,
//       code_verifier: codeVerifier,
//     }),
//   }

//   const body = await fetch('https://accounts.spotify.com/api/token', payload);
//   const response = await body.json();

//   localStorage.setItem('access_token', response.access_token);
// }
