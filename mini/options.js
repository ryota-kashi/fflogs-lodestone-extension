function saveOptions() {
  const showFFLogs = document.getElementById('showFFLogs').checked;
  const showTomestone = document.getElementById('showTomestone').checked;
  const showLalachievements = document.getElementById('showLalachievements').checked;
  const status = document.getElementById('status');

  chrome.storage.sync.set({
    showFFLogs: showFFLogs,
    showTomestone: showTomestone,
    showLalachievements: showLalachievements
  }, () => {
    status.textContent = '保存されました。';
    setTimeout(() => { status.textContent = ''; }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    showFFLogs: false,
    showTomestone: false,
    showLalachievements: true
  }, (items) => {
    document.getElementById('showFFLogs').checked = items.showFFLogs;
    document.getElementById('showTomestone').checked = items.showTomestone;
    document.getElementById('showLalachievements').checked = items.showLalachievements;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
