<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="close"
      >
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-black/40" />

        <!-- 弹窗内容 -->
        <div
          class="relative z-10 w-full max-w-sm bg-[#FBFBF9] border-2 border-[#1C293C] shadow-[6px_6px_0px_#1C293C] p-6"
        >
          <!-- 关闭按钮 -->
          <button
            class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-[#1C293C] font-bold border-2 border-[#1C293C] bg-white shadow-[2px_2px_0px_#1C293C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C293C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            @click="close"
          >
            x
          </button>

          <!-- 标题 -->
          <h3 class="text-lg font-bold text-[#1C293C] mb-6 pr-8">
            导出笔记
          </h3>

          <!-- 选项按钮 -->
          <div class="flex flex-col gap-3">
            <button
              class="w-full px-4 py-3 text-sm font-bold text-[#1C293C] bg-white border-2 border-[#1C293C] shadow-[4px_4px_0px_#1C293C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#1C293C] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all text-left flex items-center gap-3"
              @click="onExportMd"
            >
              <span class="inline-block w-6 h-6 bg-[#FDC800] border-2 border-[#1C293C] flex items-center justify-center text-xs font-bold">
                M
              </span>
              导出 Markdown
            </button>

            <button
              class="w-full px-4 py-3 text-sm font-bold text-[#1C293C] bg-white border-2 border-[#1C293C] shadow-[4px_4px_0px_#1C293C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#1C293C] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all text-left flex items-center gap-3"
              @click="onExportPdf"
            >
              <span class="inline-block w-6 h-6 bg-[#432DD7] text-white border-2 border-[#1C293C] flex items-center justify-center text-xs font-bold">
                P
              </span>
              导出 PDF
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'export-md'): void
  (e: 'export-pdf'): void
}>()

function close() {
  emit('update:visible', false)
}

function onExportMd() {
  emit('export-md')
  close()
}

function onExportPdf() {
  emit('export-pdf')
  close()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
