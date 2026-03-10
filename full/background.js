// 右クリックメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  // 親メニュー
  chrome.contextMenus.create({
    id: "ff14searchParent",
    title: chrome.i18n.getMessage("contextMenuFF14SearchParent", ["%s"]),
    contexts: ["selection"]
  });

  // 子メニュー1：FF Logs
  chrome.contextMenus.create({
    id: "searchFFLogs",
    parentId: "ff14searchParent",
    title: chrome.i18n.getMessage("contextMenuSearchFFLogsSimple"),
    contexts: ["selection"]
  });

  // 子メニュー2：ロードストーン
  chrome.contextMenus.create({
    id: "searchLodestone",
    parentId: "ff14searchParent",
    title: chrome.i18n.getMessage("contextMenuSearchLodestone"),
    contexts: ["selection"]
  });
});

// メニューがクリックされた時の処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const query = encodeURIComponent(info.selectionText.trim());
  
  if (info.menuItemId === "searchFFLogs") {
    const url = `https://ja.fflogs.com/search/?term=${query}`;
    chrome.tabs.create({ url: url });
  } 
  else if (info.menuItemId === "searchLodestone") {
    // ロードストーンのキャラクター検索URL
    const url = `https://jp.finalfantasyxiv.com/lodestone/character/?q=${query}&worldname=`;
    chrome.tabs.create({ url: url });
  }
});
