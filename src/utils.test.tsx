import { flatten, unflatten } from "./util";

describe("Work with keycloak attributes that contain '.'", () => {
  it("Flatten object", () => {
    const given = { some: { nested: { attributes: "value" } } };

    const result = flatten(given);

    expect(result).toStrictEqual({ "some.nested.attributes": "value" });
  });

  it("should unflatten", () => {
    const given = { "some.keycloak.attribute": "with-value" };

    const result = unflatten(given);

    expect(result).toStrictEqual({
      some: { keycloak: { attribute: "with-value" } },
    });
  });
});
