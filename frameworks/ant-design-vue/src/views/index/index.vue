<template>
  <div class="home">
    <div id="charts"></div>
    <a-button type="primary" @click="$router.push('/detail/100010')">查看详情</a-button>
  </div>
</template>

<script>
export { default } from './index.js';
</script>

<style scoped lang="less">
@import url(index.less);
</style>