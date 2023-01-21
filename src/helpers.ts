// shamelessly borrowed from https://stackoverflow.com/questions/53387838/how-to-ensure-an-arrays-values-the-keys-of-a-typescript-interface/53395649#53395649
export type Invalid<T> = ['Needs to be all of', T]
export const arrayOfAll = <T>() => <U extends T[]>(
  ...array: U & ([T] extends [U[number]] ? unknown : Invalid<T>[])
) => array;