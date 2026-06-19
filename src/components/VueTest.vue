<script setup lang="ts">
defineProps<{
	message?: string;
}>();
</script>

<template>
	<div class="rounded-lg border border-mx-green/40 bg-surface-raised px-4 py-3">
		<p class="text-sm font-medium text-mx-green">Vue</p>
		<p class="text-xs text-slate-400">{{ message ?? 'Integración activa' }}</p>
	</div>
</template>
