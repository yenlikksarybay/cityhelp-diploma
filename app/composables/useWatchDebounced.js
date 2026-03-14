export function useWatchDebounced(source, cb, options = {}) {
	const opts = typeof options === "number" ? { debounce: options } : options;
	const { debounce = 300, immediate = false, flush = "pre" } = opts;

	if (!isRef(source) && typeof source !== "function") {
		console.warn(
			"useWatchDebounced: source should be a ref or a getter function. " +
			"Pass the ref (search) or a getter (() => search.value) — not search.value."
		);
	}

	const watchSource = isRef(source) || typeof source === "function" ? source : () => source;

	let timeout = null;

	const stop = watch(
		watchSource,
		(newVal, oldVal, onCleanup) => {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}

			onCleanup(() => {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
			});

			timeout = setTimeout(() => {
				try {
					cb(newVal, oldVal);
				} catch (err) {
				}
				timeout = null;
			}, debounce);
		},
		{ immediate, flush }
	);

	return stop;
}
