import CommonPage from "../../../../CommonPage";

enum mapperType {
  FromPredefinedMappers = "From predefined mappers",
  ByConfiguration = "By configuration",
}

export default class DedicatedScopesMappersTab extends CommonPage {
  private addPredefinedMapperEmptyStateBtn =
    "add-predefined-mapper-empty-action";
  private configureNewMapperEmptyStateBtn =
    "configure-a-new-mapper-empty-action";

  public addMapperFromPredefinedMappers() {
    this.emptyState().checkIfExists(false);
    this.tableToolbarUtils()
      .addMapper()
      .clickDropdownMenuItem(mapperType.ByConfiguration);
    return this;
  }

  public addMapperByConfiguration() {
    this.emptyState().checkIfExists(false);
    this.tableToolbarUtils()
      .addMapper()
      .clickDropdownMenuItem(mapperType.FromPredefinedMappers);
    return this;
  }

  public addPredefinedMapper() {
    this.emptyState().checkIfExists(true);
    cy.findByTestId(this.addPredefinedMapperEmptyStateBtn).click({
      force: true,
    });
    return this;
  }

  public configureNewMapper() {
    this.emptyState().checkIfExists(true);
    cy.findByTestId(this.configureNewMapperEmptyStateBtn).click({
      force: true,
    });
    return this;
  }
}
