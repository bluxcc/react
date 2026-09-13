import {
  useReadContracts,
  useWriteContract,
  type ReadContractsHookResult,
  type WriteContractHookResult,
} from '../dist';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type ReadHook = ReturnType<typeof useReadContracts<[string, number | null]>>;
type ReadData = NonNullable<ReadHook['data']>;
type ReadValues = ReadData['values'];

type ReadResultAliasIsGeneric = Expect<
  Equal<
    ReadContractsHookResult<[string, number | null]>['values'],
    [string, number | null]
  >
>;
type ReadHookTupleIsPreserved = Expect<
  Equal<ReadValues, [string, number | null]>
>;

type WriteHook = ReturnType<typeof useWriteContract<bigint>>;
type WriteData = NonNullable<WriteHook['data']>;
type WriteReturn = Awaited<ReturnType<WriteData['returnValue']>>;

type WriteResultAliasIsGeneric = Expect<
  Equal<
    Awaited<ReturnType<WriteContractHookResult<bigint>['returnValue']>>,
    bigint | null
  >
>;
type WriteHookReturnIsGenericAndNullable = Expect<
  Equal<WriteReturn, bigint | null>
>;

export type ContractHookTypeAssertions =
  | ReadResultAliasIsGeneric
  | ReadHookTupleIsPreserved
  | WriteResultAliasIsGeneric
  | WriteHookReturnIsGenericAndNullable;
