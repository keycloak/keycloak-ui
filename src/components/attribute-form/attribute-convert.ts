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

export const attributesToArray = (
  attributes: Record<string, string[]> = {}
): KeyValueType[] => {
  const result = Object.entries(attributes).flatMap(([key, value]) =>
    value.map<KeyValueType>((value) => ({ key, value }))
  );

  return result.concat({ key: "", value: "" });
};
