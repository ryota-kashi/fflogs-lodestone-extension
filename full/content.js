// ロードストーンのキャラクターページにFFLogsボタンを追加

(function() {
  'use strict';

  // キャラクター名を取得
  function getCharacterName() {
    // プロフィールページ用セレクタ
    let nameElement = document.querySelector('.frame__chara__name');
    // 日記ページ（サイドバー）用セレクタ
    if (!nameElement) nameElement = document.querySelector('.entry__column__name');
    
    if (nameElement) {
      return nameElement.textContent.trim();
    }
    return null;
  }

  // ロードストーンIDを取得
  function getLodestoneId() {
    // パスから /character/直後の数字のみを抽出する
    const match = window.location.pathname.match(/\/character\/(\d+)(?:\/|$)/);
    return match ? match[1] : null;
  }

  // キャラクター名をスラッグ化 (Tomestone.gg 用)
  function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  // サーバー名とデータセンター名を取得
  function getServerAndDcName() {
    // プロフィールページ用セレクタ
    let serverElement = document.querySelector('.frame__chara__world');
    // 日記ページ（サイドバー）用セレクタ
    if (!serverElement) serverElement = document.querySelector('.entry__column__world');

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
    
    // FFLogsの検索URL (リージョンを動的に判定)
    const region = getRegionCode().toLowerCase();
    const searchUrl = `https://ja.fflogs.com/character/${region}/${encodeURIComponent(serverName)}/${encodeURIComponent(characterName)}`;
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

  // xivanalysisボタンを作成
  function createXivAnalysisButton(reportId, fightId) {
    const button = document.createElement('a');
    button.className = 'xivanalysis-button';
    
    // SVGアイコン (Analysis/Lightning)
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>xivanalysis</span>`;
    button.title = `このレポートをxivanalysisで分析`;
    
    // xivanalysisのURL形式 (https://xivanalysis.com/fflogs/{reportId}/{fightId})
    const analysisUrl = `https://xivanalysis.com/fflogs/${reportId}/${fightId}`;
    button.href = analysisUrl;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    return button;
  }

  // FFLogsレポートページからレポートIDとファイトIDを取得
  function getFFLogsIds() {
    const pathParts = window.location.pathname.split('/');
    const reportIndex = pathParts.indexOf('reports');
    if (reportIndex === -1 || reportIndex + 1 >= pathParts.length) return null;
    
    const reportId = pathParts[reportIndex + 1];
    const urlParams = new URLSearchParams(window.location.search);
    let fightId = urlParams.get('fight');
    
    // fight=last の場合、または fight パラメータがない場合は、DOMから実際の数値を抽出を試みる
    if (!fightId || fightId === 'last') {
      // 1. ページ内のリンクから数値を抽出
      // 注意: FFLogsでは現在選択中のfightのリンクは全て fight=last のまま保持される
      // そのため、数値fightIDは「他のfight」へのナビゲーションリンクにのみ存在する
      // fight=last = 最後のfight なので、他fightの最大値 + 1 が正しいfight番号となる
      const links = Array.from(document.querySelectorAll('a[href*="fight="]'));
      const fightIdNumbers = links
        .map(link => {
          const match = link.href.match(/[?&]fight=(\d+)/);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null && !isNaN(n));

      if (fightIdNumbers.length > 0) {
        // fight=last は最後の戦闘を指すため、他fightの最大値 + 1 が実際のfight番号
        fightId = (Math.max(...fightIdNumbers) + 1).toString();
      } else {
        // 数値のfight IDが一つもない場合 = レポートに1つしかfightがない
        fightId = '1';
      }

      // 2. まだ取れない場合は戦闘選択ドロップダウンをチェック
      if (!fightId || fightId === 'last') {
        const fightSelect = document.querySelector('#filter-fight-and-phase .Select-input input, #fight-select');
        if (fightSelect && fightSelect.value && !isNaN(fightSelect.value)) {
          fightId = fightSelect.value;
        } 
      }

      // 3. 最後の戦闘（last）の数値IDを探す (ドロップダウンの最後の項目)
      if (!fightId || fightId === 'last') {
        const lastFightOption = document.querySelector('#fight-select option:last-child');
        if (lastFightOption && lastFightOption.value && !isNaN(lastFightOption.value)) {
          fightId = lastFightOption.value;
        }
      }

      // 4. それでも取れない場合はフォールバック
      // ただし、xivanalysis は last を受け付けないので、可能な限り数値にしたい
      fightId = fightId || 'last';
    }
    
    return { reportId, fightId };
  }

  // FFLogsのレポートメニューにボタンを挿入
  function insertFFLogsxivanalysisButton() {
    console.log('FFLogs Extension: Attempting to insert/update xivanalysis button');
    
    const ids = getFFLogsIds();
    if (!ids) {
      console.log('FFLogs Extension: Could not get report/fight IDs');
      return;
    }

    const newUrl = `https://xivanalysis.com/fflogs/${ids.reportId}/${ids.fightId}`;
    const existingButton = document.querySelector('.xivanalysis-button');

    if (existingButton) {
      if (existingButton.href !== newUrl) {
        console.log('FFLogs Extension: Updating existing button URL to', newUrl);
        existingButton.href = newUrl;
      }
      return;
    }

    // 挿入先を探す (最優先はユーザーが提示したエリア付近)
    let foundTarget = null;
    let injectionMethod = 'afterend'; // 要素の直後に入れる

    // 候補1: 戦闘切り替えエリアのコンテナ
    foundTarget = document.querySelector('#filter-fight-and-phase');
    if (foundTarget) {
      console.log('FFLogs Extension: Found filter-fight-and-phase container');
    } else {
      // 候補2: ボス選択部分の直後
      foundTarget = document.querySelector('#filter-fight-boss-wrapper');
      if (foundTarget) console.log('FFLogs Extension: Found filter-fight-boss-wrapper');
    }

    // 候補3: 設定ボタン (画面右上)
    if (!foundTarget) {
      foundTarget = document.querySelector('#report-settings-dropdown') || 
                    document.querySelector('.report-header-settings');
      if (foundTarget) {
        injectionMethod = 'beforebegin';
        console.log('FFLogs Extension: Found Settings button');
      }
    }

    // 候補4: 分析 (Analyze) タブ
    if (!foundTarget) {
      const analyzeTab = Array.from(document.querySelectorAll('a, span')).find(el => 
        el.textContent.includes('Analyze') || el.textContent.includes('分析')
      );
      if (analyzeTab) {
        foundTarget = analyzeTab.closest('li') || analyzeTab;
        injectionMethod = 'beforebegin';
        console.log('FFLogs Extension: Found Analyze tab');
      }
    }

    if (!foundTarget) {
      console.log('FFLogs Extension: No suitable target element found after all fallbacks');
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'xivanalysis-button-wrapper';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.marginLeft = '15px';
    wrapper.style.marginRight = '10px';
    wrapper.style.verticalAlign = 'middle';
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.style.zIndex = '1000';
    
    const button = createXivAnalysisButton(ids.reportId, ids.fightId);
    wrapper.appendChild(button);
    
    // 挿入
    foundTarget.insertAdjacentElement(injectionMethod, wrapper);
    console.log('FFLogs Extension: xivanalysis button successfully injected', injectionMethod, foundTarget.tagName, foundTarget.id || foundTarget.className);
  }

  // リージョンコードを取得
  function getRegionCode() {
    // データセンター名からリージョンを判定するのが最も確実
    const serverAndDc = getServerAndDcName();
    let region = 'JP'; // デフォルト

    if (serverAndDc) {
      if (serverAndDc.includes('Elemental') || serverAndDc.includes('Gaia') || 
          serverAndDc.includes('Mana') || serverAndDc.includes('Meteor')) region = 'JP';
      else if (serverAndDc.includes('Aether') || serverAndDc.includes('Primal') || 
          serverAndDc.includes('Crystal') || serverAndDc.includes('Dynamis')) region = 'NA';
      else if (serverAndDc.includes('Chaos') || serverAndDc.includes('Light')) region = 'EU';
      else if (serverAndDc.includes('Materia')) region = 'OC';
      else {
        // DC名が見つからない、または未知の場合のみホスト名フォールバック
        const host = window.location.hostname;
        if (host.startsWith('na.')) region = 'NA';
        else if (host.startsWith('eu.')) region = 'EU';
        else if (host.startsWith('de.') || host.startsWith('fr.')) region = 'EU';
      }
    }

    console.log(`FFLogs Extension Debug: Character="${getCharacterName()}", Server="${getServerName()}", Region="${region}"`);
    return region;
  }

  // FFLogsから最新のランキングデータを取得
  async function fetchBestPerformance(characterName, serverName, apiKey) {
    try {
      const region = getRegionCode();
      const commonQuery = `metric=rdps&api_key=${apiKey}`;
      const rankingUrl = `https://www.fflogs.com/v1/rankings/character/${encodeURIComponent(characterName)}/${encodeURIComponent(serverName)}/${region}?${commonQuery}`;
      const histParseUrl = `https://www.fflogs.com/v1/parses/character/${encodeURIComponent(characterName)}/${encodeURIComponent(serverName)}/${region}?timeframe=historical&${commonQuery}`;
      const zonesUrl = `https://www.fflogs.com/v1/zones?api_key=${apiKey}`;
      
      // 全てのデータを並列で取得。ただし zones の失敗で全体が止まらないよう個別ハンドリング
      const [rankingRes, histParseRes, zonesData] = await Promise.all([
        fetch(rankingUrl),
        fetch(histParseUrl),
        fetch(zonesUrl).then(res => res.ok ? res.json() : null).catch(() => null)
      ]);
      
      if (!rankingRes.ok || !histParseRes.ok) {
        console.error('FFLogs API Error Details:', {
          rankingStatus: rankingRes.status,
          rankingUrl: rankingUrl,
          parseStatus: histParseRes.ok ? 200 : histParseRes.status,
          parseUrl: histParseUrl
        });
        throw new Error(`Ranking or Parse API request failed (Ranking: ${rankingRes.status}, Parse: ${histParseRes.status})`);
      }
      
      const rankingData = await rankingRes.json();
      const histParseData = await histParseRes.json();

      if (!rankingData || !Array.isArray(rankingData)) return null;

      // 1. 最新の「零式(Difficulty: 101)」レイドティアを探す
      let targetZoneId = -1;
      let targetZoneName = '';
      let hasSavage = false;

      // RankingデータからZoneIdを探す
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

      // Rankingデータから取得できなかった場合（未使用の最新コンテンツ等）、Parseデータから探す
      if (targetZoneId === -1 && Array.isArray(histParseData)) {
        histParseData.forEach(entry => {
          if (entry.zoneID > targetZoneId) {
            targetZoneId = entry.zoneID;
            targetZoneName = entry.zoneName;
          }
        });
      }

      if (targetZoneId === -1) return null;

      // 2. ゾーン内の全エンカウンター定義を取得
      let targetZone = null;
      if (Array.isArray(zonesData)) {
        // v1/zones は拡張パッケージ(Expansions)の配列の中に zones が入っている場合があるため、再帰的に探す
        for (const item of zonesData) {
          if (item.id === targetZoneId && (item.encounters || item.zones)) {
            targetZone = item;
            break;
          }
          if (item.zones && Array.isArray(item.zones)) {
            const found = item.zones.find(z => z.id === targetZoneId);
            if (found) {
              targetZone = found;
              break;
            }
          }
        }
      }

      // 3. 特定したZoneの各ボスの数値を抽出
      const encounterMap = {};
      if (Array.isArray(histParseData)) {
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
      }

      // 4. マッピング
      const results = [];
      if (targetZone && targetZone.encounters) {
        // 完璧なマッピング（定義リストに基づく）
        const zoneEncounters = targetZone.encounters.sort((a, b) => a.id - b.id);
        zoneEncounters.forEach((def, index) => {
          const recorded = encounterMap[def.id];
          let label = `${index + 1}`;
          if (zoneEncounters.length === 5 && index === 4) label = "4後";
          
          results.push({
            label: label,
            fullName: recorded ? recorded.name : def.name,
            historical: recorded ? Math.floor(recorded.historical) : '-'
          });
        });
      } else {
        // フォールバック: IDの最小値からの差分で階層を推測
        const sortedEncounters = Object.values(encounterMap).sort((a, b) => a.id - b.id);
        
        // ログがあるものから最大階層を推測（通常は4層、前後編で5）
        let maxIndex = 3; // デフォルト4層分
        if (sortedEncounters.length > 0) {
          const minId = sortedEncounters[0].id;
          const lastId = sortedEncounters[sortedEncounters.length - 1].id;
          maxIndex = Math.max(3, lastId - minId);
        }

        for (let i = 0; i <= maxIndex; i++) {
          const minId = sortedEncounters.length > 0 ? sortedEncounters[0].id : 0;
          const recorded = sortedEncounters.find(enc => enc.id === minId + i);
          
          let label = `${i + 1}`;
          if (i === 4) label = "4後";
          
          results.push({
            label: label,
            fullName: recorded ? recorded.name : `第${i + 1}ステージ`,
            historical: recorded ? Math.floor(recorded.historical) : '-'
          });
        }
      }

      if (results.length === 0) return null;
      
      return {
        zoneName: targetZoneName || (targetZone ? targetZone.name : '最新コンテンツ'),
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
    const nameElement = document.querySelector('.frame__chara__name, .entry__column__name');
    if (!nameElement) return;

    // ボタンを表示する親コンテナ
    const nameBox = nameElement.closest('.frame__chara__box, .entry__column__box');
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
  function initialize() {
    const host = window.location.hostname;
    if (host.includes('fflogs.com')) {
      // LogsトグルがONの場合のみxivanalysisボタンを表示
      chrome.storage.sync.get({ showFFLogs: false }, (items) => {
        if (items.showFFLogs) {
          insertFFLogsxivanalysisButton();
        }
      });
    } else if (host.includes('finalfantasyxiv.com')) {
      insertButton();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // 動的な変更を監視
  const observer = new MutationObserver((mutations) => {
    const host = window.location.hostname;
    if (host.includes('fflogs.com')) {
      // LogsトグルがONの場合のみxivanalysisボタンを表示
      chrome.storage.sync.get({ showFFLogs: false }, (items) => {
        if (items.showFFLogs) {
          insertFFLogsxivanalysisButton();
        }
      });
    } else if (host.includes('finalfantasyxiv.com')) {
      const hasName = document.querySelector('.frame__chara__name, .entry__column__name');
      if (hasName && !document.querySelector('.fflogs-button-container')) {
        insertButton();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
