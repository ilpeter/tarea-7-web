<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { dispatchCryptoChanged } from '../lib/crypto-events';

export interface CryptoOption {
	id: string;
	name: string;
	symbol: string;
	image: string;
}

const props = defineProps<{
	cryptos: CryptoOption[];
}>();

const searchQuery = ref('');
const selectedIds = ref<string[]>(
	props.cryptos.slice(0, 3).map((crypto) => crypto.id),
);

const filteredCryptos = computed(() => {
	const query = searchQuery.value.trim().toLowerCase();
	if (!query) return props.cryptos;

	return props.cryptos.filter(
		(crypto) =>
			crypto.name.toLowerCase().includes(query) ||
			crypto.symbol.toLowerCase().includes(query),
	);
});

const selectedCryptos = computed(() =>
	props.cryptos.filter((crypto) => selectedIds.value.includes(crypto.id)),
);

function emitSelectionChange() {
	dispatchCryptoChanged(
		selectedCryptos.value.map(({ id, name, symbol, image }) => ({
			id,
			name,
			symbol,
			image,
		})),
	);
}

watch(selectedIds, emitSelectionChange, { deep: true });

onMounted(emitSelectionChange);

function isSelected(id: string) {
	return selectedIds.value.includes(id);
}

function toggleAllVisible() {
	const visibleIds = filteredCryptos.value.map((crypto) => crypto.id);
	const allVisibleSelected = visibleIds.every((id) => selectedIds.value.includes(id));

	if (allVisibleSelected) {
		selectedIds.value = selectedIds.value.filter((id) => !visibleIds.includes(id));
		return;
	}

	selectedIds.value = [...new Set([...selectedIds.value, ...visibleIds])];
}

function clearSelection() {
	selectedIds.value = [];
}
</script>

<template>
	<section
		class="rounded-xl border border-border bg-surface-raised p-5 sm:p-6"
		aria-labelledby="crypto-selector-heading"
	>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<h2 id="crypto-selector-heading" class="text-xl font-bold text-white">
					Monitorear criptomonedas
				</h2>
				<p class="mt-1 text-sm text-slate-400">
					Elige qué activos quieres seguir. La selección se actualiza al instante.
				</p>
			</div>
			<p class="text-sm font-medium tabular-nums text-mx-green">
				{{ selectedIds.length }} seleccionada(s)
			</p>
		</div>

		<div class="mt-5">
			<label for="crypto-search" class="sr-only">Buscar criptomoneda</label>
			<input
				id="crypto-search"
				v-model="searchQuery"
				type="search"
				placeholder="Buscar por nombre o símbolo…"
				class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-mx-green focus:outline-none focus:ring-2 focus:ring-mx-green/30"
			/>
		</div>

		<div class="mt-4 flex flex-wrap gap-2">
			<button
				type="button"
				class="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-us-blue hover:text-white"
				@click="toggleAllVisible"
			>
				{{ filteredCryptos.every((c) => isSelected(c.id)) ? 'Desmarcar visibles' : 'Marcar visibles' }}
			</button>
			<button
				type="button"
				class="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-ca-red hover:text-white"
				@click="clearSelection"
			>
				Limpiar selección
			</button>
		</div>

		<ul
			class="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1"
			role="group"
			aria-label="Lista de criptomonedas"
		>
			<li v-if="filteredCryptos.length === 0" class="rounded-lg bg-surface px-4 py-3 text-sm text-slate-400">
				No hay resultados para “{{ searchQuery }}”.
			</li>

			<li v-for="crypto in filteredCryptos" :key="crypto.id">
				<label
					class="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
					:class="
						isSelected(crypto.id)
							? 'border-mx-green/60 bg-mx-green/10'
							: 'border-border bg-surface hover:border-slate-600'
					"
				>
					<input
						v-model="selectedIds"
						type="checkbox"
						:value="crypto.id"
						class="h-4 w-4 rounded border-border bg-surface text-mx-green focus:ring-mx-green/40"
					/>
					<img
						:src="crypto.image"
						:alt="`Logo de ${crypto.name}`"
						width="32"
						height="32"
						class="h-8 w-8 rounded-full bg-surface object-cover"
					/>
					<span class="min-w-0 flex-1">
						<span class="block truncate text-sm font-medium text-white">{{ crypto.name }}</span>
						<span class="block text-xs uppercase tracking-wide text-slate-400">
							{{ crypto.symbol }}
						</span>
					</span>
					<span
						v-if="isSelected(crypto.id)"
						class="text-xs font-semibold uppercase tracking-wider text-mx-green"
					>
						Activa
					</span>
				</label>
			</li>
		</ul>

		<div v-if="selectedCryptos.length > 0" class="mt-5 border-t border-border pt-5">
			<p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
				Selección actual
			</p>
			<div class="mt-3 flex flex-wrap gap-2">
				<span
					v-for="crypto in selectedCryptos"
					:key="crypto.id"
					class="inline-flex items-center gap-2 rounded-full border border-mx-green/40 bg-mx-green/10 px-3 py-1 text-xs font-medium text-white"
				>
					<img
						:src="crypto.image"
						:alt="''"
						width="16"
						height="16"
						class="h-4 w-4 rounded-full"
					/>
					{{ crypto.name }}
					<span class="uppercase text-slate-400">{{ crypto.symbol }}</span>
				</span>
			</div>
		</div>

		<p v-else class="mt-5 border-t border-border pt-5 text-sm text-slate-500">
			Ninguna criptomoneda seleccionada.
		</p>
	</section>
</template>
