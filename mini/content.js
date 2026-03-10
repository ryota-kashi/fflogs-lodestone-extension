(function() {
  'use strict';

  // キャラクター名を取得
  function getCharacterName() {
    let nameElement = document.querySelector('.frame__chara__name');
    if (!nameElement) nameElement = document.querySelector('.entry__column__name');
    return nameElement ? nameElement.textContent.trim() : null;
  }

  // ロードストーンIDを取得
  function getLodestoneId() {
    const match = window.location.pathname.match(/\/character\/(\d+)(?:\/|$)/);
    return match ? match[1] : null;
  }

  // キャラクター名をスラッグ化 (Tomestone.gg 用)
  function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  // サーバー名とデータセンター名を取得
  function getServerAndDcName() {
    let serverElement = document.querySelector('.frame__chara__world');
    if (!serverElement) serverElement = document.querySelector('.entry__column__world');
    if (serverElement) {
      const serverText = serverElement.textContent.trim();
      return serverText.replace('[', '(').replace(']', ')');
    }
    return null;
  }

  // サーバー名のみを取得
  function getServerName() {
    const serverAndDc = getServerAndDcName();
    if (serverAndDc) {
      const match = serverAndDc.match(/^([^\(]+)/);
      return match ? match[1].trim() : serverAndDc;
    }
    return null;
  }

  // リージョンコードを取得
  function getRegionCode() {
    const serverAndDc = getServerAndDcName();
    let region = 'JP';
    if (serverAndDc) {
      if (serverAndDc.includes('Elemental') || serverAndDc.includes('Gaia') || 
          serverAndDc.includes('Mana') || serverAndDc.includes('Meteor')) region = 'JP';
      else if (serverAndDc.includes('Aether') || serverAndDc.includes('Primal') || 
          serverAndDc.includes('Crystal') || serverAndDc.includes('Dynamis')) region = 'NA';
      else if (serverAndDc.includes('Chaos') || serverAndDc.includes('Light')) region = 'EU';
      else if (serverAndDc.includes('Materia')) region = 'OC';
    }
    return region;
  }

  // ボタン作成共通関数
  function createButton(labelKey, tooltipKey, tooltipArgs, url, className, iconPath) {
    const button = document.createElement('a');
    button.className = className;
    
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="${iconPath}"/>
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>${chrome.i18n.getMessage(labelKey)}</span>`;
    button.title = chrome.i18n.getMessage(tooltipKey, tooltipArgs);
    button.href = url;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    return button;
  }

  const ICONS = {
    fflogs: "M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V11h2Zm0-8H11V7h2ZM16 11V17H14V11H16ZM10 13V17H8V13H10Z",
    tomestone: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    achievements: "M19.003,5c-0.101,0-0.2,0.012-0.297,0.034C18.667,2.83,16.897,1,14.739,1h-5.48C7.1,1,5.33,2.83,5.291,5.034 C5.195,5.012,5.096,5,4.995,5C3.344,5,2,6.344,2,7.995c0,1.268,0.793,2.341,1.913,2.77c0.686,2.871,3.012,5.105,5.922,5.59 c0.435,1.527,1.696,2.716,3.279,2.99V21h-3v2h9v-2h-3v-1.655c1.583-0.274,2.844-1.463,3.279-2.99 c2.911-0.485,5.237-2.719,5.922-5.59c1.12-0.428,1.913-1.502,1.913-2.77C21.998,6.344,20.655,5,19.003,5z M4,7.995 C4,7.447,4.448,7,4.995,7c0.12,0,0.233,0.021,0.339,0.06C5.112,7.361,5.034,7.671,5.008,7.995c-0.038,0.48,0.003,1.603,0.444,2.894 C4.619,10.297,4,9.219,4,7.995z M14,14c0,1.103-0.897,2-2,2s-2-0.897-2-2V3h4V14z M19.998,7.995c0,1.224-0.619,2.302-1.452,2.894 c0.441-1.291,0.482-2.414,0.444-2.894c-0.026-0.324-0.104-0.634-0.228-0.935C18.868,7.021,18.981,7,19.102,7 C19.649,7,20.098,7.447,20.098,7.995z"
  };

  async function insertButtons() {
    if (!chrome.runtime?.id) return;
    if (document.querySelector('.fflogs-button-container')) return;

    const charName = getCharacterName();
    const serverName = getServerName();
    const lodestoneId = getLodestoneId();
    if (!charName || !lodestoneId) return;

    const nameElement = document.querySelector('.frame__chara__name, .entry__column__name');
    const nameBox = nameElement ? nameElement.closest('.frame__chara__box, .entry__column__box') : null;
    
    if (nameBox) {
      chrome.storage.sync.get({
        showFFLogs: false,
        showTomestone: false,
        showLalachievements: true
      }, (result) => {
        if (document.querySelector('.fflogs-button-container')) return;

        const container = document.createElement('div');
        container.className = 'fflogs-button-container';
        
        // FFLogs
        if (result.showFFLogs && serverName) {
          const region = getRegionCode().toLowerCase();
          const url = `https://ja.fflogs.com/character/${region}/${encodeURIComponent(serverName)}/${encodeURIComponent(charName)}`;
          container.appendChild(createButton('buttonFFLogs', 'tooltipFFLogs', [charName, serverName], url, 'fflogs-button', ICONS.fflogs));
        }

        // Tomestone
        if (result.showTomestone) {
          const slug = slugify(charName) || 'player';
          const url = `https://tomestone.gg/character/${lodestoneId}/${slug}`;
          container.appendChild(createButton('buttonTomestone', 'tooltipTomestone', [charName], url, 'tomestone-button', ICONS.tomestone));
        }

        // Achievements (Miniではデフォルト表示)
        if (result.showLalachievements) {
          const url = `https://www.lalachievements.com/ja/char/${lodestoneId}/`;
          container.appendChild(createButton('buttonAchievements', 'tooltipAchievements', [], url, 'lalachievements-button', ICONS.achievements));
        }

        nameBox.appendChild(container);
      });
    }
  }

  // --- ここから日記一覧用機能の移植 ---

  let selectedLogsUrls = new Set();
  let floatingPanel = null;

  function updateFloatingPanel() {
    if (!floatingPanel) {
      floatingPanel = document.createElement('div');
      floatingPanel.className = 'fflogs-floating-panel';
      
      const button = document.createElement('button');
      button.className = 'fflogs-open-selected-button';
      button.id = 'fflogs-open-selected';
      
      const svgIcon = `
        <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      `;
      button.innerHTML = `${svgIcon}<span id="fflogs-selected-count"></span>`;
      button.title = chrome.i18n.getMessage('tooltipOpenSelectedLogs') || '選択したLogsを別タブで開く';
      
      const clearButton = document.createElement('button');
      clearButton.className = 'fflogs-clear-selected-button';
      clearButton.textContent = chrome.i18n.getMessage('buttonClearSelected') || 'すべて解除';
      clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        selectedLogsUrls.clear();
        document.querySelectorAll('.fflogs-checkbox').forEach(cb => cb.checked = false);
        updateFloatingPanel();
      });

      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'fflogs-panel-button-group';
      clearButton.style.flex = '1';
      button.style.flex = '2';
      buttonGroup.appendChild(clearButton);
      buttonGroup.appendChild(button);

      const text = document.createElement('p');
      text.className = 'fflogs-panel-text';
      text.textContent = '選択したLogsを別タブで開きます';
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const urls = Array.from(selectedLogsUrls);
        urls.forEach((url, index) => {
          setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
          }, index * 300);
        });
      });
      
      floatingPanel.appendChild(buttonGroup);
      floatingPanel.appendChild(text);
      document.body.appendChild(floatingPanel);
    }
    
    const count = selectedLogsUrls.size;
    const countSpan = floatingPanel.querySelector('#fflogs-selected-count');
    if (countSpan) {
      countSpan.textContent = (chrome.i18n.getMessage('buttonOpenSelectedLogs', [count.toString()])) || `選択した ${count} 件の Logs を開く`;
    }
    
    if (count > 0) {
      floatingPanel.classList.add('is-active');
    } else {
      floatingPanel.classList.remove('is-active');
    }
  }

  function createFFLogsCheckbox(url) {
    const wrapper = document.createElement('label');
    wrapper.className = 'fflogs-checkbox-wrapper';
    wrapper.title = '一括で開く対象として選択';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'fflogs-checkbox';
    checkbox.value = url;
    
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedLogsUrls.add(url);
      } else {
        selectedLogsUrls.delete(url);
      }
      updateFloatingPanel();
    });
    
    if (selectedLogsUrls.has(url)) {
      checkbox.checked = true;
    }
    
    wrapper.appendChild(checkbox);
    return wrapper;
  }

  function createFFLogsMiniButton(characterName, serverName) {
    const button = document.createElement('a');
    button.className = 'fflogs-mini-button';
    
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="${ICONS.fflogs}"/>
      </svg>
    `;

    button.innerHTML = svgIcon;
    button.title = chrome.i18n.getMessage('tooltipFFLogsList', [characterName, serverName]) || `${characterName} (${serverName}) のFFLogsを開く`;
    
    const region = getRegionCode().toLowerCase();
    const searchUrl = `https://ja.fflogs.com/character/${region}/${encodeURIComponent(serverName)}/${encodeURIComponent(characterName)}`;
    button.href = searchUrl;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    button.addEventListener('click', (e) => e.stopPropagation());
    
    return button;
  }

  function insertBlogListButtons() {
    if (!chrome.runtime?.id) return;
    chrome.storage.sync.get({ showFFLogs: false }, (result) => {
      if (!result.showFFLogs) return;

      const entries = document.querySelectorAll('.entry__blog_block__search, .entry__blog_search');

      entries.forEach(entry => {
        if (entry.querySelector('.fflogs-mini-button')) return;

        let nameElement, serverElement, targetContainer;

        if (entry.classList.contains('entry__blog_block__search')) {
          nameElement = entry.querySelector('.entry__blog_block__search__chara__name');
          serverElement = entry.querySelector('.entry__blog_block__search__chara__world');
          targetContainer = entry.querySelector('.entry__blog_block__search__chara__box');
        } else {
          nameElement = entry.querySelector('.entry__blog_search__chara__name');
          serverElement = entry.querySelector('.entry__blog_search__chara__world');
          targetContainer = entry.querySelector('.entry__blog_search__chara');
        }

        if (nameElement && serverElement && targetContainer) {
          const name = nameElement.textContent.trim();
          const serverText = serverElement.textContent.trim();
          const serverMatch = serverText.match(/^([^\s\[\(]+)/);
          const server = serverMatch ? serverMatch[1] : serverText;
          
          const button = createFFLogsMiniButton(name, server);
          const checkbox = createFFLogsCheckbox(button.href);
          
          const wrapper = document.createElement('div');
          wrapper.className = 'fflogs-list-actions';
          wrapper.appendChild(button);
          wrapper.appendChild(checkbox);
          
          targetContainer.appendChild(wrapper);
        }
      });

      updateFloatingPanel();
    });
  }

  // --- 移植終了 ---

  // 初期化と監視
  let timeout = null;
  const debouncedInitialize = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(initialize, 200);
  };

  function initialize() {
    if (window.location.pathname.includes('/blog/')) {
      insertBlogListButtons();
    } else {
      insertButtons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  const observer = new MutationObserver((mutations) => {
    const isOurChange = mutations.some(m => 
      Array.from(m.addedNodes).some(n => n.classList && n.classList.contains('fflogs-button-container'))
    );
    if (!isOurChange) {
      debouncedInitialize();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
