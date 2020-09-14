import React, { useContext } from "react";
import { Button } from "@patternfly/react-core";
import { render } from "@testing-library/react";

import { FormPageHeader } from "../FormPageHeader";
import { HelpContext, Help } from "../../help-enabler/HelpHeader";
import { mount } from "enzyme";

describe("<FormPageHeader />", () => {
  it("render", () => {
    const comp = render(<FormPageHeader titleKey="dummy" subKey="dummy" />);
    expect(comp.asFragment()).toMatchSnapshot();
  });

  it("with help disabled", () => {
    const ExampleFormPage = () => {
      const { toggleHelp } = useContext(HelpContext);
      return (
        <>
          <Button onClick={() => toggleHelp()}>Toggle</Button>
          <FormPageHeader
            titleKey="storybookTitle"
            subKey="storybookSubTitle"
          />
        </>
      );
    };

    const wrapper = mount(
      <Help>
        <ExampleFormPage />
      </Help>
    );
    const button = wrapper.find("button");
    expect(button).not.toBeNull();
    expect(wrapper.text()).toEqual("TogglestorybookTitlestorybookSubTitle");

    button.simulate("click");
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toEqual("TogglestorybookTitle");
  });
});
