(() => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const basePath = window.location.pathname.includes('/modules/') ? '../' : './';
      await navigator.serviceWorker.register(`${basePath}sw.js`, { scope: basePath });
    } catch (error) {
      console.error('PWA service worker registration failed:', error);
    }
  });

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    let installButton = document.getElementById('installAppButton');
    if (!installButton) {
      installButton = document.createElement('button');
      installButton.id = 'installAppButton';
      installButton.type = 'button';
      installButton.textContent = 'Install App';
      installButton.setAttribute('aria-label', 'Install ROS2 Mastery Dojo app');
      installButton.style.position = 'fixed';
      installButton.style.right = '1rem';
      installButton.style.bottom = '1rem';
      installButton.style.zIndex = '999';
      installButton.style.border = '3px solid #ffffff';
      installButton.style.background = '#e11d2f';
      installButton.style.color = '#ffffff';
      installButton.style.padding = '0.5rem 0.75rem';
      installButton.style.fontFamily = '"Press Start 2P", monospace';
      installButton.style.fontSize = '0.62rem';
      installButton.style.cursor = 'pointer';
      installButton.style.borderRadius = '0';
      document.body.appendChild(installButton);
    }

    installButton.hidden = false;
    installButton.onclick = async () => {
      installButton.hidden = true;
      if (!deferredPrompt) {
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    };
  });

  window.addEventListener('appinstalled', () => {
    const installButton = document.getElementById('installAppButton');
    if (installButton) {
      installButton.remove();
    }
    deferredPrompt = null;
  });
})();
