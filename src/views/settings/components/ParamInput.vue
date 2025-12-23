<script setup lang="ts">
import { computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Plus, X } from 'lucide-vue-next'

// Self-reference for recursion
import ParamInput from './ParamInput.vue'

const props = defineProps<{
  schema: any
  modelValue: any
  label?: string
  depth?: number
}>()

const emit = defineEmits(['update:modelValue'])

const currentDepth = computed(() => props.depth ?? 0)

// -- HELPERS --

const onUpdate = (value: any) => {
  emit('update:modelValue', value)
}

// -- LIST HANDLERS --

const addListItem = () => {
  const newList = [...(Array.isArray(props.modelValue) ? props.modelValue : [])]
  // Determine default value for new item
  let newItem = null
  if (props.schema.item_schema?.type === 'object') {
    newItem = {}
    // Pre-fill defaults if available
    if (props.schema.item_schema.properties) {
       Object.entries(props.schema.item_schema.properties).forEach(([k, v]: [string, any]) => {
         if (v.default !== undefined) newItem[k] = v.default
       })
    }
  } else if (props.schema.item_schema?.type === 'string') {
    newItem = ''
  }
  newList.push(newItem)
  onUpdate(newList)
}

const removeListItem = (index: number) => {
  const newList = [...(props.modelValue || [])]
  newList.splice(index, 1)
  onUpdate(newList)
}

const updateListItem = (index: number, value: any) => {
  const newList = [...(props.modelValue || [])]
  newList[index] = value
  onUpdate(newList)
}

// -- OBJECT HANDLERS --

const updateObjectProp = (key: string, value: any) => {
  const newObj = { ...(props.modelValue || {}) }
  newObj[key] = value
  onUpdate(newObj)
}

const getPropValue = (key: string, propSchema: any) => {
  // If the value exists in the object, use it.
  // Otherwise, use the default from the schema.
  // We do NOT mutate the object here; we just compute what to show.
  if (props.modelValue && props.modelValue[key] !== undefined) {
    return props.modelValue[key]
  }
  return propSchema.default
}
</script>

<template>
  <div class="w-full space-y-2">
    <Label
      v-if="label"
      class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block"
    >
      {{ label }}
    </Label>

    <div v-if="schema.type === 'int' || schema.type === 'float'" class="flex items-center gap-4">
      <template v-if="schema.min_value !== undefined && schema.max_value !== undefined">
        <Slider
          :model-value="[Number(modelValue ?? schema.default)]"
          @update:model-value="(v) => onUpdate(v[0])"
          :min="schema.min_value"
          :max="schema.max_value"
          :step="schema.type === 'int' ? 1 : 0.01"
          class="flex-1"
        />
        <Input
          type="number"
          class="w-20 h-8 text-right font-mono bg-background"
          :model-value="modelValue ?? schema.default"
          @update:model-value="(v) => onUpdate(Number(v))"
        />
      </template>
      <Input
        v-else
        type="number"
        class="font-mono bg-background"
        :model-value="modelValue ?? schema.default"
        @update:model-value="(v) => onUpdate(Number(v))"
      />
    </div>

    <div v-else-if="schema.type === 'boolean'" class="flex items-center justify-between py-1">
      <span class="text-sm text-muted-foreground" v-if="!label">Enabled</span>
      <Switch :checked="modelValue ?? schema.default" @update:checked="(v) => onUpdate(v)" />
    </div>

    <div v-else-if="schema.type === 'enum'">
      <Select :model-value="modelValue ?? schema.default" @update:model-value="(v) => onUpdate(v)">
        <SelectTrigger class="bg-background h-8 text-sm">
          <SelectValue :placeholder="`Select...`" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in schema.str_values" :key="opt" :value="opt">
            {{ opt }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-else-if="schema.type === 'string'">
      <Input
        type="text"
        class="bg-background h-8"
        :model-value="modelValue ?? schema.default"
        @update:model-value="(v) => onUpdate(v)"
      />
    </div>

    <div v-else-if="schema.type === 'list'" class="space-y-3">
      <div
        v-if="schema.item_schema?.type === 'string'"
        class="border rounded-md p-2 bg-background min-h-15"
      >
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(item, idx) in (modelValue || [])"
            :key="idx"
            class="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
          >
            <span>{{ item }}</span>
            <button class="hover:text-destructive" @click="removeListItem(idx)">
              <X class="size-3" />
            </button>
          </div>
          <div class="flex-1 min-w-30 flex items-center gap-1">
            <Plus class="size-3 text-muted-foreground" />
            <input
              class="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/50"
              placeholder="Add item (Enter)..."
              @keydown.enter.prevent="(e) => {
                 const val = (e.target as HTMLInputElement).value.trim();
                 if(val) {
                   const list = [...(modelValue || [])];
                   list.push(val);
                   onUpdate(list);
                   (e.target as HTMLInputElement).value = '';
                 }
               }"
            />
          </div>
        </div>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="(item, idx) in (modelValue || [])"
          :key="idx"
          class="relative border rounded-lg p-3 bg-background/50"
        >
          <Button
            variant="ghost"
            size="icon"
            class="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
            @click="removeListItem(idx)"
          >
            <X class="size-3" />
          </Button>

          <ParamInput
            :schema="schema.item_schema"
            :model-value="item"
            :depth="currentDepth + 1"
            @update:model-value="(v) => updateListItem(idx, v)"
          />
        </div>
        <Button variant="outline" size="sm" class="w-full border-dashed" @click="addListItem">
          <Plus class="size-3 mr-2" /> Add Item
        </Button>
      </div>
    </div>

    <div v-else-if="schema.type === 'object'" class="space-y-3 pt-1">
      <div class="grid gap-4" :class="currentDepth > 0 ? 'pl-2 border-l-2 border-muted' : ''">
        <div v-for="(propSchema, propKey) in schema.properties" :key="propKey">
          <ParamInput
            :schema="propSchema"
            :label="String(propKey)"
            :model-value="getPropValue(String(propKey), propSchema)"
            :depth="currentDepth + 1"
            @update:model-value="(v) => updateObjectProp(String(propKey), v)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
