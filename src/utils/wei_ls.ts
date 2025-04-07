class Wei_ls {
	private ls: Storage;
	constructor() {
		this.ls = window.localStorage;
	}
	getFromLS(name: string) {
		let data = this.ls.getItem(name);
		if (data) {
			return JSON.parse(data);
		}
	}
	removeFromLS(name: string) {
		try {
			this.ls.removeItem(name);
		} catch (error) {
			console.log('removeFromLS failed', error);
		}
	}
	storeInLS<T = unknown>(name: string, item: T) {
		try {
			this.ls.setItem(name, JSON.stringify(item));
		} catch (error) {
			console.log('storeInLS failed', error);
		}
	}
}
const wei_ls = new Wei_ls();
export default wei_ls;
