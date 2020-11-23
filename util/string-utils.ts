import { deburr, toLower } from 'lodash';

export class StringUtils {
	/**
     * Not ideal, but couldn't find a better alternative 
     */
	public static areEqualIgnoringCase(first: string, second: string): boolean {
		const lowerDeburredFirst = toLower(deburr(first));
		const lowerDeburredSecond = toLower(deburr(second));
        
		return lowerDeburredFirst.localeCompare(lowerDeburredSecond) === 0;
	}   
}