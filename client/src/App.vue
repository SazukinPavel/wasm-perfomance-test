<template>
  <n-config-provider :theme="darkTheme">
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-global-style />
        <n-loading-bar-provider>
          <router-view/>
        </n-loading-bar-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import {
  darkTheme,
  NConfigProvider,
  NGlobalStyle,
  NLoadingBarProvider,
  NNotificationProvider
} from 'naive-ui'
</script>
