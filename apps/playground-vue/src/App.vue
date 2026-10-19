<script setup lang="ts">
defineProps<{ label?: string }>();
</script>

<template>
  <div class="page">
    <header>Sweet Crumb — Vue demo</header>
    <section class="hero">
      <h1>Same weak CTA for Vue inspect</h1>
      <div class="spacer" />
      <button type="button" class="cta-primary">Order now</button>
    </section>
  </div>
</template>

<style scoped>
.page {
  font-family: Georgia, serif;
  background: #faf6ef;
  min-height: 100vh;
}
header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8dfd0;
  font-weight: 700;
}
.hero {
  padding: 24px 20px 80px;
}
.spacer {
  height: 55vh;
}
.cta-primary {
  height: 32px;
  font-size: 13px;
  padding: 0 14px;
  background: #c4a574;
  color: #e8dfd0;
  border: none;
  border-radius: 4px;
}
</style>
