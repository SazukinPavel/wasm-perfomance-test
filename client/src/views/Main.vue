<script setup lang="ts">
import {
  NLayout,
  useLoadingBar,
  NInputNumber,
  NCard,
  NButton,
  NH1,
  NText,
  useNotification
} from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import fibonacci from '@/lib/fibonacci'

type TestResult = {
  js?: {
    duration: number
  }
  wasm?: {
    duration?: number
  }
  argument?: number
  complete: boolean
}

const loadingBar = useLoadingBar()
const notification = useNotification()

const wasm = ref<WebAssembly.WebAssemblyInstantiatedSource | null>(null)
const isRunLoading = ref(false)
const argument = ref<number | undefined>()
const result = ref<TestResult>({ complete: false })

const fibonacciWasm = computed(() => wasm.value?.instance.exports.fibonacci as Function)

onMounted(async () => {
  try {
    loadingBar.start()
    const res = await fetch('lib_bg.wasm')
    const buffer = await res.arrayBuffer()
    wasm.value = await WebAssembly.instantiate(buffer)
  } finally {
    loadingBar.finish()
  }
})

const fibonacciRun = async () => {
  if (!argument.value) {
    return notification.error({ content: 'Argument required', duration: 2000 })
  }

  isRunLoading.value = true
  result.value.complete = false

  try {
    result.value.argument = argument.value

    const startJS = Date.now()
    fibonacci(argument.value)

    result.value.js = { duration: Date.now() - startJS }

    const startWASM = Date.now()
    fibonacciWasm.value(argument.value)

    result.value.wasm = { duration: Date.now() - startWASM }

    result.value.complete = true
  } finally {
    isRunLoading.value = false
  }
}
</script>

<template>
  <n-layout>
    <n-h1 style="text-align: center">JavaScript vs WebAssembly Rust</n-h1>
    <n-card class="example" title="Fibonacci">
      <div class="runner">
        <n-input-number v-model:value.number="argument" placeholder="Argument" />
        <n-button :loading="isRunLoading" @click="fibonacciRun">Run</n-button>
        <div class="result" v-if="result.complete">
          <n-text>JS: {{ result.js?.duration }} MS</n-text>
          <n-text>WASM: {{ result.wasm?.duration }} MS</n-text>
          <n-text
            >Difference:
            {{
              result.js?.duration! < result.wasm?.duration!
                ? `WASM slower by ${result.wasm?.duration! - result.js?.duration!} ms`
                : `WASM  ${result.js?.duration! - result.wasm?.duration!} ms faster`
            }}</n-text
          >
        </div>
      </div>
    </n-card>
  </n-layout>
</template>

<style scoped lang="scss">
.example {
  .runner {
    display: flex;
    justify-content: start;
    .result {
      margin-left: 20px;
      display: flex;
      align-items: center;
      span {
        font-size: 1.2rem;
        margin: 0 10px;
      }
    }
    button {
      margin-left: 15px;
    }
  }
}
</style>
