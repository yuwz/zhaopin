<template>
  <div class="content">
    <van-nav-bar class="navBar"  >
  <template #left>
    <van-icon name="arrow-left" color="black" @click="onClickLeft" size="18" />
  </template>
</van-nav-bar>
  </div>
</template>

<script>
export default {
    name: 'hrMessageDetail',
    data() {
        return {
            property: 'value',
        };
    },
    methods: {
        onClickLeft() {
      window.history.go(-1)
    },
    }
}
</script>

<style lang="less" scoped>

</style>