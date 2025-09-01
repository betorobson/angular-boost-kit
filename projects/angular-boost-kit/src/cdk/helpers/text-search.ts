export function generateRegExp(keyword: string){
	return new RegExp(
		keyword
			.toLowerCase()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		// escape any meta regexp char
			.replace(/([\\*()\u005B\u005D{}.?|+^$])/g, '\\$1'),
		'i'
	);
};

export function regExpTest(regExp: RegExp, text: string){
	return regExp.test(
		text
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
	);
};

export function stringCanonicalDecomposition(text: string = '') {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
}

export function FilterData<T = any>(
	keyword: string,
	data: any[],
	searchInKey: keyof T | ((item: T) => string),
	customSearch: ((item: T, keywordRegexp: RegExp) => boolean) = null,
){

	const regexp = generateRegExp(keyword);

	if(typeof searchInKey === 'function'){
		return data.filter(item =>
			regExpTest(
				regexp, searchInKey(item)
			) && (customSearch ? customSearch(item, regexp) : true)
		);
	}else{
		return data.filter(item =>
			(
				searchInKey
					? regExpTest(regexp, String(item[searchInKey]))
					: true
			)
			&&
			(customSearch ? customSearch(item, regexp) : true)
		);
	}

};
