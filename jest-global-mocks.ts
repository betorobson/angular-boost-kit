// import WorkerBaseListener from "src/app/helpers/worker-base/__mocks__/worker.base.listeners";

Object.defineProperty(document, 'doctype', {
	value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'getComputedStyle', {
	value: () => {
		return {
			display: 'none',
			appearance: ['-webkit-appearance'],
		};
	},
});
/**
* ISSUE: https://github.com/angular/material2/issues/7101
* Workaround for JSDOM missing transform property
*/
Object.defineProperty(document.body.style, 'transform', {
	value: () => {
		return {
			enumerable: true,
			configurable: true,
		};
	},
});

// export class Worker {
// 	url: string;
// 	onmessage: (msg: any) => void;
// 	workerBaseListener: WorkerBaseListener;
// 	constructor(workerBaseListener: WorkerBaseListener) {
// 		this.workerBaseListener = workerBaseListener;
// 		this.workerBaseListener.onmessage = msg => {
// 			this.onmessage(msg)
// 		};
// 		// this.url = stringUrl;
// 		this.onmessage = (msg) => {};
// 	}
// 	postMessage(msg: any) {
// 		this.workerBaseListener.mockOnMessageListener(msg)
// 	}
// 	terminate(){}
// }

// Object.defineProperty(window, 'Worker', {
// 	writable: true,
// 	value: Worker
// });
