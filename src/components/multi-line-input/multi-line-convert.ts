export function stringToMultiline(value?: string): string[] {
  return value?.includes("##") ? value.split("##") : [];
}

export function toStringValue(formValue?: string[]): string {
  return formValue && Array.isArray(formValue)
    ? formValue.join("##")
    : formValue || "";
}

export function convertMultivaluedString(
  config: { [index: string]: string } | undefined,
  properties: { name?: string; type?: string }[],
  converter: (v: any) => any
): { [index: string]: string } | undefined {
  const res = Object.assign({}, config || {});
  const keys = Object.keys(res);
  properties
    .filter((it) => it.type === "MultivaluedString")
    .forEach((it) => {
      if (it.name && keys.includes(it.name)) {
        res[it.name] = converter(res[it.name]);
      }
    });
  return res;
}
