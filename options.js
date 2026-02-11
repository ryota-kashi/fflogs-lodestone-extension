// 保存ボタンのクリックイベント
function saveOptions() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const status = document.getElementById('status');
  const showFFLogs = document.getElementById('showFFLogs').checked;
  const showTomestone = document.getElementById('showTomestone').checked;
  const showLalachievements = document.getElementById('showLalachievements').checked;

  /* APIキーは任意化
  if (!apiKey) {
    status.textContent = 'APIキーを入力してください。';
    status.className = 'status error';
    return;
  }
  */

  // Chrome Storageに保存
  chrome.storage.sync.set({
    fflogsApiKey: apiKey,
    showFFLogs: showFFLogs,
    showTomestone: showTomestone,
    showLalachievements: showLalachievements
  }, () => {
    status.textContent = '保存されました。';
    status.className = 'status success';
    setTimeout(() => {
      status.textContent = '';
      status.className = 'status';
    }, 2000);
  });
}

// 保存されている設定を読み込み
function restoreOptions() {
  chrome.storage.sync.get({
    fflogsApiKey: '',
    showFFLogs: false,
    showTomestone: false,
    showLalachievements: true
  }, (items) => {
    document.getElementById('apiKey').value = items.fflogsApiKey;
    document.getElementById('showFFLogs').checked = items.showFFLogs;
    document.getElementById('showTomestone').checked = items.showTomestone;
    document.getElementById('showLalachievements').checked = items.showLalachievements;

    // APIキーがすでに存在する場合は隠し機能を表示する
    if (items.fflogsApiKey) {
      document.getElementById('fflogs-feature').classList.remove('hidden-feature');
    }
  });
}

// 隠し機能の表示切り替え
function toggleHiddenFeature() {
  const feature = document.getElementById('fflogs-feature');
  feature.classList.toggle('hidden-feature');
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('version').addEventListener('click', toggleHiddenFeature);
document.getElementById('version').style.cursor = 'pointer'; // クリック可能であることを示唆
