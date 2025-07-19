import * as t from 'io-ts';

export const EmployeeT = t.type({
    id: t.string,
    name: t.string,
    age: t.number,
    affiliation: t.string,  //所属
    post: t.string,   //役職
    skills: t.array(t.string),  //スキル
});

export type Employee = t.TypeOf<typeof EmployeeT>;
