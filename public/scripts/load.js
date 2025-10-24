(function() {
    window.addEventListener('load', function() {
        const [navigationEntry] = performance.getEntriesByType('navigation');
        if (navigationEntry) {
            const loadTime = navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;
            const footer = document.createElement('div');
            footer.textContent = `Скорость загрузки страницы: ${Math.round(loadTime)} мс`;
            footer.style.textAlign = 'center';
            footer.style.padding = '10px';
            document.body.appendChild(footer);
        }
    });
})();
