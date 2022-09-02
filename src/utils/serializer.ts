export const toSQLArray = (arr: string[]) => `('${arr.join("', '")}')`;
