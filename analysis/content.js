(function() {
  'use strict';

  // xivanalysisボタンを作成
  function createXivAnalysisButton(reportId, fightId) {
    const button = document.createElement('a');
    button.className = 'xivanalysis-button';
    
    // SVGアイコン (Lightning)
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>xivanalysis</span>`;
    button.title = `このレポートをxivanalysisで分析`;
    
    const analysisUrl = `https://xivanalysis.com/fflogs/${reportId}/${fightId}`;
    button.href = analysisUrl;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    return button;
  }

  // xivanalysis 個人用ボタンを作成
  function createXivAnalysisPersonalButton(reportId, fightId, sourceId) {
    const button = document.createElement('a');
    button.className = 'xivanalysis-personal-button';
    
    // SVGアイコン (Person)
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>個人</span>`;
    button.title = `この個人のログをxivanalysisで分析`;
    
    const analysisUrl = `https://xivanalysis.com/fflogs/${reportId}/${fightId}/${sourceId}`;
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
    
    if (!fightId || fightId === 'last') {
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

      if (!fightId || fightId === 'last') {
        const fightSelect = document.querySelector('#filter-fight-and-phase .Select-input input, #fight-select');
        if (fightSelect && fightSelect.value && !isNaN(fightSelect.value)) {
          fightId = fightSelect.value;
        } 
      }

      if (!fightId || fightId === 'last') {
        const lastFightOption = document.querySelector('#fight-select option:last-child');
        if (lastFightOption && lastFightOption.value && !isNaN(lastFightOption.value)) {
          fightId = lastFightOption.value;
        }
      }
      fightId = fightId || 'last';
    }
    
    return { reportId, fightId, sourceId: urlParams.get('source') };
  }

  // FFLogsのレポートメニューにボタンを挿入
  function insertXivanalysisButton() {
    const ids = getFFLogsIds();
    if (!ids) return;

    const newUrl = `https://xivanalysis.com/fflogs/${ids.reportId}/${ids.fightId}`;
    const newPersonalUrl = ids.sourceId ? `https://xivanalysis.com/fflogs/${ids.reportId}/${ids.fightId}/${ids.sourceId}` : null;
    const existingButton = document.querySelector('.xivanalysis-button');
    const existingPersonalButton = document.querySelector('.xivanalysis-personal-button');

    if (existingButton) {
      // パーティ全体ボタンのURL更新
      if (existingButton.href !== newUrl) {
        existingButton.href = newUrl;
      }
      // 個人用ボタンの更新
      if (newPersonalUrl) {
        if (existingPersonalButton) {
          if (existingPersonalButton.href !== newPersonalUrl) {
            existingPersonalButton.href = newPersonalUrl;
          }
        } else {
          // 個人用ボタンが未作成なら追加
          const wrapper = existingButton.closest('.xivanalysis-button-wrapper');
          if (wrapper) {
            const personalButton = createXivAnalysisPersonalButton(ids.reportId, ids.fightId, ids.sourceId);
            wrapper.appendChild(personalButton);
          }
        }
      } else if (existingPersonalButton) {
        // sourceがなくなった場合は個人ボタンを削除
        existingPersonalButton.remove();
      }
      return;
    }

    // 挿入先候補
    let foundTarget = null;
    let injectionMethod = 'afterend';

    // 1. 戦闘切り替えエリア
    foundTarget = document.querySelector('#filter-fight-and-phase');
    
    // 2. ボス選択部分の直後
    if (!foundTarget) {
      foundTarget = document.querySelector('#filter-fight-boss-wrapper');
    }

    // 3. 設定ボタン (画面右上)
    if (!foundTarget) {
      foundTarget = document.querySelector('#report-settings-dropdown') || 
                    document.querySelector('.report-header-settings');
      if (foundTarget) injectionMethod = 'beforebegin';
    }

    if (!foundTarget) return;

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

    // sourceパラメータがある場合は個人用ボタンも追加
    if (ids.sourceId) {
      const personalButton = createXivAnalysisPersonalButton(ids.reportId, ids.fightId, ids.sourceId);
      wrapper.appendChild(personalButton);
    }
    
    foundTarget.insertAdjacentElement(injectionMethod, wrapper);
  }

  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertXivanalysisButton);
  } else {
    insertXivanalysisButton();
  }

  // 動的な変更を監視
  const observer = new MutationObserver(() => {
    insertXivanalysisButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
