<script setup lang="ts">
</script>

<template>
  <footer class="app-footer">
    <div class="footer-buttons">
      <a 
        href="https://github.com/alexyvanot/functionnal_graphes" 
        target="_blank" 
        class="footer-btn github-btn"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        Contribute
      </a>
      <a 
        href="https://alexyvanot.fr/projects/functionnal-graphes" 
        target="_blank" 
        class="footer-btn portfolio-btn"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Portfolio
      </a>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.github-btn {
  background: #24292f;
  color: #fff;
  border: 1px solid #24292f;
}

.github-btn:hover {
  background: #32383f;
  border-color: #32383f;
}

.portfolio-btn {
  background: #fff;
  color: #24292f;
  border: 1px solid #d1d5da;
}

.portfolio-btn:hover {
  background: #f6f8fa;
  border-color: #24292f;
}

.footer-btn svg {
  flex-shrink: 0;
}
</style>
