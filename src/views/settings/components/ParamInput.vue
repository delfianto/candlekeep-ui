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
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-vue-next'

// Self-reference for recursion
import ParamInput from './ParamInput.vue'

const props = defineProps<{
  schema: any
  modelValue: any
  label?: string
  // 'horizontal' is for the [KEY] ... [VAL] layout (Compact group & Sliders in List)
  // 'vertical' is for full-width inputs (Complex, Textareas)
  layout?: 'horizontal' | 'vertical'
  depth?: number
}>()

const emit = defineEmits(['update:modelValue'])

const currentDepth = computed(() => props.depth ?? 0)

// -- HELPERS --

const onUpdate = (value: any) => {
  emit('update:modelValue', value)
}

// Detect if an enum is effectively a boolean toggle (e.g. "enabled"/"disabled")
const isSmartToggle = computed(() => {
  if (props.schema.type !== 'enum' || !props.schema.str_values) return false
  const values = props.schema.str_values.map((v: string) => v.toLowerCase())
  return values.includes('enabled') && values.includes('disabled') && values.length === 2
})

const smartToggleValue = computed({
  get: () => props.modelValue === 'enabled',
  set: (checked: boolean) => onUpdate(checked ? 'enabled' : 'disabled')
})

// -- LIST HANDLERS --

const addListItem = () => {
  const newList = [...(Array.isArray(props.modelValue) ? props.modelValue : [])]
  // Determine default value for new item
  let newItem: any = null
  if (props.schema.item_schema?.type === 'object') {
    newItem = {}
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
  if (props.modelValue && props.modelValue[key] !== undefined) {
    return props.modelValue[key]
  }
  return propSchema.default
}
</script>

<template>
  <div class="w-full text-sm">
    <div v-if="layout === 'horizontal'" class="flex items-center justify-end">
      <div v-if="isSmartToggle" class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground capitalize">{{ modelValue }}</span>
        <Switch v-model:checked="smartToggleValue" />
      </div>

      <Switch
        v-else-if="schema.type === 'boolean'"
        :checked="modelValue ?? schema.default"
        @update:checked="(v: boolean) => onUpdate(v)"
      />

      <div
        v-else-if="(schema.type === 'int' || schema.type === 'float') && schema.min_value !== undefined"
        class="flex items-center gap-3 w-77.5"
      >
        <Slider
          :model-value="[Number(modelValue ?? schema.default)]"
          @update:model-value="(v?: number[]) => v && onUpdate(v[0])"
          :min="schema.min_value"
          :max="schema.max_value"
          :step="schema.type === 'int' ? 1 : 0.01"
          class="flex-1"
        />
        <Input
          type="number"
          class="w-20 h-8 text-right font-mono bg-background/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          :model-value="modelValue ?? schema.default"
          @update:model-value="(v) => onUpdate(Number(v))"
        />
      </div>

      <Select
        v-else-if="schema.type === 'enum'"
        :model-value="modelValue ?? schema.default"
        @update:model-value="(v) => onUpdate(v)"
      >
        <SelectTrigger class="h-8 w-50 bg-background/50">
          <SelectValue placeholder="Select..." class="truncate" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in schema.str_values" :key="opt" :value="opt">
            {{ opt }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Input
        v-else-if="schema.type === 'int' || schema.type === 'float' || schema.type === 'string'"
        :type="schema.type === 'string' ? 'text' : 'number'"
        class="h-8 w-32.5 font-mono text-right bg-background/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        :model-value="modelValue ?? schema.default"
        @update:model-value="(v) => onUpdate(schema.type === 'string' ? v : Number(v))"
      />
    </div>

    <div v-else class="space-y-3 py-2">
      <Label
        v-if="label"
        class="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
      >
        {{ label }}
      </Label>

      <div
        v-if="(schema.type === 'int' || schema.type === 'float') && schema.min_value !== undefined"
        class="flex items-center gap-4"
      >
        <Slider
          :model-value="[Number(modelValue ?? schema.default)]"
          @update:model-value="(v?: number[]) => v && onUpdate(v[0])"
          :min="schema.min_value"
          :max="schema.max_value"
          :step="schema.type === 'int' ? 1 : 0.01"
          class="flex-1"
        />
        <Input
          type="number"
          class="h-8 text-right font-mono bg-background/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          :model-value="modelValue ?? schema.default"
          @update:model-value="(v) => onUpdate(Number(v))"
        />
      </div>

      <div v-else-if="schema.type === 'string'">
        <Textarea
          class="min-h-30 font-mono text-sm bg-background/50 resize-y"
          placeholder="Enter text..."
          :model-value="modelValue ?? schema.default"
          @update:model-value="(v) => onUpdate(v)"
        />
      </div>

      <div
        v-else-if="isSmartToggle"
        class="flex items-center justify-between border rounded-md p-3 bg-background/50"
      >
        <span class="text-sm">Status</span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground capitalize">{{ modelValue }}</span>
          <Switch v-model:checked="smartToggleValue" />
        </div>
      </div>

      <div v-else-if="schema.type === 'list'" class="space-y-2">
        <div
          v-if="schema.item_schema?.type === 'string'"
          class="border rounded-md p-2 bg-background/50 min-h-10 flex flex-wrap gap-2"
        >
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
          <input
            class="bg-transparent text-sm outline-none flex-1 min-w-20 placeholder:text-muted-foreground/50"
            placeholder="Add..."
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

        <div v-else class="space-y-2">
          <div
            v-for="(item, idx) in (modelValue || [])"
            :key="idx"
            class="relative border rounded-lg p-3 bg-background/30"
          >
            <Button
              variant="ghost"
              size="icon"
              class="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive z-10"
              @click="removeListItem(idx)"
            >
              <X class="size-3" />
            </Button>

            <ParamInput
              :schema="schema.item_schema"
              :model-value="item"
              :depth="currentDepth + 1"
              layout="vertical"
              @update:model-value="(v) => updateListItem(idx, v)"
            />
          </div>
          <Button variant="outline" size="sm" class="w-full border-dashed" @click="addListItem">
            <Plus class="size-3 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      <div v-else-if="schema.type === 'object'" class="space-y-2">
        <div v-for="(propSchema, propKey) in schema.properties" :key="propKey">
          <ParamInput
            :schema="propSchema"
            :label="String(propKey).replace(/_/g, ' ')"
            :model-value="getPropValue(String(propKey), propSchema)"
            :depth="currentDepth + 1"
            :layout="(propSchema.type === 'object' || propSchema.type === 'list' || propSchema.type === 'string' || (propSchema.min_value !== undefined)) ? 'vertical' : 'horizontal'"
            @update:model-value="(v) => updateObjectProp(String(propKey), v)"
          />
          <div
            class="h-px bg-border/50 my-1"
            v-if="propSchema.type !== 'object' && propSchema.type !== 'list'"
          ></div>
        </div>
      </div>

      <Input
        v-else
        :model-value="modelValue ?? schema.default"
        @update:model-value="(v) => onUpdate(v)"
        class="bg-background/50"
      />
    </div>
  </div>
</template>
