<template>
  <div class="button-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup'
}
</script>

<style scoped>
.button-group{
  height: 50px;
  line-height: 50px;
  padding-left: 15px;
}
</style>
