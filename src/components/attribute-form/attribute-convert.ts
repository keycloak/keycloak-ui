export type KeyValueType = { key: string; value: string };

export const arrayToAttributes = (attributeArray?: KeyValueType[]) => {
  const initValue: { [index: string]: string[] } = {};
  return (attributeArray || []).reduce((acc, attribute) => {
    if (attribute.key !== "") {
      acc[attribute.key] = [attribute.value];
    }
    return acc;
  }, initValue);
};

export const attributesToArray = (attributes?: {
  [key: string]: string[];
}): KeyValueType[] => {
  const initValue: KeyValueType[] = [];
  const result = Object.entries(attributes || []).reduce(
    (acc, [key, value]) =>
      acc.concat(
        value.map((v) => ({
          key: key,
          value: v,
        }))
      ),
    initValue
  );
  result.push({ key: "", value: "" });
  return result;
};
