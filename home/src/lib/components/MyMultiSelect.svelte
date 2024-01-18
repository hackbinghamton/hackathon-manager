<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import { twMerge } from 'tailwind-merge';
	import { Input, Button } from 'flowbite-svelte';
	import type { FormSizeType, SelectOptionType } from 'flowbite-svelte';

	export let items: SelectOptionType<any>[] = [];
	export let value: (string)[] = [];
	export let size: FormSizeType = 'md';
	export let dropdownClass: string = '';

	let selectItems: SelectOptionType<any>[] = items.filter((x) => value.includes(x.value));
	let show: boolean = false;
	let customOptionText = '';

	const sizes = {
		sm: 'px-2 py-1 min-h-[2.4rem]',
		md: 'px-3 py-1 min-h-[2.7rem]',
		lg: 'px-4 py-2 min-h-[3.2rem]'
	};

	// Container
	const multiSelectClass: string =
		'relative border border-gray-300 flex items-center rounded-lg gap-2 dark:border-gray-600 focus-within:ring-1 focus-within:border-primary-500 ring-primary-500 dark:focus-within:border-primary-500 dark:ring-primary-500';

	// Dropdown
	let multiSelectDropdown: string;
	$: multiSelectDropdown = twMerge(
		'absolute z-50 p-3 flex flex-col gap-0 max-h-92 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 start-0 top-[calc(100%+0.5rem)] rounded-lg cursor-pointer overflow-y-scroll w-full',
		dropdownClass
	);

	// Items
	const commonItemsClass: string = 'py-1.5 px-3';
	const itemsClass: string =
		'rounded-lg text-gray-600 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-600';
	// Selected items
	const itemsSelectClass: string =
		'bg-gray-100 text-black hover:text-black dark:text-white dark:bg-gray-600 dark:hover:text-white';

	const selectOption = (select: SelectOptionType<any>) => {
		if (value.includes(select.value)) {
			clearThisOption(select);
		} else {
			if (!value.includes(select.value)) value = [...value, select.value];
		}
	};

	const addCustomOption = () => {
		if (!customOptionText) {
			return;
		}
		let customOption = items.find((option) => option.name == customOptionText);
		if (!customOption) {
			customOption = { name: customOptionText, value: customOptionText };
			items = [...items, customOption];
		}
		selectOption(customOption);
		customOptionText = '';
	};

	const clearThisOption = (select: SelectOptionType<any>) => {
		if (value.includes(select.value)) {
			value = value.filter((o) => o !== select.value);
		}
	};

	function create_custom_event(
		type: string,
		detail: any,
		{ bubbles = false, cancelable = false } = {}
	) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	function init(node: HTMLSelectElement, value: any) {
		const inital = value; // hack for below
		return {
			update: (value: any) => {
				selectItems = items.filter((x) => value.includes(x.value));
				// avoid initial event emitting
				if (value !== inital) {
					node.dispatchEvent(create_custom_event('input', selectItems));
					node.dispatchEvent(create_custom_event('change', selectItems));
				}
			}
		};
	}
</script>

<!-- Hidden select for form submission -->
<!-- TODO: this is not keyboard-accessible :( -->
<select use:init={value} {...$$restProps} {value} hidden multiple on:change on:input>
	{#each items as { value, name }}
		<option {value}>{name}</option>
	{/each}
</select>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={() => (show = !show)}
	on:focusout={() => {
		// TODO: maybe figure out a better way to check whether we lost focus to a child?
		setTimeout(() => {
			// The first case is when we focus the input or button.
			// The second case is when we focus the input and then click to the right of the button.
			if (document.activeElement?.parentElement?.id != 'custom-option' && 
				document.activeElement?.id != 'multi-select') {
				show = false;
			}
		}, 0);
	}}
	tabindex="-1"
	role="listbox"
	id="multi-select"
	class={twMerge(multiSelectClass, sizes[size], $$props.class)}
>
	<span class="flex flex-wrap gap-2">
		{#if selectItems.length}
			{#each selectItems as item (item.name)}
				<slot {item} clear={() => clearThisOption(item)}>
					<Badge
						color="dark"
						large={size === 'lg'}
						dismissable
						params={{ duration: 100 }}
						on:close={() => clearThisOption(item)}
					>
						{item.name}
					</Badge>
				</slot>
			{/each}
		{/if}
	</span>
	<div class="ms-auto flex items-center gap-2">
		<div class="w-[1px] bg-gray-300 dark:bg-gray-600" />
		<svg
			class="ms-1 h-3 w-3 cursor-pointer text-gray-800 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 10 6"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d={show ? 'm1 5 4-4 4 4' : 'm9 1-4 4-4-4'}
			/>
		</svg>
	</div>

	{#if show}
		<div on:click|stopPropagation role="presentation" class={multiSelectDropdown}>
			{#each items as item (item.name)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={() => selectOption(item)}
					role="presentation"
					class={twMerge(commonItemsClass, itemsClass, selectItems.includes(item) && itemsSelectClass)}
				>
					{item.name}
				</div>
			{/each}
			<form on:submit|preventDefault={addCustomOption}>
				<div id="custom-option" class={twMerge(commonItemsClass, "flex gap-2")}>
					<Input
						class="max-w-80 py-2 focus:border-gray-300 focus:ring-0"
						bind:value={customOptionText}
					/>
					<Button type="submit" class="py-0">Add</Button>
				</div>
			</form>
		</div>
	{/if}
</div>

<!--
  @component
  [Go to docs](https://flowbite-svelte.com/)
  ## Props
  @prop export let items: SelectOptionType<any>[] = [];
  @prop export let value: (string | number)[] = [];
  @prop export let size: FormSizeType = 'md';
  @prop export let dropdownClass: string = '';
  -->
