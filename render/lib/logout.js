document.getElementById('logout').addEventListener('click', async(e) => {
    await window.electronAPI.logout();
})