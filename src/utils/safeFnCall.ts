
export type safeResultType<T, E> = {
    result : T | null,
    error : E |null
}

export const safeFnCallSync = <T, E extends Error>(fn : ()=> void) : safeResultType<T,E> => {

    try {
       const result = fn();
       return {
        result : result as T,
        error : null
       }
    } catch (error) {
        return {
            result : null,
            error : error as E
        }
    }
} 

