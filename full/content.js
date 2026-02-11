// ロードストーンのキャラクターページにFFLogsボタンを追加

(function() {
  'use strict';

  // キャラクター名を取得
  function getCharacterName() {
    const nameElement = document.querySelector('.frame__chara__name');
    if (nameElement) {
      return nameElement.textContent.trim();
    }
    return null;
  }

  // ロードストーンIDを取得
  function getLodestoneId() {
    const match = window.location.pathname.match(/\/character\/(\d+)/);
    return match ? match[1] : null;
  }

  // キャラクター名をスラッグ化 (Tomestone.gg 用)
  function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  // サーバー名とデータセンター名を取得
  function getServerAndDcName() {
    const serverElement = document.querySelector('.frame__chara__world');
    if (serverElement) {
      const serverText = serverElement.textContent.trim();
      // "Tonberry [Elemental]" -> "Tonberry (Elemental)"
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

  // FFLogsボタンを作成
  function createFFLogsButton(characterName, serverName) {
    const button = document.createElement('a');
    button.className = 'fflogs-button';
    
    // SVGアイコン (Analytics/Chart)
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V11h2Zm0-8H11V7h2Z"/>
        <path d="M16 11V17H14V11H16Z" />
        <path d="M10 13V17H8V13H10Z" />
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>FFLogs</span>`;
    button.title = `${characterName} (${serverName}) をFFLogsで検索`;
    
    // FFLogsの検索URL
    const searchUrl = `https://ja.fflogs.com/character/jp/${encodeURIComponent(serverName)}/${encodeURIComponent(characterName)}`;
    button.href = searchUrl;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    return button;
  }

  // Tomestone.ggボタンを作成
  function createTomestoneButton(characterName, lodestoneId) {
    const button = document.createElement('a');
    button.className = 'tomestone-button';
    
    // SVGアイコン (Search/Profile)
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>Tomestone</span>`;
    button.title = `${characterName} をTomestone.ggで検索`;
    
    // Tomestone.ggの正確なURL形式 (https://tomestone.gg/character/{lodestoneId}/{slug})
    const slug = slugify(characterName);
    const searchUrl = `https://tomestone.gg/character/${lodestoneId}/${slug}`;
    button.href = searchUrl;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    return button;
  }

  // Lalachievementsボタンを作成
  function createLalachievementsButton(lodestoneId) {
    const button = document.createElement('a');
    button.className = 'lalachievements-button';
    
    // SVGアイコン (Trophy)
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.003,5c-0.101,0-0.2,0.012-0.297,0.034C18.667,2.83,16.897,1,14.739,1h-5.48C7.1,1,5.33,2.83,5.291,5.034 C5.195,5.012,5.096,5,4.995,5C3.344,5,2,6.344,2,7.995c0,1.268,0.793,2.341,1.913,2.77c0.686,2.871,3.012,5.105,5.922,5.59 c0.435,1.527,1.696,2.716,3.279,2.99V21h-3v2h9v-2h-3v-1.655c1.583-0.274,2.844-1.463,3.279-2.99 c2.911-0.485,5.237-2.719,5.922-5.59c1.12-0.428,1.913-1.502,1.913-2.77C21.998,6.344,20.655,5,19.003,5z M4,7.995 C4,7.447,4.448,7,4.995,7c0.12,0,0.233,0.021,0.339,0.06C5.112,7.361,5.034,7.671,5.008,7.995c-0.038,0.48,0.003,1.603,0.444,2.894 C4.619,10.297,4,9.219,4,7.995z M14,14c0,1.103-0.897,2-2,2s-2-0.897-2-2V3h4V14z M19.998,7.995c0,1.224-0.619,2.302-1.452,2.894 c0.441-1.291,0.482-2.414,0.444-2.894c-0.026-0.324-0.104-0.634-0.228-0.935C18.868,7.021,18.981,7,19.102,7 C19.649,7,20.098,7.447,20.098,7.995z"/>
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>Achievements</span>`;
    button.title = `Lalachievements でアチーブメントを確認`;
    
    // LalachievementsのURL形式
    const searchUrl = `https://www.lalachievements.com/ja/char/${lodestoneId}/`;
    button.href = searchUrl;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    return button;
  }

  // リージョンコードを取得
  function getRegionCode() {
    const host = window.location.hostname;
    if (host.startsWith('na.')) return 'NA';
    if (host.startsWith('eu.')) return 'EU';
    if (host.startsWith('de.') || host.startsWith('fr.')) return 'EU';
    return 'JP';
  }

  // FFLogsから最新のランキングデータを取得
  async function fetchBestPerformance(characterName, serverName, apiKey) {
    try {
      const region = getRegionCode();
      const commonQuery = `metric=rdps&api_key=${apiKey}`;
      const rankingUrl = `https://www.fflogs.com/v1/rankings/character/${encodeURIComponent(characterName)}/${encodeURIComponent(serverName)}/${region}?${commonQuery}`;
      const histParseUrl = `https://www.fflogs.com/v1/parses/character/${encodeURIComponent(characterName)}/${encodeURIComponent(serverName)}/${region}?timeframe=historical&${commonQuery}`;
      
      const [rankingRes, histParseRes] = await Promise.all([
        fetch(rankingUrl),
        fetch(histParseUrl)
      ]);
      
      if (!rankingRes.ok || !histParseRes.ok) throw new Error('API request failed');
      
      const rankingData = await rankingRes.json();
      const histParseData = await histParseRes.json();

      if (!rankingData || !Array.isArray(rankingData) || rankingData.length === 0) return null;

      // 1. 最新の「零式(Difficulty: 101)」レイドティアを探す
      let targetZoneId = -1;
      let targetZoneName = '';
      let hasSavage = false;

      rankingData.forEach(entry => {
        const isSavage = entry.difficulty === 101;
        if (isSavage) {
          if (!hasSavage || entry.zoneID > targetZoneId) {
            targetZoneId = entry.zoneID;
            targetZoneName = entry.zoneName;
            hasSavage = true;
          }
        }
      });

      if (!hasSavage) {
        rankingData.forEach(entry => {
          if (entry.zoneID > targetZoneId) {
            targetZoneId = entry.zoneID;
            targetZoneName = entry.zoneName;
          }
        });
      }

      // 2. 特定したZoneの各ボスの数値を抽出
      const encounterMap = {};
      
      // parsesデータから Historical Best を抽出
      histParseData.forEach(entry => {
        if (entry.zoneID === targetZoneId) {
          if (hasSavage && entry.difficulty !== 101) return;
          const encId = entry.encounterID;
          if (!encounterMap[encId] || entry.percentile > encounterMap[encId].historical) {
            encounterMap[encId] = {
              name: entry.encounterName,
              historical: entry.percentile,
              id: encId
            };
          }
        }
      });

      // 3. ボスをID順にソートし、結果を整形
      const sortedEncounters = Object.values(encounterMap).sort((a, b) => a.id - b.id);
      const results = sortedEncounters.map((enc, index) => {
        let label = `${index + 1}`;
        if (sortedEncounters.length === 5 && index === 4) {
          label = "4後";
        }
        
        return {
          label: label,
          fullName: enc.name,
          historical: Math.floor(enc.historical)
        };
      });

      if (results.length === 0) return null;
      
      return {
        zoneName: targetZoneName || '最新コンテンツ',
        encounters: results
      };
    } catch (error) {
      console.error('FFLogs API Error:', error);
      return null;
    }
  }

  // バッジのCSSクラスを取得
  function getRankClass(percent) {
    if (percent >= 100) return 'rank-100';
    if (percent >= 99) return 'rank-99';
    if (percent >= 95) return 'rank-95';
    if (percent >= 75) return 'rank-75';
    if (percent >= 50) return 'rank-50';
    if (percent >= 25) return 'rank-25';
    return 'rank-0';
  }

  // ボタンを挿入
  async function insertButton() {
    // 既にボタンコンテナまたは挿入中マーカーが存在する場合はスキップ
    if (document.querySelector('.fflogs-button-container') || document.querySelector('.fflogs-inserting')) {
      return;
    }

    const characterName = getCharacterName();
    const serverName = getServerName();

    if (!characterName || !serverName) return;

    // キャラクター名の親要素を取得
    const nameElement = document.querySelector('.frame__chara__name');
    if (!nameElement) return;

    // ボタンを表示
    const nameBox = nameElement.closest('.frame__chara__box');
    if (nameBox) {
      // 挿入中マーカーを追加（同期的に実行して二重実行を防ぐ）
      const marker = document.createElement('div');
      marker.className = 'fflogs-inserting';
      marker.style.display = 'none';
      nameBox.appendChild(marker);

      // 設定を取得してボタンを表示
      chrome.storage.sync.get({
        showFFLogs: false,
        showTomestone: false,
        showLalachievements: true,
        fflogsApiKey: ''
      }, async (result) => {
        // コンテナがすでに作成されていないか再確認
        if (document.querySelector('.fflogs-button-container')) {
          marker.remove();
          return;
        }

        const container = document.createElement('div');
        container.className = 'fflogs-button-container';
        
        let hasButtons = false;

        // FFLogsボタン
        if (result.showFFLogs) {
          const mainButton = createFFLogsButton(characterName, serverName);
          container.appendChild(mainButton);
          hasButtons = true;
        }

        // Tomestone / Lalachievementsボタン
        const lodestoneId = getLodestoneId();
        if (lodestoneId) {
          if (result.showTomestone) {
            const tomestoneButton = createTomestoneButton(characterName, lodestoneId);
            container.appendChild(tomestoneButton);
            hasButtons = true;
          }
          
          if (result.showLalachievements) {
            const lalachievementsButton = createLalachievementsButton(lodestoneId);
            container.appendChild(lalachievementsButton);
            hasButtons = true;
          }
        }

        // スコアエリアのプレースホルダー
        const scoresWrapper = document.createElement('div');
        scoresWrapper.className = 'fflogs-scores-wrapper';
        container.appendChild(scoresWrapper);
        
        // ボタンが一つもなくても、スコア（バッジ）は表示設定（FFLogs設定）に依存するため、
        // コンテナ自体は追加する。ただし空のコンテナが浮かないように配慮。
        nameBox.appendChild(container);

        // APIキーの取得とデータ反映
        if (result.showFFLogs && result.fflogsApiKey) {
          // ローディング表示
          const loadingBadge = document.createElement('div');
          loadingBadge.className = 'fflogs-scores-grid fflogs-loading';
          loadingBadge.textContent = 'FFLogsからデータを取得中...';
          scoresWrapper.appendChild(loadingBadge);

          const res = await fetchBestPerformance(characterName, serverName, result.fflogsApiKey);
          
          if (res && res.encounters && res.encounters.length > 0) {
            loadingBadge.remove();

            // スコアカウンターの作成
            const grid = document.createElement('div');
            grid.className = 'fflogs-scores-grid';
            
            // 最新コンテンツ名の表示
            const title = document.createElement('div');
            title.style.width = '100%';
            title.style.fontSize = '10px';
            title.style.color = 'rgba(0,0,0,0.5)';
            title.style.marginBottom = '4px';
            title.style.fontWeight = '700';
            title.textContent = `LATEST: ${res.zoneName.toUpperCase()}`;
            grid.appendChild(title);

            res.encounters.forEach((enc, index) => {
              const b = document.createElement('div');
              b.className = `fflogs-badge ${getRankClass(enc.historical)}`;
              b.style.animationDelay = `${index * 0.1}s`; // 順次表示
              
              // 数字なら「層」を付ける
              const labelText = /^\d+$/.test(enc.label) ? `${enc.label}層` : enc.label;
              
              // Historical のみを表示
              b.innerHTML = `
                <span class="fflogs-badge-label">${labelText}</span>
                <span class="fflogs-value-main">${enc.historical}</span>
              `;
              
              b.title = `${res.zoneName} - ${enc.fullName}\nBest: ${enc.historical}%`;
              grid.appendChild(b);
            });
            scoresWrapper.appendChild(grid);
          } else {
            loadingBadge.remove();
          }
        }
        
        // 挿入完了後、マーカーを削除
        marker.remove();
      });
    }

    console.log('FFLogs Extension: Button insertion logic executed with visibility settings');
  }

  // ページ読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertButton);
  } else {
    insertButton();
  }

  // 動的な変更を監視（SPAの場合に備えて）
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('.frame__chara__name') && !document.querySelector('.fflogs-button-container')) {
      insertButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
