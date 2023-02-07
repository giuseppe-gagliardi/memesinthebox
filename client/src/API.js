async function getAllMemes(){
    try{
        const memes = await fetch('/api/memes');
        const data = await memes.json();
        return data;
    }catch(err){
        console.log(err);
        return [];
    }
}

async function addMemeDb(meme){
    try{
        const resp = await fetch('api/memes',
        {
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(meme)
        });
        if(!resp.ok){
            console.log(resp.statusText);
        }
    }catch(err){
        console.log(err);
    }
}

async function deleteMemeDb(id){
    try{
        const resp = await fetch('api/memes/'+id, {
            method:"DELETE"
        });
        if(!resp.ok){
            console.log(resp.statusText);
        }
    }catch(err){
        console.log(err);
    }
}

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
   
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  
async function getUserInfo() {
    const response = await fetch('api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }

const API = { getAllMemes, addMemeDb, deleteMemeDb, logOut, logIn, getUserInfo};
export default API;