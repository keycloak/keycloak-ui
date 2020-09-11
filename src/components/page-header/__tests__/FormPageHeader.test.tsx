import React, { useContext } from "react";
import { Button } from "@patternfly/react-core";
import { withTranslation } from "react-i18next";
import { render } from "@testing-library/react";

import { FormPageHeader } from "../FormPageHeader";
import { HelpContext, Help } from "../../help-enabler/HelpHeader";
import { mount } from "enzyme";

describe("<FormPageHeader />", () => {
  it("render", () => {
    const TestComponent = withTranslation()(FormPageHeader);
    const comp = render(<TestComponent titleKey="dummy" subKey="dummy" />);
    expect(comp.asFragment()).toMatchSnapshot();
  });

  it("with help disabled", () => {
    const ExampleFormPage = () => {
      const Example = withTranslation()(FormPageHeader);
      const { toggleHelp } = useContext(HelpContext);
      return (
        <>
          <Button onClick={() => toggleHelp()}>Toggle</Button>
          <Example titleKey="storybookTitle" subKey="storybookSubTitle" />
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
