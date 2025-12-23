import { defineStore } from 'pinia'
import { ref } from 'vue'
import { client } from '@/api/client'

export type ParameterDoc = {
  label: string
  short_info: string
  detailed_info: string
}

export const useSettingsStore = defineStore('settings', () => {
  const parameterDocs = ref<Record<string, ParameterDoc>>({})
  const isLoadingDocs = ref(false)
  const hasLoadedDocs = ref(false)

  const fetchParameterDocs = async () => {
    if (hasLoadedDocs.value || isLoadingDocs.value) return

    isLoadingDocs.value = true
    try {
      const { data, error } = await client.GET('/api/model-families/parameter-docs')
      if (error) throw error
      
      if (data) {
        parameterDocs.value = data as Record<string, ParameterDoc>
        hasLoadedDocs.value = true
      }
    } catch (error) {
      console.error('Failed to load parameter docs', error)
    } finally {
      isLoadingDocs.value = false
    }
  }

  return {
    parameterDocs,
    isLoadingDocs,
    hasLoadedDocs,
    fetchParameterDocs
  }
})
