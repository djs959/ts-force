import { Omit } from '../types';
export type Operator = '=' | '!=' | '<=' | '>=' | '>' | '<' | 'LIKE';
export type ListOperator = 'IN' | 'NOT IN' | 'INCLUDES' | 'EXCLUDES';
export type LogicalOperator = 'AND' | 'OR';
export type PrimValue = string | number | boolean;
export type DateValue = Date;
export type ListValue = string[];
export type Value = PrimValue | DateValue | ListValue;
export type BaseCondition = {
    field: string;
    not?: boolean;
    formatter?: (d: Value) => string | string[];
};
export type PrimitiveConditionParams = {
    op?: Operator;
    val: PrimValue;
} & BaseCondition;
export type ListConditionParams = {
    op?: ListOperator;
    val: ListValue;
} & BaseCondition;
export type DateConditionParams = {
    op?: Operator;
    val: DateValue;
    dateOnly?: boolean;
} & BaseCondition;
export type SubQueryConditionParams = {
    op: ListOperator;
    subqry: string;
} & Omit<BaseCondition, 'formatter'>;
export type ConditionParams = PrimitiveConditionParams | SubQueryConditionParams | ListConditionParams | DateConditionParams;
export interface ConditionsList extends Array<Conditions> {
}
export type Conditions = ConditionParams | LogicalOperator | ConditionsList;
export interface ConditionalClause extends Array<Conditions> {
}
export declare function composeConditionalClause(where: ConditionalClause): string;
