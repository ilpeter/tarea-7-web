<script lang="ts">
	let { message = 'Integración activa' }: { message?: string } = $props();
</script>

<div class="rounded-lg border border-us-blue/40 bg-surface-raised px-4 py-3">
	<p class="text-sm font-medium text-us-blue">Svelte</p>
	<p class="text-xs text-slate-400">{message}</p>
</div>
