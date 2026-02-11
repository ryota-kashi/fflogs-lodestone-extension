(function() {
  'use strict';

  function getLodestoneId() {
    const match = window.location.pathname.match(/\/character\/(\d+)/);
    return match ? match[1] : null;
  }

  function createLalachievementsButton(lodestoneId) {
    const button = document.createElement('a');
    button.className = 'lalachievements-button';
    
    const svgIcon = `
      <svg class="fflogs-button-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.003,5c-0.101,0-0.2,0.012-0.297,0.034C18.667,2.83,16.897,1,14.739,1h-5.48C7.1,1,5.33,2.83,5.291,5.034 C5.195,5.012,5.096,5,4.995,5C3.344,5,2,6.344,2,7.995c0,1.268,0.793,2.341,1.913,2.77c0.686,2.871,3.012,5.105,5.922,5.59 c0.435,1.527,1.696,2.716,3.279,2.99V21h-3v2h9v-2h-3v-1.655c1.583-0.274,2.844-1.463,3.279-2.99 c2.911-0.485,5.237-2.719,5.922-5.59c1.12-0.428,1.913-1.502,1.913-2.77C21.998,6.344,20.655,5,19.003,5z M4,7.995 C4,7.447,4.448,7,4.995,7c0.12,0,0.233,0.021,0.339,0.06C5.112,7.361,5.034,7.671,5.008,7.995c-0.038,0.48,0.003,1.603,0.444,2.894 C4.619,10.297,4,9.219,4,7.995z M14,14c0,1.103-0.897,2-2,2s-2-0.897-2-2V3h4V14z M19.998,7.995c0,1.224-0.619,2.302-1.452,2.894 c0.441-1.291,0.482-2.414,0.444-2.894c-0.026-0.324-0.104-0.634-0.228-0.935C18.868,7.021,18.981,7,19.102,7 C19.649,7,20.098,7.447,20.098,7.995z"/>
      </svg>
    `;

    button.innerHTML = `${svgIcon}<span>Achievements</span>`;
    button.title = `Lalachievements でアチーブメントを確認`;
    button.href = `https://www.lalachievements.com/ja/char/${lodestoneId}/`;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    return button;
  }

  function insertButton() {
    if (document.querySelector('.lalachievements-button-container')) return;

    const nameElement = document.querySelector('.frame__chara__name');
    if (!nameElement) return;

    const nameBox = nameElement.closest('.frame__chara__box');
    const lodestoneId = getLodestoneId();
    if (nameBox && lodestoneId) {
      const container = document.createElement('div');
      container.className = 'lalachievements-button-container';
      
      const button = createLalachievementsButton(lodestoneId);
      container.appendChild(button);
      
      nameBox.appendChild(container);
    }
  }

  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertButton);
  } else {
    insertButton();
  }

  // 動的な監視
  const observer = new MutationObserver(() => {
    if (document.querySelector('.frame__chara__name') && !document.querySelector('.lalachievements-button-container')) {
      insertButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
