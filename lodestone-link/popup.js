document.addEventListener('DOMContentLoaded', () => {
  // i18n の適用
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const message = chrome.i18n.getMessage(element.getAttribute('data-i18n'));
    if (message) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = message;
      } else {
        element.textContent = message;
      }
    }
  });

  const pastedText = document.getElementById('pastedText');
  const extractBtn = document.getElementById('extractBtn');
  const resultsSection = document.getElementById('resultsSection');
  const characterList = document.getElementById('characterList');
  const foundCount = document.getElementById('foundCount');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const searchBtn = document.getElementById('searchBtn');

  // FF14のキャラクター名を抽出する正規表現
  // 条件: 最初の文字が大文字、以降は英小文字・英大文字・半角/全角アポストロフィ・ハイフンが続く単語がスペースを挟んで2つ続く
  // 例: "Mikan Purin", "Theobalin Tirauland", "Chan K'", "Chan K’", "A'ruh Tia", "Bhaen-ir"
  const nameRegex = /([A-Z][a-zA-Z'\-’‘]{0,14}\s[A-Z][a-zA-Z'\-’‘]{0,14})/g;

  // 抽出ボタンのクリックイベント
  extractBtn.addEventListener('click', () => {
    const text = pastedText.value;
    if (!text.trim()) return;

    // 正規表現でマッチした文字列を抽出し、重複を排除
    const matches = text.match(nameRegex) || [];
    const uniqueNames = [...new Set(matches)];

    // リストをクリア
    characterList.innerHTML = '';
    
    if (uniqueNames.length > 0) {
      foundCount.textContent = uniqueNames.length;
      resultsSection.classList.remove('hidden');
      searchBtn.classList.remove('hidden');

      uniqueNames.forEach(name => {
        const item = document.createElement('label');
        item.className = 'character-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true; // デフォルトでチェックを入れる
        checkbox.value = name;
        
        const nameText = document.createElement('span');
        nameText.textContent = name;
        
        item.appendChild(checkbox);
        item.appendChild(nameText);
        characterList.appendChild(item);

        // チェック状態の変更で検索ボタンの表示を制御
        checkbox.addEventListener('change', updateSearchButton);
      });
      updateSearchButton();
    } else {
      // 見つからなかった場合
      foundCount.textContent = '0';
      resultsSection.classList.remove('hidden');
      searchBtn.classList.add('hidden');
      characterList.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 13px;">キャラクター名が見つかりませんでした。</div>';
    }
  });

  // すべて選択/解除ボタン
  let isAllSelected = true;
  selectAllBtn.addEventListener('click', () => {
    isAllSelected = !isAllSelected;
    const checkboxes = characterList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = isAllSelected);
    selectAllBtn.textContent = chrome.i18n.getMessage(isAllSelected ? 'popupButtonDeselectAll' : 'popupButtonSelectAll') || (isAllSelected ? 'すべて解除' : 'すべて選択');
    updateSearchButton();
  });

  // 検索ボタンの表示/非表示（選択件数0なら非表示）と件数更新
  function updateSearchButton() {
    const checkedBoxes = characterList.querySelectorAll('input[type="checkbox"]:checked');
    const count = checkedBoxes.length;
    
    if (count > 0) {
      searchBtn.classList.remove('hidden');
      const baseText = chrome.i18n.getMessage('popupButtonSearch') || '選択したキャラクターを検索';
      searchBtn.textContent = `${baseText} (${count})`;
    } else {
      searchBtn.classList.add('hidden');
    }
  }

  // 検索実行
  searchBtn.addEventListener('click', () => {
    const checkedBoxes = characterList.querySelectorAll('input[type="checkbox"]:checked');
    if (checkedBoxes.length === 0) return;

    const namesToSearch = Array.from(checkedBoxes).map(cb => cb.value);
    
    // 選択された名前を順番に新しいタブで開く
    namesToSearch.forEach((name, index) => {
      // FFLogsの汎用検索URLを使用
      const searchUrl = `https://ja.fflogs.com/search/?term=${encodeURIComponent(name)}`;
      
      setTimeout(() => {
        chrome.tabs.create({ url: searchUrl, active: false });
      }, index * 300); // 連続で開きすぎないよう0.3秒間隔
    });
  });
});
