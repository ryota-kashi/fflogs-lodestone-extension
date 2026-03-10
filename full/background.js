// 右クリックメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "searchFFLogs",
    title: chrome.i18n.getMessage("contextMenuSearchFFLogs", ["%s"]),
    contexts: ["selection"] // テキストを選択している時だけ表示
  });
});

// メニューがクリックされた時の処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "searchFFLogs") {
    // 選択された文字列を取得し、URL用にエンコード
    const query = encodeURIComponent(info.selectionText.trim());
    const url = `https://ja.fflogs.com/search/?term=${query}`;
    
    // 新しいタブで開く
    chrome.tabs.create({ url: url });
  }
});
