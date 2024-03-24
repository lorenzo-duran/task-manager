/**
 * Using this type you can change a property of a type in TS
 * 
 * @example 
 * ```typescript
interface OriginalInterface {
  a: string;
  b: boolean;
  c: number;
}

type ModifiedType  = Modify<OriginalInterface , {
  a: number;
  b: number;
}>
// ModifiedType = { a: number; b: number; c: number; }
 * ```
 */
type Modify<T, R> = Omit<T, keyof R> & R;
