export function appSetInterval(
	callback: (...args: any[]) => void,
	delay?: number,
	...args: any[]
): NodeJS.Timeout | undefined {
	const isPlatformBrowser = !!window.navigator;
	if (isPlatformBrowser) {
		return setInterval(callback, delay, ...args);
	}

	callback(...args);
	return undefined;
}
