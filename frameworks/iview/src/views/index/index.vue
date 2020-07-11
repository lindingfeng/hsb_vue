<template>
  <div class="home">
    <div id="charts"></div>
    <i-button type="primary" @click="$router.push('/detail/100010')">查看详情</i-button>
  </div>
</template>

<script>
export { default } from './index.js';
</script>

<style scoped lang="less">
@import url(index.less);
</style>